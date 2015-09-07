'use strict';

var pg = require('pg');
var Promise = require('bluebird');
var pgConnect = Promise.promisify(pg.connect, pg);

var IDENTITY = function (x) { return x; };

function connect(connectionParams) {
  var done;
  return pgConnect(connectionParams)
    .spread(function(client, _done) {
      done = _done;

      function queryOne(text, values) {
        return Promise.fromNode(function (callback) {
          return client.query(text, values, callback);
        });
      }

      function queryRaw(text, values, mapFn) {
        mapFn = mapFn || IDENTITY;
        if (Array.isArray(text)) {
          return Promise.map(text, queryOne).map(mapFn);
        } else {
          return queryOne(text, values).then(mapFn);
        }
      }

      function query(text, values) {
        return queryRaw(text, values, function (result) {
          return result.rows;
        });
      }

      query.single = function (text, values) {
        return queryRaw(text, values, function (result) {
          return result.rows && result.rows[0] || null;
        });
      };

      query.raw = queryRaw;

      return query;
    })
    .disposer(function() {
      if (done) {
        done();
      }
    });
}


function queryDefault(text, values) {
  return Promise.using(connect(queryDefault.connectionParams), function (query) {
    return query(text, values);
  });
}

queryDefault.single = function (text, values) {
  return Promise.using(connect(queryDefault.connectionParams), function (query) {
    return query.single(text, values);
  });
};

queryDefault.raw = function (text, values) {
  return Promise.using(connect(queryDefault.connectionParams), function (query) {
    return query.raw(text, values);
  });
};

queryDefault.connect = connect;


module.exports = queryDefault;
