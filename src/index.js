const { port, env } = require('./config/environment-variables');
const app = require('./config/express');
const logger = require('./config/logger');
const mongoose = require('./config/mongoose');

// open mongoose connection
mongoose.initialize();

const server = app.listen(port, () => {
  logger.info(`server started on port ${port} (${env})`);
  logger.info(' ');
  logger.info('OpenAPI Documetation at http://localhost:9001/docs ');
});

module.exports = server;
