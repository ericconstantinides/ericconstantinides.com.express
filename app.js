let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// var sslRedirect = require('heroku-ssl-redirect');


let index = require('./routes/index');
let skills = require('./routes/skills');
let snippets = require('./routes/snippets');
let resume = require('./routes/resume');

let app = express();

let siteDetails = require('./eric-constantinides-com.json');
app.locals.globalTitle = siteDetails.globalTitle;
app.locals.headline = siteDetails.headline;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// enable ssl redirect
// app.use(sslRedirect());

app.get('/', index);
app.get('/skills', skills);
app.get('/snippets', snippets);
app.get('/resume', resume);

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

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
