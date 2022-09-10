const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  roomName: { type: String, required: true },
  roomType: { type: String, required: true},
  isVacant: { type: Boolean, default: true },
  roomFloor: { type: Number, required: true },
  roomPrice: { type: Number, required: true },
},
{
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);