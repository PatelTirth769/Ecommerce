const { db, bucket, admin } = require('../config/firebase.config');
const erpnextConfig = require('../config/erpnext.config');
const logger = require('../utils/logger');
const { paymentsCollection: getPaymentsCollection } = require('../utils/collections');

const quotationService = require('./erpnext/quotation.service');
const salesOrderService = require('./erpnext/salesOrder.service');
const salesInvoiceService = require('./erpnext/salesInvoice.service');
const paymentEntryService = require('./erpnext/paymentEntry.service');
const deliveryNoteService = require('./erpnext/deliveryNote.service');
const pdfService = require('./erpnext/pdf.service');
const erpnextClient = require('./erpnext/client');

const FieldValue = admin.firestore.FieldValue;
const paymentsCollection = getPaymentsCollection(db);

// This is a straight-line sequential orchestrator, not a queue/worker system -
// kept deliberately simple to match the rest of this backend's plain
// Express/controller/service style. It is safe to call concurrently for the
// same razorpay_order_id (from the client /complete call AND the webhook)
// because runErpnextSync() atomically claims the record before doing any work,
// and every ERPNext step is individually skip-guarded so a retry after a
// partial failure resumes instead of creating duplicate documents.

function docRef(razorpayOrderId) {
  return paymentsCollection.doc(razorpayOrderId);
}

async function appendEvent(razorpayOrderId, event) {
  await docRef(razorpayOrderId).collection('events').add({
    ...event,
    at: FieldValue.serverTimestamp()
  });
}

async function initPaymentRecord({ razorpayOrderId, amount, currency, buyerEmail, quotationName, shippingForm, items }) {
  await docRef(razorpayOrderId).set(
    {
      razorpay_order_id: razorpayOrderId,
      amount,
      currency,
      buyer_email: buyerEmail || null,
      quotation_name: quotationName || null,
      shipping_form: shippingForm || null,
      items: items || [],
      status: 'created',
      retry_count: 0,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
  await appendEvent(razorpayOrderId, { step: 'create_order', status: 'success', actor: 'client' });
}

async function markPaymentVerified({ razorpayOrderId, razorpayPaymentId, razorpaySignature, verifiedBy }) {
  const alreadyPast = await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef(razorpayOrderId));
    if (!snap.exists) {
      throw new Error(`No payment record found for razorpay_order_id=${razorpayOrderId}`);
    }
    const data = snap.data();
    if (['paid', 'erpnext_syncing', 'erpnext_synced', 'erpnext_sync_failed'].includes(data.status)) {
      return true;
    }
    tx.update(docRef(razorpayOrderId), {
      status: 'paid',
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      verification: { verified_at: FieldValue.serverTimestamp(), verified_by: verifiedBy },
      updated_at: FieldValue.serverTimestamp()
    });
    return false;
  });

  const verifyEvent = { step: 'verify_payment', status: 'success', actor: verifiedBy };
  if (alreadyPast) {
    verifyEvent.note = 'already verified';
  }
  await appendEvent(razorpayOrderId, verifyEvent);
  return { alreadyVerified: alreadyPast };
}

async function markPaymentVerificationFailed({ razorpayOrderId, reason }) {
  await docRef(razorpayOrderId).set(
    {
      status: 'verification_failed',
      error: { step: 'verify_payment', message: reason, at: FieldValue.serverTimestamp() },
      updated_at: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
  await appendEvent(razorpayOrderId, { step: 'verify_payment', status: 'failure', message: reason });
}

async function markPaymentFailed({ razorpayOrderId, reason }) {
  await docRef(razorpayOrderId).set(
    {
      status: 'payment_failed',
      error: { step: 'razorpay_payment', message: reason, at: FieldValue.serverTimestamp() },
      updated_at: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
  await appendEvent(razorpayOrderId, { step: 'razorpay_payment', status: 'failure', message: reason, actor: 'webhook' });
}

async function claimForSync(razorpayOrderId) {
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef(razorpayOrderId));
    if (!snap.exists) {
      throw new Error(`No payment record found for razorpay_order_id=${razorpayOrderId}`);
    }
    const data = snap.data();

    if (data.status === 'erpnext_syncing') {
      return { claimed: false, reason: 'sync already in progress', data };
    }
    if (data.status === 'erpnext_synced') {
      return { claimed: false, reason: 'already synced', data };
    }
    if (!['paid', 'erpnext_sync_failed'].includes(data.status)) {
      return { claimed: false, reason: `cannot sync from status "${data.status}"`, data };
    }

    tx.update(docRef(razorpayOrderId), { status: 'erpnext_syncing', updated_at: FieldValue.serverTimestamp() });
    return { claimed: true, data };
  });
}

async function recordStepSuccess(razorpayOrderId, field, value) {
  await docRef(razorpayOrderId).set(
    { erpnext: { [field]: value }, updated_at: FieldValue.serverTimestamp() },
    { merge: true }
  );
  await appendEvent(razorpayOrderId, { step: field, status: 'success', actor: 'sync' });
}

async function recordStepFailure(razorpayOrderId, step, error) {
  await docRef(razorpayOrderId).set(
    {
      status: 'erpnext_sync_failed',
      error: { step, message: error.response?.data?.exception || error.message, at: FieldValue.serverTimestamp() },
      retry_count: FieldValue.increment(1),
      updated_at: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
  await appendEvent(razorpayOrderId, { step, status: 'failure', message: error.message, actor: 'sync' });
}

async function runErpnextSync(razorpayOrderId) {
  const claim = await claimForSync(razorpayOrderId);
  if (!claim.claimed) {
    logger.info(`Skipping ERPNext sync for ${razorpayOrderId}: ${claim.reason}`);
    return { skipped: true, reason: claim.reason, erpnext: claim.data.erpnext };
  }

  const payment = claim.data;
  const erpnext = { ...(payment.erpnext || {}) };

  logger.info(`[ERPNext sync] START for ${razorpayOrderId}`, { quotation_name: payment.quotation_name, buyer_email: payment.buyer_email });

  try {
    // Step 1: resolve customer on the Quotation
    if (!erpnext.quotation?.resolved_at) {
      logger.info(`[ERPNext sync] Step 1/6: resolving Customer on Quotation ${payment.quotation_name}`);
      const { customerName } = await quotationService.ensureQuotationHasCustomer(
        payment.quotation_name,
        payment.buyer_email,
        payment.shipping_form
      );
      erpnext.quotation = { name: payment.quotation_name, party_name: customerName, resolved_at: new Date().toISOString() };
      await recordStepSuccess(razorpayOrderId, 'quotation', erpnext.quotation);
      logger.info(`[ERPNext sync] Step 1/6 DONE: Quotation linked to Customer "${customerName}"`);
    } else {
      logger.info('[ERPNext sync] Step 1/6 already done, skipping');
    }

    // Step 1b: submit the Quotation - quotation.make_sales_order refuses to
    // run on a Draft (docstatus=0). Idempotent (no-ops if already submitted).
    if (!erpnext.quotation?.submitted_at) {
      logger.info(`[ERPNext sync] Step 1b/6: submitting Quotation ${payment.quotation_name}`);
      await quotationService.submitQuotation(payment.quotation_name);
      erpnext.quotation = { ...erpnext.quotation, submitted_at: new Date().toISOString() };
      await recordStepSuccess(razorpayOrderId, 'quotation', erpnext.quotation);
      logger.info(`[ERPNext sync] Step 1b/6 DONE: Quotation ${payment.quotation_name} submitted`);
    } else {
      logger.info('[ERPNext sync] Step 1b/6 already done, skipping');
    }

    // Step 2: Sales Order
    if (!erpnext.sales_order?.name) {
      logger.info(`[ERPNext sync] Step 2/6: creating Sales Order from Quotation ${payment.quotation_name} (API: quotation.make_sales_order)`);
      const draft = await salesOrderService.createSalesOrderFromQuotation(payment.quotation_name);
      logger.info(`[ERPNext sync] Step 2/6: submitting Sales Order ${draft.name}`);
      const submitted = await salesOrderService.submitSalesOrder(draft);
      erpnext.sales_order = { name: submitted.name, submitted_at: new Date().toISOString() };
      await recordStepSuccess(razorpayOrderId, 'sales_order', erpnext.sales_order);
      logger.info(`[ERPNext sync] Step 2/6 DONE: Sales Order ${submitted.name} created + submitted`);
    } else {
      logger.info('[ERPNext sync] Step 2/6 already done, skipping', { sales_order: erpnext.sales_order.name });
    }

    // Step 3: Sales Invoice
    if (!erpnext.sales_invoice?.name) {
      logger.info(`[ERPNext sync] Step 3/6: creating Sales Invoice from Sales Order ${erpnext.sales_order.name} (API: sales_order.make_sales_invoice)`);
      const draft = await salesInvoiceService.createSalesInvoiceFromSalesOrder(erpnext.sales_order.name);
      logger.info(`[ERPNext sync] Step 3/6: submitting Sales Invoice ${draft.name}`);
      const submitted = await salesInvoiceService.submitSalesInvoice(draft);
      erpnext.sales_invoice = { name: submitted.name, submitted_at: new Date().toISOString(), grand_total: submitted.grand_total };
      await recordStepSuccess(razorpayOrderId, 'sales_invoice', erpnext.sales_invoice);
      logger.info(`[ERPNext sync] Step 3/6 DONE: Sales Invoice ${submitted.name} created + submitted (grand_total: ${submitted.grand_total})`);
    } else {
      logger.info('[ERPNext sync] Step 3/6 already done, skipping', { sales_invoice: erpnext.sales_invoice.name });
    }

    // Step 4: Payment Entry
    if (!erpnext.payment_entry?.name) {
      logger.info(`[ERPNext sync] Step 4/6: creating Payment Entry from Sales Invoice ${erpnext.sales_invoice.name} (API: payment_entry.get_payment_entry)`);
      const draft = await paymentEntryService.createPaymentEntryFromInvoice(erpnext.sales_invoice.name, {
        razorpayPaymentId: payment.razorpay_payment_id,
        paidOnDate: new Date().toISOString().slice(0, 10)
      });
      logger.info(`[ERPNext sync] Step 4/6: submitting Payment Entry ${draft.name}`);
      const submitted = await paymentEntryService.submitPaymentEntry(draft);
      erpnext.payment_entry = { name: submitted.name, submitted_at: new Date().toISOString() };
      await recordStepSuccess(razorpayOrderId, 'payment_entry', erpnext.payment_entry);
      logger.info(`[ERPNext sync] Step 4/6 DONE: Payment Entry ${submitted.name} created + submitted`);
    } else {
      logger.info('[ERPNext sync] Step 4/6 already done, skipping', { payment_entry: erpnext.payment_entry.name });
    }

    // Step 5 (optional): Delivery Note
    if (erpnextConfig.autoCreateDeliveryNote && !erpnext.delivery_note?.name) {
      logger.info(`[ERPNext sync] Step 5/6: creating Delivery Note from Sales Order ${erpnext.sales_order.name}`);
      const draft = await deliveryNoteService.createDeliveryNoteFromSalesOrder(erpnext.sales_order.name);
      const submitted = await deliveryNoteService.submitDeliveryNote(draft);
      erpnext.delivery_note = { name: submitted.name, submitted_at: new Date().toISOString() };
      await recordStepSuccess(razorpayOrderId, 'delivery_note', erpnext.delivery_note);
      logger.info(`[ERPNext sync] Step 5/6 DONE: Delivery Note ${submitted.name} created + submitted`);
    } else {
      logger.info('[ERPNext sync] Step 5/6 skipped (ERPNEXT_AUTO_CREATE_DELIVERY_NOTE is off or already done)');
    }

    // Step 6: fetch + store Sales Invoice PDF
    if (!payment.invoice_pdf?.storage_path) {
      logger.info(`[ERPNext sync] Step 6/8: downloading Sales Invoice PDF for ${erpnext.sales_invoice.name} and uploading to Firebase Storage`);
      const pdfBuffer = await pdfService.downloadSalesInvoicePdf(erpnext.sales_invoice.name);
      const storagePath = `invoices/${razorpayOrderId}/${erpnext.sales_invoice.name}.pdf`;
      await bucket.file(storagePath).save(pdfBuffer, { contentType: 'application/pdf' });
      await docRef(razorpayOrderId).set(
        { invoice_pdf: { storage_path: storagePath, generated_at: FieldValue.serverTimestamp() }, updated_at: FieldValue.serverTimestamp() },
        { merge: true }
      );
      await appendEvent(razorpayOrderId, { step: 'invoice_pdf', status: 'success', actor: 'sync' });
      logger.info(`[ERPNext sync] Step 6/8 DONE: invoice PDF stored at ${storagePath}`);
    } else {
      logger.info('[ERPNext sync] Step 6/8 already done, skipping');
    }

    // Step 7: fetch + store Payment Entry PDF
    if (!payment.payment_entry_pdf?.storage_path) {
      logger.info(`[ERPNext sync] Step 7/8: downloading Payment Entry PDF for ${erpnext.payment_entry.name} and uploading to Firebase Storage`);
      const pePdfBuffer = await pdfService.downloadPaymentEntryPdf(erpnext.payment_entry.name);
      const peStoragePath = `payment-entries/${razorpayOrderId}/${erpnext.payment_entry.name}.pdf`;
      await bucket.file(peStoragePath).save(pePdfBuffer, { contentType: 'application/pdf' });
      await docRef(razorpayOrderId).set(
        { payment_entry_pdf: { storage_path: peStoragePath, generated_at: FieldValue.serverTimestamp() }, updated_at: FieldValue.serverTimestamp() },
        { merge: true }
      );
      await appendEvent(razorpayOrderId, { step: 'payment_entry_pdf', status: 'success', actor: 'sync' });
      logger.info(`[ERPNext sync] Step 7/8 DONE: Payment Entry PDF stored at ${peStoragePath}`);
    } else {
      logger.info('[ERPNext sync] Step 7/8 already done, skipping');
    }

    // Step 8: refresh the Sales Order's real ERPNext status (Draft / To Deliver
    // and Bill / To Bill / To Deliver / Completed / etc) - this only settles to
    // its final value once the linked Sales Invoice + Payment Entry are submitted,
    // which is why it's read last, not right after the Sales Order itself is created.
    logger.info(`[ERPNext sync] Step 8/8: refreshing Sales Order ${erpnext.sales_order.name} status`);
    const refreshedOrder = await erpnextClient.getResource('Sales Order', erpnext.sales_order.name);
    erpnext.sales_order = { ...erpnext.sales_order, status: refreshedOrder.status };
    await recordStepSuccess(razorpayOrderId, 'sales_order', erpnext.sales_order);
    logger.info(`[ERPNext sync] Step 8/8 DONE: Sales Order status = "${refreshedOrder.status}"`);

    await docRef(razorpayOrderId).set({ status: 'erpnext_synced', updated_at: FieldValue.serverTimestamp() }, { merge: true });
    await appendEvent(razorpayOrderId, { step: 'erpnext_sync', status: 'success', actor: 'sync' });
    logger.info(`[ERPNext sync] COMPLETE for ${razorpayOrderId}`, {
      sales_order: erpnext.sales_order?.name,
      sales_invoice: erpnext.sales_invoice?.name,
      payment_entry: erpnext.payment_entry?.name
    });

    return { skipped: false, erpnext };
  } catch (error) {
    const failedStep = !erpnext.quotation?.resolved_at
      ? 'quotation'
      : !erpnext.quotation?.submitted_at
        ? 'quotation_submit'
        : !erpnext.sales_order?.name
          ? 'sales_order'
          : !erpnext.sales_invoice?.name
            ? 'sales_invoice'
            : !erpnext.payment_entry?.name
              ? 'payment_entry'
              : erpnextConfig.autoCreateDeliveryNote && !erpnext.delivery_note?.name
                ? 'delivery_note'
                : !payment.invoice_pdf?.storage_path
                  ? 'invoice_pdf'
                  : !payment.payment_entry_pdf?.storage_path
                    ? 'payment_entry_pdf'
                    : 'sales_order_status_refresh';

    await recordStepFailure(razorpayOrderId, failedStep, error);
    logger.error(`ERPNext sync failed for ${razorpayOrderId} at step ${failedStep}`, { message: error.message });
    throw error;
  }
}

async function retrySync(razorpayOrderId) {
  return runErpnextSync(razorpayOrderId);
}

async function getPaymentStatus(razorpayOrderId) {
  const snap = await docRef(razorpayOrderId).get();
  if (!snap.exists) {
    return null;
  }
  return snap.data();
}

module.exports = {
  initPaymentRecord,
  markPaymentVerified,
  markPaymentVerificationFailed,
  markPaymentFailed,
  runErpnextSync,
  retrySync,
  getPaymentStatus
};
