var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:coinkey?', function(req, res, next) {
  var db = req.app.get('db');
  var config = req.app.get('config');
  if (req.params.coinkey && (req.params.coinkey).toLowerCase()!='all'){
    var coinkey = req.params.coinkey;
    db[coinkey].find({}).sort({ timestamp: -1 }).limit(10).exec(function (err, events) {

      res.render('index', { events: events, coinkey:coinkey,config:config  });
    });
  }
  else{
    var fullevents={};
    var keys=[];

      Promise.all(
        Object.keys(config.allCoins).map(function(elem) {
          return new Promise(function(resolve, reject) {
            db[elem].find({}).sort({ timestamp: -1 }).limit(5).exec(function (err, events) {
              if(events.length > 0)
              {
                fullevents[elem]=events;
                keys.push(elem);
              }
              resolve();
              });
            });
          })
        ).then(function(values) {
        res.render('index', { events: fullevents, coinkey:'ALL',config:config,coinArr:keys  });
      });

  }

});

module.exports = router;
