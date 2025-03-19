// bdd creation and finitialise
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbPath = './BDD/db.sqlite';
const isNewDB = !fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath);
if (isNewDB) {
  db.run("CREATE TABLE users (uuid TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, pwd TEXT)");
  db.run("CREATE TABLE identitys (uuid TEXT PRIMARY KEY, user_uuid TEXT, name TEXT, email TEXT, pwd TEXT, last_report DATETIME, FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE)");
  db.run("CREATE TABLE reports (uuid TEXT PRIMARY KEY, identity_uuid TEXT, danger_indice INTEGER,FOREIGN KEY (identity_uuid) REFERENCES identitys(uuid) ON DELETE CASCADE)");
}
db.close;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require("./routes/index");
var aboutRouter = require("./routes/about");
var log_inRouter = require("./routes/log_in");
var sign_inRouter = require("./routes/sign_up");
var homeRouter = require('./routes/home');
var reports_listRouter = require('./routes/reports_list');
var reportRouter = require('./routes/report');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/log_in', log_inRouter);
app.use('/sign_up', sign_inRouter);
app.use('/home', homeRouter);
app.use('/reports_list', reports_listRouter);
app.use('/report', reportRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
