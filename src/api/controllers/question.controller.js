const QuestionService = require('../services/question.service');

/**
 * Ask a question
 * @public
 */
exports.ask = async (req, res, next) => {
  try {
    return await QuestionService.ask(req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all questions
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    return await QuestionService.list(req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a questions
 * @public
 */
exports.fetch = async (req, res, next) => {
  try {
    return await QuestionService.fetch(req, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Answer a question
 * @public
 */
exports.answer = async (req, res, next) => {
  try {
    return await QuestionService.answer(req, res);
  } catch (error) {
    next(error);
  }
};
