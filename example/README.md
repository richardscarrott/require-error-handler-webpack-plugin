# example.js

``` javascript
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
  console.log('success');
});

require(['./b']);
```

# output.js

``` javascript
/******/ (function(modules) { // webpackBootstrap
/******/  // install a JSONP callback for chunk loading
/******/  var parentJsonpFunction = window["webpackJsonp"];
/******/  window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/    // add "moreModules" to the modules object,
/******/    // then flag all "chunkIds" as loaded and fire callback
/******/    var moduleId, chunkId, i = 0, callbacks = [];
/******/    for(;i < chunkIds.length; i++) {
/******/      chunkId = chunkIds[i];
/******/      if(installedChunks[chunkId])
/******/        callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/      installedChunks[chunkId] = 0;
/******/    }
/******/    for(moduleId in moreModules) {
/******/      modules[moduleId] = moreModules[moduleId];
/******/    }
/******/    if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/    while(callbacks.length)
/******/      callbacks.shift().success.call(null, __webpack_require__);
/******/
/******/  };
/******/
/******/  // load chunk
/******/  function loadChunk(chunkId) {
/******/    var head = document.getElementsByTagName('head')[0];
/******/    var script = document.createElement('script');
/******/    script.type = 'text/javascript';
/******/    script.charset = 'utf-8';
/******/    script.async = true;
/******/    function onComplete(error) {
/******/      // avoid mem leaks in IE.
/******/      script.onerror = script.onload = script.onreadystatechange = null;
/******/      if (error) {
/******/        var callbacks = installedChunks[chunkId];
/******/        // set chunkId to undefined so subsequent require's try again
/******/        delete installedChunks[chunkId];
/******/        if (callbacks) {
/******/          while(callbacks.length) {
/******/            callbacks.shift().error.call(null, __webpack_require__);
/******/          }
/******/        }
/******/      }
/******/      // success callbacks will be called by webpackJsonpCallback handler
/******/    }
/******/    script.onerror = script.onload = script.onreadystatechange = function() {
/******/      // cover buggy onerror / readystate implementations by checking whether the chunk is actually installed
/******/      onComplete(installedChunks[chunkId] !== 0);
/******/    };
/******/    script.src = __webpack_require__.p + "output." + ({"1":"1"}[chunkId]||chunkId) + ".js";
/******/    head.appendChild(script);
/******/  }
/******/
/******/  // The module cache
/******/  var installedModules = {};
/******/
/******/  // object to store loaded and loading chunks
/******/  // "0" means "already loaded"
/******/  // Array means "loading", array contains callbacks
/******/  var installedChunks = {
/******/    0:0
/******/  };
/******/
/******/  // The require function
/******/  function __webpack_require__(moduleId) {
/******/
/******/    // Check if module is in cache
/******/    if(installedModules[moduleId])
/******/      return installedModules[moduleId].exports;
/******/
/******/    // Create a new module (and put it into the cache)
/******/    var module = installedModules[moduleId] = {
/******/      exports: {},
/******/      id: moduleId,
/******/      loaded: false
/******/    };
/******/
/******/    // Execute the module function
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/    // Flag the module as loaded
/******/    module.loaded = true;
/******/
/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }
/******/
/******/  // This file contains only the entry chunk.
/******/  // The chunk loading function for additional chunks
/******/  __webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/    };
/******/    __webpack_require__.e = function requireEnsure(chunkId, successCallback, errorCallback) {
/******/      errorCallback = errorCallback || function() {};
/******/      // "0" is the signal for "already loaded"
/******/      if (installedChunks[chunkId] === 0)
/******/        return successCallback.call(null, __webpack_require__);
/******/
/******/      // an array means "currently loading".
/******/      if (installedChunks[chunkId] !== undefined) {
/******/        installedChunks[chunkId].push({
/******/          success: successCallback,
/******/          error: errorCallback
/******/        });
/******/      } else {
/******/        // start chunk loading
/******/        installedChunks[chunkId] = [{
/******/          success: successCallback,
/******/          error: errorCallback
/******/        }];
/******/        loadChunk(chunkId)
/******/      }
/******/  };
/******/
/******/  // expose the modules object (__webpack_modules__)
/******/  __webpack_require__.m = modules;
/******/
/******/  // expose the module cache
/******/  __webpack_require__.c = installedModules;
/******/
/******/  // __webpack_public_path__
/******/  __webpack_require__.p = "";
/******/
/******/  // Load entry module and return exports
/******/  return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

  // require.ensure
  __webpack_require__.e/* nsure */(1, function() {
    var a = __webpack_require__(1);
      console.log('success', a);
  }, function() {
      console.log('error');
  });

  __webpack_require__.e/* nsure */(1/* duplicate */, function() {
    var a = __webpack_require__(1);
      console.log('success', a);
  }, function() {
      console.log('error');
  });

  __webpack_require__.e/* nsure */(1/* duplicate */, function() {
    var a = __webpack_require__(1);
      console.log('success', a);
  });

  __webpack_require__.e/* nsure */(1/* duplicate */, function() {
    var a = __webpack_require__(1);
      console.log('success', a);
  });

  // AMD
  __webpack_require__.e/* require */(2, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(2)]; (function(b) {
    console.log('success', b);
  }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}, function() {
    console.log('error');
  });

  __webpack_require__.e/* require */(2/* duplicate */, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(2)]; (function(b) {
    console.log('success');
  }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));});

  __webpack_require__.e/* require */(2/* duplicate */, function() {[__webpack_require__(2)];});

/***/ }
/******/ ])
```

# 1.output.js

``` javascript
webpackJsonp([1],[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

  modules.exports = 'a';

/***/ }
]);
```

# 2.output.js

``` javascript
webpackJsonp([2],{

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

  modules.exports = 'b';

/***/ }

});
```

# Info

```
Hash: c317c104b74f1b8a7d46
Version: webpack 1.5.3
Time: 41ms
      Asset  Size  Chunks             Chunk Names
  output.js  6322       0  [emitted]  main
1.output.js   128       1  [emitted]  1
2.output.js   122       2  [emitted]
   [0] ./example.js 692 {0} [built]
   [1] ./a.js 22 {1} [built]
   [2] ./b.js 22 {2} [built]
```
