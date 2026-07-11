const { collection, addDoc, getDocs, query, where, orderBy, doc, setDoc } = require('firebase/firestore');
const { db } = require('../config/firebase.config');

const saveOrder = async (orderData) => {
  try {
    // Generate a unique order tracking ID by creating a new doc reference
    const ordersRef = collection(db, 'ecommerce_system/metadata/orders');
    const newOrderRef = doc(ordersRef);
    
    const finalOrder = {
      ...orderData,
      orderDocId: newOrderRef.id,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(newOrderRef, finalOrder);
    return finalOrder;
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    throw error;
  }
};

const getUserOrders = async (email) => {
  try {
    const ordersRef = collection(db, 'ecommerce_system/metadata/orders');
    const q = query(
      ordersRef,
      where('email', '==', email)
    );
    
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort orders by createdAt descending manually to avoid requiring a composite index in Firestore
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return orders;
  } catch (error) {
    console.error('Error fetching user orders from Firestore:', error);
    throw error;
  }
};

module.exports = {
  saveOrder,
  getUserOrders
};
