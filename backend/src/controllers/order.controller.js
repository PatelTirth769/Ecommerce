const dbService = require('../services/db.service');

const saveOrder = async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData || !orderData.email) {
      return res.status(400).json({ error: 'Valid order data with an email is required' });
    }

    const savedOrder = await dbService.saveOrder(orderData);
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save order' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    const orders = await dbService.getUserOrders(email);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

module.exports = {
  saveOrder,
  getUserOrders
};
