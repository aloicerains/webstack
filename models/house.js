const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const houseSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Owner',
	    required: true, autopopulate: true },
  place: { type: String, required: true},
  name: { type: String, required: true},
  image: { type: Schema.Types.ObjectId, ref: 'Image'},
  Lat: { type: Number },
  Long: Number,
  },
  {
    timestamps: true,
  });

houseSchema.plugin(uniqueValidator);
houseSchema.plugin(autopopulate);
module.exports = mongoose.model('House', houseSchema);
  
