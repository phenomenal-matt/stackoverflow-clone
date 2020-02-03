const express = require('express');
const validate = require('../../middlewares/validate');
const isAuthorized = require('../../middlewares/isAuthorized');
const validateObjectId = require('../../middlewares/validateObjectId');
const controller = require('../../controllers/vote.controller');
const { voteSchema } = require('../../validations/vote.validation');

const router = express.Router();

/**
 * @api {post} v1/votes/question/:id
 */
router
  .route('/question/:id')
  .post(
    isAuthorized,
    validateObjectId,
    validate(voteSchema),
    controller.voteQuestion
  );

module.exports = router;
