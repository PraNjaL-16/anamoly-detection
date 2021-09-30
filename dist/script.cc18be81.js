parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"C7bU":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=function(){function t(i,e,r){var n=this;if(this.leftChild=void 0,this.rightChild=void 0,this.splitAttribute=void 0,this.splitValue=void 0,this.height=e,this.heightLimit=r,e>=r||i.length<=1)return this.X=i,this;var h=this.getAttributes(i[0]);this.splitAttribute=h[Math.floor(Math.random()*h.length)];var o=i.map(function(t){return t[n.splitAttribute]}),s=this.max(o),l=this.min(o);this.splitValue=Math.random()*(s-l)+l;var u=i.filter(function(t){return t[n.splitAttribute]<n.splitValue}),p=i.filter(function(t){return t[n.splitAttribute]>=n.splitValue});return this.leftChild=new t(u,e+1,r),this.rightChild=new t(p,e+1,r),this}return t.prototype.max=function(t){for(var i=t.length,e=t[0];i--;)e=e>=t[i]?e:t[i];return e},t.prototype.min=function(t){for(var i=t.length,e=t[0];i--;)e=e>=t[i]?t[i]:e;return e},t.prototype.isExternalNode=function(){return void 0===this.leftChild&&void 0===this.rightChild},t.prototype.isInternalNode=function(){return void 0!==this.leftChild&&void 0!==this.rightChild},t.prototype.size=function(){return void 0!==this.X?this.X.length:0},t.prototype.getAttributes=function(t){return Object.keys(t)},t}();exports.TreeNode=t;
},{}],"u8pq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./treeNode"),e=function(){function e(e,r){this.rootNode=new t.TreeNode(e,0,r)}return e.prototype.pathLength=function(t,e,o){return e.isExternalNode()?o+r(e.size()):t[e.splitAttribute]<e.splitValue?this.pathLength(t,e.leftChild,o+1):this.pathLength(t,e.rightChild,o+1)},e.prototype.size=function(){return this.rootNode.size()},e.prototype.getRootNode=function(){return this.rootNode},e}();function r(t){return 0===t||1===t?0:2===t?1:2*o(t-1)-2*(t-1)/t}function o(t){return Math.log(t)+exports.EULER_MASCHERONI}exports.ITree=e,exports.averagePathLength=r,exports.EULER_MASCHERONI=.57721,exports.harmonicNumber=o;
},{"./treeNode":"C7bU"}],"UF7c":[function(require,module,exports) {
var global = arguments[3];
var n=arguments[3];!function(n){"use strict";n.knuthShuffle=function(n){for(var t,e,o=n.length;0!==o;)e=Math.floor(Math.random()*o),t=n[o-=1],n[o]=n[e],n[e]=t;return n}}("undefined"!=typeof exports&&exports||"undefined"!=typeof window&&window||n);
},{}],"wRWM":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./iTree"),t=require("knuth-shuffle").knuthShuffle,s=function(){function s(e,t){void 0===e&&(e=100),void 0===t&&(t=256),this.subsamplingSize=t,this.numberOfTrees=e,this.trees=[],this.X=[]}return s.prototype.fit=function(t){this.X=t,this.X.length<this.subsamplingSize&&(this.subsamplingSize=this.X.length);for(var s=Math.ceil(Math.log2(this.subsamplingSize)),i=0;i<this.numberOfTrees;i++){this.getSubsample(this.subsamplingSize);var r=new e.ITree(this.X,s);this.trees.push(r)}return this.trees},s.prototype.scores=function(){return this.predict(this.X)},s.prototype.predict=function(t){for(var s=[],i=0,r=t;i<r.length;i++){for(var h=r[i],n=0,u=0;u<this.numberOfTrees;u++)n+=this.trees[u].pathLength(h,this.trees[u].getRootNode(),0);var o=n/this.numberOfTrees,p=Math.pow(2,-o/e.averagePathLength(this.subsamplingSize));s.push(p)}return s},s.prototype.getSubsample=function(e){return t(this.X.slice(0)).slice(0,e)},s}();exports.IsolationForest=s;
},{"./iTree":"u8pq","knuth-shuffle":"UF7c"}],"mpVp":[function(require,module,exports) {
"use strict";var l=require("isolation-forest");console.log("Connected");var o=[{lan:110},{lan:210},{lan:310},{lan:410},{lan:510}],n=new l.IsolationForest;n.fit(o);var a=n.scores();console.log(a);var t=[{lan:510},{lan:419},{lan:310},{lan:210},{lan:110}],g=new l.IsolationForest;g.fit(t);var s=g.scores();console.log(s);var e=[{lan:110},{lan:110},{lan:110},{lan:110},{lan:110}],r=new l.IsolationForest;r.fit(e);var i=r.scores();console.log(i);var c=[110,210,310,410,510],v=new l.IsolationForest;v.fit(c);var f=v.scores();console.log(f);var w=[110,110,110,110,110],F=new l.IsolationForest;F.fit(w);var I=v.scores();console.log(I);var u=[{lat:41.080386328434905,long:28.99703979492188},{lat:41.076633727112515,long:28.997554779052738},{lat:41.077539547047294,long:29.003305435180668},{lat:41.079415848632,long:28.988885879516605},{lat:41.076180812464166,long:28.986911773681644},{lat:41.08261837760025,long:28.985624313354492},{lat:41.08491504471011,long:28.96030426025391},{lat:41.072880911548936,long:28.961849212646488},{lat:41.05955021422251,long:28.975582122802738},{lat:41.0607151401866,long:28.99703979492188},{lat:41.09617078744703,long:28.99154663085938},{lat:41.10225067378896,long:28.978843688964847},{lat:41.08297420451945,long:28.9735221862793},{lat:41.08349176750823,long:28.96905899047852},{lat:41.0343050853874,long:28.982620239257816},{lat:41.06175061261111,long:29.064502716064457},{lat:41.027959915023665,long:29.02622222900391},{lat:41.06615118853871,long:28.989143371582035},{lat:41.05851470715539,long:28.979701995849613},{lat:41.08271542149653,long:28.979358673095707},{lat:41.08103330700923,long:28.975410461425785},{lat:41.086985211067336,long:28.962707519531254},{lat:41.074433826731486,long:28.960990905761722},{lat:41.069127881747995,long:28.965625762939457},{lat:41.07650432324571,long:28.96854400634766},{lat:41.07508086389766,long:28.960647583007816},{lat:41.06420979428149,long:28.958244323730472},{lat:41.07805715283417,long:29.00047302246094},{lat:41.067574841233906,long:28.987426757812504},{lat:41.05333692728665,long:28.997383117675785},{lat:41.05333692728665,long:28.997383117675785},{lat:41.048417658920364,long:28.951721191406254},{lat:41.075210270566636,long:28.971977233886722},{lat:41.07068088558002,long:28.975582122802738},{lat:41.062786068733026,long:28.98897171020508},{lat:41.0587735854505,long:28.99068832397461},{lat:41.08763212467916,long:28.97729873657227},{lat:41.09345406057922,long:28.97180557250977},{lat:41.19345406057922,long:28.57180557250977},{lat:40.85345406047822,long:27.99180787250977},{lat:40.99341406047111,long:27.99180787257864}],d=new l.IsolationForest;d.fit(u);var q=d.scores();console.log(q);
},{"isolation-forest":"wRWM"}]},{},["mpVp"], null)
//# sourceMappingURL=/script.cc18be81.js.map