const Unit = require('../models/unit');

exports.getUnits = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const unitQuery = Unit.find();
  let fetchedUnits;

  if (pageSize && currentPage) {
    unitQuery
      .sort({ createdAt: 1 })

      .skip(pageSize * (currentPage - 1))

      .limit(pageSize);
  }

  unitQuery
    .then(documents => {
      fetchedUnits = documents;
      return Unit.countDocuments();
    })

    .then(count => {
      res.status(200).json(fetchedUnits);
    })

    .catch(error => {
      res.status(500).json({
        message: 'Fetching unit failed!',
        status: false
      });
    });
};

exports.getUnit = (req, res, next) => {
  Unit
    .findById(req.params.id)

    .then(unit => {
      if (unit) {
        res.status(200).json(unit);
      } else {
        res.status(404).json({
          message: 'Unit does not exist',
          status: false
        });
      }
    })

    .catch(error => {
      res.status(500).json({
        message: 'Fetching unit failed!',
        status: false
      });
    });
};

exports.getUnitsByHouseId = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const unitsQuery = Unit
    .aggregate()

    .lookup({
      from: 'units',
      localField: 'houseId',
      foreignField: '_id',
      as: 'houseDetails'
    })
    .match({ creator: new mongoose.Types.ObjectId(req.params.id) });;

  let fetchedUnits;

  if (pageSize && currentPage) {
    unitsQuery
      .sort({ createdAt: 1 })

      .skip(pageSize * (currentPage - 1))

      .limit(pageSize);
  }

  unitsQuery
    .then(documents => {
      fetchedUnits = documents;

      fetchedUnits.map(fetchedUnit => {
        fetchedHouseDetails = fetchedUnit.houseDetails[0]
      }
        return fetchedUnit
      });

      return Unit.countDocuments();
    })

    .then(count => {
      res.status(200).json(
        fetchedUnits
      );
    })

    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'Fetching owner units failed!',
        status: false
      });
    });
};

exports.createUnit = (req, res) => {
  if (req.body === {}) {
    res.status(400).json({
      message: 'Bad request',
      status: false
    });
  }

  const unit = new Unit({
    houseId: req.body.houseId,
    unitDescription: req.body.unitDescription,
    unitType: req.body.unitType,
    isVacant: req.body.isVacant,
    unitName: req.body.unitName,
    unitPrice: req.body.unitPrice,
  });


  unit
    .save()

    .then(createdUnit => {
      res.status(201).json({
        message: 'unit added successfully',
        status: true
      });
    })

    .catch(error => {
      res.status(500).json({
        message: 'creating a unit failed!',
        status: false
      });
    });
};

exports.updateUnit = (req, res, next) => {
  const updateData = req.body;
  updateData._id = req.params.id;

  Unit
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
        message: "Couldn't update unit!",
        status: false
      });
    });
};

exports.deleteUnit = (req, res, next) => {
  Unit

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
        message: 'Deleting unit failed!',
        status: false
      });
    });
};