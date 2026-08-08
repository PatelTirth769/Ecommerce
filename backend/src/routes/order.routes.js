const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// POST / (create order) is superseded by POST /api/payment/complete, which is
// the single source of truth for online-payment order creation now that
// ERPNext sync exists. COD has its own dedicated endpoint below since there's
// no payment gateway step to split across two calls.
router.post('/cod', orderController.placeCodOrder);
router.get('/:email', orderController.getUserOrders);

module.exports = router;
