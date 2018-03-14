var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:coinkey?', function(req, res, next) {
  var db = req.app.get('db');
  var config = req.app.get('config');
  if (req.params.coinkey){
    var coinkey = req.params.coinkey;
    db[coinkey].find({}).sort({ timestamp: -1 }).limit(10).exec(function (err, events) {

      res.render('index', { events: events, coinkey:coinkey,config:config  });
    });
  }
  else{
    var fullevents={};
    var querycount =0;
    var keys=Object.keys(config.allCoins);
    keys.map(function(elem) {
      db[elem].find({}).sort({ timestamp: -1 }).limit(10).exec(function (err, events) {
        fullevents[elem]=events;
        // events.map(function(element){
        //   element["coin"]=elem;
        // });
        // fullevents=fullevents.concat(events);

        querycount++;
        if(querycount==keys.length)
        {
          console.log('all e',fullevents);
          res.render('index', { events: fullevents, coinkey:'ALL TOKENS',config:config,coinArr:keys  });
        }
      });
    });
  }

});

module.exports = router;
