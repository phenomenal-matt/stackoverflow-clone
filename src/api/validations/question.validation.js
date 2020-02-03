const Joi = require('@hapi/joi');

module.exports = {
  // POST /v1/question
  askSchema: Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    subscribe: Joi.boolean().default(false)
  }).unknown(true),

  // POST /v1/question/:id
  answerSchema: Joi.object({
    body: Joi.string().required()
  }).unknown(true)
};
