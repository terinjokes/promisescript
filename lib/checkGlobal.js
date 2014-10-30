'use strict';
function checkGlobal(value) {
	if (!value) {
		return value;
	}
	var g = global;
	var values = value.split('.');

	for (var i = 0, len = values.length; i < len; i++) {
		if (typeof g === 'undefined') {
			break;
		}

		g = g[values[i]];
	}

	return g;
}

module.exports = checkGlobal;
