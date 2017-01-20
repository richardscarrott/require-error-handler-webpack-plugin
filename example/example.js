require.ensure(['./a'], function() {
	var a = require('./a');
    console.log('success require ensure 1', a);
}, function() {
    console.log('error require ensure 1');
}, 'chunkName1');

require.ensure(['./b'], function() {
	var b = require('./b');
    console.log('success require ensure 2', b);
}, function() {
    console.log('error require ensure 2');
});

require.ensure(['./c'], function() {
	var c = require('./c');
    console.log('success require ensure 3', c);
}, 'chunkName3');

require.ensure(['./d'], function() {
	var d = require('./d');
    console.log('success require ensure 4', d);
});
