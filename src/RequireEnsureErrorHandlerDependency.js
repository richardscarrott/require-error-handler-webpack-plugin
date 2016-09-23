/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/
var NullDependency = require("webpack/lib/dependencies/NullDependency");
var DepBlockHelpers = require("webpack/lib/dependencies/DepBlockHelpers");

function RequireEnsureErrorHandlerDependency(block) {
	NullDependency.call(this);
	this.block = block;
}
module.exports = RequireEnsureErrorHandlerDependency;

RequireEnsureErrorHandlerDependency.prototype = Object.create(NullDependency.prototype);
RequireEnsureErrorHandlerDependency.prototype.constructor = RequireEnsureErrorHandlerDependency;
RequireEnsureErrorHandlerDependency.prototype.type = "require.ensure";

RequireEnsureErrorHandlerDependency.Template = function RequireEnsureErrorHandlerDependencyTemplate() {};

RequireEnsureErrorHandlerDependency.Template.prototype.apply = function(dep, source, outputOptions, requestShortener) {
	var depBlock = dep.block;
	var wrapper = DepBlockHelpers.getLoadDepBlockWrapper(depBlock, outputOptions, requestShortener, /*require.e*/ "nsure");

	var args = depBlock.expr.arguments;
	var argCount = args.length;
	var depBlockExprArgs = argCount === 3 || (depBlock.chunkName && argCount === 4) ? args[2] : null;
	var sourceExtra = "";
	if (depBlockExprArgs && depBlockExprArgs.type === "FunctionExpression") {
		sourceExtra = ".catch(" + source._source._value.substring(depBlockExprArgs.range[0], depBlockExprArgs.range[1]) + ")"
	}

	source.replace(depBlock.expr.range[0], depBlock.expr.arguments[1].range[0] - 1, wrapper[0] + "(");
	source.replace(depBlock.expr.arguments[1].range[1], depBlock.expr.range[1] - 1, ").bind(null, __webpack_require__)" + wrapper[1] + sourceExtra);
};

