const responseHelper = require('../utils/responseHelper');

const notFoundHandler = (req, res, next) => {
  res.status(404).json(
    responseHelper.createErrorResponse(
      `Route ${req.method} ${req.originalUrl} not found`
    )
  );
};

const globalErrorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  const message = 'Internal server error';

  res.status(err.status || 500).json(
    responseHelper.createErrorResponse(message)
  );
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
