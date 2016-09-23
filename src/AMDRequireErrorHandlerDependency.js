/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/
var NullDependency = require("webpack/lib/dependencies/NullDependency");
var DepBlockHelpers = require("webpack/lib/dependencies/DepBlockHelpers");

function AMDRequireDependency(block) {
	NullDependency.call(this);
	this.block = block;
}
module.exports = AMDRequireDependency;

AMDRequireDependency.prototype = Object.create(NullDependency.prototype);
AMDRequireDependency.prototype.constructor = AMDRequireDependency;

AMDRequireDependency.Template = function AMDRequireDependencyTemplate() {};

AMDRequireDependency.Template.prototype.apply = function(dep, source, outputOptions, requestShortener) {
	var depBlock = dep.block;
	var wrapper = DepBlockHelpers.getLoadDepBlockWrapper(depBlock, outputOptions, requestShortener, "require");
	if(depBlock.arrayRange && !depBlock.successCallbackRange) {
		source.replace(depBlock.outerRange[0], depBlock.arrayRange[0]-1,
			wrapper[0] + "function() {");
		source.replace(depBlock.arrayRange[1], depBlock.outerRange[1]-1, ";}" + wrapper[1]);
	} else if(!depBlock.arrayRange && depBlock.successCallbackRange) {
		source.replace(depBlock.outerRange[0], depBlock.successCallbackRange[0]-1,
			wrapper[0] + "function() {(");
		source.replace(depBlock.successCallbackRange[1], depBlock.outerRange[1]-1, ".call(exports, __webpack_require__, exports, module));}" + wrapper[1]);
	} else if(depBlock.arrayRange && depBlock.successCallbackRange) {
		source.replace(depBlock.outerRange[0], depBlock.arrayRange[0]-1,
			wrapper[0] + "function() { ");
		source.insert(depBlock.arrayRange[0] + 0.9, "var __WEBPACK_AMD_REQUIRE_ARRAY__ = ");
		source.replace(depBlock.arrayRange[1], depBlock.successCallbackRange[0]-1, "; (");
		source.insert(depBlock.successCallbackRange[1], ".apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));");

		var sourceExtra = "";
		if (depBlock.errorCallbackRange) {
			sourceExtra = ".catch(" + source._source._value.substring(depBlock.errorCallbackRange[0], depBlock.errorCallbackRange[1]) + ")"
		}

		source.replace(depBlock.successCallbackRange[1], depBlock.outerRange[1] - 1, "}" + (depBlock.bindThis ? ".bind(this)" : "") + wrapper[1] + sourceExtra);
	}
};

