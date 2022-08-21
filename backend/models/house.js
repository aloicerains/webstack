const mongoose = require('mongoose');

const houseSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  houseName: { type: String, required: true },
  houseType: { type: String, required: true, default: "apartment" },
  houseDescription: { type: String, required: true },
  contactPhone: { type: Number, required: true },
  contactEmail: { type: String, required: true },
  locationLat: { type: Number, required: true },
  locationLong: { type: Number, required: true }
},
{
  timestamps: true
});

module.exports = mongoose.model('House', userSchema);