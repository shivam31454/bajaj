const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * GET /health
 * Returns health status of the API
 */
router.get('/', healthController.getHealth);

module.exports = router;
