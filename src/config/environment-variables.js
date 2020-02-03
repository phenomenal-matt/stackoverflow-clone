const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION,
  mongo: {
    uri:
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI
  },
  requestLogsFormat: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
};
