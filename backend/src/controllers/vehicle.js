const Vehicle = require('../models/Vehicle');

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    console.log('Getting vehicle by ID:', req.params.id);

    const vehicle = await Vehicle.findById(req.params.id).populate('station');
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving vehicle' });
  }
};

module.exports = { getVehicleById };
