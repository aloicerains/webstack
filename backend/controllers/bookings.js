const Booking = require('../models/bookings');

exports.createBooking = (req, res) => {
    if (req.body === {}) {
      res.status(400).json({
        message: 'Bad request',
        status: false
      });
    }
  
    const booking = new Booking({
      houseId: req.body.houseId,
      room: req.body.room,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber
    });
  
  
    booking
      .save()
  
      .then(bookingData => {
        res.status(201).json({
          message: 'Booking added successfully',
          status: true
        });
      })
  
      .catch(error => {
        console.log(error.message);
        res.status(500).json({
          message: 'Booking failed!',
          status: false
        });
      });
};

exports.getBookingsByHouseId = (req, res) => {
    const houseId = req.params.id;

    if (!houseId) {
        res.status(400).json({
            message: 'Bad request',
            status: false
          });
    }

    Booking
        .find({
            houseId: houseId
        })
        .populate('room')
        .then(bookings => {
            return bookings.map(booking => {
                return {
                    id: booking._id,
                    name: booking.name,
                    phoneNumber: booking.phoneNumber,
                    roomName: booking.room.roomName,
                    houseId: booking.houseId
                };
            })
        })
        .then(updatedBooking => {
            res.status(200).json({
                message: 'Bookings retrieved successfully!',
                bookings: updatedBooking,
                status: true
            });
        })
        .catch(error => {
            console.log(error.message)
            res.status(500).json({
                message: "An error occured!",
                status: false
            });
        })

}

exports.deleteBooking = (req, res) => {
    Booking
  
      .deleteOne({
        _id: req.params.id,
      })
  
      .then(result => {
        if (result.deletedCount >= 1) {
          res.status(200).json({ 
            message: 'Deletion successful',
          status: true 
        });
        } else {
          res.status(401).json({
            message: 'Not Authorized',
            status: false
          });
        }
      })
  
      .catch(error => {
        console.log(error.message);
        res.status(500).json({
          message: 'Deleting booking failed!',
          status: false
        });
      });
  };