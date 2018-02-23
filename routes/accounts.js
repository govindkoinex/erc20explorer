var express = require('express');
var router = express.Router();

router.get('/:coinkey/:offset?', function(req, res, next) {
  var db = req.app.get('db');

  if (!req.params.offset) {
    req.params.offset = 0;
  } else {
    req.params.offset = parseInt(req.params.offset);
  }

  db[req.params.coinkey].find({ balance: { $exists: true } }).sort({ _id: 1 }).skip(req.params.offset).limit(50).exec(function(err, accounts) {
    res.render('accounts', {accounts: accounts, offset: req.params.offset, stepSize: 50,coinkey:req.params.coinkey });
  });

});

module.exports = router;
