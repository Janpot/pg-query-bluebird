'use strict';

var query = require('..');
var assert = require('chai').assert;

describe('query', function () {

  it('works with no values', function() {
    return query('SELECT 123 as val')
      .then(function(rows) {
        assert.isArray(rows);
        assert.lengthOf(rows, 1);
        assert.equal(rows[0].val, 123);
      });
  });

  it('works with no values multiple queries', function() {
    return query('SELECT 123 as val; SELECT 456 as val;')
      .then(function(rows) {
        assert.isArray(rows);
        assert.lengthOf(rows, 2);
        assert.equal(rows[0].val, 123);
        assert.equal(rows[1].val, 456);
      });
  });

  it('works with values', function() {
    return query('SELECT $1::text as val', ['the value'])
      .then(function(rows) {
        assert.isArray(rows);
        assert.lengthOf(rows, 1);
        assert.equal(rows[0].val, 'the value');
      });
  });

  it('should execute multiple queries', function () {
    return query([
      'SELECT 123 as val',
      'SELECT 456 as val',
      'SELECT 789 as val'
    ])
      .then(function (result) {
        assert.lengthOf(result, 3);
        assert.deepEqual(result[0], [{ val: 123 }]);
        assert.deepEqual(result[1], [{ val: 456 }]);
        assert.deepEqual(result[2], [{ val: 789 }]);
      });
  });

});

describe('query.single', function () {

  it('works with no values', function() {
    return query.single('SELECT 123 as val')
      .then(function(row) {
        assert.isObject(row);
        assert.equal(row.val, 123);
      });
  });

  it('works with values', function() {
    return query.single('SELECT $1::text as val', ['the value'])
      .then(function(row) {
        assert.isObject(row);
        assert.equal(row.val, 'the value');
      });
  });

  it('should execute multiple queries', function () {
    return query.single([
      'SELECT 123 as val',
      'SELECT 456 as val',
      'SELECT 789 as val'
    ])
      .then(function (result) {
        assert.lengthOf(result, 3);
        assert.deepEqual(result[0], { val: 123 });
        assert.deepEqual(result[1], { val: 456 });
        assert.deepEqual(result[2], { val: 789 });
      });
  });

});

describe('query.raw', function () {

  it('works with no values', function() {
    return query.raw('SELECT 123 as val')
      .then(function(result) {
        assert.isObject(result);
        var rows = result.rows;
        assert.lengthOf(rows, 1);
        assert.equal(rows[0].val, 123);
      });
  });

  it('works with no values multiple queries', function() {
    return query.raw('SELECT 123 as val; SELECT 456 as val;')
      .then(function(result) {
        assert.isObject(result);
        var rows = result.rows;
        assert.lengthOf(rows, 2);
        assert.equal(rows[0].val, 123);
        assert.equal(rows[1].val, 456);
      });
  });

  it('works with values', function() {
    return query.raw('SELECT $1::text as val', ['the value'])
      .then(function(result) {
        assert.isObject(result);
        var rows = result.rows;
        assert.lengthOf(rows, 1);
        assert.equal(rows[0].val, 'the value');
      });
  });

  it('should execute multiple queries', function () {
    return query.raw([
      'SELECT 123 as val',
      'SELECT 456 as val',
      'SELECT 789 as val'
    ])
      .then(function (result) {
        assert.lengthOf(result, 3);
        assert.deepEqual(result[0].rows, [{ val: 123 }]);
        assert.deepEqual(result[1].rows, [{ val: 456 }]);
        assert.deepEqual(result[2].rows, [{ val: 789 }]);
      });
  });

});
