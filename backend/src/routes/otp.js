const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/otp');
const { isAuthenticated } = require('../middleware/auth'); // Make sure path is correct

// Routes for sending and verifying OTP
router.post('/send', sendOTP);
router.post('/verify', verifyOTP);

module.exports = router; 