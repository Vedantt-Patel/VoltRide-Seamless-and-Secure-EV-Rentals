const express = require('express');
const router = express.Router();
const { adminPickup } = require('../controllers/pickupController');
const { adminPickupConfirm } = require('../controllers/pickupController');

// Admin pickup route
router.post('/admin-pickup', adminPickup);

// Admin pickup confirm route   
router.post('/admin-pickup-confirm', adminPickupConfirm);

module.exports = router;
