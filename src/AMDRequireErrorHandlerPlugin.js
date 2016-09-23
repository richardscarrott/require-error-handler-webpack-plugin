/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/
var path = require("path");
var AMDRequireErrorHandlerDependency = require("./AMDRequireErrorHandlerDependency");
var AMDRequireItemDependency = require("webpack/lib/dependencies/AMDRequireItemDependency");
var AMDRequireArrayDependency = require("webpack/lib/dependencies/AMDRequireArrayDependency");
var AMDRequireContextDependency = require("webpack/lib/dependencies/AMDRequireContextDependency");
var AMDDefineDependency = require("webpack/lib/dependencies/AMDDefineDependency");
var UnsupportedDependency = require("webpack/lib/dependencies/UnsupportedDependency");
var LocalModuleDependency = require("webpack/lib/dependencies/LocalModuleDependency");
var ConstDependency = require("webpack/lib/dependencies/ConstDependency");


var AMDRequireErrorHandlerDependenciesBlockParserPlugin = require("./AMDRequireErrorHandlerDependenciesBlockParserPlugin");
var AMDDefineDependencyParserPlugin = require("webpack/lib/dependencies/AMDDefineDependencyParserPlugin");

var AliasPlugin = require("enhanced-resolve/lib/AliasPlugin");

var BasicEvaluatedExpression = require("webpack/lib/BasicEvaluatedExpression");

var NullFactory = require("webpack/lib/NullFactory");


function AMDErrorHandlerPlugin(options, amdOptions) {
	this.amdOptions = amdOptions || {};
	this.options = options;
}
module.exports = AMDErrorHandlerPlugin;

AMDErrorHandlerPlugin.prototype.apply = function(compiler) {
	var options = this.options;
	var amdOptions = this.amdOptions;
	compiler.plugin("compilation", function(compilation, params) {
		var normalModuleFactory = params.normalModuleFactory;
		var contextModuleFactory = params.contextModuleFactory;

		compilation.dependencyFactories.set(AMDRequireErrorHandlerDependency, new NullFactory());
		compilation.dependencyTemplates.set(AMDRequireErrorHandlerDependency, new AMDRequireErrorHandlerDependency.Template());

		compilation.dependencyFactories.set(AMDRequireItemDependency, normalModuleFactory);
		compilation.dependencyTemplates.set(AMDRequireItemDependency, new AMDRequireItemDependency.Template());

		compilation.dependencyFactories.set(AMDRequireArrayDependency, new NullFactory());
		compilation.dependencyTemplates.set(AMDRequireArrayDependency, new AMDRequireArrayDependency.Template());

		compilation.dependencyFactories.set(AMDRequireContextDependency, contextModuleFactory);
		compilation.dependencyTemplates.set(AMDRequireContextDependency, new AMDRequireContextDependency.Template());

		compilation.dependencyFactories.set(AMDDefineDependency, new NullFactory());
		compilation.dependencyTemplates.set(AMDDefineDependency, new AMDDefineDependency.Template());

		compilation.dependencyFactories.set(UnsupportedDependency, new NullFactory());
		compilation.dependencyTemplates.set(UnsupportedDependency, new UnsupportedDependency.Template());

		compilation.dependencyFactories.set(LocalModuleDependency, new NullFactory());
		compilation.dependencyTemplates.set(LocalModuleDependency, new LocalModuleDependency.Template());

		params.normalModuleFactory.plugin("parser", function(parser, parserOptions) {

			if(typeof parserOptions.amd !== "undefined" && !parserOptions.amd)
				return;

			function setTypeof(expr, value) {
				parser.plugin("evaluate typeof " + expr, function(expr) {
					return new BasicEvaluatedExpression().setString(value).setRange(expr.range);
				});
				parser.plugin("typeof " + expr, function(expr) {
					var dep = new ConstDependency(JSON.stringify(value), expr.range);
					dep.loc = expr.loc;
					this.state.current.addDependency(dep);
					return true;
				});
			}

			function setExpressionToModule(expr, module) {
				parser.plugin("expression " + expr, function(expr) {
					var dep = new AMDRequireItemDependency(module, expr.range);
					dep.userRequest = expr;
					dep.loc = expr.loc;
					this.state.current.addDependency(dep);
					return true;
				});
			}

			parser.apply(
				new AMDRequireErrorHandlerDependenciesBlockParserPlugin(options),
				new AMDDefineDependencyParserPlugin(options)
			);
			setExpressionToModule("require.amd", "!!webpack amd options");
			setExpressionToModule("define.amd", "!!webpack amd options");
			setExpressionToModule("define", "!!webpack amd define");
			parser.plugin("expression __webpack_amd_options__", function() {
				return this.state.current.addVariable("__webpack_amd_options__", JSON.stringify(amdOptions));
			});
			parser.plugin("evaluate typeof define.amd", function(expr) {
				return new BasicEvaluatedExpression().setString(typeof amdOptions).setRange(expr.range);
			});
			parser.plugin("evaluate typeof require.amd", function(expr) {
				return new BasicEvaluatedExpression().setString(typeof amdOptions).setRange(expr.range);
			});
			parser.plugin("evaluate Identifier define.amd", function(expr) {
				return new BasicEvaluatedExpression().setBoolean(true).setRange(expr.range);
			});
			parser.plugin("evaluate Identifier require.amd", function(expr) {
				return new BasicEvaluatedExpression().setBoolean(true).setRange(expr.range);
			});
			setTypeof("define", "function");
			parser.plugin("can-rename define", function() {
				return true;
			});
			parser.plugin("rename define", function(expr) {
				var dep = new AMDRequireItemDependency("!!webpack amd define", expr.range);
				dep.userRequest = "define";
				dep.loc = expr.loc;
				this.state.current.addDependency(dep);
				return false;
			});
			setTypeof("require", "function");
		});
	});
	compiler.resolvers.normal.apply(
		new AliasPlugin("described-resolve", {
			name: "amdefine",
			alias: path.join(__dirname, "..", "..", "webpack", "buildin", "amd-define.js")
		}, "resolve"),
		new AliasPlugin("described-resolve", {
			name: "webpack amd options",
			alias: path.join(__dirname, "..", "..", "webpack", "buildin", "amd-options.js")
		}, "resolve"),
		new AliasPlugin("described-resolve", {
			name: "webpack amd define",
			alias: path.join(__dirname, "..", "..", "webpack", "buildin", "amd-define.js")
		}, "resolve")
	);
};