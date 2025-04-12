const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: String,
  dropLocation: String,
  departureTime: Date,
  availableSeats: Number,
  vehicleDetails: {
    model: String,
    licensePlate: String,
  },
  preferences: {
    music: Boolean,
    smoking: Boolean,
    pets: Boolean
  },
  // riders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, default: 'available' },
  joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  approvedRiders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
