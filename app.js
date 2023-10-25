var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var cors = require('cors')
var axios = require('axios')

// var indexRouter = require('./routes/index');
var tenantRouter = require('./routes/profile');
var authRouter = require('./routes/auth')
var reviewRouter = require('./routes/reviews')
var listingRouter = require('./routes/listings')
var oneTimeRouter = require('./routes/ignore/one-time')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    cors({
      origin: [process.env.REACT_APP_URI]  // <== URL of our future React app
    })
  );

// app.use(
//     cors()
//   );

// app.use('/', indexRouter);
app.use('/profile', tenantRouter)
app.use('/auth', authRouter)
app.use('/reviews', reviewRouter)
app.use('/listings', listingRouter)
app.use('/one-time', oneTimeRouter)

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

module.exports = app;
