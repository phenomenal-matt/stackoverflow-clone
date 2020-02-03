const express = require('express');
const authRoutes = require('./auth.route');
const questionRoutes = require('./question.route');
const voteRoutes = require('./vote.route');
const router = express.Router();

/**
 * GET v1/
 */
router.get('/', (req, res) =>
  res.send({
    name: 'Stackoverflow clone api',
    version: '1.0'
  })
);

router.use('/auth', authRoutes);
router.use('/questions', questionRoutes);
router.use('/votes', voteRoutes);
module.exports = router;
