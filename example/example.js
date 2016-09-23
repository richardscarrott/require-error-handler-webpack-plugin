// require.ensure
// require('./a'); // <-- prevent a chunking

require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success require ensure 1', a);
}, function() {
    console.log('error require ensure 1');
}, '1');

require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success require ensure 2', a);
}, function() {
    console.log('error require ensure 2');
});

require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success require ensure 3', a);
}, 'c');

require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success require ensure 4', a);
});

// AMD
// require('./b'); // <-- prevent b chunking

require(['./b'], function(b) {
	console.log('success AMD 1', b);
}, function() {
	console.log('error AMD 1');
});

require(['./b'], function(b) {
	console.log('success AMD 2', b);
});

require(['./b']);

// bundle loader
var bundle = require('require-error-handler-webpack-plugin/src/BundleLoader!./a');
bundle(function(a) {
	console.log('success bundle loader 1', a);
}, function() {
	console.log('error bundle loader 1');
});

bundle = require('require-error-handler-webpack-plugin/src/BundleLoader?lazy!./a');
bundle(function(a) {
    console.log('success bundle loader 2', a);
}, function() {
    console.log('error bundle loader 2');
});