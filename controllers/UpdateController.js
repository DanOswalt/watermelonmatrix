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
      items: []
    }
  req.user.matrix.push(newSlice);
  console.log('update:', req.user);

  User.findOneAndUpdate({username: req.user.username},
                        {$set: {matrix: req.user.matrix} },
                        {new: true},
                        (err, user) => {
                          if(err) console.log('oops mongo error');
                          console.log('user: ', user);
                          console.log('matrix', user.matrix);
                          res.render('index', {user: user});
                        })

};

module.exports = updateController;
