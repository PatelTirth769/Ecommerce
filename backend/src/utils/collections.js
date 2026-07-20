// Central place for the Firestore path buyer-portal payment records live at,
// so every service/controller references the exact same collection.
// Nested under ecommerce_system/metadata to match the existing project structure
// (the old order-logging code used ecommerce_system/metadata/orders the same way).
function paymentsCollection(db) {
  return db.collection('ecommerce_system').doc('metadata').collection('payments');
}

module.exports = { paymentsCollection };
