const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file')('catalog');

router.get('', imageController.getImages);

router.get('/:id', imageController.getImage);

router.get('/house/:id', imageController.getImagesByHouseId);

router.post('', checkAuth, extractFile, imageController.createImage);

router.put('/:id', checkAuth, extractFile, imageController.updateImage);

router.delete('/:id', checkAuth, imageController.deleteImage);

module.exports = router;