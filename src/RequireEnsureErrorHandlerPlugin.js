/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/

"use strict";

const RequireEnsureItemDependency = require("webpack/lib/dependencies/RequireEnsureItemDependency");
const RequireEnsureErrorHandlerDependency = require("./RequireEnsureErrorHandlerDependency");
const ConstDependency = require("webpack/lib/dependencies/ConstDependency");

const NullFactory = require("webpack/lib/NullFactory");

const RequireEnsureErrorHandlerDependenciesBlockParserPlugin = require("./RequireEnsureErrorHandlerDependenciesBlockParserPlugin");

const ParserHelpers = require("webpack/lib/ParserHelpers");

class RequireEnsurePlugin {

  apply(compiler) {
    compiler.plugin("compilation", (compilation, params) => {
      const normalModuleFactory = params.normalModuleFactory;

      compilation.dependencyFactories.set(RequireEnsureItemDependency, normalModuleFactory);
      compilation.dependencyTemplates.set(RequireEnsureItemDependency, new RequireEnsureItemDependency.Template());

      compilation.dependencyFactories.set(RequireEnsureErrorHandlerDependency, new NullFactory());
      compilation.dependencyTemplates.set(RequireEnsureErrorHandlerDependency, new RequireEnsureErrorHandlerDependency.Template());

      params.normalModuleFactory.plugin("parser", (parser, parserOptions) => {

        if(typeof parserOptions.requireEnsure !== "undefined" && !parserOptions.requireEnsure)
          return;

        parser.apply(new RequireEnsureErrorHandlerDependenciesBlockParserPlugin());
        parser.plugin("evaluate typeof require.ensure", ParserHelpers.evaluateToString("function"));
        parser.plugin("typeof require.ensure", (expr) => {
          const dep = new ConstDependency("'function'", expr.range);
          dep.loc = expr.loc;
          parser.state.current.addDependency(dep);
          return true;
        });
      });
    });
  }
}
module.exports = RequireEnsurePlugin;