const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true},
    houseId: { type: mongoose.Schema.Types.ObjectId, ref: "House", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }
  },
  {
    timestamps: true
  });
  
  module.exports = mongoose.model('Booking', bookingSchema);