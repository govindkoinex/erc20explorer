var express = require('express');
var router = express.Router();

router.get('/:coinkey/:offset?', function(req, res, next) {
  var db = req.app.get('db');
  var config = req.app.get('config');

  if (req.params.coinkey && (req.params.coinkey).toLowerCase()!='all'){
    if (!req.params.offset) {
      req.params.offset = 0;
    } else {
      req.params.offset = parseInt(req.params.offset);
    }
    db[req.params.coinkey].find({ balance: { $exists: true } }).sort({ balance: -1 }).skip(req.params.offset).limit(50).exec(function(err, accounts) {
      res.render('accounts', {accounts: accounts, offset: req.params.offset, stepSize: 50,coinkey:req.params.coinkey,config:config });
    });
  }
  else{
    var fullaccounts={};
    var keys=[];

      Promise.all(
        Object.keys(config.allCoins).map(function(elem) {
          return new Promise(function(resolve, reject) {
            db[elem].find({ balance: { $exists: true } }).sort({ balance: -1 }).limit(5).exec(function(err, accounts) {
              if(accounts.length > 0){
                fullaccounts[elem]=accounts;
                keys.push(elem);
              }
              resolve();
              });
            });
          })
        ).then(function(values) {
        res.render('accounts', {accounts: fullaccounts, coinkey:'ALL',config:config,coinArr:keys });
      });

  }





});

module.exports = router;
