var mongoose = require("mongoose");
var User = require("../models/user");

var updateController = {};

updateController.saveUserUpdate = function(req, res) {
  User.findOneAndUpdate({ username: req.user.username },
                        { $set: { matrix: req.user.matrix } },
                        { new: true},
                        (err, user) => {
                          if(err) console.log('oops mongo error');
                          res.redirect('/');
                        });
};

// Go to add slice view
updateController.addSlice = function(req, res) {
  res.render('newslice');
};

updateController.doAddSlice = function(req, res) {
  var newSlice = {
      title: req.body.title,
      items: [],
      index: req.user.matrix.length + 1
    }

  req.user.matrix.push(newSlice);
  updateController.saveUserUpdate(req, res);
};

updateController.deleteSlice = function(req, res) {
  var sliceIndex = req.params.sindex;
  req.user.matrix.splice(sliceIndex - 1, 1);
  updateController.reIndexSlices(req, res);
  updateController.saveUserUpdate(req, res);
};

// Go to add item view
updateController.doAddItem = function(req, res) {
  //validation first?
  var sliceIndex = req.params.sindex;
  var slice = req.user.matrix[sliceIndex - 1];
  var newItem = {
    name: req.body.name,
    index: slice.items.length + 1,
    cycle: req.body.cycle,
    redline: req.body.redline,
    startingcount: req.body.startingcount
  }
  slice.items.push(newItem);
  updateController.saveUserUpdate(req, res);
};

// Go to add item view
updateController.addItem = function(req, res) {
  var sindex = req.params.sindex;
  res.render('newitem', {sindex: sindex});
};

updateController.reIndexSlices = function(req, res) {
  //will have to re-index after deletion (or re-order) id is based on order
  req.user.matrix.forEach(function(slice, index) {
    slice.index = index + 1;
  });
}

module.exports = updateController;
