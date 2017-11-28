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

  const logger = dbConfig.getLogger();
  const knexHelper = knexHelperFactory.getInstance();

  const config = {
    directory: migrationDirectory,
    tableName
  };

  return knexHelper.getKnexInstance().migrate.latest(config)
    .then(migrationResult => logger.info(`Successfully updated database to version: ${migrationResult}`))
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

  const logger = dbConfig.getLogger();
  const knexHelper = knexHelperFactory.getInstance();

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
function cleanDb(tableNames, knex, logger) {
  validate.notNil(tableNames);
  knex = knex || knexHelperFactory.getInstance().getKnexInstance();
  logger = logger || dbConfig.getLogger();

  const cleaner = new TableCleaner();

  return cleaner.cleanTables(knex, tableNames)
    .then(() => logger.info('Tables cleaned successfully: ', tableNames.join(', ')))
    .catch(err => logger.error('Error cleaning tables', err));
}


/**
 * Close connection and destroy knex object
 */
function closeConnection() {
  return knexHelperFactory.getInstance().destroyKnexInstance();
}

module.exports = {
  migrateDb, seedDb, cleanDb, closeConnection
};

