# pg-query-bluebird
Simplified postgres querying with bluebird

## Description

Run queries with node-postgres with less boilerplate.
Similar to [pg-query](https://www.npmjs.com/package/pg-query) but uses [bluebird](https://www.npmjs.com/package/bluebird).

## Basic Usage

You'll habe to install [pg](https://www.npmjs.com/package/pg) separately

```js
var query = require('pg-query-bluebird');

query('SELECT NOW()')
  .then(function(rows) {
    console.log(rows[0]);
  });
```

## API

### `Promise<Array<Object>> query(String text | Object query, [Array<dynamic> values])`

Query the db, returns an array of rows.

### `Promise<Object> query.single(String text | Object query, [Array<dynamic> values])`

Query a single row.

### `Promise<Object> query.raw(String text | Object query, [Array<dynamic> values])`

Query the db, returns a full result `result.rows`,...

### `Disposer query.connect([String connStr | Object connParams])`

Disposer to use with bluebird's `Promise.using`. Automatically releases the client back to the pool after use.

```js
var Promise = require('bluebird');
var query = require('pg-query-bluebird');

var CONN_STR = '...';

var rows = Promise.using(query.connect(CONN_STR), function (query) {
  return query('SELECT NOW()');
  // return query.single(...)
  // return query.raw(...)
});
```
