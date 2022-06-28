const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const ownerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  },
  {
    timestamps: true,
  });
ownerSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Owner', ownerSchema);
