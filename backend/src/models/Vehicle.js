const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  numberPlate: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'UNAVAILABLE'],
    default: 'AVAILABLE'
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  chargingStatus: {
    level: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
  },
  damages: [{
    description: String,
    images: [String],
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  pricePerHour: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema); 