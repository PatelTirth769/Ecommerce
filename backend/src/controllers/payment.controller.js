const crypto = require('crypto');
const razorpay = require('../config/razorpay.config');
const { bucket } = require('../config/firebase.config');
const logger = require('../utils/logger');
const paymentOrchestration = require('../services/paymentOrchestration.service');

const INLINE_SYNC_TIMEOUT_MS = Number(process.env.PAYMENT_SYNC_INLINE_TIMEOUT_MS) || 12000;

function verifySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');

  const expected = Buffer.from(expectedSignature, 'utf8');
  const actual = Buffer.from(String(signature || ''), 'utf8');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), ms));
}

const createOrder = async (req, res, next) => {
  try {
    const { amount, buyer_email: buyerEmail, quotation_name: quotationName, shipping_form: shippingForm, items } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Amount is required and must be a number' });
    }

    const amountInPaisa = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaisa,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    logger.info('[1/6] POST /api/payment/create-order - creating Razorpay order', { amount, buyerEmail, quotationName });

    const order = await razorpay.orders.create(options);
    logger.info('[1/6] Razorpay order created', { razorpay_order_id: order.id, amount: order.amount, currency: order.currency });

    await paymentOrchestration.initPaymentRecord({
      razorpayOrderId: order.id,
      amount: Number(amount),
      currency: options.currency,
      buyerEmail,
      quotationName,
      shippingForm,
      items
    });
    logger.info('[1/6] Firestore payment record created', { razorpay_order_id: order.id, path: `payments/${order.id}` });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Deprecated: superseded by completePayment(), kept only for backward compatibility
// with any in-flight clients during rollout. Do not build new features on this.
const verifyPayment = (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: 'All payment parameters are required' });
    }

    if (verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    logger.error('Error during signature verification', { message: error.message });
    res.status(500).json({ error: 'Internal Server Error during verification' });
  }
};

// Authoritative client-driven completion path: verifies the payment, marks it
// verified, then runs (or resumes) the idempotent ERPNext sync inline, capped
// by a timeout. If the sync doesn't finish within the timeout it keeps
// running server-side regardless - the frontend falls back to polling
// GET /api/payment/status/:razorpay_order_id.
const completePayment = async (req, res, next) => {
  try {
    const { razorpay_payment_id: paymentId, razorpay_order_id: orderId, razorpay_signature: signature } = req.body;
    logger.info('[2/6] POST /api/payment/complete - verifying payment', { razorpay_order_id: orderId, razorpay_payment_id: paymentId });

    if (!paymentId || !orderId || !signature) {
      logger.warn('[2/6] Missing payment parameters in /complete request');
      return res.status(400).json({ error: 'All payment parameters are required' });
    }

    if (!verifySignature(orderId, paymentId, signature)) {
      logger.warn('[2/6] Signature verification FAILED - possible tampering or wrong secret', { razorpay_order_id: orderId });
      await paymentOrchestration.markPaymentVerificationFailed({ razorpayOrderId: orderId, reason: 'Signature mismatch' });
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
    logger.info('[2/6] Signature verified OK', { razorpay_order_id: orderId });

    await paymentOrchestration.markPaymentVerified({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      verifiedBy: 'client'
    });
    logger.info('[3/6] Firestore payment record marked "paid"', { razorpay_order_id: orderId });

    logger.info('[4/6] Starting ERPNext sync (Quotation -> Sales Order -> Sales Invoice -> Payment Entry)', { razorpay_order_id: orderId });
    const result = await Promise.race([
      paymentOrchestration.runErpnextSync(orderId).catch((err) => {
        logger.error('[4/6] ERPNext sync promise rejected', { stack: err.stack || err });
        return { syncError: err.message || err.toString(), stack: err.stack };
      }),
      timeout(INLINE_SYNC_TIMEOUT_MS)
    ]);

    if (result && result.timedOut) {
      logger.warn('[5/6] ERPNext sync did not finish within timeout - continuing in background', { razorpay_order_id: orderId, timeoutMs: INLINE_SYNC_TIMEOUT_MS });
      return res.json({ success: true, razorpay_order_id: orderId, syncStatus: 'erpnext_syncing' });
    }

    if (result && result.syncError) {
      logger.error('[5/6] ERPNext sync FAILED', { razorpay_order_id: orderId, message: result.syncError });
      return res.json({ success: true, razorpay_order_id: orderId, syncStatus: 'erpnext_sync_failed' });
    }

    logger.info('[6/6] ERPNext sync complete', { razorpay_order_id: orderId, erpnext: result.erpnext });
    return res.json({
      success: true,
      razorpay_order_id: orderId,
      syncStatus: result.skipped ? 'erpnext_synced' : 'erpnext_synced',
      erpnext: result.erpnext
    });
  } catch (error) {
    next(error);
  }
};

// Authoritative server-side trigger. Client-side verification alone is not
// reliable (the buyer can close the tab right after paying before the
// /complete call finishes) - the webhook guarantees ERPNext eventually gets
// synced regardless of what the browser does.
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body; // Buffer, thanks to rawBody middleware scoped to this route

    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
    const expectedBuf = Buffer.from(expected, 'utf8');
    const actualBuf = Buffer.from(String(signature || ''), 'utf8');

    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      logger.warn('Rejected webhook: signature mismatch');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const payload = JSON.parse(rawBody.toString('utf8'));
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    logger.info(`[Webhook] Received verified event: ${event}`, { razorpay_order_id: paymentEntity?.order_id, razorpay_payment_id: paymentEntity?.id });

    if (event === 'payment.captured' && paymentEntity) {
      res.status(200).json({ received: true });
      paymentOrchestration
        .markPaymentVerified({
          razorpayOrderId: paymentEntity.order_id,
          razorpayPaymentId: paymentEntity.id,
          razorpaySignature: null,
          verifiedBy: 'webhook'
        })
        .then(() => paymentOrchestration.runErpnextSync(paymentEntity.order_id))
        .catch((err) => logger.error('Webhook-triggered ERPNext sync failed', { message: err.message, orderId: paymentEntity.order_id }));
      return;
    }

    if (event === 'payment.failed' && paymentEntity) {
      res.status(200).json({ received: true });
      paymentOrchestration
        .markPaymentFailed({ razorpayOrderId: paymentEntity.order_id, reason: paymentEntity.error_description || 'Payment failed' })
        .catch((err) => logger.error('Failed to record payment.failed webhook', { message: err.message }));
      return;
    }

    return res.status(200).json({ received: true, ignored: true });
  } catch (error) {
    logger.error('Error handling Razorpay webhook', { message: error.message });
    return res.status(400).json({ error: 'Malformed webhook payload' });
  }
};

const getPaymentStatus = async (req, res, next) => {
  try {
    const status = await paymentOrchestration.getPaymentStatus(req.params.razorpay_order_id);
    if (!status) {
      return res.status(404).json({ error: 'No payment record found' });
    }
    res.json(status);
  } catch (error) {
    next(error);
  }
};

const streamInvoice = async (req, res, next) => {
  try {
    const status = await paymentOrchestration.getPaymentStatus(req.params.razorpay_order_id);
    const storagePath = status?.invoice_pdf?.storage_path;
    if (!storagePath) {
      return res.status(404).json({ error: 'Invoice not available yet' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    bucket
      .file(storagePath)
      .createReadStream()
      .on('error', (err) => next(err))
      .pipe(res);
  } catch (error) {
    next(error);
  }
};

const streamPaymentEntry = async (req, res, next) => {
  try {
    const status = await paymentOrchestration.getPaymentStatus(req.params.razorpay_order_id);
    const storagePath = status?.payment_entry_pdf?.storage_path;
    if (!storagePath) {
      return res.status(404).json({ error: 'Payment Entry PDF not available yet' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    bucket
      .file(storagePath)
      .createReadStream()
      .on('error', (err) => next(err))
      .pipe(res);
  } catch (error) {
    next(error);
  }
};

const retrySync = async (req, res, next) => {
  try {
    if (req.headers['x-admin-key'] !== process.env.ADMIN_RETRY_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const result = await paymentOrchestration.retrySync(req.params.razorpay_order_id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  completePayment,
  handleWebhook,
  getPaymentStatus,
  streamInvoice,
  streamPaymentEntry,
  retrySync
};
