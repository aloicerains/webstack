const House = require('../models/houses');

exports.createHouse = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host"); // constructs a url to our server
    const houseType = JSON.parse(req.body.houseType);
    const house = new House({
      name: req.body.name,
      location: req.body.location,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      imagePath: url + "/images/" + req.file.filename,
      description: req.body.description,
      houseType: houseType,
      user: req.userData.userId
   // will be converted by mongoose to userId object
    });
    house.save().then(createdHouse => {
      const newHouse = {
        name: createdHouse.name,
        location: createdHouse.location,
        latitude: createdHouse.latitude,
        longitude: createdHouse.longitude,
        imagePath: createdHouse.imagePath,
        description: createdHouse.description,
        houseType: createdHouse.houseType,
        user: createdHouse.user
      }
      res.status(201).json({
        message: "House added successfully",
        house: {
          ...newHouse,
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a house failed!"
      });
    });
}


exports.getHouse = (req, res, next) => {
  House
    .findById(req.params.id)

    .then(house => {
      if (house) {
        const newHOuse = {
          id: house._id,
          name: house.name,
          location: house.location,
          latitude: house.latitude,
          longitude: house.longitude,
          imagePath: house.imagePath,
          description: house.description,
          houseType: house.houseType,
          user: house.user
        }
        res.status(200).json(newHOuse);
      } else {
        res.status(404).json({
          message: 'House does not exist'
        });
      }
    })

    .catch(error => {
      res.status(500).json({
        message: 'Fetching the house failed!'
      });
    });
};

exports.getHouses = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const type = req.query.type;
  const location = req.query.location;
  let houseQuery;
  if (type && location) {
    houseQuery = House.find({location: location, housetype: type});
  } else if (type && !location) {
    houseQuery = House.find({houseType: type});
  } else if (location && !type) {
    houseQuery = House.find({location: location});
  } else {
    houseQuery = House.find();
  }

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
      return House.countDocuments(); //total documents in the database
    })

    .then(count => {
      res.status(200).json({
        message: "Houses retrieved successfully!",
        houses: fetchedHouses,
        maxHouses: count
      });
    })

    .catch(error => {
      console.error(error.message);
      res.status(500).json({
        message: 'Fetching house failed!'
      });
    });
};

exports.updateHouse = (req, res, next) => {
  let imagePath ;
  let houseType;
  if (req.body.houseType) {
    houseType = JSON.parse(req.body.houseType);
  }
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  } else {
    imagePath = req.body.imagePath;
  }
  const updateData = {
    name: req.body.name,
    location: req.body.location,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    imagePath: imagePath,
    description: req.body.description,
    houseType: houseType,
    user: req.userData.userId
  };

  House
    .updateOne(
      {
        _id: req.params.id,
        user: req.userData.userId
      },
      updateData
      )

    .then(result => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: 'Update successful' });
      } else {
        res.status(401).json({
          message: 'Not Authorized' // or house not found, unless root not protected
        });
      }
    })

    .catch(error => {
      console.error(error.message);
      res.status(500).json({
        message: "Couldn't update house!"
      });
    });
};

exports.deleteHouse = (req, res, next) => {
  House

    .deleteOne({
      _id: req.params.id,
      user: req.userData.userId
    })

    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Deletion successful!"});
      } else {
        res.status(401).json({ message: "Not authorized!"}); 
      }
    })
    
    .catch(error => {
      res.status(500).json({
        message: "Deleting house failed!"
      });
    });
}
