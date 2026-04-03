const express = require('express');
const authController = require('./auth.controller');
const { validateRegisterUser, validateLoginUser } = require('./auth.middleware');
const router = express.Router();

router.post('/register', validateRegisterUser, authController.registerUserController);
router.post('/login', validateLoginUser, authController.loginUserController);

module.exports = router;
