'use strict';

const dbConfig = require('./db-config');
const KnexHelper = require('./knex.helper');
let knexHelperInstance;

/**
 * Create or get knex helper instance
 *
 * @param [config]
 * @param [logger]
 * @param [reload=true]
 */
function getInstance(config = dbConfig.getConfig(), logger = dbConfig.getLogger(), reload=false) {
  if (reload) {
    knexHelperInstance && knexHelperInstance.destroyKnexInstance();
    knexHelperInstance = undefined;
  }

  if (!knexHelperInstance ) {
    knexHelperInstance = new KnexHelper(config, logger);
  }
  return knexHelperInstance;
}

module.exports = {getInstance};
