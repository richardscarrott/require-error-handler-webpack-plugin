// webpack --config example/webpack.config.js

var requireErrorHandler = require('require-error-handler-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: './example.js',
    output: {
        path: __dirname,
        filename: 'output.js'
    },
    // resolveLoader: {
    //     alias: {
    //         // This doesn't carry across query params... i.e. bundle?lazy!./a...
    //         'bundle': 'require-error-handler-webpack-plugin/src/BundleLoader'
    //     }
    // }
    plugins: [
        new requireErrorHandler.RequireEnsureErrorHandlerPlugin(),
        new requireErrorHandler.AMDRequireErrorHandlerPlugin()
    ]
};