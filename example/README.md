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
/******/    script.src = __webpack_require__.p + "" + chunkId + ".output.js";
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
    console.log('success', b);
  }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));});

  __webpack_require__.e/* require */(2/* duplicate */, function() {[__webpack_require__(2)];});

  // bundle loader
  var bundle = __webpack_require__(3);
  bundle(function(a) {
    console.log('success', a);
  }, function() {
    console.log('error');
  });

  bundle = __webpack_require__(4);
  bundle(function(a) {
      console.log('success', a);
  }, function() {
      console.log('error');
  });

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

  var cbs,
    data,
    error = false;
  module.exports = function(successCallback, errorCallback) {
    errorCallback = errorCallback || function() {};
    if (data) {
      successCallback(data);
    } else {
      if (error) {
        // Try again.
        requireBundle();
      }
      cbs.push({
        success: successCallback,
        error: errorCallback
      });
    }
  };
  function requireBundle() {
    cbs = [];
    __webpack_require__.e/* nsure */(1/* duplicate */, function() {
      data = __webpack_require__(1);
      for(var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].success(data);
      }
      error = false;
      cbs = null;
    }, function() {
      for(var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].error();
      }
      error = true;
      cbs = null;
    });
  }
  requireBundle();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = function(successCallback, errorCallback) {
    __webpack_require__.e/* nsure */(1/* duplicate */, function() {
      successCallback(__webpack_require__(1));
    }, function() {
      if (errorCallback) errorCallback.apply(this, arguments);
    });
  };

/***/ }
/******/ ])
```

# 1.output.js

``` javascript
webpackJsonp([1],[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = 'a';

/***/ }
]);
```

# js/2.output.js

``` javascript
webpackJsonp([2],{

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

  module.exports = 'b';

/***/ }

});
```

# Info

```
Hash: c4832e63e3309491f0ff
Version: webpack 1.5.3
Time: 101ms
      Asset  Size  Chunks             Chunk Names
  output.js  7785       0  [emitted]  main
1.output.js   127       1  [emitted]  1
2.output.js   121       2  [emitted]  
   [0] ./example.js 1071 {0} [built]
   [1] ./a.js 21 {1} [built]
   [2] ./b.js 21 {2} [built]
   [3] ../src/BundleLoader.js!./a.js 735 {0} [built]
   [4] ../src/BundleLoader.js?lazy!./a.js 280 {0} [built]
```