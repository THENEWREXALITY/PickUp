const express = require('express');
const { payFare, getHistory } = require('../controllers/transactionsController');
const router = express.Router();

router.post('/pay', payFare);
router.get('/history', getHistory);

module.exports = router;