const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const {schema} = require('./graphql/schema');
const jwt = require('express-jwt');
const auth_error = (err, req, res, next) => {
  // console.log(err);
  if(err.name === 'UnauthorizedError'){
    req.errs = 'Invalid Token';
  }
  else{
    req.errs = null;
  }
  next();
};
const auth = jwt({
  secret: 'secret',
  credentialsRequired: false
});

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', auth,auth_error,graphqlHTTP(req =>({
  schema: schema,
  graphiql: true,
  context:{
    user: req.user,
    errs: req.errs
  }
}))
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    status: err.status || 500
  });
});

module.exports = app;
