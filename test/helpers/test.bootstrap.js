const sinon = require('sinon');

beforeEach(() => {
  global.sinon = sinon.createSandbox();
});

afterEach(() => {
  global.sinon.restore();
});
