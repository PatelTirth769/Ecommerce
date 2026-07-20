const dbService = require('../services/db.service');

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

module.exports = {
  getUserOrders
};
