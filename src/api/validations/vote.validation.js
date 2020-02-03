const Joi = require('@hapi/joi');

module.exports = {
  // POST /v1/vote/question/:id
  voteSchema: Joi.object({
    vote: Joi.string()
      .valid('up', 'down')
      .required()
  }).unknown(true)
};
