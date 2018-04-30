const HEARTBEAT_QUERIES = Object.freeze({
  ORACLE: 'select 1 from DUAL',
  POSTGRESQL: 'SELECT 1',
  MYSQL: 'SELECT 1',
  MSSQL: 'SELECT 1',
  SQLITE: 'SELECT 1',
  DEFAULT: 'SELECT 1'
});

/**
 *
 * @param {Object} knex - Knex instance
 * @param {string} heartbeatQuery - SQL query that will be executed to check if connection is valid
 * @returns {Object|undefined} wrapped error if connection is not valid, wrapped 'isOk: true' if it is valid, undefined if connection does not yet exist
 */
function checkHeartbeat(knex, heartbeatQuery = HEARTBEAT_QUERIES.DEFAULT) {
  if (!knex) {
    return Promise.resolve(undefined);
  }

  return knex
    .raw(heartbeatQuery)
    .then(() => {
      return {
        isOk: true
      };
    })
    .catch(e => {
      return {
        isOk: false,
        error: e
      };
    });
}

module.exports = {
  checkHeartbeat,
  HEARTBEAT_QUERIES
};
