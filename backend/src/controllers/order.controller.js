const crypto = require('crypto');
const dbService = require('../services/db.service');
const paymentOrchestration = require('../services/paymentOrchestration.service');
const logger = require('../utils/logger');

const getUserOrders = async (req, res, next) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    const orders = await dbService.getUserOrders(email);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Cash on Delivery: no payment gateway involved, so this creates the Sales
// Order (via ERPNext sync) synchronously in a single request/response, unlike
// the online flow which is split across /create-order and /complete.
const placeCodOrder = async (req, res, next) => {
  try {
    const { amount, buyer_email: buyerEmail, quotation_name: quotationName, shipping_form: shippingForm, items } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Amount is required and must be a number' });
    }
    if (!quotationName) {
      return res.status(400).json({ error: 'quotation_name is required' });
    }

    const codOrderId = `cod_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    logger.info('[COD] POST /api/orders/cod - placing COD order', { codOrderId, amount, buyerEmail, quotationName });

    const result = await paymentOrchestration.createCodOrder({
      codOrderId,
      amount: Number(amount),
      buyerEmail,
      quotationName,
      shippingForm,
      items
    });

    res.json({ success: true, cod_order_id: codOrderId, erpnext: result.erpnext });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserOrders,
  placeCodOrder
};
