const express = require('express');
const router = express.Router();

const roomController = require('../controllers/rooms');
const checkAuth = require('../middleware/check-auth');


router.post('', checkAuth, roomController.createRoom);
router.get('', roomController.getRooms);
router.get('/:id', roomController.getRoom);
router.put('/book/:id', roomController.bookRoom); // not very safe, still, you need roomId. 
router.put('/:id', checkAuth, roomController.updatedRoom);
router.delete('/:id', checkAuth, roomController.deleteRoom);


module.exports = router;