const mongoose = require('mongoose');

const houseSchema = mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    imagePath: { type: String, required: true },
    description: { type: String, required: true },
    houseType: [{ type: String, required: true }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: true
  });
  
  module.exports = mongoose.model('House', houseSchema);
