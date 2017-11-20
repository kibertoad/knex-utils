const dbConfig = require('./db-config');
const KnexHelper = require('./knex.helper');

const knexHelperInstanceMap = new Map();

/**
 * Create or get knex helper instance
 *
 * @param [configMap]
 * @param [logger]
 * @param [reload=true]
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

module.exports = {getInstance};
