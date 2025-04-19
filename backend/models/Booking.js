const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['hotel', 'ride', 'event', 'luxury']
  },
  details: {
    // Hotel booking details
    hotelName: String,
    roomType: String,
    checkIn: Date,
    checkOut: Date,
    
    // Ride booking details
    rideType: {
      type: String,
      enum: ['cab', 'bike']
    },
    pickupLocation: String,
    dropLocation: String,
    rideDate: Date,
    
    // Event booking details
    eventType: String,
    eventDate: Date,
    guestCount: Number,
    venue: String,
    
    // Luxury rental details
    luxuryType: {
      type: String,
      enum: ['jet', 'helicopter', 'car', 'yacht']
    },
    rentalDuration: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: String
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
