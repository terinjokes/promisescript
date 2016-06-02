'use strict';
/* globals describe, it */
var assert = require('proclaim');
var checkGlobal = require('../lib/check-global');

describe('checkGlobal', function () {
  it('should return the input value if the value is falsy', function () {
    var check = checkGlobal(0);

    assert.strictEqual(check, 0);
  });

  it('should return a simple global if it exists', function () {
    global.test1 = 'testing';
    var check = checkGlobal('test1');

    assert.strictEqual(check, 'testing');

    delete global.test1;
  });

  it('should return a complex global if it exists', function () {
    global.test2 = {
      deeply: {
        nested: 54
      }
    };
    var check = checkGlobal('test2.deeply.nested');

    assert.strictEqual(check, 54);

    delete global.test2;
  });

  it('should return undefined if the simple global doesn\'t exist', function () {
    var check = checkGlobal('test3');

    assert.isUndefined(check);
  });

  it('should return undefined if the complex global doesn\'t exist', function () {
    var check = checkGlobal('test4.deeply.nested');

    assert.isUndefined(check);
  });
});
