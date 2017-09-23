'use strict';

const expect = require('chai').expect;
const dbConfig = require('../src/db-config');

describe('DB utils config', () => {
  let configData = {
    username: 'user',
    password: 'password',
    hostname: 'host',
    database: 'database'
  };

  it('should throw exception if config not set', () => {
    expect(dbConfig.getConfig).to.throw('DB module is not configured');
  });

  it('should set and get config data', () => {
    dbConfig.setConfig(configData);
    expect(dbConfig.getConfig()).to.equal(configData);
    dbConfig.setConfig(undefined); // restore default value
  });

  it('should have default logger', () => {
    expect(dbConfig.getLogger()).to.not.empty;
  });

  it('should set and get logger', () => {
    let originalLogger = dbConfig.getLogger();
    let logger = function () {
    };

    dbConfig.setLogger(logger);
    expect(dbConfig.getLogger()).to.equal(logger);

    dbConfig.setLogger(originalLogger);
  });
});
