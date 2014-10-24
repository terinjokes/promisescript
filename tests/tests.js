'use strict';
/* globals describe, it */
var assert = require('proclaim'),
		promisescript = require('../index'),
		_ = require('lodash'),
		successURL = '/base/tests/fixtures/success.js',
		failURL = '/base/tests/fixtures/404.js';

describe('promisescript', function() {
	it('should export a function', function() {
		assert.isFunction(promisescript);
	});

	describe('single URL', function() {
		it('should return a promise', function() {
			var promise = promisescript(successURL);
			assert.isFunction(promise.then);
		});

		it('should the same promise for the same URL', function() {
			var promise1 = promisescript(successURL);
			var promise2 = promisescript(successURL);
			assert.strictEqual(promise1, promise2);
		});

		it('should be resolved if the URL loaded successfully', function(done) {
			var promise = promisescript(successURL);
			promise.then(function() {
				done();
			})['catch'](done);
		});

		it('should be rejected if the URL is not loaded successfully', function(done) {
			var promise = promisescript(failURL);
			promise.then(function() {
				assert.fail('resolved', 'rejected', 'Promise should have been rejected');
			})['catch'](function() {
				done();
			});
		});
	});

	describe('multiple URLs', function() {
		it('should return an array', function() {
			var promises = promisescript([successURL, failURL]);
			assert.isArray(promises);
		});

		it('should have length 2', function() {
			var promises = promisescript([successURL, failURL]);
			assert.lengthEquals(promises, 2);
		});

		it('should should be a promise in each position', function() {
			var promises = promisescript([successURL, failURL]);
			_.forEach(promises, function(promise) {
				assert.isFunction(promise.then);
			});
		});

		it('should return the same promise for the same URL', function() {
			var promises = promisescript([successURL, successURL]);
			assert.strictEqual(promises[0], promises[1]);
		});
	});
});
