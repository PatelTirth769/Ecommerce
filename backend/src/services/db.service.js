const { db } = require('../config/firebase.config');
const { paymentsCollection } = require('../utils/collections');
const erpnextClient = require('./erpnext/client');
const logger = require('../utils/logger');

// The Sales Order's status (To Deliver and Bill / Completed / Cancelled / etc)
// is only known for certain by asking ERPNext live - anyone can change it
// directly in ERPNext (e.g. cancel it) after our sync already ran and cached
// a snapshot. Refreshing it here keeps the buyer's order history honest
// instead of showing a stale cached status.
async function refreshSalesOrderStatus(docSnapshot, data) {
  const salesOrder = data.erpnext?.sales_order;
  if (!salesOrder?.name) {
    return null;
  }

  try {
    const live = await erpnextClient.getResource('Sales Order', salesOrder.name);
    if (live.status && live.status !== salesOrder.status) {
      await docSnapshot.ref.set(
        { erpnext: { sales_order: { ...salesOrder, status: live.status } } },
        { merge: true }
      );
    }
    return live.status || salesOrder.status || null;
  } catch (error) {
    logger.warn(`Could not refresh live status for Sales Order ${salesOrder.name}`, { message: error.message });
    return salesOrder.status || null;
  }
}

async function getUserOrders(email) {
  const snapshot = await paymentsCollection(db).where('buyer_email', '==', email).get();

  const relevantDocs = snapshot.docs.filter((doc) => doc.data().status !== 'created');

  const orders = await Promise.all(
    relevantDocs.map(async (doc) => {
      const data = doc.data();
      const liveSalesOrderStatus = await refreshSalesOrderStatus(doc, data);

      return {
        razorpay_order_id: data.razorpay_order_id,
        status: data.status,
        payment_method: data.payment_method || 'online',
        amount: data.amount,
        currency: data.currency,
        items: data.items || [],
        sales_order_no: data.erpnext?.sales_order?.name || null,
        sales_order_status: liveSalesOrderStatus,
        sales_invoice_no: data.erpnext?.sales_invoice?.name || null,
        payment_entry_no: data.erpnext?.payment_entry?.name || null,
        invoice_pdf_available: !!data.invoice_pdf?.storage_path,
        payment_entry_pdf_available: !!data.payment_entry_pdf?.storage_path,
        created_at: data.created_at ? data.created_at.toDate().toISOString() : null
      };
    })
  );

  orders.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

  return orders;
}

module.exports = {
  getUserOrders
};
