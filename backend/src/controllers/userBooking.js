const Booking = require('../models/Booking'); // Import the Booking model

// Get All Bookings for a User
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Find all bookings for the given userId and populate vehicle details
    const bookings = await Booking.find({ user: userId }).populate('vehicle');

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'No bookings found for this user' });
    }

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
