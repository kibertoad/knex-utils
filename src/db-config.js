let dbLogger = console;

const dbConfMap = new Map();
const DEFAULT_DB = 'default';

/**
 * Set db config
 *
 * @param {Object} config
 */
function setConfig(config, dbKey = DEFAULT_DB) {
    dbConfMap.set(dbKey, config);
}

/**
 * Get db config
 *
 * @returns {Object}
 */
function getConfig(dbKey = DEFAULT_DB) {
    const dbConfig = dbConfMap.get(dbKey);
    if (!dbConfig) {
        throw new Error('DB module is not configured');
    }
    return dbConfig;
}

/**
 * Set logger
 *
 * @param {Object} logger
 */
function setLogger(logger) {
    dbLogger = logger;
}

/**
 * Get Logger
 *
 * @returns {Object} logger
 */
function getLogger() {
    return dbLogger;
}


module.exports = {
    DEFAULT_DB,
    setConfig,
    getConfig,
    setLogger,
    getLogger
};
