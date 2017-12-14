var mongoose = require("mongoose");
var User = require("../models/user");

var updateController = {};

updateController.calcItemStatuses = function(req, res) {
  //for each slice, for each item
  req.user.matrix.forEach(function(slice) {
    slice.forEach(function(item) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      if (today > item.deadline) {
        item.status = 'overdue';
      } else if (today > item.redline) {
        item.status = 'redzone';
      } else {
        item.status = 'good';
      }
    })
  })
}

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
    status: 'good'
  }
  newItem.deadlineDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * newItem.cycle)).setHours(0, 0, 0, 0);
  newItem.redlineDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * (newItem.cycle - newItem.redline))).setHours(0, 0, 0, 0);

  console.log(newItem.deadlineDate);
  console.log(newItem.redlineDate);

  slice.items.push(newItem);
  updateController.saveUserUpdate(req, res);
};

updateController.calcDaysForItem = function(item) {
  var today = new Date();
  return item;
}

// Go to add item view
updateController.addItem = function(req, res) {
  var sindex = req.params.sindex;
  res.render('newitem', {sindex: sindex});
};

// Go to delete item view
updateController.doDeleteItem = function(req, res) {
  var itemIndex = req.params.iindex;
  var sliceIndex = req.params.sindex;
  req.user.matrix[sliceIndex - 1].items.splice(itemIndex - 1, 1);
  updateController.reIndexItems(sliceIndex, req, res);
  updateController.saveUserUpdate(req, res);
};

updateController.reIndexSlices = function(req, res) {
  req.user.matrix.forEach(function(slice, index) {
    slice.index = index + 1;
  });
}

updateController.reIndexItems = function(sliceIndex, req, res) {
  req.user.matrix[sliceIndex -1].items.forEach(function(item, index) {
    item.index = index + 1;
  });
}

module.exports = updateController;
