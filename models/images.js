const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const imageSchema = new Schema({
  house: { type: Schema.Types.ObjectId, ref: 'House',
	   required: true, autopopulate: true },
  desc: { type: String, required: true },
  img: { 
	  data: { type: Buffer, required: true},
	  contentType: { type: String, required: true},
  },
},
{
  timestamps: true,
});
imageSchema.plugin(autopopulate);
imageSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Image', imageSchema);


