var mongoose = require("mongoose");
var User = require("../models/user");

var updateController = {};

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

  User.findOneAndUpdate({ username: req.user.username },
                        { $set: { matrix: req.user.matrix } },
                        { new: true},
                        (err, user) => {
                          if(err) console.log('oops mongo error');
                          res.render('index', { user: user });
                        });
};

//will have to re-index after deletion (or re-order)

module.exports = updateController;
