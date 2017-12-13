const dbConfig = require('./db-config');
const KnexHelper = require('./knex.helper');

const knexHelperInstanceMap = new Map();

/**
 * Create or get knex helper instance
 *
 * @param {Object} config
 * @param {Object} [logger]
 * @param {string} [dbKey]
 * @param {boolean} [reload=false]
 */
function getInstance(config, logger = dbConfig.getLogger(), dbKey = dbConfig.DEFAULT_DB, reload = false) {
  let knexHelperInstance = knexHelperInstanceMap.get(dbKey);
  if (reload) {
    if (knexHelperInstance) {
      knexHelperInstance.destroyKnexInstance();
      knexHelperInstanceMap.delete(dbKey);
      knexHelperInstance = null;
    }
  }

  if (!knexHelperInstance) {
    knexHelperInstance = new KnexHelper(config || dbConfig.getConfig(dbKey), logger);
    knexHelperInstanceMap.set(dbKey, knexHelperInstance);
  }
  return knexHelperInstance;
}


async function closeAllInstances() {
  const mapIter = knexHelperInstanceMap.values();
  let entry = mapIter.next();
  while (!entry.done) {
    const instance = entry.value;
    try {
      await instance.destroyKnexInstance();
    } catch (e) {
      if (instance && instance.logger) {
        instance.logger.error('Error while closing DB: ', e);
      }
    }
    entry = mapIter.next();
  }
  knexHelperInstanceMap.clear();
}

module.exports = {
  getInstance,
  closeAllInstances
};
