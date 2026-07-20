const client = require('./client');
const erpnextConfig = require('../../config/erpnext.config');

async function createPaymentEntryFromInvoice(salesInvoiceName, { razorpayPaymentId, paidOnDate }) {
  const draft = await client.callGetMethod(
    'erpnext.accounts.doctype.payment_entry.payment_entry.get_payment_entry',
    { dt: 'Sales Invoice', dn: salesInvoiceName }
  );

  draft.mode_of_payment = erpnextConfig.modeOfPayment;
  draft.reference_no = razorpayPaymentId;
  draft.reference_date = paidOnDate;

  return client.createResource('Payment Entry', draft);
}

async function submitPaymentEntry(fullDoc) {
  return client.submitDoc(fullDoc);
}

module.exports = {
  createPaymentEntryFromInvoice,
  submitPaymentEntry
};
