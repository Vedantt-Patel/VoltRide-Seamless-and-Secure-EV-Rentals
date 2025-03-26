const express = require('express');
const router = express.Router();
const { getVehicleById } = require('../controllers/vehicle');

// GET vehicle by ID
router.get('/vehicle/:id', getVehicleById);

module.exports = router;
