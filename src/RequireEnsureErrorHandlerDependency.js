/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/
var NullDependency = require("webpack/lib/dependencies/NullDependency");
var DepBlockHelpers = require("webpack/lib/dependencies/DepBlockHelpers");

function RequireEnsureErrorHandlerDependency(block) {
	NullDependency.call(this);
	this.Class = RequireEnsureErrorHandlerDependency;
	this.block = block;
}
module.exports = RequireEnsureErrorHandlerDependency;

RequireEnsureErrorHandlerDependency.prototype = Object.create(NullDependency.prototype);
RequireEnsureErrorHandlerDependency.prototype.constructor = RequireEnsureErrorHandlerDependency;
RequireEnsureErrorHandlerDependency.prototype.type = "require.ensure";

RequireEnsureErrorHandlerDependency.Template = function RequireEnsureErrorHandlerDependencyTemplate() {};

RequireEnsureErrorHandlerDependency.Template.prototype.apply = function(dep, source, outputOptions, requestShortener) {
	var depBlock = dep.block;
	var wrapper = DepBlockHelpers.getLoadDepBlockWrapper(depBlock, outputOptions, requestShortener, /*require.e*/"nsure");
	var openingStart = depBlock.expr.range[0];
	var openingEnd = depBlock.expr.arguments[1].range[0]-1;
	var closingStart;
	var closingEnd = depBlock.expr.range[1]-1;
	if (!wrapper) {
		// module is in same chunk so just call success immediately.
		wrapper = [
			"!/* require.ensure */(",
			"(__webpack_require__))"
		];
		closingStart = depBlock.expr.arguments[1].range[1];
	} else {
		if (depBlock.chunkName) {
			closingStart = depBlock.expr.arguments[depBlock.expr.arguments.length - 2].range[1];
		} else {
			closingStart = depBlock.expr.arguments[depBlock.expr.arguments.length - 1].range[1];
		}
	}
	source.replace(openingStart, openingEnd, wrapper[0]);
	source.replace(closingStart, closingEnd, wrapper[1]);
};

