const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController.js');
const mailController  = require('../app/controllers/MailController.js'); 

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/logout', userController.logout);
router.post('/sendOTP', mailController.sendCodeAth); 
router.get('/', userController.index);

module.exports = router;
