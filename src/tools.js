'use strict';

const knexHelperFactory = require('./knex.helper.factory');
const validate = require('validation-utils');
const dbConfig = require('./db-config');
const TableCleaner = require('knex-tablecleaner');

/**
 * Migrate db
 *
 * @param {string} migrationDirectory - migration path
 * @param {string} [tableName=migrations] - db table name
 * @returns {Promise.<T>}
 */
function migrateDb(migrationDirectory, tableName = 'migrations') {
  validate.notNil(migrationDirectory);
  validate.notNil(tableName);

  let logger = dbConfig.getLogger();
  let knexHelper = knexHelperFactory.getInstance();

  const config = {
    directory: migrationDirectory,
    tableName: tableName
  };

  return knexHelper.getKnexInstance().migrate.latest(config)
    .then(migrationResult => logger.info('Successfully updated database to version: ' + migrationResult))
    .catch(err => logger.error(err));
}

/**
 * Seed db
 *
 * @param {string} seedDirectory - seed directory
 * @returns {Promise.<T>}
 */
function seedDb(seedDirectory) {
  validate.notNil(seedDirectory);

  let logger = dbConfig.getLogger();
  let knexHelper = knexHelperFactory.getInstance();

  const config = {
    directory: seedDirectory
  };

  return knexHelper.getKnexInstance().seed.run(config)
    .then(() => logger.info('Successfully seeded database.'))
    .catch(err => logger.error(err));
}


/**
 * Clean db
 *
 * @param {string[]} tableNames - array of table names
 * @returns {Promise}
 */
function cleanDb(tableNames) {
  validate.notNil(tableNames);

  let logger = dbConfig.getLogger();
  let knexHelper = knexHelperFactory.getInstance();
  let cleaner = new TableCleaner();

  return cleaner.cleanTables(knexHelper.getKnexInstance(), tableNames)
    .then(() => logger.info('Tables cleaned successfully: ', tableNames.join(', ')))
    .catch((err) => logger.error('Error cleaning tables', err));
}


/**
 * Close connection and destroy knex object
 */
function closeConnection() {
  return knexHelperFactory.getInstance().destroyKnexInstance();
}

module.exports = {migrateDb, seedDb, cleanDb, closeConnection};

