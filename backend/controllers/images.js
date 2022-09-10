const Image = require('../models/images');

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
      roomType: req.body.roomType,
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
  }


exports.getImagesByHouseId = (req, res) => {
  const houseId = req.query.houseId;

  Image
    .find({
      houseId: houseId
    })
    .then(images => {
      return images.map(image => {
        return {
          id: image._id,
          houseId: image.houseId,
          roomType: image.roomType,
          imageDescription: image.imageDescription,
          imageUrl: image.imageUrl
        }
      })
    })
    .then(updatedImages => {
      res.status(200).json({
        message: "Images retrieved successfully",
        images: updatedImages,
        status: true
      });
    })
    .catch (error => {
      console.log(error.message);
      res.status(500).json({
        message: 'Retrieving images failed',
        status: false
      });
    });
}

exports.deleteImage = (req, res, next) => {
  Image

    .deleteOne({
      _id: req.params.id,
    })

    .then(result => {
      if (result.deletedCount >= 1) {
        res.status(200).json({ 
          message: 'Deletion successful',
        status: true });
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