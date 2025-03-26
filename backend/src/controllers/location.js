const Station = require('../models/Station');

// Helper function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Get nearby stations
exports.getNearbyStations = async (req, res) => {
  try {
    console.log('GET /nearby - Request received:', {
      query: req.query,
      headers: req.headers
    });

    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      console.log('GET /nearby - Missing coordinates');
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    // Convert string parameters to numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    console.log('GET /nearby - Searching for stations:', {
      latitude: lat,
      longitude: lon,
      radius
    });

    // Find stations within the approximate radius using MongoDB geospatial query
    const stations = await Station.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lon, lat], radius / 6371]
        }
      }
    }).populate('availableVehicles');

    console.log(`GET /nearby - Found ${stations.length} stations`);

    // Calculate exact distances and sort
    const stationsWithDistance = stations.map(station => {
      const distance = calculateDistance(
        lat,
        lon,
        station.location.coordinates[1],
        station.location.coordinates[0]
      );

      return {
        ...station.toObject(),
        distance: parseFloat(distance.toFixed(2))
      };
    });

    // Sort by distance
    const sortedStations = stationsWithDistance.sort((a, b) => a.distance - b.distance);

    console.log('GET /nearby - Response:', {
      count: sortedStations.length,
      stations: sortedStations.map(s => ({
        id: s._id,
        name: s.name,
        distance: s.distance,
        vehicleCount: s.availableVehicles?.length
      }))
    });

    res.status(200).json({
      success: true,
      count: sortedStations.length,
      data: sortedStations
    });
  } catch (error) {
    console.error('GET /nearby - Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby stations',
      error: error.message
    });
  }
};

// Get station details
exports.getStationDetails = async (req, res) => {
  try {
    console.log('GET /:id - Request received:', {
      params: req.params,
      headers: req.headers
    });

    const station = await Station.findById(req.params.id)
      .populate('availableVehicles');

    if (!station) {
      console.log(`GET /:id - Station not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    console.log('GET /:id - Found station:', {
      id: station._id,
      name: station.name,
      vehicleCount: station.availableVehicles?.length
    });

    res.status(200).json({
      success: true,
      data: station
    });
  } catch (error) {
    console.error('GET /:id - Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching station details',
      error: error.message
    });
  }
};

// Search stations by name or address
exports.searchStations = async (req, res) => {
  try {
    console.log('GET /search - Request received:', {
      query: req.query,
      headers: req.headers
    });

    const { name } = req.query;

    if (!name) {
      console.log('GET /search - Missing search term');
      return res.status(400).json({
        success: false,
        message: 'Please provide a search name'
      });
    }

    console.log(`GET /search - Searching for: "${name}"`);

    const stations = await Station.find({
      $or: [
        { name: { $regex: name, $options: 'i' } },
        { address: { $regex: name, $options: 'i' } }
      ]
    }).populate('availableVehicles');

    console.log('GET /search - Results:', {
      count: stations.length,
      stations: stations.map(s => ({
        id: s._id,
        name: s.name,
        vehicleCount: s.availableVehicles?.length
      }))
    });

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    console.error('GET /search - Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching stations',
      error: error.message
    });
  }
}; 