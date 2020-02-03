const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/environment-variables');
const APIError = require('../extensions/APIError');

/**
 * Enforce authorization
 * @public
 */
module.exports = (req, res, next) => {
  const token = req.header('authorization');
  if (!token) {
    const err = new APIError({
      message: 'Authorization is required',
      status: httpStatus.UNAUTHORIZED
    });
    next(err);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};
