# Knex Utils

Common utilities for knex.js

## DB migration/seeding example with gulp

const knexUtils = require('knex-utils');

gulp.task('migrateDb', (cb) => {
  knexUtils.tools.migrateDb('./db/migrations', 'migrations')
    .then(() => knexUtils.tools.closeConnection().then(() => cb()))
    .catch(() => knexUtils.tools.closeConnection().then(() => cb()));
});

gulp.task('cleanDb', (cb) => {
  knexUtils.tools.cleanDb(['TABLE_1', 'TABLE_2'])
    .then(() => knexUtils.tools.closeConnection().then(() => cb()))
    .catch(() => knexUtils.tools.closeConnection().then(() => cb()));
});

gulp.task('seedDb', (cb) => {
  knexUtils.tools.seedDb('./db/seeds')
    .then(() => {
      setTimeout(() => {
        knexUtils.tools.closeConnection().then(() => cb());
        // this totally shouldn't be necessary but otherwise it tries to close connection with unfinished calls
      }, 5000);
    })
    .catch(() => knexUtils.tools.closeConnection().then(() => cb()));
});

##Example of a usage inside actual application

knex.instance.js:

const config = require('../config/config');
const logger = require('./logger');
const knexUtils = require('knex-utils');

const dbConfig = config.get('DB');

knexUtils.config.setLogger(logger);
knexUtils.config.setConfig({
  client: dbConfig.CLIENT,
  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  hostname: dbConfig.HOST,
  database: dbConfig.DATABASE,
  connectionTimeout: dbConfig.ACQUIRE_CONNECTION_TIMEOUT,
  minPoolSize: dbConfig.MIN_POOL_SIZE,
  maxPoolSize: dbConfig.MAX_POOL_SIZE,
  heartbeatQuery: dbConfig.HEARTBEAT_QUERY
});

module.exports = dbUtils.knexHelperFactory.getInstance();



let knex = require('../helpers/knex.instance').getKnexInstance();

