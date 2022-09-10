const express = require("express");
const router = express.Router();

const extractFile = require('../middleware/file');
const houseController = require('../controllers/houses');
const checkAuth = require('../middleware/check-auth');

router.post("", checkAuth, extractFile, houseController.createHouse);
router.get("", houseController.getHouses);
//router.get("/types", houseController.getHousesOfType);
router.get("/:id", houseController.getHouse);
router.put("/:id", checkAuth, extractFile, houseController.updateHouse);
router.delete("/:id", checkAuth, houseController.deleteHouse);


module.exports = router;
