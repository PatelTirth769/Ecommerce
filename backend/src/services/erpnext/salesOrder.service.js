const client = require('./client');

// extraFields lets callers stamp the custom payment_method/payment_status/
// payment_gateway/payment_transaction_id/cod_amount/payment_date fields onto
// the Sales Order at creation time (see paymentOrchestration.service.js) -
// the make_sales_order mapper has no knowledge of how the order was paid for.
async function createSalesOrderFromQuotation(quotationName, extraFields = {}) {
  const draft = await client.callGetMethod(
    'erpnext.selling.doctype.quotation.quotation.make_sales_order',
    { source_name: quotationName }
  );
  return client.createResource('Sales Order', { ...draft, ...extraFields });
}

async function submitSalesOrder(fullDoc) {
  return client.submitDoc(fullDoc);
}

module.exports = {
  createSalesOrderFromQuotation,
  submitSalesOrder
};
