var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");
var update = require("./UpdateController.js");

var authController = {};

// Restrict access to root page
authController.home = function(req, res) {
  console.log(req.user || "no user session");

  //calculate the user's item statuses here
  if(req.user) {
    update.calcItemStatuses(req, res);
  }

  res.render('index', { user : req.user });
};

// Go to registration page
authController.register = function(req, res) {
  res.render('register', { user : req.user });
};

// Post registration
authController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    if (err) {
      console.log('failed to register: ', err);
      return res.render('register', { user : req.user });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
};

// Go to login page
authController.login = function(req, res) {
  res.render('login', { user : req.user });
};

// Post login
authController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.redirect('/');
  });
};

// logout
authController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = authController;
