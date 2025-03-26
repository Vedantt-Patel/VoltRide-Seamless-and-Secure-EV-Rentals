const express = require('express');
const router = express.Router();
const { getUserBookings } = require('../controllers/userBooking');

// Get all bookings by user ID
router.get('/user-bookings/:userId', getUserBookings);

module.exports = router;
