const express = require('express');
const {
  getNearbyStations,
  getStationDetails,
  searchStations
} = require('../controllers/location');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Uncomment these if you want to protect these routes with authentication
// router.get('/nearby', protect, getNearbyStations);
// router.get('/search', protect, searchStations);
// router.get('/:id', protect, getStationDetails);

// Using routes without authentication protection
router.get('/nearby', getNearbyStations);
router.get('/search', searchStations);
router.get('/:id', getStationDetails);

module.exports = router; 