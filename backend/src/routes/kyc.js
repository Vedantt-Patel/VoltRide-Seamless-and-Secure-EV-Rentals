// routes/kycRoutes.js
const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth health check route (no auth middleware)
router.get('/auth-status', kycController.checkAuthStatus);

// Apply authentication middleware to protected routes
router.use(authMiddleware);

// KYC routes
router.post('/generate-otp', kycController.generateOTP);
router.post('/verify-otp', kycController.verifyOTP);

module.exports = router;