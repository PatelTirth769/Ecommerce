const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}`, { message: err.message });
  if (res.headersSent) {
    return;
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;
