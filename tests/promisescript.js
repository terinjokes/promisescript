'use strict';
/* globals describe, it, beforeEach */
var assert = require('power-assert');
var _ = require('lodash');
var promisescript = require('../index');

describe('promisescript', function () {
  it('should export a function', function () {
    assert(typeof promisescript === 'function');
  });

  var tests = [{
    name: 'JSON URL',
    success: '/base/tests/fixtures/success.json',
    failure: '/base/tests/fixtures/404.json'
  }, {
    name: 'JSON Object',
    success: {
      url: '/base/tests/fixtures/success.json'
    },
    failure: {
      url: '/base/tests/fixtures/404.json'
    }
  }, {
    name: 'JavaScript URL',
    success: '/base/tests/fixtures/success.js',
    failure: '/base/tests/fixtures/404.js'
  }, {
    name: 'JavaScript Objects',
    success: {
      url: '/base/tests/fixtures/success.js',
      type: 'script',
      exposed: 'exposed1'
    },
    failure: {
      url: '/base/tests/fixtures/404.js',
      type: 'script',
      exposed: 'exposed2'
    }
  }, {
    name: 'JavaScript Objects with a failing exposed',
    success: {
      url: '/base/tests/fixtures/success.js',
      type: 'script',
      exposed: 'exposed1'
    },
    failure: {
      url: '/base/tests/fixtures/success.js',
      type: 'script',
      exposed: 'incorrect'
    }
  }, {
    name: 'Style Sheet URL',
    success: '/base/tests/fixtures/success.css',
    failure: '/base/tests/fixtures/404.css'
  }, {
    name: 'Style Sheet Object',
    success: {
      url: '/base/tests/fixtures/success.css',
      type: 'style'
    },
    failure: {
      url: '/base/tests/fixtures/404.css',
      type: 'style'
    }
  }];

  _.forEach(tests, function (test) {
    describe(test.name, function () {
      beforeEach(function () {
        promisescript.clear();
      });

      describe('single URL', function () {
        it('should return a promise', function () {
          var promise = promisescript(test.success);
          assert(typeof promise.then === 'function');
        });

        it('should the same promise for the same URL', function () {
          var promise1 = promisescript(test.success);
          var promise2 = promisescript(test.success);
          assert.strictEqual(promise1, promise2);
        });

        it('should be resolved if the URL loaded successfully', function () {
          return promisescript(test.success);
        });

        it('should be rejected if the URL is not loaded successfully', function () {
          var promise = promisescript(test.failure);

          return promise.then(function () {
            assert.fail('resolved', 'rejected', 'Promise should have been rejected');
          }, function () {
            // do nothing
          });
        });
      });

      describe('multiple URLs', function () {
        it('should return an array', function () {
          var promises = promisescript([test.success, test.failure]);
          assert(Array.isArray(promises));
        });

        it('should have length 2', function () {
          var promises = promisescript([test.success, test.failure]);
          assert(promises.length === 2);
        });

        it('should should be a promise in each position', function () {
          var promises = promisescript([test.success, test.failure]);
          _.forEach(promises, function (promise) {
            assert(typeof promise.then === 'function');
          });
        });

        it('should return the same promise for the same URL', function () {
          var promises = promisescript([test.success, test.success]);
          assert.strictEqual(promises[0], promises[1]);
        });
      });
    });
  });

  describe('Clearing cache', function () {
    it('should remove all items from cache when no arguments are passed', function () {
      var successURL = '/base/tests/fixtures/success.js';
      var promise1;
      var promise2;

      promise1 = promisescript(successURL).then(function () {
        promisescript.clear();

        promise2 = promisescript(successURL);

        return;
      }).then(function () {
        assert.notStrictEqual(promise1, promise2);
      });

      return promise1;
    });
  });
});
