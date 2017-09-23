'use strict';

let dbLogger = console,
  dbConfig;

/**
 * Set db config
 *
 * @param {Object} config
 */
function setConfig(config) {
  dbConfig = config;
}

/**
 * Get db config
 *
 * @returns {Object}
 */
function getConfig() {
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


module.exports = {setConfig, getConfig, setLogger, getLogger};
