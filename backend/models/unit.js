const mongoose = require('mongoose');

const unitSchema = mongoose.Schema({
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  unitDescription: { type: String, required: true },
  unitType: { type: String, required: true},
  isVacant: { type: Boolean, required: true, default: True },
  unitName: { type: String, required: true },
  unitPrice: { type: Number, required: true },
},
{
  timestamps: true
});

module.exports = mongoose.model('Unit', unitSchema);