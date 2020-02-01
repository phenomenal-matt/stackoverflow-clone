const httpStatus = require('http-status');
const APIError = require('../extensions/APIError');

module.exports = schema => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      const err = new APIError({
        message: 'Validation Error',
        errors: error.message,
        status: httpStatus.BAD_REQUEST
      });
      next(err);
    }
  };
};
