const mongoose = require('mongoose');
const logger = require('./logger');
const { mongo, env } = require('./environment-variables');

// Exit application on error
mongoose.connection.on('error', err => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

mongoose.connection.once('open', () => {
  logger.info('Connected to mongo');
});

// print mongoose logs in development environment
if (env === 'development') mongoose.set('debug', true);

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.initialize = () => {
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

  return mongoose.connection;
};
