/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
	Modified by Richard Scarrott @richardscarrott
*/
"use strict";
const AsyncDependenciesBlock = require("webpack/lib/AsyncDependenciesBlock");
const RequireEnsureDependency = require("./RequireEnsureErrorHandlerDependency");

module.exports = class RequireEnsureErrorHandlerDependenciesBlock extends AsyncDependenciesBlock {
  constructor(expr, successExpression, errorExpression, chunkName, chunkNameRange, module, loc) {
    super(chunkName, module, loc);
    this.expr = expr;
    const successBodyRange = successExpression && successExpression.body && successExpression.body.range;
    const errorBodyRange = errorExpression && errorExpression.body && errorExpression.body.range;
    this.range = null;
    if (successBodyRange) {
    	if (errorBodyRange) {
        this.range = [successBodyRange[0] + 1, errorBodyRange[1] - 1];
			}
			else {
        this.range = [successBodyRange[0] + 1, successBodyRange[1] - 1];
			}
		}

    this.chunkNameRange = chunkNameRange;
    let dep = new RequireEnsureDependency(this);
    dep.loc = loc;
    this.addDependency(dep);
  }
};