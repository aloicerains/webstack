const express = require('express');
const router = express.Router();
const houseController = require('../controllers/house');
const checkAuth = require('../middleware/check-auth');

router.get('', houseController.getHouses);

router.get('/owner/:id', imageController.getHousesByOwnerId);

router.get('/:id', houseController.getHouse);

router.post('', checkAuth, houseController.createHouse);

router.put('/:id', checkAuth, houseController.updateHouse);

router.delete('/:id', checkAuth, houseController.deleteHouse);

module.exports = router;