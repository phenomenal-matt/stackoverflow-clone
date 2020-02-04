const httpStatus = require('http-status');
const _ = require('lodash');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');
const APIError = require('../extensions/APIError');
const result = require('../utils/constants/result.constant');
const notifier = require('../utils/notifier/mail.notifier');
const logger = require('../../config/logger');

/**
 * @class QuestionService
 */
class QuestionService {
  /**
   * @param {express.Request} req Express request param
   * @param {express.Response} res Express response param
   */
  static async ask(req, res) {
    const { title, body, subscribe } = req.body;
    const { user } = req;

    let question = new Question({
      title,
      body,
      subscribe,
      author: user._id
    });
    await question.save();
    await User.updateOne(
      { _id: user._id },
      { $push: { questions: question._id } }
    );
    question = await Question.findById(question._id).populate('author', 'name');

    const response = {
      result: result.SUCCESS,
      data: question
    };
    return res.status(httpStatus.OK).send(response);
  }

  /**
   * @param {express.Request} req Express request param
   * @param {express.Response} res Express response param
   */
  static async list(req, res) {
    const questions = await Question.find({})
      .populate('author', 'name')
      .populate('answer', 'body');

    const response = {
      result: result.SUCCESS,
      data: questions
    };
    return res.status(httpStatus.OK).send(response);
  }

  /**
   * @param {express.Request} req Express request param
   * @param {express.Response} res Express response param
   */
  static async fetch(req, res) {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('author', 'name')
      .populate('answers', 'body');

    if (!question) {
      throw new APIError({
        message: 'Question not found',
        status: httpStatus.NOT_FOUND
      });
    }

    const response = {
      result: result.SUCCESS,
      data: question
    };
    return res.status(httpStatus.OK).send(response);
  }

  /**.
   * @param {express.Request} req Express request param
   * @param {express.Response} res Express response param
   */
  static async answer(req, res) {
    const { id: questionId } = req.params;
    const { body } = req.body;
    const { user } = req;

    const question = await Question.findById(questionId).populate(
      'author',
      'name email'
    );
    if (!question) {
      throw new APIError({
        message: 'Question not found',
        status: httpStatus.NOT_FOUND
      });
    }
    const answer = new Answer({
      body,
      author: user._id,
      question: questionId
    });
    await answer.save();
    await User.updateOne({ _id: user._id }, { $push: { answers: answer._id } });
    await Question.updateOne(
      { _id: questionId },
      { $push: { answers: answer._id } }
    );

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'name')
      .populate('question', 'title');
    if (question.subscribe) {
      //Send email notification to the user who asked the question
      const message = `Dear ${question.author.name}<br/> Your question ${question.title} has received a new answer.<br/>`;
      try {
        await notifier.send(
          question.author.email,
          'New Answer to your question',
          message
        );
      } catch (err) {
        logger.info(err);
      }
    }

    const response = {
      result: result.SUCCESS,
      data: populatedAnswer
    };
    return res.status(httpStatus.OK).send(response);
  }
}
module.exports = QuestionService;
