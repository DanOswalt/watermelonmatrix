var mongoose = require("mongoose");
var User = require("../models/user");

var ViewController = {};

// Go to add slice view
ViewController.openSlice = function(req, res) {
  var sliceIndex = req.params.index;
  res.render('slice', { user : req.user, index : sliceIndex });
};

module.exports = ViewController;
