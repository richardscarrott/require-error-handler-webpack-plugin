# require-error-handler-webpack-plugin
Adds error callback to require.ensure and AMD require calls.

## Usage

```javascript
var requireErrorHandlerPlugin = require('require-error-handler-webpack-plugin');
var JsonpMainTemplatePlugin = require('webpack/lib/JsonpMainTemplatePlugin');

{
	plugins: [
		// `JsonpMainTemplatePlugin` is neccesary as it must be monkey patched.
		new requireErrorHandlerPlugin.JsonpErrorHandlerPlugin(JsonpMainTemplatePlugin),
        new requireErrorHandlerPlugin.RequireEnsureErrorHandlerPlugin(),
        new requireErrorHandlerPlugin.AMDRequireErrorHandlerPlugin()
	]
}
```

## JsonpErrorHandlerPlugin
Adds an error callback to the jsonp transport method that is called when a chunk fails to load.

NOTE: This depends on the `JsonpTemplatePlugin` being applied (webpack does this by default given a target of 'web' or 'node-webkit').

## RequireEnsureErrorHandlerPlugin
Adds support for the following signatures:

```javascript
require.ensure(['a'], function() {
    // success
}, function() {
    // error
}, 'a');

require.ensure(['b'], function() {
    // success
}, function() {
    // error
});

require.ensure(['c'], function() {
    // success
}, 'c');

require.ensure(['d'], function() {
    // success
});
```

NOTE: This depends on the `RequireEnsurePlugin` being applied (webpack does this by default).

## AMDRequireErrorHandlerPlugin
Adds support for the following signatures:

```javascript
require(['c'], function() {
	// success
}, function() {
	// error
});

require(['b'], function() {
    // success
});

require(['a']);
```

NOTE: This depends on the `AMDRequirePlugin` being applied (webpack does this by default).

## BundleLoader

Adds an error callback to the [bundle loader](https://github.com/webpack/bundle-loader), e.g.

```javascript
// Supports both immediate and lazy requires.
var bundle = require("require-error-handler-webpack-plugin/src/BundleLoader!./file.js");

bundle(function(file) {
    // success
}, function() {
    // errror
});
```

## Todo
- [x] Update `bundle-loader` to support new `require.ensure` syntax.
- [ ] Work out how to alias the loader to 'bundle' and carry across query params.
- [ ] [Add support for default wrapper when chunks are merged](https://github.com/richardscarrott/require-error-handler-webpack-plugin/blob/master/src/RequireEnsureErrorHandlerDependency.js#L24)
- [ ] Add support for named chunks using AMD, i.e. require(name?, deps, successCallback?, errorCallback?)
- [ ] *Remove hacks* required to get this to work by, potentially, requesting changes to webpack to make it easier to hook in.

## Related
- https://github.com/webpack/webpack/issues/758
- https://github.com/richardscarrott/webpack
- https://github.com/webpack/webpack/pull/785
- https://github.com/webpack/webpack/pull/692