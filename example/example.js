// require.ensure
require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success', a);
}, function() {
    console.log('error');
}, '1');

require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success', a);
}, function() {
    console.log('error');
});

require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success', a);
}, 'c');

require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success', a);
});

// AMD
require(['./b'], function(b) {
	console.log('success', b);
}, function() {
	console.log('error');
});

require(['./b'], function(b) {
	console.log('success', b);
});

require(['./b']);

// bundle loader
var bundle = require('require-error-handler-webpack-plugin/src/BundleLoader!./a');
bundle(function(a) {
	console.log('success', a);
}, function() {
	console.log('error');
});

bundle = require('require-error-handler-webpack-plugin/src/BundleLoader?lazy!./a');
bundle(function(a) {
    console.log('success', a);
}, function() {
    console.log('error');
});