const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Owner = require('../models/owners');
const error = require('./error');

exports.postNew = async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;
  
  if (!firstName)
    await error.400(res, "Missing first name");

  if (!lastName)
    await error.400(res, "Missing last name");
  
  if (!phone)
    await error.400(res, "Missing phone number");

  if (!email)
    await error.400(res, "Missing email address");

  if (!password)
    await error.400(res, "Missing password");
  
  const user = await Owner.findOne({email}).exec();
  if (user) {
    await error.400(res, "User already exist");
  }

  const hash = await bcrypt.hash(password, 10);
  const owner = new Owner({
    firstName, lastName,
    phone, email,
    password: hash
  });
  try {
    const result = owner.save();
    res.status(201).json({message: `${result._id} successfull created`});
  } catch (err) {
    await error.400(res, 'Error while creating owner');
    return;
  }
}

exports.ownerLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email)
    error.400(res, "Missing email");

  if (!password)
    error.400(res, "Missing password");

  const owner = await Owner.findOne({email}).exec();
  if (!owner)
    error.400(res, "User not found");
  
  const validPass = bcrypt.compare(password, owner.password);
  if (!validPass) {
    error.400(res, "Incorrect password");
  }
  
  const token = await jwt.sign(
    { 
      email: owner.email,
      userId: owner._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '2h'
    }
  );
  res.status(200).json({
    ...owner, token,
  });
};
