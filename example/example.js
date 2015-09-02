var bundle = require('require-error-handler-webpack-plugin/src/BundleLoader?lazy&name=foo!./a');
bundle(function(a) {
    console.log('success', a);
}, function() {
    console.log('error');
});
