const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.saveOrder);
router.get('/:email', orderController.getUserOrders);

module.exports = router;
