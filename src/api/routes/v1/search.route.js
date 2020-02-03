const express = require('express');
const controller = require('../../controllers/search.controller');

const router = express.Router();

/**
 * @api {get} v1/search?
 */
router.route('/').get(controller.search);

module.exports = router;
