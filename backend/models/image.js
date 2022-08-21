const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  imageDescription: { type: String, required: true },
  imageUrl: { type: String, required: true },
},
{
  timestamps: true
});

module.exports = mongoose.model('Image', imageSchema`);