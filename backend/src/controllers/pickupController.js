const Booking = require('../models/Booking'); // Import your Booking model

// Admin Pickup Controller
exports.adminPickup = async (req, res) => {
  try {
    const { pickupString } = req.body;

    const bookingId = pickupString

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is missing' });
    }

    const booking = await Booking.findById(bookingId).populate('vehicle user');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

exports.adminPickupConfirm = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is missing' });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = "active";
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
