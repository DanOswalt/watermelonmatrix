var mongoose = require("mongoose");
var User = require("../models/user");

var updateController = {};

updateController.calcItemStatuses = function(req, res) {

  //this runs everytime

  //for each slice, for each item
  req.user.matrix.forEach(function(slice) {
    slice.items.forEach(function(item) {
      var today = new Date();
      var todayNum = today.setHours(0, 0, 0, 0);

      item.daysLeft = (item.deadlineDate - today) / 86400000;
      console.log(item.name);
      console.log('deadlineDate:', item.deadlineDate);
      console.log('redlineDate:', item.redlineDate);
      console.log('today:', today);
      console.log('todayNum', todayNum);

      if (todayNum >= item.deadlineDate) {
        item.color = '#81171B';
      } else if (todayNum >= item.redlineDate) {
        item.color = '#C75146';
      } else {
        item.color = '#66A182';
      }

      console.log('item.daysLeft:', `${item.name} ${item.daysLeft}`);

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

updateController.addSlice = function(req, res) {
  res.render('newslice', { user : req.user });
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

updateController.doAddItem = function(req, res) {
  //validation first?
  var sliceIndex = req.params.sindex;
  var slice = req.user.matrix[sliceIndex - 1];
  var newItem = {
    name: req.body.name,
    index: slice.items.length + 1,
    cycle: req.body.cycle,
    redline: req.body.redline,
    color: '-',
    daysLeft: req.body.cycle
  }
  newItem.deadlineDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * newItem.cycle)).setHours(0, 0, 0, 0);
  newItem.redlineDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * (newItem.cycle - newItem.redline))).setHours(0, 0, 0, 0);

  slice.items.push(newItem);
  updateController.saveUserUpdate(req, res);
};

updateController.addItem = function(req, res) {
  var sindex = req.params.sindex;
  res.render('newitem', {user: req.user, sindex: sindex});
};

updateController.doDeleteItem = function(req, res) {
  var itemIndex = req.params.iindex;
  var sliceIndex = req.params.sindex;
  req.user.matrix[sliceIndex - 1].items.splice(itemIndex - 1, 1);
  updateController.reIndexItems(sliceIndex, req, res);
  updateController.saveUserUpdate(req, res);
};

updateController.editItem = function(req, res) {
  var itemIndex = req.params.iindex;
  var sliceIndex = req.params.sindex;
  var item = req.user.matrix[sliceIndex - 1].items[itemIndex - 1];
  console.log('edit item');
  res.render('edititem', {user: req.user, iindex: itemIndex, sindex: sliceIndex, item: item});
};

updateController.doEditItem = function(req, res) {
  //validation first?
  var sliceIndex = req.params.sindex;
  var slice = req.user.matrix[sliceIndex - 1];
  var itemIndex = req.params.iindex;

  var updatedItem = {
    name: req.body.name,
    index: itemIndex,
    cycle: req.body.cycle,
    redline: req.body.redline,
    color: '-',
    daysLeft: req.body.newDaysLeft
  }

  updatedItem.deadlineDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * updatedItem.daysLeft)).setHours(0, 0, 0, 0);
  updatedItem.redlineDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * (updatedItem.daysLeft - updatedItem.redline))).setHours(0, 0, 0, 0);

  console.log('old item', slice.items[itemIndex - 1]);
  slice.items[itemIndex - 1] = updatedItem;
  console.log('editted item', updatedItem);

  updateController.saveUserUpdate(req, res);
};

updateController.doResetItem = function(req, res) {
  var itemIndex = req.params.iindex;
  var sliceIndex = req.params.sindex;
  var item = req.user.matrix[sliceIndex - 1].items[itemIndex - 1];
  item.deadlineDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * item.cycle)).setHours(0, 0, 0, 0);
  item.redlineDate = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * (item.cycle - item.redline))).setHours(0, 0, 0, 0);
  console.log('reset item');
  console.log(req.user);
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
