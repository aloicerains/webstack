require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const houseRoutes = require('./routes/houses');
const userRoutes = require('./routes/users');
const imageRoutes = require('./routes/images');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');

const app = express();

mongoose.connect('mongodb+srv://zacchaeus:' + process.env.MONGO_ATLAS_PW + '@tek0.jjdvd.mongodb.net/house_look?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.error('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/houses", houseRoutes);
app.use("/api/user", userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;
