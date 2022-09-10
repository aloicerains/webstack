const express = require("express");
const router = express.Router();

const bookingController = require('../controllers/bookings');
const checkAuth = require("../middleware/check-auth");

router.post('', bookingController.createBooking);
router.get('/:id', bookingController.getBookingsByHouseId);
router.delete('/:id',checkAuth, bookingController.deleteBooking);


module.exports = router;