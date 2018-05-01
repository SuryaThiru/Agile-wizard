import cors from "cors";
import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import graphqlHTTP from "express-graphql";
import {schema} from "./graphql/schema";


let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

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

export default app;
