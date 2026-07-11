require('dotenv').config();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY || 'rzp_live_mXMqD6Uq31IPNc',
  key_secret: process.env.RAZORPAY_SECRET || 'R31iM3MZyxPQdBtNmAPF4s9V'
});

module.exports = razorpay;
