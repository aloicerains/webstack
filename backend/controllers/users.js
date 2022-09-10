const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('../models/users');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          userType: req.body.userType,
          password: hash
        });
        user.save()
          .then(result => {
            res.status(201).json({
              message: "User created",
              result
            });
          })
          .catch(err => {
            res.status(500).json({
              message: "Invalid authentication credentials!"
            });
          });
      });
  }

exports.userLogin = (req, res, next) => {

  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(401).json({
          message: "Incorrect details!"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        res.status(401).json({
          message: "Incorrect details!"
        });
      }
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id,
        userType: fetchedUser.userType
      },
        process.env.JWT_KEY,
        { expiresIn: "1h"}
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id
        });
    })
    .catch((error)=> {
      console.log(error.message);
     /* res.status(401).json({
        message: "Invalid authentication credentials!"
      });*/
    });
}

exports.getUser = (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({
      message: 'Bad request',
      status: false
    });
  }

  User
    .findById(userId)
    .then(userData => {

      if (!userData) {
        res.status(404).json({
          message: 'user not found!',
          status: false
        });
      }

      const updatedUser = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        userType: userData.userType
      }
      res.status(200).json({
        message: 'successfully retrieved user!',
        user: updatedUser,
        status: true
      })
    })
    .catch(error => {
      console.log(error.message);
      res.status(500).json({
        message: "An Error occured!",
        status: true
      });
    })
}