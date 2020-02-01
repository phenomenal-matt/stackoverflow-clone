const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',

  transports: [
    //
    // - Write all logs with level `info` and below to console
    //
    new winston.transports.Console({
      format: winston.format.simple(),
      colorize: true
    })
  ]
});

module.exports = logger;
