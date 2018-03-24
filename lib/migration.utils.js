const validate = require('validation-utils');

/**
 * Migrate db
 *
 * @param {string} migrationDirectory - migration path
 * @param {string} [tableName=migrations] - db table name
 * @returns {Promise.<T>}
 */
function migrateDb(knex, migrationDirectory, tableName = 'migrations', logger) {
  validate.notNil(migrationDirectory);
  validate.notNil(tableName);

  const config = {
    directory: migrationDirectory,
    tableName
  };

  return knex.migrate.latest(config)
    .then(migrationResult => logger.info(`Successfully updated database to version: ${migrationResult}`))
    .catch(err => logger.error(err));
}


module.exports = {
  migrateDb
};

