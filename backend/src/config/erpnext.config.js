require('dotenv').config();

const erpnextConfig = {
  baseUrl: (process.env.ERPNEXT_BASE_URL || '').replace(/\/+$/, ''),
  apiKey: process.env.ERPNEXT_API_KEY,
  apiSecret: process.env.ERPNEXT_API_SECRET,
  modeOfPayment: process.env.ERPNEXT_MODE_OF_PAYMENT || 'Razorpay',
  autoCreateDeliveryNote: String(process.env.ERPNEXT_AUTO_CREATE_DELIVERY_NOTE).toLowerCase() === 'true'
};

if (!erpnextConfig.baseUrl || !erpnextConfig.apiKey || !erpnextConfig.apiSecret) {
  throw new Error('ERPNEXT_BASE_URL, ERPNEXT_API_KEY and ERPNEXT_API_SECRET must be set in the environment.');
}

module.exports = erpnextConfig;
