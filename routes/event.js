var express = require('express');
var router = express.Router();

router.get('/:coinkey/:event', function(req, res, next) {
  var db = req.app.get('db');

  db[req.params.coinkey].find({_id: req.params.event}).exec(function (err, event) {

    if (err) {
      return next(err);
    }

    if (event.length === 0 || !event[0]._id) {
      return next({message: "Event not found!"});
    }

    res.render('event', { event: event[0],coinkey:req.params.coinkey });
  });

});

module.exports = router;
