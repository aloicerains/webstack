const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.get('/', userController.getUsers);

router.get('/:id', userController.getUser);

router.post('/login', userController.loginUser);

router.post('/signup', userController.createUser);

module.exports = router;