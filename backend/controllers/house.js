const House = require('../models/house');

exports.getHouses = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const houseQuery = House.find();
  let fetchedHouses;

  if (pageSize && currentPage) {
    houseQuery
      .sort({ createdAt: 1 })

      .skip(pageSize * (currentPage - 1))

      .limit(pageSize);
  }

  houseQuery
    .then(documents => {
      fetchedHouses = documents;
      return House.countDocuments();
    })

    .then(count => {
      res.status(200).json(fetchedHouses);
    })

    .catch(error => {
      res.status(500).json({
        message: 'Fetching house failed!',
        status: false
      });
    });
};

exports.getHouse = (req, res, next) => {
  House
    .findById(req.params.id)

    .then(house => {
      if (house) {
        res.status(200).json(house);
      } else {
        res.status(404).json({
          message: 'House does not exist',
          status: false
        });
      }
    })

    .catch(error => {
      res.status(500).json({
        message: 'Fetching house failed!',
        status: false
      });
    });
};

exports.getHousesByOwnerId = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const housesQuery = House
    .aggregate()

    .lookup({
      from: 'users',
      localField: 'creator',
      foreignField: '_id',
      as: 'userDetails'
    })
    .match({ creator: new mongoose.Types.ObjectId(req.params.id) });;

  let fetchedHouses;

  if (pageSize && currentPage) {
    housesQuery
      .sort({ createdAt: 1 })

      .skip(pageSize * (currentPage - 1))

      .limit(pageSize);
  }

  housesQuery
    .then(documents => {
      fetchedHouses = documents;

      fetchedHouses.map(fetchedHouse => {
        fetchedUserDetails = fetchedHouse.userDetails[0]

        fetchedHouse.userDetails = {
          "_id": fetchedUserDetails._id,
          "firstName": fetchedUserDetails.firstName,
          "lastName": fetchedUserDetails.lastName,
          "phone": fetchedUserDetails.phone,
          "email": fetchedUserDetails.email,
          "userType": fetchedUserDetails.userType,
          "token": "",
          "createdAt": fetchedUserDetails.createdAt,
          "updatedAt": fetchedUserDetails.updatedAt
      }
        return fetchedHouse
      });

      return House.countDocuments();
    })

    .then(count => {
      res.status(200).json(
        fetchedHouses
      );
    })

    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'Fetching owner houses failed!',
        status: false
      });
    });
};

exports.createHouse = (req, res) => {
  if (req.body === {}) {
    res.status(400).json({
      message: 'Bad request',
      status: false
    });
  }

  const house = new House({
    creator: req.body.creator,
    houseName: req.body.houseName,
    houseType: req.body.houseType,
    houseDescription: req.body.houseDescription,
    contactPhone: req.body.contactPhone,
    contactEmail: req.body.contactEmail,
    locationLat: req.body.locationLat,
    locationLong: req.body.locationLong,
  });


  house
    .save()

    .then(createdHouse => {
      res.status(201).json({
        message: 'house added successfully',
        status: true
      });
    })

    .catch(error => {
      res.status(500).json({
        message: 'creating a house failed!',
        status: false
      });
    });
};

exports.updateHouse = (req, res, next) => {
  const updateData = req.body;
  updateData._id = req.params.id;

  House
    .updateOne(
      {
        _id: req.params.id,
        creator: req.userData.userId,
        userType: req.userData.userType
      },
      {
        $set: updateData
      })

    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Update successful' });
      } else {
        res.status(401).json({
          message: 'Not Authorized',
          status: false
        });
      }
    })

    .catch(error => {
      res.status(500).json({
        message: "Couldn't update house!",
        status: false
      });
    });
};

exports.deleteHouse = (req, res, next) => {
  House

    .deleteOne({
      _id: req.params.id,
      creator: req.userData.userId,
      userType: req.userData.userType
    })

    .then(result => {
      if (result.deletedCount >= 1) {
        res.status(200).json({ message: 'Deletion successful' });
      } else {
        res.status(401).json({
          message: 'Not Authorized',
          status: false
        });
      }
    })

    .catch(error => {
      res.status(500).json({
        message: 'Deleting house failed!',
        status: false
      });
    });
};