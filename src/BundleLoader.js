/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/


// TODO:
// - Add support for lazy
// - Adds support for default wrapper when chunks are merged... *this is prob more
// an issue with RequireEnsureErrorHandlerPlugin* and *AMDRequireErrorHandlerPlugin*.


var loaderUtils = require("loader-utils");

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
	this.cacheable && this.cacheable();
	var query = loaderUtils.parseQuery(this.query);
	if(query.name) {
		var options = {
			context: query.context || this.options.context,
			regExp: query.regExp
		};
		var chunkName = loaderUtils.interpolateName(this, query.name, options);
		var chunkNameParam = ", " + JSON.stringify(chunkName);
	} else {
		var chunkNameParam = '';
	}
	var result;
	if(query.lazy) {
		result = [
			"module.exports = function(cb) {\n",
			"	require.ensure([], function(require) {\n",
			"		cb(require(", JSON.stringify("!!" + remainingRequest), "));\n",
			"	}" + chunkNameParam + ");\n",
			"}"];
	} else {
		result = [
			"var cbs,\n",
			"	data,\n",
			"	error = false;\n",
			"module.exports = function(successCallback, errorCallback) {\n",
			"	errorCallback = errorCallback || function() {};\n",
			"	if (data) {\n",
			"		successCallback(data);\n",
			"	} else {\n",
			"		if (error) {\n",
			"			// Try again.\n",
			"			requireBundle();\n",
			"		}\n",
			"		cbs.push({\n",
			"			success: successCallback,\n",
			"			error: errorCallback\n",
			"		});\n",
			"	}\n",
			"}\n",
			"function requireBundle() {\n",
			"	cbs = []\n",
			"	require.ensure([], function() {\n",
			"		data = require(", JSON.stringify("!!" + remainingRequest), ");\n",
			"		for(var i = 0, l = cbs.length; i < l; i++) {\n",
			"			cbs[i].success(data);\n",
			"		}\n",
			"		error = false;\n",
			"		cbs = null;\n",
			"	}, function() {\n",
			"		for(var i = 0, l = cbs.length; i < l; i++) {\n",
			"			cbs[i].error();\n",
			"		}\n",
			"		error = true;\n",
			"		cbs = null;\n",
			"	}" + chunkNameParam + ");\n",
			"};\n",
			"requireBundle();"
		];
	}
	return result.join("");
}

/*
Output format:

	var cbs = [],
		data;
	module.exports = function(cb) {
		if(cbs) cbs.push(cb);
		else cb(data);
	}
	require.ensure([], function(require) {
		data = require("xxx");
		var callbacks = cbs;
		cbs = null;
		for(var i = 0, l = callbacks.length; i < l; i++) {
			callbacks[i](data);
		}
	});

	WITH ERROR HANDLING:

	// lazy
	module.exports = function(successCallback, errorCallback) {
		require.ensure([], function(require) {\n",
			successCallback(require(", JSON.stringify("!!" + remainingRequest), "));
		}, function() {
			if (errorCallback) errorCallback.apply(this, arguments);
		}, 'name');
	}

	// regular...what's the point in regular; can lazy not always cover this use case?
	var cbs,
		data,
		error = false;

	module.exports = function(successCallback, errorCallback) {
		errorCallback = errorCallback || function() {};
		if (data) {
			successCallback(data);
		} else {
			if (error) {
				// Try, try, try again.
				requireBundle();
			}
			cbs.push({
				success: successCallback,
				error: errorCallback
			});
		}
	}

	function requireBundle() {
		cbs = [];
		__webpack_require__.e/* nsure *(1, function() {
			data = __webpack_require__(2);
			for(var i = 0, l = cbs.length; i < l; i++) {
				cbs[i].success(data);
			}
			error = false;
			cbs = null;
		}, function() {
			for(var i = 0, l = cbs.length; i < l; i++) {
				cbs[i].error();
			}
			error = true;
			cbs = null;
		});

	}

	requireBundle();

*/
