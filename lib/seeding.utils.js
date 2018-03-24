const knexHelperFactory = require('./knex.helper.factory');
const validate = require('validation-utils');
const dbConfig = require('./db-config');

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

  return knexHelper.getKnexInstance()
    .seed
    .run(config)
    .then(() => logger.info('Successfully seeded database.'))
    .catch(err => logger.error(err));
}


module.exports = {
  seedDb
};

