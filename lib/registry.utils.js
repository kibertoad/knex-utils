const _registry = [];

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
    const destructionPromise = knex.destroy()
      .catch((e) => {
        errors.push({
          knex,
          cause: e
        });
      });
    promises.push(destructionPromise);
  }
  return Promise.all(promises)
    .then(() => {
      return errors;
    });
}

/**
 *
 * @param {Object[]} errors
 * @param [logger]
 */
function logAllClosingErrors(errors, logger = console) {
  errors.forEach((error) => {
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
  getRegistry,
  logAllClosingErrors,
  registerKnexInstance
};
