/* eslint-disable no-use-before-define */
const Knex = require('knex');
const validate = require('validation-utils');

class KnexHelper {
  /**
     *
     * @param {object} config
     * @param {string} config.username
     * @param {string} config.password
     * @param {string} config.hostname
     * @param {string} config.database
     * @param {number} config.connectionTimeout
     * @param {number} config.minPoolSize
     * @param {number} config.maxPoolSize
     * @param {object} logger
     * @param {object} config.heartbeatQuery
     */
  constructor(config, logger) {
    this.config = validate.notNil(config);
    this.logger = validate.notNil(logger);
    this.knex = this._initKnexConnection();
  }

  /**
     * Returns a knex instance, if there is no preinitialized one - creates new one
     * @returns {undefined|*}
     */
  getKnexInstance() {
    if (!this.knex) {
      this.knex = this._initKnexConnection();
    }

    return this.knex;
  }

  _initKnexConnection() {
    validate.notNil(this.logger, 'Logger is null or undefined');
    validate.notNil(this.config, 'Config is null or undefined');
    validate.notNil(this.config.client, 'DB client is null or undefined');

    const { host, database } = this.config.connection;
    const username = validate.notNil(this.config.connection.user, 'Username is null or undefined');
    const connectionTimeout = this.config.acquireConnectionTimeout;

    this.logger.info(`Init db: ${username}/<Password omitted>@${host}/${database}`);
    this.logger.info(`Timeout: ${connectionTimeout}`);

    return Knex(this.config);
  }

  /**
     * Destroy knex instance and release connection
     * @returns {*}
     */
  destroyKnexInstance() {
    let destroyPromise;
    if (this.knex) {
      destroyPromise = this.knex.destroy();
    } else {
      destroyPromise = Promise.resolve();
    }
    this.knex = undefined;
    return destroyPromise;
  }


  /**
     * Try to perform simple SQL query and log error if it fails
     */
  checkHeartbeat() {
    return _checkHeartbeat(this.logger, this.knex, this.config.heartbeatQuery);
  }
}

function _checkHeartbeat(logger, knex, heartbeatQuery) {
  if (!knex) {
    logger.info('Knex not initialized yet, skipping DB heartbeat check');
    return Promise.resolve(false);
  }

  return knex.raw(heartbeatQuery || 'select 1 from DUAL')
    .then(() => {
      logger.info('DB heartbeat is OK.');
      return true;
    }).catch((e) => {
      logger.error(e);
      throw new Error('DB has failed heartbeat check');
    });
}

module.exports = KnexHelper;
