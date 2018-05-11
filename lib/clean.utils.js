const validate = require('validation-utils');
const tableCleaner = require('knex-tablecleaner');

/**
 * Clean db
 *
 * @param {Object} knex
 * @param {string[]} tableNames - array of table names
 * @param {object} [logger]
 * @returns {Promise}
 */
function cleanDb(knex, tableNames, logger) {
  validate.notNil(tableNames);
  logger = logger || console;

  return tableCleaner
    .cleanTables(knex, tableNames)
    .then(() => logger.info('Tables cleaned successfully: ', tableNames.join(', ')))
    .catch(err => {
      logger.error('Error cleaning tables', err);
      throw err;
    });
}

module.exports = {
  cleanDb
};
