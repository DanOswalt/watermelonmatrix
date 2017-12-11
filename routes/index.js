var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");
var update = require("../controllers/UpdateController.js");
var view = require("../controllers/ViewController.js");

// restrict index for logged in user only	
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

// route for addSlice action
router.get('/addSlice', update.addSlice)

// route for addSlice action
router.post('/doAddSlice', update.doAddSlice)

module.exports = router;
