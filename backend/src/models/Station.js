const mongoose = require('mongoose');
const Vehicle = require('./Vehicle'); 

const StationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a station name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  availableVehicles: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Vehicle'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for location field
StationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Station', StationSchema); 