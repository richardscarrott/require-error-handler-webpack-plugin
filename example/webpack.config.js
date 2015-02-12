// webpack --config example/webpack.config.js

var requireErrorHandler = require('require-error-handler-webpack-plugin');
var JsonpMainTemplatePlugin = require('webpack/lib/JsonpMainTemplatePlugin');

module.exports = {
    context: __dirname,
    entry: './example.js',
    output: {
        path: __dirname,
        filename: 'output.js'
    },
    plugins: [
        new requireErrorHandler.JsonpErrorHandlerPlugin(JsonpMainTemplatePlugin),
        new requireErrorHandler.RequireEnsureErrorHandlerPlugin(),
        new requireErrorHandler.AMDRequireErrorHandlerPlugin()
    ]
};