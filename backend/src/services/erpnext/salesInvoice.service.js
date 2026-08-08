const client = require('./client');

// extraFields lets callers stamp the custom payment_method/payment_status/
// payment_gateway/payment_transaction_id/cod_amount/payment_date fields onto
// the Sales Invoice at creation time - the make_sales_invoice mapper carries
// these over from the Sales Order automatically for most fields, but not
// custom ones, so the COD flow passes them explicitly (see
// paymentOrchestration.service.js).
async function createSalesInvoiceFromSalesOrder(salesOrderName, extraFields = {}) {
  const draft = await client.callGetMethod(
    'erpnext.selling.doctype.sales_order.sales_order.make_sales_invoice',
    { source_name: salesOrderName }
  );

  if (draft) {
    if (!draft.due_date) {
      draft.due_date = new Date().toISOString().slice(0, 10); // Default to today
    }
    draft.letter_head = 'Sales24x7 Letter Head';
  }

  return client.createResource('Sales Invoice', { ...draft, ...extraFields });
}

async function submitSalesInvoice(fullDoc) {
  return client.submitDoc(fullDoc);
}

module.exports = {
  createSalesInvoiceFromSalesOrder,
  submitSalesInvoice
};
