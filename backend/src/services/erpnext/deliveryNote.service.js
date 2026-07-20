const client = require('./client');

async function createDeliveryNoteFromSalesOrder(salesOrderName) {
  const draft = await client.callGetMethod(
    'erpnext.selling.doctype.sales_order.sales_order.make_delivery_note',
    { source_name: salesOrderName }
  );
  return client.createResource('Delivery Note', draft);
}

async function submitDeliveryNote(fullDoc) {
  return client.submitDoc(fullDoc);
}

module.exports = {
  createDeliveryNoteFromSalesOrder,
  submitDeliveryNote
};
