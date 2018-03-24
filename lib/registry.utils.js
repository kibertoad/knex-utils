const registry = [];

async function closeAllInstances(logger = console) {
  await Promise.all(registry.map((knex) => {
    return knex.destroy()
      .catch((e) => {
        logger.error('Error while closing DB: ', e);
      });
  }));
  registry.length = 0;
}

function getRegistry() {
  return registry;
}

module.exports = {
  closeAllInstances,
  getRegistry
};
