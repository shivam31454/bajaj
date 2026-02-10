const responseHelper = require('../utils/responseHelper');
const constants = require('../utils/constants');

const getHealth = (req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: constants.email,
  });
};

module.exports = {
  getHealth,
};
