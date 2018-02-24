var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var account = require('./routes/account');
var accounts = require('./routes/accounts');
var event = require('./routes/event');
var events = require('./routes/events');
var search = require('./routes/search');

var config = new(require('./config.js'))();
var Datastore = require('nedb-core');
var exporterService = require('./services/exporter.js');
var db = {};
var exporter = {};
Object.keys(config.allCoins).forEach(function(key) {
  // var val = o[key];
  console.log("Key:"+key+" value: "+config.allCoins[key]);
  db[key] = new Datastore({ filename: './'+config.allCoins[key].dbFilename, autoload: true });
  db[key].ensureIndex({ fieldName: 'balance' }, function (err) {
    if (err) {
      console.log("Error creating balance db index:", err);
    }
  });

  db[key].ensureIndex({ fieldName: 'timestamp' }, function (err) {
    if (err) {
      console.log("Error creating timestamp db index:", err);
    }
  });

  db[key].ensureIndex({ fieldName: 'args._from' }, function (err) {
    if (err) {
      console.log("Error creating _from db index:", err);
    }
  });

  db[key].ensureIndex({ fieldName: 'args._to' }, function (err) {
    if (err) {
      console.log("Error creating _to db index:", err);
    }
  });

  exporter[key] = new exporterService(config, db[key], key);
});
//var db = new Datastore({ filename: './data.db', autoload: true });



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('config', config);
app.set('db', db);
app.set('trust proxy', true);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(config.logFormat));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/account', account);
app.use('/accounts', accounts);
app.use('/event', event);
app.use('/events', events);
app.use('/search', search);

app.locals.moment = require('moment');
app.locals.nodeStatus = new(require('./utils/nodeStatus.js'))(config);
app.locals.nameformatter = new(require('./utils/nameformatter.js'))(config);
app.locals.tokenformatter = new(require('./utils/tokenformatter.js'))(config);
app.locals.config = config;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
console.log("sdfsdfffff",err)
  // render the error page
  res.status(err.status || 500);
  res.render('error',err);
});

module.exports = app;
