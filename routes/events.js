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
    
    db[req.params.coinkey].find({ balance: { $exists: false } }).sort({ timestamp: -1 }).skip(req.params.offset).limit(50).exec(function(err, events) {
      res.render('events', {events: events, offset: req.params.offset, stepSize: 50,coinkey:req.params.coinkey, config:config });
    });
  }
  else{
    var fullevents={};
    var keys=[];

      Promise.all(
        Object.keys(config.allCoins).map(function(elem) {
          return new Promise(function(resolve, reject) {

            db[elem].find({ balance: { $exists: false } }).sort({ timestamp: -1 }).limit(5).exec(function(err, events) {
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
        res.render('events', {events: fullevents,coinkey:'ALL', config:config,coinArr:keys });

      });

  }

});

module.exports = router;
