const APIError = require('../extensions/APIError');
const { env } = require('../../config/environment-variables');
const result = require('../utils/constants/result.constant');

/**
 * Error handler for sending error response. Send stacktrace only during development
 * @private
 */
const errorhandler = (err, req, res, next) => {
  const response = {
    code: err.code,
    result: result.ERROR,
    message: err.message,
    errors: err.errors,
    stack: err.stack
  };

  // send stacktrace and code only during development
  if (env !== 'development') {
    delete response.stack;
    delete response.code;
  }

  return res.status(err.status).json(response);
};

/**
 * Convert errors to APIError and then forward to error handler.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;
  if (!(err instanceof APIError)) {
    convertedError = new APIError({
      code: err.code,
      message: err.message,
      status: err.status,
      stack: err.stack
    });
  }

  return errorhandler(convertedError, req, res);
};
