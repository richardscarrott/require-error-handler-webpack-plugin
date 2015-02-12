/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/

var RequireEnsureItemDependency = require("webpack/lib/dependencies/RequireEnsureItemDependency");
var RequireEnsureErrorHandlerDependency = require("./RequireEnsureErrorHandlerDependency");
var ConstDependency = require("webpack/lib/dependencies/ConstDependency");

var NullFactory = require("webpack/lib/NullFactory");

var RequireEnsureErrorHandlerDependenciesBlockParserPlugin = require("./RequireEnsureErrorHandlerDependenciesBlockParserPlugin");

var BasicEvaluatedExpression = require("webpack/lib/BasicEvaluatedExpression");

function RequireEnsureErrorHandlerPlugin() {
}
module.exports = RequireEnsureErrorHandlerPlugin;

RequireEnsureErrorHandlerPlugin.prototype.apply = function(compiler) {
	compiler.plugin("compilation", function(compilation, params) {
		var normalModuleFactory = params.normalModuleFactory;

		compilation.dependencyFactories.set(RequireEnsureItemDependency, normalModuleFactory);
		compilation.dependencyTemplates.set(RequireEnsureItemDependency, new RequireEnsureItemDependency.Template());

		compilation.dependencyFactories.set(RequireEnsureErrorHandlerDependency, new NullFactory());
		compilation.dependencyTemplates.set(RequireEnsureErrorHandlerDependency, new RequireEnsureErrorHandlerDependency.Template());
	});
	new RequireEnsureErrorHandlerDependenciesBlockParserPlugin().apply(compiler.parser);
	compiler.parser.plugin("evaluate typeof require.ensure", function(expr) {
		return new BasicEvaluatedExpression().setString("function").setRange(expr.range);
	});
	compiler.parser.plugin("typeof require.ensure", function(expr) {
		var dep = new ConstDependency("'function'", expr.range);
		dep.loc = expr.loc;
		this.state.current.addDependency(dep);
		return true;
	});
};