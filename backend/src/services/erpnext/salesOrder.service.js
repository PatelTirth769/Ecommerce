const client = require('./client');

async function createSalesOrderFromQuotation(quotationName) {
  const draft = await client.callGetMethod(
    'erpnext.selling.doctype.quotation.quotation.make_sales_order',
    { source_name: quotationName }
  );
  return client.createResource('Sales Order', draft);
}

async function submitSalesOrder(fullDoc) {
  return client.submitDoc(fullDoc);
}

module.exports = {
  createSalesOrderFromQuotation,
  submitSalesOrder
};
