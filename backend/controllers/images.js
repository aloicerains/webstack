const Image = require('../models/image');

exports.getImages = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const imageQuery = Image.find();
  let fetchedImages;

  if (pageSize && currentPage) {
    imageQuery
      .sort({ createdAt: 1 })

      .skip(pageSize * (currentPage - 1))

      .limit(pageSize);
  }

  imageQuery
    .then(documents => {
      fetchedImages = documents;
      return Image.countDocuments();
    })

    .then(count => {
      res.status(200).json(fetchedImages);
    })

    .catch(error => {
      res.status(500).json({
        message: 'Fetching image failed!',
        status: false
      });
    });
};

exports.getImage = (req, res, next) => {
  Image
    .findById(req.params.id)

    .then(image => {
      if (image) {
        res.status(200).json(image);
      } else {
        res.status(404).json({
          message: 'Image does not exist',
          status: false
        });
      }
    })

    .catch(error => {
      res.status(500).json({
        message: 'Fetching image failed!',
        status: false
      });
    });
};

exports.getImagesByHouseId = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const imagesQuery = Image
    .aggregate()

    .lookup({
      from: 'images',
      localField: 'houseId',
      foreignField: '_id',
      as: 'houseDetails'
    })
    .match({ creator: new mongoose.Types.ObjectId(req.params.id) });;

  let fetchedImages;

  if (pageSize && currentPage) {
    imagesQuery
      .sort({ createdAt: 1 })

      .skip(pageSize * (currentPage - 1))

      .limit(pageSize);
  }

  imagesQuery
    .then(documents => {
      fetchedImages = documents;

      fetchedImages.map(fetchedImage => {
        fetchedHouseDetails = fetchedImage.houseDetails[0]
      }
        return fetchedImage
      });

      return Image.countDocuments();
    })

    .then(count => {
      res.status(200).json(
        fetchedImages
      );
    })

    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'Fetching owner images failed!',
        status: false
      });
    });
};

exports.createImage = (req, res) => {
  if (req.body === {}) {
    res.status(400).json({
      message: 'Bad request',
      status: false
    });
  }
  const url = req.protocol + '://' + req.get('host');
  const image = new Image({
    houseId: req.body.houseId,
    imageDescription: req.body.imageDescription,
    imageUrl: url + '/images/' + req.file.filename
  });


  image
    .save()

    .then(createdImage => {
      res.status(201).json({
        message: 'image added successfully',
        status: true
      });
    })

    .catch(error => {
      res.status(500).json({
        message: 'creating an image failed!',
        status: false
      });
    });
};

exports.updateImage = (req, res, next) => {
  const updateData = req.body;
  updateData._id = req.params.id;

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    updateData.imageUrl = url + '/images/' + req.file.filename;
  }

  Image
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
        message: "Couldn't update image!",
        status: false
      });
    });
};

exports.deleteImage = (req, res, next) => {
  Image

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
        message: 'Deleting image failed!',
        status: false
      });
    });
};