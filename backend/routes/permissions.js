const express = require('express');
const { requireAdmin, requireDriver } = require('../middleware/auth');
const {
  requestPermission, getMyPermissions, getDriverSummary, getPending, decide,
} = require('../controllers/permissionsController');
const router = express.Router();

router.post('/', requireDriver, requestPermission);
router.get('/mine', requireDriver, getMyPermissions);
router.get('/summary', requireDriver, getDriverSummary);
router.get('/pending', requireAdmin, getPending);
router.put('/:id', requireAdmin, decide);

module.exports = router;