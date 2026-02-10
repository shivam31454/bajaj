
const express = require('express');
const router = express.Router();
const { handlePostRequest, handleHealthCheck } = require('./controllers');

router.post('/bfhl', handlePostRequest);
router.get('/health', handleHealthCheck);

module.exports = router;
