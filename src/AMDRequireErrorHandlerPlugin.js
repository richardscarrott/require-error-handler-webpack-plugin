/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/

var AMDRequireErrorHandlerDependency = require("./AMDRequireErrorHandlerDependency");
var NullFactory = require("webpack/lib/NullFactory");
var AMDRequireErrorHandlerDependenciesBlockParserPlugin = require("./AMDRequireErrorHandlerDependenciesBlockParserPlugin");

function AMDErrorHandlerPlugin(options) {
	this.options = options;
}
module.exports = AMDErrorHandlerPlugin;

AMDErrorHandlerPlugin.prototype.apply = function(compiler) {

	var options = this.options;

	compiler.plugin("compilation", function(compilation, params) {
		var normalModuleFactory = params.normalModuleFactory;

		compilation.dependencyFactories.set(AMDRequireErrorHandlerDependency, new NullFactory());
		compilation.dependencyTemplates.set(AMDRequireErrorHandlerDependency, new AMDRequireErrorHandlerDependency.Template());

		normalModuleFactory.plugin("parser", function(parser, options) {
			parser.apply(
				new AMDRequireErrorHandlerDependenciesBlockParserPlugin(options)
			);
		});
	});
};