var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:coinkey', function(req, res, next) {
  var db = req.app.get('db');
  var coinkey = request.params.coinkey;
  db[coinkey].find({}).sort({ timestamp: -1 }).limit(10).exec(function (err, events) {
    res.render('index', { events: events,coinkey:coinkey });
  });

});

module.exports = router;
