// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/isolation-forest/dist/treeNode.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TreeNode = /** @class */ (function () {
    function TreeNode(X, height, heightLimit) {
        var _this = this;
        this.leftChild = undefined;
        this.rightChild = undefined;
        this.splitAttribute = undefined;
        this.splitValue = undefined;
        this.height = height;
        this.heightLimit = heightLimit;
        if (height >= heightLimit || X.length <= 1) {
            this.X = X;
            return this;
        }
        else {
            var attributes = this.getAttributes(X[0]);
            this.splitAttribute = attributes[Math.floor(Math.random() * attributes.length)];
            var splitAttributeArray = X.map(function (x) { return x[_this.splitAttribute]; });
            var attributeMax = this.max(splitAttributeArray);
            var attributeMin = this.min(splitAttributeArray);
            this.splitValue = Math.random() * (attributeMax - attributeMin) + attributeMin;
            var dataSplitA = X.filter(function (x) { return x[_this.splitAttribute] < _this.splitValue; });
            var dataSplitB = X.filter(function (x) { return x[_this.splitAttribute] >= _this.splitValue; });
            this.leftChild = new TreeNode(dataSplitA, height + 1, heightLimit);
            this.rightChild = new TreeNode(dataSplitB, height + 1, heightLimit);
            return this;
        }
    }
    TreeNode.prototype.max = function (arr) {
        var len = arr.length;
        var max = arr[0];
        while (len--) {
            max = max >= arr[len] ? max : arr[len];
        }
        return max;
    };
    TreeNode.prototype.min = function (arr) {
        var len = arr.length;
        var min = arr[0];
        while (len--) {
            min = min >= arr[len] ? arr[len] : min;
        }
        return min;
    };
    TreeNode.prototype.isExternalNode = function () {
        return this.leftChild === undefined && this.rightChild === undefined;
    };
    TreeNode.prototype.isInternalNode = function () {
        return this.leftChild !== undefined && this.rightChild !== undefined;
    };
    TreeNode.prototype.size = function () {
        if (this.X !== undefined) {
            return this.X.length;
        }
        return 0;
    };
    TreeNode.prototype.getAttributes = function (x) {
        return Object.keys(x);
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;

},{}],"node_modules/isolation-forest/dist/iTree.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var treeNode_1 = require("./treeNode");
var ITree = /** @class */ (function () {
    function ITree(X, heightLimit) {
        this.rootNode = new treeNode_1.TreeNode(X, 0, heightLimit);
    }
    ITree.prototype.pathLength = function (x, treeNode, currentPathLength) {
        if (treeNode.isExternalNode()) {
            return currentPathLength + averagePathLength(treeNode.size());
        }
        var splitAttr = treeNode.splitAttribute;
        if (x[splitAttr] < treeNode.splitValue) {
            return this.pathLength(x, treeNode.leftChild, currentPathLength + 1);
        }
        else {
            return this.pathLength(x, treeNode.rightChild, currentPathLength + 1);
        }
    };
    ITree.prototype.size = function () {
        return this.rootNode.size();
    };
    ITree.prototype.getRootNode = function () {
        return this.rootNode;
    };
    return ITree;
}());
exports.ITree = ITree;
function averagePathLength(n) {
    if (n === 0 || n === 1) {
        return 0;
    }
    else if (n === 2) {
        return 1;
    }
    return 2 * harmonicNumber(n - 1) - (2 * (n - 1)) / n;
}
exports.averagePathLength = averagePathLength;
exports.EULER_MASCHERONI = 0.57721;
function harmonicNumber(i) {
    return Math.log(i) + exports.EULER_MASCHERONI;
}
exports.harmonicNumber = harmonicNumber;

},{"./treeNode":"node_modules/isolation-forest/dist/treeNode.js"}],"node_modules/knuth-shuffle/index.js":[function(require,module,exports) {
var global = arguments[3];
/*jshint -W054 */
(function (exports) {
  'use strict';

  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    var currentIndex = array.length
      , temporaryValue
      , randomIndex
      ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  exports.knuthShuffle = shuffle;
}('undefined' !== typeof exports && exports || 'undefined' !== typeof window && window || global));

},{}],"node_modules/isolation-forest/dist/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iTree_1 = require("./iTree");
var shuffle = require('knuth-shuffle').knuthShuffle;
var IsolationForest = /** @class */ (function () {
    function IsolationForest(numberOfTrees, subsamplingSize) {
        if (numberOfTrees === void 0) { numberOfTrees = 100; }
        if (subsamplingSize === void 0) { subsamplingSize = 256; }
        this.subsamplingSize = subsamplingSize;
        this.numberOfTrees = numberOfTrees;
        this.trees = [];
        this.X = [];
    }
    IsolationForest.prototype.fit = function (X) {
        this.X = X;
        if (this.X.length < this.subsamplingSize) {
            this.subsamplingSize = this.X.length;
        }
        var heightLimit = Math.ceil(Math.log2(this.subsamplingSize));
        for (var i = 0; i < this.numberOfTrees; i++) {
            var subsample = this.getSubsample(this.subsamplingSize);
            var iTree = new iTree_1.ITree(this.X, heightLimit);
            this.trees.push(iTree);
        }
        return this.trees;
    };
    IsolationForest.prototype.scores = function () {
        return this.predict(this.X);
    };
    IsolationForest.prototype.predict = function (X) {
        var scoreArray = [];
        for (var _i = 0, X_1 = X; _i < X_1.length; _i++) {
            var x = X_1[_i];
            var pathLength = 0;
            for (var j = 0; j < this.numberOfTrees; j++) {
                pathLength += this.trees[j].pathLength(x, this.trees[j].getRootNode(), 0);
            }
            var meanPathLength = pathLength / this.numberOfTrees;
            var score = Math.pow(2, -(meanPathLength / iTree_1.averagePathLength(this.subsamplingSize)));
            scoreArray.push(score);
        }
        return scoreArray;
    };
    IsolationForest.prototype.getSubsample = function (subsampleSize) {
        var subsample = [];
        var data = shuffle(this.X.slice(0));
        return data.slice(0, subsampleSize);
    };
    return IsolationForest;
}());
exports.IsolationForest = IsolationForest;

},{"./iTree":"node_modules/isolation-forest/dist/iTree.js","knuth-shuffle":"node_modules/knuth-shuffle/index.js"}],"script.js":[function(require,module,exports) {
"use strict";

var _isolationForest = require("isolation-forest");

console.log("Connected");
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
var formattedReps = [{
  lan: 110
}, {
  lan: 210
}, {
  lan: 310
}, {
  lan: 410
}, {
  lan: 510
}];
var isolationForest = new _isolationForest.IsolationForest();
isolationForest.fit(formattedReps);
var scores = isolationForest.scores();
console.log(scores); ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var formattedReps1 = [{
  lan: 510
}, {
  lan: 419
}, {
  lan: 310
}, {
  lan: 210
}, {
  lan: 110
}];
var isolationForest1 = new _isolationForest.IsolationForest();
isolationForest1.fit(formattedReps1);
var scores1 = isolationForest1.scores();
console.log(scores1); ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var formattedReps2 = [{
  lan: 110
}, {
  lan: 110
}, {
  lan: 110
}, {
  lan: 110
}, {
  lan: 110
}];
var isolationForest2 = new _isolationForest.IsolationForest();
isolationForest2.fit(formattedReps2);
var scores2 = isolationForest2.scores();
console.log(scores2); ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var formattedReps3 = [110, 210, 310, 410, 510];
var isolationForest3 = new _isolationForest.IsolationForest();
isolationForest3.fit(formattedReps3);
var scores3 = isolationForest3.scores();
console.log(scores3); ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var formattedReps4 = [110, 110, 110, 110, 110];
var isolationForest4 = new _isolationForest.IsolationForest();
isolationForest4.fit(formattedReps4);
var scores4 = isolationForest3.scores();
console.log(scores4); ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var data = [{
  lat: 41.080386328434905,
  long: 28.99703979492188
}, {
  lat: 41.076633727112515,
  long: 28.997554779052738
}, {
  lat: 41.077539547047294,
  long: 29.003305435180668
}, {
  lat: 41.079415848632,
  long: 28.988885879516605
}, {
  lat: 41.076180812464166,
  long: 28.986911773681644
}, {
  lat: 41.08261837760025,
  long: 28.985624313354492
}, {
  lat: 41.08491504471011,
  long: 28.96030426025391
}, {
  lat: 41.072880911548936,
  long: 28.961849212646488
}, {
  lat: 41.05955021422251,
  long: 28.975582122802738
}, {
  lat: 41.0607151401866,
  long: 28.99703979492188
}, {
  lat: 41.09617078744703,
  long: 28.99154663085938
}, {
  lat: 41.10225067378896,
  long: 28.978843688964847
}, {
  lat: 41.08297420451945,
  long: 28.9735221862793
}, {
  lat: 41.08349176750823,
  long: 28.96905899047852
}, {
  lat: 41.0343050853874,
  long: 28.982620239257816
}, {
  lat: 41.06175061261111,
  long: 29.064502716064457
}, {
  lat: 41.027959915023665,
  long: 29.02622222900391
}, {
  lat: 41.06615118853871,
  long: 28.989143371582035
}, {
  lat: 41.05851470715539,
  long: 28.979701995849613
}, {
  lat: 41.08271542149653,
  long: 28.979358673095707
}, {
  lat: 41.08103330700923,
  long: 28.975410461425785
}, {
  lat: 41.086985211067336,
  long: 28.962707519531254
}, {
  lat: 41.074433826731486,
  long: 28.960990905761722
}, {
  lat: 41.069127881747995,
  long: 28.965625762939457
}, {
  lat: 41.07650432324571,
  long: 28.96854400634766
}, {
  lat: 41.07508086389766,
  long: 28.960647583007816
}, {
  lat: 41.06420979428149,
  long: 28.958244323730472
}, {
  lat: 41.07805715283417,
  long: 29.00047302246094
}, {
  lat: 41.067574841233906,
  long: 28.987426757812504
}, {
  lat: 41.05333692728665,
  long: 28.997383117675785
}, {
  lat: 41.05333692728665,
  long: 28.997383117675785
}, {
  lat: 41.048417658920364,
  long: 28.951721191406254
}, {
  lat: 41.075210270566636,
  long: 28.971977233886722
}, {
  lat: 41.07068088558002,
  long: 28.975582122802738
}, {
  lat: 41.062786068733026,
  long: 28.98897171020508
}, {
  lat: 41.0587735854505,
  long: 28.99068832397461
}, {
  lat: 41.08763212467916,
  long: 28.97729873657227
}, {
  lat: 41.09345406057922,
  long: 28.97180557250977
}, {
  lat: 41.19345406057922,
  long: 28.57180557250977
}, {
  lat: 40.85345406047822,
  long: 27.99180787250977
}, {
  lat: 40.99341406047111,
  long: 27.99180787257864
}];
var isolationForest5 = new _isolationForest.IsolationForest();
isolationForest5.fit(data);
var scores5 = isolationForest5.scores();
console.log(scores5);
},{"isolation-forest":"node_modules/isolation-forest/dist/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57665" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map