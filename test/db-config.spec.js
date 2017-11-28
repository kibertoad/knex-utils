/* eslint-disable no-unused-expressions */

'use strict';

const { expect } = require('chai');
const dbConfig = require('../src/db-config');
require('./helpers/test.bootstrap');

describe('DB utils config', () => {
  const configData = {
    connection: {
      host: 'host',
      user: 'user',
      password: 'password',
      database: 'database'
    }

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
    const originalLogger = dbConfig.getLogger();
    const logger = () => {
    };

    dbConfig.setLogger(logger);
    expect(dbConfig.getLogger()).to.equal(logger);

    dbConfig.setLogger(originalLogger);
  });
});
