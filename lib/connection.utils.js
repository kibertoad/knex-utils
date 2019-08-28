const validate = require('validation-utils').validationHelper;
const Knex = require('knex');

const _registry = [];

/**
 * Get Knex instance without validating the connection
 * @param {Object} config - Knex config
 * @param [registry]
 * @param [logger]
 * @returns {Object} knex instance. Note that connection is not validated to be correct - make sure to run heartbeat check on it
 */
function getKnexInstance(config, registry = _registry, logger = console) {
  validate.notNil(config, 'Config is null or undefined');
  validate.notNil(config.client, 'DB client is null or undefined');

  const { host, database, user } = config.connection;
  const connectionTimeout = config.acquireConnectionTimeout;

  logger.info(`Init db: ${user}/<Password omitted>@${host} db: ${database}`);
  logger.info(`Timeout: ${connectionTimeout}`);

  const knex = module.exports._initKnexInstance(config);
  module.exports.registerKnexInstance(knex, registry);
  // unfortunately, we can't check heartbeat here and fail-fast, as this initialization is synchronous
  return knex;
}

function _initKnexInstance(config) {
  return Knex(config);
}

/**
 * Attempts to close all registered knex instances
 * @param {Object[]} [registry]
 * @returns {Promise<Object[]>} List of errors that occured during closing operations
 */
function closeAllInstances(registry = _registry) {
  const promises = [];
  const errors = [];
  while (registry.length > 0) {
    const knex = registry.pop();
    const destructionPromise = knex.destroy().catch(e => {
      errors.push({
        knex,
        cause: e
      });
    });
    promises.push(destructionPromise);
  }
  return Promise.all(promises).then(() => {
    return errors;
  });
}

/**
 *
 * @param {Object[]} errors
 * @param [logger]
 */
function logAllClosingErrors(errors, logger = console) {
  errors.forEach(error => {
    const knexConfig = error.knex.client.config.connection;
    const formattedDbDescriptor = `${knexConfig.user}@${knexConfig.host}:${knexConfig.database}`;
    logger.error(`Failed to close DB connection (${formattedDbDescriptor}): `, error.cause);
  });
}

/**
 * @returns {Object[]}
 */
function getRegistry() {
  return _registry;
}

/**
 *
 * @param {Object} knex
 * @param {Object[]} [registry]
 */
function registerKnexInstance(knex, registry = _registry) {
  registry.push(knex);
}

module.exports = {
  closeAllInstances,
  getKnexInstance,
  getRegistry,
  logAllClosingErrors,
  registerKnexInstance,
  _initKnexInstance
};
