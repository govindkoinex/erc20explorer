var express = require('express');
var router = express.Router();

router.get('/:coinkey/:account?/:offset?', function(req, res, next) {

  var db = req.app.get('db');
  var config = req.app.get('config');

  if (req.params.coinkey && (req.params.coinkey).toLowerCase()!='all'){
    if (!req.params.account) {
      res.redirect('/accounts/'+req.params.coinkey);
    }
    if (!req.params.offset) {
      req.params.offset = 0;
    } else {
      req.params.offset = parseInt(req.params.offset);
    }
    db[req.params.coinkey].find({_id: req.params.account}).exec(function (err, balance) {

      if (err) {
        //return next(err);
        return next({message: "Account not found!",coinkey:req.params.coinkey,config:config});
      }

      if (balance.length === 0 || !balance[0]._id) {
        return next({message: "Account not found!",coinkey:req.params.coinkey,config:config});
      }

      db[req.params.coinkey].find( {$or: [{ "args._from": req.params.account }, { "args._to": req.params.account }] }).sort({ timestamp: -1 }).skip(req.params.offset).limit(50).exec(function(err, events) {
        res.render('account', { balance: balance[0], events: events, offset: req.params.offset, stepSize: 50,coinkey:req.params.coinkey,config:config });
      });
    });

  }
  else{

    if (!req.params.account) {
      res.redirect('/accounts/ALL');
    }

    var fullevents={};
    var tokenbalance={};
    var keys=[];

      Promise.all(
        Object.keys(config.allCoins).map(function(elem) {
          return new Promise(function(resolve, reject) {
            db[elem].find({_id: req.params.account}).exec(function (err, balance) {

                if (err) {
                  tokenbalance[elem]={ _id: req.params.account,balance:0 };
                }
                else if (balance.length === 0 || !balance[0]._id) {
                  tokenbalance[elem]={ _id: req.params.account,balance:0 };
                }
                else{
                  tokenbalance[elem]=balance[0];
                }

                db[elem].find( {$or: [{ "args._from": req.params.account }, { "args._to": req.params.account }] }).sort({ timestamp: -1 }).exec(function(err, events) {
                  if(events.length > 0)
                  {
                    fullevents[elem]=events;
                    keys.push(elem);
                  }
                  resolve();
                });
              });
            });
          })
        ).then(function(values) {
          console.log(fullevents);
        res.render('account', { accountid: req.params.account,balance: tokenbalance, events: fullevents,coinkey:'ALL',config:config,coinArr:keys });

      });

  }




});

module.exports = router;
