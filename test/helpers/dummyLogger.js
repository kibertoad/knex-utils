/* eslint-disable no-console */

'use strict';

const dummyLogger = {
  debug: console.log,
  info: console.log,
  warn: console.log,
  error: console.log,
  fatal: console.log,
};

module.exports = dummyLogger;
