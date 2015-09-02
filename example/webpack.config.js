// webpack --config example/webpack.config.js

var requireErrorHandler = require('require-error-handler-webpack-plugin');
var JsonpMainTemplatePlugin = require('webpack/lib/JsonpMainTemplatePlugin');

module.exports = {
    context: __dirname,
    entry: './example.js',
    output: {
        path: __dirname,
        filename: 'output.js',
        chunkFilename: '[name].js'
    },
    // resolveLoader: {
    //     alias: {
    //         // This doesn't carry across query params... i.e. bundle?lazy!./a...
    //         'bundle': 'require-error-handler-webpack-plugin/src/BundleLoader'
    //     }
    // }
    plugins: [
        new requireErrorHandler.JsonpErrorHandlerPlugin(JsonpMainTemplatePlugin),
        new requireErrorHandler.RequireEnsureErrorHandlerPlugin(),
        new requireErrorHandler.AMDRequireErrorHandlerPlugin()
    ]
};