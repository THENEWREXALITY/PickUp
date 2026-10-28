const express = require('express');
const { getSummary, getRecentTransactions, getDrivers } = require('../controllers/adminController');
const router = express.Router();

router.get('/summary', getSummary);
router.get('/transactions', getRecentTransactions);
router.get('/drivers', getDrivers);

module.exports = router;