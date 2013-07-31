var Promise = require('promise/core');

module.exports = function promisescript(src) {
	return new Promise(function(resolve, reject) {
		var script = document.createElement('script');

		script.async = true;
		script.src = src;

		script.onerror = function() {
			reject(new Error("Failed to load: " + src));
		}

		script.onload = function() {
			resolve();
		}

		document.getElementsByTagName("head")[0].appendChild(script);
	});
}
