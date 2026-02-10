
const express = require('express');
const router = express.Router();
const { handlePostRequest, handleHealthCheck, handleGetRequest } = require('./controllers');

router.get('/bfhl', handleGetRequest);
router.post('/bfhl', handlePostRequest);
router.get('/health', handleHealthCheck);
router.post('/health', handleHealthCheck);
router.get('/', (req, res) => res.status(200).send("BFHL API Running"));

module.exports = router;
