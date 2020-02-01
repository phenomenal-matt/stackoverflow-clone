/**
 *
 *
 * @class ExtendableError
 * @extends {Error}
 */
class ExtendableError extends Error {
  constructor({ code, message, errors, stack }) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.stack = stack;
    this.code = code;
  }
}

module.exports = ExtendableError;
