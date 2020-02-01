const httpStatus = require('http-status');
const APIError = require('../extensions/APIError');
/**
 * Catch 404 requests and forward to error handler
 * @public
 */
module.exports = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND
  });
  next(err);
};
