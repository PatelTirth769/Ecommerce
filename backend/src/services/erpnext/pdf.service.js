const client = require('./client');

async function downloadSalesInvoicePdf(salesInvoiceName) {
  return client.downloadPdf('Sales Invoice', salesInvoiceName, {
    settings: JSON.stringify({ compact_item_print: 1 })
  });
}

async function downloadPaymentEntryPdf(paymentEntryName) {
  return client.downloadPdf('Payment Entry', paymentEntryName, {
    options: JSON.stringify({ orientation: 'Landscape' })
  });
}

module.exports = {
  downloadSalesInvoicePdf,
  downloadPaymentEntryPdf
};
