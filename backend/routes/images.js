const express = require('express');
const router = express.Router();

const imageController = require('../controllers/images');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

router.post('', checkAuth, extractFile, imageController.createImage);
router.get('', imageController.getImagesByHouseId);
router.delete('/:id', imageController.deleteImage);

module.exports = router;