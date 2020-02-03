const VoteService = require('../services/vote.service');

/**
 * Vote a question
 * @public
 */
exports.voteQuestion = async (req, res, next) => {
  try {
    return await VoteService.voteQuestion(req, res);
  } catch (error) {
    next(error);
  }
};
