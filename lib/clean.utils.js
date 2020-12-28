const { validateNotNil } = require('validation-utils');
const tableCleaner = require('knex-tablecleaner');

/**
 * Clean db
 *
 * @param {Object} knex
 * @param {string[]} tableNames - array of table names
 * @param {object} [logger]
 * @returns {Promise}
 */
function cleanDb(knex, tableNames, logger, verboseLog = false) {
  validateNotNil(tableNames);

  return tableCleaner
    .cleanTables(knex, tableNames, verboseLog)
    .then(() => {
      if (logger) {
        logger.info('Tables cleaned successfully: ', tableNames.join(', '));
      }
    })
    .catch((err) => {
      if (logger) {
        logger.error('Error cleaning tables', err);
      }
      throw err;
    });
}

module.exports = {
  cleanDb,
};
