'use strict';
var ES6Promise = require('es6-promise').Promise;
var checkGlobal = require('./lib/check-global');
var doc = global.document;
var cached = {};

function loadScript(script) {
  return new ES6Promise(function (resolve, reject) {
    script.onload = function () {
      this.onload = this.onerror = null;
      resolve();
    };

    script.onerror = function () {
      this.onload = this.onerror = null;
      reject(new Error('Failed to load ' + script.src));
    };
  });
}

/* istanbul ignore next */
function loadScriptIE(script) {
  return new ES6Promise(function (resolve) {
    script.onreadystatechange = function () {
      if (this.readyState !== 'loaded' && this.readyState !== 'complete') {
        return;
      }

      this.onreadystatechange = null;
      resolve();
    };
  });
}

function loadStyle(style) {
  return new ES6Promise(function (resolve, reject) {
    style.onload = function () {
      this.onload = this.onerror = null;
      resolve();
    };

    style.onerror = function () {
      this.onload = this.onerror = null;
      reject(new Error('Failed to load ' + style.src));
    };
  });
}

/* istanbul ignore next */
function loadStyleIE(style, id) {
  return new ES6Promise(function (resolve, reject) {
    style.onload = function () {
      var i = doc.styleSheets.length;
      var cur;

      try {
        while (i--) {
          cur = doc.styleSheets[i];
          if (cur.id === id && cur.cssText) {
            return resolve();
          }
        }
      } catch (e) {}

      return reject(new Error('Failed to load ' + style.src));
    };
  });
}

function resolver(src) {
  return new ES6Promise(function (resolve, reject) {
    var head = doc.head || /* istanbul ignore next */ doc.getElementsByTagName('head')[0];
    var element;
    var loader;
    var promise;

    if (src.type === 'style') {
      element = doc.createElement('link');
      element.rel = 'stylesheet';
      element.id = 'load-css-' + random();
      element.href = src.url;

      loader = typeof element.addEventListener === 'undefined' ? /* istanbul ignore next */ loadStyleIE : loadStyle;
      resolve(loader(element));
      head.appendChild(element);
    } else if (src.type === 'json') {
      var xhr = new global.XMLHttpRequest();
      xhr.open('GET', src.url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 /* XMLHttpRequest.DONE */) {
          xhr.onreadystatechange = null;
          if (xhr.status >= 200 && xhr.status < 400) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('Failed to load ' + src.url));
          }
        }
      };
      xhr.withCredentials = Boolean(src.withCredentials);
      xhr.send();
    } else {
      element = doc.createElement('script');
      element.charset = 'utf8';
      element.src = src.url;

      loader = 'onload' in element ? loadScript : /* istanbul ignore next */ loadScriptIE;
      promise = loader(element);

      if (src.exposed) {
        promise = promise.then(function () {
          if (typeof checkGlobal(src.exposed) === 'undefined') {
            throw new Error('Failed to load ' + src.url);
          }
        });
      }

      resolve(promise);
      head.appendChild(element);
    }
  });
}

var CSS_REGEXP = /\.css$/;
var JS_REGEXP = /\.js$/;

function normalizeSource(src) {
  if (isPlainObject(src)) {
    return src;
  }

  var type;
  if (CSS_REGEXP.test(src)) {
    type = 'style';
  } else if (JS_REGEXP.test(src)) {
    type = 'script';
  } else {
    type = 'json';
  }

  return {
    url: src,
    type: type
  };
}

function cacheKey(src) {
  var separate = '!';
  return separate + src.type + separate + src.url;
}

function isPlainObject(value) {
  return ({}).toString.call(value) === '[object Object]';
}

function random() {
  /* jshint bitwise:false */
  return ~~(Math.random() * (1E5 + 1));
}

var isArray = Array.isArray || /* istanbul ignore next */ function (val) {
  return ({}).toString.call(val) === '[object Array]';
};

module.exports = function promisescript(srcs) {
  var promises = [];
  var shouldReturnArray = true;
  var promise;
  var i;
  var length;
  var src;
  var key;

  if (!isArray(srcs)) {
    srcs = [srcs];
    shouldReturnArray = false;
  }

  length = srcs.length;
  for (i = 0; i < length; i++) {
    src = normalizeSource(srcs[i]);
    key = cacheKey(src);

    // if the result cached, resolve with the original promise;
    if (cached[key]) {
      promises.push(cached[key]);
      continue;
    }

    promise = resolver(src);

    cached[key] = promise;
    promises.push(promise);
  }

  if (!shouldReturnArray) {
    return promises[0];
  }

  return promises;
};

module.exports.clear = function clear() {
  cached = {};
};
