const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../extensions/APIError');

module.exports = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const err = new APIError({
      message: 'Question not found',
      status: httpStatus.NOT_FOUND
    });
    next(err);
  }

  next();
};
