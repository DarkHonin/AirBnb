const mongoose = require('mongoose');

const listingSchema = mongoose.Schema({
  name: { type: String, required: true},
  description: { type: String, required: true},
  price: { type: Number, required: true},
  image: String,
  available: { type: Date, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
