var express = require('express');
var router = express.Router();

router.get('/:coinkey/:type/:event', function(req, res, next) {
  var db = req.app.get('db');
  var config = req.app.get('config');
  if (req.params.type == 'id')
  {
    var parameter = {_id: req.params.event};
  }
  else if(req.params.type=='TxHash')
  {
    var parameter = {transactionHash: req.params.event};
  }
  else{
    console.log("didnot match");
    res.redirect('/');
    return;
  }
  if ((req.params.coinkey).toLowerCase()=='all'){
    var eventval=-1;
    Promise.all(
      Object.keys(config.allCoins).map(function(elem) {
        return new Promise(function(resolve, reject) {
          db[elem].find(parameter).exec(function (err, event) {
              if (err || event.length === 0 || !event[0]._id) {
                resolve();
              }
              else{
                eventval=event[0];
                resolve();
              }
            });
          });
        })
      ).then(function(values) {
        if(eventval==-1){
          return next({message: "No Results found!",coinkey:'ALL',config:config});
        }
        else{
          res.render('event', { event: eventval,coinkey:'ALL',config:config });
        }

    });
  }
  else{
    db[req.params.coinkey].find(parameter).exec(function (err, event) {

      if (err) {

        return next({message: err,coinkey:req.params.coinkey,config:config });
      }

      if (event.length === 0 || !event[0]._id) {
        return next({message: "Event not found!",coinkey:req.params.coinkey,config:config });
      }

      res.render('event', { event: event[0],coinkey:req.params.coinkey,config:config });
    });
  }

});

module.exports = router;
