const Joi = require('@hapi/joi');

module.exports = {
  // POST /v1/auth/register
  registerSchema: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .max(128)
      .required(),
    name: Joi.string()
      .max(128)
      .required()
  }).unknown(true),

  // POST /v1/auth/login
  loginSchema: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .max(128)
  }).unknown(true)
};
