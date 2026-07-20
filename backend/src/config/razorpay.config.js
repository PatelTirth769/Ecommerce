require('dotenv').config();
const Razorpay = require('razorpay');

if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
  throw new Error('RAZORPAY_KEY and RAZORPAY_SECRET must be set in the environment. Refusing to start with no configured credentials.');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

module.exports = razorpay;
