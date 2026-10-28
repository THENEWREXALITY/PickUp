const express = require('express');
const { topUp, getBalance } = require('../controllers/accountsController');
const router = express.Router();

router.post('/topup', topUp);
router.get('/balance', getBalance);

module.exports = router;