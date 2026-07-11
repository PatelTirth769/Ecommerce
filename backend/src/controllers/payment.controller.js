const crypto = require('crypto');
const razorpay = require('../config/razorpay.config');

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Amount is required and must be a number' });
    }

    const amountInPaisa = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaisa,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    console.log(`Creating Razorpay Order for amount: ${amount} INR (${amountInPaisa} Paisa)...`);
    const order = await razorpay.orders.create(options);
    console.log(`Razorpay Order created successfully: ${order.id}`);

    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const verifyPayment = (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: 'All payment parameters are required' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET || 'R31iM3MZyxPQdBtNmAPF4s9V')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log('-------------------------------------------');
      console.log('payment successfully');
      console.log(`Payment Details: Order ID = ${razorpay_order_id}, Payment ID = ${razorpay_payment_id}`);
      console.log('-------------------------------------------');
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      console.error('Payment verification failed: signature mismatch');
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error during signature verification:', error);
    res.status(500).json({ error: 'Internal Server Error during verification' });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
