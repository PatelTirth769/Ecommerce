const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// POST / (create order) is superseded by POST /api/payment/complete, which is
// the single source of truth for order creation now that ERPNext sync exists.
router.get('/:email', orderController.getUserOrders);

module.exports = router;
