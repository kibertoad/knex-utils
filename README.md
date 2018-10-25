# Knex Utils

Common utilities for knex.js

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][travis-image]][travis-url]

** Connection init example

```js
const config = require('config');
const { connectionUtils, heartbeatChecker } = require('knex-utils');
const HEARTBEAT_QUERY = heartbeatChecker.HEARTBEAT_QUERIES.POSTGRESQL;

const knexConfig = config.get('db'); //knex-utils directly passes config entity to knex, so see knex documentation for exact format
let _knex;

function getKnexInstance() {
	return _knex || _initKnexInstance();
}

function _initKnexInstance() {
	_knex = connectionUtils.getKnexInstance(knexConfig, connectionUtils.getRegistry(), logger);
	return _knex;
}

/**
 *
 * @returns {Object} heartbeat check result
 */
function checkHeartBeat() {
	return heartbeatChecker.checkHeartbeat(_knex, HEARTBEAT_QUERY);
}

function close() {
	if (_knex) {
		const promise = _knex.destroy();
		_knex = undefined;
		connectionUtils.getRegistry().length = 0; //ToDo implement more specific removal of connections from registry
		return promise;
	}
	return Promise.resolve();
}

module.exports = {
	getKnexInstance,
	checkHeartBeat,
	close
};
```

** Hearbeat usage example

```js
const { heartbeatChecker } = require('knex-utils');
const HEARTBEAT_QUERY = heartbeatChecker.HEARTBEAT_QUERIES.POSTGRESQL;
const knex = require('./db/db.service').getKnexInstance(); //replace with whatever method you use to obtain knex instance

const appPromise = swaggerService.generateSwagger(true) // could be any async startup activity, or you can start the chain with 'db.checkHeartBeat'
	.then(async () => {
		const dbCheckResult = await heartbeatChecker.checkHeartbeat(knex, HEARTBEAT_QUERY);;
		if (dbCheckResult.isOk === false) {
			console.error('DB connection error: ', dbCheckResult.error);
			throw (dbCheckResult.error);
		}
	})
	.then(async () => {
			const app = express();
			// <...> complete app initialization omitted
			return app;
		}
	).catch((e) => {
		console.error('Error while starting application: ', e);
		throw e;
	});

function getAppAsync() {
	return appPromise;
}

module.exports = {
	getAppAsync
};
```

[npm-image]: https://img.shields.io/npm/v/knex-utils.svg
[npm-url]: https://npmjs.org/package/knex-utils
[downloads-image]: https://img.shields.io/npm/dm/knex-utils.svg
[downloads-url]: https://npmjs.org/package/knex-utils
[travis-image]: https://img.shields.io/travis/kibertoad/knex-utils/master.svg?label=linux
[travis-url]: https://travis-ci.org/kibertoad/knex-utils
