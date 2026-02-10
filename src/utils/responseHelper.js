const constants = require('./constants');

const createSuccessResponse = (data) => {
  return {
    is_success: true,
    official_email: constants.email,
    data,
  };
};

const createErrorResponse = (message, details = null) => {
  const response = {
    is_success: false,
    official_email: constants.email,
    message,
  };

  if (details) {
    response.details = details;
  }

  return response;
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
};
