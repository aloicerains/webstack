const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const roomSchema = new Schema({
  house: { type: Schema.Types.ObjectId, ref: 'House',
	   required: true, autopopulate: true},
  name: { type: String, required: true},
  vacancy: { type: Boolean, default: true },
  roomType: { type: String, 
	      enum: ['single', 'bedSitter', 'oneBedroom',
		      'twoBedroom', 'threeBedroom', 'fourBedroom'
	      ],
	    default: 'oneBedroom'
  },
  desc: { type: String },
},
{
  timestamps = true;
});
roomSchema.plugin(autopopulate);
module.exports = mongoose.model('Room', roomSchema);
