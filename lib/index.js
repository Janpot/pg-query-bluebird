'use strict';

var pg = require('pg');
var Promise = require('bluebird');
var pgConnect = Promise.promisify(pg.connect, pg);

function connect(connectionParams) {
  var done;
  return pgConnect(connectionParams)
    .spread(function(client, _done) {
      done = _done;

      function queryRaw(text, values) {
        return Promise.fromNode(function (callback) {
          return client.query(text, values, callback);
        });
      }

      function query(text, values) {
        return queryRaw(text, values).get('rows');
      }

      query.single = function (text, values) {
        return query(text, values)
          .then(function (rows) {
            return rows && rows[0] || null;
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
  return Promise.using(connect(), function (query) {
    return query(text, values);
  });
}

queryDefault.single = function (text, values) {
  return Promise.using(connect(), function (query) {
    return query.single(text, values);
  });
};

queryDefault.raw = function (text, values) {
  return Promise.using(connect(), function (query) {
    return query.raw(text, values);
  });
};

queryDefault.connect = connect;


module.exports = queryDefault;
