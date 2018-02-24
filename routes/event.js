var express = require('express');
var router = express.Router();

router.get('/:coinkey/:event', function(req, res, next) {
  var db = req.app.get('db');
  var config = req.app.get('config');
  db[req.params.coinkey].find({_id: req.params.event}).exec(function (err, event) {

    if (err) {
      console.log("govind1");
      return next(err);
    }

    if (event.length === 0 || !event[0]._id) {
console.log("govind2");
      return next({message: "Event not found!",coinkey:req.params.coinkey,config:config });
    }

    res.render('event', { event: event[0],coinkey:req.params.coinkey,config:config });
  });

});

module.exports = router;
