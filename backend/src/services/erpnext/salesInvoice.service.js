const client = require('./client');

async function createSalesInvoiceFromSalesOrder(salesOrderName) {
  const draft = await client.callGetMethod(
    'erpnext.selling.doctype.sales_order.sales_order.make_sales_invoice',
    { source_name: salesOrderName }
  );
  
  if (!draft.due_date) {
    draft.due_date = new Date().toISOString().slice(0, 10); // Default to today
  }
  
  return client.createResource('Sales Invoice', draft);
}

async function submitSalesInvoice(fullDoc) {
  return client.submitDoc(fullDoc);
}

module.exports = {
  createSalesInvoiceFromSalesOrder,
  submitSalesInvoice
};
