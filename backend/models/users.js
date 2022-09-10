const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: true },
  userType: { type: String, require: true },
  password: { type: String, required: true }
},
{
  timestamps: true
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
