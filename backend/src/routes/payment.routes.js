const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// NOTE: POST /webhook is intentionally NOT registered on this router - it
// needs the raw request body for HMAC verification and is registered
// directly on the app in server.js, ahead of the global express.json()
// parser that this router (and the rest of the app) relies on.

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment); // deprecated, see controller
router.post('/complete', paymentController.completePayment);
router.get('/status/:razorpay_order_id', paymentController.getPaymentStatus);
router.get('/invoice/:razorpay_order_id', paymentController.streamInvoice);
router.get('/payment-entry/:razorpay_order_id', paymentController.streamPaymentEntry);
router.post('/retry-sync/:razorpay_order_id', paymentController.retrySync);

module.exports = router;
