const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const routes = require('../api/routes/v1');
const { requestLogsFormat } = require('./environment-variables');

const error = require('../api/middlewares/error');
const notFound = require('../api/middlewares/notFound');

const app = express();

// log all requests
app.use(morgan(requestLogsFormat));

// parse body params and attach them to req.body
app.use(express.json());

// gzip compression of response
app.use(compress());

// Mount api v1 routes
app.use('/v1', routes);

// Handle 404 requests
app.use(notFound);

// Handle and convert errors then send error response.
app.use(error.converter);

module.exports = app;
