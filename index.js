'use strict';
var Promise = require('promise/core'),
		doc = global.document,
		cached = {};

module.exports = function promisescript(src) {
	var promise;
	// if the script is cached, resolve with the original promise;
	if (cached[src]) {
		return cached[src];
	}

	promise = new Promise(function(resolve, reject) {
		function loadScript(script) {
			script.onload = function() {
				this.onload = this.onerror = null;
				resolve();
			};

			script.onerror = function() {
				this.onload = this.onerror = null;
				reject(new Error('Failed to load ' + src));
			};
		}

		function loadScriptIE(script) {
			script.onreadystatechange = function() {
				if (this.readyState !== 'complete') {
					return;
				}

				this.onreadystatechange = null;
				resolve();
			};
		}

		var head = doc.head || doc.getElementsByTagName('head')[0];
		var script = doc.createElement('script');
		script.type = 'text/javascript';
		script.charset = 'utf8';
		script.async = true;
		script.src = src;

		var loader = 'onload' in script ? loadScript : loadScriptIE;
		loader(script);

		head.appendChild(script);
	});

	cached[src] = promise;
	return promise;
};
