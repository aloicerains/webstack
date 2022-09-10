const Room = require('../models/rooms');

exports.createRoom = (req, res) => {
    if (req.body === {}) {
      res.status(400).json({
        message: 'Bad request',
        status: false
      });
    }
  
    const room = new Room({
      houseId: req.body.houseId,
      roomName: req.body.roomName,
      roomType: req.body.roomType,
      isVacant: req.body.isVacant,
      roomFloor: req.body.roomFloor,
      roomPrice: req.body.roomPrice,
    });
  
  
    room
      .save()
  
      .then(createdRoom => {
        res.status(201).json({
          message: 'Room added successfully',
          status: true
        });
      })
  
      .catch(error => {
        console.log(error.message);
        res.status(500).json({
          message: 'creating room failed!',
          status: false
        });
      });
};

exports.getRooms = (req, res) => {
    const houseId = req.query.houseId;

    if (!houseId) {
        res.status(400).json({
            message: 'Bad request',
            status: false
          });
    }

    Room
        .find({houseId: houseId})
        .then(roomData => {
            return roomData.map(room => {
                return {
                    id: room._id,
                    houseId: room.houseId,
                    roomName: room.roomName,
                    roomType: room.roomType,
                    isVacant: room.isVacant,
                    roomFloor: room.roomFloor,
                    roomPrice: room.roomPrice
                };
            });
        })
        .then(rooms => {
            res.status(200).json({
                message: 'rooms retrieved successfully!',
                rooms: rooms,
                status: true
            })
        })
        .catch(error => {
            console.log(error.message);
            res.status(500).json({
                message: "Error occured!",
                status: false
            });
        });
}

exports.getRoom = (req, res) => {
  const roomId = req.params.id;

  if (!roomId) {
    res.status(400).json({
      message: 'Bad request',
      status: false
    });
  }

  Room
    .findById(roomId)
    .then(room => {
      const updatedRoom = {
        id: room._id,
        houseId: room.houseId,
        roomName: room.roomName,
        roomType: room.roomType,
        isVacant: room.isVacant,
        roomFloor: room.roomFloor,
        roomPrice: room.roomPrice
      };
      res.status(200).json({
        room: updatedRoom,
        status: true
      });
    })
    .catch(error => {
      console.log(error.message);
      res.status(500).json({
        message: 'Error occured!',
        status: false
      });
    });
}

exports.updatedRoom = (req, res) => {
  const roomId = req.params.id;

  if (!roomId) {
    res.status(400).json({
      message: 'Bad request',
      status: false
    });
  }

  Room
    .updateOne({
      _id: roomId
    },
    req.body
    )
    .then(result => {
      if (result.matchedCount > 0) {
        res.status(200).json({ 
          message: 'Update successful',
          status: true
        });
      } else {
        res.status(404).json({
          message: 'Not Found',
          status: false
        });
      }
    })

    .catch(error => {
      console.error(error.message);
      res.status(500).json({
        message: "Couldn't update house!",
        stutus: false
      });
    });
}

exports.bookRoom = (req, res) => {
  const roomId = req.params.id;

  if (!roomId) {
    res.status(400).json({
      message: 'Bad request',
      status: false
    });
  }

  Room
    .updateOne({
      _id: roomId
    },
    req.body
    )
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ 
          message: 'Update successful',
          status: true
        });
      } else {
        res.status(404).json({
          message: 'Already booked!',
          status: false
        });
      }
    })

    .catch(error => {
      console.error(error.message);
      res.status(500).json({
        message: "Couldn't update house!",
        stutus: false
      });
    });
}

exports.deleteRoom = (req, res) => {
  const roomId = req.params.id;

  if (!roomId) {
    res.status(400).json({
      message: 'Bad request',
      status: false
    });
  }
  Room

    .deleteOne({
      _id: roomId
    })

    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ 
          message: 'Deletion successful',
          status: true });
      } else {
        res.status(401).json({
          message: 'Room not found',
          status: false
        });
      }
    })

    .catch(error => {
      console.log(error.message);
      res.status(500).json({
        message: 'Deleting image failed!',
        status: false
      });
    });
}