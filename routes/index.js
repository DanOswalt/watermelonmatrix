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
router.get('/addslice', update.addSlice)

// route for saving slice add
router.post('/doaddslice', update.doAddSlice)

// route for deleting slice
router.get('/openslice/:sindex/deleteslice', update.deleteSlice)

// route for going to add item form
router.get('/openslice/:sindex/additem', update.addItem)

// route for saving item add
router.post('/openslice/:sindex/doadditem', update.doAddItem)

// route for deleting an item
router.get('/openslice/:sindex/item/:iindex/dodeleteitem', update.doDeleteItem)

module.exports = router;
