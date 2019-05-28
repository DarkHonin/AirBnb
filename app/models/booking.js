const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({

 bookingDate: Date,
 confirmed: Boolean,
 rejected: Boolean,
 totalPrice: Number,
 listingName: String,
 requesterName: String,
 listingOwner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
 },
 listing: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Listing'
 },
 requester: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
 }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;