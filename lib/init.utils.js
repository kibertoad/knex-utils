const validate = require('validation-utils');
const registryUtils = require('./registry.utils');
const Knex = require('knex');

/**
 * Get Knex instance without validating the connection
 * @param {Object} config - Knex config
 * @param [registry]
 * @param [logger]
 * @returns {Object} knex instance. Note that connection is not validated to be correct - make sure to run heartbeat check on it
 */
function getKnexInstance(config, registry = registryUtils.getRegistry(), logger = console) {
  validate.notNil(config, 'Config is null or undefined');
  validate.notNil(config.client, 'DB client is null or undefined');

  const { host, database, user } = config.connection;
  const connectionTimeout = config.acquireConnectionTimeout;

  logger.info(`Init db: ${user}/<Password omitted>@${host} db: ${database}`);
  logger.info(`Timeout: ${connectionTimeout}`);

  const knex = module.exports._initKnexInstance(config);
  registryUtils.registerKnexInstance(knex, registry);
  // unfortunately, we can't check heartbeat here and fail-fast, as this initialization is synchronous
  return knex;
}

function _initKnexInstance(config) {
  return Knex(config);
}

module.exports = {
  getKnexInstance,
  _initKnexInstance
};
