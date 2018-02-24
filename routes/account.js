var express = require('express');
var router = express.Router();

router.get('/:coinkey/:account/:offset?', function(req, res, next) {
  var db = req.app.get('db');
  var config = req.app.get('config');
  if (!req.params.offset) {
    req.params.offset = 0;
  } else {
    req.params.offset = parseInt(req.params.offset);
  }
  db[req.params.coinkey].find({_id: req.params.account}).exec(function (err, balance) {

    if (err) {
      console.log("govind4");
      return next(err);
    }

    if (balance.length === 0 || !balance[0]._id) {
      console.log("govind3"+req.params.coinkey);
      return next({message: "Account not found!",coinkey:req.params.coinkey,config:config});
    }

    db[req.params.coinkey].find( {$or: [{ "args._from": req.params.account }, { "args._to": req.params.account }] }).sort({ timestamp: -1 }).skip(req.params.offset).limit(50).exec(function(err, events) {
      res.render('account', { balance: balance[0], events: events, offset: req.params.offset, stepSize: 50,coinkey:req.params.coinkey,config:config });
    });
  });

});

module.exports = router;
