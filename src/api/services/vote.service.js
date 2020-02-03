const httpStatus = require('http-status');
const _ = require('lodash');
const Question = require('../models/question.model');
const Vote = require('../models/vote.model');
const APIError = require('../extensions/APIError');
const result = require('../utils/constants/result.constant');

/**
 * @class VoteService
 */
class VoteService {
  /**
   * @param {express.Request} req Express request param
   * @param {express.Response} res Express response param
   */
  static async voteQuestion(req, res) {
    const questionId = req.params.id;
    const { vote: userVote } = req.body;
    const { user } = req;

    const voteValue = userVote === 'up' ? 1 : -1;
    const question = await Question.findById(questionId);
    if (!question) {
      throw new APIError({
        message: 'Question not found',
        status: httpStatus.NOT_FOUND
      });
    }
    if (question.author == user._id) {
      throw new APIError({
        message: 'Cannot vote for your own question',
        status: httpStatus.BAD_REQUEST
      });
    }

    // Check if user has previously cast a vote for this question
    let existingVote = await Vote.findOne({
      voter: user._id,
      question: questionId
    });
    if (existingVote) {
      // user has cast a vote before but wants to change or undo the vote
      return await VoteService.modifyVote(
        voteValue,
        existingVote,
        questionId,
        res
      );
    } else {
      return await VoteService.castNewVote(user, questionId, voteValue, res);
    }
  }

  static async modifyVote(voteValue, existingVote, questionId, res) {
    let message;
    if (voteValue != existingVote.value) {
      //change the user's vote
      await Vote.updateOne(
        { _id: existingVote._id },
        {
          value: voteValue
        }
      );

      const voteCountModifier = 2 * voteValue;
      await Question.updateOne(
        { _id: questionId },
        {
          $inc: { voteCount: voteCountModifier }
        }
      );
      message = 'Vote was changed successfully';
    } else {
      //   remove the user's vote
      await existingVote.remove();
      await Question.updateOne(
        { _id: questionId },
        {
          $pull: { votes: existingVote._id },
          $inc: { voteCount: 0 - voteValue }
        }
      );
      message = 'Vote was removed successfully';
    }

    const response = {
      result: result.SUCCESS,
      data: { message }
    };
    return res.status(httpStatus.OK).send(response);
  }

  static async castNewVote(user, questionId, voteValue, res) {
    const vote = new Vote({
      voter: user._id,
      question: questionId,
      value: voteValue
    });
    await vote.save();
    await Question.updateOne(
      { _id: questionId },
      {
        $push: { votes: vote._id },
        $inc: { voteCount: voteValue }
      }
    );
    const prefix = voteValue === 1 ? 'up' : 'down';
    const message = `Question ${prefix}voted successfully`;

    const response = {
      result: result.SUCCESS,
      data: { message }
    };
    return res.status(httpStatus.OK).send(response);
  }
}
module.exports = VoteService;
