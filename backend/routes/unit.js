const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit');
const checkAuth = require('../middleware/check-auth');

router.get('', unitController.getUnits);

router.get('/house/:id', unitController.getUnitsByHouseId);

router.get('/:id', unitController.getUnit);

router.post('', checkAuth, unitController.createUnit);

router.put('/:id', checkAuth, unitController.updateUnit);

router.delete('/:id', checkAuth, unitController.deleteUnit);

module.exports = router;