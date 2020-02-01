const express = require('express');
const validate = require('../../middlewares/validate');
const controller = require('../../controllers/auth.controller');
const {
  loginSchema,
  registerSchema
} = require('../../validations/auth.validation');

const router = express.Router();

/**
 * @api {post} v1/auth/register
 */
router.route('/register').post(validate(registerSchema), controller.register);

/**
 * @api {post} v1/auth/login
 */
router.route('/login').post(validate(loginSchema), controller.login);

module.exports = router;
