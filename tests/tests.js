'use strict';
/* globals describe, it, beforeEach */
var assert = require('proclaim'),
		promisescript = require('../index'),
		_ = require('lodash');

describe('promisescript', function() {
	it('should export a function', function() {
		assert.isFunction(promisescript);
	});

	var tests = [{
		name: 'JavaScript URL',
		success: '/base/tests/fixtures/success.js',
		failure: '/base/tests/fixtures/404.js'
	}, {
		name: 'JavaScript Objects',
		success: {
			url :'/base/tests/fixtures/success.js',
			type: 'script',
			exposed: 'exposed1'
		},
		failure: {
			url :'/base/tests/fixtures/404.js',
			type: 'script',
			exposed: 'exposed2'
		}
	}, {
		name: 'Style Sheet URL',
		success: '/base/tests/fixtures/success.css',
		failure: '/base/tests/fixtures/404.css'
	}, {
		name: 'Style Sheet Object',
		success: {
			url :'/base/tests/fixtures/success.css',
			type: 'style'
		},
		failure: {
			url :'/base/tests/fixtures/404.css',
			type: 'style'
		}
	}];

	_.forEach(tests, function(test) {
		describe(test.name, function() {
			beforeEach(function() {
				promisescript._clear();
			});

			describe('single URL', function() {
				it('should return a promise', function() {
					var promise = promisescript(test.success);
					assert.isFunction(promise.then);
				});

				it('should the same promise for the same URL', function() {
					var promise1 = promisescript(test.success);
					var promise2 = promisescript(test.success);
					assert.strictEqual(promise1, promise2);
				});

				it('should be resolved if the URL loaded successfully', function(done) {
					var promise = promisescript(test.success);
					promise.then(function() {
						done();
					})['catch'](done);
				});

				it('should be rejected if the URL is not loaded successfully', function(done) {
					var promise = promisescript(test.failure);
					promise.then(function() {
						assert.fail('resolved', 'rejected', 'Promise should have been rejected');
					})['catch'](function() {
						done();
					});
				});
			});

			describe('multiple URLs', function() {
				it('should return an array', function() {
					var promises = promisescript([test.success, test.failure]);
					assert.isArray(promises);
				});

				it('should have length 2', function() {
					var promises = promisescript([test.success, test.failure]);
					assert.lengthEquals(promises, 2);
				});

				it('should should be a promise in each position', function() {
					var promises = promisescript([test.success, test.failure]);
					_.forEach(promises, function(promise) {
						assert.isFunction(promise.then);
					});
				});

				it('should return the same promise for the same URL', function() {
					var promises = promisescript([test.success, test.success]);
					assert.strictEqual(promises[0], promises[1]);
				});
			});
		});
	});
});
