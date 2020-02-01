const express = require('express');
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


module.exports = router;
