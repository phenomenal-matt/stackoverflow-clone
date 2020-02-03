const express = require('express');
const validate = require('../../middlewares/validate');
const isAuthorized = require('../../middlewares/isAuthorized');
const validateObjectId = require('../../middlewares/validateObjectId');
const controller = require('../../controllers/question.controller');
const {
  askSchema,
  answerSchema
} = require('../../validations/question.validation');

const router = express.Router();

/**
 * @api {post} v1/question/
 */
router.route('/').post(isAuthorized, validate(askSchema), controller.ask);

/**
 * @api {get} v1/questions/
 */
router.route('/').get(controller.list);

/**
 * @api {get} v1/questions/:id
 */
router.route('/:id').get(validateObjectId, controller.fetch);
/**
 * @api {post} v1/questions/:id
 */
router
  .route('/:id')
  .post(
    isAuthorized,
    validateObjectId,
    validate(answerSchema),
    controller.answer
  );

module.exports = router;
