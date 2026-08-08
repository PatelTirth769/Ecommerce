const client = require('./client');

// NOTE: the "Sales24x7 Invoice" Print Format (Print Format Builder, doc_type
// Sales Invoice) has an empty format_data - it was created but its Items
// table columns were never configured in the builder. With no explicit
// column selection, Frappe falls back to dumping every field off the "Sales
// Invoice Item" child doctype (Stock UOM, Rate of Stock UOM, Grant
// Commission, Use Serial No / Batch Fields, etc.) into the description cell,
// which is why downloaded invoices showed that junk and spilled onto a
// second page. "Standard" is Frappe's built-in, properly field-curated
// format (Item Code / description / qty / rate / amount only) and renders
// correctly. Fix the columns in ERPNext's Print Format Builder for
// "Sales24x7 Invoice" if you want the custom-branded format back later.
async function downloadSalesInvoicePdf(salesInvoiceName) {
  return client.downloadPdf('Sales Invoice', salesInvoiceName, {
    format: 'Standard',
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
