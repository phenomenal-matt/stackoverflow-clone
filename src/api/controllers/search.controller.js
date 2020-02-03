const SearchService = require('../services/search.service');

/**
 * Vote a question
 * @public
 */
exports.search = async (req, res, next) => {
  try {
    return await SearchService.search(req, res);
  } catch (error) {
    next(error);
  }
};
