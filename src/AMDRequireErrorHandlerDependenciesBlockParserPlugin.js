/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/

// a) require(['a']);
// b) require(['a'], successCallback);
// c) require(['a'], successCallback, errorCallback);

var AMDRequireItemDependency = require("webpack/lib/dependencies/AMDRequireItemDependency");
var AMDRequireArrayDependency = require("webpack/lib/dependencies/AMDRequireArrayDependency");
var AMDRequireContextDependency = require("webpack/lib/dependencies/AMDRequireContextDependency");

//var AMDRequireDependenciesBlock = require("webpack/lib/dependencies/AMDRequireDependenciesBlock");

var UnsupportedDependency = require("webpack/lib/dependencies/UnsupportedDependency");
var LocalModuleDependency = require("webpack/lib/dependencies/LocalModuleDependency");
var ContextDependencyHelpers = require("webpack/lib/dependencies/ContextDependencyHelpers");
var LocalModulesHelpers = require("webpack/lib/dependencies/LocalModulesHelpers");
var ConstDependency = require("webpack/lib/dependencies/ConstDependency");
var getFunctionExpression = require("webpack/lib/dependencies/getFunctionExpression");
var UnsupportedFeatureWarning = require("webpack/lib/UnsupportedFeatureWarning");

var AMDRequireErrorHandlerDependenciesBlock = require("./AMDRequireErrorHandlerDependenciesBlock");

function AMDRequireErrorHandlerDependenciesBlockParserPlugin(options) {
	this.options = options;
}

module.exports = AMDRequireErrorHandlerDependenciesBlockParserPlugin;

AMDRequireErrorHandlerDependenciesBlockParserPlugin.prototype.apply = function(parser) {
	var options = this.options;
	parser.plugin("call require", function(expr) {
		var param;
		var dep;
		var old;
		var result;
		switch(expr.arguments.length) {
			case 1:
				param = this.evaluateExpression(expr.arguments[0]);
				dep = new AMDRequireErrorHandlerDependenciesBlock(expr, param.range, null, null, this.state.module, expr.loc);
				old = this.state.current;
				this.state.current = dep;
				this.inScope([], function() {
					result = this.applyPluginsBailResult("call require:amd:array", expr, param);
				}.bind(this));
				this.state.current = old;
				if(!result) return;
				this.state.current.addBlock(dep);
				return true;
			case 2:
			case 3:
				param = this.evaluateExpression(expr.arguments[0]);
				var successCallback = expr.arguments[1];
				var errorCallback = expr.arguments[2] || {};
				dep = new AMDRequireErrorHandlerDependenciesBlock(expr, param.range, successCallback.range, errorCallback.range, this.state.module, expr.loc);
				dep.loc = expr.loc;
				old = this.state.current;
				this.state.current = dep;
				try {
					this.inScope([], function() {
						result = this.applyPluginsBailResult("call require:amd:array", expr, param);
					}.bind(this));
					if(!result) {
						dep = new UnsupportedDependency("unsupported", expr.range);
						old.addDependency(dep);
						if(this.state.module)
							this.state.module.errors.push(new UnsupportedFeatureWarning(this.state.module, "Cannot statically analyse 'require(..., ...)' in line " + expr.loc.start.line));
						dep = null;
						return true;
					}
					[successCallback, errorCallback].forEach(function(callback) {
						var fnData = getFunctionExpression(callback);
						if(fnData) {
							this.inScope(fnData.fn.params.filter(function(i) {
								return ["require", "module", "exports"].indexOf(i.name) < 0;
							}), function() {
								if(fnData.fn.body.type === "BlockStatement")
									this.walkStatement(fnData.fn.body);
								else
									this.walkExpression(fnData.fn.body);
							}.bind(this));
							this.walkExpressions(fnData.expressions);
							if(fnData.needThis === false) {
								// smaller bundles for simple function expression
								dep.bindThis = false;
							}
						}
						else {
							this.walkExpression(callback);
						}
					}.bind(this));
				} finally {
					this.state.current = old;
					if(dep)
						this.state.current.addBlock(dep);
				}
				return true;
		}
	});
	parser.plugin("call require:amd:array", function(expr, param) {
		if(param.isArray()) {
			param.items.forEach(function(param) {
				var result = this.applyPluginsBailResult("call require:amd:item", expr, param);
				if(result === undefined) {
					this.applyPluginsBailResult("call require:amd:context", expr, param);
				}
			}, this);
			return true;
		} else if(param.isConstArray()) {
			var deps = [];
			param.array.forEach(function(request) {
				var dep, localModule;
				if(request === "require") {
					dep = "__webpack_require__";
				} else if(["exports", "module"].indexOf(request) >= 0) {
					dep = request;
				} else if(localModule = LocalModulesHelpers.getLocalModule(this.state, request)) { // eslint-disable-line no-cond-assign
					dep = new LocalModuleDependency(localModule);
					dep.loc = expr.loc;
					this.state.current.addDependency(dep);
				} else {
					dep = new AMDRequireItemDependency(request);
					dep.loc = expr.loc;
					dep.optional = !!this.scope.inTry;
					this.state.current.addDependency(dep);
				}
				deps.push(dep);
			}, this);
			var dep = new AMDRequireArrayDependency(deps, param.range);
			dep.loc = expr.loc;
			dep.optional = !!this.scope.inTry;
			this.state.current.addDependency(dep);
			return true;
		}
	});
	parser.plugin("call require:amd:item", function(expr, param) {
		if(param.isConditional()) {
			param.options.forEach(function(param) {
				var result = this.applyPluginsBailResult("call require:amd:item", expr, param);
				if(result === undefined) {
					this.applyPluginsBailResult("call require:amd:context", expr, param);
				}
			}, this);
			return true;
		} else if(param.isString()) {
			var dep, localModule;
			if(param.string === "require") {
				dep = new ConstDependency("__webpack_require__", param.string);
			} else if(["exports", "module"].indexOf(param.string) >= 0) {
				dep = new ConstDependency(param.string, param.range);
			} else if(localModule = LocalModulesHelpers.getLocalModule(this.state, param.string)) { // eslint-disable-line no-cond-assign
				dep = new LocalModuleDependency(localModule, param.range);
			} else {
				dep = new AMDRequireItemDependency(param.string, param.range);
			}
			dep.loc = expr.loc;
			dep.optional = !!this.scope.inTry;
			this.state.current.addDependency(dep);
			return true;
		}
	});
	parser.plugin("call require:amd:context", function(expr, param) {
		var dep = ContextDependencyHelpers.create(AMDRequireContextDependency, param.range, param, expr, options);
		if(!dep) return;
		dep.loc = expr.loc;
		dep.optional = !!this.scope.inTry;
		this.state.current.addDependency(dep);
		return true;
	});
};
