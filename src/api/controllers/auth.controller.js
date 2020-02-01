const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/user.model');
const APIError = require('../extensions/APIError');
const result = require('../utils/constants/result.constant');

/**
 * Return APIError if error is a mongoose duplicate key error
 * @private
 * @param {Error} error
 * @returns {Error|APIError}
 */
function checkIfErrorIsDuplicateEmail(error) {
  if (error.name === 'MongoError' && error.code === 11000) {
    error = new APIError({
      message: 'Validation Error',
      errors: '"email" already exists',
      status: httpStatus.CONFLICT
    });
  }
  return error;
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();

    const userDetails = _.pick(user, ['name', 'email']);
    userDetails.token = token;
    const response = {
      result: result.SUCCESS,
      ...userDetails
    };
    return res.status(httpStatus.CREATED).send(response);
  } catch (error) {
    const err = checkIfErrorIsDuplicateEmail(error);
    return next(err);
  }
};

/**
 * Returns jwt token if valid email and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      const err = {
        status: httpStatus.UNAUTHORIZED,
        message: 'Incorrect email or password'
      };
      return next(err);
    }

    const token = user.generateAuthToken();
    const userDetails = _.pick(user, ['name', 'email']);
    userDetails.token = token;
    const response = {
      result: result.SUCCESS,
      ...userDetails
    };
    return res.status(httpStatus.OK).send(response);
  } catch (error) {
    return next(error);
  }
};
