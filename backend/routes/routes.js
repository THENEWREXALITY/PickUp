const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { createRoute, listRoutes, updateRoute, deleteRoute } = require('../controllers/routesController');
const router = express.Router();

router.get('/', listRoutes);
router.post('/', requireAdmin, createRoute);
router.put('/:id', requireAdmin, updateRoute);
router.delete('/:id', requireAdmin, deleteRoute);

module.exports = router;