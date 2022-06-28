const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const tenantSchema = new Schema({
  name: { type: String, required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true,
	  autopopulate: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
},
{
  timestamps: true
});
tenantSchema.plugin(uniqueValidator);
tenantSchema.plugin(autopopulate);
module.exports = mongoose.mode('Tenant', tenantSchema);
