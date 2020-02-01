const httpStatus = require('http-status');
const ExtendableError = require('./ExtendableError');

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   */
  constructor({
    code,
    message,
    errors,
    stack,
    status = httpStatus.INTERNAL_SERVER_ERROR
  }) {
    super({
      code,
      message,
      errors,
      stack
    });


    this.status = status;
  }
}

module.exports = APIError;
