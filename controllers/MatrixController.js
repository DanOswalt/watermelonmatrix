var mongoose = require("mongoose");
var User = require("../models/user");

var matrixController = {};

// Go to registration page
matrixController.addSlice = function(req, res) {
  res.render('newslice');
};

matrixController.doAddSlice = function(req, res) {
  //user passes in title
  //create a new slice { title: title, things: []}
  //push new slice into user.matrix
  //how do i keep the user? make a global object? where can it live?
  console.log('add ', req.body.title)
  res.render('index');
};
module.exports = matrixController;
