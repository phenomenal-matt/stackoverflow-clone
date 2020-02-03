const httpStatus = require('http-status');
const _ = require('lodash');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');
const APIError = require('../extensions/APIError');
const result = require('../utils/constants/result.constant');

/**
 * @class SearchService
 */
class SearchService {
  /**
   * @param {express.Request} req Express request param
   * @param {express.Response} res Express response param
   */
  static async search(req, res) {
    const { q } = req.query;
    if (!q) {
      throw new APIError({
        message: 'Search query is absent',
        status: httpStatus.BAD_REQUEST
      });
    }
    const regExp = { $regex: new RegExp(q, 'i') };

    const questions = await Question.find({
      $or: [{ title: regExp }, { body: regExp }]
    }).select('title body');

    const users = await User.find({ name: regExp }).select('name');
    const answers = await Answer.find({ body: regExp }).select('body');

    const response = {
      result: result.SUCCESS,
      data: { questions, users, answers }
    };
    return res.status(httpStatus.OK).send(response);
  }
}
module.exports = SearchService;
