/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 173);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(180);
} else {
  module.exports = require('./cjs/react.development.js');
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(3);
var has = __webpack_require__(11);
var wrappedWellKnownSymbolModule = __webpack_require__(132);
var defineProperty = __webpack_require__(19).f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(5);
var getOwnPropertyDescriptor = __webpack_require__(38).f;
var isForced = __webpack_require__(233);
var path = __webpack_require__(3);
var bind = __webpack_require__(63);
var createNonEnumerableProperty = __webpack_require__(14);
var has = __webpack_require__(11);

var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof NativeConstructor) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return NativeConstructor.apply(this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? global : STATIC ? global[TARGET] : (global[TARGET] || {}).prototype;

  var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

    // bind timers to global for call from export context
    if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, global);
    // wrap global constructors for prevent changs in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && typeof sourceProperty == 'function') resultProperty = bind(Function.call, sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }

    target[key] = resultProperty;

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!has(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
      // export real prototype methods
      if (options.real && targetPrototype && !targetPrototype[key]) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var shared = __webpack_require__(65);
var has = __webpack_require__(11);
var uid = __webpack_require__(67);
var NATIVE_SYMBOL = __webpack_require__(68);
var USE_SYMBOL_AS_UID = __webpack_require__(124);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (NATIVE_SYMBOL && has(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = Object({"NODE_ENV":"production","PUBLIC_URL":""}).DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(207)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(206)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var toObject = __webpack_require__(16);

var hasOwnProperty = {}.hasOwnProperty;

module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty.call(toObject(it), key);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(118);
var requireObjectCoercible = __webpack_require__(62);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(10);
var definePropertyModule = __webpack_require__(19);
var createPropertyDescriptor = __webpack_require__(29);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) {
  var ReactIs = require('react-is');

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(187)();
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(62);

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = useStateContext;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ScrollToBottom_State1Context__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ScrollToBottom_State2Context__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ScrollToBottom_StateContext__ = __webpack_require__(79);




var stateContexts = [__WEBPACK_IMPORTED_MODULE_3__ScrollToBottom_StateContext__["a" /* default */], __WEBPACK_IMPORTED_MODULE_1__ScrollToBottom_State1Context__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__ScrollToBottom_State2Context__["a" /* default */]];
function useStateContext(tier) {
  return Object(__WEBPACK_IMPORTED_MODULE_0_react__["useContext"])(stateContexts[tier] || stateContexts[0]);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ob29rcy9pbnRlcm5hbC91c2VTdGF0ZUNvbnRleHQuanMiXSwibmFtZXMiOlsidXNlQ29udGV4dCIsIlN0YXRlMUNvbnRleHQiLCJTdGF0ZTJDb250ZXh0IiwiU3RhdGVDb250ZXh0Iiwic3RhdGVDb250ZXh0cyIsInVzZVN0YXRlQ29udGV4dCIsInRpZXIiXSwibWFwcGluZ3MiOiJBQUFBLFNBQVNBLFVBQVQsUUFBMkIsT0FBM0I7QUFFQSxPQUFPQyxhQUFQLE1BQTBCLG9DQUExQjtBQUNBLE9BQU9DLGFBQVAsTUFBMEIsb0NBQTFCO0FBQ0EsT0FBT0MsWUFBUCxNQUF5QixtQ0FBekI7QUFFQSxJQUFNQyxhQUFhLEdBQUcsQ0FBQ0QsWUFBRCxFQUFlRixhQUFmLEVBQThCQyxhQUE5QixDQUF0QjtBQUVBLGVBQWUsU0FBU0csZUFBVCxDQUF5QkMsSUFBekIsRUFBK0I7QUFDNUMsU0FBT04sVUFBVSxDQUFDSSxhQUFhLENBQUNFLElBQUQsQ0FBYixJQUF1QkYsYUFBYSxDQUFDLENBQUQsQ0FBckMsQ0FBakI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBTdGF0ZTFDb250ZXh0IGZyb20gJy4uLy4uL1Njcm9sbFRvQm90dG9tL1N0YXRlMUNvbnRleHQnO1xuaW1wb3J0IFN0YXRlMkNvbnRleHQgZnJvbSAnLi4vLi4vU2Nyb2xsVG9Cb3R0b20vU3RhdGUyQ29udGV4dCc7XG5pbXBvcnQgU3RhdGVDb250ZXh0IGZyb20gJy4uLy4uL1Njcm9sbFRvQm90dG9tL1N0YXRlQ29udGV4dCc7XG5cbmNvbnN0IHN0YXRlQ29udGV4dHMgPSBbU3RhdGVDb250ZXh0LCBTdGF0ZTFDb250ZXh0LCBTdGF0ZTJDb250ZXh0XTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlU3RhdGVDb250ZXh0KHRpZXIpIHtcbiAgcmV0dXJuIHVzZUNvbnRleHQoc3RhdGVDb250ZXh0c1t0aWVyXSB8fCBzdGF0ZUNvbnRleHRzWzBdKTtcbn1cbiJdfQ==

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(10);
var IE8_DOM_DEFINE = __webpack_require__(119);
var anObject = __webpack_require__(17);
var toPrimitive = __webpack_require__(39);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(49);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(40);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(3);

module.exports = function (CONSTRUCTOR) {
  return path[CONSTRUCTOR + 'Prototype'];
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(8);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var toObject = __webpack_require__(153);

var hasOwnProperty = {}.hasOwnProperty;

module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty.call(toObject(it), key);
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const encodePacket = __webpack_require__(213);
const decodePacket = __webpack_require__(214);

const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text

const encodePayload = (packets, callback) => {
  // some packets may be added to the array while encoding, so the initial length must be saved
  const length = packets.length;
  const encodedPackets = new Array(length);
  let count = 0;

  packets.forEach((packet, i) => {
    // force base64 encoding for binary packets
    encodePacket(packet, false, encodedPacket => {
      encodedPackets[i] = encodedPacket;
      if (++count === length) {
        callback(encodedPackets.join(SEPARATOR));
      }
    });
  });
};

const decodePayload = (encodedPayload, binaryType) => {
  const encodedPackets = encodedPayload.split(SEPARATOR);
  const packets = [];
  for (let i = 0; i < encodedPackets.length; i++) {
    const decodedPacket = decodePacket(encodedPackets[i], binaryType);
    packets.push(decodedPacket);
    if (decodedPacket.type === "error") {
      break;
    }
  }
  return packets;
};

module.exports = {
  protocol: 4,
  encodePacket,
  encodePayload,
  decodePacket,
  decodePayload
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(61);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(39);
var definePropertyModule = __webpack_require__(19);
var createPropertyDescriptor = __webpack_require__(29);

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = useFunctionContext;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ScrollToBottom_FunctionContext__ = __webpack_require__(78);


function useFunctionContext() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_react__["useContext"])(__WEBPACK_IMPORTED_MODULE_1__ScrollToBottom_FunctionContext__["a" /* default */]);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ob29rcy9pbnRlcm5hbC91c2VGdW5jdGlvbkNvbnRleHQuanMiXSwibmFtZXMiOlsidXNlQ29udGV4dCIsIkZ1bmN0aW9uQ29udGV4dCIsInVzZUZ1bmN0aW9uQ29udGV4dCJdLCJtYXBwaW5ncyI6IkFBQUEsU0FBU0EsVUFBVCxRQUEyQixPQUEzQjtBQUVBLE9BQU9DLGVBQVAsTUFBNEIsc0NBQTVCO0FBRUEsZUFBZSxTQUFTQyxrQkFBVCxHQUE4QjtBQUMzQyxTQUFPRixVQUFVLENBQUNDLGVBQUQsQ0FBakI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBGdW5jdGlvbkNvbnRleHQgZnJvbSAnLi4vLi4vU2Nyb2xsVG9Cb3R0b20vRnVuY3Rpb25Db250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlRnVuY3Rpb25Db250ZXh0KCkge1xuICByZXR1cm4gdXNlQ29udGV4dChGdW5jdGlvbkNvbnRleHQpO1xufVxuIl19

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(25);
var definePropertyModule = __webpack_require__(50);
var createPropertyDescriptor = __webpack_require__(151);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var createNonEnumerableProperty = __webpack_require__(33);
var has = __webpack_require__(26);
var setGlobal = __webpack_require__(86);
var inspectSource = __webpack_require__(156);
var InternalStateModule = __webpack_require__(157);

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var isProduction = "production" === 'production';
function warning(condition, message) {
  if (!isProduction) {
    if (condition) {
      return;
    }

    var text = "Warning: " + message;

    if (typeof console !== 'undefined') {
      console.warn(text);
    }

    try {
      throw Error(text);
    } catch (x) {}
  }
}

/* unused harmony default export */ var _unused_webpack_default_export = (warning);


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = (() => {
  if (typeof self !== "undefined") {
    return self;
  } else if (typeof window !== "undefined") {
    return window;
  } else {
    return Function("return this")();
  }
})();


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(230);

var iterableToArrayLimit = __webpack_require__(235);

var unsupportedIterableToArray = __webpack_require__(140);

var nonIterableRest = __webpack_require__(291);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(10);
var propertyIsEnumerableModule = __webpack_require__(117);
var createPropertyDescriptor = __webpack_require__(29);
var toIndexedObject = __webpack_require__(12);
var toPrimitive = __webpack_require__(39);
var has = __webpack_require__(11);
var IE8_DOM_DEFINE = __webpack_require__(119);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 40 */
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(3);
var global = __webpack_require__(5);

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);
var wellKnownSymbol = __webpack_require__(4);
var V8_VERSION = __webpack_require__(69);

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(65);
var uid = __webpack_require__(67);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(74);
var defineProperty = __webpack_require__(19).f;
var createNonEnumerableProperty = __webpack_require__(14);
var has = __webpack_require__(11);
var toString = __webpack_require__(242);
var wellKnownSymbol = __webpack_require__(4);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC, SET_METHOD) {
  if (it) {
    var target = STATIC ? it : it.prototype;
    if (!has(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
    }
    if (SET_METHOD && !TO_STRING_TAG_SUPPORT) {
      createNonEnumerableProperty(target, 'toString', toString);
    }
  }
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(74);
var classofRaw = __webpack_require__(61);
var wellKnownSymbol = __webpack_require__(4);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),
/* 48 */
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(25);
var IE8_DOM_DEFINE = __webpack_require__(154);
var anObject = __webpack_require__(20);
var toPrimitive = __webpack_require__(152);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var shared = __webpack_require__(88);
var has = __webpack_require__(26);
var uid = __webpack_require__(159);
var NATIVE_SYMBOL = __webpack_require__(164);
var USE_SYMBOL_AS_UID = __webpack_require__(323);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (NATIVE_SYMBOL && has(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(343);

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _inheritsLoose;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setPrototypeOf_js__ = __webpack_require__(186);

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  Object(__WEBPACK_IMPORTED_MODULE_0__setPrototypeOf_js__["a" /* default */])(subClass, superClass);
}

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _extends;
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var isProduction = "production" === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
    if (condition) {
        return;
    }
    if (isProduction) {
        throw new Error(prefix);
    }
    throw new Error(prefix + ": " + (message || ''));
}

/* harmony default export */ __webpack_exports__["a"] = (invariant);


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

const parser = __webpack_require__(27);
const Emitter = __webpack_require__(28);
const debug = __webpack_require__(9)("engine.io-client:transport");

class Transport extends Emitter {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} options.
   * @api private
   */
  constructor(opts) {
    super();

    this.opts = opts;
    this.query = opts.query;
    this.readyState = "";
    this.socket = opts.socket;
  }

  /**
   * Emits an error.
   *
   * @param {String} str
   * @return {Transport} for chaining
   * @api public
   */
  onError(msg, desc) {
    const err = new Error(msg);
    err.type = "TransportError";
    err.description = desc;
    this.emit("error", err);
    return this;
  }

  /**
   * Opens the transport.
   *
   * @api public
   */
  open() {
    if ("closed" === this.readyState || "" === this.readyState) {
      this.readyState = "opening";
      this.doOpen();
    }

    return this;
  }

  /**
   * Closes the transport.
   *
   * @api private
   */
  close() {
    if ("opening" === this.readyState || "open" === this.readyState) {
      this.doClose();
      this.onClose();
    }

    return this;
  }

  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   * @api private
   */
  send(packets) {
    if ("open" === this.readyState) {
      this.write(packets);
    } else {
      // this might happen if the transport was silently closed in the beforeunload event handler
      debug("transport is not open, discarding packets");
    }
  }

  /**
   * Called upon open
   *
   * @api private
   */
  onOpen() {
    this.readyState = "open";
    this.writable = true;
    this.emit("open");
  }

  /**
   * Called with data.
   *
   * @param {String} data
   * @api private
   */
  onData(data) {
    const packet = parser.decodePacket(data, this.socket.binaryType);
    this.onPacket(packet);
  }

  /**
   * Called with a decoded packet.
   */
  onPacket(packet) {
    this.emit("packet", packet);
  }

  /**
   * Called upon close.
   *
   * @api private
   */
  onClose() {
    this.readyState = "closed";
    this.emit("close");
  }
}

module.exports = Transport;


/***/ }),
/* 59 */
/***/ (function(module, exports) {

/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;
const Emitter = __webpack_require__(28);
const binary_1 = __webpack_require__(223);
const is_binary_1 = __webpack_require__(110);
const debug = __webpack_require__(9)("socket.io-parser");
/**
 * Protocol version.
 *
 * @public
 */
exports.protocol = 5;
var PacketType;
(function (PacketType) {
    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
    PacketType[PacketType["EVENT"] = 2] = "EVENT";
    PacketType[PacketType["ACK"] = 3] = "ACK";
    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
/**
 * A socket.io Encoder instance
 */
class Encoder {
    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */
    encode(obj) {
        debug("encoding packet %j", obj);
        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if (is_binary_1.hasBinary(obj)) {
                obj.type =
                    obj.type === PacketType.EVENT
                        ? PacketType.BINARY_EVENT
                        : PacketType.BINARY_ACK;
                return this.encodeAsBinary(obj);
            }
        }
        return [this.encodeAsString(obj)];
    }
    /**
     * Encode packet as string.
     */
    encodeAsString(obj) {
        // first is type
        let str = "" + obj.type;
        // attachments if we have them
        if (obj.type === PacketType.BINARY_EVENT ||
            obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
        }
        // if we have a namespace other than `/`
        // we append it followed by a comma `,`
        if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
        }
        // immediately followed by the id
        if (null != obj.id) {
            str += obj.id;
        }
        // json data
        if (null != obj.data) {
            str += JSON.stringify(obj.data);
        }
        debug("encoded %j as %s", obj, str);
        return str;
    }
    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     */
    encodeAsBinary(obj) {
        const deconstruction = binary_1.deconstructPacket(obj);
        const pack = this.encodeAsString(deconstruction.packet);
        const buffers = deconstruction.buffers;
        buffers.unshift(pack); // add packet info to beginning of data list
        return buffers; // write all the buffers
    }
}
exports.Encoder = Encoder;
/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 */
class Decoder extends Emitter {
    constructor() {
        super();
    }
    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     */
    add(obj) {
        let packet;
        if (typeof obj === "string") {
            packet = this.decodeString(obj);
            if (packet.type === PacketType.BINARY_EVENT ||
                packet.type === PacketType.BINARY_ACK) {
                // binary packet's json
                this.reconstructor = new BinaryReconstructor(packet);
                // no attachments, labeled binary but no binary data to follow
                if (packet.attachments === 0) {
                    super.emit("decoded", packet);
                }
            }
            else {
                // non-binary full packet
                super.emit("decoded", packet);
            }
        }
        else if (is_binary_1.isBinary(obj) || obj.base64) {
            // raw binary data
            if (!this.reconstructor) {
                throw new Error("got binary data when not reconstructing a packet");
            }
            else {
                packet = this.reconstructor.takeBinaryData(obj);
                if (packet) {
                    // received final buffer
                    this.reconstructor = null;
                    super.emit("decoded", packet);
                }
            }
        }
        else {
            throw new Error("Unknown type: " + obj);
        }
    }
    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     */
    decodeString(str) {
        let i = 0;
        // look up type
        const p = {
            type: Number(str.charAt(0)),
        };
        if (PacketType[p.type] === undefined) {
            throw new Error("unknown packet type " + p.type);
        }
        // look up attachments if type binary
        if (p.type === PacketType.BINARY_EVENT ||
            p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) { }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
                throw new Error("Illegal attachments");
            }
            p.attachments = Number(buf);
        }
        // look up namespace (if any)
        if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if ("," === c)
                    break;
                if (i === str.length)
                    break;
            }
            p.nsp = str.substring(start, i);
        }
        else {
            p.nsp = "/";
        }
        // look up id
        const next = str.charAt(i + 1);
        if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if (null == c || Number(c) != c) {
                    --i;
                    break;
                }
                if (i === str.length)
                    break;
            }
            p.id = Number(str.substring(start, i + 1));
        }
        // look up json data
        if (str.charAt(++i)) {
            const payload = tryParse(str.substr(i));
            if (Decoder.isPayloadValid(p.type, payload)) {
                p.data = payload;
            }
            else {
                throw new Error("invalid payload");
            }
        }
        debug("decoded %s as %j", str, p);
        return p;
    }
    static isPayloadValid(type, payload) {
        switch (type) {
            case PacketType.CONNECT:
                return typeof payload === "object";
            case PacketType.DISCONNECT:
                return payload === undefined;
            case PacketType.CONNECT_ERROR:
                return typeof payload === "string" || typeof payload === "object";
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
                return Array.isArray(payload) && payload.length > 0;
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
                return Array.isArray(payload);
        }
    }
    /**
     * Deallocates a parser's resources
     */
    destroy() {
        if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
        }
    }
}
exports.Decoder = Decoder;
function tryParse(str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return false;
    }
}
/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 */
class BinaryReconstructor {
    constructor(packet) {
        this.packet = packet;
        this.buffers = [];
        this.reconPack = packet;
    }
    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     */
    takeBinaryData(binData) {
        this.buffers.push(binData);
        if (this.buffers.length === this.reconPack.attachments) {
            // done with buffer list
            const packet = binary_1.reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
        }
        return null;
    }
    /**
     * Cleans up binary packet reconstruction variables.
     */
    finishedReconstruction() {
        this.reconPack = null;
        this.buffers = [];
    }
}


/***/ }),
/* 61 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 62 */
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(234);

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
var isArray = __webpack_require__(30);
var wellKnownSymbol = __webpack_require__(4);

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__(41);
var store = __webpack_require__(66);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.15.2',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var setGlobal = __webpack_require__(238);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),
/* 67 */
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(69);
var fails = __webpack_require__(6);

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var userAgent = __webpack_require__(123);

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] < 4 ? 1 : match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(128);
var enumBugKeys = __webpack_require__(72);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(40);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),
/* 72 */
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(128);
var enumBugKeys = __webpack_require__(72);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(4);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(243);
var global = __webpack_require__(5);
var isObject = __webpack_require__(13);
var createNonEnumerableProperty = __webpack_require__(14);
var objectHas = __webpack_require__(11);
var shared = __webpack_require__(66);
var sharedKey = __webpack_require__(45);
var hiddenKeys = __webpack_require__(44);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (objectHas(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(63);
var IndexedObject = __webpack_require__(118);
var toObject = __webpack_require__(16);
var toLength = __webpack_require__(22);
var arraySpeciesCreate = __webpack_require__(64);

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_OUT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterOut
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterOut` method
  // https://github.com/tc39/proposal-array-filtering
  filterOut: createMethod(7)
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);

var context = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createContext({
  scrollTo: function scrollTo() {
    return 0;
  },
  scrollToBottom: function scrollToBottom() {
    return 0;
  },
  scrollToEnd: function scrollToEnd() {
    return 0;
  },
  scrollToStart: function scrollToStart() {
    return 0;
  },
  scrollToTop: function scrollToTop() {
    return 0;
  }
});
context.displayName = 'ScrollToBottomFunctionContext';
/* harmony default export */ __webpack_exports__["a"] = (context);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9GdW5jdGlvbkNvbnRleHQuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJjb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsInNjcm9sbFRvIiwic2Nyb2xsVG9Cb3R0b20iLCJzY3JvbGxUb0VuZCIsInNjcm9sbFRvU3RhcnQiLCJzY3JvbGxUb1RvcCIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCO0FBRUEsSUFBTUMsT0FBTyxnQkFBR0QsS0FBSyxDQUFDRSxhQUFOLENBQW9CO0FBQ2xDQyxFQUFBQSxRQUFRLEVBQUU7QUFBQSxXQUFNLENBQU47QUFBQSxHQUR3QjtBQUVsQ0MsRUFBQUEsY0FBYyxFQUFFO0FBQUEsV0FBTSxDQUFOO0FBQUEsR0FGa0I7QUFHbENDLEVBQUFBLFdBQVcsRUFBRTtBQUFBLFdBQU0sQ0FBTjtBQUFBLEdBSHFCO0FBSWxDQyxFQUFBQSxhQUFhLEVBQUU7QUFBQSxXQUFNLENBQU47QUFBQSxHQUptQjtBQUtsQ0MsRUFBQUEsV0FBVyxFQUFFO0FBQUEsV0FBTSxDQUFOO0FBQUE7QUFMcUIsQ0FBcEIsQ0FBaEI7QUFRQU4sT0FBTyxDQUFDTyxXQUFSLEdBQXNCLCtCQUF0QjtBQUVBLGVBQWVQLE9BQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jb25zdCBjb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dCh7XG4gIHNjcm9sbFRvOiAoKSA9PiAwLFxuICBzY3JvbGxUb0JvdHRvbTogKCkgPT4gMCxcbiAgc2Nyb2xsVG9FbmQ6ICgpID0+IDAsXG4gIHNjcm9sbFRvU3RhcnQ6ICgpID0+IDAsXG4gIHNjcm9sbFRvVG9wOiAoKSA9PiAwXG59KTtcblxuY29udGV4dC5kaXNwbGF5TmFtZSA9ICdTY3JvbGxUb0JvdHRvbUZ1bmN0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbnRleHQ7XG4iXX0=

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);

var context = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createContext({
  animating: false,
  animatingToEnd: false,
  atBottom: true,
  atEnd: true,
  atStart: false,
  atTop: true,
  mode: 'bottom',
  sticky: true
});
context.displayName = 'ScrollToBottomStateContext';
/* harmony default export */ __webpack_exports__["a"] = (context);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9TdGF0ZUNvbnRleHQuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJjb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsImFuaW1hdGluZyIsImFuaW1hdGluZ1RvRW5kIiwiYXRCb3R0b20iLCJhdEVuZCIsImF0U3RhcnQiLCJhdFRvcCIsIm1vZGUiLCJzdGlja3kiLCJkaXNwbGF5TmFtZSJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBUCxNQUFrQixPQUFsQjtBQUVBLElBQU1DLE9BQU8sZ0JBQUdELEtBQUssQ0FBQ0UsYUFBTixDQUFvQjtBQUNsQ0MsRUFBQUEsU0FBUyxFQUFFLEtBRHVCO0FBRWxDQyxFQUFBQSxjQUFjLEVBQUUsS0FGa0I7QUFHbENDLEVBQUFBLFFBQVEsRUFBRSxJQUh3QjtBQUlsQ0MsRUFBQUEsS0FBSyxFQUFFLElBSjJCO0FBS2xDQyxFQUFBQSxPQUFPLEVBQUUsS0FMeUI7QUFNbENDLEVBQUFBLEtBQUssRUFBRSxJQU4yQjtBQU9sQ0MsRUFBQUEsSUFBSSxFQUFFLFFBUDRCO0FBUWxDQyxFQUFBQSxNQUFNLEVBQUU7QUFSMEIsQ0FBcEIsQ0FBaEI7QUFXQVQsT0FBTyxDQUFDVSxXQUFSLEdBQXNCLDRCQUF0QjtBQUVBLGVBQWVWLE9BQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jb25zdCBjb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dCh7XG4gIGFuaW1hdGluZzogZmFsc2UsXG4gIGFuaW1hdGluZ1RvRW5kOiBmYWxzZSxcbiAgYXRCb3R0b206IHRydWUsXG4gIGF0RW5kOiB0cnVlLFxuICBhdFN0YXJ0OiBmYWxzZSxcbiAgYXRUb3A6IHRydWUsXG4gIG1vZGU6ICdib3R0b20nLFxuICBzdGlja3k6IHRydWVcbn0pO1xuXG5jb250ZXh0LmRpc3BsYXlOYW1lID0gJ1Njcm9sbFRvQm90dG9tU3RhdGVDb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgY29udGV4dDtcbiJdfQ==

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = useStyleToClassName;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__useInternalContext__ = __webpack_require__(147);

function useStyleToClassName() {
  var _useInternalContext = Object(__WEBPACK_IMPORTED_MODULE_0__useInternalContext__["a" /* default */])(),
      styleToClassName = _useInternalContext.styleToClassName;

  return styleToClassName;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ob29rcy9pbnRlcm5hbC91c2VTdHlsZVRvQ2xhc3NOYW1lLmpzIl0sIm5hbWVzIjpbInVzZUludGVybmFsQ29udGV4dCIsInVzZVN0eWxlVG9DbGFzc05hbWUiLCJzdHlsZVRvQ2xhc3NOYW1lIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxrQkFBUCxNQUErQixzQkFBL0I7QUFFQSxlQUFlLFNBQVNDLG1CQUFULEdBQStCO0FBQzVDLDRCQUE2QkQsa0JBQWtCLEVBQS9DO0FBQUEsTUFBUUUsZ0JBQVIsdUJBQVFBLGdCQUFSOztBQUVBLFNBQU9BLGdCQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXNlSW50ZXJuYWxDb250ZXh0IGZyb20gJy4vdXNlSW50ZXJuYWxDb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlU3R5bGVUb0NsYXNzTmFtZSgpIHtcbiAgY29uc3QgeyBzdHlsZVRvQ2xhc3NOYW1lIH0gPSB1c2VJbnRlcm5hbENvbnRleHQoKTtcblxuICByZXR1cm4gc3R5bGVUb0NsYXNzTmFtZTtcbn1cbiJdfQ==

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);

var context = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createContext({
  offsetHeight: 0,
  scrollHeight: 0,
  setTarget: function setTarget() {
    return 0;
  },
  styleToClassName: function styleToClassName() {
    return '';
  }
});
context.displayName = 'ScrollToBottomInternalContext';
/* harmony default export */ __webpack_exports__["a"] = (context);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9JbnRlcm5hbENvbnRleHQuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJjb250ZXh0IiwiY3JlYXRlQ29udGV4dCIsIm9mZnNldEhlaWdodCIsInNjcm9sbEhlaWdodCIsInNldFRhcmdldCIsInN0eWxlVG9DbGFzc05hbWUiLCJkaXNwbGF5TmFtZSJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBUCxNQUFrQixPQUFsQjtBQUVBLElBQU1DLE9BQU8sZ0JBQUdELEtBQUssQ0FBQ0UsYUFBTixDQUFvQjtBQUNsQ0MsRUFBQUEsWUFBWSxFQUFFLENBRG9CO0FBRWxDQyxFQUFBQSxZQUFZLEVBQUUsQ0FGb0I7QUFHbENDLEVBQUFBLFNBQVMsRUFBRTtBQUFBLFdBQU0sQ0FBTjtBQUFBLEdBSHVCO0FBSWxDQyxFQUFBQSxnQkFBZ0IsRUFBRTtBQUFBLFdBQU0sRUFBTjtBQUFBO0FBSmdCLENBQXBCLENBQWhCO0FBT0FMLE9BQU8sQ0FBQ00sV0FBUixHQUFzQiwrQkFBdEI7QUFFQSxlQUFlTixPQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgY29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQoe1xuICBvZmZzZXRIZWlnaHQ6IDAsXG4gIHNjcm9sbEhlaWdodDogMCxcbiAgc2V0VGFyZ2V0OiAoKSA9PiAwLFxuICBzdHlsZVRvQ2xhc3NOYW1lOiAoKSA9PiAnJ1xufSk7XG5cbmNvbnRleHQuZGlzcGxheU5hbWUgPSAnU2Nyb2xsVG9Cb3R0b21JbnRlcm5hbENvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjb250ZXh0O1xuIl19

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(297);

var iterableToArray = __webpack_require__(298);

var unsupportedIterableToArray = __webpack_require__(140);

var nonIterableSpread = __webpack_require__(299);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(300);
var exec = __webpack_require__(92);

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(302);
var requireObjectCoercible = __webpack_require__(48);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),
/* 85 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var createNonEnumerableProperty = __webpack_require__(33);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var setGlobal = __webpack_require__(86);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__(304);
var store = __webpack_require__(87);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.15.2',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(307);
var global = __webpack_require__(7);

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),
/* 91 */
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable regexp/no-assertion-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var regexpFlags = __webpack_require__(162);
var stickyHelpers = __webpack_require__(313);
var shared = __webpack_require__(88);
var create = __webpack_require__(314);
var getInternalState = __webpack_require__(157).get;
var UNSUPPORTED_DOT_ALL = __webpack_require__(318);
var UNSUPPORTED_NCG = __webpack_require__(319);

var nativeExec = RegExp.prototype.exec;
var nativeReplace = shared('native-string-replace', String.prototype.replace);

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  // eslint-disable-next-line max-statements -- TODO
  patchedExec = function exec(str) {
    var re = this;
    var state = getInternalState(re);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = patchedExec.call(raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(340);

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(52);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var asap = __webpack_require__(176);

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  this._75 = 0;
  this._83 = 0;
  this._18 = null;
  this._38 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._47 = null;
Promise._71 = null;
Promise._44 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._83 === 3) {
    self = self._18;
  }
  if (Promise._47) {
    Promise._47(self);
  }
  if (self._83 === 0) {
    if (self._75 === 0) {
      self._75 = 1;
      self._38 = deferred;
      return;
    }
    if (self._75 === 1) {
      self._75 = 2;
      self._38 = [self._38, deferred];
      return;
    }
    self._38.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._83 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._83 === 1) {
        resolve(deferred.promise, self._18);
      } else {
        reject(deferred.promise, self._18);
      }
      return;
    }
    var ret = tryCallOne(cb, self._18);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._83 = 3;
      self._18 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._83 = 1;
  self._18 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._83 = 2;
  self._18 = newValue;
  if (Promise._71) {
    Promise._71(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._75 === 1) {
    handle(self, self._38);
    self._38 = null;
  }
  if (self._75 === 2) {
    for (var i = 0; i < self._38.length; i++) {
      handle(self, self._38[i]);
    }
    self._38 = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}


/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BrowserRouter; });
/* unused harmony export HashRouter */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Link; });
/* unused harmony export NavLink */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_router__ = __webpack_require__(97);
/* unused harmony reexport MemoryRouter */
/* unused harmony reexport Prompt */
/* unused harmony reexport Redirect */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_0_react_router__["a"]; });
/* unused harmony reexport Router */
/* unused harmony reexport StaticRouter */
/* unused harmony reexport Switch */
/* unused harmony reexport generatePath */
/* unused harmony reexport matchPath */
/* unused harmony reexport useHistory */
/* unused harmony reexport useLocation */
/* unused harmony reexport useParams */
/* unused harmony reexport useRouteMatch */
/* unused harmony reexport withRouter */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_helpers_esm_inheritsLoose__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_history__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_tiny_warning__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__babel_runtime_helpers_esm_extends__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_objectWithoutPropertiesLoose__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_tiny_invariant__ = __webpack_require__(57);











/**
 * The public API for a <Router> that uses HTML5 history.
 */

var BrowserRouter =
/*#__PURE__*/
function (_React$Component) {
  Object(__WEBPACK_IMPORTED_MODULE_1__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(BrowserRouter, _React$Component);

  function BrowserRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = Object(__WEBPACK_IMPORTED_MODULE_3_history__["a" /* createBrowserHistory */])(_this.props);
    return _this;
  }

  var _proto = BrowserRouter.prototype;

  _proto.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_0_react_router__["b" /* Router */], {
      history: this.history,
      children: this.props.children
    });
  };

  return BrowserRouter;
}(__WEBPACK_IMPORTED_MODULE_2_react___default.a.Component);

if (false) {
  BrowserRouter.propTypes = {
    basename: PropTypes.string,
    children: PropTypes.node,
    forceRefresh: PropTypes.bool,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number
  };

  BrowserRouter.prototype.componentDidMount = function () {
    process.env.NODE_ENV !== "production" ? warning(!this.props.history, "<BrowserRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { BrowserRouter as Router }`.") : void 0;
  };
}

/**
 * The public API for a <Router> that uses window.location.hash.
 */

var HashRouter =
/*#__PURE__*/
function (_React$Component) {
  Object(__WEBPACK_IMPORTED_MODULE_1__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(HashRouter, _React$Component);

  function HashRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = Object(__WEBPACK_IMPORTED_MODULE_3_history__["b" /* createHashHistory */])(_this.props);
    return _this;
  }

  var _proto = HashRouter.prototype;

  _proto.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_0_react_router__["b" /* Router */], {
      history: this.history,
      children: this.props.children
    });
  };

  return HashRouter;
}(__WEBPACK_IMPORTED_MODULE_2_react___default.a.Component);

if (false) {
  HashRouter.propTypes = {
    basename: PropTypes.string,
    children: PropTypes.node,
    getUserConfirmation: PropTypes.func,
    hashType: PropTypes.oneOf(["hashbang", "noslash", "slash"])
  };

  HashRouter.prototype.componentDidMount = function () {
    process.env.NODE_ENV !== "production" ? warning(!this.props.history, "<HashRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { HashRouter as Router }`.") : void 0;
  };
}

var resolveToLocation = function resolveToLocation(to, currentLocation) {
  return typeof to === "function" ? to(currentLocation) : to;
};
var normalizeToLocation = function normalizeToLocation(to, currentLocation) {
  return typeof to === "string" ? Object(__WEBPACK_IMPORTED_MODULE_3_history__["c" /* createLocation */])(to, null, null, currentLocation) : to;
};

var forwardRefShim = function forwardRefShim(C) {
  return C;
};

var forwardRef = __WEBPACK_IMPORTED_MODULE_2_react___default.a.forwardRef;

if (typeof forwardRef === "undefined") {
  forwardRef = forwardRefShim;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

var LinkAnchor = forwardRef(function (_ref, forwardedRef) {
  var innerRef = _ref.innerRef,
      navigate = _ref.navigate,
      _onClick = _ref.onClick,
      rest = Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_objectWithoutPropertiesLoose__["a" /* default */])(_ref, ["innerRef", "navigate", "onClick"]);

  var target = rest.target;

  var props = Object(__WEBPACK_IMPORTED_MODULE_6__babel_runtime_helpers_esm_extends__["a" /* default */])({}, rest, {
    onClick: function onClick(event) {
      try {
        if (_onClick) _onClick(event);
      } catch (ex) {
        event.preventDefault();
        throw ex;
      }

      if (!event.defaultPrevented && // onClick prevented default
      event.button === 0 && ( // ignore everything but left clicks
      !target || target === "_self") && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
          event.preventDefault();
          navigate();
        }
    }
  }); // React 15 compat


  if (forwardRefShim !== forwardRef) {
    props.ref = forwardedRef || innerRef;
  } else {
    props.ref = innerRef;
  }
  /* eslint-disable-next-line jsx-a11y/anchor-has-content */


  return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement("a", props);
});

if (false) {
  LinkAnchor.displayName = "LinkAnchor";
}
/**
 * The public API for rendering a history-aware <a>.
 */


var Link = forwardRef(function (_ref2, forwardedRef) {
  var _ref2$component = _ref2.component,
      component = _ref2$component === void 0 ? LinkAnchor : _ref2$component,
      replace = _ref2.replace,
      to = _ref2.to,
      innerRef = _ref2.innerRef,
      rest = Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_objectWithoutPropertiesLoose__["a" /* default */])(_ref2, ["component", "replace", "to", "innerRef"]);

  return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_0_react_router__["c" /* __RouterContext */].Consumer, null, function (context) {
    !context ?  false ? invariant(false, "You should not use <Link> outside a <Router>") : Object(__WEBPACK_IMPORTED_MODULE_8_tiny_invariant__["a" /* default */])(false) : void 0;
    var history = context.history;
    var location = normalizeToLocation(resolveToLocation(to, context.location), context.location);
    var href = location ? history.createHref(location) : "";

    var props = Object(__WEBPACK_IMPORTED_MODULE_6__babel_runtime_helpers_esm_extends__["a" /* default */])({}, rest, {
      href: href,
      navigate: function navigate() {
        var location = resolveToLocation(to, context.location);
        var method = replace ? history.replace : history.push;
        method(location);
      }
    }); // React 15 compat


    if (forwardRefShim !== forwardRef) {
      props.ref = forwardedRef || innerRef;
    } else {
      props.innerRef = innerRef;
    }

    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(component, props);
  });
});

if (false) {
  var toType = PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]);
  var refType = PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.shape({
    current: PropTypes.any
  })]);
  Link.displayName = "Link";
  Link.propTypes = {
    innerRef: refType,
    onClick: PropTypes.func,
    replace: PropTypes.bool,
    target: PropTypes.string,
    to: toType.isRequired
  };
}

var forwardRefShim$1 = function forwardRefShim(C) {
  return C;
};

var forwardRef$1 = __WEBPACK_IMPORTED_MODULE_2_react___default.a.forwardRef;

if (typeof forwardRef$1 === "undefined") {
  forwardRef$1 = forwardRefShim$1;
}

function joinClassnames() {
  for (var _len = arguments.length, classnames = new Array(_len), _key = 0; _key < _len; _key++) {
    classnames[_key] = arguments[_key];
  }

  return classnames.filter(function (i) {
    return i;
  }).join(" ");
}
/**
 * A <Link> wrapper that knows if it's "active" or not.
 */


var NavLink = forwardRef$1(function (_ref, forwardedRef) {
  var _ref$ariaCurrent = _ref["aria-current"],
      ariaCurrent = _ref$ariaCurrent === void 0 ? "page" : _ref$ariaCurrent,
      _ref$activeClassName = _ref.activeClassName,
      activeClassName = _ref$activeClassName === void 0 ? "active" : _ref$activeClassName,
      activeStyle = _ref.activeStyle,
      classNameProp = _ref.className,
      exact = _ref.exact,
      isActiveProp = _ref.isActive,
      locationProp = _ref.location,
      sensitive = _ref.sensitive,
      strict = _ref.strict,
      styleProp = _ref.style,
      to = _ref.to,
      innerRef = _ref.innerRef,
      rest = Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_objectWithoutPropertiesLoose__["a" /* default */])(_ref, ["aria-current", "activeClassName", "activeStyle", "className", "exact", "isActive", "location", "sensitive", "strict", "style", "to", "innerRef"]);

  return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_0_react_router__["c" /* __RouterContext */].Consumer, null, function (context) {
    !context ?  false ? invariant(false, "You should not use <NavLink> outside a <Router>") : Object(__WEBPACK_IMPORTED_MODULE_8_tiny_invariant__["a" /* default */])(false) : void 0;
    var currentLocation = locationProp || context.location;
    var toLocation = normalizeToLocation(resolveToLocation(to, currentLocation), currentLocation);
    var path = toLocation.pathname; // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202

    var escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    var match = escapedPath ? Object(__WEBPACK_IMPORTED_MODULE_0_react_router__["d" /* matchPath */])(currentLocation.pathname, {
      path: escapedPath,
      exact: exact,
      sensitive: sensitive,
      strict: strict
    }) : null;
    var isActive = !!(isActiveProp ? isActiveProp(match, currentLocation) : match);
    var className = isActive ? joinClassnames(classNameProp, activeClassName) : classNameProp;
    var style = isActive ? Object(__WEBPACK_IMPORTED_MODULE_6__babel_runtime_helpers_esm_extends__["a" /* default */])({}, styleProp, {}, activeStyle) : styleProp;

    var props = Object(__WEBPACK_IMPORTED_MODULE_6__babel_runtime_helpers_esm_extends__["a" /* default */])({
      "aria-current": isActive && ariaCurrent || null,
      className: className,
      style: style,
      to: toLocation
    }, rest); // React 15 compat


    if (forwardRefShim$1 !== forwardRef$1) {
      props.ref = forwardedRef || innerRef;
    } else {
      props.innerRef = innerRef;
    }

    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(Link, props);
  });
});

if (false) {
  NavLink.displayName = "NavLink";
  var ariaCurrentType = PropTypes.oneOf(["page", "step", "location", "date", "time", "true"]);
  NavLink.propTypes = _extends({}, Link.propTypes, {
    "aria-current": ariaCurrentType,
    activeClassName: PropTypes.string,
    activeStyle: PropTypes.object,
    className: PropTypes.string,
    exact: PropTypes.bool,
    isActive: PropTypes.func,
    location: PropTypes.object,
    sensitive: PropTypes.bool,
    strict: PropTypes.bool,
    style: PropTypes.object
  });
}


//# sourceMappingURL=react-router-dom.js.map


/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MemoryRouter */
/* unused harmony export Prompt */
/* unused harmony export Redirect */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Route; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Router; });
/* unused harmony export StaticRouter */
/* unused harmony export Switch */
/* unused harmony export __HistoryContext */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return context; });
/* unused harmony export generatePath */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return matchPath; });
/* unused harmony export useHistory */
/* unused harmony export useLocation */
/* unused harmony export useParams */
/* unused harmony export useRouteMatch */
/* unused harmony export withRouter */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_inheritsLoose__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_history__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_tiny_warning__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_mini_create_react_context__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_tiny_invariant__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_extends__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_path_to_regexp__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_path_to_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_path_to_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react_is__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react_is___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_react_is__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__babel_runtime_helpers_esm_objectWithoutPropertiesLoose__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_hoist_non_react_statics__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_hoist_non_react_statics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_hoist_non_react_statics__);













// TODO: Replace with React.createContext once we can assume React 16+

var createNamedContext = function createNamedContext(name) {
  var context = Object(__WEBPACK_IMPORTED_MODULE_5_mini_create_react_context__["a" /* default */])();
  context.displayName = name;
  return context;
};

var historyContext =
/*#__PURE__*/
createNamedContext("Router-History");

// TODO: Replace with React.createContext once we can assume React 16+

var createNamedContext$1 = function createNamedContext(name) {
  var context = Object(__WEBPACK_IMPORTED_MODULE_5_mini_create_react_context__["a" /* default */])();
  context.displayName = name;
  return context;
};

var context =
/*#__PURE__*/
createNamedContext$1("Router");

/**
 * The public API for putting history on context.
 */

var Router =
/*#__PURE__*/
function (_React$Component) {
  Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(Router, _React$Component);

  Router.computeRootMatch = function computeRootMatch(pathname) {
    return {
      path: "/",
      url: "/",
      params: {},
      isExact: pathname === "/"
    };
  };

  function Router(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      location: props.history.location
    }; // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.

    _this._isMounted = false;
    _this._pendingLocation = null;

    if (!props.staticContext) {
      _this.unlisten = props.history.listen(function (location) {
        if (_this._isMounted) {
          _this.setState({
            location: location
          });
        } else {
          _this._pendingLocation = location;
        }
      });
    }

    return _this;
  }

  var _proto = Router.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this._isMounted = true;

    if (this._pendingLocation) {
      this.setState({
        location: this._pendingLocation
      });
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.unlisten) this.unlisten();
  };

  _proto.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(context.Provider, {
      value: {
        history: this.props.history,
        location: this.state.location,
        match: Router.computeRootMatch(this.state.location.pathname),
        staticContext: this.props.staticContext
      }
    }, __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(historyContext.Provider, {
      children: this.props.children || null,
      value: this.props.history
    }));
  };

  return Router;
}(__WEBPACK_IMPORTED_MODULE_1_react___default.a.Component);

if (false) {
  Router.propTypes = {
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
    staticContext: PropTypes.object
  };

  Router.prototype.componentDidUpdate = function (prevProps) {
    process.env.NODE_ENV !== "production" ? warning(prevProps.history === this.props.history, "You cannot change <Router history>") : void 0;
  };
}

/**
 * The public API for a <Router> that stores location in memory.
 */

var MemoryRouter =
/*#__PURE__*/
function (_React$Component) {
  Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(MemoryRouter, _React$Component);

  function MemoryRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = Object(__WEBPACK_IMPORTED_MODULE_3_history__["d" /* createMemoryHistory */])(_this.props);
    return _this;
  }

  var _proto = MemoryRouter.prototype;

  _proto.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(Router, {
      history: this.history,
      children: this.props.children
    });
  };

  return MemoryRouter;
}(__WEBPACK_IMPORTED_MODULE_1_react___default.a.Component);

if (false) {
  MemoryRouter.propTypes = {
    initialEntries: PropTypes.array,
    initialIndex: PropTypes.number,
    getUserConfirmation: PropTypes.func,
    keyLength: PropTypes.number,
    children: PropTypes.node
  };

  MemoryRouter.prototype.componentDidMount = function () {
    process.env.NODE_ENV !== "production" ? warning(!this.props.history, "<MemoryRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { MemoryRouter as Router }`.") : void 0;
  };
}

var Lifecycle =
/*#__PURE__*/
function (_React$Component) {
  Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(Lifecycle, _React$Component);

  function Lifecycle() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Lifecycle.prototype;

  _proto.componentDidMount = function componentDidMount() {
    if (this.props.onMount) this.props.onMount.call(this, this);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.props.onUnmount) this.props.onUnmount.call(this, this);
  };

  _proto.render = function render() {
    return null;
  };

  return Lifecycle;
}(__WEBPACK_IMPORTED_MODULE_1_react___default.a.Component);

/**
 * The public API for prompting the user before navigating away from a screen.
 */

function Prompt(_ref) {
  var message = _ref.message,
      _ref$when = _ref.when,
      when = _ref$when === void 0 ? true : _ref$when;
  return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(context.Consumer, null, function (context) {
    !context ?  false ? invariant(false, "You should not use <Prompt> outside a <Router>") : Object(__WEBPACK_IMPORTED_MODULE_6_tiny_invariant__["a" /* default */])(false) : void 0;
    if (!when || context.staticContext) return null;
    var method = context.history.block;
    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(Lifecycle, {
      onMount: function onMount(self) {
        self.release = method(message);
      },
      onUpdate: function onUpdate(self, prevProps) {
        if (prevProps.message !== message) {
          self.release();
          self.release = method(message);
        }
      },
      onUnmount: function onUnmount(self) {
        self.release();
      },
      message: message
    });
  });
}

if (false) {
  var messageType = PropTypes.oneOfType([PropTypes.func, PropTypes.string]);
  Prompt.propTypes = {
    when: PropTypes.bool,
    message: messageType.isRequired
  };
}

var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;

function compilePath(path) {
  if (cache[path]) return cache[path];
  var generator = __WEBPACK_IMPORTED_MODULE_8_path_to_regexp___default.a.compile(path);

  if (cacheCount < cacheLimit) {
    cache[path] = generator;
    cacheCount++;
  }

  return generator;
}
/**
 * Public API for generating a URL pathname from a path and parameters.
 */


function generatePath(path, params) {
  if (path === void 0) {
    path = "/";
  }

  if (params === void 0) {
    params = {};
  }

  return path === "/" ? path : compilePath(path)(params, {
    pretty: true
  });
}

/**
 * The public API for navigating programmatically with a component.
 */

function Redirect(_ref) {
  var computedMatch = _ref.computedMatch,
      to = _ref.to,
      _ref$push = _ref.push,
      push = _ref$push === void 0 ? false : _ref$push;
  return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(context.Consumer, null, function (context) {
    !context ?  false ? invariant(false, "You should not use <Redirect> outside a <Router>") : Object(__WEBPACK_IMPORTED_MODULE_6_tiny_invariant__["a" /* default */])(false) : void 0;
    var history = context.history,
        staticContext = context.staticContext;
    var method = push ? history.push : history.replace;
    var location = Object(__WEBPACK_IMPORTED_MODULE_3_history__["c" /* createLocation */])(computedMatch ? typeof to === "string" ? generatePath(to, computedMatch.params) : Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_extends__["a" /* default */])({}, to, {
      pathname: generatePath(to.pathname, computedMatch.params)
    }) : to); // When rendering in a static context,
    // set the new location immediately.

    if (staticContext) {
      method(location);
      return null;
    }

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(Lifecycle, {
      onMount: function onMount() {
        method(location);
      },
      onUpdate: function onUpdate(self, prevProps) {
        var prevLocation = Object(__WEBPACK_IMPORTED_MODULE_3_history__["c" /* createLocation */])(prevProps.to);

        if (!Object(__WEBPACK_IMPORTED_MODULE_3_history__["f" /* locationsAreEqual */])(prevLocation, Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_extends__["a" /* default */])({}, location, {
          key: prevLocation.key
        }))) {
          method(location);
        }
      },
      to: to
    });
  });
}

if (false) {
  Redirect.propTypes = {
    push: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
  };
}

var cache$1 = {};
var cacheLimit$1 = 10000;
var cacheCount$1 = 0;

function compilePath$1(path, options) {
  var cacheKey = "" + options.end + options.strict + options.sensitive;
  var pathCache = cache$1[cacheKey] || (cache$1[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  var keys = [];
  var regexp = __WEBPACK_IMPORTED_MODULE_8_path_to_regexp___default()(path, keys, options);
  var result = {
    regexp: regexp,
    keys: keys
  };

  if (cacheCount$1 < cacheLimit$1) {
    pathCache[path] = result;
    cacheCount$1++;
  }

  return result;
}
/**
 * Public API for matching a URL pathname to a path.
 */


function matchPath(pathname, options) {
  if (options === void 0) {
    options = {};
  }

  if (typeof options === "string" || Array.isArray(options)) {
    options = {
      path: options
    };
  }

  var _options = options,
      path = _options.path,
      _options$exact = _options.exact,
      exact = _options$exact === void 0 ? false : _options$exact,
      _options$strict = _options.strict,
      strict = _options$strict === void 0 ? false : _options$strict,
      _options$sensitive = _options.sensitive,
      sensitive = _options$sensitive === void 0 ? false : _options$sensitive;
  var paths = [].concat(path);
  return paths.reduce(function (matched, path) {
    if (!path && path !== "") return null;
    if (matched) return matched;

    var _compilePath = compilePath$1(path, {
      end: exact,
      strict: strict,
      sensitive: sensitive
    }),
        regexp = _compilePath.regexp,
        keys = _compilePath.keys;

    var match = regexp.exec(pathname);
    if (!match) return null;
    var url = match[0],
        values = match.slice(1);
    var isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path: path,
      // the path used to match
      url: path === "/" && url === "" ? "/" : url,
      // the matched portion of the URL
      isExact: isExact,
      // whether or not we matched exactly
      params: keys.reduce(function (memo, key, index) {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

function isEmptyChildren(children) {
  return __WEBPACK_IMPORTED_MODULE_1_react___default.a.Children.count(children) === 0;
}

function evalChildrenDev(children, props, path) {
  var value = children(props);
   false ? warning(value !== undefined, "You returned `undefined` from the `children` function of " + ("<Route" + (path ? " path=\"" + path + "\"" : "") + ">, but you ") + "should have returned a React element or `null`") : void 0;
  return value || null;
}
/**
 * The public API for matching a single path and rendering.
 */


var Route =
/*#__PURE__*/
function (_React$Component) {
  Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(Route, _React$Component);

  function Route() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Route.prototype;

  _proto.render = function render() {
    var _this = this;

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(context.Consumer, null, function (context$1) {
      !context$1 ?  false ? invariant(false, "You should not use <Route> outside a <Router>") : Object(__WEBPACK_IMPORTED_MODULE_6_tiny_invariant__["a" /* default */])(false) : void 0;
      var location = _this.props.location || context$1.location;
      var match = _this.props.computedMatch ? _this.props.computedMatch // <Switch> already computed the match for us
      : _this.props.path ? matchPath(location.pathname, _this.props) : context$1.match;

      var props = Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_extends__["a" /* default */])({}, context$1, {
        location: location,
        match: match
      });

      var _this$props = _this.props,
          children = _this$props.children,
          component = _this$props.component,
          render = _this$props.render; // Preact uses an empty array as children by
      // default, so use null if that's the case.

      if (Array.isArray(children) && children.length === 0) {
        children = null;
      }

      return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(context.Provider, {
        value: props
      }, props.match ? children ? typeof children === "function" ?  false ? evalChildrenDev(children, props, _this.props.path) : children(props) : children : component ? __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(component, props) : render ? render(props) : null : typeof children === "function" ?  false ? evalChildrenDev(children, props, _this.props.path) : children(props) : null);
    });
  };

  return Route;
}(__WEBPACK_IMPORTED_MODULE_1_react___default.a.Component);

if (false) {
  Route.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    component: function component(props, propName) {
      if (props[propName] && !isValidElementType(props[propName])) {
        return new Error("Invalid prop 'component' supplied to 'Route': the prop is not a valid React component");
      }
    },
    exact: PropTypes.bool,
    location: PropTypes.object,
    path: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    render: PropTypes.func,
    sensitive: PropTypes.bool,
    strict: PropTypes.bool
  };

  Route.prototype.componentDidMount = function () {
    process.env.NODE_ENV !== "production" ? warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.component), "You should not use <Route component> and <Route children> in the same route; <Route component> will be ignored") : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(this.props.children && !isEmptyChildren(this.props.children) && this.props.render), "You should not use <Route render> and <Route children> in the same route; <Route render> will be ignored") : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(this.props.component && this.props.render), "You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored") : void 0;
  };

  Route.prototype.componentDidUpdate = function (prevProps) {
    process.env.NODE_ENV !== "production" ? warning(!(this.props.location && !prevProps.location), '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(!this.props.location && prevProps.location), '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') : void 0;
  };
}

function addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path;
}

function addBasename(basename, location) {
  if (!basename) return location;
  return Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_extends__["a" /* default */])({}, location, {
    pathname: addLeadingSlash(basename) + location.pathname
  });
}

function stripBasename(basename, location) {
  if (!basename) return location;
  var base = addLeadingSlash(basename);
  if (location.pathname.indexOf(base) !== 0) return location;
  return Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_extends__["a" /* default */])({}, location, {
    pathname: location.pathname.substr(base.length)
  });
}

function createURL(location) {
  return typeof location === "string" ? location : Object(__WEBPACK_IMPORTED_MODULE_3_history__["e" /* createPath */])(location);
}

function staticHandler(methodName) {
  return function () {
      false ? invariant(false, "You cannot %s with <StaticRouter>", methodName) : Object(__WEBPACK_IMPORTED_MODULE_6_tiny_invariant__["a" /* default */])(false) ;
  };
}

function noop() {}
/**
 * The public top-level API for a "static" <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */


var StaticRouter =
/*#__PURE__*/
function (_React$Component) {
  Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(StaticRouter, _React$Component);

  function StaticRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.handlePush = function (location) {
      return _this.navigateTo(location, "PUSH");
    };

    _this.handleReplace = function (location) {
      return _this.navigateTo(location, "REPLACE");
    };

    _this.handleListen = function () {
      return noop;
    };

    _this.handleBlock = function () {
      return noop;
    };

    return _this;
  }

  var _proto = StaticRouter.prototype;

  _proto.navigateTo = function navigateTo(location, action) {
    var _this$props = this.props,
        _this$props$basename = _this$props.basename,
        basename = _this$props$basename === void 0 ? "" : _this$props$basename,
        _this$props$context = _this$props.context,
        context = _this$props$context === void 0 ? {} : _this$props$context;
    context.action = action;
    context.location = addBasename(basename, Object(__WEBPACK_IMPORTED_MODULE_3_history__["c" /* createLocation */])(location));
    context.url = createURL(context.location);
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        _this$props2$basename = _this$props2.basename,
        basename = _this$props2$basename === void 0 ? "" : _this$props2$basename,
        _this$props2$context = _this$props2.context,
        context = _this$props2$context === void 0 ? {} : _this$props2$context,
        _this$props2$location = _this$props2.location,
        location = _this$props2$location === void 0 ? "/" : _this$props2$location,
        rest = Object(__WEBPACK_IMPORTED_MODULE_10__babel_runtime_helpers_esm_objectWithoutPropertiesLoose__["a" /* default */])(_this$props2, ["basename", "context", "location"]);

    var history = {
      createHref: function createHref(path) {
        return addLeadingSlash(basename + createURL(path));
      },
      action: "POP",
      location: stripBasename(basename, Object(__WEBPACK_IMPORTED_MODULE_3_history__["c" /* createLocation */])(location)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      listen: this.handleListen,
      block: this.handleBlock
    };
    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(Router, Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_extends__["a" /* default */])({}, rest, {
      history: history,
      staticContext: context
    }));
  };

  return StaticRouter;
}(__WEBPACK_IMPORTED_MODULE_1_react___default.a.Component);

if (false) {
  StaticRouter.propTypes = {
    basename: PropTypes.string,
    context: PropTypes.object,
    location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  StaticRouter.prototype.componentDidMount = function () {
    process.env.NODE_ENV !== "production" ? warning(!this.props.history, "<StaticRouter> ignores the history prop. To use a custom history, " + "use `import { Router }` instead of `import { StaticRouter as Router }`.") : void 0;
  };
}

/**
 * The public API for rendering the first <Route> that matches.
 */

var Switch =
/*#__PURE__*/
function (_React$Component) {
  Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(Switch, _React$Component);

  function Switch() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Switch.prototype;

  _proto.render = function render() {
    var _this = this;

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(context.Consumer, null, function (context) {
      !context ?  false ? invariant(false, "You should not use <Switch> outside a <Router>") : Object(__WEBPACK_IMPORTED_MODULE_6_tiny_invariant__["a" /* default */])(false) : void 0;
      var location = _this.props.location || context.location;
      var element, match; // We use React.Children.forEach instead of React.Children.toArray().find()
      // here because toArray adds keys to all child elements and we do not want
      // to trigger an unmount/remount for two <Route>s that render the same
      // component at different URLs.

      __WEBPACK_IMPORTED_MODULE_1_react___default.a.Children.forEach(_this.props.children, function (child) {
        if (match == null && __WEBPACK_IMPORTED_MODULE_1_react___default.a.isValidElement(child)) {
          element = child;
          var path = child.props.path || child.props.from;
          match = path ? matchPath(location.pathname, Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_extends__["a" /* default */])({}, child.props, {
            path: path
          })) : context.match;
        }
      });
      return match ? __WEBPACK_IMPORTED_MODULE_1_react___default.a.cloneElement(element, {
        location: location,
        computedMatch: match
      }) : null;
    });
  };

  return Switch;
}(__WEBPACK_IMPORTED_MODULE_1_react___default.a.Component);

if (false) {
  Switch.propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  };

  Switch.prototype.componentDidUpdate = function (prevProps) {
    process.env.NODE_ENV !== "production" ? warning(!(this.props.location && !prevProps.location), '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.') : void 0;
    process.env.NODE_ENV !== "production" ? warning(!(!this.props.location && prevProps.location), '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.') : void 0;
  };
}

/**
 * A public higher-order component to access the imperative API
 */

function withRouter(Component) {
  var displayName = "withRouter(" + (Component.displayName || Component.name) + ")";

  var C = function C(props) {
    var wrappedComponentRef = props.wrappedComponentRef,
        remainingProps = Object(__WEBPACK_IMPORTED_MODULE_10__babel_runtime_helpers_esm_objectWithoutPropertiesLoose__["a" /* default */])(props, ["wrappedComponentRef"]);

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(context.Consumer, null, function (context) {
      !context ?  false ? invariant(false, "You should not use <" + displayName + " /> outside a <Router>") : Object(__WEBPACK_IMPORTED_MODULE_6_tiny_invariant__["a" /* default */])(false) : void 0;
      return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(Component, Object(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_helpers_esm_extends__["a" /* default */])({}, remainingProps, context, {
        ref: wrappedComponentRef
      }));
    });
  };

  C.displayName = displayName;
  C.WrappedComponent = Component;

  if (false) {
    C.propTypes = {
      wrappedComponentRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object])
    };
  }

  return __WEBPACK_IMPORTED_MODULE_11_hoist_non_react_statics___default()(C, Component);
}

var useContext = __WEBPACK_IMPORTED_MODULE_1_react___default.a.useContext;
function useHistory() {
  if (false) {
    !(typeof useContext === "function") ? process.env.NODE_ENV !== "production" ? invariant(false, "You must use React >= 16.8 in order to use useHistory()") : invariant(false) : void 0;
  }

  return useContext(historyContext);
}
function useLocation() {
  if (false) {
    !(typeof useContext === "function") ? process.env.NODE_ENV !== "production" ? invariant(false, "You must use React >= 16.8 in order to use useLocation()") : invariant(false) : void 0;
  }

  return useContext(context).location;
}
function useParams() {
  if (false) {
    !(typeof useContext === "function") ? process.env.NODE_ENV !== "production" ? invariant(false, "You must use React >= 16.8 in order to use useParams()") : invariant(false) : void 0;
  }

  var match = useContext(context).match;
  return match ? match.params : {};
}
function useRouteMatch(path) {
  if (false) {
    !(typeof useContext === "function") ? process.env.NODE_ENV !== "production" ? invariant(false, "You must use React >= 16.8 in order to use useRouteMatch()") : invariant(false) : void 0;
  }

  var location = useLocation();
  var match = useContext(context).match;
  return path ? matchPath(location.pathname, path) : match;
}

if (false) {
  if (typeof window !== "undefined") {
    var global = window;
    var key = "__react_router_build__";
    var buildNames = {
      cjs: "CommonJS",
      esm: "ES modules",
      umd: "UMD"
    };

    if (global[key] && global[key] !== "esm") {
      var initialBuildName = buildNames[global[key]];
      var secondaryBuildName = buildNames["esm"]; // TODO: Add link to article that explains in detail how to avoid
      // loading 2 different builds.

      throw new Error("You are loading the " + secondaryBuildName + " build of React Router " + ("on a page that is already running the " + initialBuildName + " ") + "build, so things won't work right.");
    }

    global[key] = "esm";
  }
}


//# sourceMappingURL=react-router.js.map


/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createBrowserHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return createHashHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return createMemoryHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return createLocation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return locationsAreEqual; });
/* unused harmony export parsePath */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return createPath; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_extends__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_resolve_pathname__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_value_equal__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_tiny_warning__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_tiny_invariant__ = __webpack_require__(57);






function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}
function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}
function hasBasename(path, prefix) {
  return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
}
function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}
function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';
  var hashIndex = pathname.indexOf('#');

  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');

  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
}
function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';
  if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
  return path;
}

function createLocation(path, state, key, currentLocation) {
  var location;

  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_extends__["a" /* default */])({}, path);
    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = Object(__WEBPACK_IMPORTED_MODULE_1_resolve_pathname__["a" /* default */])(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
}
function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && Object(__WEBPACK_IMPORTED_MODULE_2_value_equal__["a" /* default */])(a.state, b.state);
}

function createTransitionManager() {
  var prompt = null;

  function setPrompt(nextPrompt) {
     false ? warning(prompt == null, 'A history supports only one prompt at a time') : void 0;
    prompt = nextPrompt;
    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  }

  function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
           false ? warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message') : void 0;
          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  }

  var listeners = [];

  function appendListener(fn) {
    var isActive = true;

    function listener() {
      if (isActive) fn.apply(void 0, arguments);
    }

    listeners.push(listener);
    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function notifyListeners() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  }

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function getConfirmation(message, callback) {
  callback(window.confirm(message)); // eslint-disable-line no-alert
}
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */

function supportsHistory() {
  var ua = window.navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
  return window.history && 'pushState' in window.history;
}
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */

function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
}
/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */

function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
}
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */

function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
}
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */


function createBrowserHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ?  false ? invariant(false, 'Browser history needs a DOM') : Object(__WEBPACK_IMPORTED_MODULE_4_tiny_invariant__["a" /* default */])(false) : void 0;
  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();
  var _props = props,
      _props$forceRefresh = _props.forceRefresh,
      forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var path = pathname + search + hash;
     false ? warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') : void 0;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path, state, key);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_extends__["a" /* default */])(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) return;
    handlePop(getDOMLocation(event.state));
  }

  function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  }

  var forceNextPop = false;

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allKeys.indexOf(fromLocation.key);
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key]; // Public interface

  function createHref(location) {
    return basename + createPath(location);
  }

  function push(path, state) {
     false ? warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : void 0;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.pushState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex + 1);
          nextKeys.push(location.key);
          allKeys = nextKeys;
          setState({
            action: action,
            location: location
          });
        }
      } else {
         false ? warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history') : void 0;
        window.location.href = href;
      }
    });
  }

  function replace(path, state) {
     false ? warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : void 0;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.replaceState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          if (prevIndex !== -1) allKeys[prevIndex] = location.key;
          setState({
            action: action,
            location: location
          });
        }
      } else {
         false ? warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history') : void 0;
        window.location.replace(href);
      }
    });
  }

  function go(n) {
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

var HashChangeEvent$1 = 'hashchange';
var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substr(1) : path;
    }
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

function stripHash(url) {
  var hashIndex = url.indexOf('#');
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
}

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
}

function pushHashPath(path) {
  window.location.hash = path;
}

function replaceHashPath(path) {
  window.location.replace(stripHash(window.location.href) + '#' + path);
}

function createHashHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ?  false ? invariant(false, 'Hash history needs a DOM') : Object(__WEBPACK_IMPORTED_MODULE_4_tiny_invariant__["a" /* default */])(false) : void 0;
  var globalHistory = window.history;
  var canGoWithoutReload = supportsGoWithoutReloadUsingHash();
  var _props = props,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$hashType = _props.hashType,
      hashType = _props$hashType === void 0 ? 'slash' : _props$hashType;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
  var _HashPathCoders$hashT = HashPathCoders[hashType],
      encodePath = _HashPathCoders$hashT.encodePath,
      decodePath = _HashPathCoders$hashT.decodePath;

  function getDOMLocation() {
    var path = decodePath(getHashPath());
     false ? warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') : void 0;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_extends__["a" /* default */])(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  var forceNextPop = false;
  var ignorePath = null;

  function locationsAreEqual$$1(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
  }

  function handleHashChange() {
    var path = getHashPath();
    var encodedPath = encodePath(path);

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var location = getDOMLocation();
      var prevLocation = history.location;
      if (!forceNextPop && locationsAreEqual$$1(prevLocation, location)) return; // A hashchange doesn't always == location change.

      if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

      ignorePath = null;
      handlePop(location);
    }
  }

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    var toIndex = allPaths.lastIndexOf(createPath(toLocation));
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  } // Ensure the hash is encoded properly before doing anything else.


  var path = getHashPath();
  var encodedPath = encodePath(path);
  if (path !== encodedPath) replaceHashPath(encodedPath);
  var initialLocation = getDOMLocation();
  var allPaths = [createPath(initialLocation)]; // Public interface

  function createHref(location) {
    var baseTag = document.querySelector('base');
    var href = '';

    if (baseTag && baseTag.getAttribute('href')) {
      href = stripHash(window.location.href);
    }

    return href + '#' + encodePath(basename + createPath(location));
  }

  function push(path, state) {
     false ? warning(state === undefined, 'Hash history cannot push state; it is ignored') : void 0;
    var action = 'PUSH';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        pushHashPath(encodedPath);
        var prevIndex = allPaths.lastIndexOf(createPath(history.location));
        var nextPaths = allPaths.slice(0, prevIndex + 1);
        nextPaths.push(path);
        allPaths = nextPaths;
        setState({
          action: action,
          location: location
        });
      } else {
         false ? warning(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack') : void 0;
        setState();
      }
    });
  }

  function replace(path, state) {
     false ? warning(state === undefined, 'Hash history cannot replace state; it is ignored') : void 0;
    var action = 'REPLACE';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        replaceHashPath(encodedPath);
      }

      var prevIndex = allPaths.indexOf(createPath(history.location));
      if (prevIndex !== -1) allPaths[prevIndex] = path;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
     false ? warning(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser') : void 0;
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(HashChangeEvent$1, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(HashChangeEvent$1, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}
/**
 * Creates a history object that stores locations in memory.
 */


function createMemoryHistory(props) {
  if (props === void 0) {
    props = {};
  }

  var _props = props,
      getUserConfirmation = _props.getUserConfirmation,
      _props$initialEntries = _props.initialEntries,
      initialEntries = _props$initialEntries === void 0 ? ['/'] : _props$initialEntries,
      _props$initialIndex = _props.initialIndex,
      initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var transitionManager = createTransitionManager();

  function setState(nextState) {
    Object(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_helpers_esm_extends__["a" /* default */])(history, nextState);

    history.length = history.entries.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var index = clamp(initialIndex, 0, initialEntries.length - 1);
  var entries = initialEntries.map(function (entry) {
    return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
  }); // Public interface

  var createHref = createPath;

  function push(path, state) {
     false ? warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : void 0;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var prevIndex = history.index;
      var nextIndex = prevIndex + 1;
      var nextEntries = history.entries.slice(0);

      if (nextEntries.length > nextIndex) {
        nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
      } else {
        nextEntries.push(location);
      }

      setState({
        action: action,
        location: location,
        index: nextIndex,
        entries: nextEntries
      });
    });
  }

  function replace(path, state) {
     false ? warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') : void 0;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      history.entries[history.index] = location;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
    var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);
    var action = 'POP';
    var location = history.entries[nextIndex];
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (ok) {
        setState({
          action: action,
          location: location,
          index: nextIndex
        });
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        setState();
      }
    });
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function canGo(n) {
    var nextIndex = history.index + n;
    return nextIndex >= 0 && nextIndex < history.entries.length;
  }

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    return transitionManager.setPrompt(prompt);
  }

  function listen(listener) {
    return transitionManager.appendListener(listener);
  }

  var history = {
    length: entries.length,
    action: 'POP',
    location: entries[index],
    index: index,
    entries: entries,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    canGo: canGo,
    block: block,
    listen: listen
  };
  return history;
}




/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(194);
} else {
  module.exports = require('./cjs/react-is.development.js');
}


/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _objectWithoutPropertiesLoose;
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

/***/ }),
/* 101 */
/***/ (function(module, exports) {

/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    uri.pathNames = pathNames(uri, uri['path']);
    uri.queryKey = queryKey(uri, uri['query']);

    return uri;
};

function pathNames(obj, path) {
    var regx = /\/{2,9}/g,
        names = path.replace(regx, "/").split("/");

    if (path.substr(0, 1) == '/' || path.length === 0) {
        names.splice(0, 1);
    }
    if (path.substr(path.length - 1, 1) == '/') {
        names.splice(names.length - 1, 1);
    }

    return names;
}

function queryKey(uri, query) {
    var data = {};

    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
        if ($1) {
            data[$1] = $2;
        }
    });

    return data;
}


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const eio = __webpack_require__(209);
const socket_1 = __webpack_require__(109);
const parser = __webpack_require__(60);
const on_1 = __webpack_require__(111);
const Backoff = __webpack_require__(224);
const typed_events_1 = __webpack_require__(112);
const debug = __webpack_require__(9)("socket.io-client:manager");
class Manager extends typed_events_1.StrictEventEmitter {
    constructor(uri, opts) {
        super();
        this.nsps = {};
        this.subs = [];
        if (uri && "object" === typeof uri) {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        opts.path = opts.path || "/socket.io";
        this.opts = opts;
        this.reconnection(opts.reconnection !== false);
        this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
        this.reconnectionDelay(opts.reconnectionDelay || 1000);
        this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
        this.randomizationFactor(opts.randomizationFactor || 0.5);
        this.backoff = new Backoff({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor(),
        });
        this.timeout(null == opts.timeout ? 20000 : opts.timeout);
        this._readyState = "closed";
        this.uri = uri;
        const _parser = opts.parser || parser;
        this.encoder = new _parser.Encoder();
        this.decoder = new _parser.Decoder();
        this._autoConnect = opts.autoConnect !== false;
        if (this._autoConnect)
            this.open();
    }
    reconnection(v) {
        if (!arguments.length)
            return this._reconnection;
        this._reconnection = !!v;
        return this;
    }
    reconnectionAttempts(v) {
        if (v === undefined)
            return this._reconnectionAttempts;
        this._reconnectionAttempts = v;
        return this;
    }
    reconnectionDelay(v) {
        var _a;
        if (v === undefined)
            return this._reconnectionDelay;
        this._reconnectionDelay = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
        return this;
    }
    randomizationFactor(v) {
        var _a;
        if (v === undefined)
            return this._randomizationFactor;
        this._randomizationFactor = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
        return this;
    }
    reconnectionDelayMax(v) {
        var _a;
        if (v === undefined)
            return this._reconnectionDelayMax;
        this._reconnectionDelayMax = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
        return this;
    }
    timeout(v) {
        if (!arguments.length)
            return this._timeout;
        this._timeout = v;
        return this;
    }
    /**
     * Starts trying to reconnect if reconnection is enabled and we have not
     * started reconnecting yet
     *
     * @private
     */
    maybeReconnectOnOpen() {
        // Only try to reconnect if it's the first time we're connecting
        if (!this._reconnecting &&
            this._reconnection &&
            this.backoff.attempts === 0) {
            // keeps reconnection from firing twice for the same reconnection loop
            this.reconnect();
        }
    }
    /**
     * Sets the current transport `socket`.
     *
     * @param {Function} fn - optional, callback
     * @return self
     * @public
     */
    open(fn) {
        debug("readyState %s", this._readyState);
        if (~this._readyState.indexOf("open"))
            return this;
        debug("opening %s", this.uri);
        this.engine = eio(this.uri, this.opts);
        const socket = this.engine;
        const self = this;
        this._readyState = "opening";
        this.skipReconnect = false;
        // emit `open`
        const openSubDestroy = on_1.on(socket, "open", function () {
            self.onopen();
            fn && fn();
        });
        // emit `error`
        const errorSub = on_1.on(socket, "error", (err) => {
            debug("error");
            self.cleanup();
            self._readyState = "closed";
            this.emitReserved("error", err);
            if (fn) {
                fn(err);
            }
            else {
                // Only do this if there is no fn to handle the error
                self.maybeReconnectOnOpen();
            }
        });
        if (false !== this._timeout) {
            const timeout = this._timeout;
            debug("connect attempt will timeout after %d", timeout);
            if (timeout === 0) {
                openSubDestroy(); // prevents a race condition with the 'open' event
            }
            // set timer
            const timer = setTimeout(() => {
                debug("connect attempt timed out after %d", timeout);
                openSubDestroy();
                socket.close();
                socket.emit("error", new Error("timeout"));
            }, timeout);
            if (this.opts.autoUnref) {
                timer.unref();
            }
            this.subs.push(function subDestroy() {
                clearTimeout(timer);
            });
        }
        this.subs.push(openSubDestroy);
        this.subs.push(errorSub);
        return this;
    }
    /**
     * Alias for open()
     *
     * @return self
     * @public
     */
    connect(fn) {
        return this.open(fn);
    }
    /**
     * Called upon transport open.
     *
     * @private
     */
    onopen() {
        debug("open");
        // clear old subs
        this.cleanup();
        // mark as open
        this._readyState = "open";
        this.emitReserved("open");
        // add new subs
        const socket = this.engine;
        this.subs.push(on_1.on(socket, "ping", this.onping.bind(this)), on_1.on(socket, "data", this.ondata.bind(this)), on_1.on(socket, "error", this.onerror.bind(this)), on_1.on(socket, "close", this.onclose.bind(this)), on_1.on(this.decoder, "decoded", this.ondecoded.bind(this)));
    }
    /**
     * Called upon a ping.
     *
     * @private
     */
    onping() {
        this.emitReserved("ping");
    }
    /**
     * Called with data.
     *
     * @private
     */
    ondata(data) {
        this.decoder.add(data);
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */
    ondecoded(packet) {
        this.emitReserved("packet", packet);
    }
    /**
     * Called upon socket error.
     *
     * @private
     */
    onerror(err) {
        debug("error", err);
        this.emitReserved("error", err);
    }
    /**
     * Creates a new socket for the given `nsp`.
     *
     * @return {Socket}
     * @public
     */
    socket(nsp, opts) {
        let socket = this.nsps[nsp];
        if (!socket) {
            socket = new socket_1.Socket(this, nsp, opts);
            this.nsps[nsp] = socket;
        }
        return socket;
    }
    /**
     * Called upon a socket close.
     *
     * @param socket
     * @private
     */
    _destroy(socket) {
        const nsps = Object.keys(this.nsps);
        for (const nsp of nsps) {
            const socket = this.nsps[nsp];
            if (socket.active) {
                debug("socket %s is still active, skipping close", nsp);
                return;
            }
        }
        this._close();
    }
    /**
     * Writes a packet.
     *
     * @param packet
     * @private
     */
    _packet(packet) {
        debug("writing packet %j", packet);
        const encodedPackets = this.encoder.encode(packet);
        for (let i = 0; i < encodedPackets.length; i++) {
            this.engine.write(encodedPackets[i], packet.options);
        }
    }
    /**
     * Clean up transport subscriptions and packet buffer.
     *
     * @private
     */
    cleanup() {
        debug("cleanup");
        this.subs.forEach((subDestroy) => subDestroy());
        this.subs.length = 0;
        this.decoder.destroy();
    }
    /**
     * Close the current socket.
     *
     * @private
     */
    _close() {
        debug("disconnect");
        this.skipReconnect = true;
        this._reconnecting = false;
        if ("opening" === this._readyState) {
            // `onclose` will not fire because
            // an open event never happened
            this.cleanup();
        }
        this.backoff.reset();
        this._readyState = "closed";
        if (this.engine)
            this.engine.close();
    }
    /**
     * Alias for close()
     *
     * @private
     */
    disconnect() {
        return this._close();
    }
    /**
     * Called upon engine close.
     *
     * @private
     */
    onclose(reason) {
        debug("onclose");
        this.cleanup();
        this.backoff.reset();
        this._readyState = "closed";
        this.emitReserved("close", reason);
        if (this._reconnection && !this.skipReconnect) {
            this.reconnect();
        }
    }
    /**
     * Attempt a reconnection.
     *
     * @private
     */
    reconnect() {
        if (this._reconnecting || this.skipReconnect)
            return this;
        const self = this;
        if (this.backoff.attempts >= this._reconnectionAttempts) {
            debug("reconnect failed");
            this.backoff.reset();
            this.emitReserved("reconnect_failed");
            this._reconnecting = false;
        }
        else {
            const delay = this.backoff.duration();
            debug("will wait %dms before reconnect attempt", delay);
            this._reconnecting = true;
            const timer = setTimeout(() => {
                if (self.skipReconnect)
                    return;
                debug("attempting reconnect");
                this.emitReserved("reconnect_attempt", self.backoff.attempts);
                // check again for the case socket closed in above events
                if (self.skipReconnect)
                    return;
                self.open((err) => {
                    if (err) {
                        debug("reconnect attempt error");
                        self._reconnecting = false;
                        self.reconnect();
                        this.emitReserved("reconnect_error", err);
                    }
                    else {
                        debug("reconnect success");
                        self.onreconnect();
                    }
                });
            }, delay);
            if (this.opts.autoUnref) {
                timer.unref();
            }
            this.subs.push(function subDestroy() {
                clearTimeout(timer);
            });
        }
    }
    /**
     * Called upon successful reconnect.
     *
     * @private
     */
    onreconnect() {
        const attempt = this.backoff.attempts;
        this._reconnecting = false;
        this.backoff.reset();
        this.emitReserved("reconnect", attempt);
    }
}
exports.Manager = Manager;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

const XMLHttpRequest = __webpack_require__(104);
const XHR = __webpack_require__(212);
const JSONP = __webpack_require__(216);
const websocket = __webpack_require__(217);

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts) {
  let xhr;
  let xd = false;
  let xs = false;
  const jsonp = false !== opts.jsonp;

  if (typeof location !== "undefined") {
    const isSSL = "https:" === location.protocol;
    let port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname !== location.hostname || port !== opts.port;
    xs = opts.secure !== isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ("open" in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error("JSONP disabled");
    return new JSONP(opts);
  }
}


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// browser shim for xmlhttprequest module

const hasCORS = __webpack_require__(211);
const globalThis = __webpack_require__(36);

module.exports = function(opts) {
  const xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  const xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  const enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) {}

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ("undefined" !== typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) {}

  if (!xdomain) {
    try {
      return new globalThis[["Active"].concat("Object").join("X")](
        "Microsoft.XMLHTTP"
      );
    } catch (e) {}
  }
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

const Transport = __webpack_require__(58);
const parseqs = __webpack_require__(59);
const parser = __webpack_require__(27);
const yeast = __webpack_require__(107);

const debug = __webpack_require__(9)("engine.io-client:polling");

class Polling extends Transport {
  /**
   * Transport name.
   */
  get name() {
    return "polling";
  }

  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @api private
   */
  doOpen() {
    this.poll();
  }

  /**
   * Pauses polling.
   *
   * @param {Function} callback upon buffers are flushed and transport is paused
   * @api private
   */
  pause(onPause) {
    this.readyState = "pausing";

    const pause = () => {
      debug("paused");
      this.readyState = "paused";
      onPause();
    };

    if (this.polling || !this.writable) {
      let total = 0;

      if (this.polling) {
        debug("we are currently polling - waiting to pause");
        total++;
        this.once("pollComplete", function() {
          debug("pre-pause polling complete");
          --total || pause();
        });
      }

      if (!this.writable) {
        debug("we are currently writing - waiting to pause");
        total++;
        this.once("drain", function() {
          debug("pre-pause writing complete");
          --total || pause();
        });
      }
    } else {
      pause();
    }
  }

  /**
   * Starts polling cycle.
   *
   * @api public
   */
  poll() {
    debug("polling");
    this.polling = true;
    this.doPoll();
    this.emit("poll");
  }

  /**
   * Overloads onData to detect payloads.
   *
   * @api private
   */
  onData(data) {
    debug("polling got data %s", data);
    const callback = packet => {
      // if its the first message we consider the transport open
      if ("opening" === this.readyState && packet.type === "open") {
        this.onOpen();
      }

      // if its a close packet, we close the ongoing requests
      if ("close" === packet.type) {
        this.onClose();
        return false;
      }

      // otherwise bypass onData and handle the message
      this.onPacket(packet);
    };

    // decode payload
    parser.decodePayload(data, this.socket.binaryType).forEach(callback);

    // if an event did not trigger closing
    if ("closed" !== this.readyState) {
      // if we got data we're not polling
      this.polling = false;
      this.emit("pollComplete");

      if ("open" === this.readyState) {
        this.poll();
      } else {
        debug('ignoring poll - transport state "%s"', this.readyState);
      }
    }
  }

  /**
   * For polling, send a close packet.
   *
   * @api private
   */
  doClose() {
    const close = () => {
      debug("writing close packet");
      this.write([{ type: "close" }]);
    };

    if ("open" === this.readyState) {
      debug("transport open - closing");
      close();
    } else {
      // in case we're trying to close while
      // handshaking is in progress (GH-164)
      debug("transport not open - deferring close");
      this.once("open", close);
    }
  }

  /**
   * Writes a packets payload.
   *
   * @param {Array} data packets
   * @param {Function} drain callback
   * @api private
   */
  write(packets) {
    this.writable = false;

    parser.encodePayload(packets, data => {
      this.doWrite(data, () => {
        this.writable = true;
        this.emit("drain");
      });
    });
  }

  /**
   * Generates uri for connection.
   *
   * @api private
   */
  uri() {
    let query = this.query || {};
    const schema = this.opts.secure ? "https" : "http";
    let port = "";

    // cache busting is forced
    if (false !== this.opts.timestampRequests) {
      query[this.opts.timestampParam] = yeast();
    }

    if (!this.supportsBinary && !query.sid) {
      query.b64 = 1;
    }

    query = parseqs.encode(query);

    // avoid port if default for schema
    if (
      this.opts.port &&
      (("https" === schema && Number(this.opts.port) !== 443) ||
        ("http" === schema && Number(this.opts.port) !== 80))
    ) {
      port = ":" + this.opts.port;
    }

    // prepend ? to query
    if (query.length) {
      query = "?" + query;
    }

    const ipv6 = this.opts.hostname.indexOf(":") !== -1;
    return (
      schema +
      "://" +
      (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
      port +
      this.opts.path +
      query
    );
  }
}

module.exports = Polling;


/***/ }),
/* 106 */
/***/ (function(module, exports) {

const PACKET_TYPES = Object.create(null); // no Map = no polyfill
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";

const PACKET_TYPES_REVERSE = Object.create(null);
Object.keys(PACKET_TYPES).forEach(key => {
  PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});

const ERROR_PACKET = { type: "error", data: "parser error" };

module.exports = {
  PACKET_TYPES,
  PACKET_TYPES_REVERSE,
  ERROR_PACKET
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;


/***/ }),
/* 108 */
/***/ (function(module, exports) {

module.exports.pick = (obj, ...attr) => {
  return attr.reduce((acc, k) => {
    if (obj.hasOwnProperty(k)) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const socket_io_parser_1 = __webpack_require__(60);
const on_1 = __webpack_require__(111);
const typed_events_1 = __webpack_require__(112);
const debug = __webpack_require__(9)("socket.io-client:socket");
/**
 * Internal events.
 * These events can't be emitted by the user.
 */
const RESERVED_EVENTS = Object.freeze({
    connect: 1,
    connect_error: 1,
    disconnect: 1,
    disconnecting: 1,
    // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
    newListener: 1,
    removeListener: 1,
});
class Socket extends typed_events_1.StrictEventEmitter {
    /**
     * `Socket` constructor.
     *
     * @public
     */
    constructor(io, nsp, opts) {
        super();
        this.receiveBuffer = [];
        this.sendBuffer = [];
        this.ids = 0;
        this.acks = {};
        this.flags = {};
        this.io = io;
        this.nsp = nsp;
        this.ids = 0;
        this.acks = {};
        this.receiveBuffer = [];
        this.sendBuffer = [];
        this.connected = false;
        this.disconnected = true;
        this.flags = {};
        if (opts && opts.auth) {
            this.auth = opts.auth;
        }
        if (this.io._autoConnect)
            this.open();
    }
    /**
     * Subscribe to open, close and packet events
     *
     * @private
     */
    subEvents() {
        if (this.subs)
            return;
        const io = this.io;
        this.subs = [
            on_1.on(io, "open", this.onopen.bind(this)),
            on_1.on(io, "packet", this.onpacket.bind(this)),
            on_1.on(io, "error", this.onerror.bind(this)),
            on_1.on(io, "close", this.onclose.bind(this)),
        ];
    }
    /**
     * Whether the Socket will try to reconnect when its Manager connects or reconnects
     */
    get active() {
        return !!this.subs;
    }
    /**
     * "Opens" the socket.
     *
     * @public
     */
    connect() {
        if (this.connected)
            return this;
        this.subEvents();
        if (!this.io["_reconnecting"])
            this.io.open(); // ensure open
        if ("open" === this.io._readyState)
            this.onopen();
        return this;
    }
    /**
     * Alias for connect()
     */
    open() {
        return this.connect();
    }
    /**
     * Sends a `message` event.
     *
     * @return self
     * @public
     */
    send(...args) {
        args.unshift("message");
        this.emit.apply(this, args);
        return this;
    }
    /**
     * Override `emit`.
     * If the event is in `events`, it's emitted normally.
     *
     * @return self
     * @public
     */
    emit(ev, ...args) {
        if (RESERVED_EVENTS.hasOwnProperty(ev)) {
            throw new Error('"' + ev + '" is a reserved event name');
        }
        args.unshift(ev);
        const packet = {
            type: socket_io_parser_1.PacketType.EVENT,
            data: args,
        };
        packet.options = {};
        packet.options.compress = this.flags.compress !== false;
        // event ack callback
        if ("function" === typeof args[args.length - 1]) {
            debug("emitting packet with ack id %d", this.ids);
            this.acks[this.ids] = args.pop();
            packet.id = this.ids++;
        }
        const isTransportWritable = this.io.engine &&
            this.io.engine.transport &&
            this.io.engine.transport.writable;
        const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
        if (discardPacket) {
            debug("discard packet as the transport is not currently writable");
        }
        else if (this.connected) {
            this.packet(packet);
        }
        else {
            this.sendBuffer.push(packet);
        }
        this.flags = {};
        return this;
    }
    /**
     * Sends a packet.
     *
     * @param packet
     * @private
     */
    packet(packet) {
        packet.nsp = this.nsp;
        this.io._packet(packet);
    }
    /**
     * Called upon engine `open`.
     *
     * @private
     */
    onopen() {
        debug("transport is open - connecting");
        if (typeof this.auth == "function") {
            this.auth((data) => {
                this.packet({ type: socket_io_parser_1.PacketType.CONNECT, data });
            });
        }
        else {
            this.packet({ type: socket_io_parser_1.PacketType.CONNECT, data: this.auth });
        }
    }
    /**
     * Called upon engine or manager `error`.
     *
     * @param err
     * @private
     */
    onerror(err) {
        if (!this.connected) {
            this.emitReserved("connect_error", err);
        }
    }
    /**
     * Called upon engine `close`.
     *
     * @param reason
     * @private
     */
    onclose(reason) {
        debug("close (%s)", reason);
        this.connected = false;
        this.disconnected = true;
        delete this.id;
        this.emitReserved("disconnect", reason);
    }
    /**
     * Called with socket packet.
     *
     * @param packet
     * @private
     */
    onpacket(packet) {
        const sameNamespace = packet.nsp === this.nsp;
        if (!sameNamespace)
            return;
        switch (packet.type) {
            case socket_io_parser_1.PacketType.CONNECT:
                if (packet.data && packet.data.sid) {
                    const id = packet.data.sid;
                    this.onconnect(id);
                }
                else {
                    this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                }
                break;
            case socket_io_parser_1.PacketType.EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.BINARY_EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.BINARY_ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.DISCONNECT:
                this.ondisconnect();
                break;
            case socket_io_parser_1.PacketType.CONNECT_ERROR:
                const err = new Error(packet.data.message);
                // @ts-ignore
                err.data = packet.data.data;
                this.emitReserved("connect_error", err);
                break;
        }
    }
    /**
     * Called upon a server event.
     *
     * @param packet
     * @private
     */
    onevent(packet) {
        const args = packet.data || [];
        debug("emitting event %j", args);
        if (null != packet.id) {
            debug("attaching ack callback to event");
            args.push(this.ack(packet.id));
        }
        if (this.connected) {
            this.emitEvent(args);
        }
        else {
            this.receiveBuffer.push(Object.freeze(args));
        }
    }
    emitEvent(args) {
        if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, args);
            }
        }
        super.emit.apply(this, args);
    }
    /**
     * Produces an ack callback to emit with an event.
     *
     * @private
     */
    ack(id) {
        const self = this;
        let sent = false;
        return function (...args) {
            // prevent double callbacks
            if (sent)
                return;
            sent = true;
            debug("sending ack %j", args);
            self.packet({
                type: socket_io_parser_1.PacketType.ACK,
                id: id,
                data: args,
            });
        };
    }
    /**
     * Called upon a server acknowlegement.
     *
     * @param packet
     * @private
     */
    onack(packet) {
        const ack = this.acks[packet.id];
        if ("function" === typeof ack) {
            debug("calling ack %s with %j", packet.id, packet.data);
            ack.apply(this, packet.data);
            delete this.acks[packet.id];
        }
        else {
            debug("bad ack %s", packet.id);
        }
    }
    /**
     * Called upon server connect.
     *
     * @private
     */
    onconnect(id) {
        debug("socket connected with id %s", id);
        this.id = id;
        this.connected = true;
        this.disconnected = false;
        this.emitBuffered();
        this.emitReserved("connect");
    }
    /**
     * Emit buffered events (received and emitted).
     *
     * @private
     */
    emitBuffered() {
        this.receiveBuffer.forEach((args) => this.emitEvent(args));
        this.receiveBuffer = [];
        this.sendBuffer.forEach((packet) => this.packet(packet));
        this.sendBuffer = [];
    }
    /**
     * Called upon server disconnect.
     *
     * @private
     */
    ondisconnect() {
        debug("server disconnect (%s)", this.nsp);
        this.destroy();
        this.onclose("io server disconnect");
    }
    /**
     * Called upon forced client/server side disconnections,
     * this method ensures the manager stops tracking us and
     * that reconnections don't get triggered for this.
     *
     * @private
     */
    destroy() {
        if (this.subs) {
            // clean subscriptions to avoid reconnections
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs = undefined;
        }
        this.io["_destroy"](this);
    }
    /**
     * Disconnects the socket manually.
     *
     * @return self
     * @public
     */
    disconnect() {
        if (this.connected) {
            debug("performing disconnect (%s)", this.nsp);
            this.packet({ type: socket_io_parser_1.PacketType.DISCONNECT });
        }
        // remove socket from pool
        this.destroy();
        if (this.connected) {
            // fire events
            this.onclose("io client disconnect");
        }
        return this;
    }
    /**
     * Alias for disconnect()
     *
     * @return self
     * @public
     */
    close() {
        return this.disconnect();
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     * @public
     */
    compress(compress) {
        this.flags.compress = compress;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
     * ready to send messages.
     *
     * @returns self
     * @public
     */
    get volatile() {
        this.flags.volatile = true;
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * @param listener
     * @public
     */
    onAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @param listener
     * @public
     */
    prependAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @param listener
     * @public
     */
    offAny(listener) {
        if (!this._anyListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     *
     * @public
     */
    listenersAny() {
        return this._anyListeners || [];
    }
}
exports.Socket = Socket;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBinary = exports.isBinary = void 0;
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const isView = (obj) => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj.buffer instanceof ArrayBuffer;
};
const toString = Object.prototype.toString;
const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        toString.call(Blob) === "[object BlobConstructor]");
const withNativeFile = typeof File === "function" ||
    (typeof File !== "undefined" &&
        toString.call(File) === "[object FileConstructor]");
/**
 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
 *
 * @private
 */
function isBinary(obj) {
    return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
        (withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File));
}
exports.isBinary = isBinary;
function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            if (hasBinary(obj[i])) {
                return true;
            }
        }
        return false;
    }
    if (isBinary(obj)) {
        return true;
    }
    if (obj.toJSON &&
        typeof obj.toJSON === "function" &&
        arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
            return true;
        }
    }
    return false;
}
exports.hasBinary = hasBinary;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.on = void 0;
function on(obj, ev, fn) {
    obj.on(ev, fn);
    return function subDestroy() {
        obj.off(ev, fn);
    };
}
exports.on = on;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.StrictEventEmitter = void 0;
const Emitter = __webpack_require__(28);
/**
 * Strictly typed version of an `EventEmitter`. A `TypedEventEmitter` takes type
 * parameters for mappings of event names to event data types, and strictly
 * types method calls to the `EventEmitter` according to these event maps.
 *
 * @typeParam ListenEvents - `EventsMap` of user-defined events that can be
 * listened to with `on` or `once`
 * @typeParam EmitEvents - `EventsMap` of user-defined events that can be
 * emitted with `emit`
 * @typeParam ReservedEvents - `EventsMap` of reserved events, that can be
 * emitted by socket.io with `emitReserved`, and can be listened to with
 * `listen`.
 */
class StrictEventEmitter extends Emitter {
    /**
     * Adds the `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    on(ev, listener) {
        super.on(ev, listener);
        return this;
    }
    /**
     * Adds a one-time `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    once(ev, listener) {
        super.once(ev, listener);
        return this;
    }
    /**
     * Emits an event.
     *
     * @param ev Name of the event
     * @param args Values to send to listeners of this event
     */
    emit(ev, ...args) {
        super.emit(ev, ...args);
        return this;
    }
    /**
     * Emits a reserved event.
     *
     * This method is `protected`, so that only a class extending
     * `StrictEventEmitter` can emit its own reserved events.
     *
     * @param ev Reserved event name
     * @param args Arguments to emit along with the event
     */
    emitReserved(ev, ...args) {
        super.emit(ev, ...args);
        return this;
    }
    /**
     * Returns the listeners listening to an event.
     *
     * @param event Event name
     * @returns Array of listeners subscribed to `event`
     */
    listeners(event) {
        return super.listeners(event);
    }
}
exports.StrictEventEmitter = StrictEventEmitter;


/***/ }),
/* 113 */
/***/ (function(module, exports) {

throw new Error("Module build failed: TypeError: validateOptions is not a function\n    at Object.module.exports (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/url-loader/index.js:15:3)");

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__hooks_useScrollToEnd__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__hooks_useSticky__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__hooks_internal_useStyleToClassName__ = __webpack_require__(80);







var ROOT_STYLE = {
  backgroundColor: 'rgba(0, 0, 0, .2)',
  borderRadius: 10,
  borderWidth: 0,
  bottom: 5,
  cursor: 'pointer',
  height: 20,
  outline: 0,
  position: 'absolute',
  right: 20,
  width: 20,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, .4)'
  },
  '&:active': {
    backgroundColor: 'rgba(0, 0, 0, .6)'
  }
};

var AutoHideFollowButton = function AutoHideFollowButton(_ref) {
  var children = _ref.children,
      className = _ref.className;

  var _useSticky = Object(__WEBPACK_IMPORTED_MODULE_5__hooks_useSticky__["a" /* default */])(),
      _useSticky2 = __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray___default()(_useSticky, 1),
      sticky = _useSticky2[0];

  var rootCSS = Object(__WEBPACK_IMPORTED_MODULE_6__hooks_internal_useStyleToClassName__["a" /* default */])()(ROOT_STYLE);
  var scrollToEnd = Object(__WEBPACK_IMPORTED_MODULE_4__hooks_useScrollToEnd__["a" /* default */])();
  return !sticky && /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement("button", {
    className: __WEBPACK_IMPORTED_MODULE_1_classnames___default()(rootCSS, (className || '') + ''),
    onClick: scrollToEnd,
    type: "button"
  }, children);
};

AutoHideFollowButton.defaultProps = {
  children: undefined,
  className: ''
};
AutoHideFollowButton.propTypes = {
  children: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.any,
  className: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.string
};
/* harmony default export */ __webpack_exports__["a"] = (AutoHideFollowButton);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9BdXRvSGlkZUZvbGxvd0J1dHRvbi5qcyJdLCJuYW1lcyI6WyJjbGFzc05hbWVzIiwiUHJvcFR5cGVzIiwiUmVhY3QiLCJ1c2VTY3JvbGxUb0VuZCIsInVzZVN0aWNreSIsInVzZVN0eWxlVG9DbGFzc05hbWUiLCJST09UX1NUWUxFIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyV2lkdGgiLCJib3R0b20iLCJjdXJzb3IiLCJoZWlnaHQiLCJvdXRsaW5lIiwicG9zaXRpb24iLCJyaWdodCIsIndpZHRoIiwiQXV0b0hpZGVGb2xsb3dCdXR0b24iLCJjaGlsZHJlbiIsImNsYXNzTmFtZSIsInN0aWNreSIsInJvb3RDU1MiLCJzY3JvbGxUb0VuZCIsImRlZmF1bHRQcm9wcyIsInVuZGVmaW5lZCIsInByb3BUeXBlcyIsImFueSIsInN0cmluZyJdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU9BLFVBQVAsTUFBdUIsWUFBdkI7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBQ0EsT0FBT0MsS0FBUCxNQUFrQixPQUFsQjtBQUVBLE9BQU9DLGNBQVAsTUFBMkIseUJBQTNCO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixvQkFBdEI7QUFDQSxPQUFPQyxtQkFBUCxNQUFnQyx1Q0FBaEM7QUFFQSxJQUFNQyxVQUFVLEdBQUc7QUFDakJDLEVBQUFBLGVBQWUsRUFBRSxtQkFEQTtBQUVqQkMsRUFBQUEsWUFBWSxFQUFFLEVBRkc7QUFHakJDLEVBQUFBLFdBQVcsRUFBRSxDQUhJO0FBSWpCQyxFQUFBQSxNQUFNLEVBQUUsQ0FKUztBQUtqQkMsRUFBQUEsTUFBTSxFQUFFLFNBTFM7QUFNakJDLEVBQUFBLE1BQU0sRUFBRSxFQU5TO0FBT2pCQyxFQUFBQSxPQUFPLEVBQUUsQ0FQUTtBQVFqQkMsRUFBQUEsUUFBUSxFQUFFLFVBUk87QUFTakJDLEVBQUFBLEtBQUssRUFBRSxFQVRVO0FBVWpCQyxFQUFBQSxLQUFLLEVBQUUsRUFWVTtBQVlqQixhQUFXO0FBQ1RULElBQUFBLGVBQWUsRUFBRTtBQURSLEdBWk07QUFnQmpCLGNBQVk7QUFDVkEsSUFBQUEsZUFBZSxFQUFFO0FBRFA7QUFoQkssQ0FBbkI7O0FBcUJBLElBQU1VLG9CQUFvQixHQUFHLFNBQXZCQSxvQkFBdUIsT0FBNkI7QUFBQSxNQUExQkMsUUFBMEIsUUFBMUJBLFFBQTBCO0FBQUEsTUFBaEJDLFNBQWdCLFFBQWhCQSxTQUFnQjs7QUFDeEQsbUJBQWlCZixTQUFTLEVBQTFCO0FBQUE7QUFBQSxNQUFPZ0IsTUFBUDs7QUFDQSxNQUFNQyxPQUFPLEdBQUdoQixtQkFBbUIsR0FBR0MsVUFBSCxDQUFuQztBQUNBLE1BQU1nQixXQUFXLEdBQUduQixjQUFjLEVBQWxDO0FBRUEsU0FDRSxDQUFDaUIsTUFBRCxpQkFDRTtBQUFRLElBQUEsU0FBUyxFQUFFcEIsVUFBVSxDQUFDcUIsT0FBRCxFQUFVLENBQUNGLFNBQVMsSUFBSSxFQUFkLElBQW9CLEVBQTlCLENBQTdCO0FBQWdFLElBQUEsT0FBTyxFQUFFRyxXQUF6RTtBQUFzRixJQUFBLElBQUksRUFBQztBQUEzRixLQUNHSixRQURILENBRko7QUFPRCxDQVpEOztBQWNBRCxvQkFBb0IsQ0FBQ00sWUFBckIsR0FBb0M7QUFDbENMLEVBQUFBLFFBQVEsRUFBRU0sU0FEd0I7QUFFbENMLEVBQUFBLFNBQVMsRUFBRTtBQUZ1QixDQUFwQztBQUtBRixvQkFBb0IsQ0FBQ1EsU0FBckIsR0FBaUM7QUFDL0JQLEVBQUFBLFFBQVEsRUFBRWpCLFNBQVMsQ0FBQ3lCLEdBRFc7QUFFL0JQLEVBQUFBLFNBQVMsRUFBRWxCLFNBQVMsQ0FBQzBCO0FBRlUsQ0FBakM7QUFLQSxlQUFlVixvQkFBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGFzc05hbWVzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB1c2VTY3JvbGxUb0VuZCBmcm9tICcuLi9ob29rcy91c2VTY3JvbGxUb0VuZCc7XG5pbXBvcnQgdXNlU3RpY2t5IGZyb20gJy4uL2hvb2tzL3VzZVN0aWNreSc7XG5pbXBvcnQgdXNlU3R5bGVUb0NsYXNzTmFtZSBmcm9tICcuLi9ob29rcy9pbnRlcm5hbC91c2VTdHlsZVRvQ2xhc3NOYW1lJztcblxuY29uc3QgUk9PVF9TVFlMRSA9IHtcbiAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAuMiknLFxuICBib3JkZXJSYWRpdXM6IDEwLFxuICBib3JkZXJXaWR0aDogMCxcbiAgYm90dG9tOiA1LFxuICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgaGVpZ2h0OiAyMCxcbiAgb3V0bGluZTogMCxcbiAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gIHJpZ2h0OiAyMCxcbiAgd2lkdGg6IDIwLFxuXG4gICcmOmhvdmVyJzoge1xuICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwgMCwgMCwgLjQpJ1xuICB9LFxuXG4gICcmOmFjdGl2ZSc6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIC42KSdcbiAgfVxufTtcblxuY29uc3QgQXV0b0hpZGVGb2xsb3dCdXR0b24gPSAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH0pID0+IHtcbiAgY29uc3QgW3N0aWNreV0gPSB1c2VTdGlja3koKTtcbiAgY29uc3Qgcm9vdENTUyA9IHVzZVN0eWxlVG9DbGFzc05hbWUoKShST09UX1NUWUxFKTtcbiAgY29uc3Qgc2Nyb2xsVG9FbmQgPSB1c2VTY3JvbGxUb0VuZCgpO1xuXG4gIHJldHVybiAoXG4gICAgIXN0aWNreSAmJiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhyb290Q1NTLCAoY2xhc3NOYW1lIHx8ICcnKSArICcnKX0gb25DbGljaz17c2Nyb2xsVG9FbmR9IHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICApO1xufTtcblxuQXV0b0hpZGVGb2xsb3dCdXR0b24uZGVmYXVsdFByb3BzID0ge1xuICBjaGlsZHJlbjogdW5kZWZpbmVkLFxuICBjbGFzc05hbWU6ICcnXG59O1xuXG5BdXRvSGlkZUZvbGxvd0J1dHRvbi5wcm9wVHlwZXMgPSB7XG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuYW55LFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEF1dG9IaWRlRm9sbG93QnV0dG9uO1xuIl19

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(231);

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(232);
var path = __webpack_require__(3);

module.exports = path.Array.isArray;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);
var classof = __webpack_require__(61);

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(10);
var fails = __webpack_require__(6);
var createElement = __webpack_require__(120);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var isObject = __webpack_require__(13);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(236);

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var fails = __webpack_require__(6);
var isArray = __webpack_require__(30);
var isObject = __webpack_require__(13);
var toObject = __webpack_require__(16);
var toLength = __webpack_require__(22);
var createProperty = __webpack_require__(31);
var arraySpeciesCreate = __webpack_require__(64);
var arrayMethodHasSpeciesSupport = __webpack_require__(43);
var wellKnownSymbol = __webpack_require__(4);
var V8_VERSION = __webpack_require__(69);

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(42);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(68);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var global = __webpack_require__(5);
var getBuiltIn = __webpack_require__(42);
var IS_PURE = __webpack_require__(41);
var DESCRIPTORS = __webpack_require__(10);
var NATIVE_SYMBOL = __webpack_require__(68);
var USE_SYMBOL_AS_UID = __webpack_require__(124);
var fails = __webpack_require__(6);
var has = __webpack_require__(11);
var isArray = __webpack_require__(30);
var isObject = __webpack_require__(13);
var anObject = __webpack_require__(17);
var toObject = __webpack_require__(16);
var toIndexedObject = __webpack_require__(12);
var toPrimitive = __webpack_require__(39);
var createPropertyDescriptor = __webpack_require__(29);
var nativeObjectCreate = __webpack_require__(126);
var objectKeys = __webpack_require__(70);
var getOwnPropertyNamesModule = __webpack_require__(73);
var getOwnPropertyNamesExternal = __webpack_require__(241);
var getOwnPropertySymbolsModule = __webpack_require__(130);
var getOwnPropertyDescriptorModule = __webpack_require__(38);
var definePropertyModule = __webpack_require__(19);
var propertyIsEnumerableModule = __webpack_require__(117);
var createNonEnumerableProperty = __webpack_require__(14);
var redefine = __webpack_require__(131);
var shared = __webpack_require__(65);
var sharedKey = __webpack_require__(45);
var hiddenKeys = __webpack_require__(44);
var uid = __webpack_require__(67);
var wellKnownSymbol = __webpack_require__(4);
var wrappedWellKnownSymbolModule = __webpack_require__(132);
var defineWellKnownSymbol = __webpack_require__(1);
var setToStringTag = __webpack_require__(46);
var InternalStateModule = __webpack_require__(75);
var $forEach = __webpack_require__(76).forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.es/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.es/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.es/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);
var defineProperties = __webpack_require__(127);
var enumBugKeys = __webpack_require__(72);
var hiddenKeys = __webpack_require__(44);
var html = __webpack_require__(240);
var documentCreateElement = __webpack_require__(120);
var sharedKey = __webpack_require__(45);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject -- old IE */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(10);
var definePropertyModule = __webpack_require__(19);
var anObject = __webpack_require__(17);
var objectKeys = __webpack_require__(70);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(11);
var toIndexedObject = __webpack_require__(12);
var indexOf = __webpack_require__(129).indexOf;
var hiddenKeys = __webpack_require__(44);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(12);
var toLength = __webpack_require__(22);
var toAbsoluteIndex = __webpack_require__(71);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),
/* 130 */
/***/ (function(module, exports) {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var createNonEnumerableProperty = __webpack_require__(14);

module.exports = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
};


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(4);

exports.f = wellKnownSymbol;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(269);

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(270);
var DOMIterables = __webpack_require__(276);
var global = __webpack_require__(5);
var classof = __webpack_require__(47);
var createNonEnumerableProperty = __webpack_require__(14);
var Iterators = __webpack_require__(23);
var wellKnownSymbol = __webpack_require__(4);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG) {
    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
  }
  Iterators[COLLECTION_NAME] = Iterators.Array;
}


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var createIteratorConstructor = __webpack_require__(272);
var getPrototypeOf = __webpack_require__(137);
var setPrototypeOf = __webpack_require__(274);
var setToStringTag = __webpack_require__(46);
var createNonEnumerableProperty = __webpack_require__(14);
var redefine = __webpack_require__(131);
var wellKnownSymbol = __webpack_require__(4);
var IS_PURE = __webpack_require__(41);
var Iterators = __webpack_require__(23);
var IteratorsCore = __webpack_require__(136);

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(6);
var getPrototypeOf = __webpack_require__(137);
var createNonEnumerableProperty = __webpack_require__(14);
var has = __webpack_require__(11);
var wellKnownSymbol = __webpack_require__(4);
var IS_PURE = __webpack_require__(41);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if ((!IS_PURE || NEW_ITERATOR_PROTOTYPE) && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(11);
var toObject = __webpack_require__(16);
var sharedKey = __webpack_require__(45);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(273);

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(277).charAt;
var InternalStateModule = __webpack_require__(75);
var defineIterator = __webpack_require__(135);

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(47);
var Iterators = __webpack_require__(23);
var wellKnownSymbol = __webpack_require__(4);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var _sliceInstanceProperty = __webpack_require__(278);

var _Array$from = __webpack_require__(141);

var arrayLikeToArray = __webpack_require__(142);

function _unsupportedIterableToArray(o, minLen) {
  var _context;

  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);

  var n = _sliceInstanceProperty(_context = Object.prototype.toString.call(o)).call(_context, 8, -1);

  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return _Array$from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(283);

/***/ }),
/* 142 */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 143 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = useScrollToEnd;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__ = __webpack_require__(32);

function useScrollToEnd() {
  var _useFunctionContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__["a" /* default */])(),
      scrollToEnd = _useFunctionContext.scrollToEnd;

  return scrollToEnd;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VTY3JvbGxUb0VuZC5qcyJdLCJuYW1lcyI6WyJ1c2VGdW5jdGlvbkNvbnRleHQiLCJ1c2VTY3JvbGxUb0VuZCIsInNjcm9sbFRvRW5kIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxrQkFBUCxNQUErQiwrQkFBL0I7QUFFQSxlQUFlLFNBQVNDLGNBQVQsR0FBMEI7QUFDdkMsNEJBQXdCRCxrQkFBa0IsRUFBMUM7QUFBQSxNQUFRRSxXQUFSLHVCQUFRQSxXQUFSOztBQUVBLFNBQU9BLFdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1c2VGdW5jdGlvbkNvbnRleHQgZnJvbSAnLi9pbnRlcm5hbC91c2VGdW5jdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VTY3JvbGxUb0VuZCgpIHtcbiAgY29uc3QgeyBzY3JvbGxUb0VuZCB9ID0gdXNlRnVuY3Rpb25Db250ZXh0KCk7XG5cbiAgcmV0dXJuIHNjcm9sbFRvRW5kO1xufVxuIl19

/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = useSticky;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__ = __webpack_require__(18);
/* eslint no-magic-numbers: ["error", { "ignore": [2] }] */

function useSticky() {
  var _useStateContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__["a" /* default */])(2),
      sticky = _useStateContext.sticky;

  return [sticky];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VTdGlja3kuanMiXSwibmFtZXMiOlsidXNlU3RhdGVDb250ZXh0IiwidXNlU3RpY2t5Iiwic3RpY2t5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUVBLE9BQU9BLGVBQVAsTUFBNEIsNEJBQTVCO0FBRUEsZUFBZSxTQUFTQyxTQUFULEdBQXFCO0FBQ2xDLHlCQUFtQkQsZUFBZSxDQUFDLENBQUQsQ0FBbEM7QUFBQSxNQUFRRSxNQUFSLG9CQUFRQSxNQUFSOztBQUVBLFNBQU8sQ0FBQ0EsTUFBRCxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgbm8tbWFnaWMtbnVtYmVyczogW1wiZXJyb3JcIiwgeyBcImlnbm9yZVwiOiBbMl0gfV0gKi9cblxuaW1wb3J0IHVzZVN0YXRlQ29udGV4dCBmcm9tICcuL2ludGVybmFsL3VzZVN0YXRlQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZVN0aWNreSgpIHtcbiAgY29uc3QgeyBzdGlja3kgfSA9IHVzZVN0YXRlQ29udGV4dCgyKTtcblxuICByZXR1cm4gW3N0aWNreV07XG59XG4iXX0=

/***/ }),
/* 145 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);

var context = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createContext({
  atBottom: true,
  atEnd: true,
  atStart: false,
  atTop: true,
  mode: 'bottom'
});
context.displayName = 'ScrollToBottomState1Context';
/* harmony default export */ __webpack_exports__["a"] = (context);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9TdGF0ZTFDb250ZXh0LmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiY29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJhdEJvdHRvbSIsImF0RW5kIiwiYXRTdGFydCIsImF0VG9wIiwibW9kZSIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCO0FBRUEsSUFBTUMsT0FBTyxnQkFBR0QsS0FBSyxDQUFDRSxhQUFOLENBQW9CO0FBQ2xDQyxFQUFBQSxRQUFRLEVBQUUsSUFEd0I7QUFFbENDLEVBQUFBLEtBQUssRUFBRSxJQUYyQjtBQUdsQ0MsRUFBQUEsT0FBTyxFQUFFLEtBSHlCO0FBSWxDQyxFQUFBQSxLQUFLLEVBQUUsSUFKMkI7QUFLbENDLEVBQUFBLElBQUksRUFBRTtBQUw0QixDQUFwQixDQUFoQjtBQVFBTixPQUFPLENBQUNPLFdBQVIsR0FBc0IsNkJBQXRCO0FBRUEsZUFBZVAsT0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IGNvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KHtcbiAgYXRCb3R0b206IHRydWUsXG4gIGF0RW5kOiB0cnVlLFxuICBhdFN0YXJ0OiBmYWxzZSxcbiAgYXRUb3A6IHRydWUsXG4gIG1vZGU6ICdib3R0b20nXG59KTtcblxuY29udGV4dC5kaXNwbGF5TmFtZSA9ICdTY3JvbGxUb0JvdHRvbVN0YXRlMUNvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjb250ZXh0O1xuIl19

/***/ }),
/* 146 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);

var context = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_react___default.a.createContext({
  animating: false,
  animatingToEnd: false,
  sticky: true
});
context.displayName = 'ScrollToBottomState2Context';
/* harmony default export */ __webpack_exports__["a"] = (context);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9TdGF0ZTJDb250ZXh0LmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiY29udGV4dCIsImNyZWF0ZUNvbnRleHQiLCJhbmltYXRpbmciLCJhbmltYXRpbmdUb0VuZCIsInN0aWNreSIsImRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxLQUFQLE1BQWtCLE9BQWxCO0FBRUEsSUFBTUMsT0FBTyxnQkFBR0QsS0FBSyxDQUFDRSxhQUFOLENBQW9CO0FBQ2xDQyxFQUFBQSxTQUFTLEVBQUUsS0FEdUI7QUFFbENDLEVBQUFBLGNBQWMsRUFBRSxLQUZrQjtBQUdsQ0MsRUFBQUEsTUFBTSxFQUFFO0FBSDBCLENBQXBCLENBQWhCO0FBTUFKLE9BQU8sQ0FBQ0ssV0FBUixHQUFzQiw2QkFBdEI7QUFFQSxlQUFlTCxPQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgY29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQoe1xuICBhbmltYXRpbmc6IGZhbHNlLFxuICBhbmltYXRpbmdUb0VuZDogZmFsc2UsXG4gIHN0aWNreTogdHJ1ZVxufSk7XG5cbmNvbnRleHQuZGlzcGxheU5hbWUgPSAnU2Nyb2xsVG9Cb3R0b21TdGF0ZTJDb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgY29udGV4dDtcbiJdfQ==

/***/ }),
/* 147 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = useInternalContext;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ScrollToBottom_InternalContext__ = __webpack_require__(81);


function useInternalContext() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_react__["useContext"])(__WEBPACK_IMPORTED_MODULE_1__ScrollToBottom_InternalContext__["a" /* default */]);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ob29rcy9pbnRlcm5hbC91c2VJbnRlcm5hbENvbnRleHQuanMiXSwibmFtZXMiOlsidXNlQ29udGV4dCIsIkludGVybmFsQ29udGV4dCIsInVzZUludGVybmFsQ29udGV4dCJdLCJtYXBwaW5ncyI6IkFBQUEsU0FBU0EsVUFBVCxRQUEyQixPQUEzQjtBQUVBLE9BQU9DLGVBQVAsTUFBNEIsc0NBQTVCO0FBRUEsZUFBZSxTQUFTQyxrQkFBVCxHQUE4QjtBQUMzQyxTQUFPRixVQUFVLENBQUNDLGVBQUQsQ0FBakI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBJbnRlcm5hbENvbnRleHQgZnJvbSAnLi4vLi4vU2Nyb2xsVG9Cb3R0b20vSW50ZXJuYWxDb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlSW50ZXJuYWxDb250ZXh0KCkge1xuICByZXR1cm4gdXNlQ29udGV4dChJbnRlcm5hbENvbnRleHQpO1xufVxuIl19

/***/ }),
/* 148 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_defineProperty__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es_regexp_exec_js__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es_regexp_exec_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_modules_es_regexp_exec_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es_string_replace_js__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es_string_replace_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_modules_es_string_replace_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__babel_runtime_corejs3_core_js_stable_set_interval__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__babel_runtime_corejs3_core_js_stable_set_interval___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__babel_runtime_corejs3_core_js_stable_set_interval__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__babel_runtime_corejs3_core_js_stable_instance_index_of__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__babel_runtime_corejs3_core_js_stable_instance_index_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__babel_runtime_corejs3_core_js_stable_instance_index_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__babel_runtime_corejs3_core_js_stable_instance_splice__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__babel_runtime_corejs3_core_js_stable_instance_splice___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__babel_runtime_corejs3_core_js_stable_instance_splice__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__babel_runtime_corejs3_core_js_stable_date_now__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__babel_runtime_corejs3_core_js_stable_date_now___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__babel_runtime_corejs3_core_js_stable_date_now__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__babel_runtime_corejs3_core_js_stable_instance_for_each__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__babel_runtime_corejs3_core_js_stable_instance_for_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__babel_runtime_corejs3_core_js_stable_instance_for_each__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__babel_runtime_corejs3_core_js_stable_object_keys__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__babel_runtime_corejs3_core_js_stable_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__babel_runtime_corejs3_core_js_stable_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__babel_runtime_corejs3_core_js_stable_instance_filter__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__babel_runtime_corejs3_core_js_stable_instance_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__babel_runtime_corejs3_core_js_stable_instance_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__ = __webpack_require__(367);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__babel_runtime_corejs3_core_js_stable_object_define_properties__ = __webpack_require__(372);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__babel_runtime_corejs3_core_js_stable_object_define_properties___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__babel_runtime_corejs3_core_js_stable_object_define_properties__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__babel_runtime_corejs3_core_js_stable_object_define_property__ = __webpack_require__(376);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__babel_runtime_corejs3_core_js_stable_object_define_property___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__babel_runtime_corejs3_core_js_stable_object_define_property__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__emotion_css_create_instance__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_prop_types__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__createCSSKey__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__utils_debug__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__EventSpy__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__FunctionContext__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__InternalContext__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__SpineTo__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__State1Context__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__State2Context__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__StateContext__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__hooks_internal_useStateRef__ = __webpack_require__(407);




function ownKeys(object, enumerableOnly) { var keys = __WEBPACK_IMPORTED_MODULE_11__babel_runtime_corejs3_core_js_stable_object_keys___default()(object); if (__WEBPACK_IMPORTED_MODULE_12__babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols___default.a) { var symbols = __WEBPACK_IMPORTED_MODULE_12__babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols___default()(object); if (enumerableOnly) { symbols = __WEBPACK_IMPORTED_MODULE_13__babel_runtime_corejs3_core_js_stable_instance_filter___default()(symbols).call(symbols, function (sym) { return __WEBPACK_IMPORTED_MODULE_14__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor___default()(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context21; __WEBPACK_IMPORTED_MODULE_10__babel_runtime_corejs3_core_js_stable_instance_for_each___default()(_context21 = ownKeys(Object(source), true)).call(_context21, function (key) { __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_defineProperty___default()(target, key, source[key]); }); } else if (__WEBPACK_IMPORTED_MODULE_15__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors___default.a) { __WEBPACK_IMPORTED_MODULE_16__babel_runtime_corejs3_core_js_stable_object_define_properties___default()(target, __WEBPACK_IMPORTED_MODULE_15__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors___default()(source)); } else { var _context22; __WEBPACK_IMPORTED_MODULE_10__babel_runtime_corejs3_core_js_stable_instance_for_each___default()(_context22 = ownKeys(Object(source))).call(_context22, function (key) { __WEBPACK_IMPORTED_MODULE_17__babel_runtime_corejs3_core_js_stable_object_define_property___default()(target, key, __WEBPACK_IMPORTED_MODULE_14__babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor___default()(source, key)); }); } } return target; }































var DEFAULT_SCROLLER = function DEFAULT_SCROLLER() {
  return Infinity;
};

var MIN_CHECK_INTERVAL = 17; // 1 frame

var MODE_BOTTOM = 'bottom';
var MODE_TOP = 'top';
var NEAR_END_THRESHOLD = 1;
var SCROLL_DECISION_DURATION = 34; // 2 frames
// We pool the emotion object by nonce.
// This is to make sure we don't generate too many unneeded <style> tags.

var emotionPool = {};

function setImmediateInterval(fn, ms) {
  fn();
  return __WEBPACK_IMPORTED_MODULE_5__babel_runtime_corejs3_core_js_stable_set_interval___default()(fn, ms);
}

function computeViewState(_ref) {
  var mode = _ref.mode,
      _ref$target = _ref.target,
      offsetHeight = _ref$target.offsetHeight,
      scrollHeight = _ref$target.scrollHeight,
      scrollTop = _ref$target.scrollTop;
  var atBottom = scrollHeight - scrollTop - offsetHeight < NEAR_END_THRESHOLD;
  var atTop = scrollTop < NEAR_END_THRESHOLD;
  var atEnd = mode === MODE_TOP ? atTop : atBottom;
  var atStart = mode !== MODE_TOP ? atTop : atBottom;
  return {
    atBottom: atBottom,
    atEnd: atEnd,
    atStart: atStart,
    atTop: atTop
  };
}

function isEnd(animateTo, mode) {
  return animateTo === (mode === MODE_TOP ? 0 : '100%');
}

var Composer = function Composer(_ref2) {
  var checkInterval = _ref2.checkInterval,
      children = _ref2.children,
      debounce = _ref2.debounce,
      debugFromProp = _ref2.debug,
      initialScrollBehavior = _ref2.initialScrollBehavior,
      mode = _ref2.mode,
      nonce = _ref2.nonce,
      scroller = _ref2.scroller;
  var debug = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useMemo"])(function () {
    return Object(__WEBPACK_IMPORTED_MODULE_22__utils_debug__["a" /* default */])("<ScrollToBottom>", {
      force: debugFromProp
    });
  }, [debugFromProp]);
  mode = mode === MODE_TOP ? MODE_TOP : MODE_BOTTOM;
  var ignoreScrollEventBeforeRef = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useRef"])(0);
  var initialScrollBehaviorRef = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useRef"])(initialScrollBehavior);

  var _useStateRef = Object(__WEBPACK_IMPORTED_MODULE_31__hooks_internal_useStateRef__["a" /* default */])(mode === MODE_TOP ? 0 : '100%'),
      _useStateRef2 = __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray___default()(_useStateRef, 3),
      animateTo = _useStateRef2[0],
      setAnimateTo = _useStateRef2[1],
      animateToRef = _useStateRef2[2];

  var _useStateRef3 = Object(__WEBPACK_IMPORTED_MODULE_31__hooks_internal_useStateRef__["a" /* default */])(null),
      _useStateRef4 = __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray___default()(_useStateRef3, 3),
      target = _useStateRef4[0],
      setTarget = _useStateRef4[1],
      targetRef = _useStateRef4[2]; // Internal context


  var animateFromRef = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useRef"])(0);
  var offsetHeightRef = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useRef"])(0);
  var scrollHeightRef = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useRef"])(0); // State context

  var _useState = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useState"])(true),
      _useState2 = __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray___default()(_useState, 2),
      atBottom = _useState2[0],
      setAtBottom = _useState2[1];

  var _useState3 = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useState"])(true),
      _useState4 = __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray___default()(_useState3, 2),
      atEnd = _useState4[0],
      setAtEnd = _useState4[1];

  var _useState5 = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useState"])(true),
      _useState6 = __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray___default()(_useState5, 2),
      atTop = _useState6[0],
      setAtTop = _useState6[1];

  var _useState7 = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useState"])(false),
      _useState8 = __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray___default()(_useState7, 2),
      atStart = _useState8[0],
      setAtStart = _useState8[1];

  var _useStateRef5 = Object(__WEBPACK_IMPORTED_MODULE_31__hooks_internal_useStateRef__["a" /* default */])(true),
      _useStateRef6 = __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_helpers_slicedToArray___default()(_useStateRef5, 3),
      sticky = _useStateRef6[0],
      setSticky = _useStateRef6[1],
      stickyRef = _useStateRef6[2]; // High-rate state context


  var scrollPositionObserversRef = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useRef"])([]);
  var observeScrollPosition = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useCallback"])(function (fn) {
    var target = targetRef.current;
    scrollPositionObserversRef.current.push(fn);
    target && fn({
      scrollTop: target.scrollTop
    });
    return function () {
      var scrollPositionObservers = scrollPositionObserversRef.current;

      var index = __WEBPACK_IMPORTED_MODULE_6__babel_runtime_corejs3_core_js_stable_instance_index_of___default()(scrollPositionObservers).call(scrollPositionObservers, fn);

      ~index && __WEBPACK_IMPORTED_MODULE_7__babel_runtime_corejs3_core_js_stable_instance_splice___default()(scrollPositionObservers).call(scrollPositionObservers, index, 1);
    };
  }, [scrollPositionObserversRef, targetRef]);
  var handleSpineToEnd = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useCallback"])(function () {
    var animateTo = animateToRef.current;
    debug(function () {
      var _context;

      return __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context = ['%cSpineTo%c: %conEnd%c is fired.']).call(_context, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('magenta')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('orange')), [{
        animateTo: animateTo
      }]);
    });
    ignoreScrollEventBeforeRef.current = __WEBPACK_IMPORTED_MODULE_9__babel_runtime_corejs3_core_js_stable_date_now___default()(); // handleScrollEnd may end at a position which should lose stickiness.
    // In that case, we will need to set sticky to false to stop the interval check.
    // Test case:
    // 1. Add a scroller that always return 0
    // 2. Show a panel with mode === MODE_BOTTOM
    // 3. Programmatically scroll to 0 (set element.scrollTop = 0)
    // Expected: it should not repetitively call scrollTo(0)
    //           it should set stickiness to false

    isEnd(animateTo, mode) || setSticky(false);
    setAnimateTo(null);
  }, [animateToRef, debug, ignoreScrollEventBeforeRef, mode, setAnimateTo, setSticky]); // Function context

  var scrollTo = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useCallback"])(function (nextAnimateTo) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        behavior = _ref3.behavior;

    var target = targetRef.current;

    if (typeof nextAnimateTo !== 'number' && nextAnimateTo !== '100%') {
      return console.warn('react-scroll-to-bottom: Arguments passed to scrollTo() must be either number or "100%".');
    } // If it is trying to scroll to a position which is not "atEnd", it should set sticky to false after scroll ended.


    debug(function () {
      var _context2;

      return [__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context2 = ["%cscrollTo%c: Will scroll to %c".concat(typeof nextAnimateTo === 'number' ? nextAnimateTo + 'px' : nextAnimateTo.replace(/%/g, '%%'), "%c")]).call(_context2, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('lime', '')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple'))), {
        behavior: behavior,
        nextAnimateTo: nextAnimateTo,
        target: target
      }];
    });

    if (behavior === 'auto') {
      // Stop any existing animation
      handleSpineToEnd();

      if (target) {
        // Jump to the scroll position
        target.scrollTop = nextAnimateTo === '100%' ? target.scrollHeight - target.offsetHeight : nextAnimateTo;
      }
    } else {
      behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollTo". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
      setAnimateTo(nextAnimateTo);
    } // This is for handling a case. When calling scrollTo('100%', { behavior: 'auto' }) multiple times, it would lose stickiness.


    if (isEnd(nextAnimateTo, mode)) {
      debug(function () {
        var _context3;

        return [__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context3 = ["%cscrollTo%c: Scrolling to end, will set sticky to %ctrue%c."]).call(_context3, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('lime', '')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple'))), [{
          mode: mode,
          nextAnimateTo: nextAnimateTo
        }]];
      });
      setSticky(true);
    }
  }, [debug, handleSpineToEnd, mode, setAnimateTo, setSticky, targetRef]);
  var scrollToBottom = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useCallback"])(function () {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref4.behavior;

    debug(function () {
      var _context4;

      return __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context4 = ['%cscrollToBottom%c: Called']).call(_context4, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToBottom". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    scrollTo('100%', {
      behavior: behavior || 'smooth'
    });
  }, [debug, scrollTo]);
  var scrollToTop = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useCallback"])(function () {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref5.behavior;

    debug(function () {
      var _context5;

      return __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context5 = ['%cscrollToTop%c: Called']).call(_context5, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToTop". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    scrollTo(0, {
      behavior: behavior || 'smooth'
    });
  }, [debug, scrollTo]);
  var scrollToEnd = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useCallback"])(function () {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref6.behavior;

    debug(function () {
      var _context6;

      return __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context6 = ['%cscrollToEnd%c: Called']).call(_context6, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToEnd". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    var options = {
      behavior: behavior || 'smooth'
    };
    mode === MODE_TOP ? scrollToTop(options) : scrollToBottom(options);
  }, [debug, mode, scrollToBottom, scrollToTop]);
  var scrollToStart = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useCallback"])(function () {
    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref7.behavior;

    debug(function () {
      var _context7;

      return __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context7 = ['%cscrollToStart%c: Called']).call(_context7, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToStart". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    var options = {
      behavior: behavior || 'smooth'
    };
    mode === MODE_TOP ? scrollToBottom(options) : scrollToTop(options);
  }, [debug, mode, scrollToBottom, scrollToTop]);
  var scrollToSticky = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useCallback"])(function () {
    var target = targetRef.current;

    if (target) {
      if (initialScrollBehaviorRef.current === 'auto') {
        debug(function () {
          var _context8;

          return __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context8 = ["%ctarget changed%c: Initial scroll"]).call(_context8, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('blue')));
        });
        target.scrollTop = mode === MODE_TOP ? 0 : target.scrollHeight - target.offsetHeight;
        initialScrollBehaviorRef.current = false;
        return;
      } // This is very similar to scrollToEnd().
      // Instead of scrolling to end, it will call props.scroller() to determines how far it should scroll.
      // This function could be called while it is auto-scrolling.


      var animateFrom = animateFromRef.current;
      var offsetHeight = target.offsetHeight,
          scrollHeight = target.scrollHeight,
          scrollTop = target.scrollTop;
      var maxValue = mode === MODE_TOP ? 0 : Math.max(0, scrollHeight - offsetHeight - scrollTop);
      var minValue = Math.max(0, animateFrom - scrollTop);
      var rawNextValue = scroller({
        maxValue: maxValue,
        minValue: minValue,
        offsetHeight: offsetHeight,
        scrollHeight: scrollHeight,
        scrollTop: scrollTop
      });
      var nextValue = Math.max(0, Math.min(maxValue, rawNextValue));
      var nextAnimateTo;

      if (mode === MODE_TOP || nextValue !== maxValue) {
        nextAnimateTo = scrollTop + nextValue;
      } else {
        // When scrolling to bottom, we should scroll to "100%".
        // Otherwise, if we scroll to any number, it will lose stickiness when elements are adding too fast.
        // "100%" is a special argument intended to make sure stickiness is not lost while new elements are being added.
        nextAnimateTo = '100%';
      }

      debug(function () {
        var _context9, _context10, _context11;

        return [__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context9 = [__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context10 = __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context11 = "%cscrollToSticky%c: Will animate from %c".concat(animateFrom, "px%c to %c")).call(_context11, typeof nextAnimateTo === 'number' ? nextAnimateTo + 'px' : nextAnimateTo.replace(/%/g, '%%'), "%c (%c")).call(_context10, (nextAnimateTo === '100%' ? maxValue : nextAnimateTo) + animateFrom, "px%c)")]).call(_context9, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('orange')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple'))), {
          animateFrom: animateFrom,
          maxValue: maxValue,
          minValue: minValue,
          nextAnimateTo: nextAnimateTo,
          nextValue: nextValue,
          offsetHeight: offsetHeight,
          rawNextValue: rawNextValue,
          scrollHeight: scrollHeight,
          scrollTop: scrollTop
        }];
      });
      scrollTo(nextAnimateTo, {
        behavior: 'smooth'
      });
    }
  }, [animateFromRef, debug, mode, scroller, scrollTo, targetRef]);
  var handleScroll = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useCallback"])(function (_ref8) {
    var _context17;

    var timeStampLow = _ref8.timeStampLow;
    var animateTo = animateToRef.current;
    var target = targetRef.current;
    var animating = animateTo !== null; // Currently, there are no reliable way to check if the "scroll" event is trigger due to
    // user gesture, programmatic scrolling, or Chrome-synthesized "scroll" event to compensate size change.
    // Thus, we use our best-effort to guess if it is triggered by user gesture, and disable sticky if it is heading towards the start direction.

    if (timeStampLow <= ignoreScrollEventBeforeRef.current || !target) {
      // Since we debounce "scroll" event, this handler might be called after spineTo.onEnd (a.k.a. artificial scrolling).
      // We should ignore debounced event fired after scrollEnd, because without skipping them, the userInitiatedScroll calculated below will not be accurate.
      // Thus, on a fast machine, adding elements super fast will lose the "stickiness".
      return;
    }

    var _computeViewState = computeViewState({
      mode: mode,
      target: target
    }),
        atBottom = _computeViewState.atBottom,
        atEnd = _computeViewState.atEnd,
        atStart = _computeViewState.atStart,
        atTop = _computeViewState.atTop;

    setAtBottom(atBottom);
    setAtEnd(atEnd);
    setAtStart(atStart);
    setAtTop(atTop); // Chrome will emit "synthetic" scroll event if the container is resized or an element is added
    // We need to ignore these "synthetic" events
    // Repro: In playground, press 4-1-5-1-1 (small, add one, normal, add one, add one)
    //        Nomatter how fast or slow the sequence is being pressed, it should still stick to the bottom

    var nextOffsetHeight = target.offsetHeight,
        nextScrollHeight = target.scrollHeight;
    var offsetHeight = offsetHeightRef.current;
    var scrollHeight = scrollHeightRef.current;
    var offsetHeightChanged = nextOffsetHeight !== offsetHeight;
    var scrollHeightChanged = nextScrollHeight !== scrollHeight;

    if (offsetHeightChanged) {
      offsetHeightRef.current = nextOffsetHeight;
    }

    if (scrollHeightChanged) {
      scrollHeightRef.current = nextScrollHeight;
    } // Sticky means:
    // - If it is scrolled programatically, we are still in sticky mode
    // - If it is scrolled by the user, then sticky means if we are at the end
    // Only update stickiness if the scroll event is not due to synthetic scroll done by Chrome


    if (!offsetHeightChanged && !scrollHeightChanged) {
      // We are sticky if we are animating to the end, or we are already at the end.
      // We can be "animating but not sticky" by calling "scrollTo(100)" where the container scrollHeight is 200px.
      var nextSticky = animating && isEnd(animateTo, mode) || atEnd;

      if (stickyRef.current !== nextSticky) {
        debug(function () {
          var _context12, _context13, _context14, _context15;

          return [__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context12 = ["%conScroll%c: %csetSticky%c(%c".concat(nextSticky, "%c)")]).call(_context12, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('red')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('red')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple'))), __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context13 = [__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context14 = __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context15 = "(animating = %c".concat(animating, "%c && isEnd = %c")).call(_context15, isEnd(animateTo, mode), "%c) || atEnd = %c")).call(_context14, atEnd, "%c")]).call(_context13, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple')), [{
            animating: animating,
            animateTo: animateTo,
            atEnd: atEnd,
            mode: mode,
            offsetHeight: target.offsetHeight,
            scrollHeight: target.scrollHeight,
            sticky: stickyRef.current,
            nextSticky: nextSticky
          }])];
        });
        setSticky(nextSticky);
      }
    } else if (stickyRef.current) {
      debug(function () {
        var _context16;

        return [__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context16 = ["%conScroll%c: Size changed while sticky, calling %cscrollToSticky()%c"]).call(_context16, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('red')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('orange')), [{
          offsetHeightChanged: offsetHeightChanged,
          scrollHeightChanged: scrollHeightChanged
        }]), {
          nextOffsetHeight: nextOffsetHeight,
          prevOffsetHeight: offsetHeight,
          nextScrollHeight: nextScrollHeight,
          prevScrollHeight: scrollHeight
        }];
      });
      scrollToSticky();
    }

    var actualScrollTop = target.scrollTop;

    __WEBPACK_IMPORTED_MODULE_10__babel_runtime_corejs3_core_js_stable_instance_for_each___default()(_context17 = scrollPositionObserversRef.current).call(_context17, function (observer) {
      return observer({
        scrollTop: actualScrollTop
      });
    });
  }, [animateToRef, debug, ignoreScrollEventBeforeRef, mode, offsetHeightRef, scrollHeightRef, scrollPositionObserversRef, scrollToSticky, setAtBottom, setAtEnd, setAtStart, setAtTop, setSticky, stickyRef, targetRef]);
  Object(__WEBPACK_IMPORTED_MODULE_20_react__["useEffect"])(function () {
    if (target) {
      var stickyButNotAtEndSince = false;
      var timeout = setImmediateInterval(function () {
        var target = targetRef.current;
        var animating = animateToRef.current !== null;

        if (stickyRef.current) {
          if (!computeViewState({
            mode: mode,
            target: target
          }).atEnd) {
            if (!stickyButNotAtEndSince) {
              stickyButNotAtEndSince = __WEBPACK_IMPORTED_MODULE_9__babel_runtime_corejs3_core_js_stable_date_now___default()();
            } else if (__WEBPACK_IMPORTED_MODULE_9__babel_runtime_corejs3_core_js_stable_date_now___default()() - stickyButNotAtEndSince > SCROLL_DECISION_DURATION) {
              // Quirks: In Firefox, after user scroll down, Firefox do two things:
              //         1. Set to a new "scrollTop"
              //         2. Fire "scroll" event
              //         For what we observed, #1 is fired about 20ms before #2. There is a chance that this stickyCheckTimeout is being scheduled between 1 and 2.
              //         That means, if we just look at #1 to decide if we should scroll, we will always scroll, in oppose to the user's intention.
              // Repro: Open Firefox, set checkInterval to a lower number, and try to scroll by dragging the scroll handler. It will jump back.
              // The "animating" check will make sure stickiness is not lost when elements are adding at a very fast pace.
              if (!animating) {
                animateFromRef.current = target.scrollTop;
                debug(function () {
                  var _context18;

                  return __WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context18 = ["%cInterval check%c: Should sticky but not at end, calling %cscrollToSticky()%c to scroll"]).call(_context18, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('navy')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('orange')));
                });
                scrollToSticky();
              }

              stickyButNotAtEndSince = false;
            }
          } else {
            stickyButNotAtEndSince = false;
          }
        } else if (target.scrollHeight <= target.offsetHeight && !stickyRef.current) {
          // When the container is emptied, we will set sticky back to true.
          debug(function () {
            var _context19;

            return [__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context19 = ["%cInterval check%c: Container is emptied, setting sticky back to %ctrue%c"]).call(_context19, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('navy')), __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('purple'))), [{
              offsetHeight: target.offsetHeight,
              scrollHeight: target.scrollHeight,
              sticky: stickyRef.current
            }]];
          });
          setSticky(true);
        }
      }, Math.max(MIN_CHECK_INTERVAL, checkInterval) || MIN_CHECK_INTERVAL);
      return function () {
        return clearInterval(timeout);
      };
    }
  }, [animateToRef, checkInterval, debug, mode, scrollToSticky, setSticky, stickyRef, target, targetRef]);
  var styleToClassName = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useMemo"])(function () {
    var emotion = emotionPool[nonce] || (emotionPool[nonce] = Object(__WEBPACK_IMPORTED_MODULE_18__emotion_css_create_instance__["a" /* default */])({
      key: 'react-scroll-to-bottom--css-' + Object(__WEBPACK_IMPORTED_MODULE_21__createCSSKey__["a" /* default */])(),
      nonce: nonce
    }));
    return function (style) {
      return emotion.css(style) + '';
    };
  }, [nonce]);
  var internalContext = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useMemo"])(function () {
    return {
      observeScrollPosition: observeScrollPosition,
      setTarget: setTarget,
      styleToClassName: styleToClassName
    };
  }, [observeScrollPosition, setTarget, styleToClassName]);
  var state1Context = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useMemo"])(function () {
    return {
      atBottom: atBottom,
      atEnd: atEnd,
      atStart: atStart,
      atTop: atTop,
      mode: mode
    };
  }, [atBottom, atEnd, atStart, atTop, mode]);
  var state2Context = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useMemo"])(function () {
    var animating = animateTo !== null;
    return {
      animating: animating,
      animatingToEnd: animating && isEnd(animateTo, mode),
      sticky: sticky
    };
  }, [animateTo, mode, sticky]);
  var combinedStateContext = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useMemo"])(function () {
    return _objectSpread(_objectSpread({}, state1Context), state2Context);
  }, [state1Context, state2Context]);
  var functionContext = Object(__WEBPACK_IMPORTED_MODULE_20_react__["useMemo"])(function () {
    return {
      scrollTo: scrollTo,
      scrollToBottom: scrollToBottom,
      scrollToEnd: scrollToEnd,
      scrollToStart: scrollToStart,
      scrollToTop: scrollToTop
    };
  }, [scrollTo, scrollToBottom, scrollToEnd, scrollToStart, scrollToTop]);
  Object(__WEBPACK_IMPORTED_MODULE_20_react__["useEffect"])(function () {
    // We need to update the "scrollHeight" value to latest when the user do a focus inside the box.
    //
    // This is because:
    // - In our code that mitigate Chrome synthetic scrolling, that code will look at whether "scrollHeight" value is latest or not.
    // - That code only run on "scroll" event.
    // - That means, on every "scroll" event, if the "scrollHeight" value is not latest, we will skip modifying the stickiness.
    // - That means, if the user "focus" to an element that cause the scroll view to scroll to the bottom, the user agent will fire "scroll" event.
    //   Since the "scrollHeight" is not latest value, this "scroll" event will be ignored and stickiness will not be modified.
    // - That means, if the user "focus" to a newly added element that is at the end of the scroll view, the "scroll to bottom" button will continue to show.
    //
    // Repro in Chrome:
    // 1. Fill up a scroll view
    // 2. Scroll up, the "scroll to bottom" button should show up
    // 3. Click "Add a button"
    // 4. Click on the scroll view (to pseudo-focus on it)
    // 5. Press TAB, the scroll view will be at the bottom
    //
    // Expect:
    // - The "scroll to bottom" button should be gone.
    if (target) {
      var handleFocus = function handleFocus() {
        scrollHeightRef.current = target.scrollHeight;
      };

      target.addEventListener('focus', handleFocus, {
        capture: true,
        passive: true
      });
      return function () {
        return target.removeEventListener('focus', handleFocus);
      };
    }
  }, [target]);
  debug(function () {
    var _context20;

    return [__WEBPACK_IMPORTED_MODULE_8__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context20 = ["%cRender%c: Render"]).call(_context20, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_30__utils_styleConsole__["a" /* default */])('cyan', ''))), {
      animateTo: animateTo,
      animating: animateTo !== null,
      sticky: sticky,
      target: target
    }];
  });
  return /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_20_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_25__InternalContext__["a" /* default */].Provider, {
    value: internalContext
  }, /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_20_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_24__FunctionContext__["a" /* default */].Provider, {
    value: functionContext
  }, /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_20_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_29__StateContext__["a" /* default */].Provider, {
    value: combinedStateContext
  }, /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_20_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_27__State1Context__["a" /* default */].Provider, {
    value: state1Context
  }, /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_20_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_28__State2Context__["a" /* default */].Provider, {
    value: state2Context
  }, children, target && /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_20_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_23__EventSpy__["a" /* default */], {
    debounce: debounce,
    name: "scroll",
    onEvent: handleScroll,
    target: target
  }), target && animateTo !== null && /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_20_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_26__SpineTo__["a" /* default */], {
    name: "scrollTop",
    onEnd: handleSpineToEnd,
    target: target,
    value: animateTo
  }))))));
};

Composer.defaultProps = {
  checkInterval: 100,
  children: undefined,
  debounce: 17,
  debug: undefined,
  initialScrollBehavior: 'smooth',
  mode: undefined,
  nonce: undefined,
  scroller: DEFAULT_SCROLLER
};
Composer.propTypes = {
  checkInterval: __WEBPACK_IMPORTED_MODULE_19_prop_types___default.a.number,
  children: __WEBPACK_IMPORTED_MODULE_19_prop_types___default.a.any,
  debounce: __WEBPACK_IMPORTED_MODULE_19_prop_types___default.a.number,
  debug: __WEBPACK_IMPORTED_MODULE_19_prop_types___default.a.bool,
  initialScrollBehavior: __WEBPACK_IMPORTED_MODULE_19_prop_types___default.a.oneOf(['auto', 'smooth']),
  mode: __WEBPACK_IMPORTED_MODULE_19_prop_types___default.a.oneOf(['bottom', 'top']),
  nonce: __WEBPACK_IMPORTED_MODULE_19_prop_types___default.a.string,
  scroller: __WEBPACK_IMPORTED_MODULE_19_prop_types___default.a.func
};
/* harmony default export */ __webpack_exports__["a"] = (Composer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9Db21wb3Nlci5qcyJdLCJuYW1lcyI6WyJjcmVhdGVFbW90aW9uIiwiUHJvcFR5cGVzIiwiUmVhY3QiLCJ1c2VDYWxsYmFjayIsInVzZUVmZmVjdCIsInVzZU1lbW8iLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsImNyZWF0ZUNTU0tleSIsImNyZWF0ZURlYnVnIiwiRXZlbnRTcHkiLCJGdW5jdGlvbkNvbnRleHQiLCJJbnRlcm5hbENvbnRleHQiLCJTcGluZVRvIiwiU3RhdGUxQ29udGV4dCIsIlN0YXRlMkNvbnRleHQiLCJTdGF0ZUNvbnRleHQiLCJzdHlsZUNvbnNvbGUiLCJ1c2VTdGF0ZVJlZiIsIkRFRkFVTFRfU0NST0xMRVIiLCJJbmZpbml0eSIsIk1JTl9DSEVDS19JTlRFUlZBTCIsIk1PREVfQk9UVE9NIiwiTU9ERV9UT1AiLCJORUFSX0VORF9USFJFU0hPTEQiLCJTQ1JPTExfREVDSVNJT05fRFVSQVRJT04iLCJlbW90aW9uUG9vbCIsInNldEltbWVkaWF0ZUludGVydmFsIiwiZm4iLCJtcyIsImNvbXB1dGVWaWV3U3RhdGUiLCJtb2RlIiwidGFyZ2V0Iiwib2Zmc2V0SGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0Iiwic2Nyb2xsVG9wIiwiYXRCb3R0b20iLCJhdFRvcCIsImF0RW5kIiwiYXRTdGFydCIsImlzRW5kIiwiYW5pbWF0ZVRvIiwiQ29tcG9zZXIiLCJjaGVja0ludGVydmFsIiwiY2hpbGRyZW4iLCJkZWJvdW5jZSIsImRlYnVnRnJvbVByb3AiLCJkZWJ1ZyIsImluaXRpYWxTY3JvbGxCZWhhdmlvciIsIm5vbmNlIiwic2Nyb2xsZXIiLCJmb3JjZSIsImlnbm9yZVNjcm9sbEV2ZW50QmVmb3JlUmVmIiwiaW5pdGlhbFNjcm9sbEJlaGF2aW9yUmVmIiwic2V0QW5pbWF0ZVRvIiwiYW5pbWF0ZVRvUmVmIiwic2V0VGFyZ2V0IiwidGFyZ2V0UmVmIiwiYW5pbWF0ZUZyb21SZWYiLCJvZmZzZXRIZWlnaHRSZWYiLCJzY3JvbGxIZWlnaHRSZWYiLCJzZXRBdEJvdHRvbSIsInNldEF0RW5kIiwic2V0QXRUb3AiLCJzZXRBdFN0YXJ0Iiwic3RpY2t5Iiwic2V0U3RpY2t5Iiwic3RpY2t5UmVmIiwic2Nyb2xsUG9zaXRpb25PYnNlcnZlcnNSZWYiLCJvYnNlcnZlU2Nyb2xsUG9zaXRpb24iLCJjdXJyZW50IiwicHVzaCIsInNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzIiwiaW5kZXgiLCJoYW5kbGVTcGluZVRvRW5kIiwic2Nyb2xsVG8iLCJuZXh0QW5pbWF0ZVRvIiwiYmVoYXZpb3IiLCJjb25zb2xlIiwid2FybiIsInJlcGxhY2UiLCJzY3JvbGxUb0JvdHRvbSIsInNjcm9sbFRvVG9wIiwic2Nyb2xsVG9FbmQiLCJvcHRpb25zIiwic2Nyb2xsVG9TdGFydCIsInNjcm9sbFRvU3RpY2t5IiwiYW5pbWF0ZUZyb20iLCJtYXhWYWx1ZSIsIk1hdGgiLCJtYXgiLCJtaW5WYWx1ZSIsInJhd05leHRWYWx1ZSIsIm5leHRWYWx1ZSIsIm1pbiIsImhhbmRsZVNjcm9sbCIsInRpbWVTdGFtcExvdyIsImFuaW1hdGluZyIsIm5leHRPZmZzZXRIZWlnaHQiLCJuZXh0U2Nyb2xsSGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0Q2hhbmdlZCIsInNjcm9sbEhlaWdodENoYW5nZWQiLCJuZXh0U3RpY2t5IiwicHJldk9mZnNldEhlaWdodCIsInByZXZTY3JvbGxIZWlnaHQiLCJhY3R1YWxTY3JvbGxUb3AiLCJvYnNlcnZlciIsInN0aWNreUJ1dE5vdEF0RW5kU2luY2UiLCJ0aW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsInN0eWxlVG9DbGFzc05hbWUiLCJlbW90aW9uIiwia2V5Iiwic3R5bGUiLCJjc3MiLCJpbnRlcm5hbENvbnRleHQiLCJzdGF0ZTFDb250ZXh0Iiwic3RhdGUyQ29udGV4dCIsImFuaW1hdGluZ1RvRW5kIiwiY29tYmluZWRTdGF0ZUNvbnRleHQiLCJmdW5jdGlvbkNvbnRleHQiLCJoYW5kbGVGb2N1cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJjYXB0dXJlIiwicGFzc2l2ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkZWZhdWx0UHJvcHMiLCJ1bmRlZmluZWQiLCJwcm9wVHlwZXMiLCJudW1iZXIiLCJhbnkiLCJib29sIiwib25lT2YiLCJzdHJpbmciLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU9BLGFBQVAsTUFBMEIsOEJBQTFCO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUNBLE9BQU9DLEtBQVAsSUFBZ0JDLFdBQWhCLEVBQTZCQyxTQUE3QixFQUF3Q0MsT0FBeEMsRUFBaURDLE1BQWpELEVBQXlEQyxRQUF6RCxRQUF5RSxPQUF6RTtBQUVBLE9BQU9DLFlBQVAsTUFBeUIsaUJBQXpCO0FBQ0EsT0FBT0MsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxRQUFQLE1BQXFCLGFBQXJCO0FBQ0EsT0FBT0MsZUFBUCxNQUE0QixtQkFBNUI7QUFDQSxPQUFPQyxlQUFQLE1BQTRCLG1CQUE1QjtBQUNBLE9BQU9DLE9BQVAsTUFBb0IsWUFBcEI7QUFDQSxPQUFPQyxhQUFQLE1BQTBCLGlCQUExQjtBQUNBLE9BQU9DLGFBQVAsTUFBMEIsaUJBQTFCO0FBQ0EsT0FBT0MsWUFBUCxNQUF5QixnQkFBekI7QUFDQSxPQUFPQyxZQUFQLE1BQXlCLHVCQUF6QjtBQUNBLE9BQU9DLFdBQVAsTUFBd0IsK0JBQXhCOztBQUVBLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxTQUFNQyxRQUFOO0FBQUEsQ0FBekI7O0FBQ0EsSUFBTUMsa0JBQWtCLEdBQUcsRUFBM0IsQyxDQUErQjs7QUFDL0IsSUFBTUMsV0FBVyxHQUFHLFFBQXBCO0FBQ0EsSUFBTUMsUUFBUSxHQUFHLEtBQWpCO0FBQ0EsSUFBTUMsa0JBQWtCLEdBQUcsQ0FBM0I7QUFDQSxJQUFNQyx3QkFBd0IsR0FBRyxFQUFqQyxDLENBQXFDO0FBRXJDO0FBQ0E7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHLEVBQXBCOztBQUVBLFNBQVNDLG9CQUFULENBQThCQyxFQUE5QixFQUFrQ0MsRUFBbEMsRUFBc0M7QUFDcENELEVBQUFBLEVBQUU7QUFFRixTQUFPLGFBQVlBLEVBQVosRUFBZ0JDLEVBQWhCLENBQVA7QUFDRDs7QUFFRCxTQUFTQyxnQkFBVCxPQUF1RjtBQUFBLE1BQTNEQyxJQUEyRCxRQUEzREEsSUFBMkQ7QUFBQSx5QkFBckRDLE1BQXFEO0FBQUEsTUFBM0NDLFlBQTJDLGVBQTNDQSxZQUEyQztBQUFBLE1BQTdCQyxZQUE2QixlQUE3QkEsWUFBNkI7QUFBQSxNQUFmQyxTQUFlLGVBQWZBLFNBQWU7QUFDckYsTUFBTUMsUUFBUSxHQUFHRixZQUFZLEdBQUdDLFNBQWYsR0FBMkJGLFlBQTNCLEdBQTBDVCxrQkFBM0Q7QUFDQSxNQUFNYSxLQUFLLEdBQUdGLFNBQVMsR0FBR1gsa0JBQTFCO0FBRUEsTUFBTWMsS0FBSyxHQUFHUCxJQUFJLEtBQUtSLFFBQVQsR0FBb0JjLEtBQXBCLEdBQTRCRCxRQUExQztBQUNBLE1BQU1HLE9BQU8sR0FBR1IsSUFBSSxLQUFLUixRQUFULEdBQW9CYyxLQUFwQixHQUE0QkQsUUFBNUM7QUFFQSxTQUFPO0FBQ0xBLElBQUFBLFFBQVEsRUFBUkEsUUFESztBQUVMRSxJQUFBQSxLQUFLLEVBQUxBLEtBRks7QUFHTEMsSUFBQUEsT0FBTyxFQUFQQSxPQUhLO0FBSUxGLElBQUFBLEtBQUssRUFBTEE7QUFKSyxHQUFQO0FBTUQ7O0FBRUQsU0FBU0csS0FBVCxDQUFlQyxTQUFmLEVBQTBCVixJQUExQixFQUFnQztBQUM5QixTQUFPVSxTQUFTLE1BQU1WLElBQUksS0FBS1IsUUFBVCxHQUFvQixDQUFwQixHQUF3QixNQUE5QixDQUFoQjtBQUNEOztBQUVELElBQU1tQixRQUFRLEdBQUcsU0FBWEEsUUFBVyxRQVNYO0FBQUEsTUFSSkMsYUFRSSxTQVJKQSxhQVFJO0FBQUEsTUFQSkMsUUFPSSxTQVBKQSxRQU9JO0FBQUEsTUFOSkMsUUFNSSxTQU5KQSxRQU1JO0FBQUEsTUFMR0MsYUFLSCxTQUxKQyxLQUtJO0FBQUEsTUFKSkMscUJBSUksU0FKSkEscUJBSUk7QUFBQSxNQUhKakIsSUFHSSxTQUhKQSxJQUdJO0FBQUEsTUFGSmtCLEtBRUksU0FGSkEsS0FFSTtBQUFBLE1BREpDLFFBQ0ksU0FESkEsUUFDSTtBQUNKLE1BQU1ILEtBQUssR0FBRzFDLE9BQU8sQ0FBQztBQUFBLFdBQU1JLFdBQVcscUJBQXFCO0FBQUUwQyxNQUFBQSxLQUFLLEVBQUVMO0FBQVQsS0FBckIsQ0FBakI7QUFBQSxHQUFELEVBQWtFLENBQUNBLGFBQUQsQ0FBbEUsQ0FBckI7QUFFQWYsRUFBQUEsSUFBSSxHQUFHQSxJQUFJLEtBQUtSLFFBQVQsR0FBb0JBLFFBQXBCLEdBQStCRCxXQUF0QztBQUVBLE1BQU04QiwwQkFBMEIsR0FBRzlDLE1BQU0sQ0FBQyxDQUFELENBQXpDO0FBQ0EsTUFBTStDLHdCQUF3QixHQUFHL0MsTUFBTSxDQUFDMEMscUJBQUQsQ0FBdkM7O0FBQ0EscUJBQWdEOUIsV0FBVyxDQUFDYSxJQUFJLEtBQUtSLFFBQVQsR0FBb0IsQ0FBcEIsR0FBd0IsTUFBekIsQ0FBM0Q7QUFBQTtBQUFBLE1BQU9rQixTQUFQO0FBQUEsTUFBa0JhLFlBQWxCO0FBQUEsTUFBZ0NDLFlBQWhDOztBQUNBLHNCQUF1Q3JDLFdBQVcsQ0FBQyxJQUFELENBQWxEO0FBQUE7QUFBQSxNQUFPYyxNQUFQO0FBQUEsTUFBZXdCLFNBQWY7QUFBQSxNQUEwQkMsU0FBMUIsb0JBUkksQ0FVSjs7O0FBQ0EsTUFBTUMsY0FBYyxHQUFHcEQsTUFBTSxDQUFDLENBQUQsQ0FBN0I7QUFDQSxNQUFNcUQsZUFBZSxHQUFHckQsTUFBTSxDQUFDLENBQUQsQ0FBOUI7QUFDQSxNQUFNc0QsZUFBZSxHQUFHdEQsTUFBTSxDQUFDLENBQUQsQ0FBOUIsQ0FiSSxDQWVKOztBQUNBLGtCQUFnQ0MsUUFBUSxDQUFDLElBQUQsQ0FBeEM7QUFBQTtBQUFBLE1BQU82QixRQUFQO0FBQUEsTUFBaUJ5QixXQUFqQjs7QUFDQSxtQkFBMEJ0RCxRQUFRLENBQUMsSUFBRCxDQUFsQztBQUFBO0FBQUEsTUFBTytCLEtBQVA7QUFBQSxNQUFjd0IsUUFBZDs7QUFDQSxtQkFBMEJ2RCxRQUFRLENBQUMsSUFBRCxDQUFsQztBQUFBO0FBQUEsTUFBTzhCLEtBQVA7QUFBQSxNQUFjMEIsUUFBZDs7QUFDQSxtQkFBOEJ4RCxRQUFRLENBQUMsS0FBRCxDQUF0QztBQUFBO0FBQUEsTUFBT2dDLE9BQVA7QUFBQSxNQUFnQnlCLFVBQWhCOztBQUNBLHNCQUF1QzlDLFdBQVcsQ0FBQyxJQUFELENBQWxEO0FBQUE7QUFBQSxNQUFPK0MsTUFBUDtBQUFBLE1BQWVDLFNBQWY7QUFBQSxNQUEwQkMsU0FBMUIsb0JBcEJJLENBc0JKOzs7QUFDQSxNQUFNQywwQkFBMEIsR0FBRzlELE1BQU0sQ0FBQyxFQUFELENBQXpDO0FBQ0EsTUFBTStELHFCQUFxQixHQUFHbEUsV0FBVyxDQUN2QyxVQUFBeUIsRUFBRSxFQUFJO0FBQ0osUUFBaUJJLE1BQWpCLEdBQTRCeUIsU0FBNUIsQ0FBUWEsT0FBUjtBQUVBRixJQUFBQSwwQkFBMEIsQ0FBQ0UsT0FBM0IsQ0FBbUNDLElBQW5DLENBQXdDM0MsRUFBeEM7QUFDQUksSUFBQUEsTUFBTSxJQUFJSixFQUFFLENBQUM7QUFBRU8sTUFBQUEsU0FBUyxFQUFFSCxNQUFNLENBQUNHO0FBQXBCLEtBQUQsQ0FBWjtBQUVBLFdBQU8sWUFBTTtBQUNYLFVBQWlCcUMsdUJBQWpCLEdBQTZDSiwwQkFBN0MsQ0FBUUUsT0FBUjs7QUFDQSxVQUFNRyxLQUFLLEdBQUcseUJBQUFELHVCQUF1QixNQUF2QixDQUFBQSx1QkFBdUIsRUFBUzVDLEVBQVQsQ0FBckM7O0FBRUEsT0FBQzZDLEtBQUQsSUFBVSx3QkFBQUQsdUJBQXVCLE1BQXZCLENBQUFBLHVCQUF1QixFQUFRQyxLQUFSLEVBQWUsQ0FBZixDQUFqQztBQUNELEtBTEQ7QUFNRCxHQWJzQyxFQWN2QyxDQUFDTCwwQkFBRCxFQUE2QlgsU0FBN0IsQ0FkdUMsQ0FBekM7QUFpQkEsTUFBTWlCLGdCQUFnQixHQUFHdkUsV0FBVyxDQUFDLFlBQU07QUFDekMsUUFBaUJzQyxTQUFqQixHQUErQmMsWUFBL0IsQ0FBUWUsT0FBUjtBQUVBdkIsSUFBQUEsS0FBSyxDQUFDO0FBQUE7O0FBQUEsaURBQ0osa0NBREkscUNBRUQ5QixZQUFZLENBQUMsU0FBRCxDQUZYLHNCQUdEQSxZQUFZLENBQUMsUUFBRCxDQUhYLElBSUo7QUFBRXdCLFFBQUFBLFNBQVMsRUFBVEE7QUFBRixPQUpJO0FBQUEsS0FBRCxDQUFMO0FBT0FXLElBQUFBLDBCQUEwQixDQUFDa0IsT0FBM0IsR0FBcUMsV0FBckMsQ0FWeUMsQ0FZekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTlCLElBQUFBLEtBQUssQ0FBQ0MsU0FBRCxFQUFZVixJQUFaLENBQUwsSUFBMEJtQyxTQUFTLENBQUMsS0FBRCxDQUFuQztBQUNBWixJQUFBQSxZQUFZLENBQUMsSUFBRCxDQUFaO0FBQ0QsR0F2Qm1DLEVBdUJqQyxDQUFDQyxZQUFELEVBQWVSLEtBQWYsRUFBc0JLLDBCQUF0QixFQUFrRHJCLElBQWxELEVBQXdEdUIsWUFBeEQsRUFBc0VZLFNBQXRFLENBdkJpQyxDQUFwQyxDQXpDSSxDQWtFSjs7QUFDQSxNQUFNUyxRQUFRLEdBQUd4RSxXQUFXLENBQzFCLFVBQUN5RSxhQUFELEVBQXNDO0FBQUEsb0ZBQVAsRUFBTztBQUFBLFFBQXBCQyxRQUFvQixTQUFwQkEsUUFBb0I7O0FBQ3BDLFFBQWlCN0MsTUFBakIsR0FBNEJ5QixTQUE1QixDQUFRYSxPQUFSOztBQUVBLFFBQUksT0FBT00sYUFBUCxLQUF5QixRQUF6QixJQUFxQ0EsYUFBYSxLQUFLLE1BQTNELEVBQW1FO0FBQ2pFLGFBQU9FLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLHlGQUFiLENBQVA7QUFDRCxLQUxtQyxDQU9wQzs7O0FBRUFoQyxJQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxhQUFNLCtFQUdOLE9BQU82QixhQUFQLEtBQXlCLFFBQXpCLEdBQW9DQSxhQUFhLEdBQUcsSUFBcEQsR0FBMkRBLGFBQWEsQ0FBQ0ksT0FBZCxDQUFzQixJQUF0QixFQUE2QixJQUE3QixDQUhyRCw2Q0FLTC9ELFlBQVksQ0FBQyxNQUFELEVBQVMsRUFBVCxDQUxQLHNCQU1MQSxZQUFZLENBQUMsUUFBRCxDQU5QLElBUVY7QUFDRTRELFFBQUFBLFFBQVEsRUFBUkEsUUFERjtBQUVFRCxRQUFBQSxhQUFhLEVBQWJBLGFBRkY7QUFHRTVDLFFBQUFBLE1BQU0sRUFBTkE7QUFIRixPQVJVLENBQU47QUFBQSxLQUFELENBQUw7O0FBZUEsUUFBSTZDLFFBQVEsS0FBSyxNQUFqQixFQUF5QjtBQUN2QjtBQUNBSCxNQUFBQSxnQkFBZ0I7O0FBRWhCLFVBQUkxQyxNQUFKLEVBQVk7QUFDVjtBQUNBQSxRQUFBQSxNQUFNLENBQUNHLFNBQVAsR0FBbUJ5QyxhQUFhLEtBQUssTUFBbEIsR0FBMkI1QyxNQUFNLENBQUNFLFlBQVAsR0FBc0JGLE1BQU0sQ0FBQ0MsWUFBeEQsR0FBdUUyQyxhQUExRjtBQUNEO0FBQ0YsS0FSRCxNQVFPO0FBQ0xDLE1BQUFBLFFBQVEsS0FBSyxRQUFiLElBQ0VDLE9BQU8sQ0FBQ0MsSUFBUixDQUNFLDBNQURGLENBREY7QUFLQXpCLE1BQUFBLFlBQVksQ0FBQ3NCLGFBQUQsQ0FBWjtBQUNELEtBdkNtQyxDQXlDcEM7OztBQUNBLFFBQUlwQyxLQUFLLENBQUNvQyxhQUFELEVBQWdCN0MsSUFBaEIsQ0FBVCxFQUFnQztBQUM5QmdCLE1BQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLGVBQU0sMElBR0w5QixZQUFZLENBQUMsTUFBRCxFQUFTLEVBQVQsQ0FIUCxzQkFJTEEsWUFBWSxDQUFDLFFBQUQsQ0FKUCxJQU1WLENBQUM7QUFBRWMsVUFBQUEsSUFBSSxFQUFKQSxJQUFGO0FBQVE2QyxVQUFBQSxhQUFhLEVBQWJBO0FBQVIsU0FBRCxDQU5VLENBQU47QUFBQSxPQUFELENBQUw7QUFTQVYsTUFBQUEsU0FBUyxDQUFDLElBQUQsQ0FBVDtBQUNEO0FBQ0YsR0F2RHlCLEVBd0QxQixDQUFDbkIsS0FBRCxFQUFRMkIsZ0JBQVIsRUFBMEIzQyxJQUExQixFQUFnQ3VCLFlBQWhDLEVBQThDWSxTQUE5QyxFQUF5RFQsU0FBekQsQ0F4RDBCLENBQTVCO0FBMkRBLE1BQU13QixjQUFjLEdBQUc5RSxXQUFXLENBQ2hDLFlBQXVCO0FBQUEsb0ZBQVAsRUFBTztBQUFBLFFBQXBCMEUsUUFBb0IsU0FBcEJBLFFBQW9COztBQUNyQjlCLElBQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLGtEQUFPLDRCQUFQLHNDQUF3QzlCLFlBQVksQ0FBQyxRQUFELEVBQVcsRUFBWCxDQUFwRDtBQUFBLEtBQUQsQ0FBTDtBQUVBNEQsSUFBQUEsUUFBUSxLQUFLLFFBQWIsSUFDRUMsT0FBTyxDQUFDQyxJQUFSLENBQ0UsZ05BREYsQ0FERjtBQUtBSixJQUFBQSxRQUFRLENBQUMsTUFBRCxFQUFTO0FBQUVFLE1BQUFBLFFBQVEsRUFBRUEsUUFBUSxJQUFJO0FBQXhCLEtBQVQsQ0FBUjtBQUNELEdBVitCLEVBV2hDLENBQUM5QixLQUFELEVBQVE0QixRQUFSLENBWGdDLENBQWxDO0FBY0EsTUFBTU8sV0FBVyxHQUFHL0UsV0FBVyxDQUM3QixZQUF1QjtBQUFBLG9GQUFQLEVBQU87QUFBQSxRQUFwQjBFLFFBQW9CLFNBQXBCQSxRQUFvQjs7QUFDckI5QixJQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxrREFBTyx5QkFBUCxzQ0FBcUM5QixZQUFZLENBQUMsUUFBRCxFQUFXLEVBQVgsQ0FBakQ7QUFBQSxLQUFELENBQUw7QUFFQTRELElBQUFBLFFBQVEsS0FBSyxRQUFiLElBQ0VDLE9BQU8sQ0FBQ0MsSUFBUixDQUNFLDZNQURGLENBREY7QUFLQUosSUFBQUEsUUFBUSxDQUFDLENBQUQsRUFBSTtBQUFFRSxNQUFBQSxRQUFRLEVBQUVBLFFBQVEsSUFBSTtBQUF4QixLQUFKLENBQVI7QUFDRCxHQVY0QixFQVc3QixDQUFDOUIsS0FBRCxFQUFRNEIsUUFBUixDQVg2QixDQUEvQjtBQWNBLE1BQU1RLFdBQVcsR0FBR2hGLFdBQVcsQ0FDN0IsWUFBdUI7QUFBQSxvRkFBUCxFQUFPO0FBQUEsUUFBcEIwRSxRQUFvQixTQUFwQkEsUUFBb0I7O0FBQ3JCOUIsSUFBQUEsS0FBSyxDQUFDO0FBQUE7O0FBQUEsa0RBQU8seUJBQVAsc0NBQXFDOUIsWUFBWSxDQUFDLFFBQUQsRUFBVyxFQUFYLENBQWpEO0FBQUEsS0FBRCxDQUFMO0FBRUE0RCxJQUFBQSxRQUFRLEtBQUssUUFBYixJQUNFQyxPQUFPLENBQUNDLElBQVIsQ0FDRSw2TUFERixDQURGO0FBS0EsUUFBTUssT0FBTyxHQUFHO0FBQUVQLE1BQUFBLFFBQVEsRUFBRUEsUUFBUSxJQUFJO0FBQXhCLEtBQWhCO0FBRUE5QyxJQUFBQSxJQUFJLEtBQUtSLFFBQVQsR0FBb0IyRCxXQUFXLENBQUNFLE9BQUQsQ0FBL0IsR0FBMkNILGNBQWMsQ0FBQ0csT0FBRCxDQUF6RDtBQUNELEdBWjRCLEVBYTdCLENBQUNyQyxLQUFELEVBQVFoQixJQUFSLEVBQWNrRCxjQUFkLEVBQThCQyxXQUE5QixDQWI2QixDQUEvQjtBQWdCQSxNQUFNRyxhQUFhLEdBQUdsRixXQUFXLENBQy9CLFlBQXVCO0FBQUEsb0ZBQVAsRUFBTztBQUFBLFFBQXBCMEUsUUFBb0IsU0FBcEJBLFFBQW9COztBQUNyQjlCLElBQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLGtEQUFPLDJCQUFQLHNDQUF1QzlCLFlBQVksQ0FBQyxRQUFELEVBQVcsRUFBWCxDQUFuRDtBQUFBLEtBQUQsQ0FBTDtBQUVBNEQsSUFBQUEsUUFBUSxLQUFLLFFBQWIsSUFDRUMsT0FBTyxDQUFDQyxJQUFSLENBQ0UsK01BREYsQ0FERjtBQUtBLFFBQU1LLE9BQU8sR0FBRztBQUFFUCxNQUFBQSxRQUFRLEVBQUVBLFFBQVEsSUFBSTtBQUF4QixLQUFoQjtBQUVBOUMsSUFBQUEsSUFBSSxLQUFLUixRQUFULEdBQW9CMEQsY0FBYyxDQUFDRyxPQUFELENBQWxDLEdBQThDRixXQUFXLENBQUNFLE9BQUQsQ0FBekQ7QUFDRCxHQVo4QixFQWEvQixDQUFDckMsS0FBRCxFQUFRaEIsSUFBUixFQUFja0QsY0FBZCxFQUE4QkMsV0FBOUIsQ0FiK0IsQ0FBakM7QUFnQkEsTUFBTUksY0FBYyxHQUFHbkYsV0FBVyxDQUFDLFlBQU07QUFDdkMsUUFBaUI2QixNQUFqQixHQUE0QnlCLFNBQTVCLENBQVFhLE9BQVI7O0FBRUEsUUFBSXRDLE1BQUosRUFBWTtBQUNWLFVBQUlxQix3QkFBd0IsQ0FBQ2lCLE9BQXpCLEtBQXFDLE1BQXpDLEVBQWlEO0FBQy9DdkIsUUFBQUEsS0FBSyxDQUFDO0FBQUE7O0FBQUEsZ0lBQWdEOUIsWUFBWSxDQUFDLE1BQUQsQ0FBNUQ7QUFBQSxTQUFELENBQUw7QUFFQWUsUUFBQUEsTUFBTSxDQUFDRyxTQUFQLEdBQW1CSixJQUFJLEtBQUtSLFFBQVQsR0FBb0IsQ0FBcEIsR0FBd0JTLE1BQU0sQ0FBQ0UsWUFBUCxHQUFzQkYsTUFBTSxDQUFDQyxZQUF4RTtBQUNBb0IsUUFBQUEsd0JBQXdCLENBQUNpQixPQUF6QixHQUFtQyxLQUFuQztBQUVBO0FBQ0QsT0FSUyxDQVVWO0FBQ0E7QUFDQTs7O0FBRUEsVUFBaUJpQixXQUFqQixHQUFpQzdCLGNBQWpDLENBQVFZLE9BQVI7QUFDQSxVQUFRckMsWUFBUixHQUFrREQsTUFBbEQsQ0FBUUMsWUFBUjtBQUFBLFVBQXNCQyxZQUF0QixHQUFrREYsTUFBbEQsQ0FBc0JFLFlBQXRCO0FBQUEsVUFBb0NDLFNBQXBDLEdBQWtESCxNQUFsRCxDQUFvQ0csU0FBcEM7QUFFQSxVQUFNcUQsUUFBUSxHQUFHekQsSUFBSSxLQUFLUixRQUFULEdBQW9CLENBQXBCLEdBQXdCa0UsSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZeEQsWUFBWSxHQUFHRCxZQUFmLEdBQThCRSxTQUExQyxDQUF6QztBQUNBLFVBQU13RCxRQUFRLEdBQUdGLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWUgsV0FBVyxHQUFHcEQsU0FBMUIsQ0FBakI7QUFFQSxVQUFNeUQsWUFBWSxHQUFHMUMsUUFBUSxDQUFDO0FBQUVzQyxRQUFBQSxRQUFRLEVBQVJBLFFBQUY7QUFBWUcsUUFBQUEsUUFBUSxFQUFSQSxRQUFaO0FBQXNCMUQsUUFBQUEsWUFBWSxFQUFaQSxZQUF0QjtBQUFvQ0MsUUFBQUEsWUFBWSxFQUFaQSxZQUFwQztBQUFrREMsUUFBQUEsU0FBUyxFQUFUQTtBQUFsRCxPQUFELENBQTdCO0FBRUEsVUFBTTBELFNBQVMsR0FBR0osSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZRCxJQUFJLENBQUNLLEdBQUwsQ0FBU04sUUFBVCxFQUFtQkksWUFBbkIsQ0FBWixDQUFsQjtBQUVBLFVBQUloQixhQUFKOztBQUVBLFVBQUk3QyxJQUFJLEtBQUtSLFFBQVQsSUFBcUJzRSxTQUFTLEtBQUtMLFFBQXZDLEVBQWlEO0FBQy9DWixRQUFBQSxhQUFhLEdBQUd6QyxTQUFTLEdBQUcwRCxTQUE1QjtBQUNELE9BRkQsTUFFTztBQUNMO0FBQ0E7QUFDQTtBQUNBakIsUUFBQUEsYUFBYSxHQUFHLE1BQWhCO0FBQ0Q7O0FBRUQ3QixNQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxlQUFNLGtLQUVtQ3dDLFdBRm5DLGtDQUdOLE9BQU9YLGFBQVAsS0FBeUIsUUFBekIsR0FBb0NBLGFBQWEsR0FBRyxJQUFwRCxHQUEyREEsYUFBYSxDQUFDSSxPQUFkLENBQXNCLElBQXRCLEVBQTZCLElBQTdCLENBSHJELDhCQUlDLENBQUNKLGFBQWEsS0FBSyxNQUFsQixHQUEyQlksUUFBM0IsR0FBc0NaLGFBQXZDLElBQXdEVyxXQUp6RCxnREFLTHRFLFlBQVksQ0FBQyxRQUFELENBTFAsc0JBTUxBLFlBQVksQ0FBQyxRQUFELENBTlAsc0JBT0xBLFlBQVksQ0FBQyxRQUFELENBUFAsc0JBUUxBLFlBQVksQ0FBQyxRQUFELENBUlAsSUFVVjtBQUNFc0UsVUFBQUEsV0FBVyxFQUFYQSxXQURGO0FBRUVDLFVBQUFBLFFBQVEsRUFBUkEsUUFGRjtBQUdFRyxVQUFBQSxRQUFRLEVBQVJBLFFBSEY7QUFJRWYsVUFBQUEsYUFBYSxFQUFiQSxhQUpGO0FBS0VpQixVQUFBQSxTQUFTLEVBQVRBLFNBTEY7QUFNRTVELFVBQUFBLFlBQVksRUFBWkEsWUFORjtBQU9FMkQsVUFBQUEsWUFBWSxFQUFaQSxZQVBGO0FBUUUxRCxVQUFBQSxZQUFZLEVBQVpBLFlBUkY7QUFTRUMsVUFBQUEsU0FBUyxFQUFUQTtBQVRGLFNBVlUsQ0FBTjtBQUFBLE9BQUQsQ0FBTDtBQXVCQXdDLE1BQUFBLFFBQVEsQ0FBQ0MsYUFBRCxFQUFnQjtBQUFFQyxRQUFBQSxRQUFRLEVBQUU7QUFBWixPQUFoQixDQUFSO0FBQ0Q7QUFDRixHQS9EaUMsRUErRC9CLENBQUNuQixjQUFELEVBQWlCWCxLQUFqQixFQUF3QmhCLElBQXhCLEVBQThCbUIsUUFBOUIsRUFBd0N5QixRQUF4QyxFQUFrRGxCLFNBQWxELENBL0QrQixDQUFsQztBQWlFQSxNQUFNc0MsWUFBWSxHQUFHNUYsV0FBVyxDQUM5QixpQkFBc0I7QUFBQTs7QUFBQSxRQUFuQjZGLFlBQW1CLFNBQW5CQSxZQUFtQjtBQUNwQixRQUFpQnZELFNBQWpCLEdBQStCYyxZQUEvQixDQUFRZSxPQUFSO0FBQ0EsUUFBaUJ0QyxNQUFqQixHQUE0QnlCLFNBQTVCLENBQVFhLE9BQVI7QUFFQSxRQUFNMkIsU0FBUyxHQUFHeEQsU0FBUyxLQUFLLElBQWhDLENBSm9CLENBTXBCO0FBQ0E7QUFDQTs7QUFFQSxRQUFJdUQsWUFBWSxJQUFJNUMsMEJBQTBCLENBQUNrQixPQUEzQyxJQUFzRCxDQUFDdEMsTUFBM0QsRUFBbUU7QUFDakU7QUFDQTtBQUNBO0FBRUE7QUFDRDs7QUFFRCw0QkFBNENGLGdCQUFnQixDQUFDO0FBQUVDLE1BQUFBLElBQUksRUFBSkEsSUFBRjtBQUFRQyxNQUFBQSxNQUFNLEVBQU5BO0FBQVIsS0FBRCxDQUE1RDtBQUFBLFFBQVFJLFFBQVIscUJBQVFBLFFBQVI7QUFBQSxRQUFrQkUsS0FBbEIscUJBQWtCQSxLQUFsQjtBQUFBLFFBQXlCQyxPQUF6QixxQkFBeUJBLE9BQXpCO0FBQUEsUUFBa0NGLEtBQWxDLHFCQUFrQ0EsS0FBbEM7O0FBRUF3QixJQUFBQSxXQUFXLENBQUN6QixRQUFELENBQVg7QUFDQTBCLElBQUFBLFFBQVEsQ0FBQ3hCLEtBQUQsQ0FBUjtBQUNBMEIsSUFBQUEsVUFBVSxDQUFDekIsT0FBRCxDQUFWO0FBQ0F3QixJQUFBQSxRQUFRLENBQUMxQixLQUFELENBQVIsQ0F2Qm9CLENBeUJwQjtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxRQUFzQjZELGdCQUF0QixHQUEyRWxFLE1BQTNFLENBQVFDLFlBQVI7QUFBQSxRQUFzRGtFLGdCQUF0RCxHQUEyRW5FLE1BQTNFLENBQXdDRSxZQUF4QztBQUNBLFFBQWlCRCxZQUFqQixHQUFrQzBCLGVBQWxDLENBQVFXLE9BQVI7QUFDQSxRQUFpQnBDLFlBQWpCLEdBQWtDMEIsZUFBbEMsQ0FBUVUsT0FBUjtBQUNBLFFBQU04QixtQkFBbUIsR0FBR0YsZ0JBQWdCLEtBQUtqRSxZQUFqRDtBQUNBLFFBQU1vRSxtQkFBbUIsR0FBR0YsZ0JBQWdCLEtBQUtqRSxZQUFqRDs7QUFFQSxRQUFJa0UsbUJBQUosRUFBeUI7QUFDdkJ6QyxNQUFBQSxlQUFlLENBQUNXLE9BQWhCLEdBQTBCNEIsZ0JBQTFCO0FBQ0Q7O0FBRUQsUUFBSUcsbUJBQUosRUFBeUI7QUFDdkJ6QyxNQUFBQSxlQUFlLENBQUNVLE9BQWhCLEdBQTBCNkIsZ0JBQTFCO0FBQ0QsS0F6Q21CLENBMkNwQjtBQUNBO0FBQ0E7QUFFQTs7O0FBQ0EsUUFBSSxDQUFDQyxtQkFBRCxJQUF3QixDQUFDQyxtQkFBN0IsRUFBa0Q7QUFDaEQ7QUFDQTtBQUNBLFVBQU1DLFVBQVUsR0FBSUwsU0FBUyxJQUFJekQsS0FBSyxDQUFDQyxTQUFELEVBQVlWLElBQVosQ0FBbkIsSUFBeUNPLEtBQTVEOztBQUVBLFVBQUk2QixTQUFTLENBQUNHLE9BQVYsS0FBc0JnQyxVQUExQixFQUFzQztBQUNwQ3ZELFFBQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLGlCQUFNLCtFQUV5QnVELFVBRnpCLCtDQUdMckYsWUFBWSxDQUFDLEtBQUQsQ0FIUCxzQkFJTEEsWUFBWSxDQUFDLEtBQUQsQ0FKUCxzQkFLTEEsWUFBWSxDQUFDLFFBQUQsQ0FMUCw2SUFRVWdGLFNBUlYsd0NBUXNDekQsS0FBSyxDQUFDQyxTQUFELEVBQVlWLElBQVosQ0FSM0MseUNBUWdGTyxLQVJoRiw4Q0FTTHJCLFlBQVksQ0FBQyxRQUFELENBVFAsc0JBVUxBLFlBQVksQ0FBQyxRQUFELENBVlAsc0JBV0xBLFlBQVksQ0FBQyxRQUFELENBWFAsSUFZUjtBQUNFZ0YsWUFBQUEsU0FBUyxFQUFUQSxTQURGO0FBRUV4RCxZQUFBQSxTQUFTLEVBQVRBLFNBRkY7QUFHRUgsWUFBQUEsS0FBSyxFQUFMQSxLQUhGO0FBSUVQLFlBQUFBLElBQUksRUFBSkEsSUFKRjtBQUtFRSxZQUFBQSxZQUFZLEVBQUVELE1BQU0sQ0FBQ0MsWUFMdkI7QUFNRUMsWUFBQUEsWUFBWSxFQUFFRixNQUFNLENBQUNFLFlBTnZCO0FBT0UrQixZQUFBQSxNQUFNLEVBQUVFLFNBQVMsQ0FBQ0csT0FQcEI7QUFRRWdDLFlBQUFBLFVBQVUsRUFBVkE7QUFSRixXQVpRLEdBQU47QUFBQSxTQUFELENBQUw7QUF5QkFwQyxRQUFBQSxTQUFTLENBQUNvQyxVQUFELENBQVQ7QUFDRDtBQUNGLEtBakNELE1BaUNPLElBQUluQyxTQUFTLENBQUNHLE9BQWQsRUFBdUI7QUFDNUJ2QixNQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxlQUFNLHFKQUdMOUIsWUFBWSxDQUFDLEtBQUQsQ0FIUCxzQkFJTEEsWUFBWSxDQUFDLFFBQUQsQ0FKUCxJQUtSO0FBQ0VtRixVQUFBQSxtQkFBbUIsRUFBbkJBLG1CQURGO0FBRUVDLFVBQUFBLG1CQUFtQixFQUFuQkE7QUFGRixTQUxRLElBVVY7QUFDRUgsVUFBQUEsZ0JBQWdCLEVBQWhCQSxnQkFERjtBQUVFSyxVQUFBQSxnQkFBZ0IsRUFBRXRFLFlBRnBCO0FBR0VrRSxVQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQUhGO0FBSUVLLFVBQUFBLGdCQUFnQixFQUFFdEU7QUFKcEIsU0FWVSxDQUFOO0FBQUEsT0FBRCxDQUFMO0FBa0JBb0QsTUFBQUEsY0FBYztBQUNmOztBQUVELFFBQW1CbUIsZUFBbkIsR0FBdUN6RSxNQUF2QyxDQUFRRyxTQUFSOztBQUVBLDBDQUFBaUMsMEJBQTBCLENBQUNFLE9BQTNCLG1CQUEyQyxVQUFBb0MsUUFBUTtBQUFBLGFBQUlBLFFBQVEsQ0FBQztBQUFFdkUsUUFBQUEsU0FBUyxFQUFFc0U7QUFBYixPQUFELENBQVo7QUFBQSxLQUFuRDtBQUNELEdBM0c2QixFQTRHOUIsQ0FDRWxELFlBREYsRUFFRVIsS0FGRixFQUdFSywwQkFIRixFQUlFckIsSUFKRixFQUtFNEIsZUFMRixFQU1FQyxlQU5GLEVBT0VRLDBCQVBGLEVBUUVrQixjQVJGLEVBU0V6QixXQVRGLEVBVUVDLFFBVkYsRUFXRUUsVUFYRixFQVlFRCxRQVpGLEVBYUVHLFNBYkYsRUFjRUMsU0FkRixFQWVFVixTQWZGLENBNUc4QixDQUFoQztBQStIQXJELEVBQUFBLFNBQVMsQ0FBQyxZQUFNO0FBQ2QsUUFBSTRCLE1BQUosRUFBWTtBQUNWLFVBQUkyRSxzQkFBc0IsR0FBRyxLQUE3QjtBQUVBLFVBQU1DLE9BQU8sR0FBR2pGLG9CQUFvQixDQUFDLFlBQU07QUFDekMsWUFBaUJLLE1BQWpCLEdBQTRCeUIsU0FBNUIsQ0FBUWEsT0FBUjtBQUNBLFlBQU0yQixTQUFTLEdBQUcxQyxZQUFZLENBQUNlLE9BQWIsS0FBeUIsSUFBM0M7O0FBRUEsWUFBSUgsU0FBUyxDQUFDRyxPQUFkLEVBQXVCO0FBQ3JCLGNBQUksQ0FBQ3hDLGdCQUFnQixDQUFDO0FBQUVDLFlBQUFBLElBQUksRUFBSkEsSUFBRjtBQUFRQyxZQUFBQSxNQUFNLEVBQU5BO0FBQVIsV0FBRCxDQUFoQixDQUFtQ00sS0FBeEMsRUFBK0M7QUFDN0MsZ0JBQUksQ0FBQ3FFLHNCQUFMLEVBQTZCO0FBQzNCQSxjQUFBQSxzQkFBc0IsR0FBRyxXQUF6QjtBQUNELGFBRkQsTUFFTyxJQUFJLGNBQWFBLHNCQUFiLEdBQXNDbEYsd0JBQTFDLEVBQW9FO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0Esa0JBQUksQ0FBQ3dFLFNBQUwsRUFBZ0I7QUFDZHZDLGdCQUFBQSxjQUFjLENBQUNZLE9BQWYsR0FBeUJ0QyxNQUFNLENBQUNHLFNBQWhDO0FBRUFZLGdCQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxnTUFFRDlCLFlBQVksQ0FBQyxNQUFELENBRlgsc0JBR0RBLFlBQVksQ0FBQyxRQUFELENBSFg7QUFBQSxpQkFBRCxDQUFMO0FBTUFxRSxnQkFBQUEsY0FBYztBQUNmOztBQUVEcUIsY0FBQUEsc0JBQXNCLEdBQUcsS0FBekI7QUFDRDtBQUNGLFdBMUJELE1BMEJPO0FBQ0xBLFlBQUFBLHNCQUFzQixHQUFHLEtBQXpCO0FBQ0Q7QUFDRixTQTlCRCxNQThCTyxJQUFJM0UsTUFBTSxDQUFDRSxZQUFQLElBQXVCRixNQUFNLENBQUNDLFlBQTlCLElBQThDLENBQUNrQyxTQUFTLENBQUNHLE9BQTdELEVBQXNFO0FBQzNFO0FBRUF2QixVQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxtQkFBTSx5SkFHTDlCLFlBQVksQ0FBQyxNQUFELENBSFAsc0JBSUxBLFlBQVksQ0FBQyxRQUFELENBSlAsSUFNVixDQUNFO0FBQ0VnQixjQUFBQSxZQUFZLEVBQUVELE1BQU0sQ0FBQ0MsWUFEdkI7QUFFRUMsY0FBQUEsWUFBWSxFQUFFRixNQUFNLENBQUNFLFlBRnZCO0FBR0UrQixjQUFBQSxNQUFNLEVBQUVFLFNBQVMsQ0FBQ0c7QUFIcEIsYUFERixDQU5VLENBQU47QUFBQSxXQUFELENBQUw7QUFlQUosVUFBQUEsU0FBUyxDQUFDLElBQUQsQ0FBVDtBQUNEO0FBQ0YsT0F0RG1DLEVBc0RqQ3VCLElBQUksQ0FBQ0MsR0FBTCxDQUFTckUsa0JBQVQsRUFBNkJzQixhQUE3QixLQUErQ3RCLGtCQXREZCxDQUFwQztBQXdEQSxhQUFPO0FBQUEsZUFBTXdGLGFBQWEsQ0FBQ0QsT0FBRCxDQUFuQjtBQUFBLE9BQVA7QUFDRDtBQUNGLEdBOURRLEVBOEROLENBQUNyRCxZQUFELEVBQWVaLGFBQWYsRUFBOEJJLEtBQTlCLEVBQXFDaEIsSUFBckMsRUFBMkN1RCxjQUEzQyxFQUEyRHBCLFNBQTNELEVBQXNFQyxTQUF0RSxFQUFpRm5DLE1BQWpGLEVBQXlGeUIsU0FBekYsQ0E5RE0sQ0FBVDtBQWdFQSxNQUFNcUQsZ0JBQWdCLEdBQUd6RyxPQUFPLENBQUMsWUFBTTtBQUNyQyxRQUFNMEcsT0FBTyxHQUNYckYsV0FBVyxDQUFDdUIsS0FBRCxDQUFYLEtBQ0N2QixXQUFXLENBQUN1QixLQUFELENBQVgsR0FBcUJqRCxhQUFhLENBQUM7QUFBRWdILE1BQUFBLEdBQUcsRUFBRSxpQ0FBaUN4RyxZQUFZLEVBQXBEO0FBQXdEeUMsTUFBQUEsS0FBSyxFQUFMQTtBQUF4RCxLQUFELENBRG5DLENBREY7QUFJQSxXQUFPLFVBQUFnRSxLQUFLO0FBQUEsYUFBSUYsT0FBTyxDQUFDRyxHQUFSLENBQVlELEtBQVosSUFBcUIsRUFBekI7QUFBQSxLQUFaO0FBQ0QsR0FOK0IsRUFNN0IsQ0FBQ2hFLEtBQUQsQ0FONkIsQ0FBaEM7QUFRQSxNQUFNa0UsZUFBZSxHQUFHOUcsT0FBTyxDQUM3QjtBQUFBLFdBQU87QUFDTGdFLE1BQUFBLHFCQUFxQixFQUFyQkEscUJBREs7QUFFTGIsTUFBQUEsU0FBUyxFQUFUQSxTQUZLO0FBR0xzRCxNQUFBQSxnQkFBZ0IsRUFBaEJBO0FBSEssS0FBUDtBQUFBLEdBRDZCLEVBTTdCLENBQUN6QyxxQkFBRCxFQUF3QmIsU0FBeEIsRUFBbUNzRCxnQkFBbkMsQ0FONkIsQ0FBL0I7QUFTQSxNQUFNTSxhQUFhLEdBQUcvRyxPQUFPLENBQzNCO0FBQUEsV0FBTztBQUNMK0IsTUFBQUEsUUFBUSxFQUFSQSxRQURLO0FBRUxFLE1BQUFBLEtBQUssRUFBTEEsS0FGSztBQUdMQyxNQUFBQSxPQUFPLEVBQVBBLE9BSEs7QUFJTEYsTUFBQUEsS0FBSyxFQUFMQSxLQUpLO0FBS0xOLE1BQUFBLElBQUksRUFBSkE7QUFMSyxLQUFQO0FBQUEsR0FEMkIsRUFRM0IsQ0FBQ0ssUUFBRCxFQUFXRSxLQUFYLEVBQWtCQyxPQUFsQixFQUEyQkYsS0FBM0IsRUFBa0NOLElBQWxDLENBUjJCLENBQTdCO0FBV0EsTUFBTXNGLGFBQWEsR0FBR2hILE9BQU8sQ0FBQyxZQUFNO0FBQ2xDLFFBQU00RixTQUFTLEdBQUd4RCxTQUFTLEtBQUssSUFBaEM7QUFFQSxXQUFPO0FBQ0x3RCxNQUFBQSxTQUFTLEVBQVRBLFNBREs7QUFFTHFCLE1BQUFBLGNBQWMsRUFBRXJCLFNBQVMsSUFBSXpELEtBQUssQ0FBQ0MsU0FBRCxFQUFZVixJQUFaLENBRjdCO0FBR0xrQyxNQUFBQSxNQUFNLEVBQU5BO0FBSEssS0FBUDtBQUtELEdBUjRCLEVBUTFCLENBQUN4QixTQUFELEVBQVlWLElBQVosRUFBa0JrQyxNQUFsQixDQVIwQixDQUE3QjtBQVVBLE1BQU1zRCxvQkFBb0IsR0FBR2xILE9BQU8sQ0FDbEM7QUFBQSwyQ0FDSytHLGFBREwsR0FFS0MsYUFGTDtBQUFBLEdBRGtDLEVBS2xDLENBQUNELGFBQUQsRUFBZ0JDLGFBQWhCLENBTGtDLENBQXBDO0FBUUEsTUFBTUcsZUFBZSxHQUFHbkgsT0FBTyxDQUM3QjtBQUFBLFdBQU87QUFDTHNFLE1BQUFBLFFBQVEsRUFBUkEsUUFESztBQUVMTSxNQUFBQSxjQUFjLEVBQWRBLGNBRks7QUFHTEUsTUFBQUEsV0FBVyxFQUFYQSxXQUhLO0FBSUxFLE1BQUFBLGFBQWEsRUFBYkEsYUFKSztBQUtMSCxNQUFBQSxXQUFXLEVBQVhBO0FBTEssS0FBUDtBQUFBLEdBRDZCLEVBUTdCLENBQUNQLFFBQUQsRUFBV00sY0FBWCxFQUEyQkUsV0FBM0IsRUFBd0NFLGFBQXhDLEVBQXVESCxXQUF2RCxDQVI2QixDQUEvQjtBQVdBOUUsRUFBQUEsU0FBUyxDQUFDLFlBQU07QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUk0QixNQUFKLEVBQVk7QUFDVixVQUFNeUYsV0FBVyxHQUFHLFNBQWRBLFdBQWMsR0FBTTtBQUN4QjdELFFBQUFBLGVBQWUsQ0FBQ1UsT0FBaEIsR0FBMEJ0QyxNQUFNLENBQUNFLFlBQWpDO0FBQ0QsT0FGRDs7QUFJQUYsTUFBQUEsTUFBTSxDQUFDMEYsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUNELFdBQWpDLEVBQThDO0FBQUVFLFFBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCQyxRQUFBQSxPQUFPLEVBQUU7QUFBMUIsT0FBOUM7QUFFQSxhQUFPO0FBQUEsZUFBTTVGLE1BQU0sQ0FBQzZGLG1CQUFQLENBQTJCLE9BQTNCLEVBQW9DSixXQUFwQyxDQUFOO0FBQUEsT0FBUDtBQUNEO0FBQ0YsR0E3QlEsRUE2Qk4sQ0FBQ3pGLE1BQUQsQ0E3Qk0sQ0FBVDtBQStCQWUsRUFBQUEsS0FBSyxDQUFDO0FBQUE7O0FBQUEsV0FBTSxrR0FDZ0I5QixZQUFZLENBQUMsTUFBRCxFQUFTLEVBQVQsQ0FENUIsSUFFVjtBQUNFd0IsTUFBQUEsU0FBUyxFQUFUQSxTQURGO0FBRUV3RCxNQUFBQSxTQUFTLEVBQUV4RCxTQUFTLEtBQUssSUFGM0I7QUFHRXdCLE1BQUFBLE1BQU0sRUFBTkEsTUFIRjtBQUlFakMsTUFBQUEsTUFBTSxFQUFOQTtBQUpGLEtBRlUsQ0FBTjtBQUFBLEdBQUQsQ0FBTDtBQVVBLHNCQUNFLG9CQUFDLGVBQUQsQ0FBaUIsUUFBakI7QUFBMEIsSUFBQSxLQUFLLEVBQUVtRjtBQUFqQyxrQkFDRSxvQkFBQyxlQUFELENBQWlCLFFBQWpCO0FBQTBCLElBQUEsS0FBSyxFQUFFSztBQUFqQyxrQkFDRSxvQkFBQyxZQUFELENBQWMsUUFBZDtBQUF1QixJQUFBLEtBQUssRUFBRUQ7QUFBOUIsa0JBQ0Usb0JBQUMsYUFBRCxDQUFlLFFBQWY7QUFBd0IsSUFBQSxLQUFLLEVBQUVIO0FBQS9CLGtCQUNFLG9CQUFDLGFBQUQsQ0FBZSxRQUFmO0FBQXdCLElBQUEsS0FBSyxFQUFFQztBQUEvQixLQUNHekUsUUFESCxFQUVHWixNQUFNLGlCQUFJLG9CQUFDLFFBQUQ7QUFBVSxJQUFBLFFBQVEsRUFBRWEsUUFBcEI7QUFBOEIsSUFBQSxJQUFJLEVBQUMsUUFBbkM7QUFBNEMsSUFBQSxPQUFPLEVBQUVrRCxZQUFyRDtBQUFtRSxJQUFBLE1BQU0sRUFBRS9EO0FBQTNFLElBRmIsRUFHR0EsTUFBTSxJQUFJUyxTQUFTLEtBQUssSUFBeEIsaUJBQ0Msb0JBQUMsT0FBRDtBQUFTLElBQUEsSUFBSSxFQUFDLFdBQWQ7QUFBMEIsSUFBQSxLQUFLLEVBQUVpQyxnQkFBakM7QUFBbUQsSUFBQSxNQUFNLEVBQUUxQyxNQUEzRDtBQUFtRSxJQUFBLEtBQUssRUFBRVM7QUFBMUUsSUFKSixDQURGLENBREYsQ0FERixDQURGLENBREY7QUFpQkQsQ0F0akJEOztBQXdqQkFDLFFBQVEsQ0FBQ29GLFlBQVQsR0FBd0I7QUFDdEJuRixFQUFBQSxhQUFhLEVBQUUsR0FETztBQUV0QkMsRUFBQUEsUUFBUSxFQUFFbUYsU0FGWTtBQUd0QmxGLEVBQUFBLFFBQVEsRUFBRSxFQUhZO0FBSXRCRSxFQUFBQSxLQUFLLEVBQUVnRixTQUplO0FBS3RCL0UsRUFBQUEscUJBQXFCLEVBQUUsUUFMRDtBQU10QmpCLEVBQUFBLElBQUksRUFBRWdHLFNBTmdCO0FBT3RCOUUsRUFBQUEsS0FBSyxFQUFFOEUsU0FQZTtBQVF0QjdFLEVBQUFBLFFBQVEsRUFBRS9CO0FBUlksQ0FBeEI7QUFXQXVCLFFBQVEsQ0FBQ3NGLFNBQVQsR0FBcUI7QUFDbkJyRixFQUFBQSxhQUFhLEVBQUUxQyxTQUFTLENBQUNnSSxNQUROO0FBRW5CckYsRUFBQUEsUUFBUSxFQUFFM0MsU0FBUyxDQUFDaUksR0FGRDtBQUduQnJGLEVBQUFBLFFBQVEsRUFBRTVDLFNBQVMsQ0FBQ2dJLE1BSEQ7QUFJbkJsRixFQUFBQSxLQUFLLEVBQUU5QyxTQUFTLENBQUNrSSxJQUpFO0FBS25CbkYsRUFBQUEscUJBQXFCLEVBQUUvQyxTQUFTLENBQUNtSSxLQUFWLENBQWdCLENBQUMsTUFBRCxFQUFTLFFBQVQsQ0FBaEIsQ0FMSjtBQU1uQnJHLEVBQUFBLElBQUksRUFBRTlCLFNBQVMsQ0FBQ21JLEtBQVYsQ0FBZ0IsQ0FBQyxRQUFELEVBQVcsS0FBWCxDQUFoQixDQU5hO0FBT25CbkYsRUFBQUEsS0FBSyxFQUFFaEQsU0FBUyxDQUFDb0ksTUFQRTtBQVFuQm5GLEVBQUFBLFFBQVEsRUFBRWpELFNBQVMsQ0FBQ3FJO0FBUkQsQ0FBckI7QUFXQSxlQUFlNUYsUUFBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVFbW90aW9uIGZyb20gJ0BlbW90aW9uL2Nzcy9jcmVhdGUtaW5zdGFuY2UnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgY3JlYXRlQ1NTS2V5IGZyb20gJy4uL2NyZWF0ZUNTU0tleSc7XG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnLi4vdXRpbHMvZGVidWcnO1xuaW1wb3J0IEV2ZW50U3B5IGZyb20gJy4uL0V2ZW50U3B5JztcbmltcG9ydCBGdW5jdGlvbkNvbnRleHQgZnJvbSAnLi9GdW5jdGlvbkNvbnRleHQnO1xuaW1wb3J0IEludGVybmFsQ29udGV4dCBmcm9tICcuL0ludGVybmFsQ29udGV4dCc7XG5pbXBvcnQgU3BpbmVUbyBmcm9tICcuLi9TcGluZVRvJztcbmltcG9ydCBTdGF0ZTFDb250ZXh0IGZyb20gJy4vU3RhdGUxQ29udGV4dCc7XG5pbXBvcnQgU3RhdGUyQ29udGV4dCBmcm9tICcuL1N0YXRlMkNvbnRleHQnO1xuaW1wb3J0IFN0YXRlQ29udGV4dCBmcm9tICcuL1N0YXRlQ29udGV4dCc7XG5pbXBvcnQgc3R5bGVDb25zb2xlIGZyb20gJy4uL3V0aWxzL3N0eWxlQ29uc29sZSc7XG5pbXBvcnQgdXNlU3RhdGVSZWYgZnJvbSAnLi4vaG9va3MvaW50ZXJuYWwvdXNlU3RhdGVSZWYnO1xuXG5jb25zdCBERUZBVUxUX1NDUk9MTEVSID0gKCkgPT4gSW5maW5pdHk7XG5jb25zdCBNSU5fQ0hFQ0tfSU5URVJWQUwgPSAxNzsgLy8gMSBmcmFtZVxuY29uc3QgTU9ERV9CT1RUT00gPSAnYm90dG9tJztcbmNvbnN0IE1PREVfVE9QID0gJ3RvcCc7XG5jb25zdCBORUFSX0VORF9USFJFU0hPTEQgPSAxO1xuY29uc3QgU0NST0xMX0RFQ0lTSU9OX0RVUkFUSU9OID0gMzQ7IC8vIDIgZnJhbWVzXG5cbi8vIFdlIHBvb2wgdGhlIGVtb3Rpb24gb2JqZWN0IGJ5IG5vbmNlLlxuLy8gVGhpcyBpcyB0byBtYWtlIHN1cmUgd2UgZG9uJ3QgZ2VuZXJhdGUgdG9vIG1hbnkgdW5uZWVkZWQgPHN0eWxlPiB0YWdzLlxuY29uc3QgZW1vdGlvblBvb2wgPSB7fTtcblxuZnVuY3Rpb24gc2V0SW1tZWRpYXRlSW50ZXJ2YWwoZm4sIG1zKSB7XG4gIGZuKCk7XG5cbiAgcmV0dXJuIHNldEludGVydmFsKGZuLCBtcyk7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVWaWV3U3RhdGUoeyBtb2RlLCB0YXJnZXQ6IHsgb2Zmc2V0SGVpZ2h0LCBzY3JvbGxIZWlnaHQsIHNjcm9sbFRvcCB9IH0pIHtcbiAgY29uc3QgYXRCb3R0b20gPSBzY3JvbGxIZWlnaHQgLSBzY3JvbGxUb3AgLSBvZmZzZXRIZWlnaHQgPCBORUFSX0VORF9USFJFU0hPTEQ7XG4gIGNvbnN0IGF0VG9wID0gc2Nyb2xsVG9wIDwgTkVBUl9FTkRfVEhSRVNIT0xEO1xuXG4gIGNvbnN0IGF0RW5kID0gbW9kZSA9PT0gTU9ERV9UT1AgPyBhdFRvcCA6IGF0Qm90dG9tO1xuICBjb25zdCBhdFN0YXJ0ID0gbW9kZSAhPT0gTU9ERV9UT1AgPyBhdFRvcCA6IGF0Qm90dG9tO1xuXG4gIHJldHVybiB7XG4gICAgYXRCb3R0b20sXG4gICAgYXRFbmQsXG4gICAgYXRTdGFydCxcbiAgICBhdFRvcFxuICB9O1xufVxuXG5mdW5jdGlvbiBpc0VuZChhbmltYXRlVG8sIG1vZGUpIHtcbiAgcmV0dXJuIGFuaW1hdGVUbyA9PT0gKG1vZGUgPT09IE1PREVfVE9QID8gMCA6ICcxMDAlJyk7XG59XG5cbmNvbnN0IENvbXBvc2VyID0gKHtcbiAgY2hlY2tJbnRlcnZhbCxcbiAgY2hpbGRyZW4sXG4gIGRlYm91bmNlLFxuICBkZWJ1ZzogZGVidWdGcm9tUHJvcCxcbiAgaW5pdGlhbFNjcm9sbEJlaGF2aW9yLFxuICBtb2RlLFxuICBub25jZSxcbiAgc2Nyb2xsZXJcbn0pID0+IHtcbiAgY29uc3QgZGVidWcgPSB1c2VNZW1vKCgpID0+IGNyZWF0ZURlYnVnKGA8U2Nyb2xsVG9Cb3R0b20+YCwgeyBmb3JjZTogZGVidWdGcm9tUHJvcCB9KSwgW2RlYnVnRnJvbVByb3BdKTtcblxuICBtb2RlID0gbW9kZSA9PT0gTU9ERV9UT1AgPyBNT0RFX1RPUCA6IE1PREVfQk9UVE9NO1xuXG4gIGNvbnN0IGlnbm9yZVNjcm9sbEV2ZW50QmVmb3JlUmVmID0gdXNlUmVmKDApO1xuICBjb25zdCBpbml0aWFsU2Nyb2xsQmVoYXZpb3JSZWYgPSB1c2VSZWYoaW5pdGlhbFNjcm9sbEJlaGF2aW9yKTtcbiAgY29uc3QgW2FuaW1hdGVUbywgc2V0QW5pbWF0ZVRvLCBhbmltYXRlVG9SZWZdID0gdXNlU3RhdGVSZWYobW9kZSA9PT0gTU9ERV9UT1AgPyAwIDogJzEwMCUnKTtcbiAgY29uc3QgW3RhcmdldCwgc2V0VGFyZ2V0LCB0YXJnZXRSZWZdID0gdXNlU3RhdGVSZWYobnVsbCk7XG5cbiAgLy8gSW50ZXJuYWwgY29udGV4dFxuICBjb25zdCBhbmltYXRlRnJvbVJlZiA9IHVzZVJlZigwKTtcbiAgY29uc3Qgb2Zmc2V0SGVpZ2h0UmVmID0gdXNlUmVmKDApO1xuICBjb25zdCBzY3JvbGxIZWlnaHRSZWYgPSB1c2VSZWYoMCk7XG5cbiAgLy8gU3RhdGUgY29udGV4dFxuICBjb25zdCBbYXRCb3R0b20sIHNldEF0Qm90dG9tXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbYXRFbmQsIHNldEF0RW5kXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbYXRUb3AsIHNldEF0VG9wXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbYXRTdGFydCwgc2V0QXRTdGFydF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzdGlja3ksIHNldFN0aWNreSwgc3RpY2t5UmVmXSA9IHVzZVN0YXRlUmVmKHRydWUpO1xuXG4gIC8vIEhpZ2gtcmF0ZSBzdGF0ZSBjb250ZXh0XG4gIGNvbnN0IHNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzUmVmID0gdXNlUmVmKFtdKTtcbiAgY29uc3Qgb2JzZXJ2ZVNjcm9sbFBvc2l0aW9uID0gdXNlQ2FsbGJhY2soXG4gICAgZm4gPT4ge1xuICAgICAgY29uc3QgeyBjdXJyZW50OiB0YXJnZXQgfSA9IHRhcmdldFJlZjtcblxuICAgICAgc2Nyb2xsUG9zaXRpb25PYnNlcnZlcnNSZWYuY3VycmVudC5wdXNoKGZuKTtcbiAgICAgIHRhcmdldCAmJiBmbih7IHNjcm9sbFRvcDogdGFyZ2V0LnNjcm9sbFRvcCB9KTtcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50OiBzY3JvbGxQb3NpdGlvbk9ic2VydmVycyB9ID0gc2Nyb2xsUG9zaXRpb25PYnNlcnZlcnNSZWY7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc2Nyb2xsUG9zaXRpb25PYnNlcnZlcnMuaW5kZXhPZihmbik7XG5cbiAgICAgICAgfmluZGV4ICYmIHNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9O1xuICAgIH0sXG4gICAgW3Njcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzUmVmLCB0YXJnZXRSZWZdXG4gICk7XG5cbiAgY29uc3QgaGFuZGxlU3BpbmVUb0VuZCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB7IGN1cnJlbnQ6IGFuaW1hdGVUbyB9ID0gYW5pbWF0ZVRvUmVmO1xuXG4gICAgZGVidWcoKCkgPT4gW1xuICAgICAgJyVjU3BpbmVUbyVjOiAlY29uRW5kJWMgaXMgZmlyZWQuJyxcbiAgICAgIC4uLnN0eWxlQ29uc29sZSgnbWFnZW50YScpLFxuICAgICAgLi4uc3R5bGVDb25zb2xlKCdvcmFuZ2UnKSxcbiAgICAgIHsgYW5pbWF0ZVRvIH1cbiAgICBdKTtcblxuICAgIGlnbm9yZVNjcm9sbEV2ZW50QmVmb3JlUmVmLmN1cnJlbnQgPSBEYXRlLm5vdygpO1xuXG4gICAgLy8gaGFuZGxlU2Nyb2xsRW5kIG1heSBlbmQgYXQgYSBwb3NpdGlvbiB3aGljaCBzaG91bGQgbG9zZSBzdGlja2luZXNzLlxuICAgIC8vIEluIHRoYXQgY2FzZSwgd2Ugd2lsbCBuZWVkIHRvIHNldCBzdGlja3kgdG8gZmFsc2UgdG8gc3RvcCB0aGUgaW50ZXJ2YWwgY2hlY2suXG4gICAgLy8gVGVzdCBjYXNlOlxuICAgIC8vIDEuIEFkZCBhIHNjcm9sbGVyIHRoYXQgYWx3YXlzIHJldHVybiAwXG4gICAgLy8gMi4gU2hvdyBhIHBhbmVsIHdpdGggbW9kZSA9PT0gTU9ERV9CT1RUT01cbiAgICAvLyAzLiBQcm9ncmFtbWF0aWNhbGx5IHNjcm9sbCB0byAwIChzZXQgZWxlbWVudC5zY3JvbGxUb3AgPSAwKVxuICAgIC8vIEV4cGVjdGVkOiBpdCBzaG91bGQgbm90IHJlcGV0aXRpdmVseSBjYWxsIHNjcm9sbFRvKDApXG4gICAgLy8gICAgICAgICAgIGl0IHNob3VsZCBzZXQgc3RpY2tpbmVzcyB0byBmYWxzZVxuXG4gICAgaXNFbmQoYW5pbWF0ZVRvLCBtb2RlKSB8fCBzZXRTdGlja3koZmFsc2UpO1xuICAgIHNldEFuaW1hdGVUbyhudWxsKTtcbiAgfSwgW2FuaW1hdGVUb1JlZiwgZGVidWcsIGlnbm9yZVNjcm9sbEV2ZW50QmVmb3JlUmVmLCBtb2RlLCBzZXRBbmltYXRlVG8sIHNldFN0aWNreV0pO1xuXG4gIC8vIEZ1bmN0aW9uIGNvbnRleHRcbiAgY29uc3Qgc2Nyb2xsVG8gPSB1c2VDYWxsYmFjayhcbiAgICAobmV4dEFuaW1hdGVUbywgeyBiZWhhdmlvciB9ID0ge30pID0+IHtcbiAgICAgIGNvbnN0IHsgY3VycmVudDogdGFyZ2V0IH0gPSB0YXJnZXRSZWY7XG5cbiAgICAgIGlmICh0eXBlb2YgbmV4dEFuaW1hdGVUbyAhPT0gJ251bWJlcicgJiYgbmV4dEFuaW1hdGVUbyAhPT0gJzEwMCUnKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ3JlYWN0LXNjcm9sbC10by1ib3R0b206IEFyZ3VtZW50cyBwYXNzZWQgdG8gc2Nyb2xsVG8oKSBtdXN0IGJlIGVpdGhlciBudW1iZXIgb3IgXCIxMDAlXCIuJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0IGlzIHRyeWluZyB0byBzY3JvbGwgdG8gYSBwb3NpdGlvbiB3aGljaCBpcyBub3QgXCJhdEVuZFwiLCBpdCBzaG91bGQgc2V0IHN0aWNreSB0byBmYWxzZSBhZnRlciBzY3JvbGwgZW5kZWQuXG5cbiAgICAgIGRlYnVnKCgpID0+IFtcbiAgICAgICAgW1xuICAgICAgICAgIGAlY3Njcm9sbFRvJWM6IFdpbGwgc2Nyb2xsIHRvICVjJHtcbiAgICAgICAgICAgIHR5cGVvZiBuZXh0QW5pbWF0ZVRvID09PSAnbnVtYmVyJyA/IG5leHRBbmltYXRlVG8gKyAncHgnIDogbmV4dEFuaW1hdGVUby5yZXBsYWNlKC8lL2d1LCAnJSUnKVxuICAgICAgICAgIH0lY2AsXG4gICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdsaW1lJywgJycpLFxuICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJylcbiAgICAgICAgXSxcbiAgICAgICAge1xuICAgICAgICAgIGJlaGF2aW9yLFxuICAgICAgICAgIG5leHRBbmltYXRlVG8sXG4gICAgICAgICAgdGFyZ2V0XG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBpZiAoYmVoYXZpb3IgPT09ICdhdXRvJykge1xuICAgICAgICAvLyBTdG9wIGFueSBleGlzdGluZyBhbmltYXRpb25cbiAgICAgICAgaGFuZGxlU3BpbmVUb0VuZCgpO1xuXG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAvLyBKdW1wIHRvIHRoZSBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgICB0YXJnZXQuc2Nyb2xsVG9wID0gbmV4dEFuaW1hdGVUbyA9PT0gJzEwMCUnID8gdGFyZ2V0LnNjcm9sbEhlaWdodCAtIHRhcmdldC5vZmZzZXRIZWlnaHQgOiBuZXh0QW5pbWF0ZVRvO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiZWhhdmlvciAhPT0gJ3Ntb290aCcgJiZcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAncmVhY3Qtc2Nyb2xsLXRvLWJvdHRvbTogUGxlYXNlIHNldCBcImJlaGF2aW9yXCIgd2hlbiBjYWxsaW5nIFwic2Nyb2xsVG9cIi4gSW4gZnV0dXJlIHZlcnNpb25zLCB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aWxsIGJlIGNoYW5nZWQgZnJvbSBzbW9vdGggc2Nyb2xsaW5nIHRvIGRpc2NyZXRlIHNjcm9sbGluZyB0byBhbGlnbiB3aXRoIEhUTUwgU3RhbmRhcmQuJ1xuICAgICAgICAgICk7XG5cbiAgICAgICAgc2V0QW5pbWF0ZVRvKG5leHRBbmltYXRlVG8pO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGlzIGZvciBoYW5kbGluZyBhIGNhc2UuIFdoZW4gY2FsbGluZyBzY3JvbGxUbygnMTAwJScsIHsgYmVoYXZpb3I6ICdhdXRvJyB9KSBtdWx0aXBsZSB0aW1lcywgaXQgd291bGQgbG9zZSBzdGlja2luZXNzLlxuICAgICAgaWYgKGlzRW5kKG5leHRBbmltYXRlVG8sIG1vZGUpKSB7XG4gICAgICAgIGRlYnVnKCgpID0+IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBgJWNzY3JvbGxUbyVjOiBTY3JvbGxpbmcgdG8gZW5kLCB3aWxsIHNldCBzdGlja3kgdG8gJWN0cnVlJWMuYCxcbiAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgnbGltZScsICcnKSxcbiAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJylcbiAgICAgICAgICBdLFxuICAgICAgICAgIFt7IG1vZGUsIG5leHRBbmltYXRlVG8gfV1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgc2V0U3RpY2t5KHRydWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgW2RlYnVnLCBoYW5kbGVTcGluZVRvRW5kLCBtb2RlLCBzZXRBbmltYXRlVG8sIHNldFN0aWNreSwgdGFyZ2V0UmVmXVxuICApO1xuXG4gIGNvbnN0IHNjcm9sbFRvQm90dG9tID0gdXNlQ2FsbGJhY2soXG4gICAgKHsgYmVoYXZpb3IgfSA9IHt9KSA9PiB7XG4gICAgICBkZWJ1ZygoKSA9PiBbJyVjc2Nyb2xsVG9Cb3R0b20lYzogQ2FsbGVkJywgLi4uc3R5bGVDb25zb2xlKCd5ZWxsb3cnLCAnJyldKTtcblxuICAgICAgYmVoYXZpb3IgIT09ICdzbW9vdGgnICYmXG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAncmVhY3Qtc2Nyb2xsLXRvLWJvdHRvbTogUGxlYXNlIHNldCBcImJlaGF2aW9yXCIgd2hlbiBjYWxsaW5nIFwic2Nyb2xsVG9Cb3R0b21cIi4gSW4gZnV0dXJlIHZlcnNpb25zLCB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aWxsIGJlIGNoYW5nZWQgZnJvbSBzbW9vdGggc2Nyb2xsaW5nIHRvIGRpc2NyZXRlIHNjcm9sbGluZyB0byBhbGlnbiB3aXRoIEhUTUwgU3RhbmRhcmQuJ1xuICAgICAgICApO1xuXG4gICAgICBzY3JvbGxUbygnMTAwJScsIHsgYmVoYXZpb3I6IGJlaGF2aW9yIHx8ICdzbW9vdGgnIH0pO1xuICAgIH0sXG4gICAgW2RlYnVnLCBzY3JvbGxUb11cbiAgKTtcblxuICBjb25zdCBzY3JvbGxUb1RvcCA9IHVzZUNhbGxiYWNrKFxuICAgICh7IGJlaGF2aW9yIH0gPSB7fSkgPT4ge1xuICAgICAgZGVidWcoKCkgPT4gWyclY3Njcm9sbFRvVG9wJWM6IENhbGxlZCcsIC4uLnN0eWxlQ29uc29sZSgneWVsbG93JywgJycpXSk7XG5cbiAgICAgIGJlaGF2aW9yICE9PSAnc21vb3RoJyAmJlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ3JlYWN0LXNjcm9sbC10by1ib3R0b206IFBsZWFzZSBzZXQgXCJiZWhhdmlvclwiIHdoZW4gY2FsbGluZyBcInNjcm9sbFRvVG9wXCIuIEluIGZ1dHVyZSB2ZXJzaW9ucywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igd2lsbCBiZSBjaGFuZ2VkIGZyb20gc21vb3RoIHNjcm9sbGluZyB0byBkaXNjcmV0ZSBzY3JvbGxpbmcgdG8gYWxpZ24gd2l0aCBIVE1MIFN0YW5kYXJkLidcbiAgICAgICAgKTtcblxuICAgICAgc2Nyb2xsVG8oMCwgeyBiZWhhdmlvcjogYmVoYXZpb3IgfHwgJ3Ntb290aCcgfSk7XG4gICAgfSxcbiAgICBbZGVidWcsIHNjcm9sbFRvXVxuICApO1xuXG4gIGNvbnN0IHNjcm9sbFRvRW5kID0gdXNlQ2FsbGJhY2soXG4gICAgKHsgYmVoYXZpb3IgfSA9IHt9KSA9PiB7XG4gICAgICBkZWJ1ZygoKSA9PiBbJyVjc2Nyb2xsVG9FbmQlYzogQ2FsbGVkJywgLi4uc3R5bGVDb25zb2xlKCd5ZWxsb3cnLCAnJyldKTtcblxuICAgICAgYmVoYXZpb3IgIT09ICdzbW9vdGgnICYmXG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAncmVhY3Qtc2Nyb2xsLXRvLWJvdHRvbTogUGxlYXNlIHNldCBcImJlaGF2aW9yXCIgd2hlbiBjYWxsaW5nIFwic2Nyb2xsVG9FbmRcIi4gSW4gZnV0dXJlIHZlcnNpb25zLCB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aWxsIGJlIGNoYW5nZWQgZnJvbSBzbW9vdGggc2Nyb2xsaW5nIHRvIGRpc2NyZXRlIHNjcm9sbGluZyB0byBhbGlnbiB3aXRoIEhUTUwgU3RhbmRhcmQuJ1xuICAgICAgICApO1xuXG4gICAgICBjb25zdCBvcHRpb25zID0geyBiZWhhdmlvcjogYmVoYXZpb3IgfHwgJ3Ntb290aCcgfTtcblxuICAgICAgbW9kZSA9PT0gTU9ERV9UT1AgPyBzY3JvbGxUb1RvcChvcHRpb25zKSA6IHNjcm9sbFRvQm90dG9tKG9wdGlvbnMpO1xuICAgIH0sXG4gICAgW2RlYnVnLCBtb2RlLCBzY3JvbGxUb0JvdHRvbSwgc2Nyb2xsVG9Ub3BdXG4gICk7XG5cbiAgY29uc3Qgc2Nyb2xsVG9TdGFydCA9IHVzZUNhbGxiYWNrKFxuICAgICh7IGJlaGF2aW9yIH0gPSB7fSkgPT4ge1xuICAgICAgZGVidWcoKCkgPT4gWyclY3Njcm9sbFRvU3RhcnQlYzogQ2FsbGVkJywgLi4uc3R5bGVDb25zb2xlKCd5ZWxsb3cnLCAnJyldKTtcblxuICAgICAgYmVoYXZpb3IgIT09ICdzbW9vdGgnICYmXG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAncmVhY3Qtc2Nyb2xsLXRvLWJvdHRvbTogUGxlYXNlIHNldCBcImJlaGF2aW9yXCIgd2hlbiBjYWxsaW5nIFwic2Nyb2xsVG9TdGFydFwiLiBJbiBmdXR1cmUgdmVyc2lvbnMsIHRoZSBkZWZhdWx0IGJlaGF2aW9yIHdpbGwgYmUgY2hhbmdlZCBmcm9tIHNtb290aCBzY3JvbGxpbmcgdG8gZGlzY3JldGUgc2Nyb2xsaW5nIHRvIGFsaWduIHdpdGggSFRNTCBTdGFuZGFyZC4nXG4gICAgICAgICk7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGJlaGF2aW9yOiBiZWhhdmlvciB8fCAnc21vb3RoJyB9O1xuXG4gICAgICBtb2RlID09PSBNT0RFX1RPUCA/IHNjcm9sbFRvQm90dG9tKG9wdGlvbnMpIDogc2Nyb2xsVG9Ub3Aob3B0aW9ucyk7XG4gICAgfSxcbiAgICBbZGVidWcsIG1vZGUsIHNjcm9sbFRvQm90dG9tLCBzY3JvbGxUb1RvcF1cbiAgKTtcblxuICBjb25zdCBzY3JvbGxUb1N0aWNreSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB7IGN1cnJlbnQ6IHRhcmdldCB9ID0gdGFyZ2V0UmVmO1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgaWYgKGluaXRpYWxTY3JvbGxCZWhhdmlvclJlZi5jdXJyZW50ID09PSAnYXV0bycpIHtcbiAgICAgICAgZGVidWcoKCkgPT4gW2AlY3RhcmdldCBjaGFuZ2VkJWM6IEluaXRpYWwgc2Nyb2xsYCwgLi4uc3R5bGVDb25zb2xlKCdibHVlJyldKTtcblxuICAgICAgICB0YXJnZXQuc2Nyb2xsVG9wID0gbW9kZSA9PT0gTU9ERV9UT1AgPyAwIDogdGFyZ2V0LnNjcm9sbEhlaWdodCAtIHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGluaXRpYWxTY3JvbGxCZWhhdmlvclJlZi5jdXJyZW50ID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIGlzIHZlcnkgc2ltaWxhciB0byBzY3JvbGxUb0VuZCgpLlxuICAgICAgLy8gSW5zdGVhZCBvZiBzY3JvbGxpbmcgdG8gZW5kLCBpdCB3aWxsIGNhbGwgcHJvcHMuc2Nyb2xsZXIoKSB0byBkZXRlcm1pbmVzIGhvdyBmYXIgaXQgc2hvdWxkIHNjcm9sbC5cbiAgICAgIC8vIFRoaXMgZnVuY3Rpb24gY291bGQgYmUgY2FsbGVkIHdoaWxlIGl0IGlzIGF1dG8tc2Nyb2xsaW5nLlxuXG4gICAgICBjb25zdCB7IGN1cnJlbnQ6IGFuaW1hdGVGcm9tIH0gPSBhbmltYXRlRnJvbVJlZjtcbiAgICAgIGNvbnN0IHsgb2Zmc2V0SGVpZ2h0LCBzY3JvbGxIZWlnaHQsIHNjcm9sbFRvcCB9ID0gdGFyZ2V0O1xuXG4gICAgICBjb25zdCBtYXhWYWx1ZSA9IG1vZGUgPT09IE1PREVfVE9QID8gMCA6IE1hdGgubWF4KDAsIHNjcm9sbEhlaWdodCAtIG9mZnNldEhlaWdodCAtIHNjcm9sbFRvcCk7XG4gICAgICBjb25zdCBtaW5WYWx1ZSA9IE1hdGgubWF4KDAsIGFuaW1hdGVGcm9tIC0gc2Nyb2xsVG9wKTtcblxuICAgICAgY29uc3QgcmF3TmV4dFZhbHVlID0gc2Nyb2xsZXIoeyBtYXhWYWx1ZSwgbWluVmFsdWUsIG9mZnNldEhlaWdodCwgc2Nyb2xsSGVpZ2h0LCBzY3JvbGxUb3AgfSk7XG5cbiAgICAgIGNvbnN0IG5leHRWYWx1ZSA9IE1hdGgubWF4KDAsIE1hdGgubWluKG1heFZhbHVlLCByYXdOZXh0VmFsdWUpKTtcblxuICAgICAgbGV0IG5leHRBbmltYXRlVG87XG5cbiAgICAgIGlmIChtb2RlID09PSBNT0RFX1RPUCB8fCBuZXh0VmFsdWUgIT09IG1heFZhbHVlKSB7XG4gICAgICAgIG5leHRBbmltYXRlVG8gPSBzY3JvbGxUb3AgKyBuZXh0VmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXaGVuIHNjcm9sbGluZyB0byBib3R0b20sIHdlIHNob3VsZCBzY3JvbGwgdG8gXCIxMDAlXCIuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgaWYgd2Ugc2Nyb2xsIHRvIGFueSBudW1iZXIsIGl0IHdpbGwgbG9zZSBzdGlja2luZXNzIHdoZW4gZWxlbWVudHMgYXJlIGFkZGluZyB0b28gZmFzdC5cbiAgICAgICAgLy8gXCIxMDAlXCIgaXMgYSBzcGVjaWFsIGFyZ3VtZW50IGludGVuZGVkIHRvIG1ha2Ugc3VyZSBzdGlja2luZXNzIGlzIG5vdCBsb3N0IHdoaWxlIG5ldyBlbGVtZW50cyBhcmUgYmVpbmcgYWRkZWQuXG4gICAgICAgIG5leHRBbmltYXRlVG8gPSAnMTAwJSc7XG4gICAgICB9XG5cbiAgICAgIGRlYnVnKCgpID0+IFtcbiAgICAgICAgW1xuICAgICAgICAgIGAlY3Njcm9sbFRvU3RpY2t5JWM6IFdpbGwgYW5pbWF0ZSBmcm9tICVjJHthbmltYXRlRnJvbX1weCVjIHRvICVjJHtcbiAgICAgICAgICAgIHR5cGVvZiBuZXh0QW5pbWF0ZVRvID09PSAnbnVtYmVyJyA/IG5leHRBbmltYXRlVG8gKyAncHgnIDogbmV4dEFuaW1hdGVUby5yZXBsYWNlKC8lL2d1LCAnJSUnKVxuICAgICAgICAgIH0lYyAoJWMkeyhuZXh0QW5pbWF0ZVRvID09PSAnMTAwJScgPyBtYXhWYWx1ZSA6IG5leHRBbmltYXRlVG8pICsgYW5pbWF0ZUZyb219cHglYylgLFxuICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgnb3JhbmdlJyksXG4gICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKSxcbiAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpLFxuICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJylcbiAgICAgICAgXSxcbiAgICAgICAge1xuICAgICAgICAgIGFuaW1hdGVGcm9tLFxuICAgICAgICAgIG1heFZhbHVlLFxuICAgICAgICAgIG1pblZhbHVlLFxuICAgICAgICAgIG5leHRBbmltYXRlVG8sXG4gICAgICAgICAgbmV4dFZhbHVlLFxuICAgICAgICAgIG9mZnNldEhlaWdodCxcbiAgICAgICAgICByYXdOZXh0VmFsdWUsXG4gICAgICAgICAgc2Nyb2xsSGVpZ2h0LFxuICAgICAgICAgIHNjcm9sbFRvcFxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgc2Nyb2xsVG8obmV4dEFuaW1hdGVUbywgeyBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgfVxuICB9LCBbYW5pbWF0ZUZyb21SZWYsIGRlYnVnLCBtb2RlLCBzY3JvbGxlciwgc2Nyb2xsVG8sIHRhcmdldFJlZl0pO1xuXG4gIGNvbnN0IGhhbmRsZVNjcm9sbCA9IHVzZUNhbGxiYWNrKFxuICAgICh7IHRpbWVTdGFtcExvdyB9KSA9PiB7XG4gICAgICBjb25zdCB7IGN1cnJlbnQ6IGFuaW1hdGVUbyB9ID0gYW5pbWF0ZVRvUmVmO1xuICAgICAgY29uc3QgeyBjdXJyZW50OiB0YXJnZXQgfSA9IHRhcmdldFJlZjtcblxuICAgICAgY29uc3QgYW5pbWF0aW5nID0gYW5pbWF0ZVRvICE9PSBudWxsO1xuXG4gICAgICAvLyBDdXJyZW50bHksIHRoZXJlIGFyZSBubyByZWxpYWJsZSB3YXkgdG8gY2hlY2sgaWYgdGhlIFwic2Nyb2xsXCIgZXZlbnQgaXMgdHJpZ2dlciBkdWUgdG9cbiAgICAgIC8vIHVzZXIgZ2VzdHVyZSwgcHJvZ3JhbW1hdGljIHNjcm9sbGluZywgb3IgQ2hyb21lLXN5bnRoZXNpemVkIFwic2Nyb2xsXCIgZXZlbnQgdG8gY29tcGVuc2F0ZSBzaXplIGNoYW5nZS5cbiAgICAgIC8vIFRodXMsIHdlIHVzZSBvdXIgYmVzdC1lZmZvcnQgdG8gZ3Vlc3MgaWYgaXQgaXMgdHJpZ2dlcmVkIGJ5IHVzZXIgZ2VzdHVyZSwgYW5kIGRpc2FibGUgc3RpY2t5IGlmIGl0IGlzIGhlYWRpbmcgdG93YXJkcyB0aGUgc3RhcnQgZGlyZWN0aW9uLlxuXG4gICAgICBpZiAodGltZVN0YW1wTG93IDw9IGlnbm9yZVNjcm9sbEV2ZW50QmVmb3JlUmVmLmN1cnJlbnQgfHwgIXRhcmdldCkge1xuICAgICAgICAvLyBTaW5jZSB3ZSBkZWJvdW5jZSBcInNjcm9sbFwiIGV2ZW50LCB0aGlzIGhhbmRsZXIgbWlnaHQgYmUgY2FsbGVkIGFmdGVyIHNwaW5lVG8ub25FbmQgKGEuay5hLiBhcnRpZmljaWFsIHNjcm9sbGluZykuXG4gICAgICAgIC8vIFdlIHNob3VsZCBpZ25vcmUgZGVib3VuY2VkIGV2ZW50IGZpcmVkIGFmdGVyIHNjcm9sbEVuZCwgYmVjYXVzZSB3aXRob3V0IHNraXBwaW5nIHRoZW0sIHRoZSB1c2VySW5pdGlhdGVkU2Nyb2xsIGNhbGN1bGF0ZWQgYmVsb3cgd2lsbCBub3QgYmUgYWNjdXJhdGUuXG4gICAgICAgIC8vIFRodXMsIG9uIGEgZmFzdCBtYWNoaW5lLCBhZGRpbmcgZWxlbWVudHMgc3VwZXIgZmFzdCB3aWxsIGxvc2UgdGhlIFwic3RpY2tpbmVzc1wiLlxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBhdEJvdHRvbSwgYXRFbmQsIGF0U3RhcnQsIGF0VG9wIH0gPSBjb21wdXRlVmlld1N0YXRlKHsgbW9kZSwgdGFyZ2V0IH0pO1xuXG4gICAgICBzZXRBdEJvdHRvbShhdEJvdHRvbSk7XG4gICAgICBzZXRBdEVuZChhdEVuZCk7XG4gICAgICBzZXRBdFN0YXJ0KGF0U3RhcnQpO1xuICAgICAgc2V0QXRUb3AoYXRUb3ApO1xuXG4gICAgICAvLyBDaHJvbWUgd2lsbCBlbWl0IFwic3ludGhldGljXCIgc2Nyb2xsIGV2ZW50IGlmIHRoZSBjb250YWluZXIgaXMgcmVzaXplZCBvciBhbiBlbGVtZW50IGlzIGFkZGVkXG4gICAgICAvLyBXZSBuZWVkIHRvIGlnbm9yZSB0aGVzZSBcInN5bnRoZXRpY1wiIGV2ZW50c1xuICAgICAgLy8gUmVwcm86IEluIHBsYXlncm91bmQsIHByZXNzIDQtMS01LTEtMSAoc21hbGwsIGFkZCBvbmUsIG5vcm1hbCwgYWRkIG9uZSwgYWRkIG9uZSlcbiAgICAgIC8vICAgICAgICBOb21hdHRlciBob3cgZmFzdCBvciBzbG93IHRoZSBzZXF1ZW5jZSBpcyBiZWluZyBwcmVzc2VkLCBpdCBzaG91bGQgc3RpbGwgc3RpY2sgdG8gdGhlIGJvdHRvbVxuICAgICAgY29uc3QgeyBvZmZzZXRIZWlnaHQ6IG5leHRPZmZzZXRIZWlnaHQsIHNjcm9sbEhlaWdodDogbmV4dFNjcm9sbEhlaWdodCB9ID0gdGFyZ2V0O1xuICAgICAgY29uc3QgeyBjdXJyZW50OiBvZmZzZXRIZWlnaHQgfSA9IG9mZnNldEhlaWdodFJlZjtcbiAgICAgIGNvbnN0IHsgY3VycmVudDogc2Nyb2xsSGVpZ2h0IH0gPSBzY3JvbGxIZWlnaHRSZWY7XG4gICAgICBjb25zdCBvZmZzZXRIZWlnaHRDaGFuZ2VkID0gbmV4dE9mZnNldEhlaWdodCAhPT0gb2Zmc2V0SGVpZ2h0O1xuICAgICAgY29uc3Qgc2Nyb2xsSGVpZ2h0Q2hhbmdlZCA9IG5leHRTY3JvbGxIZWlnaHQgIT09IHNjcm9sbEhlaWdodDtcblxuICAgICAgaWYgKG9mZnNldEhlaWdodENoYW5nZWQpIHtcbiAgICAgICAgb2Zmc2V0SGVpZ2h0UmVmLmN1cnJlbnQgPSBuZXh0T2Zmc2V0SGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsSGVpZ2h0Q2hhbmdlZCkge1xuICAgICAgICBzY3JvbGxIZWlnaHRSZWYuY3VycmVudCA9IG5leHRTY3JvbGxIZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIC8vIFN0aWNreSBtZWFuczpcbiAgICAgIC8vIC0gSWYgaXQgaXMgc2Nyb2xsZWQgcHJvZ3JhbWF0aWNhbGx5LCB3ZSBhcmUgc3RpbGwgaW4gc3RpY2t5IG1vZGVcbiAgICAgIC8vIC0gSWYgaXQgaXMgc2Nyb2xsZWQgYnkgdGhlIHVzZXIsIHRoZW4gc3RpY2t5IG1lYW5zIGlmIHdlIGFyZSBhdCB0aGUgZW5kXG5cbiAgICAgIC8vIE9ubHkgdXBkYXRlIHN0aWNraW5lc3MgaWYgdGhlIHNjcm9sbCBldmVudCBpcyBub3QgZHVlIHRvIHN5bnRoZXRpYyBzY3JvbGwgZG9uZSBieSBDaHJvbWVcbiAgICAgIGlmICghb2Zmc2V0SGVpZ2h0Q2hhbmdlZCAmJiAhc2Nyb2xsSGVpZ2h0Q2hhbmdlZCkge1xuICAgICAgICAvLyBXZSBhcmUgc3RpY2t5IGlmIHdlIGFyZSBhbmltYXRpbmcgdG8gdGhlIGVuZCwgb3Igd2UgYXJlIGFscmVhZHkgYXQgdGhlIGVuZC5cbiAgICAgICAgLy8gV2UgY2FuIGJlIFwiYW5pbWF0aW5nIGJ1dCBub3Qgc3RpY2t5XCIgYnkgY2FsbGluZyBcInNjcm9sbFRvKDEwMClcIiB3aGVyZSB0aGUgY29udGFpbmVyIHNjcm9sbEhlaWdodCBpcyAyMDBweC5cbiAgICAgICAgY29uc3QgbmV4dFN0aWNreSA9IChhbmltYXRpbmcgJiYgaXNFbmQoYW5pbWF0ZVRvLCBtb2RlKSkgfHwgYXRFbmQ7XG5cbiAgICAgICAgaWYgKHN0aWNreVJlZi5jdXJyZW50ICE9PSBuZXh0U3RpY2t5KSB7XG4gICAgICAgICAgZGVidWcoKCkgPT4gW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBgJWNvblNjcm9sbCVjOiAlY3NldFN0aWNreSVjKCVjJHtuZXh0U3RpY2t5fSVjKWAsXG4gICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncmVkJyksXG4gICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncmVkJyksXG4gICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJylcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIGAoYW5pbWF0aW5nID0gJWMke2FuaW1hdGluZ30lYyAmJiBpc0VuZCA9ICVjJHtpc0VuZChhbmltYXRlVG8sIG1vZGUpfSVjKSB8fCBhdEVuZCA9ICVjJHthdEVuZH0lY2AsXG4gICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJyksXG4gICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJyksXG4gICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJyksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpbmcsXG4gICAgICAgICAgICAgICAgYW5pbWF0ZVRvLFxuICAgICAgICAgICAgICAgIGF0RW5kLFxuICAgICAgICAgICAgICAgIG1vZGUsXG4gICAgICAgICAgICAgICAgb2Zmc2V0SGVpZ2h0OiB0YXJnZXQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgICAgIHNjcm9sbEhlaWdodDogdGFyZ2V0LnNjcm9sbEhlaWdodCxcbiAgICAgICAgICAgICAgICBzdGlja3k6IHN0aWNreVJlZi5jdXJyZW50LFxuICAgICAgICAgICAgICAgIG5leHRTdGlja3lcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgc2V0U3RpY2t5KG5leHRTdGlja3kpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHN0aWNreVJlZi5jdXJyZW50KSB7XG4gICAgICAgIGRlYnVnKCgpID0+IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBgJWNvblNjcm9sbCVjOiBTaXplIGNoYW5nZWQgd2hpbGUgc3RpY2t5LCBjYWxsaW5nICVjc2Nyb2xsVG9TdGlja3koKSVjYCxcbiAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncmVkJyksXG4gICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ29yYW5nZScpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvZmZzZXRIZWlnaHRDaGFuZ2VkLFxuICAgICAgICAgICAgICBzY3JvbGxIZWlnaHRDaGFuZ2VkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuZXh0T2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgcHJldk9mZnNldEhlaWdodDogb2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgbmV4dFNjcm9sbEhlaWdodCxcbiAgICAgICAgICAgIHByZXZTY3JvbGxIZWlnaHQ6IHNjcm9sbEhlaWdodFxuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG5cbiAgICAgICAgc2Nyb2xsVG9TdGlja3koKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyBzY3JvbGxUb3A6IGFjdHVhbFNjcm9sbFRvcCB9ID0gdGFyZ2V0O1xuXG4gICAgICBzY3JvbGxQb3NpdGlvbk9ic2VydmVyc1JlZi5jdXJyZW50LmZvckVhY2gob2JzZXJ2ZXIgPT4gb2JzZXJ2ZXIoeyBzY3JvbGxUb3A6IGFjdHVhbFNjcm9sbFRvcCB9KSk7XG4gICAgfSxcbiAgICBbXG4gICAgICBhbmltYXRlVG9SZWYsXG4gICAgICBkZWJ1ZyxcbiAgICAgIGlnbm9yZVNjcm9sbEV2ZW50QmVmb3JlUmVmLFxuICAgICAgbW9kZSxcbiAgICAgIG9mZnNldEhlaWdodFJlZixcbiAgICAgIHNjcm9sbEhlaWdodFJlZixcbiAgICAgIHNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzUmVmLFxuICAgICAgc2Nyb2xsVG9TdGlja3ksXG4gICAgICBzZXRBdEJvdHRvbSxcbiAgICAgIHNldEF0RW5kLFxuICAgICAgc2V0QXRTdGFydCxcbiAgICAgIHNldEF0VG9wLFxuICAgICAgc2V0U3RpY2t5LFxuICAgICAgc3RpY2t5UmVmLFxuICAgICAgdGFyZ2V0UmVmXG4gICAgXVxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgbGV0IHN0aWNreUJ1dE5vdEF0RW5kU2luY2UgPSBmYWxzZTtcblxuICAgICAgY29uc3QgdGltZW91dCA9IHNldEltbWVkaWF0ZUludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50OiB0YXJnZXQgfSA9IHRhcmdldFJlZjtcbiAgICAgICAgY29uc3QgYW5pbWF0aW5nID0gYW5pbWF0ZVRvUmVmLmN1cnJlbnQgIT09IG51bGw7XG5cbiAgICAgICAgaWYgKHN0aWNreVJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgaWYgKCFjb21wdXRlVmlld1N0YXRlKHsgbW9kZSwgdGFyZ2V0IH0pLmF0RW5kKSB7XG4gICAgICAgICAgICBpZiAoIXN0aWNreUJ1dE5vdEF0RW5kU2luY2UpIHtcbiAgICAgICAgICAgICAgc3RpY2t5QnV0Tm90QXRFbmRTaW5jZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKERhdGUubm93KCkgLSBzdGlja3lCdXROb3RBdEVuZFNpbmNlID4gU0NST0xMX0RFQ0lTSU9OX0RVUkFUSU9OKSB7XG4gICAgICAgICAgICAgIC8vIFF1aXJrczogSW4gRmlyZWZveCwgYWZ0ZXIgdXNlciBzY3JvbGwgZG93biwgRmlyZWZveCBkbyB0d28gdGhpbmdzOlxuICAgICAgICAgICAgICAvLyAgICAgICAgIDEuIFNldCB0byBhIG5ldyBcInNjcm9sbFRvcFwiXG4gICAgICAgICAgICAgIC8vICAgICAgICAgMi4gRmlyZSBcInNjcm9sbFwiIGV2ZW50XG4gICAgICAgICAgICAgIC8vICAgICAgICAgRm9yIHdoYXQgd2Ugb2JzZXJ2ZWQsICMxIGlzIGZpcmVkIGFib3V0IDIwbXMgYmVmb3JlICMyLiBUaGVyZSBpcyBhIGNoYW5jZSB0aGF0IHRoaXMgc3RpY2t5Q2hlY2tUaW1lb3V0IGlzIGJlaW5nIHNjaGVkdWxlZCBiZXR3ZWVuIDEgYW5kIDIuXG4gICAgICAgICAgICAgIC8vICAgICAgICAgVGhhdCBtZWFucywgaWYgd2UganVzdCBsb29rIGF0ICMxIHRvIGRlY2lkZSBpZiB3ZSBzaG91bGQgc2Nyb2xsLCB3ZSB3aWxsIGFsd2F5cyBzY3JvbGwsIGluIG9wcG9zZSB0byB0aGUgdXNlcidzIGludGVudGlvbi5cbiAgICAgICAgICAgICAgLy8gUmVwcm86IE9wZW4gRmlyZWZveCwgc2V0IGNoZWNrSW50ZXJ2YWwgdG8gYSBsb3dlciBudW1iZXIsIGFuZCB0cnkgdG8gc2Nyb2xsIGJ5IGRyYWdnaW5nIHRoZSBzY3JvbGwgaGFuZGxlci4gSXQgd2lsbCBqdW1wIGJhY2suXG5cbiAgICAgICAgICAgICAgLy8gVGhlIFwiYW5pbWF0aW5nXCIgY2hlY2sgd2lsbCBtYWtlIHN1cmUgc3RpY2tpbmVzcyBpcyBub3QgbG9zdCB3aGVuIGVsZW1lbnRzIGFyZSBhZGRpbmcgYXQgYSB2ZXJ5IGZhc3QgcGFjZS5cbiAgICAgICAgICAgICAgaWYgKCFhbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlRnJvbVJlZi5jdXJyZW50ID0gdGFyZ2V0LnNjcm9sbFRvcDtcblxuICAgICAgICAgICAgICAgIGRlYnVnKCgpID0+IFtcbiAgICAgICAgICAgICAgICAgIGAlY0ludGVydmFsIGNoZWNrJWM6IFNob3VsZCBzdGlja3kgYnV0IG5vdCBhdCBlbmQsIGNhbGxpbmcgJWNzY3JvbGxUb1N0aWNreSgpJWMgdG8gc2Nyb2xsYCxcbiAgICAgICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgnbmF2eScpLFxuICAgICAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdvcmFuZ2UnKVxuICAgICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9TdGlja3koKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHN0aWNreUJ1dE5vdEF0RW5kU2luY2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RpY2t5QnV0Tm90QXRFbmRTaW5jZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuc2Nyb2xsSGVpZ2h0IDw9IHRhcmdldC5vZmZzZXRIZWlnaHQgJiYgIXN0aWNreVJlZi5jdXJyZW50KSB7XG4gICAgICAgICAgLy8gV2hlbiB0aGUgY29udGFpbmVyIGlzIGVtcHRpZWQsIHdlIHdpbGwgc2V0IHN0aWNreSBiYWNrIHRvIHRydWUuXG5cbiAgICAgICAgICBkZWJ1ZygoKSA9PiBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIGAlY0ludGVydmFsIGNoZWNrJWM6IENvbnRhaW5lciBpcyBlbXB0aWVkLCBzZXR0aW5nIHN0aWNreSBiYWNrIHRvICVjdHJ1ZSVjYCxcbiAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCduYXZ5JyksXG4gICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJylcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvZmZzZXRIZWlnaHQ6IHRhcmdldC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICAgICAgc2Nyb2xsSGVpZ2h0OiB0YXJnZXQuc2Nyb2xsSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHN0aWNreTogc3RpY2t5UmVmLmN1cnJlbnRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgc2V0U3RpY2t5KHRydWUpO1xuICAgICAgICB9XG4gICAgICB9LCBNYXRoLm1heChNSU5fQ0hFQ0tfSU5URVJWQUwsIGNoZWNrSW50ZXJ2YWwpIHx8IE1JTl9DSEVDS19JTlRFUlZBTCk7XG5cbiAgICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKHRpbWVvdXQpO1xuICAgIH1cbiAgfSwgW2FuaW1hdGVUb1JlZiwgY2hlY2tJbnRlcnZhbCwgZGVidWcsIG1vZGUsIHNjcm9sbFRvU3RpY2t5LCBzZXRTdGlja3ksIHN0aWNreVJlZiwgdGFyZ2V0LCB0YXJnZXRSZWZdKTtcblxuICBjb25zdCBzdHlsZVRvQ2xhc3NOYW1lID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgZW1vdGlvbiA9XG4gICAgICBlbW90aW9uUG9vbFtub25jZV0gfHxcbiAgICAgIChlbW90aW9uUG9vbFtub25jZV0gPSBjcmVhdGVFbW90aW9uKHsga2V5OiAncmVhY3Qtc2Nyb2xsLXRvLWJvdHRvbS0tY3NzLScgKyBjcmVhdGVDU1NLZXkoKSwgbm9uY2UgfSkpO1xuXG4gICAgcmV0dXJuIHN0eWxlID0+IGVtb3Rpb24uY3NzKHN0eWxlKSArICcnO1xuICB9LCBbbm9uY2VdKTtcblxuICBjb25zdCBpbnRlcm5hbENvbnRleHQgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBvYnNlcnZlU2Nyb2xsUG9zaXRpb24sXG4gICAgICBzZXRUYXJnZXQsXG4gICAgICBzdHlsZVRvQ2xhc3NOYW1lXG4gICAgfSksXG4gICAgW29ic2VydmVTY3JvbGxQb3NpdGlvbiwgc2V0VGFyZ2V0LCBzdHlsZVRvQ2xhc3NOYW1lXVxuICApO1xuXG4gIGNvbnN0IHN0YXRlMUNvbnRleHQgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBhdEJvdHRvbSxcbiAgICAgIGF0RW5kLFxuICAgICAgYXRTdGFydCxcbiAgICAgIGF0VG9wLFxuICAgICAgbW9kZVxuICAgIH0pLFxuICAgIFthdEJvdHRvbSwgYXRFbmQsIGF0U3RhcnQsIGF0VG9wLCBtb2RlXVxuICApO1xuXG4gIGNvbnN0IHN0YXRlMkNvbnRleHQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBhbmltYXRpbmcgPSBhbmltYXRlVG8gIT09IG51bGw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYW5pbWF0aW5nLFxuICAgICAgYW5pbWF0aW5nVG9FbmQ6IGFuaW1hdGluZyAmJiBpc0VuZChhbmltYXRlVG8sIG1vZGUpLFxuICAgICAgc3RpY2t5XG4gICAgfTtcbiAgfSwgW2FuaW1hdGVUbywgbW9kZSwgc3RpY2t5XSk7XG5cbiAgY29uc3QgY29tYmluZWRTdGF0ZUNvbnRleHQgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICAuLi5zdGF0ZTFDb250ZXh0LFxuICAgICAgLi4uc3RhdGUyQ29udGV4dFxuICAgIH0pLFxuICAgIFtzdGF0ZTFDb250ZXh0LCBzdGF0ZTJDb250ZXh0XVxuICApO1xuXG4gIGNvbnN0IGZ1bmN0aW9uQ29udGV4dCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIHNjcm9sbFRvLFxuICAgICAgc2Nyb2xsVG9Cb3R0b20sXG4gICAgICBzY3JvbGxUb0VuZCxcbiAgICAgIHNjcm9sbFRvU3RhcnQsXG4gICAgICBzY3JvbGxUb1RvcFxuICAgIH0pLFxuICAgIFtzY3JvbGxUbywgc2Nyb2xsVG9Cb3R0b20sIHNjcm9sbFRvRW5kLCBzY3JvbGxUb1N0YXJ0LCBzY3JvbGxUb1RvcF1cbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFdlIG5lZWQgdG8gdXBkYXRlIHRoZSBcInNjcm9sbEhlaWdodFwiIHZhbHVlIHRvIGxhdGVzdCB3aGVuIHRoZSB1c2VyIGRvIGEgZm9jdXMgaW5zaWRlIHRoZSBib3guXG4gICAgLy9cbiAgICAvLyBUaGlzIGlzIGJlY2F1c2U6XG4gICAgLy8gLSBJbiBvdXIgY29kZSB0aGF0IG1pdGlnYXRlIENocm9tZSBzeW50aGV0aWMgc2Nyb2xsaW5nLCB0aGF0IGNvZGUgd2lsbCBsb29rIGF0IHdoZXRoZXIgXCJzY3JvbGxIZWlnaHRcIiB2YWx1ZSBpcyBsYXRlc3Qgb3Igbm90LlxuICAgIC8vIC0gVGhhdCBjb2RlIG9ubHkgcnVuIG9uIFwic2Nyb2xsXCIgZXZlbnQuXG4gICAgLy8gLSBUaGF0IG1lYW5zLCBvbiBldmVyeSBcInNjcm9sbFwiIGV2ZW50LCBpZiB0aGUgXCJzY3JvbGxIZWlnaHRcIiB2YWx1ZSBpcyBub3QgbGF0ZXN0LCB3ZSB3aWxsIHNraXAgbW9kaWZ5aW5nIHRoZSBzdGlja2luZXNzLlxuICAgIC8vIC0gVGhhdCBtZWFucywgaWYgdGhlIHVzZXIgXCJmb2N1c1wiIHRvIGFuIGVsZW1lbnQgdGhhdCBjYXVzZSB0aGUgc2Nyb2xsIHZpZXcgdG8gc2Nyb2xsIHRvIHRoZSBib3R0b20sIHRoZSB1c2VyIGFnZW50IHdpbGwgZmlyZSBcInNjcm9sbFwiIGV2ZW50LlxuICAgIC8vICAgU2luY2UgdGhlIFwic2Nyb2xsSGVpZ2h0XCIgaXMgbm90IGxhdGVzdCB2YWx1ZSwgdGhpcyBcInNjcm9sbFwiIGV2ZW50IHdpbGwgYmUgaWdub3JlZCBhbmQgc3RpY2tpbmVzcyB3aWxsIG5vdCBiZSBtb2RpZmllZC5cbiAgICAvLyAtIFRoYXQgbWVhbnMsIGlmIHRoZSB1c2VyIFwiZm9jdXNcIiB0byBhIG5ld2x5IGFkZGVkIGVsZW1lbnQgdGhhdCBpcyBhdCB0aGUgZW5kIG9mIHRoZSBzY3JvbGwgdmlldywgdGhlIFwic2Nyb2xsIHRvIGJvdHRvbVwiIGJ1dHRvbiB3aWxsIGNvbnRpbnVlIHRvIHNob3cuXG4gICAgLy9cbiAgICAvLyBSZXBybyBpbiBDaHJvbWU6XG4gICAgLy8gMS4gRmlsbCB1cCBhIHNjcm9sbCB2aWV3XG4gICAgLy8gMi4gU2Nyb2xsIHVwLCB0aGUgXCJzY3JvbGwgdG8gYm90dG9tXCIgYnV0dG9uIHNob3VsZCBzaG93IHVwXG4gICAgLy8gMy4gQ2xpY2sgXCJBZGQgYSBidXR0b25cIlxuICAgIC8vIDQuIENsaWNrIG9uIHRoZSBzY3JvbGwgdmlldyAodG8gcHNldWRvLWZvY3VzIG9uIGl0KVxuICAgIC8vIDUuIFByZXNzIFRBQiwgdGhlIHNjcm9sbCB2aWV3IHdpbGwgYmUgYXQgdGhlIGJvdHRvbVxuICAgIC8vXG4gICAgLy8gRXhwZWN0OlxuICAgIC8vIC0gVGhlIFwic2Nyb2xsIHRvIGJvdHRvbVwiIGJ1dHRvbiBzaG91bGQgYmUgZ29uZS5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICBjb25zdCBoYW5kbGVGb2N1cyA9ICgpID0+IHtcbiAgICAgICAgc2Nyb2xsSGVpZ2h0UmVmLmN1cnJlbnQgPSB0YXJnZXQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgfTtcblxuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlRm9jdXMsIHsgY2FwdHVyZTogdHJ1ZSwgcGFzc2l2ZTogdHJ1ZSB9KTtcblxuICAgICAgcmV0dXJuICgpID0+IHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZUZvY3VzKTtcbiAgICB9XG4gIH0sIFt0YXJnZXRdKTtcblxuICBkZWJ1ZygoKSA9PiBbXG4gICAgW2AlY1JlbmRlciVjOiBSZW5kZXJgLCAuLi5zdHlsZUNvbnNvbGUoJ2N5YW4nLCAnJyldLFxuICAgIHtcbiAgICAgIGFuaW1hdGVUbyxcbiAgICAgIGFuaW1hdGluZzogYW5pbWF0ZVRvICE9PSBudWxsLFxuICAgICAgc3RpY2t5LFxuICAgICAgdGFyZ2V0XG4gICAgfVxuICBdKTtcblxuICByZXR1cm4gKFxuICAgIDxJbnRlcm5hbENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2ludGVybmFsQ29udGV4dH0+XG4gICAgICA8RnVuY3Rpb25Db250ZXh0LlByb3ZpZGVyIHZhbHVlPXtmdW5jdGlvbkNvbnRleHR9PlxuICAgICAgICA8U3RhdGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtjb21iaW5lZFN0YXRlQ29udGV4dH0+XG4gICAgICAgICAgPFN0YXRlMUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlMUNvbnRleHR9PlxuICAgICAgICAgICAgPFN0YXRlMkNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3N0YXRlMkNvbnRleHR9PlxuICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgIHt0YXJnZXQgJiYgPEV2ZW50U3B5IGRlYm91bmNlPXtkZWJvdW5jZX0gbmFtZT1cInNjcm9sbFwiIG9uRXZlbnQ9e2hhbmRsZVNjcm9sbH0gdGFyZ2V0PXt0YXJnZXR9IC8+fVxuICAgICAgICAgICAgICB7dGFyZ2V0ICYmIGFuaW1hdGVUbyAhPT0gbnVsbCAmJiAoXG4gICAgICAgICAgICAgICAgPFNwaW5lVG8gbmFtZT1cInNjcm9sbFRvcFwiIG9uRW5kPXtoYW5kbGVTcGluZVRvRW5kfSB0YXJnZXQ9e3RhcmdldH0gdmFsdWU9e2FuaW1hdGVUb30gLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvU3RhdGUyQ29udGV4dC5Qcm92aWRlcj5cbiAgICAgICAgICA8L1N0YXRlMUNvbnRleHQuUHJvdmlkZXI+XG4gICAgICAgIDwvU3RhdGVDb250ZXh0LlByb3ZpZGVyPlxuICAgICAgPC9GdW5jdGlvbkNvbnRleHQuUHJvdmlkZXI+XG4gICAgPC9JbnRlcm5hbENvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59O1xuXG5Db21wb3Nlci5kZWZhdWx0UHJvcHMgPSB7XG4gIGNoZWNrSW50ZXJ2YWw6IDEwMCxcbiAgY2hpbGRyZW46IHVuZGVmaW5lZCxcbiAgZGVib3VuY2U6IDE3LFxuICBkZWJ1ZzogdW5kZWZpbmVkLFxuICBpbml0aWFsU2Nyb2xsQmVoYXZpb3I6ICdzbW9vdGgnLFxuICBtb2RlOiB1bmRlZmluZWQsXG4gIG5vbmNlOiB1bmRlZmluZWQsXG4gIHNjcm9sbGVyOiBERUZBVUxUX1NDUk9MTEVSXG59O1xuXG5Db21wb3Nlci5wcm9wVHlwZXMgPSB7XG4gIGNoZWNrSW50ZXJ2YWw6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuYW55LFxuICBkZWJvdW5jZTogUHJvcFR5cGVzLm51bWJlcixcbiAgZGVidWc6IFByb3BUeXBlcy5ib29sLFxuICBpbml0aWFsU2Nyb2xsQmVoYXZpb3I6IFByb3BUeXBlcy5vbmVPZihbJ2F1dG8nLCAnc21vb3RoJ10pLFxuICBtb2RlOiBQcm9wVHlwZXMub25lT2YoWydib3R0b20nLCAndG9wJ10pLFxuICBub25jZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2Nyb2xsZXI6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb21wb3NlcjtcbiJdfQ==

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(296);
var path = __webpack_require__(3);

var Object = path.Object;

var defineProperty = module.exports = function defineProperty(it, key, desc) {
  return Object.defineProperty(it, key, desc);
};

if (Object.defineProperty.sham) defineProperty.sham = true;


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(25);
var propertyIsEnumerableModule = __webpack_require__(301);
var createPropertyDescriptor = __webpack_require__(151);
var toIndexedObject = __webpack_require__(84);
var toPrimitive = __webpack_require__(152);
var has = __webpack_require__(26);
var IE8_DOM_DEFINE = __webpack_require__(154);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),
/* 151 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(49);

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(48);

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(25);
var fails = __webpack_require__(8);
var createElement = __webpack_require__(155);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var isObject = __webpack_require__(49);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(87);

var functionToString = Function.toString;

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(303);
var global = __webpack_require__(7);
var isObject = __webpack_require__(49);
var createNonEnumerableProperty = __webpack_require__(33);
var objectHas = __webpack_require__(26);
var shared = __webpack_require__(87);
var sharedKey = __webpack_require__(158);
var hiddenKeys = __webpack_require__(89);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (objectHas(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(88);
var uid = __webpack_require__(159);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),
/* 159 */
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(26);
var toIndexedObject = __webpack_require__(84);
var indexOf = __webpack_require__(309).indexOf;
var hiddenKeys = __webpack_require__(89);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(51);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(20);

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(320);
var fails = __webpack_require__(8);
var anObject = __webpack_require__(20);
var toLength = __webpack_require__(161);
var toInteger = __webpack_require__(51);
var requireObjectCoercible = __webpack_require__(48);
var advanceStringIndex = __webpack_require__(324);
var getSubstitution = __webpack_require__(326);
var regExpExec = __webpack_require__(327);
var wellKnownSymbol = __webpack_require__(52);

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      if (
        typeof replaceValue === 'string' &&
        replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1 &&
        replaceValue.indexOf('$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, this, string, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(this);
      var S = String(string);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(321);
var fails = __webpack_require__(8);

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);
var global = __webpack_require__(5);
var userAgent = __webpack_require__(123);

var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      // eslint-disable-next-line no-new-func -- spec requirement
      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
    } : handler, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
$({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global.setInterval)
});


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(6);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(346);

/***/ }),
/* 168 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function memoize(fn) {
  var cache = Object.create(null);
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

/* harmony default export */ __webpack_exports__["a"] = (memoize);


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(396);

/***/ }),
/* 170 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = styleConsole;
function styleConsole(backgroundColor) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'white';
  var styles = "background-color: ".concat(backgroundColor, "; border-radius: 4px; padding: 2px 4px;");

  if (color) {
    styles += " color: ".concat(color, ";");
  }

  return [styles, ''];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9zdHlsZUNvbnNvbGUuanMiXSwibmFtZXMiOlsic3R5bGVDb25zb2xlIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJzdHlsZXMiXSwibWFwcGluZ3MiOiJBQUFBLGVBQWUsU0FBU0EsWUFBVCxDQUFzQkMsZUFBdEIsRUFBd0Q7QUFBQSxNQUFqQkMsS0FBaUIsdUVBQVQsT0FBUztBQUNyRSxNQUFJQyxNQUFNLCtCQUF3QkYsZUFBeEIsNENBQVY7O0FBRUEsTUFBSUMsS0FBSixFQUFXO0FBQ1RDLElBQUFBLE1BQU0sc0JBQWVELEtBQWYsTUFBTjtBQUNEOztBQUVELFNBQU8sQ0FBQ0MsTUFBRCxFQUFTLEVBQVQsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3R5bGVDb25zb2xlKGJhY2tncm91bmRDb2xvciwgY29sb3IgPSAnd2hpdGUnKSB7XG4gIGxldCBzdHlsZXMgPSBgYmFja2dyb3VuZC1jb2xvcjogJHtiYWNrZ3JvdW5kQ29sb3J9OyBib3JkZXItcmFkaXVzOiA0cHg7IHBhZGRpbmc6IDJweCA0cHg7YDtcblxuICBpZiAoY29sb3IpIHtcbiAgICBzdHlsZXMgKz0gYCBjb2xvcjogJHtjb2xvcn07YDtcbiAgfVxuXG4gIHJldHVybiBbc3R5bGVzLCAnJ107XG59XG4iXX0=

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(25);
var defineProperty = __webpack_require__(50).f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),
/* 172 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_classnames__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__InternalContext__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__hooks_internal_useStyleToClassName__ = __webpack_require__(80);





var ROOT_STYLE = {
  height: '100%',
  overflowY: 'auto',
  width: '100%'
};

var Panel = function Panel(_ref) {
  var children = _ref.children,
      className = _ref.className;

  var _useContext = Object(__WEBPACK_IMPORTED_MODULE_2_react__["useContext"])(__WEBPACK_IMPORTED_MODULE_3__InternalContext__["a" /* default */]),
      setTarget = _useContext.setTarget;

  var rootCSS = Object(__WEBPACK_IMPORTED_MODULE_4__hooks_internal_useStyleToClassName__["a" /* default */])()(ROOT_STYLE);
  return /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement("div", {
    className: __WEBPACK_IMPORTED_MODULE_0_classnames___default()(rootCSS, (className || '') + ''),
    ref: setTarget
  }, children);
};

Panel.defaultProps = {
  children: undefined,
  className: undefined
};
Panel.propTypes = {
  children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.any,
  className: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string
};
/* harmony default export */ __webpack_exports__["a"] = (Panel);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9QYW5lbC5qcyJdLCJuYW1lcyI6WyJjbGFzc05hbWVzIiwiUHJvcFR5cGVzIiwiUmVhY3QiLCJ1c2VDb250ZXh0IiwiSW50ZXJuYWxDb250ZXh0IiwidXNlU3R5bGVUb0NsYXNzTmFtZSIsIlJPT1RfU1RZTEUiLCJoZWlnaHQiLCJvdmVyZmxvd1kiLCJ3aWR0aCIsIlBhbmVsIiwiY2hpbGRyZW4iLCJjbGFzc05hbWUiLCJzZXRUYXJnZXQiLCJyb290Q1NTIiwiZGVmYXVsdFByb3BzIiwidW5kZWZpbmVkIiwicHJvcFR5cGVzIiwiYW55Iiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxVQUFQLE1BQXVCLFlBQXZCO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUNBLE9BQU9DLEtBQVAsSUFBZ0JDLFVBQWhCLFFBQWtDLE9BQWxDO0FBRUEsT0FBT0MsZUFBUCxNQUE0QixtQkFBNUI7QUFDQSxPQUFPQyxtQkFBUCxNQUFnQyx1Q0FBaEM7QUFFQSxJQUFNQyxVQUFVLEdBQUc7QUFDakJDLEVBQUFBLE1BQU0sRUFBRSxNQURTO0FBRWpCQyxFQUFBQSxTQUFTLEVBQUUsTUFGTTtBQUdqQkMsRUFBQUEsS0FBSyxFQUFFO0FBSFUsQ0FBbkI7O0FBTUEsSUFBTUMsS0FBSyxHQUFHLFNBQVJBLEtBQVEsT0FBNkI7QUFBQSxNQUExQkMsUUFBMEIsUUFBMUJBLFFBQTBCO0FBQUEsTUFBaEJDLFNBQWdCLFFBQWhCQSxTQUFnQjs7QUFDekMsb0JBQXNCVCxVQUFVLENBQUNDLGVBQUQsQ0FBaEM7QUFBQSxNQUFRUyxTQUFSLGVBQVFBLFNBQVI7O0FBQ0EsTUFBTUMsT0FBTyxHQUFHVCxtQkFBbUIsR0FBR0MsVUFBSCxDQUFuQztBQUVBLHNCQUNFO0FBQUssSUFBQSxTQUFTLEVBQUVOLFVBQVUsQ0FBQ2MsT0FBRCxFQUFVLENBQUNGLFNBQVMsSUFBSSxFQUFkLElBQW9CLEVBQTlCLENBQTFCO0FBQTZELElBQUEsR0FBRyxFQUFFQztBQUFsRSxLQUNHRixRQURILENBREY7QUFLRCxDQVREOztBQVdBRCxLQUFLLENBQUNLLFlBQU4sR0FBcUI7QUFDbkJKLEVBQUFBLFFBQVEsRUFBRUssU0FEUztBQUVuQkosRUFBQUEsU0FBUyxFQUFFSTtBQUZRLENBQXJCO0FBS0FOLEtBQUssQ0FBQ08sU0FBTixHQUFrQjtBQUNoQk4sRUFBQUEsUUFBUSxFQUFFVixTQUFTLENBQUNpQixHQURKO0FBRWhCTixFQUFBQSxTQUFTLEVBQUVYLFNBQVMsQ0FBQ2tCO0FBRkwsQ0FBbEI7QUFLQSxlQUFlVCxLQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBJbnRlcm5hbENvbnRleHQgZnJvbSAnLi9JbnRlcm5hbENvbnRleHQnO1xuaW1wb3J0IHVzZVN0eWxlVG9DbGFzc05hbWUgZnJvbSAnLi4vaG9va3MvaW50ZXJuYWwvdXNlU3R5bGVUb0NsYXNzTmFtZSc7XG5cbmNvbnN0IFJPT1RfU1RZTEUgPSB7XG4gIGhlaWdodDogJzEwMCUnLFxuICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgd2lkdGg6ICcxMDAlJ1xufTtcblxuY29uc3QgUGFuZWwgPSAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH0pID0+IHtcbiAgY29uc3QgeyBzZXRUYXJnZXQgfSA9IHVzZUNvbnRleHQoSW50ZXJuYWxDb250ZXh0KTtcbiAgY29uc3Qgcm9vdENTUyA9IHVzZVN0eWxlVG9DbGFzc05hbWUoKShST09UX1NUWUxFKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHJvb3RDU1MsIChjbGFzc05hbWUgfHwgJycpICsgJycpfSByZWY9e3NldFRhcmdldH0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5QYW5lbC5kZWZhdWx0UHJvcHMgPSB7XG4gIGNoaWxkcmVuOiB1bmRlZmluZWQsXG4gIGNsYXNzTmFtZTogdW5kZWZpbmVkXG59O1xuXG5QYW5lbC5wcm9wVHlwZXMgPSB7XG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuYW55LFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsO1xuIl19

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(174);
module.exports = __webpack_require__(179);


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end


if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  __webpack_require__(175).enable();
  window.Promise = __webpack_require__(177);
}

// fetch() polyfill for making API calls.
__webpack_require__(178);

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = __webpack_require__(54);

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.
if (false) {
  require('raf').polyfill(global);
}


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Promise = __webpack_require__(95);

var DEFAULT_WHITELIST = [
  ReferenceError,
  TypeError,
  RangeError
];

var enabled = false;
exports.disable = disable;
function disable() {
  enabled = false;
  Promise._47 = null;
  Promise._71 = null;
}

exports.enable = enable;
function enable(options) {
  options = options || {};
  if (enabled) disable();
  enabled = true;
  var id = 0;
  var displayId = 0;
  var rejections = {};
  Promise._47 = function (promise) {
    if (
      promise._83 === 2 && // IS REJECTED
      rejections[promise._56]
    ) {
      if (rejections[promise._56].logged) {
        onHandled(promise._56);
      } else {
        clearTimeout(rejections[promise._56].timeout);
      }
      delete rejections[promise._56];
    }
  };
  Promise._71 = function (promise, err) {
    if (promise._75 === 0) { // not yet handled
      promise._56 = id++;
      rejections[promise._56] = {
        displayId: null,
        error: err,
        timeout: setTimeout(
          onUnhandled.bind(null, promise._56),
          // For reference errors and type errors, this almost always
          // means the programmer made a mistake, so log them after just
          // 100ms
          // otherwise, wait 2 seconds to see if they get handled
          matchWhitelist(err, DEFAULT_WHITELIST)
            ? 100
            : 2000
        ),
        logged: false
      };
    }
  };
  function onUnhandled(id) {
    if (
      options.allRejections ||
      matchWhitelist(
        rejections[id].error,
        options.whitelist || DEFAULT_WHITELIST
      )
    ) {
      rejections[id].displayId = displayId++;
      if (options.onUnhandled) {
        rejections[id].logged = true;
        options.onUnhandled(
          rejections[id].displayId,
          rejections[id].error
        );
      } else {
        rejections[id].logged = true;
        logError(
          rejections[id].displayId,
          rejections[id].error
        );
      }
    }
  }
  function onHandled(id) {
    if (rejections[id].logged) {
      if (options.onHandled) {
        options.onHandled(rejections[id].displayId, rejections[id].error);
      } else if (!rejections[id].onUnhandled) {
        console.warn(
          'Promise Rejection Handled (id: ' + rejections[id].displayId + '):'
        );
        console.warn(
          '  This means you can ignore any previous messages of the form "Possible Unhandled Promise Rejection" with id ' +
          rejections[id].displayId + '.'
        );
      }
    }
  }
}

function logError(id, error) {
  console.warn('Possible Unhandled Promise Rejection (id: ' + id + '):');
  var errStr = (error && (error.stack || error)) + '';
  errStr.split('\n').forEach(function (line) {
    console.warn('  ' + line);
  });
}

function matchWhitelist(error, list) {
  return list.some(function (cls) {
    return error instanceof cls;
  });
}

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = __webpack_require__(95);

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._44);
  p._83 = 1;
  p._18 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._83 === 3) {
            val = val._18;
          }
          if (val._83 === 1) return res(i, val._18);
          if (val._83 === 2) reject(val._18);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};


/***/ }),
/* 178 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 179 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(181);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App__ = __webpack_require__(185);
__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__App__["a" /* default */],null),document.querySelector('#root'));

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l=__webpack_require__(54),n=60103,p=60106;exports.Fragment=60107;exports.StrictMode=60108;exports.Profiler=60114;var q=60109,r=60110,t=60112;exports.Suspense=60113;var u=60115,v=60116;
if("function"===typeof Symbol&&Symbol.for){var w=Symbol.for;n=w("react.element");p=w("react.portal");exports.Fragment=w("react.fragment");exports.StrictMode=w("react.strict_mode");exports.Profiler=w("react.profiler");q=w("react.provider");r=w("react.context");t=w("react.forward_ref");exports.Suspense=w("react.suspense");u=w("react.memo");v=w("react.lazy")}var x="function"===typeof Symbol&&Symbol.iterator;
function y(a){if(null===a||"object"!==typeof a)return null;a=x&&a[x]||a["@@iterator"];return"function"===typeof a?a:null}function z(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B={};function C(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}C.prototype.isReactComponent={};C.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error(z(85));this.updater.enqueueSetState(this,a,b,"setState")};C.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};
function D(){}D.prototype=C.prototype;function E(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}var F=E.prototype=new D;F.constructor=E;l(F,C.prototype);F.isPureReactComponent=!0;var G={current:null},H=Object.prototype.hasOwnProperty,I={key:!0,ref:!0,__self:!0,__source:!0};
function J(a,b,c){var e,d={},k=null,h=null;if(null!=b)for(e in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)H.call(b,e)&&!I.hasOwnProperty(e)&&(d[e]=b[e]);var g=arguments.length-2;if(1===g)d.children=c;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];d.children=f}if(a&&a.defaultProps)for(e in g=a.defaultProps,g)void 0===d[e]&&(d[e]=g[e]);return{$$typeof:n,type:a,key:k,ref:h,props:d,_owner:G.current}}
function K(a,b){return{$$typeof:n,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function L(a){return"object"===typeof a&&null!==a&&a.$$typeof===n}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var M=/\/+/g;function N(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function O(a,b,c,e,d){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case n:case p:h=!0}}if(h)return h=a,d=d(h),a=""===e?"."+N(h,0):e,Array.isArray(d)?(c="",null!=a&&(c=a.replace(M,"$&/")+"/"),O(d,b,c,"",function(a){return a})):null!=d&&(L(d)&&(d=K(d,c+(!d.key||h&&h.key===d.key?"":(""+d.key).replace(M,"$&/")+"/")+a)),b.push(d)),1;h=0;e=""===e?".":e+":";if(Array.isArray(a))for(var g=
0;g<a.length;g++){k=a[g];var f=e+N(k,g);h+=O(k,b,c,f,d)}else if(f=y(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=e+N(k,g++),h+=O(k,b,c,f,d);else if("object"===k)throw b=""+a,Error(z(31,"[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b));return h}function P(a,b,c){if(null==a)return a;var e=[],d=0;O(a,e,"","",function(a){return b.call(c,a,d++)});return e}
function Q(a){if(-1===a._status){var b=a._result;b=b();a._status=0;a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b)},function(b){0===a._status&&(a._status=2,a._result=b)})}if(1===a._status)return a._result;throw a._result;}var R={current:null};function S(){var a=R.current;if(null===a)throw Error(z(321));return a}var T={ReactCurrentDispatcher:R,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:G,IsSomeRendererActing:{current:!1},assign:l};
exports.Children={map:P,forEach:function(a,b,c){P(a,function(){b.apply(this,arguments)},c)},count:function(a){var b=0;P(a,function(){b++});return b},toArray:function(a){return P(a,function(a){return a})||[]},only:function(a){if(!L(a))throw Error(z(143));return a}};exports.Component=C;exports.PureComponent=E;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=T;
exports.cloneElement=function(a,b,c){if(null===a||void 0===a)throw Error(z(267,a));var e=l({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=G.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)H.call(b,f)&&!I.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){g=Array(f);for(var m=0;m<f;m++)g[m]=arguments[m+2];e.children=g}return{$$typeof:n,type:a.type,
key:d,ref:k,props:e,_owner:h}};exports.createContext=function(a,b){void 0===b&&(b=null);a={$$typeof:r,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:q,_context:a};return a.Consumer=a};exports.createElement=J;exports.createFactory=function(a){var b=J.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};exports.forwardRef=function(a){return{$$typeof:t,render:a}};exports.isValidElement=L;
exports.lazy=function(a){return{$$typeof:v,_payload:{_status:-1,_result:a},_init:Q}};exports.memo=function(a,b){return{$$typeof:u,type:a,compare:void 0===b?null:b}};exports.useCallback=function(a,b){return S().useCallback(a,b)};exports.useContext=function(a,b){return S().useContext(a,b)};exports.useDebugValue=function(){};exports.useEffect=function(a,b){return S().useEffect(a,b)};exports.useImperativeHandle=function(a,b,c){return S().useImperativeHandle(a,b,c)};
exports.useLayoutEffect=function(a,b){return S().useLayoutEffect(a,b)};exports.useMemo=function(a,b){return S().useMemo(a,b)};exports.useReducer=function(a,b,c){return S().useReducer(a,b,c)};exports.useRef=function(a){return S().useRef(a)};exports.useState=function(a){return S().useState(a)};exports.version="17.0.2";


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) {
    // This branch is unreachable because this function is only called
    // in production, but the condition is true only in development.
    // Therefore if the branch is still here, dead code elimination wasn't
    // properly applied.
    // Don't change the message. React DevTools relies on it. Also make sure
    // this message doesn't occur elsewhere in this function, or it will cause
    // a false positive.
    throw new Error('^_^');
  }
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(182);
} else {
  module.exports = require('./cjs/react-dom.development.js');
}


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v17.0.2
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(0),m=__webpack_require__(54),r=__webpack_require__(183);function y(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}if(!aa)throw Error(y(227));var ba=new Set,ca={};function da(a,b){ea(a,b);ea(a+"Capture",b)}
function ea(a,b){ca[a]=b;for(a=0;a<b.length;a++)ba.add(b[a])}
var fa=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ha=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ia=Object.prototype.hasOwnProperty,
ja={},ka={};function la(a){if(ia.call(ka,a))return!0;if(ia.call(ja,a))return!1;if(ha.test(a))return ka[a]=!0;ja[a]=!0;return!1}function ma(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}
function na(a,b,c,d){if(null===b||"undefined"===typeof b||ma(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function B(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g}var D={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){D[a]=new B(a,0,!1,a,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];D[b]=new B(b,1,!1,a[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){D[a]=new B(a,2,!1,a.toLowerCase(),null,!1,!1)});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){D[a]=new B(a,2,!1,a,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){D[a]=new B(a,3,!1,a.toLowerCase(),null,!1,!1)});
["checked","multiple","muted","selected"].forEach(function(a){D[a]=new B(a,3,!0,a,null,!1,!1)});["capture","download"].forEach(function(a){D[a]=new B(a,4,!1,a,null,!1,!1)});["cols","rows","size","span"].forEach(function(a){D[a]=new B(a,6,!1,a,null,!1,!1)});["rowSpan","start"].forEach(function(a){D[a]=new B(a,5,!1,a.toLowerCase(),null,!1,!1)});var oa=/[\-:]([a-z])/g;function pa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(oa,
pa);D[b]=new B(b,1,!1,a,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!1,!1)});
D.xlinkHref=new B("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!0,!0)});
function qa(a,b,c,d){var e=D.hasOwnProperty(b)?D[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(na(b,c,e,d)&&(c=null),d||null===e?la(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))))}
var ra=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,sa=60103,ta=60106,ua=60107,wa=60108,xa=60114,ya=60109,za=60110,Aa=60112,Ba=60113,Ca=60120,Da=60115,Ea=60116,Fa=60121,Ga=60128,Ha=60129,Ia=60130,Ja=60131;
if("function"===typeof Symbol&&Symbol.for){var E=Symbol.for;sa=E("react.element");ta=E("react.portal");ua=E("react.fragment");wa=E("react.strict_mode");xa=E("react.profiler");ya=E("react.provider");za=E("react.context");Aa=E("react.forward_ref");Ba=E("react.suspense");Ca=E("react.suspense_list");Da=E("react.memo");Ea=E("react.lazy");Fa=E("react.block");E("react.scope");Ga=E("react.opaque.id");Ha=E("react.debug_trace_mode");Ia=E("react.offscreen");Ja=E("react.legacy_hidden")}
var Ka="function"===typeof Symbol&&Symbol.iterator;function La(a){if(null===a||"object"!==typeof a)return null;a=Ka&&a[Ka]||a["@@iterator"];return"function"===typeof a?a:null}var Ma;function Na(a){if(void 0===Ma)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);Ma=b&&b[1]||""}return"\n"+Ma+a}var Oa=!1;
function Pa(a,b){if(!a||Oa)return"";Oa=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[])}catch(k){var d=k}Reflect.construct(a,[],b)}else{try{b.call()}catch(k){d=k}a.call(b.prototype)}else{try{throw Error();}catch(k){d=k}a()}}catch(k){if(k&&d&&"string"===typeof k.stack){for(var e=k.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h])return"\n"+e[g].replace(" at new "," at ");while(1<=g&&0<=h)}break}}}finally{Oa=!1,Error.prepareStackTrace=c}return(a=a?a.displayName||a.name:"")?Na(a):""}
function Qa(a){switch(a.tag){case 5:return Na(a.type);case 16:return Na("Lazy");case 13:return Na("Suspense");case 19:return Na("SuspenseList");case 0:case 2:case 15:return a=Pa(a.type,!1),a;case 11:return a=Pa(a.type.render,!1),a;case 22:return a=Pa(a.type._render,!1),a;case 1:return a=Pa(a.type,!0),a;default:return""}}
function Ra(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ua:return"Fragment";case ta:return"Portal";case xa:return"Profiler";case wa:return"StrictMode";case Ba:return"Suspense";case Ca:return"SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case za:return(a.displayName||"Context")+".Consumer";case ya:return(a._context.displayName||"Context")+".Provider";case Aa:var b=a.render;b=b.displayName||b.name||"";
return a.displayName||(""!==b?"ForwardRef("+b+")":"ForwardRef");case Da:return Ra(a.type);case Fa:return Ra(a._render);case Ea:b=a._payload;a=a._init;try{return Ra(a(b))}catch(c){}}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return""}}function Ta(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=
null;delete a[b]}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a))}function Wa(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
function Ya(a,b){var c=b.checked;return m({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function $a(a,b){b=b.checked;null!=b&&qa(a,"checked",b,!1)}
function ab(a,b){$a(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?bb(a,b.type,c):b.hasOwnProperty("defaultValue")&&bb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)}
function cb(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c)}
function bb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c)}function db(a){var b="";aa.Children.forEach(a,function(a){null!=a&&(b+=a)});return b}function eb(a,b){a=m({children:void 0},b);if(b=db(b.children))a.children=b;return a}
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(y(91));return m({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(y(92));if(Array.isArray(c)){if(!(1>=c.length))throw Error(y(93));c=c[0]}b=c}null==b&&(b="");c=b}a._wrapperState={initialValue:Sa(c)}}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d)}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b)}var kb={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
function lb(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function mb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?lb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var nb,ob=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if(a.namespaceURI!==kb.svg||"innerHTML"in a)a.innerHTML=b;else{nb=nb||document.createElement("div");nb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=nb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}});
function pb(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b}
var qb={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,
floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},rb=["Webkit","ms","Moz","O"];Object.keys(qb).forEach(function(a){rb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);qb[b]=qb[a]})});function sb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||qb.hasOwnProperty(a)&&qb[a]?(""+b).trim():b+"px"}
function tb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=sb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e}}var ub=m({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function vb(a,b){if(b){if(ub[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(y(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(y(60));if(!("object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML))throw Error(y(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(y(62));}}
function wb(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(y(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b))}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a])}}function Gb(a,b){return a(b)}function Hb(a,b,c,d,e){return a(b,c,d,e)}function Ib(){}var Jb=Gb,Kb=!1,Lb=!1;function Mb(){if(null!==zb||null!==Ab)Ib(),Fb()}
function Nb(a,b,c){if(Lb)return a(b,c);Lb=!0;try{return Jb(a,b,c)}finally{Lb=!1,Mb()}}
function Ob(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;if(c&&"function"!==
typeof c)throw Error(y(231,b,typeof c));return c}var Pb=!1;if(fa)try{var Qb={};Object.defineProperty(Qb,"passive",{get:function(){Pb=!0}});window.addEventListener("test",Qb,Qb);window.removeEventListener("test",Qb,Qb)}catch(a){Pb=!1}function Rb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l)}catch(n){this.onError(n)}}var Sb=!1,Tb=null,Ub=!1,Vb=null,Wb={onError:function(a){Sb=!0;Tb=a}};function Xb(a,b,c,d,e,f,g,h,k){Sb=!1;Tb=null;Rb.apply(Wb,arguments)}
function Yb(a,b,c,d,e,f,g,h,k){Xb.apply(this,arguments);if(Sb){if(Sb){var l=Tb;Sb=!1;Tb=null}else throw Error(y(198));Ub||(Ub=!0,Vb=l)}}function Zb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else{a=b;do b=a,0!==(b.flags&1026)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function $b(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function ac(a){if(Zb(a)!==a)throw Error(y(188));}
function bc(a){var b=a.alternate;if(!b){b=Zb(a);if(null===b)throw Error(y(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return ac(e),a;if(f===d)return ac(e),b;f=f.sibling}throw Error(y(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}if(!g)throw Error(y(189));}}if(c.alternate!==d)throw Error(y(190));}if(3!==c.tag)throw Error(y(188));return c.stateNode.current===c?a:b}function cc(a){a=bc(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}}return null}
function dc(a,b){for(var c=a.alternate;null!==b;){if(b===a||b===c)return!0;b=b.return}return!1}var ec,fc,gc,hc,ic=!1,jc=[],kc=null,lc=null,mc=null,nc=new Map,oc=new Map,pc=[],qc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function rc(a,b,c,d,e){return{blockedOn:a,domEventName:b,eventSystemFlags:c|16,nativeEvent:e,targetContainers:[d]}}function sc(a,b){switch(a){case "focusin":case "focusout":kc=null;break;case "dragenter":case "dragleave":lc=null;break;case "mouseover":case "mouseout":mc=null;break;case "pointerover":case "pointerout":nc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":oc.delete(b.pointerId)}}
function tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a=rc(b,c,d,e,f),null!==b&&(b=Cb(b),null!==b&&fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function uc(a,b,c,d,e){switch(b){case "focusin":return kc=tc(kc,a,b,c,d,e),!0;case "dragenter":return lc=tc(lc,a,b,c,d,e),!0;case "mouseover":return mc=tc(mc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;nc.set(f,tc(nc.get(f)||null,a,b,c,d,e));return!0;case "gotpointercapture":return f=e.pointerId,oc.set(f,tc(oc.get(f)||null,a,b,c,d,e)),!0}return!1}
function vc(a){var b=wc(a.target);if(null!==b){var c=Zb(b);if(null!==c)if(b=c.tag,13===b){if(b=$b(c),null!==b){a.blockedOn=b;hc(a.lanePriority,function(){r.unstable_runWithPriority(a.priority,function(){gc(c)})});return}}else if(3===b&&c.stateNode.hydrate){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null}
function xc(a){if(null!==a.blockedOn)return!1;for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c)return b=Cb(c),null!==b&&fc(b),a.blockedOn=c,!1;b.shift()}return!0}function zc(a,b,c){xc(a)&&c.delete(b)}
function Ac(){for(ic=!1;0<jc.length;){var a=jc[0];if(null!==a.blockedOn){a=Cb(a.blockedOn);null!==a&&ec(a);break}for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c){a.blockedOn=c;break}b.shift()}null===a.blockedOn&&jc.shift()}null!==kc&&xc(kc)&&(kc=null);null!==lc&&xc(lc)&&(lc=null);null!==mc&&xc(mc)&&(mc=null);nc.forEach(zc);oc.forEach(zc)}
function Bc(a,b){a.blockedOn===b&&(a.blockedOn=null,ic||(ic=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,Ac)))}
function Cc(a){function b(b){return Bc(b,a)}if(0<jc.length){Bc(jc[0],a);for(var c=1;c<jc.length;c++){var d=jc[c];d.blockedOn===a&&(d.blockedOn=null)}}null!==kc&&Bc(kc,a);null!==lc&&Bc(lc,a);null!==mc&&Bc(mc,a);nc.forEach(b);oc.forEach(b);for(c=0;c<pc.length;c++)d=pc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<pc.length&&(c=pc[0],null===c.blockedOn);)vc(c),null===c.blockedOn&&pc.shift()}
function Dc(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var Ec={animationend:Dc("Animation","AnimationEnd"),animationiteration:Dc("Animation","AnimationIteration"),animationstart:Dc("Animation","AnimationStart"),transitionend:Dc("Transition","TransitionEnd")},Fc={},Gc={};
fa&&(Gc=document.createElement("div").style,"AnimationEvent"in window||(delete Ec.animationend.animation,delete Ec.animationiteration.animation,delete Ec.animationstart.animation),"TransitionEvent"in window||delete Ec.transitionend.transition);function Hc(a){if(Fc[a])return Fc[a];if(!Ec[a])return a;var b=Ec[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Gc)return Fc[a]=b[c];return a}
var Ic=Hc("animationend"),Jc=Hc("animationiteration"),Kc=Hc("animationstart"),Lc=Hc("transitionend"),Mc=new Map,Nc=new Map,Oc=["abort","abort",Ic,"animationEnd",Jc,"animationIteration",Kc,"animationStart","canplay","canPlay","canplaythrough","canPlayThrough","durationchange","durationChange","emptied","emptied","encrypted","encrypted","ended","ended","error","error","gotpointercapture","gotPointerCapture","load","load","loadeddata","loadedData","loadedmetadata","loadedMetadata","loadstart","loadStart",
"lostpointercapture","lostPointerCapture","playing","playing","progress","progress","seeking","seeking","stalled","stalled","suspend","suspend","timeupdate","timeUpdate",Lc,"transitionEnd","waiting","waiting"];function Pc(a,b){for(var c=0;c<a.length;c+=2){var d=a[c],e=a[c+1];e="on"+(e[0].toUpperCase()+e.slice(1));Nc.set(d,b);Mc.set(d,e);da(e,[d])}}var Qc=r.unstable_now;Qc();var F=8;
function Rc(a){if(0!==(1&a))return F=15,1;if(0!==(2&a))return F=14,2;if(0!==(4&a))return F=13,4;var b=24&a;if(0!==b)return F=12,b;if(0!==(a&32))return F=11,32;b=192&a;if(0!==b)return F=10,b;if(0!==(a&256))return F=9,256;b=3584&a;if(0!==b)return F=8,b;if(0!==(a&4096))return F=7,4096;b=4186112&a;if(0!==b)return F=6,b;b=62914560&a;if(0!==b)return F=5,b;if(a&67108864)return F=4,67108864;if(0!==(a&134217728))return F=3,134217728;b=805306368&a;if(0!==b)return F=2,b;if(0!==(1073741824&a))return F=1,1073741824;
F=8;return a}function Sc(a){switch(a){case 99:return 15;case 98:return 10;case 97:case 96:return 8;case 95:return 2;default:return 0}}function Tc(a){switch(a){case 15:case 14:return 99;case 13:case 12:case 11:case 10:return 98;case 9:case 8:case 7:case 6:case 4:case 5:return 97;case 3:case 2:case 1:return 95;case 0:return 90;default:throw Error(y(358,a));}}
function Uc(a,b){var c=a.pendingLanes;if(0===c)return F=0;var d=0,e=0,f=a.expiredLanes,g=a.suspendedLanes,h=a.pingedLanes;if(0!==f)d=f,e=F=15;else if(f=c&134217727,0!==f){var k=f&~g;0!==k?(d=Rc(k),e=F):(h&=f,0!==h&&(d=Rc(h),e=F))}else f=c&~g,0!==f?(d=Rc(f),e=F):0!==h&&(d=Rc(h),e=F);if(0===d)return 0;d=31-Vc(d);d=c&((0>d?0:1<<d)<<1)-1;if(0!==b&&b!==d&&0===(b&g)){Rc(b);if(e<=F)return b;F=e}b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-Vc(b),e=1<<c,d|=a[c],b&=~e;return d}
function Wc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function Xc(a,b){switch(a){case 15:return 1;case 14:return 2;case 12:return a=Yc(24&~b),0===a?Xc(10,b):a;case 10:return a=Yc(192&~b),0===a?Xc(8,b):a;case 8:return a=Yc(3584&~b),0===a&&(a=Yc(4186112&~b),0===a&&(a=512)),a;case 2:return b=Yc(805306368&~b),0===b&&(b=268435456),b}throw Error(y(358,a));}function Yc(a){return a&-a}function Zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function $c(a,b,c){a.pendingLanes|=b;var d=b-1;a.suspendedLanes&=d;a.pingedLanes&=d;a=a.eventTimes;b=31-Vc(b);a[b]=c}var Vc=Math.clz32?Math.clz32:ad,bd=Math.log,cd=Math.LN2;function ad(a){return 0===a?32:31-(bd(a)/cd|0)|0}var dd=r.unstable_UserBlockingPriority,ed=r.unstable_runWithPriority,fd=!0;function gd(a,b,c,d){Kb||Ib();var e=hd,f=Kb;Kb=!0;try{Hb(e,a,b,c,d)}finally{(Kb=f)||Mb()}}function id(a,b,c,d){ed(dd,hd.bind(null,a,b,c,d))}
function hd(a,b,c,d){if(fd){var e;if((e=0===(b&4))&&0<jc.length&&-1<qc.indexOf(a))a=rc(null,a,b,c,d),jc.push(a);else{var f=yc(a,b,c,d);if(null===f)e&&sc(a,d);else{if(e){if(-1<qc.indexOf(a)){a=rc(f,a,b,c,d);jc.push(a);return}if(uc(f,a,b,c,d))return;sc(a,d)}jd(a,b,d,null,c)}}}}
function yc(a,b,c,d){var e=xb(d);e=wc(e);if(null!==e){var f=Zb(e);if(null===f)e=null;else{var g=f.tag;if(13===g){e=$b(f);if(null!==e)return e;e=null}else if(3===g){if(f.stateNode.hydrate)return 3===f.tag?f.stateNode.containerInfo:null;e=null}else f!==e&&(e=null)}}jd(a,b,d,e,c);return null}var kd=null,ld=null,md=null;
function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return!0}function qd(){return!1}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}m(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=!1),this.isDefaultPrevented=pd)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd)},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=m({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=m({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return"movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=m({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=m({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=m({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=m({},sd,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=m({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
var Qd=m({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return"keypress"===a.type?od(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=m({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=m({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=m({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=m({},Ad,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae=fa&&"CompositionEvent"in window,be=null;fa&&"documentMode"in document&&(be=document.documentMode);var ce=fa&&"TextEvent"in window&&!be,de=fa&&(!ae||be&&8<be&&11>=be),ee=String.fromCharCode(32),fe=!1;
function ge(a,b){switch(a){case "keyup":return-1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return!0;default:return!1}}function he(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var ie=!1;function je(a,b){switch(a){case "compositionend":return he(b);case "keypress":if(32!==b.which)return null;fe=!0;return ee;case "textInput":return a=b.data,a===ee&&fe?null:a;default:return null}}
function ke(a,b){if(ie)return"compositionend"===a||!ae&&ge(a,b)?(a=nd(),md=ld=kd=null,ie=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de&&"ko"!==b.locale?null:b.data;default:return null}}
var le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!le[a.type]:"textarea"===b?!0:!1}function ne(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}))}var pe=null,qe=null;function re(a){se(a,0)}function te(a){var b=ue(a);if(Wa(b))return a}
function ve(a,b){if("change"===a)return b}var we=!1;if(fa){var xe;if(fa){var ye="oninput"in document;if(!ye){var ze=document.createElement("div");ze.setAttribute("oninput","return;");ye="function"===typeof ze.oninput}xe=ye}else xe=!1;we=xe&&(!document.documentMode||9<document.documentMode)}function Ae(){pe&&(pe.detachEvent("onpropertychange",Be),qe=pe=null)}function Be(a){if("value"===a.propertyName&&te(qe)){var b=[];ne(b,qe,a,xb(a));a=re;if(Kb)a(b);else{Kb=!0;try{Gb(a,b)}finally{Kb=!1,Mb()}}}}
function Ce(a,b,c){"focusin"===a?(Ae(),pe=b,qe=c,pe.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae()}function De(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te(qe)}function Ee(a,b){if("click"===a)return te(b)}function Fe(a,b){if("input"===a||"change"===a)return te(b)}function Ge(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He="function"===typeof Object.is?Object.is:Ge,Ie=Object.prototype.hasOwnProperty;
function Je(a,b){if(He(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++)if(!Ie.call(b,c[d])||!He(a[c[d]],b[c[d]]))return!1;return!0}function Ke(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Le(a,b){var c=Ke(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Ke(c)}}function Me(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Me(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Ne(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href}catch(d){c=!1}if(c)a=b.contentWindow;else break;b=Xa(a.document)}return b}function Oe(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
var Pe=fa&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re=null,Se=null,Te=!1;
function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Oe(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se&&Je(Se,d)||(Se=d,d=oe(Re,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)))}
Pc("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "),
0);Pc("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "),1);Pc(Oc,2);for(var Ve="change selectionchange textInput compositionstart compositionend compositionupdate".split(" "),We=0;We<Ve.length;We++)Nc.set(Ve[We],0);ea("onMouseEnter",["mouseout","mouseover"]);
ea("onMouseLeave",["mouseout","mouseover"]);ea("onPointerEnter",["pointerout","pointerover"]);ea("onPointerLeave",["pointerout","pointerover"]);da("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));da("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));da("onBeforeInput",["compositionend","keypress","textInput","paste"]);da("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));
da("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));da("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Xe="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Ye=new Set("cancel close invalid load scroll toggle".split(" ").concat(Xe));
function Ze(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Yb(d,b,void 0,a);a.currentTarget=null}
function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k}}}if(Ub)throw a=Vb,Ub=!1,Vb=null,a;}
function G(a,b){var c=$e(b),d=a+"__bubble";c.has(d)||(af(b,a,2,!1),c.add(d))}var bf="_reactListening"+Math.random().toString(36).slice(2);function cf(a){a[bf]||(a[bf]=!0,ba.forEach(function(b){Ye.has(b)||df(b,!1,a,null);df(b,!0,a,null)}))}
function df(a,b,c,d){var e=4<arguments.length&&void 0!==arguments[4]?arguments[4]:0,f=c;"selectionchange"===a&&9!==c.nodeType&&(f=c.ownerDocument);if(null!==d&&!b&&Ye.has(a)){if("scroll"!==a)return;e|=2;f=d}var g=$e(f),h=a+"__"+(b?"capture":"bubble");g.has(h)||(b&&(e|=4),af(f,a,e,b),g.add(h))}
function af(a,b,c,d){var e=Nc.get(b);switch(void 0===e?2:e){case 0:e=gd;break;case 1:e=id;break;default:e=hd}c=e.bind(null,b,c,a);e=void 0;!Pb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1)}
function jd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return}for(;null!==h;){g=wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode}}d=d.return}Nb(function(){var d=f,e=xb(c),g=[];
a:{var h=Mc.get(a);if(void 0!==h){var k=td,x=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":x="focus";k=Fd;break;case "focusout":x="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case Ic:case Jc:case Kc:k=Hd;break;case Lc:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td}var w=0!==(b&4),z=!w&&"scroll"===a,u=w?null!==h?h+"Capture":null:h;w=[];for(var t=d,q;null!==
t;){q=t;var v=q.stateNode;5===q.tag&&null!==v&&(q=v,null!==u&&(v=Ob(t,u),null!=v&&w.push(ef(t,v,q))));if(z)break;t=t.return}0<w.length&&(h=new k(h,x,null,c,e),g.push({event:h,listeners:w}))}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&0===(b&16)&&(x=c.relatedTarget||c.fromElement)&&(wc(x)||x[ff]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(x=c.relatedTarget||c.toElement,k=d,x=x?wc(x):null,null!==
x&&(z=Zb(x),x!==z||5!==x.tag&&6!==x.tag))x=null}else k=null,x=d;if(k!==x){w=Bd;v="onMouseLeave";u="onMouseEnter";t="mouse";if("pointerout"===a||"pointerover"===a)w=Td,v="onPointerLeave",u="onPointerEnter",t="pointer";z=null==k?h:ue(k);q=null==x?h:ue(x);h=new w(v,t+"leave",k,c,e);h.target=z;h.relatedTarget=q;v=null;wc(e)===d&&(w=new w(u,t+"enter",x,c,e),w.target=q,w.relatedTarget=z,v=w);z=v;if(k&&x)b:{w=k;u=x;t=0;for(q=w;q;q=gf(q))t++;q=0;for(v=u;v;v=gf(v))q++;for(;0<t-q;)w=gf(w),t--;for(;0<q-t;)u=
gf(u),q--;for(;t--;){if(w===u||null!==u&&w===u.alternate)break b;w=gf(w);u=gf(u)}w=null}else w=null;null!==k&&hf(g,h,k,w,!1);null!==x&&null!==z&&hf(g,z,x,w,!0)}}}a:{h=d?ue(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var J=ve;else if(me(h))if(we)J=Fe;else{J=De;var K=Ce}else(k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(J=Ee);if(J&&(J=J(a,d))){ne(g,J,c,e);break a}K&&K(a,h,d);"focusout"===a&&(K=h._wrapperState)&&
K.controlled&&"number"===h.type&&bb(h,"number",h.value)}K=d?ue(d):window;switch(a){case "focusin":if(me(K)||"true"===K.contentEditable)Qe=K,Re=d,Se=null;break;case "focusout":Se=Re=Qe=null;break;case "mousedown":Te=!0;break;case "contextmenu":case "mouseup":case "dragend":Te=!1;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e)}var Q;if(ae)b:{switch(a){case "compositionstart":var L="onCompositionStart";break b;case "compositionend":L="onCompositionEnd";break b;
case "compositionupdate":L="onCompositionUpdate";break b}L=void 0}else ie?ge(a,c)&&(L="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(L="onCompositionStart");L&&(de&&"ko"!==c.locale&&(ie||"onCompositionStart"!==L?"onCompositionEnd"===L&&ie&&(Q=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie=!0)),K=oe(d,L),0<K.length&&(L=new Ld(L,a,null,c,e),g.push({event:L,listeners:K}),Q?L.data=Q:(Q=he(c),null!==Q&&(L.data=Q))));if(Q=ce?je(a,c):ke(a,c))d=oe(d,"onBeforeInput"),0<d.length&&(e=new Ld("onBeforeInput",
"beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=Q)}se(g,b)})}function ef(a,b,c){return{instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Ob(a,c),null!=f&&d.unshift(ef(a,f,e)),f=Ob(a,b),null!=f&&d.push(ef(a,f,e)));a=a.return}return d}function gf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function hf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Ob(c,f),null!=k&&g.unshift(ef(c,k,h))):e||(k=Ob(c,f),null!=k&&g.push(ef(c,k,h))));c=c.return}0!==g.length&&a.push({event:b,listeners:g})}function jf(){}var kf=null,lf=null;function mf(a,b){switch(a){case "button":case "input":case "select":case "textarea":return!!b.autoFocus}return!1}
function nf(a,b){return"textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}var of="function"===typeof setTimeout?setTimeout:void 0,pf="function"===typeof clearTimeout?clearTimeout:void 0;function qf(a){1===a.nodeType?a.textContent="":9===a.nodeType&&(a=a.body,null!=a&&(a.textContent=""))}
function rf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break}return a}function sf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--}else"/$"===c&&b++}a=a.previousSibling}return null}var tf=0;function uf(a){return{$$typeof:Ga,toString:a,valueOf:a}}var vf=Math.random().toString(36).slice(2),wf="__reactFiber$"+vf,xf="__reactProps$"+vf,ff="__reactContainer$"+vf,yf="__reactEvents$"+vf;
function wc(a){var b=a[wf];if(b)return b;for(var c=a.parentNode;c;){if(b=c[ff]||c[wf]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=sf(a);null!==a;){if(c=a[wf])return c;a=sf(a)}return b}a=c;c=a.parentNode}return null}function Cb(a){a=a[wf]||a[ff];return!a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(y(33));}function Db(a){return a[xf]||null}
function $e(a){var b=a[yf];void 0===b&&(b=a[yf]=new Set);return b}var zf=[],Af=-1;function Bf(a){return{current:a}}function H(a){0>Af||(a.current=zf[Af],zf[Af]=null,Af--)}function I(a,b){Af++;zf[Af]=a.current;a.current=b}var Cf={},M=Bf(Cf),N=Bf(!1),Df=Cf;
function Ef(a,b){var c=a.type.contextTypes;if(!c)return Cf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function Ff(a){a=a.childContextTypes;return null!==a&&void 0!==a}function Gf(){H(N);H(M)}function Hf(a,b,c){if(M.current!==Cf)throw Error(y(168));I(M,b);I(N,c)}
function If(a,b,c){var d=a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in a))throw Error(y(108,Ra(b)||"Unknown",e));return m({},c,d)}function Jf(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Cf;Df=M.current;I(M,a);I(N,N.current);return!0}function Kf(a,b,c){var d=a.stateNode;if(!d)throw Error(y(169));c?(a=If(a,b,Df),d.__reactInternalMemoizedMergedChildContext=a,H(N),H(M),I(M,a)):H(N);I(N,c)}
var Lf=null,Mf=null,Nf=r.unstable_runWithPriority,Of=r.unstable_scheduleCallback,Pf=r.unstable_cancelCallback,Qf=r.unstable_shouldYield,Rf=r.unstable_requestPaint,Sf=r.unstable_now,Tf=r.unstable_getCurrentPriorityLevel,Uf=r.unstable_ImmediatePriority,Vf=r.unstable_UserBlockingPriority,Wf=r.unstable_NormalPriority,Xf=r.unstable_LowPriority,Yf=r.unstable_IdlePriority,Zf={},$f=void 0!==Rf?Rf:function(){},ag=null,bg=null,cg=!1,dg=Sf(),O=1E4>dg?Sf:function(){return Sf()-dg};
function eg(){switch(Tf()){case Uf:return 99;case Vf:return 98;case Wf:return 97;case Xf:return 96;case Yf:return 95;default:throw Error(y(332));}}function fg(a){switch(a){case 99:return Uf;case 98:return Vf;case 97:return Wf;case 96:return Xf;case 95:return Yf;default:throw Error(y(332));}}function gg(a,b){a=fg(a);return Nf(a,b)}function hg(a,b,c){a=fg(a);return Of(a,b,c)}function ig(){if(null!==bg){var a=bg;bg=null;Pf(a)}jg()}
function jg(){if(!cg&&null!==ag){cg=!0;var a=0;try{var b=ag;gg(99,function(){for(;a<b.length;a++){var c=b[a];do c=c(!0);while(null!==c)}});ag=null}catch(c){throw null!==ag&&(ag=ag.slice(a+1)),Of(Uf,ig),c;}finally{cg=!1}}}var kg=ra.ReactCurrentBatchConfig;function lg(a,b){if(a&&a.defaultProps){b=m({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}var mg=Bf(null),ng=null,og=null,pg=null;function qg(){pg=og=ng=null}
function rg(a){var b=mg.current;H(mg);a.type._context._currentValue=b}function sg(a,b){for(;null!==a;){var c=a.alternate;if((a.childLanes&b)===b)if(null===c||(c.childLanes&b)===b)break;else c.childLanes|=b;else a.childLanes|=b,null!==c&&(c.childLanes|=b);a=a.return}}function tg(a,b){ng=a;pg=og=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(ug=!0),a.firstContext=null)}
function vg(a,b){if(pg!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)pg=a,b=1073741823;b={context:a,observedBits:b,next:null};if(null===og){if(null===ng)throw Error(y(308));og=b;ng.dependencies={lanes:0,firstContext:b,responders:null}}else og=og.next=b}return a._currentValue}var wg=!1;function xg(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null},effects:null}}
function yg(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects})}function zg(a,b){return{eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}function Ag(a,b){a=a.updateQueue;if(null!==a){a=a.shared;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b}}
function Bg(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next}while(null!==c);null===f?e=f=b:f=f.next=b}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b}
function Cg(a,b,c,d){var e=a.updateQueue;wg=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var n=a.alternate;if(null!==n){n=n.updateQueue;var A=n.lastBaseUpdate;A!==g&&(null===A?n.firstBaseUpdate=l:A.next=l,n.lastBaseUpdate=k)}}if(null!==f){A=e.baseState;g=0;n=l=k=null;do{h=f.lane;var p=f.eventTime;if((d&h)===h){null!==n&&(n=n.next={eventTime:p,lane:0,tag:f.tag,payload:f.payload,callback:f.callback,
next:null});a:{var C=a,x=f;h=b;p=c;switch(x.tag){case 1:C=x.payload;if("function"===typeof C){A=C.call(p,A,h);break a}A=C;break a;case 3:C.flags=C.flags&-4097|64;case 0:C=x.payload;h="function"===typeof C?C.call(p,A,h):C;if(null===h||void 0===h)break a;A=m({},A,h);break a;case 2:wg=!0}}null!==f.callback&&(a.flags|=32,h=e.effects,null===h?e.effects=[f]:h.push(f))}else p={eventTime:p,lane:h,tag:f.tag,payload:f.payload,callback:f.callback,next:null},null===n?(l=n=p,k=A):n=n.next=p,g|=h;f=f.next;if(null===
f)if(h=e.shared.pending,null===h)break;else f=h.next,h.next=null,e.lastBaseUpdate=h,e.shared.pending=null}while(1);null===n&&(k=A);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=n;Dg|=g;a.lanes=g;a.memoizedState=A}}function Eg(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(y(191,e));e.call(d)}}}var Fg=(new aa.Component).refs;
function Gg(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:m({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c)}
var Kg={isMounted:function(a){return(a=a._reactInternals)?Zb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d)},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d)},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=Hg(),d=Ig(a),e=zg(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=
b);Ag(a,e);Jg(a,d,c)}};function Lg(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Je(c,d)||!Je(e,f):!0}
function Mg(a,b,c){var d=!1,e=Cf;var f=b.contextType;"object"===typeof f&&null!==f?f=vg(f):(e=Ff(b)?Df:M.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Ef(a,e):Cf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Kg;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Ng(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Kg.enqueueReplaceState(b,b.state,null)}
function Og(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=Fg;xg(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=vg(f):(f=Ff(b)?Df:M.current,e.context=Ef(a,f));Cg(a,c,e,d);e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Gg(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||
(b=e.state,"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Kg.enqueueReplaceState(e,e.state,null),Cg(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4)}var Pg=Array.isArray;
function Qg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(y(309));var d=c.stateNode}if(!d)throw Error(y(147,a));var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===Fg&&(b=d.refs={});null===a?delete b[e]:b[e]=a};b._stringRef=e;return b}if("string"!==typeof a)throw Error(y(284));if(!c._owner)throw Error(y(290,a));}return a}
function Rg(a,b){if("textarea"!==a.type)throw Error(y(31,"[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b));}
function Sg(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.flags=8}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Tg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags=2,
c):d;b.flags=2;return c}function g(b){a&&null===b.alternate&&(b.flags=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Ug(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.elementType===c.type)return d=e(b,c.props),d.ref=Qg(a,b,c),d.return=a,d;d=Vg(c.type,c.key,c.props,null,a.mode,d);d.ref=Qg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=
Wg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function n(a,b,c,d,f){if(null===b||7!==b.tag)return b=Xg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function A(a,b,c){if("string"===typeof b||"number"===typeof b)return b=Ug(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case sa:return c=Vg(b.type,b.key,b.props,null,a.mode,c),c.ref=Qg(a,null,b),c.return=a,c;case ta:return b=Wg(b,a.mode,c),b.return=a,b}if(Pg(b)||La(b))return b=Xg(b,
a.mode,c,null),b.return=a,b;Rg(a,b)}return null}function p(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case sa:return c.key===e?c.type===ua?n(a,b,c.props.children,d,e):k(a,b,c,d):null;case ta:return c.key===e?l(a,b,c,d):null}if(Pg(c)||La(c))return null!==e?null:n(a,b,c,d,null);Rg(a,c)}return null}function C(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||
null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case sa:return a=a.get(null===d.key?c:d.key)||null,d.type===ua?n(b,a,d.props.children,e,d.key):k(b,a,d,e);case ta:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e)}if(Pg(d)||La(d))return a=a.get(c)||null,n(b,a,d,e,null);Rg(b,d)}return null}function x(e,g,h,k){for(var l=null,t=null,u=g,z=g=0,q=null;null!==u&&z<h.length;z++){u.index>z?(q=u,u=null):q=u.sibling;var n=p(e,u,h[z],k);if(null===n){null===u&&(u=q);break}a&&u&&null===
n.alternate&&b(e,u);g=f(n,g,z);null===t?l=n:t.sibling=n;t=n;u=q}if(z===h.length)return c(e,u),l;if(null===u){for(;z<h.length;z++)u=A(e,h[z],k),null!==u&&(g=f(u,g,z),null===t?l=u:t.sibling=u,t=u);return l}for(u=d(e,u);z<h.length;z++)q=C(u,e,z,h[z],k),null!==q&&(a&&null!==q.alternate&&u.delete(null===q.key?z:q.key),g=f(q,g,z),null===t?l=q:t.sibling=q,t=q);a&&u.forEach(function(a){return b(e,a)});return l}function w(e,g,h,k){var l=La(h);if("function"!==typeof l)throw Error(y(150));h=l.call(h);if(null==
h)throw Error(y(151));for(var t=l=null,u=g,z=g=0,q=null,n=h.next();null!==u&&!n.done;z++,n=h.next()){u.index>z?(q=u,u=null):q=u.sibling;var w=p(e,u,n.value,k);if(null===w){null===u&&(u=q);break}a&&u&&null===w.alternate&&b(e,u);g=f(w,g,z);null===t?l=w:t.sibling=w;t=w;u=q}if(n.done)return c(e,u),l;if(null===u){for(;!n.done;z++,n=h.next())n=A(e,n.value,k),null!==n&&(g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);return l}for(u=d(e,u);!n.done;z++,n=h.next())n=C(u,e,z,n.value,k),null!==n&&(a&&null!==n.alternate&&
u.delete(null===n.key?z:n.key),g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);a&&u.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===ua&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case sa:a:{l=f.key;for(k=d;null!==k;){if(k.key===l){switch(k.tag){case 7:if(f.type===ua){c(a,k.sibling);d=e(k,f.props.children);d.return=a;a=d;break a}break;default:if(k.elementType===f.type){c(a,k.sibling);
d=e(k,f.props);d.ref=Qg(a,k,f);d.return=a;a=d;break a}}c(a,k);break}else b(a,k);k=k.sibling}f.type===ua?(d=Xg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Vg(f.type,f.key,f.props,null,a.mode,h),h.ref=Qg(a,d,f),h.return=a,a=h)}return g(a);case ta:a:{for(k=f.key;null!==d;){if(d.key===k)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=
Wg(f,a.mode,h);d.return=a;a=d}return g(a)}if("string"===typeof f||"number"===typeof f)return f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):(c(a,d),d=Ug(f,a.mode,h),d.return=a,a=d),g(a);if(Pg(f))return x(a,d,f,h);if(La(f))return w(a,d,f,h);l&&Rg(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 1:case 22:case 0:case 11:case 15:throw Error(y(152,Ra(a.type)||"Component"));}return c(a,d)}}var Yg=Sg(!0),Zg=Sg(!1),$g={},ah=Bf($g),bh=Bf($g),ch=Bf($g);
function dh(a){if(a===$g)throw Error(y(174));return a}function eh(a,b){I(ch,b);I(bh,a);I(ah,$g);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:mb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=mb(b,a)}H(ah);I(ah,b)}function fh(){H(ah);H(bh);H(ch)}function gh(a){dh(ch.current);var b=dh(ah.current);var c=mb(b,a.type);b!==c&&(I(bh,a),I(ah,c))}function hh(a){bh.current===a&&(H(ah),H(bh))}var P=Bf(0);
function ih(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&64))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}return null}var jh=null,kh=null,lh=!1;
function mh(a,b){var c=nh(5,null,null,0);c.elementType="DELETED";c.type="DELETED";c.stateNode=b;c.return=a;c.flags=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c}function oh(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;case 13:return!1;default:return!1}}
function ph(a){if(lh){var b=kh;if(b){var c=b;if(!oh(a,b)){b=rf(c.nextSibling);if(!b||!oh(a,b)){a.flags=a.flags&-1025|2;lh=!1;jh=a;return}mh(jh,c)}jh=a;kh=rf(b.firstChild)}else a.flags=a.flags&-1025|2,lh=!1,jh=a}}function qh(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;jh=a}
function rh(a){if(a!==jh)return!1;if(!lh)return qh(a),lh=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!nf(b,a.memoizedProps))for(b=kh;b;)mh(a,b),b=rf(b.nextSibling);qh(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(y(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){kh=rf(a.nextSibling);break a}b--}else"$"!==c&&"$!"!==c&&"$?"!==c||b++}a=a.nextSibling}kh=null}}else kh=jh?rf(a.stateNode.nextSibling):null;return!0}
function sh(){kh=jh=null;lh=!1}var th=[];function uh(){for(var a=0;a<th.length;a++)th[a]._workInProgressVersionPrimary=null;th.length=0}var vh=ra.ReactCurrentDispatcher,wh=ra.ReactCurrentBatchConfig,xh=0,R=null,S=null,T=null,yh=!1,zh=!1;function Ah(){throw Error(y(321));}function Bh(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!He(a[c],b[c]))return!1;return!0}
function Ch(a,b,c,d,e,f){xh=f;R=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;vh.current=null===a||null===a.memoizedState?Dh:Eh;a=c(d,e);if(zh){f=0;do{zh=!1;if(!(25>f))throw Error(y(301));f+=1;T=S=null;b.updateQueue=null;vh.current=Fh;a=c(d,e)}while(zh)}vh.current=Gh;b=null!==S&&null!==S.next;xh=0;T=S=R=null;yh=!1;if(b)throw Error(y(300));return a}function Hh(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===T?R.memoizedState=T=a:T=T.next=a;return T}
function Ih(){if(null===S){var a=R.alternate;a=null!==a?a.memoizedState:null}else a=S.next;var b=null===T?R.memoizedState:T.next;if(null!==b)T=b,S=a;else{if(null===a)throw Error(y(310));S=a;a={memoizedState:S.memoizedState,baseState:S.baseState,baseQueue:S.baseQueue,queue:S.queue,next:null};null===T?R.memoizedState=T=a:T=T.next=a}return T}function Jh(a,b){return"function"===typeof b?b(a):b}
function Kh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=S,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g}d.baseQueue=e=f;c.pending=null}if(null!==e){e=e.next;d=d.baseState;var h=g=f=null,k=e;do{var l=k.lane;if((xh&l)===l)null!==h&&(h=h.next={lane:0,action:k.action,eagerReducer:k.eagerReducer,eagerState:k.eagerState,next:null}),d=k.eagerReducer===a?k.eagerState:a(d,k.action);else{var n={lane:l,action:k.action,eagerReducer:k.eagerReducer,
eagerState:k.eagerState,next:null};null===h?(g=h=n,f=d):h=h.next=n;R.lanes|=l;Dg|=l}k=k.next}while(null!==k&&k!==e);null===h?f=d:h.next=g;He(d,b.memoizedState)||(ug=!0);b.memoizedState=d;b.baseState=f;b.baseQueue=h;c.lastRenderedState=d}return[b.memoizedState,c.dispatch]}
function Lh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He(f,b.memoizedState)||(ug=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f}return[f,d]}
function Mh(a,b,c){var d=b._getVersion;d=d(b._source);var e=b._workInProgressVersionPrimary;if(null!==e)a=e===d;else if(a=a.mutableReadLanes,a=(xh&a)===a)b._workInProgressVersionPrimary=d,th.push(b);if(a)return c(b._source);th.push(b);throw Error(y(350));}
function Nh(a,b,c,d){var e=U;if(null===e)throw Error(y(349));var f=b._getVersion,g=f(b._source),h=vh.current,k=h.useState(function(){return Mh(e,b,c)}),l=k[1],n=k[0];k=T;var A=a.memoizedState,p=A.refs,C=p.getSnapshot,x=A.source;A=A.subscribe;var w=R;a.memoizedState={refs:p,source:b,subscribe:d};h.useEffect(function(){p.getSnapshot=c;p.setSnapshot=l;var a=f(b._source);if(!He(g,a)){a=c(b._source);He(n,a)||(l(a),a=Ig(w),e.mutableReadLanes|=a&e.pendingLanes);a=e.mutableReadLanes;e.entangledLanes|=a;for(var d=
e.entanglements,h=a;0<h;){var k=31-Vc(h),v=1<<k;d[k]|=a;h&=~v}}},[c,b,d]);h.useEffect(function(){return d(b._source,function(){var a=p.getSnapshot,c=p.setSnapshot;try{c(a(b._source));var d=Ig(w);e.mutableReadLanes|=d&e.pendingLanes}catch(q){c(function(){throw q;})}})},[b,d]);He(C,c)&&He(x,b)&&He(A,d)||(a={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:n},a.dispatch=l=Oh.bind(null,R,a),k.queue=a,k.baseQueue=null,n=Mh(e,b,c),k.memoizedState=k.baseState=n);return n}
function Ph(a,b,c){var d=Ih();return Nh(d,a,b,c)}function Qh(a){var b=Hh();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a=b.queue={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:a};a=a.dispatch=Oh.bind(null,R,a);return[b.memoizedState,a]}
function Rh(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=R.updateQueue;null===b?(b={lastEffect:null},R.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function Sh(a){var b=Hh();a={current:a};return b.memoizedState=a}function Th(){return Ih().memoizedState}function Uh(a,b,c,d){var e=Hh();R.flags|=a;e.memoizedState=Rh(1|b,c,void 0,void 0===d?null:d)}
function Vh(a,b,c,d){var e=Ih();d=void 0===d?null:d;var f=void 0;if(null!==S){var g=S.memoizedState;f=g.destroy;if(null!==d&&Bh(d,g.deps)){Rh(b,c,f,d);return}}R.flags|=a;e.memoizedState=Rh(1|b,c,f,d)}function Wh(a,b){return Uh(516,4,a,b)}function Xh(a,b){return Vh(516,4,a,b)}function Yh(a,b){return Vh(4,2,a,b)}function Zh(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}
function $h(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Vh(4,2,Zh.bind(null,b,a),c)}function ai(){}function bi(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}function ci(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}
function di(a,b){var c=eg();gg(98>c?98:c,function(){a(!0)});gg(97<c?97:c,function(){var c=wh.transition;wh.transition=1;try{a(!1),b()}finally{wh.transition=c}})}
function Oh(a,b,c){var d=Hg(),e=Ig(a),f={lane:e,action:c,eagerReducer:null,eagerState:null,next:null},g=b.pending;null===g?f.next=f:(f.next=g.next,g.next=f);b.pending=f;g=a.alternate;if(a===R||null!==g&&g===R)zh=yh=!0;else{if(0===a.lanes&&(null===g||0===g.lanes)&&(g=b.lastRenderedReducer,null!==g))try{var h=b.lastRenderedState,k=g(h,c);f.eagerReducer=g;f.eagerState=k;if(He(k,h))return}catch(l){}finally{}Jg(a,e,d)}}
var Gh={readContext:vg,useCallback:Ah,useContext:Ah,useEffect:Ah,useImperativeHandle:Ah,useLayoutEffect:Ah,useMemo:Ah,useReducer:Ah,useRef:Ah,useState:Ah,useDebugValue:Ah,useDeferredValue:Ah,useTransition:Ah,useMutableSource:Ah,useOpaqueIdentifier:Ah,unstable_isNewReconciler:!1},Dh={readContext:vg,useCallback:function(a,b){Hh().memoizedState=[a,void 0===b?null:b];return a},useContext:vg,useEffect:Wh,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Uh(4,2,Zh.bind(null,
b,a),c)},useLayoutEffect:function(a,b){return Uh(4,2,a,b)},useMemo:function(a,b){var c=Hh();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Hh();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a=d.queue={pending:null,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};a=a.dispatch=Oh.bind(null,R,a);return[d.memoizedState,a]},useRef:Sh,useState:Qh,useDebugValue:ai,useDeferredValue:function(a){var b=Qh(a),c=b[0],d=b[1];Wh(function(){var b=wh.transition;
wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Qh(!1),b=a[0];a=di.bind(null,a[1]);Sh(a);return[a,b]},useMutableSource:function(a,b,c){var d=Hh();d.memoizedState={refs:{getSnapshot:b,setSnapshot:null},source:a,subscribe:c};return Nh(d,a,b,c)},useOpaqueIdentifier:function(){if(lh){var a=!1,b=uf(function(){a||(a=!0,c("r:"+(tf++).toString(36)));throw Error(y(355));}),c=Qh(b)[1];0===(R.mode&2)&&(R.flags|=516,Rh(5,function(){c("r:"+(tf++).toString(36))},
void 0,null));return b}b="r:"+(tf++).toString(36);Qh(b);return b},unstable_isNewReconciler:!1},Eh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Kh,useRef:Th,useState:function(){return Kh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Kh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Kh(Jh)[0];return[Th().current,
a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Kh(Jh)[0]},unstable_isNewReconciler:!1},Fh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Lh,useRef:Th,useState:function(){return Lh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Lh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Lh(Jh)[0];return[Th().current,
a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Lh(Jh)[0]},unstable_isNewReconciler:!1},ei=ra.ReactCurrentOwner,ug=!1;function fi(a,b,c,d){b.child=null===a?Zg(b,null,c,d):Yg(b,a.child,c,d)}function gi(a,b,c,d,e){c=c.render;var f=b.ref;tg(b,e);d=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,d,e);return b.child}
function ii(a,b,c,d,e,f){if(null===a){var g=c.type;if("function"===typeof g&&!ji(g)&&void 0===g.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=g,ki(a,b,g,d,e,f);a=Vg(c.type,null,d,b,b.mode,f);a.ref=b.ref;a.return=b;return b.child=a}g=a.child;if(0===(e&f)&&(e=g.memoizedProps,c=c.compare,c=null!==c?c:Je,c(e,d)&&a.ref===b.ref))return hi(a,b,f);b.flags|=1;a=Tg(g,d);a.ref=b.ref;a.return=b;return b.child=a}
function ki(a,b,c,d,e,f){if(null!==a&&Je(a.memoizedProps,d)&&a.ref===b.ref)if(ug=!1,0!==(f&e))0!==(a.flags&16384)&&(ug=!0);else return b.lanes=a.lanes,hi(a,b,f);return li(a,b,c,d,f)}
function mi(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode||"unstable-defer-without-hiding"===d.mode)if(0===(b.mode&4))b.memoizedState={baseLanes:0},ni(b,c);else if(0!==(c&1073741824))b.memoizedState={baseLanes:0},ni(b,null!==f?f.baseLanes:c);else return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a},ni(b,a),null;else null!==f?(d=f.baseLanes|c,b.memoizedState=null):d=c,ni(b,d);fi(a,b,e,c);return b.child}
function oi(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=128}function li(a,b,c,d,e){var f=Ff(c)?Df:M.current;f=Ef(b,f);tg(b,e);c=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,c,e);return b.child}
function pi(a,b,c,d,e){if(Ff(c)){var f=!0;Jf(b)}else f=!1;tg(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),Mg(b,c,d),Og(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=vg(l):(l=Ff(c)?Df:M.current,l=Ef(b,l));var n=c.getDerivedStateFromProps,A="function"===typeof n||"function"===typeof g.getSnapshotBeforeUpdate;A||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&
"function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Ng(b,g,d,l);wg=!1;var p=b.memoizedState;g.state=p;Cg(b,d,g,e);k=b.memoizedState;h!==d||p!==k||N.current||wg?("function"===typeof n&&(Gg(b,c,n,d),k=b.memoizedState),(h=wg||Lg(b,c,h,d,p,k,l))?(A||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===
typeof g.componentDidMount&&(b.flags|=4)):("function"===typeof g.componentDidMount&&(b.flags|=4),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4),d=!1)}else{g=b.stateNode;yg(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:lg(b.type,h);g.props=l;A=b.pendingProps;p=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=vg(k):(k=Ff(c)?Df:M.current,k=Ef(b,k));var C=c.getDerivedStateFromProps;(n="function"===typeof C||
"function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==A||p!==k)&&Ng(b,g,d,k);wg=!1;p=b.memoizedState;g.state=p;Cg(b,d,g,e);var x=b.memoizedState;h!==A||p!==x||N.current||wg?("function"===typeof C&&(Gg(b,c,C,d),x=b.memoizedState),(l=wg||Lg(b,c,l,d,p,x,k))?(n||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,
x,k),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,x,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),b.memoizedProps=d,b.memoizedState=x),g.props=d,g.state=x,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||
h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),d=!1)}return qi(a,b,c,d,f,e)}
function qi(a,b,c,d,e,f){oi(a,b);var g=0!==(b.flags&64);if(!d&&!g)return e&&Kf(b,c,!1),hi(a,b,f);d=b.stateNode;ei.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Yg(b,a.child,null,f),b.child=Yg(b,null,h,f)):fi(a,b,h,f);b.memoizedState=d.state;e&&Kf(b,c,!0);return b.child}function ri(a){var b=a.stateNode;b.pendingContext?Hf(a,b.pendingContext,b.pendingContext!==b.context):b.context&&Hf(a,b.context,!1);eh(a,b.containerInfo)}
var si={dehydrated:null,retryLane:0};
function ti(a,b,c){var d=b.pendingProps,e=P.current,f=!1,g;(g=0!==(b.flags&64))||(g=null!==a&&null===a.memoizedState?!1:0!==(e&2));g?(f=!0,b.flags&=-65):null!==a&&null===a.memoizedState||void 0===d.fallback||!0===d.unstable_avoidThisFallback||(e|=1);I(P,e&1);if(null===a){void 0!==d.fallback&&ph(b);a=d.children;e=d.fallback;if(f)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},b.memoizedState=si,a;if("number"===typeof d.unstable_expectedLoadTime)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},
b.memoizedState=si,b.lanes=33554432,a;c=vi({mode:"visible",children:a},b.mode,c,null);c.return=b;return b.child=c}if(null!==a.memoizedState){if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:
{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}function ui(a,b,c,d){var e=a.mode,f=a.child;b={mode:"hidden",children:b};0===(e&2)&&null!==f?(f.childLanes=0,f.pendingProps=b):f=vi(b,e,0,null);c=Xg(c,e,d,null);f.return=a;c.return=a;f.sibling=c;a.child=f;return c}
function xi(a,b,c,d){var e=a.child;a=e.sibling;c=Tg(e,{mode:"visible",children:c});0===(b.mode&2)&&(c.lanes=d);c.return=b;c.sibling=null;null!==a&&(a.nextEffect=null,a.flags=8,b.firstEffect=b.lastEffect=a);return b.child=c}
function wi(a,b,c,d,e){var f=b.mode,g=a.child;a=g.sibling;var h={mode:"hidden",children:c};0===(f&2)&&b.child!==g?(c=b.child,c.childLanes=0,c.pendingProps=h,g=c.lastEffect,null!==g?(b.firstEffect=c.firstEffect,b.lastEffect=g,g.nextEffect=null):b.firstEffect=b.lastEffect=null):c=Tg(g,h);null!==a?d=Tg(a,d):(d=Xg(d,f,e,null),d.flags|=2);d.return=b;c.return=b;c.sibling=d;b.child=c;return d}function yi(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);sg(a.return,b)}
function zi(a,b,c,d,e,f){var g=a.memoizedState;null===g?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e,lastEffect:f}:(g.isBackwards=b,g.rendering=null,g.renderingStartTime=0,g.last=d,g.tail=c,g.tailMode=e,g.lastEffect=f)}
function Ai(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;fi(a,b,d.children,c);d=P.current;if(0!==(d&2))d=d&1|2,b.flags|=64;else{if(null!==a&&0!==(a.flags&64))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&yi(a,c);else if(19===a.tag)yi(a,c);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}d&=1}I(P,d);if(0===(b.mode&2))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===ih(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);zi(b,!1,e,c,f,b.lastEffect);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===ih(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a}zi(b,!0,c,null,f,b.lastEffect);break;case "together":zi(b,!1,null,null,void 0,b.lastEffect);break;default:b.memoizedState=null}return b.child}
function hi(a,b,c){null!==a&&(b.dependencies=a.dependencies);Dg|=b.lanes;if(0!==(c&b.childLanes)){if(null!==a&&b.child!==a.child)throw Error(y(153));if(null!==b.child){a=b.child;c=Tg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Tg(a,a.pendingProps),c.return=b;c.sibling=null}return b.child}return null}var Bi,Ci,Di,Ei;
Bi=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}};Ci=function(){};
Di=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;dh(ah.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "option":e=eb(a,e);d=eb(a,d);f=[];break;case "select":e=m({},e,{value:void 0});d=m({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=jf)}vb(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===
l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&(c||(c={}),c[g]="")}else"dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ca.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||
(c={}),c[g]=k[g])}else c||(f||(f=[]),f.push(l,c)),c=k;else"dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ca.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&G("scroll",a),f||h===k||(f=[])):"object"===typeof k&&null!==k&&k.$$typeof===Ga?k.toString():(f=f||[]).push(l,k))}c&&(f=f||[]).push("style",
c);var l=f;if(b.updateQueue=l)b.flags|=4}};Ei=function(a,b,c,d){c!==d&&(b.flags|=4)};function Fi(a,b){if(!lh)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null}}
function Gi(a,b,c){var d=b.pendingProps;switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return null;case 1:return Ff(b.type)&&Gf(),null;case 3:fh();H(N);H(M);uh();d=b.stateNode;d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)rh(b)?b.flags|=4:d.hydrate||(b.flags|=256);Ci(b);return null;case 5:hh(b);var e=dh(ch.current);c=b.type;if(null!==a&&null!=b.stateNode)Di(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=128);else{if(!d){if(null===
b.stateNode)throw Error(y(166));return null}a=dh(ah.current);if(rh(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[wf]=b;d[xf]=f;switch(c){case "dialog":G("cancel",d);G("close",d);break;case "iframe":case "object":case "embed":G("load",d);break;case "video":case "audio":for(a=0;a<Xe.length;a++)G(Xe[a],d);break;case "source":G("error",d);break;case "img":case "image":case "link":G("error",d);G("load",d);break;case "details":G("toggle",d);break;case "input":Za(d,f);G("invalid",d);break;case "select":d._wrapperState=
{wasMultiple:!!f.multiple};G("invalid",d);break;case "textarea":hb(d,f),G("invalid",d)}vb(c,f);a=null;for(var g in f)f.hasOwnProperty(g)&&(e=f[g],"children"===g?"string"===typeof e?d.textContent!==e&&(a=["children",e]):"number"===typeof e&&d.textContent!==""+e&&(a=["children",""+e]):ca.hasOwnProperty(g)&&null!=e&&"onScroll"===g&&G("scroll",d));switch(c){case "input":Va(d);cb(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=
jf)}d=a;b.updateQueue=d;null!==d&&(b.flags|=4)}else{g=9===e.nodeType?e:e.ownerDocument;a===kb.html&&(a=lb(c));a===kb.html?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[wf]=b;a[xf]=d;Bi(a,b,!1,!1);b.stateNode=a;g=wb(c,d);switch(c){case "dialog":G("cancel",a);G("close",a);
e=d;break;case "iframe":case "object":case "embed":G("load",a);e=d;break;case "video":case "audio":for(e=0;e<Xe.length;e++)G(Xe[e],a);e=d;break;case "source":G("error",a);e=d;break;case "img":case "image":case "link":G("error",a);G("load",a);e=d;break;case "details":G("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);G("invalid",a);break;case "option":e=eb(a,d);break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=m({},d,{value:void 0});G("invalid",a);break;case "textarea":hb(a,d);e=
gb(a,d);G("invalid",a);break;default:e=d}vb(c,e);var h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?tb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&ob(a,k)):"children"===f?"string"===typeof k?("textarea"!==c||""!==k)&&pb(a,k):"number"===typeof k&&pb(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ca.hasOwnProperty(f)?null!=k&&"onScroll"===f&&G("scroll",a):null!=k&&qa(a,f,k,g))}switch(c){case "input":Va(a);cb(a,d,!1);
break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,!0);break;default:"function"===typeof e.onClick&&(a.onclick=jf)}mf(c,d)&&(b.flags|=4)}null!==b.ref&&(b.flags|=128)}return null;case 6:if(a&&null!=b.stateNode)Ei(a,b,a.memoizedProps,d);else{if("string"!==typeof d&&null===b.stateNode)throw Error(y(166));
c=dh(ch.current);dh(ah.current);rh(b)?(d=b.stateNode,c=b.memoizedProps,d[wf]=b,d.nodeValue!==c&&(b.flags|=4)):(d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[wf]=b,b.stateNode=d)}return null;case 13:H(P);d=b.memoizedState;if(0!==(b.flags&64))return b.lanes=c,b;d=null!==d;c=!1;null===a?void 0!==b.memoizedProps.fallback&&rh(b):c=null!==a.memoizedState;if(d&&!c&&0!==(b.mode&2))if(null===a&&!0!==b.memoizedProps.unstable_avoidThisFallback||0!==(P.current&1))0===V&&(V=3);else{if(0===V||3===V)V=
4;null===U||0===(Dg&134217727)&&0===(Hi&134217727)||Ii(U,W)}if(d||c)b.flags|=4;return null;case 4:return fh(),Ci(b),null===a&&cf(b.stateNode.containerInfo),null;case 10:return rg(b),null;case 17:return Ff(b.type)&&Gf(),null;case 19:H(P);d=b.memoizedState;if(null===d)return null;f=0!==(b.flags&64);g=d.rendering;if(null===g)if(f)Fi(d,!1);else{if(0!==V||null!==a&&0!==(a.flags&64))for(a=b.child;null!==a;){g=ih(a);if(null!==g){b.flags|=64;Fi(d,!1);f=g.updateQueue;null!==f&&(b.updateQueue=f,b.flags|=4);
null===d.lastEffect&&(b.firstEffect=null);b.lastEffect=d.lastEffect;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=2,f.nextEffect=null,f.firstEffect=null,f.lastEffect=null,g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,
f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;I(P,P.current&1|2);return b.child}a=a.sibling}null!==d.tail&&O()>Ji&&(b.flags|=64,f=!0,Fi(d,!1),b.lanes=33554432)}else{if(!f)if(a=ih(g),null!==a){if(b.flags|=64,f=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Fi(d,!0),null===d.tail&&"hidden"===d.tailMode&&!g.alternate&&!lh)return b=b.lastEffect=d.lastEffect,null!==b&&(b.nextEffect=null),null}else 2*O()-d.renderingStartTime>Ji&&1073741824!==c&&(b.flags|=
64,f=!0,Fi(d,!1),b.lanes=33554432);d.isBackwards?(g.sibling=b.child,b.child=g):(c=d.last,null!==c?c.sibling=g:b.child=g,d.last=g)}return null!==d.tail?(c=d.tail,d.rendering=c,d.tail=c.sibling,d.lastEffect=b.lastEffect,d.renderingStartTime=O(),c.sibling=null,b=P.current,I(P,f?b&1|2:b&1),c):null;case 23:case 24:return Ki(),null!==a&&null!==a.memoizedState!==(null!==b.memoizedState)&&"unstable-defer-without-hiding"!==d.mode&&(b.flags|=4),null}throw Error(y(156,b.tag));}
function Li(a){switch(a.tag){case 1:Ff(a.type)&&Gf();var b=a.flags;return b&4096?(a.flags=b&-4097|64,a):null;case 3:fh();H(N);H(M);uh();b=a.flags;if(0!==(b&64))throw Error(y(285));a.flags=b&-4097|64;return a;case 5:return hh(a),null;case 13:return H(P),b=a.flags,b&4096?(a.flags=b&-4097|64,a):null;case 19:return H(P),null;case 4:return fh(),null;case 10:return rg(a),null;case 23:case 24:return Ki(),null;default:return null}}
function Mi(a,b){try{var c="",d=b;do c+=Qa(d),d=d.return;while(d);var e=c}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack}return{value:a,source:b,stack:e}}function Ni(a,b){try{console.error(b.value)}catch(c){setTimeout(function(){throw c;})}}var Oi="function"===typeof WeakMap?WeakMap:Map;function Pi(a,b,c){c=zg(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Qi||(Qi=!0,Ri=d);Ni(a,b)};return c}
function Si(a,b,c){c=zg(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){Ni(a,b);return d(e)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){"function"!==typeof d&&(null===Ti?Ti=new Set([this]):Ti.add(this),Ni(a,b));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""})});return c}var Ui="function"===typeof WeakSet?WeakSet:Set;
function Vi(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null)}catch(c){Wi(a,c)}else b.current=null}function Xi(a,b){switch(b.tag){case 0:case 11:case 15:case 22:return;case 1:if(b.flags&256&&null!==a){var c=a.memoizedProps,d=a.memoizedState;a=b.stateNode;b=a.getSnapshotBeforeUpdate(b.elementType===b.type?c:lg(b.type,c),d);a.__reactInternalSnapshotBeforeUpdate=b}return;case 3:b.flags&256&&qf(b.stateNode.containerInfo);return;case 5:case 6:case 4:case 17:return}throw Error(y(163));}
function Yi(a,b,c){switch(c.tag){case 0:case 11:case 15:case 22:b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{if(3===(a.tag&3)){var d=a.create;a.destroy=d()}a=a.next}while(a!==b)}b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{var e=a;d=e.next;e=e.tag;0!==(e&4)&&0!==(e&1)&&(Zi(c,a),$i(c,a));a=d}while(a!==b)}return;case 1:a=c.stateNode;c.flags&4&&(null===b?a.componentDidMount():(d=c.elementType===c.type?b.memoizedProps:lg(c.type,b.memoizedProps),a.componentDidUpdate(d,
b.memoizedState,a.__reactInternalSnapshotBeforeUpdate)));b=c.updateQueue;null!==b&&Eg(c,b,a);return;case 3:b=c.updateQueue;if(null!==b){a=null;if(null!==c.child)switch(c.child.tag){case 5:a=c.child.stateNode;break;case 1:a=c.child.stateNode}Eg(c,b,a)}return;case 5:a=c.stateNode;null===b&&c.flags&4&&mf(c.type,c.memoizedProps)&&a.focus();return;case 6:return;case 4:return;case 12:return;case 13:null===c.memoizedState&&(c=c.alternate,null!==c&&(c=c.memoizedState,null!==c&&(c=c.dehydrated,null!==c&&Cc(c))));
return;case 19:case 17:case 20:case 21:case 23:case 24:return}throw Error(y(163));}
function aj(a,b){for(var c=a;;){if(5===c.tag){var d=c.stateNode;if(b)d=d.style,"function"===typeof d.setProperty?d.setProperty("display","none","important"):d.display="none";else{d=c.stateNode;var e=c.memoizedProps.style;e=void 0!==e&&null!==e&&e.hasOwnProperty("display")?e.display:null;d.style.display=sb("display",e)}}else if(6===c.tag)c.stateNode.nodeValue=b?"":c.memoizedProps;else if((23!==c.tag&&24!==c.tag||null===c.memoizedState||c===a)&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===
a)break;for(;null===c.sibling;){if(null===c.return||c.return===a)return;c=c.return}c.sibling.return=c.return;c=c.sibling}}
function bj(a,b){if(Mf&&"function"===typeof Mf.onCommitFiberUnmount)try{Mf.onCommitFiberUnmount(Lf,b)}catch(f){}switch(b.tag){case 0:case 11:case 14:case 15:case 22:a=b.updateQueue;if(null!==a&&(a=a.lastEffect,null!==a)){var c=a=a.next;do{var d=c,e=d.destroy;d=d.tag;if(void 0!==e)if(0!==(d&4))Zi(b,c);else{d=b;try{e()}catch(f){Wi(d,f)}}c=c.next}while(c!==a)}break;case 1:Vi(b);a=b.stateNode;if("function"===typeof a.componentWillUnmount)try{a.props=b.memoizedProps,a.state=b.memoizedState,a.componentWillUnmount()}catch(f){Wi(b,
f)}break;case 5:Vi(b);break;case 4:cj(a,b)}}function dj(a){a.alternate=null;a.child=null;a.dependencies=null;a.firstEffect=null;a.lastEffect=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.return=null;a.updateQueue=null}function ej(a){return 5===a.tag||3===a.tag||4===a.tag}
function fj(a){a:{for(var b=a.return;null!==b;){if(ej(b))break a;b=b.return}throw Error(y(160));}var c=b;b=c.stateNode;switch(c.tag){case 5:var d=!1;break;case 3:b=b.containerInfo;d=!0;break;case 4:b=b.containerInfo;d=!0;break;default:throw Error(y(161));}c.flags&16&&(pb(b,""),c.flags&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||ej(c.return)){c=null;break a}c=c.return}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag&&18!==c.tag;){if(c.flags&2)continue b;if(null===
c.child||4===c.tag)continue b;else c.child.return=c,c=c.child}if(!(c.flags&2)){c=c.stateNode;break a}}d?gj(a,c,b):hj(a,c,b)}
function gj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=jf));else if(4!==d&&(a=a.child,null!==a))for(gj(a,b,c),a=a.sibling;null!==a;)gj(a,b,c),a=a.sibling}
function hj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(hj(a,b,c),a=a.sibling;null!==a;)hj(a,b,c),a=a.sibling}
function cj(a,b){for(var c=b,d=!1,e,f;;){if(!d){d=c.return;a:for(;;){if(null===d)throw Error(y(160));e=d.stateNode;switch(d.tag){case 5:f=!1;break a;case 3:e=e.containerInfo;f=!0;break a;case 4:e=e.containerInfo;f=!0;break a}d=d.return}d=!0}if(5===c.tag||6===c.tag){a:for(var g=a,h=c,k=h;;)if(bj(g,k),null!==k.child&&4!==k.tag)k.child.return=k,k=k.child;else{if(k===h)break a;for(;null===k.sibling;){if(null===k.return||k.return===h)break a;k=k.return}k.sibling.return=k.return;k=k.sibling}f?(g=e,h=c.stateNode,
8===g.nodeType?g.parentNode.removeChild(h):g.removeChild(h)):e.removeChild(c.stateNode)}else if(4===c.tag){if(null!==c.child){e=c.stateNode.containerInfo;f=!0;c.child.return=c;c=c.child;continue}}else if(bj(a,c),null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;4===c.tag&&(d=!1)}c.sibling.return=c.return;c=c.sibling}}
function ij(a,b){switch(b.tag){case 0:case 11:case 14:case 15:case 22:var c=b.updateQueue;c=null!==c?c.lastEffect:null;if(null!==c){var d=c=c.next;do 3===(d.tag&3)&&(a=d.destroy,d.destroy=void 0,void 0!==a&&a()),d=d.next;while(d!==c)}return;case 1:return;case 5:c=b.stateNode;if(null!=c){d=b.memoizedProps;var e=null!==a?a.memoizedProps:d;a=b.type;var f=b.updateQueue;b.updateQueue=null;if(null!==f){c[xf]=d;"input"===a&&"radio"===d.type&&null!=d.name&&$a(c,d);wb(a,e);b=wb(a,d);for(e=0;e<f.length;e+=
2){var g=f[e],h=f[e+1];"style"===g?tb(c,h):"dangerouslySetInnerHTML"===g?ob(c,h):"children"===g?pb(c,h):qa(c,g,h,b)}switch(a){case "input":ab(c,d);break;case "textarea":ib(c,d);break;case "select":a=c._wrapperState.wasMultiple,c._wrapperState.wasMultiple=!!d.multiple,f=d.value,null!=f?fb(c,!!d.multiple,f,!1):a!==!!d.multiple&&(null!=d.defaultValue?fb(c,!!d.multiple,d.defaultValue,!0):fb(c,!!d.multiple,d.multiple?[]:"",!1))}}}return;case 6:if(null===b.stateNode)throw Error(y(162));b.stateNode.nodeValue=
b.memoizedProps;return;case 3:c=b.stateNode;c.hydrate&&(c.hydrate=!1,Cc(c.containerInfo));return;case 12:return;case 13:null!==b.memoizedState&&(jj=O(),aj(b.child,!0));kj(b);return;case 19:kj(b);return;case 17:return;case 23:case 24:aj(b,null!==b.memoizedState);return}throw Error(y(163));}function kj(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Ui);b.forEach(function(b){var d=lj.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d))})}}
function mj(a,b){return null!==a&&(a=a.memoizedState,null===a||null!==a.dehydrated)?(b=b.memoizedState,null!==b&&null===b.dehydrated):!1}var nj=Math.ceil,oj=ra.ReactCurrentDispatcher,pj=ra.ReactCurrentOwner,X=0,U=null,Y=null,W=0,qj=0,rj=Bf(0),V=0,sj=null,tj=0,Dg=0,Hi=0,uj=0,vj=null,jj=0,Ji=Infinity;function wj(){Ji=O()+500}var Z=null,Qi=!1,Ri=null,Ti=null,xj=!1,yj=null,zj=90,Aj=[],Bj=[],Cj=null,Dj=0,Ej=null,Fj=-1,Gj=0,Hj=0,Ij=null,Jj=!1;function Hg(){return 0!==(X&48)?O():-1!==Fj?Fj:Fj=O()}
function Ig(a){a=a.mode;if(0===(a&2))return 1;if(0===(a&4))return 99===eg()?1:2;0===Gj&&(Gj=tj);if(0!==kg.transition){0!==Hj&&(Hj=null!==vj?vj.pendingLanes:0);a=Gj;var b=4186112&~Hj;b&=-b;0===b&&(a=4186112&~a,b=a&-a,0===b&&(b=8192));return b}a=eg();0!==(X&4)&&98===a?a=Xc(12,Gj):(a=Sc(a),a=Xc(a,Gj));return a}
function Jg(a,b,c){if(50<Dj)throw Dj=0,Ej=null,Error(y(185));a=Kj(a,b);if(null===a)return null;$c(a,b,c);a===U&&(Hi|=b,4===V&&Ii(a,W));var d=eg();1===b?0!==(X&8)&&0===(X&48)?Lj(a):(Mj(a,c),0===X&&(wj(),ig())):(0===(X&4)||98!==d&&99!==d||(null===Cj?Cj=new Set([a]):Cj.add(a)),Mj(a,c));vj=a}function Kj(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}
function Mj(a,b){for(var c=a.callbackNode,d=a.suspendedLanes,e=a.pingedLanes,f=a.expirationTimes,g=a.pendingLanes;0<g;){var h=31-Vc(g),k=1<<h,l=f[h];if(-1===l){if(0===(k&d)||0!==(k&e)){l=b;Rc(k);var n=F;f[h]=10<=n?l+250:6<=n?l+5E3:-1}}else l<=b&&(a.expiredLanes|=k);g&=~k}d=Uc(a,a===U?W:0);b=F;if(0===d)null!==c&&(c!==Zf&&Pf(c),a.callbackNode=null,a.callbackPriority=0);else{if(null!==c){if(a.callbackPriority===b)return;c!==Zf&&Pf(c)}15===b?(c=Lj.bind(null,a),null===ag?(ag=[c],bg=Of(Uf,jg)):ag.push(c),
c=Zf):14===b?c=hg(99,Lj.bind(null,a)):(c=Tc(b),c=hg(c,Nj.bind(null,a)));a.callbackPriority=b;a.callbackNode=c}}
function Nj(a){Fj=-1;Hj=Gj=0;if(0!==(X&48))throw Error(y(327));var b=a.callbackNode;if(Oj()&&a.callbackNode!==b)return null;var c=Uc(a,a===U?W:0);if(0===c)return null;var d=c;var e=X;X|=16;var f=Pj();if(U!==a||W!==d)wj(),Qj(a,d);do try{Rj();break}catch(h){Sj(a,h)}while(1);qg();oj.current=f;X=e;null!==Y?d=0:(U=null,W=0,d=V);if(0!==(tj&Hi))Qj(a,0);else if(0!==d){2===d&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),c=Wc(a),0!==c&&(d=Tj(a,c)));if(1===d)throw b=sj,Qj(a,0),Ii(a,c),Mj(a,O()),b;a.finishedWork=
a.current.alternate;a.finishedLanes=c;switch(d){case 0:case 1:throw Error(y(345));case 2:Uj(a);break;case 3:Ii(a,c);if((c&62914560)===c&&(d=jj+500-O(),10<d)){if(0!==Uc(a,0))break;e=a.suspendedLanes;if((e&c)!==c){Hg();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=of(Uj.bind(null,a),d);break}Uj(a);break;case 4:Ii(a,c);if((c&4186112)===c)break;d=a.eventTimes;for(e=-1;0<c;){var g=31-Vc(c);f=1<<g;g=d[g];g>e&&(e=g);c&=~f}c=e;c=O()-c;c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3E3>c?3E3:4320>
c?4320:1960*nj(c/1960))-c;if(10<c){a.timeoutHandle=of(Uj.bind(null,a),c);break}Uj(a);break;case 5:Uj(a);break;default:throw Error(y(329));}}Mj(a,O());return a.callbackNode===b?Nj.bind(null,a):null}function Ii(a,b){b&=~uj;b&=~Hi;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-Vc(b),d=1<<c;a[c]=-1;b&=~d}}
function Lj(a){if(0!==(X&48))throw Error(y(327));Oj();if(a===U&&0!==(a.expiredLanes&W)){var b=W;var c=Tj(a,b);0!==(tj&Hi)&&(b=Uc(a,b),c=Tj(a,b))}else b=Uc(a,0),c=Tj(a,b);0!==a.tag&&2===c&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),b=Wc(a),0!==b&&(c=Tj(a,b)));if(1===c)throw c=sj,Qj(a,0),Ii(a,b),Mj(a,O()),c;a.finishedWork=a.current.alternate;a.finishedLanes=b;Uj(a);Mj(a,O());return null}
function Vj(){if(null!==Cj){var a=Cj;Cj=null;a.forEach(function(a){a.expiredLanes|=24&a.pendingLanes;Mj(a,O())})}ig()}function Wj(a,b){var c=X;X|=1;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}}function Xj(a,b){var c=X;X&=-2;X|=8;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}}function ni(a,b){I(rj,qj);qj|=b;tj|=b}function Ki(){qj=rj.current;H(rj)}
function Qj(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,pf(c));if(null!==Y)for(c=Y.return;null!==c;){var d=c;switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&Gf();break;case 3:fh();H(N);H(M);uh();break;case 5:hh(d);break;case 4:fh();break;case 13:H(P);break;case 19:H(P);break;case 10:rg(d);break;case 23:case 24:Ki()}c=c.return}U=a;Y=Tg(a.current,null);W=qj=tj=b;V=0;sj=null;uj=Hi=Dg=0}
function Sj(a,b){do{var c=Y;try{qg();vh.current=Gh;if(yh){for(var d=R.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next}yh=!1}xh=0;T=S=R=null;zh=!1;pj.current=null;if(null===c||null===c.return){V=1;sj=b;Y=null;break}a:{var f=a,g=c.return,h=c,k=b;b=W;h.flags|=2048;h.firstEffect=h.lastEffect=null;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k;if(0===(h.mode&2)){var n=h.alternate;n?(h.updateQueue=n.updateQueue,h.memoizedState=n.memoizedState,h.lanes=n.lanes):
(h.updateQueue=null,h.memoizedState=null)}var A=0!==(P.current&1),p=g;do{var C;if(C=13===p.tag){var x=p.memoizedState;if(null!==x)C=null!==x.dehydrated?!0:!1;else{var w=p.memoizedProps;C=void 0===w.fallback?!1:!0!==w.unstable_avoidThisFallback?!0:A?!1:!0}}if(C){var z=p.updateQueue;if(null===z){var u=new Set;u.add(l);p.updateQueue=u}else z.add(l);if(0===(p.mode&2)){p.flags|=64;h.flags|=16384;h.flags&=-2981;if(1===h.tag)if(null===h.alternate)h.tag=17;else{var t=zg(-1,1);t.tag=2;Ag(h,t)}h.lanes|=1;break a}k=
void 0;h=b;var q=f.pingCache;null===q?(q=f.pingCache=new Oi,k=new Set,q.set(l,k)):(k=q.get(l),void 0===k&&(k=new Set,q.set(l,k)));if(!k.has(h)){k.add(h);var v=Yj.bind(null,f,l,h);l.then(v,v)}p.flags|=4096;p.lanes=b;break a}p=p.return}while(null!==p);k=Error((Ra(h.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.")}5!==V&&(V=2);k=Mi(k,h);p=
g;do{switch(p.tag){case 3:f=k;p.flags|=4096;b&=-b;p.lanes|=b;var J=Pi(p,f,b);Bg(p,J);break a;case 1:f=k;var K=p.type,Q=p.stateNode;if(0===(p.flags&64)&&("function"===typeof K.getDerivedStateFromError||null!==Q&&"function"===typeof Q.componentDidCatch&&(null===Ti||!Ti.has(Q)))){p.flags|=4096;b&=-b;p.lanes|=b;var L=Si(p,f,b);Bg(p,L);break a}}p=p.return}while(null!==p)}Zj(c)}catch(va){b=va;Y===c&&null!==c&&(Y=c=c.return);continue}break}while(1)}
function Pj(){var a=oj.current;oj.current=Gh;return null===a?Gh:a}function Tj(a,b){var c=X;X|=16;var d=Pj();U===a&&W===b||Qj(a,b);do try{ak();break}catch(e){Sj(a,e)}while(1);qg();X=c;oj.current=d;if(null!==Y)throw Error(y(261));U=null;W=0;return V}function ak(){for(;null!==Y;)bk(Y)}function Rj(){for(;null!==Y&&!Qf();)bk(Y)}function bk(a){var b=ck(a.alternate,a,qj);a.memoizedProps=a.pendingProps;null===b?Zj(a):Y=b;pj.current=null}
function Zj(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&2048)){c=Gi(c,b,qj);if(null!==c){Y=c;return}c=b;if(24!==c.tag&&23!==c.tag||null===c.memoizedState||0!==(qj&1073741824)||0===(c.mode&4)){for(var d=0,e=c.child;null!==e;)d|=e.lanes|e.childLanes,e=e.sibling;c.childLanes=d}null!==a&&0===(a.flags&2048)&&(null===a.firstEffect&&(a.firstEffect=b.firstEffect),null!==b.lastEffect&&(null!==a.lastEffect&&(a.lastEffect.nextEffect=b.firstEffect),a.lastEffect=b.lastEffect),1<b.flags&&(null!==
a.lastEffect?a.lastEffect.nextEffect=b:a.firstEffect=b,a.lastEffect=b))}else{c=Li(b);if(null!==c){c.flags&=2047;Y=c;return}null!==a&&(a.firstEffect=a.lastEffect=null,a.flags|=2048)}b=b.sibling;if(null!==b){Y=b;return}Y=b=a}while(null!==b);0===V&&(V=5)}function Uj(a){var b=eg();gg(99,dk.bind(null,a,b));return null}
function dk(a,b){do Oj();while(null!==yj);if(0!==(X&48))throw Error(y(327));var c=a.finishedWork;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(y(177));a.callbackNode=null;var d=c.lanes|c.childLanes,e=d,f=a.pendingLanes&~e;a.pendingLanes=e;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=e;a.mutableReadLanes&=e;a.entangledLanes&=e;e=a.entanglements;for(var g=a.eventTimes,h=a.expirationTimes;0<f;){var k=31-Vc(f),l=1<<k;e[k]=0;g[k]=-1;h[k]=-1;f&=~l}null!==
Cj&&0===(d&24)&&Cj.has(a)&&Cj.delete(a);a===U&&(Y=U=null,W=0);1<c.flags?null!==c.lastEffect?(c.lastEffect.nextEffect=c,d=c.firstEffect):d=c:d=c.firstEffect;if(null!==d){e=X;X|=32;pj.current=null;kf=fd;g=Ne();if(Oe(g)){if("selectionStart"in g)h={start:g.selectionStart,end:g.selectionEnd};else a:if(h=(h=g.ownerDocument)&&h.defaultView||window,(l=h.getSelection&&h.getSelection())&&0!==l.rangeCount){h=l.anchorNode;f=l.anchorOffset;k=l.focusNode;l=l.focusOffset;try{h.nodeType,k.nodeType}catch(va){h=null;
break a}var n=0,A=-1,p=-1,C=0,x=0,w=g,z=null;b:for(;;){for(var u;;){w!==h||0!==f&&3!==w.nodeType||(A=n+f);w!==k||0!==l&&3!==w.nodeType||(p=n+l);3===w.nodeType&&(n+=w.nodeValue.length);if(null===(u=w.firstChild))break;z=w;w=u}for(;;){if(w===g)break b;z===h&&++C===f&&(A=n);z===k&&++x===l&&(p=n);if(null!==(u=w.nextSibling))break;w=z;z=w.parentNode}w=u}h=-1===A||-1===p?null:{start:A,end:p}}else h=null;h=h||{start:0,end:0}}else h=null;lf={focusedElem:g,selectionRange:h};fd=!1;Ij=null;Jj=!1;Z=d;do try{ek()}catch(va){if(null===
Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);Ij=null;Z=d;do try{for(g=a;null!==Z;){var t=Z.flags;t&16&&pb(Z.stateNode,"");if(t&128){var q=Z.alternate;if(null!==q){var v=q.ref;null!==v&&("function"===typeof v?v(null):v.current=null)}}switch(t&1038){case 2:fj(Z);Z.flags&=-3;break;case 6:fj(Z);Z.flags&=-3;ij(Z.alternate,Z);break;case 1024:Z.flags&=-1025;break;case 1028:Z.flags&=-1025;ij(Z.alternate,Z);break;case 4:ij(Z.alternate,Z);break;case 8:h=Z;cj(g,h);var J=h.alternate;dj(h);null!==
J&&dj(J)}Z=Z.nextEffect}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);v=lf;q=Ne();t=v.focusedElem;g=v.selectionRange;if(q!==t&&t&&t.ownerDocument&&Me(t.ownerDocument.documentElement,t)){null!==g&&Oe(t)&&(q=g.start,v=g.end,void 0===v&&(v=q),"selectionStart"in t?(t.selectionStart=q,t.selectionEnd=Math.min(v,t.value.length)):(v=(q=t.ownerDocument||document)&&q.defaultView||window,v.getSelection&&(v=v.getSelection(),h=t.textContent.length,J=Math.min(g.start,h),g=void 0===
g.end?J:Math.min(g.end,h),!v.extend&&J>g&&(h=g,g=J,J=h),h=Le(t,J),f=Le(t,g),h&&f&&(1!==v.rangeCount||v.anchorNode!==h.node||v.anchorOffset!==h.offset||v.focusNode!==f.node||v.focusOffset!==f.offset)&&(q=q.createRange(),q.setStart(h.node,h.offset),v.removeAllRanges(),J>g?(v.addRange(q),v.extend(f.node,f.offset)):(q.setEnd(f.node,f.offset),v.addRange(q))))));q=[];for(v=t;v=v.parentNode;)1===v.nodeType&&q.push({element:v,left:v.scrollLeft,top:v.scrollTop});"function"===typeof t.focus&&t.focus();for(t=
0;t<q.length;t++)v=q[t],v.element.scrollLeft=v.left,v.element.scrollTop=v.top}fd=!!kf;lf=kf=null;a.current=c;Z=d;do try{for(t=a;null!==Z;){var K=Z.flags;K&36&&Yi(t,Z.alternate,Z);if(K&128){q=void 0;var Q=Z.ref;if(null!==Q){var L=Z.stateNode;switch(Z.tag){case 5:q=L;break;default:q=L}"function"===typeof Q?Q(q):Q.current=q}}Z=Z.nextEffect}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);Z=null;$f();X=e}else a.current=c;if(xj)xj=!1,yj=a,zj=b;else for(Z=d;null!==Z;)b=
Z.nextEffect,Z.nextEffect=null,Z.flags&8&&(K=Z,K.sibling=null,K.stateNode=null),Z=b;d=a.pendingLanes;0===d&&(Ti=null);1===d?a===Ej?Dj++:(Dj=0,Ej=a):Dj=0;c=c.stateNode;if(Mf&&"function"===typeof Mf.onCommitFiberRoot)try{Mf.onCommitFiberRoot(Lf,c,void 0,64===(c.current.flags&64))}catch(va){}Mj(a,O());if(Qi)throw Qi=!1,a=Ri,Ri=null,a;if(0!==(X&8))return null;ig();return null}
function ek(){for(;null!==Z;){var a=Z.alternate;Jj||null===Ij||(0!==(Z.flags&8)?dc(Z,Ij)&&(Jj=!0):13===Z.tag&&mj(a,Z)&&dc(Z,Ij)&&(Jj=!0));var b=Z.flags;0!==(b&256)&&Xi(a,Z);0===(b&512)||xj||(xj=!0,hg(97,function(){Oj();return null}));Z=Z.nextEffect}}function Oj(){if(90!==zj){var a=97<zj?97:zj;zj=90;return gg(a,fk)}return!1}function $i(a,b){Aj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}))}function Zi(a,b){Bj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}))}
function fk(){if(null===yj)return!1;var a=yj;yj=null;if(0!==(X&48))throw Error(y(331));var b=X;X|=32;var c=Bj;Bj=[];for(var d=0;d<c.length;d+=2){var e=c[d],f=c[d+1],g=e.destroy;e.destroy=void 0;if("function"===typeof g)try{g()}catch(k){if(null===f)throw Error(y(330));Wi(f,k)}}c=Aj;Aj=[];for(d=0;d<c.length;d+=2){e=c[d];f=c[d+1];try{var h=e.create;e.destroy=h()}catch(k){if(null===f)throw Error(y(330));Wi(f,k)}}for(h=a.current.firstEffect;null!==h;)a=h.nextEffect,h.nextEffect=null,h.flags&8&&(h.sibling=
null,h.stateNode=null),h=a;X=b;ig();return!0}function gk(a,b,c){b=Mi(c,b);b=Pi(a,b,1);Ag(a,b);b=Hg();a=Kj(a,1);null!==a&&($c(a,1,b),Mj(a,b))}
function Wi(a,b){if(3===a.tag)gk(a,a,b);else for(var c=a.return;null!==c;){if(3===c.tag){gk(c,a,b);break}else if(1===c.tag){var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d))){a=Mi(b,a);var e=Si(c,a,1);Ag(c,e);e=Hg();c=Kj(c,1);if(null!==c)$c(c,1,e),Mj(c,e);else if("function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d)))try{d.componentDidCatch(b,a)}catch(f){}break}}c=c.return}}
function Yj(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=Hg();a.pingedLanes|=a.suspendedLanes&c;U===a&&(W&c)===c&&(4===V||3===V&&(W&62914560)===W&&500>O()-jj?Qj(a,0):uj|=c);Mj(a,b)}function lj(a,b){var c=a.stateNode;null!==c&&c.delete(b);b=0;0===b&&(b=a.mode,0===(b&2)?b=1:0===(b&4)?b=99===eg()?1:2:(0===Gj&&(Gj=tj),b=Yc(62914560&~Gj),0===b&&(b=4194304)));c=Hg();a=Kj(a,b);null!==a&&($c(a,b,c),Mj(a,c))}var ck;
ck=function(a,b,c){var d=b.lanes;if(null!==a)if(a.memoizedProps!==b.pendingProps||N.current)ug=!0;else if(0!==(c&d))ug=0!==(a.flags&16384)?!0:!1;else{ug=!1;switch(b.tag){case 3:ri(b);sh();break;case 5:gh(b);break;case 1:Ff(b.type)&&Jf(b);break;case 4:eh(b,b.stateNode.containerInfo);break;case 10:d=b.memoizedProps.value;var e=b.type._context;I(mg,e._currentValue);e._currentValue=d;break;case 13:if(null!==b.memoizedState){if(0!==(c&b.child.childLanes))return ti(a,b,c);I(P,P.current&1);b=hi(a,b,c);return null!==
b?b.sibling:null}I(P,P.current&1);break;case 19:d=0!==(c&b.childLanes);if(0!==(a.flags&64)){if(d)return Ai(a,b,c);b.flags|=64}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);I(P,P.current);if(d)break;else return null;case 23:case 24:return b.lanes=0,mi(a,b,c)}return hi(a,b,c)}else ug=!1;b.lanes=0;switch(b.tag){case 2:d=b.type;null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);a=b.pendingProps;e=Ef(b,M.current);tg(b,c);e=Ch(null,b,d,a,e,c);b.flags|=1;if("object"===
typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof){b.tag=1;b.memoizedState=null;b.updateQueue=null;if(Ff(d)){var f=!0;Jf(b)}else f=!1;b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null;xg(b);var g=d.getDerivedStateFromProps;"function"===typeof g&&Gg(b,d,g,a);e.updater=Kg;b.stateNode=e;e._reactInternals=b;Og(b,d,a,c);b=qi(null,b,d,!0,f,c)}else b.tag=0,fi(null,b,e,c),b=b.child;return b;case 16:e=b.elementType;a:{null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);
a=b.pendingProps;f=e._init;e=f(e._payload);b.type=e;f=b.tag=hk(e);a=lg(e,a);switch(f){case 0:b=li(null,b,e,a,c);break a;case 1:b=pi(null,b,e,a,c);break a;case 11:b=gi(null,b,e,a,c);break a;case 14:b=ii(null,b,e,lg(e.type,a),d,c);break a}throw Error(y(306,e,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),li(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),pi(a,b,d,e,c);case 3:ri(b);d=b.updateQueue;if(null===a||null===d)throw Error(y(282));
d=b.pendingProps;e=b.memoizedState;e=null!==e?e.element:null;yg(a,b);Cg(b,d,null,c);d=b.memoizedState.element;if(d===e)sh(),b=hi(a,b,c);else{e=b.stateNode;if(f=e.hydrate)kh=rf(b.stateNode.containerInfo.firstChild),jh=b,f=lh=!0;if(f){a=e.mutableSourceEagerHydrationData;if(null!=a)for(e=0;e<a.length;e+=2)f=a[e],f._workInProgressVersionPrimary=a[e+1],th.push(f);c=Zg(b,null,d,c);for(b.child=c;c;)c.flags=c.flags&-3|1024,c=c.sibling}else fi(a,b,d,c),sh();b=b.child}return b;case 5:return gh(b),null===a&&
ph(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,nf(d,e)?g=null:null!==f&&nf(d,f)&&(b.flags|=16),oi(a,b),fi(a,b,g,c),b.child;case 6:return null===a&&ph(b),null;case 13:return ti(a,b,c);case 4:return eh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Yg(b,null,d,c):fi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),gi(a,b,d,e,c);case 7:return fi(a,b,b.pendingProps,c),b.child;case 8:return fi(a,b,b.pendingProps.children,
c),b.child;case 12:return fi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;g=b.memoizedProps;f=e.value;var h=b.type._context;I(mg,h._currentValue);h._currentValue=f;if(null!==g)if(h=g.value,f=He(h,f)?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0,0===f){if(g.children===e.children&&!N.current){b=hi(a,b,c);break a}}else for(h=b.child,null!==h&&(h.return=b);null!==h;){var k=h.dependencies;if(null!==k){g=h.child;for(var l=
k.firstContext;null!==l;){if(l.context===d&&0!==(l.observedBits&f)){1===h.tag&&(l=zg(-1,c&-c),l.tag=2,Ag(h,l));h.lanes|=c;l=h.alternate;null!==l&&(l.lanes|=c);sg(h.return,c);k.lanes|=c;break}l=l.next}}else g=10===h.tag?h.type===b.type?null:h.child:h.child;if(null!==g)g.return=h;else for(g=h;null!==g;){if(g===b){g=null;break}h=g.sibling;if(null!==h){h.return=g.return;g=h;break}g=g.return}h=g}fi(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,f=b.pendingProps,d=f.children,tg(b,c),e=vg(e,
f.unstable_observedBits),d=d(e),b.flags|=1,fi(a,b,d,c),b.child;case 14:return e=b.type,f=lg(e,b.pendingProps),f=lg(e.type,f),ii(a,b,e,f,d,c);case 15:return ki(a,b,b.type,b.pendingProps,d,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),b.tag=1,Ff(d)?(a=!0,Jf(b)):a=!1,tg(b,c),Mg(b,d,e),Og(b,d,e,c),qi(null,b,d,!0,a,c);case 19:return Ai(a,b,c);case 23:return mi(a,b,c);case 24:return mi(a,b,c)}throw Error(y(156,b.tag));
};function ik(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.flags=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childLanes=this.lanes=0;this.alternate=null}function nh(a,b,c,d){return new ik(a,b,c,d)}function ji(a){a=a.prototype;return!(!a||!a.isReactComponent)}
function hk(a){if("function"===typeof a)return ji(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Aa)return 11;if(a===Da)return 14}return 2}
function Tg(a,b){var c=a.alternate;null===c?(c=nh(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Vg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)ji(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ua:return Xg(c.children,e,f,b);case Ha:g=8;e|=16;break;case wa:g=8;e|=1;break;case xa:return a=nh(12,c,b,e|8),a.elementType=xa,a.type=xa,a.lanes=f,a;case Ba:return a=nh(13,c,b,e),a.type=Ba,a.elementType=Ba,a.lanes=f,a;case Ca:return a=nh(19,c,b,e),a.elementType=Ca,a.lanes=f,a;case Ia:return vi(c,e,f,b);case Ja:return a=nh(24,c,b,e),a.elementType=Ja,a.lanes=f,a;default:if("object"===
typeof a&&null!==a)switch(a.$$typeof){case ya:g=10;break a;case za:g=9;break a;case Aa:g=11;break a;case Da:g=14;break a;case Ea:g=16;d=null;break a;case Fa:g=22;break a}throw Error(y(130,null==a?a:typeof a,""));}b=nh(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Xg(a,b,c,d){a=nh(7,a,d,b);a.lanes=c;return a}function vi(a,b,c,d){a=nh(23,a,d,b);a.elementType=Ia;a.lanes=c;return a}function Ug(a,b,c){a=nh(6,a,null,b);a.lanes=c;return a}
function Wg(a,b,c){b=nh(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function jk(a,b,c){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.pendingContext=this.context=null;this.hydrate=c;this.callbackNode=null;this.callbackPriority=0;this.eventTimes=Zc(0);this.expirationTimes=Zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=Zc(0);this.mutableSourceEagerHydrationData=null}
function kk(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:ta,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function lk(a,b,c,d){var e=b.current,f=Hg(),g=Ig(e);a:if(c){c=c._reactInternals;b:{if(Zb(c)!==c||1!==c.tag)throw Error(y(170));var h=c;do{switch(h.tag){case 3:h=h.stateNode.context;break b;case 1:if(Ff(h.type)){h=h.stateNode.__reactInternalMemoizedMergedChildContext;break b}}h=h.return}while(null!==h);throw Error(y(171));}if(1===c.tag){var k=c.type;if(Ff(k)){c=If(c,k,h);break a}}c=h}else c=Cf;null===b.context?b.context=c:b.pendingContext=c;b=zg(f,g);b.payload={element:a};d=void 0===d?null:d;null!==
d&&(b.callback=d);Ag(e,b);Jg(e,g,f);return g}function mk(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function nk(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b}}function ok(a,b){nk(a,b);(a=a.alternate)&&nk(a,b)}function pk(){return null}
function qk(a,b,c){var d=null!=c&&null!=c.hydrationOptions&&c.hydrationOptions.mutableSources||null;c=new jk(a,b,null!=c&&!0===c.hydrate);b=nh(3,null,null,2===b?7:1===b?3:0);c.current=b;b.stateNode=c;xg(b);a[ff]=c.current;cf(8===a.nodeType?a.parentNode:a);if(d)for(a=0;a<d.length;a++){b=d[a];var e=b._getVersion;e=e(b._source);null==c.mutableSourceEagerHydrationData?c.mutableSourceEagerHydrationData=[b,e]:c.mutableSourceEagerHydrationData.push(b,e)}this._internalRoot=c}
qk.prototype.render=function(a){lk(a,this._internalRoot,null,null)};qk.prototype.unmount=function(){var a=this._internalRoot,b=a.containerInfo;lk(null,a,null,function(){b[ff]=null})};function rk(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}
function sk(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new qk(a,0,b?{hydrate:!0}:void 0)}
function tk(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f._internalRoot;if("function"===typeof e){var h=e;e=function(){var a=mk(g);h.call(a)}}lk(b,g,a,e)}else{f=c._reactRootContainer=sk(c,d);g=f._internalRoot;if("function"===typeof e){var k=e;e=function(){var a=mk(g);k.call(a)}}Xj(function(){lk(b,g,a,e)})}return mk(g)}ec=function(a){if(13===a.tag){var b=Hg();Jg(a,4,b);ok(a,4)}};fc=function(a){if(13===a.tag){var b=Hg();Jg(a,67108864,b);ok(a,67108864)}};
gc=function(a){if(13===a.tag){var b=Hg(),c=Ig(a);Jg(a,c,b);ok(a,c)}};hc=function(a,b){return b()};
yb=function(a,b,c){switch(b){case "input":ab(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(y(90));Wa(d);ab(d,e)}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1)}};Gb=Wj;
Hb=function(a,b,c,d,e){var f=X;X|=4;try{return gg(98,a.bind(null,b,c,d,e))}finally{X=f,0===X&&(wj(),ig())}};Ib=function(){0===(X&49)&&(Vj(),Oj())};Jb=function(a,b){var c=X;X|=2;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}};function uk(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!rk(b))throw Error(y(200));return kk(a,b,null,c)}var vk={Events:[Cb,ue,Db,Eb,Fb,Oj,{current:!1}]},wk={findFiberByHostInstance:wc,bundleType:0,version:"17.0.2",rendererPackageName:"react-dom"};
var xk={bundleType:wk.bundleType,version:wk.version,rendererPackageName:wk.rendererPackageName,rendererConfig:wk.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ra.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=cc(a);return null===a?null:a.stateNode},findFiberByHostInstance:wk.findFiberByHostInstance||
pk,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var yk=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!yk.isDisabled&&yk.supportsFiber)try{Lf=yk.inject(xk),Mf=yk}catch(a){}}exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vk;exports.createPortal=uk;
exports.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(y(188));throw Error(y(268,Object.keys(a)));}a=cc(b);a=null===a?null:a.stateNode;return a};exports.flushSync=function(a,b){var c=X;if(0!==(c&48))return a(b);X|=1;try{if(a)return gg(99,a.bind(null,b))}finally{X=c,ig()}};exports.hydrate=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!0,c)};
exports.render=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!1,c)};exports.unmountComponentAtNode=function(a){if(!rk(a))throw Error(y(40));return a._reactRootContainer?(Xj(function(){tk(null,null,a,!1,function(){a._reactRootContainer=null;a[ff]=null})}),!0):!1};exports.unstable_batchedUpdates=Wj;exports.unstable_createPortal=function(a,b){return uk(a,b,2<arguments.length&&void 0!==arguments[2]?arguments[2]:null)};
exports.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!rk(c))throw Error(y(200));if(null==a||void 0===a._reactInternals)throw Error(y(38));return tk(a,b,c,!1,d)};exports.version="17.0.2";


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(184);
} else {
  module.exports = require('./cjs/scheduler.development.js');
}


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v0.20.2
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f,g,h,k;if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}
if("undefined"===typeof window||"function"!==typeof MessageChannel){var t=null,u=null,w=function(){if(null!==t)try{var a=exports.unstable_now();t(!0,a);t=null}catch(b){throw setTimeout(w,0),b;}};f=function(a){null!==t?setTimeout(f,0,a):(t=a,setTimeout(w,0))};g=function(a,b){u=setTimeout(a,b)};h=function(){clearTimeout(u)};exports.unstable_shouldYield=function(){return!1};k=exports.unstable_forceFrameRate=function(){}}else{var x=window.setTimeout,y=window.clearTimeout;if("undefined"!==typeof console){var z=
window.cancelAnimationFrame;"function"!==typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");"function"!==typeof z&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")}var A=!1,B=null,C=-1,D=5,E=0;exports.unstable_shouldYield=function(){return exports.unstable_now()>=
E};k=function(){};exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<a?Math.floor(1E3/a):5};var F=new MessageChannel,G=F.port2;F.port1.onmessage=function(){if(null!==B){var a=exports.unstable_now();E=a+D;try{B(!0,a)?G.postMessage(null):(A=!1,B=null)}catch(b){throw G.postMessage(null),b;}}else A=!1};f=function(a){B=a;A||(A=!0,G.postMessage(null))};g=function(a,b){C=
x(function(){a(exports.unstable_now())},b)};h=function(){y(C);C=-1}}function H(a,b){var c=a.length;a.push(b);a:for(;;){var d=c-1>>>1,e=a[d];if(void 0!==e&&0<I(e,b))a[d]=b,a[c]=e,c=d;else break a}}function J(a){a=a[0];return void 0===a?null:a}
function K(a){var b=a[0];if(void 0!==b){var c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length;d<e;){var m=2*(d+1)-1,n=a[m],v=m+1,r=a[v];if(void 0!==n&&0>I(n,c))void 0!==r&&0>I(r,n)?(a[d]=r,a[v]=c,d=v):(a[d]=n,a[m]=c,d=m);else if(void 0!==r&&0>I(r,c))a[d]=r,a[v]=c,d=v;else break a}}return b}return null}function I(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}var L=[],M=[],N=1,O=null,P=3,Q=!1,R=!1,S=!1;
function T(a){for(var b=J(M);null!==b;){if(null===b.callback)K(M);else if(b.startTime<=a)K(M),b.sortIndex=b.expirationTime,H(L,b);else break;b=J(M)}}function U(a){S=!1;T(a);if(!R)if(null!==J(L))R=!0,f(V);else{var b=J(M);null!==b&&g(U,b.startTime-a)}}
function V(a,b){R=!1;S&&(S=!1,h());Q=!0;var c=P;try{T(b);for(O=J(L);null!==O&&(!(O.expirationTime>b)||a&&!exports.unstable_shouldYield());){var d=O.callback;if("function"===typeof d){O.callback=null;P=O.priorityLevel;var e=d(O.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?O.callback=e:O===J(L)&&K(L);T(b)}else K(L);O=J(L)}if(null!==O)var m=!0;else{var n=J(M);null!==n&&g(U,n.startTime-b);m=!1}return m}finally{O=null,P=c,Q=!1}}var W=k;exports.unstable_IdlePriority=5;
exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){R||Q||(R=!0,f(V))};exports.unstable_getCurrentPriorityLevel=function(){return P};exports.unstable_getFirstCallbackNode=function(){return J(L)};
exports.unstable_next=function(a){switch(P){case 1:case 2:case 3:var b=3;break;default:b=P}var c=P;P=b;try{return a()}finally{P=c}};exports.unstable_pauseExecution=function(){};exports.unstable_requestPaint=W;exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=P;P=a;try{return b()}finally{P=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:N++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,H(M,a),null===J(L)&&a===J(M)&&(S?h():S=!0,g(U,c-d))):(a.sortIndex=e,H(L,a),R||Q||(R=!0,f(V)));return a};
exports.unstable_wrapCallback=function(a){var b=P;return function(){var c=P;P=b;try{return a.apply(this,arguments)}finally{P=c}}};


/***/ }),
/* 185 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Join_Join__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_Chat_Chat__ = __webpack_require__(198);
var App=function App(){return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["a" /* BrowserRouter */],null,__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["c" /* Route */],{path:'/',exact:true,component:__WEBPACK_IMPORTED_MODULE_2__components_Join_Join__["a" /* default */]}),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["c" /* Route */],{path:'/chat',component:__WEBPACK_IMPORTED_MODULE_3__components_Chat_Chat__["a" /* default */]}));};/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),
/* 186 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _setPrototypeOf;
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(188);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 189 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to, from) {
  if (from === undefined) from = '';

  var toParts = (to && to.split('/')) || [];
  var fromParts = (from && from.split('/')) || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

  if (
    mustEndAbs &&
    fromParts[0] !== '' &&
    (!fromParts[0] || !isAbsolute(fromParts[0]))
  )
    fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

/* harmony default export */ __webpack_exports__["a"] = (resolvePathname);


/***/ }),
/* 190 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function valueOf(obj) {
  return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
}

function valueEqual(a, b) {
  // Test for strict equality first.
  if (a === b) return true;

  // Otherwise, if either of them == null they are not equal.
  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every(function(item, index) {
        return valueEqual(item, b[index]);
      })
    );
  }

  if (typeof a === 'object' || typeof b === 'object') {
    var aValue = valueOf(a);
    var bValue = valueOf(b);

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

    return Object.keys(Object.assign({}, a, b)).every(function(key) {
      return valueEqual(a[key], b[key]);
    });
  }

  return false;
}

/* harmony default export */ __webpack_exports__["a"] = (valueEqual);


/***/ }),
/* 191 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_helpers_esm_inheritsLoose__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_tiny_warning__ = __webpack_require__(35);





var MAX_SIGNED_31_BIT_INT = 1073741823;
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};

function getUniqueId() {
  var key = '__global_unique_id__';
  return commonjsGlobal[key] = (commonjsGlobal[key] || 0) + 1;
}

function objectIs(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function createEventEmitter(value) {
  var handlers = [];
  return {
    on: function on(handler) {
      handlers.push(handler);
    },
    off: function off(handler) {
      handlers = handlers.filter(function (h) {
        return h !== handler;
      });
    },
    get: function get() {
      return value;
    },
    set: function set(newValue, changedBits) {
      value = newValue;
      handlers.forEach(function (handler) {
        return handler(value, changedBits);
      });
    }
  };
}

function onlyChild(children) {
  return Array.isArray(children) ? children[0] : children;
}

function createReactContext(defaultValue, calculateChangedBits) {
  var _Provider$childContex, _Consumer$contextType;

  var contextProp = '__create-react-context-' + getUniqueId() + '__';

  var Provider = /*#__PURE__*/function (_Component) {
    Object(__WEBPACK_IMPORTED_MODULE_1__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(Provider, _Component);

    function Provider() {
      var _this;

      _this = _Component.apply(this, arguments) || this;
      _this.emitter = createEventEmitter(_this.props.value);
      return _this;
    }

    var _proto = Provider.prototype;

    _proto.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[contextProp] = this.emitter, _ref;
    };

    _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        var oldValue = this.props.value;
        var newValue = nextProps.value;
        var changedBits;

        if (objectIs(oldValue, newValue)) {
          changedBits = 0;
        } else {
          changedBits = typeof calculateChangedBits === 'function' ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;

          if (false) {
            warning((changedBits & MAX_SIGNED_31_BIT_INT) === changedBits, 'calculateChangedBits: Expected the return value to be a ' + '31-bit integer. Instead received: ' + changedBits);
          }

          changedBits |= 0;

          if (changedBits !== 0) {
            this.emitter.set(nextProps.value, changedBits);
          }
        }
      }
    };

    _proto.render = function render() {
      return this.props.children;
    };

    return Provider;
  }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.object.isRequired, _Provider$childContex);

  var Consumer = /*#__PURE__*/function (_Component2) {
    Object(__WEBPACK_IMPORTED_MODULE_1__babel_runtime_helpers_esm_inheritsLoose__["a" /* default */])(Consumer, _Component2);

    function Consumer() {
      var _this2;

      _this2 = _Component2.apply(this, arguments) || this;
      _this2.state = {
        value: _this2.getValue()
      };

      _this2.onUpdate = function (newValue, changedBits) {
        var observedBits = _this2.observedBits | 0;

        if ((observedBits & changedBits) !== 0) {
          _this2.setState({
            value: _this2.getValue()
          });
        }
      };

      return _this2;
    }

    var _proto2 = Consumer.prototype;

    _proto2.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var observedBits = nextProps.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
    };

    _proto2.componentDidMount = function componentDidMount() {
      if (this.context[contextProp]) {
        this.context[contextProp].on(this.onUpdate);
      }

      var observedBits = this.props.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
    };

    _proto2.componentWillUnmount = function componentWillUnmount() {
      if (this.context[contextProp]) {
        this.context[contextProp].off(this.onUpdate);
      }
    };

    _proto2.getValue = function getValue() {
      if (this.context[contextProp]) {
        return this.context[contextProp].get();
      } else {
        return defaultValue;
      }
    };

    _proto2.render = function render() {
      return onlyChild(this.props.children)(this.state.value);
    };

    return Consumer;
  }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

  Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.object, _Consumer$contextType);
  return {
    Provider: Provider,
    Consumer: Consumer
  };
}

var index = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createContext || createReactContext;

/* harmony default export */ __webpack_exports__["a"] = (index);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(21)))

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

var isarray = __webpack_require__(193)

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = options && options.delimiter || '/'
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    var next = str[index]
    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var modifier = res[6]
    var asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var partial = prefix != null && next != null && next !== prefix
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = res[2] || defaultDelimiter
    var pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options), options)
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens, options) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options))
    }
  }

  return function (obj, opts) {
    var path = ''
    var data = obj || {}
    var options = opts || {}
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      keys.push(token)

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  var delimiter = escapeString(options.delimiter || '/')
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}


/***/ }),
/* 193 */
/***/ (function(module, exports) {

module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var reactIs = __webpack_require__(99);

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ }),
/* 196 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = SignIn;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Join_css__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Join_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Join_css__);
var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"])_i["return"]();}finally{if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else{throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();function SignIn(){var _useState=Object(__WEBPACK_IMPORTED_MODULE_0_react__["useState"])(''),_useState2=_slicedToArray(_useState,2),name=_useState2[0],setName=_useState2[1];var _useState3=Object(__WEBPACK_IMPORTED_MODULE_0_react__["useState"])(''),_useState4=_slicedToArray(_useState3,2),room=_useState4[0],setRoom=_useState4[1];return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',{className:'joinOuterContainer'},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',{className:'joinInnerContainer'},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('h1',{className:'heading'},'Join'),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',null,__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input',{placeholder:'Name',className:'joinInput',type:'text',onChange:function onChange(event){return setName(event.target.value);}})),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',null,__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input',{placeholder:'Room',className:'joinInput mt-20',type:'text',onChange:function onChange(event){return setRoom(event.target.value);}})),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["b" /* Link */],{onClick:function onClick(e){return!name||!room?e.preventDefault():null;},to:'/chat?name='+name+'&room='+room},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('button',{className:'button mt-20',type:'submit'},'Sign In'))));}

/***/ }),
/* 197 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: BrowserslistError: Unknown browser query `dead`\n    at error (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:37:11)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:222:9\n    at Array.forEach (<anonymous>)\n    at browserslist (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:196:13)\n    at cleanBrowsersList (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/utils.js:56:59)\n    at setBrowserScope (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:29:43)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:91:1)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at Module.load (node:internal/modules/cjs/loader:973:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:813:14)\n    at Module.require (node:internal/modules/cjs/loader:997:19)\n    at require (node:internal/modules/cjs/helpers:92:18)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-merge-rules/dist/lib/ensureCompatibility.js:7:19)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/webpack/lib/NormalModule.js:195:19\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:233:18\n    at runSyncOrAsync (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:143:3)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:232:2)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:221:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:236:3\n    at context.callback (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-loader/lib/index.js:180:9\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:94:5)");

/***/ }),
/* 198 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_query_string__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_query_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_query_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_socket_io_client__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_socket_io_client__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__TextContainer_TextContainer__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Messages_Messages__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__InfoBar_InfoBar__ = __webpack_require__(423);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Input_Input__ = __webpack_require__(426);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Chat_css__ = __webpack_require__(428);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Chat_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__Chat_css__);
var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"])_i["return"]();}finally{if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else{throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}var ENDPOINT="localhost:5000/";var socket=void 0;var Chat=function Chat(_ref){var location=_ref.location;var _useState=Object(__WEBPACK_IMPORTED_MODULE_0_react__["useState"])(''),_useState2=_slicedToArray(_useState,2),name=_useState2[0],setName=_useState2[1];var _useState3=Object(__WEBPACK_IMPORTED_MODULE_0_react__["useState"])(''),_useState4=_slicedToArray(_useState3,2),room=_useState4[0],setRoom=_useState4[1];var _useState5=Object(__WEBPACK_IMPORTED_MODULE_0_react__["useState"])(''),_useState6=_slicedToArray(_useState5,2),users=_useState6[0],setUsers=_useState6[1];var _useState7=Object(__WEBPACK_IMPORTED_MODULE_0_react__["useState"])(''),_useState8=_slicedToArray(_useState7,2),message=_useState8[0],setMessage=_useState8[1];var _useState9=Object(__WEBPACK_IMPORTED_MODULE_0_react__["useState"])([]),_useState10=_slicedToArray(_useState9,2),messages=_useState10[0],setMessages=_useState10[1];Object(__WEBPACK_IMPORTED_MODULE_0_react__["useEffect"])(function(){var _queryString$parse=__WEBPACK_IMPORTED_MODULE_1_query_string___default.a.parse(location.search),name=_queryString$parse.name,room=_queryString$parse.room;socket=__WEBPACK_IMPORTED_MODULE_2_socket_io_client___default()(ENDPOINT);setRoom(room);setName(name);socket.emit('join',{name:name,room:room},function(error){if(error){alert(error);}});return function(){socket.emit('disconnect');socket.off();};},[ENDPOINT,location.search]);Object(__WEBPACK_IMPORTED_MODULE_0_react__["useEffect"])(function(){socket.on('message',function(message){setMessages(function(messages){return[].concat(_toConsumableArray(messages),[message]);});});socket.on("roomData",function(_ref2){var users=_ref2.users;setUsers(users);});},[]);var sendMessage=function sendMessage(event){event.preventDefault();if(message){socket.emit('sendMessage',message,function(){return setMessage('');});}};return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div",{className:"outerContainer"},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div",{className:"container"},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__InfoBar_InfoBar__["a" /* default */],{room:room}),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__Messages_Messages__["a" /* default */],{messages:messages,name:name}),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__Input_Input__["a" /* default */],{message:message,setMessage:setMessage,sendMessage:sendMessage})),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__TextContainer_TextContainer__["a" /* default */],{users:users}));};/* harmony default export */ __webpack_exports__["a"] = (Chat);

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const strictUriEncode = __webpack_require__(200);
const decodeComponent = __webpack_require__(201);
const splitOnFirst = __webpack_require__(202);
const filterObject = __webpack_require__(203);

const isNullOrUndefined = value => value === null || value === undefined;

const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;

				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'comma':
		case 'separator':
		case 'bracket-separator': {
			const keyValueSep = options.arrayFormat === 'bracket-separator' ?
				'[]=' :
				'=';

			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				// Translate null to an empty string so that it doesn't serialize as 'null'
				value = value === null ? '' : value;

				if (result.length === 0) {
					return [[encode(key, options), keyValueSep, encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};
		}

		default:
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
		case 'separator':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
				value = isEncodedArray ? decode(value, options) : value;
				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
				accumulator[key] = newValue;
			};

		case 'bracket-separator':
			return (key, value, accumulator) => {
				const isArray = /(\[\])$/.test(key);
				key = key.replace(/\[\]$/, '');

				if (!isArray) {
					accumulator[key] = value ? decode(value, options) : value;
					return;
				}

				const arrayValue = value === null ?
					[] :
					value.split(options.arrayFormatSeparator).map(item => decode(item, options));

				if (accumulator[key] === undefined) {
					accumulator[key] = arrayValue;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], arrayValue);
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function validateArrayFormatSeparator(value) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function getHash(url) {
	let hash = '';
	const hashStart = url.indexOf('#');
	if (hashStart !== -1) {
		hash = url.slice(hashStart);
	}

	return hash;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parseValue(value, options) {
	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		value = Number(value);
	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		value = value.toLowerCase() === 'true';
	}

	return value;
}

function parse(query, options) {
	options = Object.assign({
		decode: true,
		sort: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		parseNumbers: false,
		parseBooleans: false
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof query !== 'string') {
		return ret;
	}

	query = query.trim().replace(/^[?#&]/, '');

	if (!query) {
		return ret;
	}

	for (const param of query.split('&')) {
		if (param === '') {
			continue;
		}

		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : ['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options);
		formatter(decode(key, options), value, ret);
	}

	for (const key of Object.keys(ret)) {
		const value = ret[key];
		if (typeof value === 'object' && value !== null) {
			for (const k of Object.keys(value)) {
				value[k] = parseValue(value[k], options);
			}
		} else {
			ret[key] = parseValue(value, options);
		}
	}

	if (options.sort === false) {
		return ret;
	}

	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ','
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = key => (
		(options.skipNull && isNullOrUndefined(object[key])) ||
		(options.skipEmptyString && object[key] === '')
	);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = {};

	for (const key of Object.keys(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = object[key];
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
				return encode(key, options) + '[]';
			}

			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (url, options) => {
	options = Object.assign({
		decode: true
	}, options);

	const [url_, hash] = splitOnFirst(url, '#');

	return Object.assign(
		{
			url: url_.split('?')[0] || '',
			query: parse(extract(url), options)
		},
		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
	);
};

exports.stringifyUrl = (object, options) => {
	options = Object.assign({
		encode: true,
		strict: true,
		[encodeFragmentIdentifier]: true
	}, options);

	const url = removeHash(object.url).split('?')[0] || '';
	const queryFromUrl = exports.extract(object.url);
	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

	const query = Object.assign(parsedQueryFromUrl, object.query);
	let queryString = exports.stringify(query, options);
	if (queryString) {
		queryString = `?${queryString}`;
	}

	let hash = getHash(object.url);
	if (object.fragmentIdentifier) {
		hash = `#${options[encodeFragmentIdentifier] ? encode(object.fragmentIdentifier, options) : object.fragmentIdentifier}`;
	}

	return `${url}${queryString}${hash}`;
};

exports.pick = (input, filter, options) => {
	options = Object.assign({
		parseFragmentIdentifier: true,
		[encodeFragmentIdentifier]: false
	}, options);

	const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
	return exports.stringifyUrl({
		url,
		query: filterObject(query, filter),
		fragmentIdentifier
	}, options);
};

exports.exclude = (input, filter, options) => {
	const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

	return exports.pick(input, exclusionFilter, options);
};


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (obj, predicate) {
	var ret = {};
	var keys = Object.keys(obj);
	var isArr = Array.isArray(predicate);

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var val = obj[key];

		if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
			ret[key] = val;
		}
	}

	return ret;
};


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.Socket = exports.Manager = exports.protocol = void 0;
const url_1 = __webpack_require__(205);
const manager_1 = __webpack_require__(102);
const debug = __webpack_require__(9)("socket.io-client");
/**
 * Module exports.
 */
module.exports = exports = lookup;
/**
 * Managers cache.
 */
const cache = (exports.managers = {});
function lookup(uri, opts) {
    if (typeof uri === "object") {
        opts = uri;
        uri = undefined;
    }
    opts = opts || {};
    const parsed = url_1.url(uri, opts.path || "/socket.io");
    const source = parsed.source;
    const id = parsed.id;
    const path = parsed.path;
    const sameNamespace = cache[id] && path in cache[id]["nsps"];
    const newConnection = opts.forceNew ||
        opts["force new connection"] ||
        false === opts.multiplex ||
        sameNamespace;
    let io;
    if (newConnection) {
        debug("ignoring socket cache for %s", source);
        io = new manager_1.Manager(source, opts);
    }
    else {
        if (!cache[id]) {
            debug("new io instance for %s", source);
            cache[id] = new manager_1.Manager(source, opts);
        }
        io = cache[id];
    }
    if (parsed.query && !opts.query) {
        opts.query = parsed.queryKey;
    }
    return io.socket(parsed.path, opts);
}
exports.io = lookup;
/**
 * Protocol version.
 *
 * @public
 */
var socket_io_parser_1 = __webpack_require__(60);
Object.defineProperty(exports, "protocol", { enumerable: true, get: function () { return socket_io_parser_1.protocol; } });
/**
 * `connect`.
 *
 * @param {String} uri
 * @public
 */
exports.connect = lookup;
/**
 * Expose constructors for standalone build.
 *
 * @public
 */
var manager_2 = __webpack_require__(102);
Object.defineProperty(exports, "Manager", { enumerable: true, get: function () { return manager_2.Manager; } });
var socket_1 = __webpack_require__(109);
Object.defineProperty(exports, "Socket", { enumerable: true, get: function () { return socket_1.Socket; } });
exports.default = lookup;


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.url = void 0;
const parseuri = __webpack_require__(101);
const debug = __webpack_require__(9)("socket.io-client:url");
/**
 * URL parser.
 *
 * @param uri - url
 * @param path - the request path of the connection
 * @param loc - An object meant to mimic window.location.
 *        Defaults to window.location.
 * @public
 */
function url(uri, path = "", loc) {
    let obj = uri;
    // default to window.location
    loc = loc || (typeof location !== "undefined" && location);
    if (null == uri)
        uri = loc.protocol + "//" + loc.host;
    // relative path support
    if (typeof uri === "string") {
        if ("/" === uri.charAt(0)) {
            if ("/" === uri.charAt(1)) {
                uri = loc.protocol + uri;
            }
            else {
                uri = loc.host + uri;
            }
        }
        if (!/^(https?|wss?):\/\//.test(uri)) {
            debug("protocol-less url %s", uri);
            if ("undefined" !== typeof loc) {
                uri = loc.protocol + "//" + uri;
            }
            else {
                uri = "https://" + uri;
            }
        }
        // parse
        debug("parse %s", uri);
        obj = parseuri(uri);
    }
    // make sure we treat `localhost:80` and `localhost` equally
    if (!obj.port) {
        if (/^(http|ws)$/.test(obj.protocol)) {
            obj.port = "80";
        }
        else if (/^(http|ws)s$/.test(obj.protocol)) {
            obj.port = "443";
        }
    }
    obj.path = obj.path || "/";
    const ipv6 = obj.host.indexOf(":") !== -1;
    const host = ipv6 ? "[" + obj.host + "]" : obj.host;
    // define unique id
    obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
    // define href
    obj.href =
        obj.protocol +
            "://" +
            host +
            (loc && loc.port === obj.port ? "" : ":" + obj.port);
    return obj;
}
exports.url = url;


/***/ }),
/* 206 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(208);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),
/* 208 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

const Socket = __webpack_require__(210);

module.exports = (uri, opts) => new Socket(uri, opts);

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

module.exports.Socket = Socket;
module.exports.protocol = Socket.protocol; // this is an int
module.exports.Transport = __webpack_require__(58);
module.exports.transports = __webpack_require__(103);
module.exports.parser = __webpack_require__(27);


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

const transports = __webpack_require__(103);
const Emitter = __webpack_require__(28);
const debug = __webpack_require__(9)("engine.io-client:socket");
const parser = __webpack_require__(27);
const parseuri = __webpack_require__(101);
const parseqs = __webpack_require__(59);

class Socket extends Emitter {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri or options
   * @param {Object} options
   * @api public
   */
  constructor(uri, opts = {}) {
    super();

    if (uri && "object" === typeof uri) {
      opts = uri;
      uri = null;
    }

    if (uri) {
      uri = parseuri(uri);
      opts.hostname = uri.host;
      opts.secure = uri.protocol === "https" || uri.protocol === "wss";
      opts.port = uri.port;
      if (uri.query) opts.query = uri.query;
    } else if (opts.host) {
      opts.hostname = parseuri(opts.host).host;
    }

    this.secure =
      null != opts.secure
        ? opts.secure
        : typeof location !== "undefined" && "https:" === location.protocol;

    if (opts.hostname && !opts.port) {
      // if no port is specified manually, use the protocol default
      opts.port = this.secure ? "443" : "80";
    }

    this.hostname =
      opts.hostname ||
      (typeof location !== "undefined" ? location.hostname : "localhost");
    this.port =
      opts.port ||
      (typeof location !== "undefined" && location.port
        ? location.port
        : this.secure
        ? 443
        : 80);

    this.transports = opts.transports || ["polling", "websocket"];
    this.readyState = "";
    this.writeBuffer = [];
    this.prevBufferLen = 0;

    this.opts = Object.assign(
      {
        path: "/engine.io",
        agent: false,
        withCredentials: false,
        upgrade: true,
        jsonp: true,
        timestampParam: "t",
        rememberUpgrade: false,
        rejectUnauthorized: true,
        perMessageDeflate: {
          threshold: 1024
        },
        transportOptions: {},
        closeOnBeforeunload: true
      },
      opts
    );

    this.opts.path = this.opts.path.replace(/\/$/, "") + "/";

    if (typeof this.opts.query === "string") {
      this.opts.query = parseqs.decode(this.opts.query);
    }

    // set on handshake
    this.id = null;
    this.upgrades = null;
    this.pingInterval = null;
    this.pingTimeout = null;

    // set on heartbeat
    this.pingTimeoutTimer = null;

    if (typeof addEventListener === "function") {
      if (this.opts.closeOnBeforeunload) {
        // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
        // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
        // closed/reloaded)
        addEventListener(
          "beforeunload",
          () => {
            if (this.transport) {
              // silently close the transport
              this.transport.removeAllListeners();
              this.transport.close();
            }
          },
          false
        );
      }
      if (this.hostname !== "localhost") {
        this.offlineEventListener = () => {
          this.onClose("transport close");
        };
        addEventListener("offline", this.offlineEventListener, false);
      }
    }

    this.open();
  }

  /**
   * Creates transport of the given type.
   *
   * @param {String} transport name
   * @return {Transport}
   * @api private
   */
  createTransport(name) {
    debug('creating transport "%s"', name);
    const query = clone(this.opts.query);

    // append engine.io protocol identifier
    query.EIO = parser.protocol;

    // transport name
    query.transport = name;

    // session id if we already have one
    if (this.id) query.sid = this.id;

    const opts = Object.assign(
      {},
      this.opts.transportOptions[name],
      this.opts,
      {
        query,
        socket: this,
        hostname: this.hostname,
        secure: this.secure,
        port: this.port
      }
    );

    debug("options: %j", opts);

    return new transports[name](opts);
  }

  /**
   * Initializes transport to use and starts probe.
   *
   * @api private
   */
  open() {
    let transport;
    if (
      this.opts.rememberUpgrade &&
      Socket.priorWebsocketSuccess &&
      this.transports.indexOf("websocket") !== -1
    ) {
      transport = "websocket";
    } else if (0 === this.transports.length) {
      // Emit error on next tick so it can be listened to
      setTimeout(() => {
        this.emit("error", "No transports available");
      }, 0);
      return;
    } else {
      transport = this.transports[0];
    }
    this.readyState = "opening";

    // Retry with the next transport if the transport is disabled (jsonp: false)
    try {
      transport = this.createTransport(transport);
    } catch (e) {
      debug("error while creating transport: %s", e);
      this.transports.shift();
      this.open();
      return;
    }

    transport.open();
    this.setTransport(transport);
  }

  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @api private
   */
  setTransport(transport) {
    debug("setting transport %s", transport.name);

    if (this.transport) {
      debug("clearing existing transport %s", this.transport.name);
      this.transport.removeAllListeners();
    }

    // set up transport
    this.transport = transport;

    // set up transport listeners
    transport
      .on("drain", this.onDrain.bind(this))
      .on("packet", this.onPacket.bind(this))
      .on("error", this.onError.bind(this))
      .on("close", () => {
        this.onClose("transport close");
      });
  }

  /**
   * Probes a transport.
   *
   * @param {String} transport name
   * @api private
   */
  probe(name) {
    debug('probing transport "%s"', name);
    let transport = this.createTransport(name, { probe: 1 });
    let failed = false;

    Socket.priorWebsocketSuccess = false;

    const onTransportOpen = () => {
      if (failed) return;

      debug('probe transport "%s" opened', name);
      transport.send([{ type: "ping", data: "probe" }]);
      transport.once("packet", msg => {
        if (failed) return;
        if ("pong" === msg.type && "probe" === msg.data) {
          debug('probe transport "%s" pong', name);
          this.upgrading = true;
          this.emit("upgrading", transport);
          if (!transport) return;
          Socket.priorWebsocketSuccess = "websocket" === transport.name;

          debug('pausing current transport "%s"', this.transport.name);
          this.transport.pause(() => {
            if (failed) return;
            if ("closed" === this.readyState) return;
            debug("changing transport and sending upgrade packet");

            cleanup();

            this.setTransport(transport);
            transport.send([{ type: "upgrade" }]);
            this.emit("upgrade", transport);
            transport = null;
            this.upgrading = false;
            this.flush();
          });
        } else {
          debug('probe transport "%s" failed', name);
          const err = new Error("probe error");
          err.transport = transport.name;
          this.emit("upgradeError", err);
        }
      });
    };

    function freezeTransport() {
      if (failed) return;

      // Any callback called by transport should be ignored since now
      failed = true;

      cleanup();

      transport.close();
      transport = null;
    }

    // Handle any error that happens while probing
    const onerror = err => {
      const error = new Error("probe error: " + err);
      error.transport = transport.name;

      freezeTransport();

      debug('probe transport "%s" failed because of error: %s', name, err);

      this.emit("upgradeError", error);
    };

    function onTransportClose() {
      onerror("transport closed");
    }

    // When the socket is closed while we're probing
    function onclose() {
      onerror("socket closed");
    }

    // When the socket is upgraded while we're probing
    function onupgrade(to) {
      if (transport && to.name !== transport.name) {
        debug('"%s" works - aborting "%s"', to.name, transport.name);
        freezeTransport();
      }
    }

    // Remove all listeners on the transport and on self
    const cleanup = () => {
      transport.removeListener("open", onTransportOpen);
      transport.removeListener("error", onerror);
      transport.removeListener("close", onTransportClose);
      this.removeListener("close", onclose);
      this.removeListener("upgrading", onupgrade);
    };

    transport.once("open", onTransportOpen);
    transport.once("error", onerror);
    transport.once("close", onTransportClose);

    this.once("close", onclose);
    this.once("upgrading", onupgrade);

    transport.open();
  }

  /**
   * Called when connection is deemed open.
   *
   * @api public
   */
  onOpen() {
    debug("socket open");
    this.readyState = "open";
    Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
    this.emit("open");
    this.flush();

    // we check for `readyState` in case an `open`
    // listener already closed the socket
    if (
      "open" === this.readyState &&
      this.opts.upgrade &&
      this.transport.pause
    ) {
      debug("starting upgrade probes");
      let i = 0;
      const l = this.upgrades.length;
      for (; i < l; i++) {
        this.probe(this.upgrades[i]);
      }
    }
  }

  /**
   * Handles a packet.
   *
   * @api private
   */
  onPacket(packet) {
    if (
      "opening" === this.readyState ||
      "open" === this.readyState ||
      "closing" === this.readyState
    ) {
      debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

      this.emit("packet", packet);

      // Socket is live - any packet counts
      this.emit("heartbeat");

      switch (packet.type) {
        case "open":
          this.onHandshake(JSON.parse(packet.data));
          break;

        case "ping":
          this.resetPingTimeout();
          this.sendPacket("pong");
          this.emit("ping");
          this.emit("pong");
          break;

        case "error":
          const err = new Error("server error");
          err.code = packet.data;
          this.onError(err);
          break;

        case "message":
          this.emit("data", packet.data);
          this.emit("message", packet.data);
          break;
      }
    } else {
      debug('packet received with socket readyState "%s"', this.readyState);
    }
  }

  /**
   * Called upon handshake completion.
   *
   * @param {Object} handshake obj
   * @api private
   */
  onHandshake(data) {
    this.emit("handshake", data);
    this.id = data.sid;
    this.transport.query.sid = data.sid;
    this.upgrades = this.filterUpgrades(data.upgrades);
    this.pingInterval = data.pingInterval;
    this.pingTimeout = data.pingTimeout;
    this.onOpen();
    // In case open handler closes socket
    if ("closed" === this.readyState) return;
    this.resetPingTimeout();
  }

  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @api private
   */
  resetPingTimeout() {
    clearTimeout(this.pingTimeoutTimer);
    this.pingTimeoutTimer = setTimeout(() => {
      this.onClose("ping timeout");
    }, this.pingInterval + this.pingTimeout);
    if (this.opts.autoUnref) {
      this.pingTimeoutTimer.unref();
    }
  }

  /**
   * Called on `drain` event
   *
   * @api private
   */
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen);

    // setting prevBufferLen = 0 is very important
    // for example, when upgrading, upgrade packet is sent over,
    // and a nonzero prevBufferLen could cause problems on `drain`
    this.prevBufferLen = 0;

    if (0 === this.writeBuffer.length) {
      this.emit("drain");
    } else {
      this.flush();
    }
  }

  /**
   * Flush write buffers.
   *
   * @api private
   */
  flush() {
    if (
      "closed" !== this.readyState &&
      this.transport.writable &&
      !this.upgrading &&
      this.writeBuffer.length
    ) {
      debug("flushing %d packets in socket", this.writeBuffer.length);
      this.transport.send(this.writeBuffer);
      // keep track of current length of writeBuffer
      // splice writeBuffer and callbackBuffer on `drain`
      this.prevBufferLen = this.writeBuffer.length;
      this.emit("flush");
    }
  }

  /**
   * Sends a message.
   *
   * @param {String} message.
   * @param {Function} callback function.
   * @param {Object} options.
   * @return {Socket} for chaining.
   * @api public
   */
  write(msg, options, fn) {
    this.sendPacket("message", msg, options, fn);
    return this;
  }

  send(msg, options, fn) {
    this.sendPacket("message", msg, options, fn);
    return this;
  }

  /**
   * Sends a packet.
   *
   * @param {String} packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} callback function.
   * @api private
   */
  sendPacket(type, data, options, fn) {
    if ("function" === typeof data) {
      fn = data;
      data = undefined;
    }

    if ("function" === typeof options) {
      fn = options;
      options = null;
    }

    if ("closing" === this.readyState || "closed" === this.readyState) {
      return;
    }

    options = options || {};
    options.compress = false !== options.compress;

    const packet = {
      type: type,
      data: data,
      options: options
    };
    this.emit("packetCreate", packet);
    this.writeBuffer.push(packet);
    if (fn) this.once("flush", fn);
    this.flush();
  }

  /**
   * Closes the connection.
   *
   * @api private
   */
  close() {
    const close = () => {
      this.onClose("forced close");
      debug("socket closing - telling transport to close");
      this.transport.close();
    };

    const cleanupAndClose = () => {
      this.removeListener("upgrade", cleanupAndClose);
      this.removeListener("upgradeError", cleanupAndClose);
      close();
    };

    const waitForUpgrade = () => {
      // wait for upgrade to finish since we can't send packets while pausing a transport
      this.once("upgrade", cleanupAndClose);
      this.once("upgradeError", cleanupAndClose);
    };

    if ("opening" === this.readyState || "open" === this.readyState) {
      this.readyState = "closing";

      if (this.writeBuffer.length) {
        this.once("drain", () => {
          if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        });
      } else if (this.upgrading) {
        waitForUpgrade();
      } else {
        close();
      }
    }

    return this;
  }

  /**
   * Called upon transport error
   *
   * @api private
   */
  onError(err) {
    debug("socket error %j", err);
    Socket.priorWebsocketSuccess = false;
    this.emit("error", err);
    this.onClose("transport error", err);
  }

  /**
   * Called upon transport close.
   *
   * @api private
   */
  onClose(reason, desc) {
    if (
      "opening" === this.readyState ||
      "open" === this.readyState ||
      "closing" === this.readyState
    ) {
      debug('socket close with reason: "%s"', reason);

      // clear timers
      clearTimeout(this.pingIntervalTimer);
      clearTimeout(this.pingTimeoutTimer);

      // stop event from firing again for transport
      this.transport.removeAllListeners("close");

      // ensure transport won't stay open
      this.transport.close();

      // ignore further transport communication
      this.transport.removeAllListeners();

      if (typeof removeEventListener === "function") {
        removeEventListener("offline", this.offlineEventListener, false);
      }

      // set ready state
      this.readyState = "closed";

      // clear session id
      this.id = null;

      // emit close event
      this.emit("close", reason, desc);

      // clean buffers after, so users can still
      // grab the buffers on `close` event
      this.writeBuffer = [];
      this.prevBufferLen = 0;
    }
  }

  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} server upgrades
   * @api private
   *
   */
  filterUpgrades(upgrades) {
    const filteredUpgrades = [];
    let i = 0;
    const j = upgrades.length;
    for (; i < j; i++) {
      if (~this.transports.indexOf(upgrades[i]))
        filteredUpgrades.push(upgrades[i]);
    }
    return filteredUpgrades;
  }
}

Socket.priorWebsocketSuccess = false;

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

function clone(obj) {
  const o = {};
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

module.exports = Socket;


/***/ }),
/* 211 */
/***/ (function(module, exports) {


/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = typeof XMLHttpRequest !== 'undefined' &&
    'withCredentials' in new XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

/* global attachEvent */

const XMLHttpRequest = __webpack_require__(104);
const Polling = __webpack_require__(105);
const Emitter = __webpack_require__(28);
const { pick } = __webpack_require__(108);
const globalThis = __webpack_require__(36);

const debug = __webpack_require__(9)("engine.io-client:polling-xhr");

/**
 * Empty function
 */

function empty() {}

const hasXHR2 = (function() {
  const xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

class XHR extends Polling {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @api public
   */
  constructor(opts) {
    super(opts);

    if (typeof location !== "undefined") {
      const isSSL = "https:" === location.protocol;
      let port = location.port;

      // some user agents have empty `location.port`
      if (!port) {
        port = isSSL ? 443 : 80;
      }

      this.xd =
        (typeof location !== "undefined" &&
          opts.hostname !== location.hostname) ||
        port !== opts.port;
      this.xs = opts.secure !== isSSL;
    }
    /**
     * XHR supports binary
     */
    const forceBase64 = opts && opts.forceBase64;
    this.supportsBinary = hasXHR2 && !forceBase64;
  }

  /**
   * Creates a request.
   *
   * @param {String} method
   * @api private
   */
  request(opts = {}) {
    Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
    return new Request(this.uri(), opts);
  }

  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @api private
   */
  doWrite(data, fn) {
    const req = this.request({
      method: "POST",
      data: data
    });
    req.on("success", fn);
    req.on("error", err => {
      this.onError("xhr post error", err);
    });
  }

  /**
   * Starts a poll cycle.
   *
   * @api private
   */
  doPoll() {
    debug("xhr poll");
    const req = this.request();
    req.on("data", this.onData.bind(this));
    req.on("error", err => {
      this.onError("xhr poll error", err);
    });
    this.pollXhr = req;
  }
}

class Request extends Emitter {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @api public
   */
  constructor(uri, opts) {
    super();
    this.opts = opts;

    this.method = opts.method || "GET";
    this.uri = uri;
    this.async = false !== opts.async;
    this.data = undefined !== opts.data ? opts.data : null;

    this.create();
  }

  /**
   * Creates the XHR object and sends the request.
   *
   * @api private
   */
  create() {
    const opts = pick(
      this.opts,
      "agent",
      "enablesXDR",
      "pfx",
      "key",
      "passphrase",
      "cert",
      "ca",
      "ciphers",
      "rejectUnauthorized",
      "autoUnref"
    );
    opts.xdomain = !!this.opts.xd;
    opts.xscheme = !!this.opts.xs;

    const xhr = (this.xhr = new XMLHttpRequest(opts));

    try {
      debug("xhr open %s: %s", this.method, this.uri);
      xhr.open(this.method, this.uri, this.async);
      try {
        if (this.opts.extraHeaders) {
          xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
          for (let i in this.opts.extraHeaders) {
            if (this.opts.extraHeaders.hasOwnProperty(i)) {
              xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
            }
          }
        }
      } catch (e) {}

      if ("POST" === this.method) {
        try {
          xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch (e) {}
      }

      try {
        xhr.setRequestHeader("Accept", "*/*");
      } catch (e) {}

      // ie6 check
      if ("withCredentials" in xhr) {
        xhr.withCredentials = this.opts.withCredentials;
      }

      if (this.opts.requestTimeout) {
        xhr.timeout = this.opts.requestTimeout;
      }

      if (this.hasXDR()) {
        xhr.onload = () => {
          this.onLoad();
        };
        xhr.onerror = () => {
          this.onError(xhr.responseText);
        };
      } else {
        xhr.onreadystatechange = () => {
          if (4 !== xhr.readyState) return;
          if (200 === xhr.status || 1223 === xhr.status) {
            this.onLoad();
          } else {
            // make sure the `error` event handler that's user-set
            // does not throw in the same tick and gets caught here
            setTimeout(() => {
              this.onError(typeof xhr.status === "number" ? xhr.status : 0);
            }, 0);
          }
        };
      }

      debug("xhr data %s", this.data);
      xhr.send(this.data);
    } catch (e) {
      // Need to defer since .create() is called directly from the constructor
      // and thus the 'error' event can only be only bound *after* this exception
      // occurs.  Therefore, also, we cannot throw here at all.
      setTimeout(() => {
        this.onError(e);
      }, 0);
      return;
    }

    if (typeof document !== "undefined") {
      this.index = Request.requestsCount++;
      Request.requests[this.index] = this;
    }
  }

  /**
   * Called upon successful response.
   *
   * @api private
   */
  onSuccess() {
    this.emit("success");
    this.cleanup();
  }

  /**
   * Called if we have data.
   *
   * @api private
   */
  onData(data) {
    this.emit("data", data);
    this.onSuccess();
  }

  /**
   * Called upon error.
   *
   * @api private
   */
  onError(err) {
    this.emit("error", err);
    this.cleanup(true);
  }

  /**
   * Cleans up house.
   *
   * @api private
   */
  cleanup(fromError) {
    if ("undefined" === typeof this.xhr || null === this.xhr) {
      return;
    }
    // xmlhttprequest
    if (this.hasXDR()) {
      this.xhr.onload = this.xhr.onerror = empty;
    } else {
      this.xhr.onreadystatechange = empty;
    }

    if (fromError) {
      try {
        this.xhr.abort();
      } catch (e) {}
    }

    if (typeof document !== "undefined") {
      delete Request.requests[this.index];
    }

    this.xhr = null;
  }

  /**
   * Called upon load.
   *
   * @api private
   */
  onLoad() {
    const data = this.xhr.responseText;
    if (data !== null) {
      this.onData(data);
    }
  }

  /**
   * Check if it has XDomainRequest.
   *
   * @api private
   */
  hasXDR() {
    return typeof XDomainRequest !== "undefined" && !this.xs && this.enablesXDR;
  }

  /**
   * Aborts the request.
   *
   * @api public
   */
  abort() {
    this.cleanup();
  }
}

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

Request.requestsCount = 0;
Request.requests = {};

if (typeof document !== "undefined") {
  if (typeof attachEvent === "function") {
    attachEvent("onunload", unloadHandler);
  } else if (typeof addEventListener === "function") {
    const terminationEvent = "onpagehide" in globalThis ? "pagehide" : "unload";
    addEventListener(terminationEvent, unloadHandler, false);
  }
}

function unloadHandler() {
  for (let i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

module.exports = XHR;
module.exports.Request = Request;


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

const { PACKET_TYPES } = __webpack_require__(106);

const withNativeBlob =
  typeof Blob === "function" ||
  (typeof Blob !== "undefined" &&
    Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
const withNativeArrayBuffer = typeof ArrayBuffer === "function";

// ArrayBuffer.isView method is not defined in IE10
const isView = obj => {
  return typeof ArrayBuffer.isView === "function"
    ? ArrayBuffer.isView(obj)
    : obj && obj.buffer instanceof ArrayBuffer;
};

const encodePacket = ({ type, data }, supportsBinary, callback) => {
  if (withNativeBlob && data instanceof Blob) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(data, callback);
    }
  } else if (
    withNativeArrayBuffer &&
    (data instanceof ArrayBuffer || isView(data))
  ) {
    if (supportsBinary) {
      return callback(data instanceof ArrayBuffer ? data : data.buffer);
    } else {
      return encodeBlobAsBase64(new Blob([data]), callback);
    }
  }
  // plain string
  return callback(PACKET_TYPES[type] + (data || ""));
};

const encodeBlobAsBase64 = (data, callback) => {
  const fileReader = new FileReader();
  fileReader.onload = function() {
    const content = fileReader.result.split(",")[1];
    callback("b" + content);
  };
  return fileReader.readAsDataURL(data);
};

module.exports = encodePacket;


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

const { PACKET_TYPES_REVERSE, ERROR_PACKET } = __webpack_require__(106);

const withNativeArrayBuffer = typeof ArrayBuffer === "function";

let base64decoder;
if (withNativeArrayBuffer) {
  base64decoder = __webpack_require__(215);
}

const decodePacket = (encodedPacket, binaryType) => {
  if (typeof encodedPacket !== "string") {
    return {
      type: "message",
      data: mapBinary(encodedPacket, binaryType)
    };
  }
  const type = encodedPacket.charAt(0);
  if (type === "b") {
    return {
      type: "message",
      data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
    };
  }
  const packetType = PACKET_TYPES_REVERSE[type];
  if (!packetType) {
    return ERROR_PACKET;
  }
  return encodedPacket.length > 1
    ? {
        type: PACKET_TYPES_REVERSE[type],
        data: encodedPacket.substring(1)
      }
    : {
        type: PACKET_TYPES_REVERSE[type]
      };
};

const decodeBase64Packet = (data, binaryType) => {
  if (base64decoder) {
    const decoded = base64decoder.decode(data);
    return mapBinary(decoded, binaryType);
  } else {
    return { base64: true, data }; // fallback for old browsers
  }
};

const mapBinary = (data, binaryType) => {
  switch (binaryType) {
    case "blob":
      return data instanceof ArrayBuffer ? new Blob([data]) : data;
    case "arraybuffer":
    default:
      return data; // assuming the data is already an ArrayBuffer
  }
};

module.exports = decodePacket;


/***/ }),
/* 215 */
/***/ (function(module, exports) {

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  "use strict";

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

const Polling = __webpack_require__(105);
const globalThis = __webpack_require__(36);

const rNewline = /\n/g;
const rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

let callbacks;

class JSONPPolling extends Polling {
  /**
   * JSONP Polling constructor.
   *
   * @param {Object} opts.
   * @api public
   */
  constructor(opts) {
    super(opts);

    this.query = this.query || {};

    // define global callbacks array if not present
    // we do this here (lazily) to avoid unneeded global pollution
    if (!callbacks) {
      // we need to consider multiple engines in the same page
      callbacks = globalThis.___eio = globalThis.___eio || [];
    }

    // callback identifier
    this.index = callbacks.length;

    // add callback to jsonp global
    callbacks.push(this.onData.bind(this));

    // append to query string
    this.query.j = this.index;
  }

  /**
   * JSONP only supports binary as base64 encoded strings
   */
  get supportsBinary() {
    return false;
  }

  /**
   * Closes the socket.
   *
   * @api private
   */
  doClose() {
    if (this.script) {
      // prevent spurious errors from being emitted when the window is unloaded
      this.script.onerror = () => {};
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }

    if (this.form) {
      this.form.parentNode.removeChild(this.form);
      this.form = null;
      this.iframe = null;
    }

    super.doClose();
  }

  /**
   * Starts a poll cycle.
   *
   * @api private
   */
  doPoll() {
    const script = document.createElement("script");

    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }

    script.async = true;
    script.src = this.uri();
    script.onerror = e => {
      this.onError("jsonp poll error", e);
    };

    const insertAt = document.getElementsByTagName("script")[0];
    if (insertAt) {
      insertAt.parentNode.insertBefore(script, insertAt);
    } else {
      (document.head || document.body).appendChild(script);
    }
    this.script = script;

    const isUAgecko =
      "undefined" !== typeof navigator && /gecko/i.test(navigator.userAgent);

    if (isUAgecko) {
      setTimeout(function() {
        const iframe = document.createElement("iframe");
        document.body.appendChild(iframe);
        document.body.removeChild(iframe);
      }, 100);
    }
  }

  /**
   * Writes with a hidden iframe.
   *
   * @param {String} data to send
   * @param {Function} called upon flush.
   * @api private
   */
  doWrite(data, fn) {
    let iframe;

    if (!this.form) {
      const form = document.createElement("form");
      const area = document.createElement("textarea");
      const id = (this.iframeId = "eio_iframe_" + this.index);

      form.className = "socketio";
      form.style.position = "absolute";
      form.style.top = "-1000px";
      form.style.left = "-1000px";
      form.target = id;
      form.method = "POST";
      form.setAttribute("accept-charset", "utf-8");
      area.name = "d";
      form.appendChild(area);
      document.body.appendChild(form);

      this.form = form;
      this.area = area;
    }

    this.form.action = this.uri();

    function complete() {
      initIframe();
      fn();
    }

    const initIframe = () => {
      if (this.iframe) {
        try {
          this.form.removeChild(this.iframe);
        } catch (e) {
          this.onError("jsonp polling iframe removal error", e);
        }
      }

      try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        const html = '<iframe src="javascript:0" name="' + this.iframeId + '">';
        iframe = document.createElement(html);
      } catch (e) {
        iframe = document.createElement("iframe");
        iframe.name = this.iframeId;
        iframe.src = "javascript:0";
      }

      iframe.id = this.iframeId;

      this.form.appendChild(iframe);
      this.iframe = iframe;
    };

    initIframe();

    // escape \n to prevent it from being converted into \r\n by some UAs
    // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
    data = data.replace(rEscapedNewline, "\\\n");
    this.area.value = data.replace(rNewline, "\\n");

    try {
      this.form.submit();
    } catch (e) {}

    if (this.iframe.attachEvent) {
      this.iframe.onreadystatechange = () => {
        if (this.iframe.readyState === "complete") {
          complete();
        }
      };
    } else {
      this.iframe.onload = complete;
    }
  }
}

module.exports = JSONPPolling;


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {const Transport = __webpack_require__(58);
const parser = __webpack_require__(27);
const parseqs = __webpack_require__(59);
const yeast = __webpack_require__(107);
const { pick } = __webpack_require__(108);
const {
  WebSocket,
  usingBrowserWebSocket,
  defaultBinaryType,
  nextTick
} = __webpack_require__(222);

const debug = __webpack_require__(9)("engine.io-client:websocket");

// detect ReactNative environment
const isReactNative =
  typeof navigator !== "undefined" &&
  typeof navigator.product === "string" &&
  navigator.product.toLowerCase() === "reactnative";

class WS extends Transport {
  /**
   * WebSocket transport constructor.
   *
   * @api {Object} connection options
   * @api public
   */
  constructor(opts) {
    super(opts);

    this.supportsBinary = !opts.forceBase64;
  }

  /**
   * Transport name.
   *
   * @api public
   */
  get name() {
    return "websocket";
  }

  /**
   * Opens socket.
   *
   * @api private
   */
  doOpen() {
    if (!this.check()) {
      // let probe timeout
      return;
    }

    const uri = this.uri();
    const protocols = this.opts.protocols;

    // React Native only supports the 'headers' option, and will print a warning if anything else is passed
    const opts = isReactNative
      ? {}
      : pick(
          this.opts,
          "agent",
          "perMessageDeflate",
          "pfx",
          "key",
          "passphrase",
          "cert",
          "ca",
          "ciphers",
          "rejectUnauthorized",
          "localAddress",
          "protocolVersion",
          "origin",
          "maxPayload",
          "family",
          "checkServerIdentity"
        );

    if (this.opts.extraHeaders) {
      opts.headers = this.opts.extraHeaders;
    }

    try {
      this.ws =
        usingBrowserWebSocket && !isReactNative
          ? protocols
            ? new WebSocket(uri, protocols)
            : new WebSocket(uri)
          : new WebSocket(uri, protocols, opts);
    } catch (err) {
      return this.emit("error", err);
    }

    this.ws.binaryType = this.socket.binaryType || defaultBinaryType;

    this.addEventListeners();
  }

  /**
   * Adds event listeners to the socket
   *
   * @api private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      if (this.opts.autoUnref) {
        this.ws._socket.unref();
      }
      this.onOpen();
    };
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = ev => this.onData(ev.data);
    this.ws.onerror = e => this.onError("websocket error", e);
  }

  /**
   * Writes data to socket.
   *
   * @param {Array} array of packets.
   * @api private
   */
  write(packets) {
    this.writable = false;

    // encodePacket efficient as it uses WS framing
    // no need for encodePayload
    for (let i = 0; i < packets.length; i++) {
      const packet = packets[i];
      const lastPacket = i === packets.length - 1;

      parser.encodePacket(packet, this.supportsBinary, data => {
        // always create a new object (GH-437)
        const opts = {};
        if (!usingBrowserWebSocket) {
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (this.opts.perMessageDeflate) {
            const len =
              "string" === typeof data ? Buffer.byteLength(data) : data.length;
            if (len < this.opts.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        // Sometimes the websocket has already been closed but the browser didn't
        // have a chance of informing us about it yet, in that case send will
        // throw an error
        try {
          if (usingBrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            this.ws.send(data);
          } else {
            this.ws.send(data, opts);
          }
        } catch (e) {
          debug("websocket closed before onclose event");
        }

        if (lastPacket) {
          // fake drain
          // defer to next tick to allow Socket to clear writeBuffer
          nextTick(() => {
            this.writable = true;
            this.emit("drain");
          });
        }
      });
    }
  }

  /**
   * Called upon close
   *
   * @api private
   */
  onClose() {
    Transport.prototype.onClose.call(this);
  }

  /**
   * Closes socket.
   *
   * @api private
   */
  doClose() {
    if (typeof this.ws !== "undefined") {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Generates uri for connection.
   *
   * @api private
   */
  uri() {
    let query = this.query || {};
    const schema = this.opts.secure ? "wss" : "ws";
    let port = "";

    // avoid port if default for schema
    if (
      this.opts.port &&
      (("wss" === schema && Number(this.opts.port) !== 443) ||
        ("ws" === schema && Number(this.opts.port) !== 80))
    ) {
      port = ":" + this.opts.port;
    }

    // append timestamp to URI
    if (this.opts.timestampRequests) {
      query[this.opts.timestampParam] = yeast();
    }

    // communicate binary support capabilities
    if (!this.supportsBinary) {
      query.b64 = 1;
    }

    query = parseqs.encode(query);

    // prepend ? to query
    if (query.length) {
      query = "?" + query;
    }

    const ipv6 = this.opts.hostname.indexOf(":") !== -1;
    return (
      schema +
      "://" +
      (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
      port +
      this.opts.path +
      query
    );
  }

  /**
   * Feature detection for WebSocket.
   *
   * @return {Boolean} whether this transport is available.
   * @api public
   */
  check() {
    return (
      !!WebSocket &&
      !("__initialize" in WebSocket && this.name === WS.prototype.name)
    );
  }
}

module.exports = WS;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(218).Buffer))

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(219)
var ieee754 = __webpack_require__(220)
var isArray = __webpack_require__(221)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 220 */
/***/ (function(module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 221 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

const globalThis = __webpack_require__(36);
const nextTick = (() => {
  const isPromiseAvailable =
    typeof Promise === "function" && typeof Promise.resolve === "function";
  if (isPromiseAvailable) {
    return cb => Promise.resolve().then(cb);
  } else {
    return cb => setTimeout(cb, 0);
  }
})();

module.exports = {
  WebSocket: globalThis.WebSocket || globalThis.MozWebSocket,
  usingBrowserWebSocket: true,
  defaultBinaryType: "arraybuffer",
  nextTick
};


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.reconstructPacket = exports.deconstructPacket = void 0;
const is_binary_1 = __webpack_require__(110);
/**
 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @public
 */
function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'
    return { packet: pack, buffers: buffers };
}
exports.deconstructPacket = deconstructPacket;
function _deconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (is_binary_1.isBinary(data)) {
        const placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
    }
    else if (Array.isArray(data)) {
        const newData = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
    }
    else if (typeof data === "object" && !(data instanceof Date)) {
        const newData = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                newData[key] = _deconstructPacket(data[key], buffers);
            }
        }
        return newData;
    }
    return data;
}
/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @public
 */
function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    packet.attachments = undefined; // no longer useful
    return packet;
}
exports.reconstructPacket = reconstructPacket;
function _reconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (data && data._placeholder) {
        return buffers[data.num]; // appropriate buffer (should be natural order anyway)
    }
    else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i], buffers);
        }
    }
    else if (typeof data === "object") {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] = _reconstructPacket(data[key], buffers);
            }
        }
    }
    return data;
}


/***/ }),
/* 224 */
/***/ (function(module, exports) {


/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};



/***/ }),
/* 225 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__icons_onlineIcon_png__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__icons_onlineIcon_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__icons_onlineIcon_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__TextContainer_css__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__TextContainer_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__TextContainer_css__);
var TextContainer=function TextContainer(_ref){var users=_ref.users;return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',{className:'textContainer'},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',null,__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('h1',null,'Realtime Chat Application ',__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span',{role:'img','aria-label':'emoji'},'\uD83D\uDCAC')),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('h2',null,'Created with React, Express, Node and Socket.IO ',__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span',{role:'img','aria-label':'emoji'},'\u2764\uFE0F')),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('h2',null,'Try it out right now! ',__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span',{role:'img','aria-label':'emoji'},'\u2B05\uFE0F'))),users?__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',null,__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('h1',null,'People currently chatting:'),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',{className:'activeContainer'},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('h2',null,users.map(function(_ref2){var name=_ref2.name;return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',{key:name,className:'activeItem'},name,__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('img',{alt:'Online Icon',src:__WEBPACK_IMPORTED_MODULE_1__icons_onlineIcon_png__["default"]}));})))):null);};/* harmony default export */ __webpack_exports__["a"] = (TextContainer);

/***/ }),
/* 226 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: BrowserslistError: Unknown browser query `dead`\n    at error (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:37:11)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:222:9\n    at Array.forEach (<anonymous>)\n    at browserslist (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:196:13)\n    at cleanBrowsersList (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/utils.js:56:59)\n    at setBrowserScope (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:29:43)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:91:1)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at Module.load (node:internal/modules/cjs/loader:973:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:813:14)\n    at Module.require (node:internal/modules/cjs/loader:997:19)\n    at require (node:internal/modules/cjs/helpers:92:18)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-merge-rules/dist/lib/ensureCompatibility.js:7:19)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/webpack/lib/NormalModule.js:195:19\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:233:18\n    at runSyncOrAsync (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:143:3)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:232:2)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:221:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:236:3\n    at context.callback (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-loader/lib/index.js:180:9\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:94:5)");

/***/ }),
/* 227 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_scroll_to_bottom__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Message_Message__ = __webpack_require__(420);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Messages_css__ = __webpack_require__(422);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Messages_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__Messages_css__);
var Messages=function Messages(_ref){var messages=_ref.messages,name=_ref.name;return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_scroll_to_bottom__["a" /* default */],{className:'messages'},messages.map(function(message,i){return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',{key:i},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__Message_Message__["a" /* default */],{message:message,name:name}));}));};/* harmony default export */ __webpack_exports__["a"] = (Messages);

/***/ }),
/* 228 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__addVersionToMetaTag__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ScrollToBottom_AutoHideFollowButton__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__BasicScrollToBottom__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ScrollToBottom_Composer__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ScrollToBottom_FunctionContext__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ScrollToBottom_Panel__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ScrollToBottom_StateContext__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__hooks_useAnimating__ = __webpack_require__(408);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__hooks_useAnimatingToEnd__ = __webpack_require__(409);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__hooks_useAtBottom__ = __webpack_require__(410);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__hooks_useAtEnd__ = __webpack_require__(411);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__hooks_useAtStart__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__hooks_useAtTop__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__hooks_useMode__ = __webpack_require__(414);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__hooks_useObserveScrollPosition__ = __webpack_require__(415);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__hooks_useScrollTo__ = __webpack_require__(416);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__hooks_useScrollToBottom__ = __webpack_require__(417);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__hooks_useScrollToEnd__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__hooks_useScrollToStart__ = __webpack_require__(418);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__hooks_useScrollToTop__ = __webpack_require__(419);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__hooks_useSticky__ = __webpack_require__(144);
/* unused harmony reexport AutoHideFollowButton */
/* unused harmony reexport Composer */
/* unused harmony reexport FunctionContext */
/* unused harmony reexport Panel */
/* unused harmony reexport StateContext */
/* unused harmony reexport useAnimating */
/* unused harmony reexport useAnimatingToEnd */
/* unused harmony reexport useAtBottom */
/* unused harmony reexport useAtEnd */
/* unused harmony reexport useAtStart */
/* unused harmony reexport useAtTop */
/* unused harmony reexport useMode */
/* unused harmony reexport useObserveScrollPosition */
/* unused harmony reexport useScrollTo */
/* unused harmony reexport useScrollToBottom */
/* unused harmony reexport useScrollToEnd */
/* unused harmony reexport useScrollToStart */
/* unused harmony reexport useScrollToTop */
/* unused harmony reexport useSticky */





















/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_2__BasicScrollToBottom__["a" /* default */]);

Object(__WEBPACK_IMPORTED_MODULE_0__addVersionToMetaTag__["a" /* default */])();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJhZGRWZXJzaW9uVG9NZXRhVGFnIiwiQXV0b0hpZGVGb2xsb3dCdXR0b24iLCJCYXNpY1Njcm9sbFRvQm90dG9tIiwiQ29tcG9zZXIiLCJGdW5jdGlvbkNvbnRleHQiLCJQYW5lbCIsIlN0YXRlQ29udGV4dCIsInVzZUFuaW1hdGluZyIsInVzZUFuaW1hdGluZ1RvRW5kIiwidXNlQXRCb3R0b20iLCJ1c2VBdEVuZCIsInVzZUF0U3RhcnQiLCJ1c2VBdFRvcCIsInVzZU1vZGUiLCJ1c2VPYnNlcnZlU2Nyb2xsUG9zaXRpb24iLCJ1c2VTY3JvbGxUbyIsInVzZVNjcm9sbFRvQm90dG9tIiwidXNlU2Nyb2xsVG9FbmQiLCJ1c2VTY3JvbGxUb1N0YXJ0IiwidXNlU2Nyb2xsVG9Ub3AiLCJ1c2VTdGlja3kiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLG1CQUFQLE1BQWdDLHVCQUFoQztBQUVBLE9BQU9DLG9CQUFQLE1BQWlDLHVDQUFqQztBQUNBLE9BQU9DLG1CQUFQLE1BQWdDLHVCQUFoQztBQUNBLE9BQU9DLFFBQVAsTUFBcUIsMkJBQXJCO0FBQ0EsT0FBT0MsZUFBUCxNQUE0QixrQ0FBNUI7QUFDQSxPQUFPQyxLQUFQLE1BQWtCLHdCQUFsQjtBQUNBLE9BQU9DLFlBQVAsTUFBeUIsK0JBQXpCO0FBRUEsT0FBT0MsWUFBUCxNQUF5QixzQkFBekI7QUFDQSxPQUFPQyxpQkFBUCxNQUE4QiwyQkFBOUI7QUFDQSxPQUFPQyxXQUFQLE1BQXdCLHFCQUF4QjtBQUNBLE9BQU9DLFFBQVAsTUFBcUIsa0JBQXJCO0FBQ0EsT0FBT0MsVUFBUCxNQUF1QixvQkFBdkI7QUFDQSxPQUFPQyxRQUFQLE1BQXFCLGtCQUFyQjtBQUNBLE9BQU9DLE9BQVAsTUFBb0IsaUJBQXBCO0FBQ0EsT0FBT0Msd0JBQVAsTUFBcUMsa0NBQXJDO0FBQ0EsT0FBT0MsV0FBUCxNQUF3QixxQkFBeEI7QUFDQSxPQUFPQyxpQkFBUCxNQUE4QiwyQkFBOUI7QUFDQSxPQUFPQyxjQUFQLE1BQTJCLHdCQUEzQjtBQUNBLE9BQU9DLGdCQUFQLE1BQTZCLDBCQUE3QjtBQUNBLE9BQU9DLGNBQVAsTUFBMkIsd0JBQTNCO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixtQkFBdEI7QUFFQSxlQUFlbEIsbUJBQWY7QUFFQSxTQUNFRCxvQkFERixFQUVFRSxRQUZGLEVBR0VDLGVBSEYsRUFJRUMsS0FKRixFQUtFQyxZQUxGLEVBTUVDLFlBTkYsRUFPRUMsaUJBUEYsRUFRRUMsV0FSRixFQVNFQyxRQVRGLEVBVUVDLFVBVkYsRUFXRUMsUUFYRixFQVlFQyxPQVpGLEVBYUVDLHdCQWJGLEVBY0VDLFdBZEYsRUFlRUMsaUJBZkYsRUFnQkVDLGNBaEJGLEVBaUJFQyxnQkFqQkYsRUFrQkVDLGNBbEJGLEVBbUJFQyxTQW5CRjtBQXNCQXBCLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhZGRWZXJzaW9uVG9NZXRhVGFnIGZyb20gJy4vYWRkVmVyc2lvblRvTWV0YVRhZyc7XG5cbmltcG9ydCBBdXRvSGlkZUZvbGxvd0J1dHRvbiBmcm9tICcuL1Njcm9sbFRvQm90dG9tL0F1dG9IaWRlRm9sbG93QnV0dG9uJztcbmltcG9ydCBCYXNpY1Njcm9sbFRvQm90dG9tIGZyb20gJy4vQmFzaWNTY3JvbGxUb0JvdHRvbSc7XG5pbXBvcnQgQ29tcG9zZXIgZnJvbSAnLi9TY3JvbGxUb0JvdHRvbS9Db21wb3Nlcic7XG5pbXBvcnQgRnVuY3Rpb25Db250ZXh0IGZyb20gJy4vU2Nyb2xsVG9Cb3R0b20vRnVuY3Rpb25Db250ZXh0JztcbmltcG9ydCBQYW5lbCBmcm9tICcuL1Njcm9sbFRvQm90dG9tL1BhbmVsJztcbmltcG9ydCBTdGF0ZUNvbnRleHQgZnJvbSAnLi9TY3JvbGxUb0JvdHRvbS9TdGF0ZUNvbnRleHQnO1xuXG5pbXBvcnQgdXNlQW5pbWF0aW5nIGZyb20gJy4vaG9va3MvdXNlQW5pbWF0aW5nJztcbmltcG9ydCB1c2VBbmltYXRpbmdUb0VuZCBmcm9tICcuL2hvb2tzL3VzZUFuaW1hdGluZ1RvRW5kJztcbmltcG9ydCB1c2VBdEJvdHRvbSBmcm9tICcuL2hvb2tzL3VzZUF0Qm90dG9tJztcbmltcG9ydCB1c2VBdEVuZCBmcm9tICcuL2hvb2tzL3VzZUF0RW5kJztcbmltcG9ydCB1c2VBdFN0YXJ0IGZyb20gJy4vaG9va3MvdXNlQXRTdGFydCc7XG5pbXBvcnQgdXNlQXRUb3AgZnJvbSAnLi9ob29rcy91c2VBdFRvcCc7XG5pbXBvcnQgdXNlTW9kZSBmcm9tICcuL2hvb2tzL3VzZU1vZGUnO1xuaW1wb3J0IHVzZU9ic2VydmVTY3JvbGxQb3NpdGlvbiBmcm9tICcuL2hvb2tzL3VzZU9ic2VydmVTY3JvbGxQb3NpdGlvbic7XG5pbXBvcnQgdXNlU2Nyb2xsVG8gZnJvbSAnLi9ob29rcy91c2VTY3JvbGxUbyc7XG5pbXBvcnQgdXNlU2Nyb2xsVG9Cb3R0b20gZnJvbSAnLi9ob29rcy91c2VTY3JvbGxUb0JvdHRvbSc7XG5pbXBvcnQgdXNlU2Nyb2xsVG9FbmQgZnJvbSAnLi9ob29rcy91c2VTY3JvbGxUb0VuZCc7XG5pbXBvcnQgdXNlU2Nyb2xsVG9TdGFydCBmcm9tICcuL2hvb2tzL3VzZVNjcm9sbFRvU3RhcnQnO1xuaW1wb3J0IHVzZVNjcm9sbFRvVG9wIGZyb20gJy4vaG9va3MvdXNlU2Nyb2xsVG9Ub3AnO1xuaW1wb3J0IHVzZVN0aWNreSBmcm9tICcuL2hvb2tzL3VzZVN0aWNreSc7XG5cbmV4cG9ydCBkZWZhdWx0IEJhc2ljU2Nyb2xsVG9Cb3R0b207XG5cbmV4cG9ydCB7XG4gIEF1dG9IaWRlRm9sbG93QnV0dG9uLFxuICBDb21wb3NlcixcbiAgRnVuY3Rpb25Db250ZXh0LFxuICBQYW5lbCxcbiAgU3RhdGVDb250ZXh0LFxuICB1c2VBbmltYXRpbmcsXG4gIHVzZUFuaW1hdGluZ1RvRW5kLFxuICB1c2VBdEJvdHRvbSxcbiAgdXNlQXRFbmQsXG4gIHVzZUF0U3RhcnQsXG4gIHVzZUF0VG9wLFxuICB1c2VNb2RlLFxuICB1c2VPYnNlcnZlU2Nyb2xsUG9zaXRpb24sXG4gIHVzZVNjcm9sbFRvLFxuICB1c2VTY3JvbGxUb0JvdHRvbSxcbiAgdXNlU2Nyb2xsVG9FbmQsXG4gIHVzZVNjcm9sbFRvU3RhcnQsXG4gIHVzZVNjcm9sbFRvVG9wLFxuICB1c2VTdGlja3lcbn07XG5cbmFkZFZlcnNpb25Ub01ldGFUYWcoKTtcbiJdfQ==

/***/ }),
/* 229 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["a"] = addVersionToMetaTag;
/* global global:readonly, process:readonly */

/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
function setMetaTag(name, content) {
  try {
    var _global = global,
        document = _global.document;

    if (typeof document !== 'undefined' && document.createElement && document.head && document.head.appendChild) {
      var meta = document.querySelector("html meta[name=\"".concat(encodeURI(name), "\"]")) || document.createElement('meta');
      meta.setAttribute('name', name);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }
  } catch (err) {}
}

function addVersionToMetaTag() {
  setMetaTag('react-scroll-to-bottom:version', "4.1.2");
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRWZXJzaW9uVG9NZXRhVGFnLmpzIl0sIm5hbWVzIjpbInNldE1ldGFUYWciLCJuYW1lIiwiY29udGVudCIsImdsb2JhbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImhlYWQiLCJhcHBlbmRDaGlsZCIsIm1ldGEiLCJxdWVyeVNlbGVjdG9yIiwiZW5jb2RlVVJJIiwic2V0QXR0cmlidXRlIiwiZXJyIiwiYWRkVmVyc2lvblRvTWV0YVRhZyJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0E7QUFFQSxTQUFTQSxVQUFULENBQW9CQyxJQUFwQixFQUEwQkMsT0FBMUIsRUFBbUM7QUFDakMsTUFBSTtBQUNGLGtCQUFxQkMsTUFBckI7QUFBQSxRQUFRQyxRQUFSLFdBQVFBLFFBQVI7O0FBRUEsUUFBSSxPQUFPQSxRQUFQLEtBQW9CLFdBQXBCLElBQW1DQSxRQUFRLENBQUNDLGFBQTVDLElBQTZERCxRQUFRLENBQUNFLElBQXRFLElBQThFRixRQUFRLENBQUNFLElBQVQsQ0FBY0MsV0FBaEcsRUFBNkc7QUFDM0csVUFBTUMsSUFBSSxHQUFHSixRQUFRLENBQUNLLGFBQVQsNEJBQTBDQyxTQUFTLENBQUNULElBQUQsQ0FBbkQsYUFBa0VHLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixNQUF2QixDQUEvRTtBQUVBRyxNQUFBQSxJQUFJLENBQUNHLFlBQUwsQ0FBa0IsTUFBbEIsRUFBMEJWLElBQTFCO0FBQ0FPLE1BQUFBLElBQUksQ0FBQ0csWUFBTCxDQUFrQixTQUFsQixFQUE2QlQsT0FBN0I7QUFFQUUsTUFBQUEsUUFBUSxDQUFDRSxJQUFULENBQWNDLFdBQWQsQ0FBMEJDLElBQTFCO0FBQ0Q7QUFDRixHQVhELENBV0UsT0FBT0ksR0FBUCxFQUFZLENBQUU7QUFDakI7O0FBRUQsZUFBZSxTQUFTQyxtQkFBVCxHQUErQjtBQUM1Q2IsRUFBQUEsVUFBVSxDQUFDLGdDQUFELFVBQVY7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBnbG9iYWw6cmVhZG9ubHksIHByb2Nlc3M6cmVhZG9ubHkgKi9cbi8qIGVzbGludCBuby1lbXB0eTogW1wiZXJyb3JcIiwgeyBcImFsbG93RW1wdHlDYXRjaFwiOiB0cnVlIH1dICovXG5cbmZ1bmN0aW9uIHNldE1ldGFUYWcobmFtZSwgY29udGVudCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgZG9jdW1lbnQgfSA9IGdsb2JhbDtcblxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJiYgZG9jdW1lbnQuaGVhZCAmJiBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKSB7XG4gICAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgaHRtbCBtZXRhW25hbWU9XCIke2VuY29kZVVSSShuYW1lKX1cIl1gKSB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtZXRhJyk7XG5cbiAgICAgIG1ldGEuc2V0QXR0cmlidXRlKCduYW1lJywgbmFtZSk7XG4gICAgICBtZXRhLnNldEF0dHJpYnV0ZSgnY29udGVudCcsIGNvbnRlbnQpO1xuXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGEpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRWZXJzaW9uVG9NZXRhVGFnKCkge1xuICBzZXRNZXRhVGFnKCdyZWFjdC1zY3JvbGwtdG8tYm90dG9tOnZlcnNpb24nLCBwcm9jZXNzLmVudi5ucG1fcGFja2FnZV92ZXJzaW9uKTtcbn1cbiJdfQ==
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(21)))

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$isArray = __webpack_require__(115);

function _arrayWithHoles(arr) {
  if (_Array$isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(116);

module.exports = parent;


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);
var isArray = __webpack_require__(30);

// `Array.isArray` method
// https://tc39.es/ecma262/#sec-array.isarray
$({ target: 'Array', stat: true }, {
  isArray: isArray
});


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),
/* 234 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

var _Symbol = __webpack_require__(121);

var _getIteratorMethod = __webpack_require__(133);

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof _Symbol !== "undefined" && _getIteratorMethod(arr) || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(237);
__webpack_require__(262);
__webpack_require__(263);
__webpack_require__(264);
__webpack_require__(265);
__webpack_require__(266);
// TODO: Remove from `core-js@4`
__webpack_require__(267);
// TODO: Remove from `core-js@4`
__webpack_require__(268);

module.exports = parent;


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(122);
__webpack_require__(239);
__webpack_require__(125);
__webpack_require__(245);
__webpack_require__(246);
__webpack_require__(247);
__webpack_require__(248);
__webpack_require__(249);
__webpack_require__(250);
__webpack_require__(251);
__webpack_require__(252);
__webpack_require__(253);
__webpack_require__(254);
__webpack_require__(255);
__webpack_require__(256);
__webpack_require__(257);
__webpack_require__(258);
__webpack_require__(259);
__webpack_require__(260);
__webpack_require__(261);
var path = __webpack_require__(3);

module.exports = path.Symbol;


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var createNonEnumerableProperty = __webpack_require__(14);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),
/* 239 */
/***/ (function(module, exports) {

// empty


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(42);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable es/no-object-getownpropertynames -- safe */
var toIndexedObject = __webpack_require__(12);
var $getOwnPropertyNames = __webpack_require__(73).f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(74);
var classof = __webpack_require__(47);

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var inspectSource = __webpack_require__(244);

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(66);

var functionToString = Function.toString;

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');


/***/ }),
/* 246 */
/***/ (function(module, exports) {

// empty


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.hasInstance` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.match` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.matchAll` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.matchall
defineWellKnownSymbol('matchAll');


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.replace` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.search` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.species` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.split` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.toPrimitive` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.unscopables` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var setToStringTag = __webpack_require__(46);

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 260 */
/***/ (function(module, exports) {

// empty


/***/ }),
/* 261 */
/***/ (function(module, exports) {

// empty


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('asyncDispose');


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('dispose');


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.matcher` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('matcher');


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.metadata` well-known symbol
// https://github.com/tc39/proposal-decorators
defineWellKnownSymbol('metadata');


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol('observable');


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

// TODO: remove from `core-js@4`
var defineWellKnownSymbol = __webpack_require__(1);

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('patternMatch');


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

// TODO: remove from `core-js@4`
var defineWellKnownSymbol = __webpack_require__(1);

defineWellKnownSymbol('replaceAll');


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(134);
__webpack_require__(138);
var getIteratorMethod = __webpack_require__(139);

module.exports = getIteratorMethod;


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(12);
var addToUnscopables = __webpack_require__(271);
var Iterators = __webpack_require__(23);
var InternalStateModule = __webpack_require__(75);
var defineIterator = __webpack_require__(135);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 271 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__(136).IteratorPrototype;
var create = __webpack_require__(126);
var createPropertyDescriptor = __webpack_require__(29);
var setToStringTag = __webpack_require__(46);
var Iterators = __webpack_require__(23);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(6);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var anObject = __webpack_require__(17);
var aPossiblePrototype = __webpack_require__(275);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),
/* 276 */
/***/ (function(module, exports) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(40);
var requireObjectCoercible = __webpack_require__(62);

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(279);

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(280);

module.exports = parent;


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

var slice = __webpack_require__(281);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.slice;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.slice) ? slice : own;
};


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(282);
var entryVirtual = __webpack_require__(24);

module.exports = entryVirtual('Array').slice;


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var isObject = __webpack_require__(13);
var isArray = __webpack_require__(30);
var toAbsoluteIndex = __webpack_require__(71);
var toLength = __webpack_require__(22);
var toIndexedObject = __webpack_require__(12);
var createProperty = __webpack_require__(31);
var wellKnownSymbol = __webpack_require__(4);
var arrayMethodHasSpeciesSupport = __webpack_require__(43);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(284);

module.exports = parent;


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(138);
__webpack_require__(285);
var path = __webpack_require__(3);

module.exports = path.Array.from;


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);
var from = __webpack_require__(286);
var checkCorrectnessOfIteration = __webpack_require__(290);

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(63);
var toObject = __webpack_require__(16);
var callWithSafeIterationClosing = __webpack_require__(287);
var isArrayIteratorMethod = __webpack_require__(289);
var toLength = __webpack_require__(22);
var createProperty = __webpack_require__(31);
var getIteratorMethod = __webpack_require__(139);

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);
var iteratorClose = __webpack_require__(288);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator);
    throw error;
  }
};


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);

module.exports = function (iterator) {
  var returnMethod = iterator['return'];
  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(4);
var Iterators = __webpack_require__(23);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(4);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),
/* 291 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 292 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_classnames__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ScrollToBottom_AutoHideFollowButton__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ScrollToBottom_Composer__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ScrollToBottom_Panel__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__hooks_internal_useStyleToClassName__ = __webpack_require__(80);







var ROOT_STYLE = {
  position: 'relative'
};

var BasicScrollToBottomCore = function BasicScrollToBottomCore(_ref) {
  var children = _ref.children,
      className = _ref.className,
      followButtonClassName = _ref.followButtonClassName,
      scrollViewClassName = _ref.scrollViewClassName;
  var rootCSS = Object(__WEBPACK_IMPORTED_MODULE_6__hooks_internal_useStyleToClassName__["a" /* default */])()(ROOT_STYLE);
  return /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement("div", {
    className: __WEBPACK_IMPORTED_MODULE_0_classnames___default()(rootCSS, (className || '') + '')
  }, /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__ScrollToBottom_Panel__["a" /* default */], {
    className: (scrollViewClassName || '') + ''
  }, children), /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__ScrollToBottom_AutoHideFollowButton__["a" /* default */], {
    className: (followButtonClassName || '') + ''
  }));
};

BasicScrollToBottomCore.defaultProps = {
  children: undefined,
  className: undefined,
  followButtonClassName: undefined,
  scrollViewClassName: undefined
};
BasicScrollToBottomCore.propTypes = {
  children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.any,
  className: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
  followButtonClassName: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
  scrollViewClassName: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string
};

var BasicScrollToBottom = function BasicScrollToBottom(_ref2) {
  var checkInterval = _ref2.checkInterval,
      children = _ref2.children,
      className = _ref2.className,
      debounce = _ref2.debounce,
      debug = _ref2.debug,
      followButtonClassName = _ref2.followButtonClassName,
      initialScrollBehavior = _ref2.initialScrollBehavior,
      mode = _ref2.mode,
      nonce = _ref2.nonce,
      scroller = _ref2.scroller,
      scrollViewClassName = _ref2.scrollViewClassName;
  return /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__ScrollToBottom_Composer__["a" /* default */], {
    checkInterval: checkInterval,
    debounce: debounce,
    debug: debug,
    initialScrollBehavior: initialScrollBehavior,
    mode: mode,
    nonce: nonce,
    scroller: scroller
  }, /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(BasicScrollToBottomCore, {
    className: className,
    followButtonClassName: followButtonClassName,
    scrollViewClassName: scrollViewClassName
  }, children));
};

BasicScrollToBottom.defaultProps = {
  checkInterval: undefined,
  children: undefined,
  className: undefined,
  debounce: undefined,
  debug: undefined,
  followButtonClassName: undefined,
  initialScrollBehavior: 'smooth',
  mode: undefined,
  nonce: undefined,
  scroller: undefined,
  scrollViewClassName: undefined
};
BasicScrollToBottom.propTypes = {
  checkInterval: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.number,
  children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.any,
  className: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
  debounce: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.number,
  debug: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
  followButtonClassName: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
  initialScrollBehavior: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOf(['auto', 'smooth']),
  mode: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOf(['bottom', 'top']),
  nonce: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
  scroller: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
  scrollViewClassName: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string
};
/* harmony default export */ __webpack_exports__["a"] = (BasicScrollToBottom);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9CYXNpY1Njcm9sbFRvQm90dG9tLmpzIl0sIm5hbWVzIjpbImNsYXNzTmFtZXMiLCJQcm9wVHlwZXMiLCJSZWFjdCIsIkF1dG9IaWRlRm9sbG93QnV0dG9uIiwiQ29tcG9zZXIiLCJQYW5lbCIsInVzZVN0eWxlVG9DbGFzc05hbWUiLCJST09UX1NUWUxFIiwicG9zaXRpb24iLCJCYXNpY1Njcm9sbFRvQm90dG9tQ29yZSIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwiZm9sbG93QnV0dG9uQ2xhc3NOYW1lIiwic2Nyb2xsVmlld0NsYXNzTmFtZSIsInJvb3RDU1MiLCJkZWZhdWx0UHJvcHMiLCJ1bmRlZmluZWQiLCJwcm9wVHlwZXMiLCJhbnkiLCJzdHJpbmciLCJCYXNpY1Njcm9sbFRvQm90dG9tIiwiY2hlY2tJbnRlcnZhbCIsImRlYm91bmNlIiwiZGVidWciLCJpbml0aWFsU2Nyb2xsQmVoYXZpb3IiLCJtb2RlIiwibm9uY2UiLCJzY3JvbGxlciIsIm51bWJlciIsImJvb2wiLCJvbmVPZiIsImZ1bmMiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLFVBQVAsTUFBdUIsWUFBdkI7QUFDQSxPQUFPQyxTQUFQLE1BQXNCLFlBQXRCO0FBQ0EsT0FBT0MsS0FBUCxNQUFrQixPQUFsQjtBQUVBLE9BQU9DLG9CQUFQLE1BQWlDLHVDQUFqQztBQUNBLE9BQU9DLFFBQVAsTUFBcUIsMkJBQXJCO0FBQ0EsT0FBT0MsS0FBUCxNQUFrQix3QkFBbEI7QUFDQSxPQUFPQyxtQkFBUCxNQUFnQyxzQ0FBaEM7QUFFQSxJQUFNQyxVQUFVLEdBQUc7QUFDakJDLEVBQUFBLFFBQVEsRUFBRTtBQURPLENBQW5COztBQUlBLElBQU1DLHVCQUF1QixHQUFHLFNBQTFCQSx1QkFBMEIsT0FBeUU7QUFBQSxNQUF0RUMsUUFBc0UsUUFBdEVBLFFBQXNFO0FBQUEsTUFBNURDLFNBQTRELFFBQTVEQSxTQUE0RDtBQUFBLE1BQWpEQyxxQkFBaUQsUUFBakRBLHFCQUFpRDtBQUFBLE1BQTFCQyxtQkFBMEIsUUFBMUJBLG1CQUEwQjtBQUN2RyxNQUFNQyxPQUFPLEdBQUdSLG1CQUFtQixHQUFHQyxVQUFILENBQW5DO0FBRUEsc0JBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBRVAsVUFBVSxDQUFDYyxPQUFELEVBQVUsQ0FBQ0gsU0FBUyxJQUFJLEVBQWQsSUFBb0IsRUFBOUI7QUFBMUIsa0JBQ0Usb0JBQUMsS0FBRDtBQUFPLElBQUEsU0FBUyxFQUFFLENBQUNFLG1CQUFtQixJQUFJLEVBQXhCLElBQThCO0FBQWhELEtBQXFESCxRQUFyRCxDQURGLGVBRUUsb0JBQUMsb0JBQUQ7QUFBc0IsSUFBQSxTQUFTLEVBQUUsQ0FBQ0UscUJBQXFCLElBQUksRUFBMUIsSUFBZ0M7QUFBakUsSUFGRixDQURGO0FBTUQsQ0FURDs7QUFXQUgsdUJBQXVCLENBQUNNLFlBQXhCLEdBQXVDO0FBQ3JDTCxFQUFBQSxRQUFRLEVBQUVNLFNBRDJCO0FBRXJDTCxFQUFBQSxTQUFTLEVBQUVLLFNBRjBCO0FBR3JDSixFQUFBQSxxQkFBcUIsRUFBRUksU0FIYztBQUlyQ0gsRUFBQUEsbUJBQW1CLEVBQUVHO0FBSmdCLENBQXZDO0FBT0FQLHVCQUF1QixDQUFDUSxTQUF4QixHQUFvQztBQUNsQ1AsRUFBQUEsUUFBUSxFQUFFVCxTQUFTLENBQUNpQixHQURjO0FBRWxDUCxFQUFBQSxTQUFTLEVBQUVWLFNBQVMsQ0FBQ2tCLE1BRmE7QUFHbENQLEVBQUFBLHFCQUFxQixFQUFFWCxTQUFTLENBQUNrQixNQUhDO0FBSWxDTixFQUFBQSxtQkFBbUIsRUFBRVosU0FBUyxDQUFDa0I7QUFKRyxDQUFwQzs7QUFPQSxJQUFNQyxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQXNCO0FBQUEsTUFDMUJDLGFBRDBCLFNBQzFCQSxhQUQwQjtBQUFBLE1BRTFCWCxRQUYwQixTQUUxQkEsUUFGMEI7QUFBQSxNQUcxQkMsU0FIMEIsU0FHMUJBLFNBSDBCO0FBQUEsTUFJMUJXLFFBSjBCLFNBSTFCQSxRQUowQjtBQUFBLE1BSzFCQyxLQUwwQixTQUsxQkEsS0FMMEI7QUFBQSxNQU0xQlgscUJBTjBCLFNBTTFCQSxxQkFOMEI7QUFBQSxNQU8xQlkscUJBUDBCLFNBTzFCQSxxQkFQMEI7QUFBQSxNQVExQkMsSUFSMEIsU0FRMUJBLElBUjBCO0FBQUEsTUFTMUJDLEtBVDBCLFNBUzFCQSxLQVQwQjtBQUFBLE1BVTFCQyxRQVYwQixTQVUxQkEsUUFWMEI7QUFBQSxNQVcxQmQsbUJBWDBCLFNBVzFCQSxtQkFYMEI7QUFBQSxzQkFhMUIsb0JBQUMsUUFBRDtBQUNFLElBQUEsYUFBYSxFQUFFUSxhQURqQjtBQUVFLElBQUEsUUFBUSxFQUFFQyxRQUZaO0FBR0UsSUFBQSxLQUFLLEVBQUVDLEtBSFQ7QUFJRSxJQUFBLHFCQUFxQixFQUFFQyxxQkFKekI7QUFLRSxJQUFBLElBQUksRUFBRUMsSUFMUjtBQU1FLElBQUEsS0FBSyxFQUFFQyxLQU5UO0FBT0UsSUFBQSxRQUFRLEVBQUVDO0FBUFosa0JBU0Usb0JBQUMsdUJBQUQ7QUFDRSxJQUFBLFNBQVMsRUFBRWhCLFNBRGI7QUFFRSxJQUFBLHFCQUFxQixFQUFFQyxxQkFGekI7QUFHRSxJQUFBLG1CQUFtQixFQUFFQztBQUh2QixLQUtHSCxRQUxILENBVEYsQ0FiMEI7QUFBQSxDQUE1Qjs7QUFnQ0FVLG1CQUFtQixDQUFDTCxZQUFwQixHQUFtQztBQUNqQ00sRUFBQUEsYUFBYSxFQUFFTCxTQURrQjtBQUVqQ04sRUFBQUEsUUFBUSxFQUFFTSxTQUZ1QjtBQUdqQ0wsRUFBQUEsU0FBUyxFQUFFSyxTQUhzQjtBQUlqQ00sRUFBQUEsUUFBUSxFQUFFTixTQUp1QjtBQUtqQ08sRUFBQUEsS0FBSyxFQUFFUCxTQUwwQjtBQU1qQ0osRUFBQUEscUJBQXFCLEVBQUVJLFNBTlU7QUFPakNRLEVBQUFBLHFCQUFxQixFQUFFLFFBUFU7QUFRakNDLEVBQUFBLElBQUksRUFBRVQsU0FSMkI7QUFTakNVLEVBQUFBLEtBQUssRUFBRVYsU0FUMEI7QUFVakNXLEVBQUFBLFFBQVEsRUFBRVgsU0FWdUI7QUFXakNILEVBQUFBLG1CQUFtQixFQUFFRztBQVhZLENBQW5DO0FBY0FJLG1CQUFtQixDQUFDSCxTQUFwQixHQUFnQztBQUM5QkksRUFBQUEsYUFBYSxFQUFFcEIsU0FBUyxDQUFDMkIsTUFESztBQUU5QmxCLEVBQUFBLFFBQVEsRUFBRVQsU0FBUyxDQUFDaUIsR0FGVTtBQUc5QlAsRUFBQUEsU0FBUyxFQUFFVixTQUFTLENBQUNrQixNQUhTO0FBSTlCRyxFQUFBQSxRQUFRLEVBQUVyQixTQUFTLENBQUMyQixNQUpVO0FBSzlCTCxFQUFBQSxLQUFLLEVBQUV0QixTQUFTLENBQUM0QixJQUxhO0FBTTlCakIsRUFBQUEscUJBQXFCLEVBQUVYLFNBQVMsQ0FBQ2tCLE1BTkg7QUFPOUJLLEVBQUFBLHFCQUFxQixFQUFFdkIsU0FBUyxDQUFDNkIsS0FBVixDQUFnQixDQUFDLE1BQUQsRUFBUyxRQUFULENBQWhCLENBUE87QUFROUJMLEVBQUFBLElBQUksRUFBRXhCLFNBQVMsQ0FBQzZCLEtBQVYsQ0FBZ0IsQ0FBQyxRQUFELEVBQVcsS0FBWCxDQUFoQixDQVJ3QjtBQVM5QkosRUFBQUEsS0FBSyxFQUFFekIsU0FBUyxDQUFDa0IsTUFUYTtBQVU5QlEsRUFBQUEsUUFBUSxFQUFFMUIsU0FBUyxDQUFDOEIsSUFWVTtBQVc5QmxCLEVBQUFBLG1CQUFtQixFQUFFWixTQUFTLENBQUNrQjtBQVhELENBQWhDO0FBY0EsZUFBZUMsbUJBQWYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgQXV0b0hpZGVGb2xsb3dCdXR0b24gZnJvbSAnLi9TY3JvbGxUb0JvdHRvbS9BdXRvSGlkZUZvbGxvd0J1dHRvbic7XG5pbXBvcnQgQ29tcG9zZXIgZnJvbSAnLi9TY3JvbGxUb0JvdHRvbS9Db21wb3Nlcic7XG5pbXBvcnQgUGFuZWwgZnJvbSAnLi9TY3JvbGxUb0JvdHRvbS9QYW5lbCc7XG5pbXBvcnQgdXNlU3R5bGVUb0NsYXNzTmFtZSBmcm9tICcuL2hvb2tzL2ludGVybmFsL3VzZVN0eWxlVG9DbGFzc05hbWUnO1xuXG5jb25zdCBST09UX1NUWUxFID0ge1xuICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xufTtcblxuY29uc3QgQmFzaWNTY3JvbGxUb0JvdHRvbUNvcmUgPSAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBmb2xsb3dCdXR0b25DbGFzc05hbWUsIHNjcm9sbFZpZXdDbGFzc05hbWUgfSkgPT4ge1xuICBjb25zdCByb290Q1NTID0gdXNlU3R5bGVUb0NsYXNzTmFtZSgpKFJPT1RfU1RZTEUpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMocm9vdENTUywgKGNsYXNzTmFtZSB8fCAnJykgKyAnJyl9PlxuICAgICAgPFBhbmVsIGNsYXNzTmFtZT17KHNjcm9sbFZpZXdDbGFzc05hbWUgfHwgJycpICsgJyd9PntjaGlsZHJlbn08L1BhbmVsPlxuICAgICAgPEF1dG9IaWRlRm9sbG93QnV0dG9uIGNsYXNzTmFtZT17KGZvbGxvd0J1dHRvbkNsYXNzTmFtZSB8fCAnJykgKyAnJ30gLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbkJhc2ljU2Nyb2xsVG9Cb3R0b21Db3JlLmRlZmF1bHRQcm9wcyA9IHtcbiAgY2hpbGRyZW46IHVuZGVmaW5lZCxcbiAgY2xhc3NOYW1lOiB1bmRlZmluZWQsXG4gIGZvbGxvd0J1dHRvbkNsYXNzTmFtZTogdW5kZWZpbmVkLFxuICBzY3JvbGxWaWV3Q2xhc3NOYW1lOiB1bmRlZmluZWRcbn07XG5cbkJhc2ljU2Nyb2xsVG9Cb3R0b21Db3JlLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hbnksXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgZm9sbG93QnV0dG9uQ2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzY3JvbGxWaWV3Q2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5jb25zdCBCYXNpY1Njcm9sbFRvQm90dG9tID0gKHtcbiAgY2hlY2tJbnRlcnZhbCxcbiAgY2hpbGRyZW4sXG4gIGNsYXNzTmFtZSxcbiAgZGVib3VuY2UsXG4gIGRlYnVnLFxuICBmb2xsb3dCdXR0b25DbGFzc05hbWUsXG4gIGluaXRpYWxTY3JvbGxCZWhhdmlvcixcbiAgbW9kZSxcbiAgbm9uY2UsXG4gIHNjcm9sbGVyLFxuICBzY3JvbGxWaWV3Q2xhc3NOYW1lXG59KSA9PiAoXG4gIDxDb21wb3NlclxuICAgIGNoZWNrSW50ZXJ2YWw9e2NoZWNrSW50ZXJ2YWx9XG4gICAgZGVib3VuY2U9e2RlYm91bmNlfVxuICAgIGRlYnVnPXtkZWJ1Z31cbiAgICBpbml0aWFsU2Nyb2xsQmVoYXZpb3I9e2luaXRpYWxTY3JvbGxCZWhhdmlvcn1cbiAgICBtb2RlPXttb2RlfVxuICAgIG5vbmNlPXtub25jZX1cbiAgICBzY3JvbGxlcj17c2Nyb2xsZXJ9XG4gID5cbiAgICA8QmFzaWNTY3JvbGxUb0JvdHRvbUNvcmVcbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgZm9sbG93QnV0dG9uQ2xhc3NOYW1lPXtmb2xsb3dCdXR0b25DbGFzc05hbWV9XG4gICAgICBzY3JvbGxWaWV3Q2xhc3NOYW1lPXtzY3JvbGxWaWV3Q2xhc3NOYW1lfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0Jhc2ljU2Nyb2xsVG9Cb3R0b21Db3JlPlxuICA8L0NvbXBvc2VyPlxuKTtcblxuQmFzaWNTY3JvbGxUb0JvdHRvbS5kZWZhdWx0UHJvcHMgPSB7XG4gIGNoZWNrSW50ZXJ2YWw6IHVuZGVmaW5lZCxcbiAgY2hpbGRyZW46IHVuZGVmaW5lZCxcbiAgY2xhc3NOYW1lOiB1bmRlZmluZWQsXG4gIGRlYm91bmNlOiB1bmRlZmluZWQsXG4gIGRlYnVnOiB1bmRlZmluZWQsXG4gIGZvbGxvd0J1dHRvbkNsYXNzTmFtZTogdW5kZWZpbmVkLFxuICBpbml0aWFsU2Nyb2xsQmVoYXZpb3I6ICdzbW9vdGgnLFxuICBtb2RlOiB1bmRlZmluZWQsXG4gIG5vbmNlOiB1bmRlZmluZWQsXG4gIHNjcm9sbGVyOiB1bmRlZmluZWQsXG4gIHNjcm9sbFZpZXdDbGFzc05hbWU6IHVuZGVmaW5lZFxufTtcblxuQmFzaWNTY3JvbGxUb0JvdHRvbS5wcm9wVHlwZXMgPSB7XG4gIGNoZWNrSW50ZXJ2YWw6IFByb3BUeXBlcy5udW1iZXIsXG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuYW55LFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGRlYm91bmNlOiBQcm9wVHlwZXMubnVtYmVyLFxuICBkZWJ1ZzogUHJvcFR5cGVzLmJvb2wsXG4gIGZvbGxvd0J1dHRvbkNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5pdGlhbFNjcm9sbEJlaGF2aW9yOiBQcm9wVHlwZXMub25lT2YoWydhdXRvJywgJ3Ntb290aCddKSxcbiAgbW9kZTogUHJvcFR5cGVzLm9uZU9mKFsnYm90dG9tJywgJ3RvcCddKSxcbiAgbm9uY2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNjcm9sbGVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgc2Nyb2xsVmlld0NsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQmFzaWNTY3JvbGxUb0JvdHRvbTtcbiJdfQ==

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

var _Object$defineProperty = __webpack_require__(294);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    _Object$defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(295);

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(149);

module.exports = parent;


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);
var DESCRIPTORS = __webpack_require__(10);
var objectDefinePropertyModile = __webpack_require__(19);

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: objectDefinePropertyModile.f
});


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

var _Array$isArray = __webpack_require__(115);

var arrayLikeToArray = __webpack_require__(142);

function _arrayWithoutHoles(arr) {
  if (_Array$isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

var _Symbol = __webpack_require__(121);

var _getIteratorMethod = __webpack_require__(133);

var _Array$from = __webpack_require__(141);

function _iterableToArray(iter) {
  if (typeof _Symbol !== "undefined" && _getIteratorMethod(iter) != null || iter["@@iterator"] != null) return _Array$from(iter);
}

module.exports = _iterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 299 */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var getOwnPropertyDescriptor = __webpack_require__(150).f;
var createNonEnumerableProperty = __webpack_require__(33);
var redefine = __webpack_require__(34);
var setGlobal = __webpack_require__(86);
var copyConstructorProperties = __webpack_require__(305);
var isForced = __webpack_require__(312);

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(8);
var classof = __webpack_require__(85);

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var inspectSource = __webpack_require__(156);

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),
/* 304 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(26);
var ownKeys = __webpack_require__(306);
var getOwnPropertyDescriptorModule = __webpack_require__(150);
var definePropertyModule = __webpack_require__(50);

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(90);
var getOwnPropertyNamesModule = __webpack_require__(308);
var getOwnPropertySymbolsModule = __webpack_require__(311);
var anObject = __webpack_require__(20);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);

module.exports = global;


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(160);
var enumBugKeys = __webpack_require__(91);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(84);
var toLength = __webpack_require__(161);
var toAbsoluteIndex = __webpack_require__(310);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(51);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),
/* 311 */
/***/ (function(module, exports) {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(8);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(8);

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
var RE = function (s, f) {
  return RegExp(s, f);
};

exports.UNSUPPORTED_Y = fails(function () {
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(20);
var defineProperties = __webpack_require__(315);
var enumBugKeys = __webpack_require__(91);
var hiddenKeys = __webpack_require__(89);
var html = __webpack_require__(317);
var documentCreateElement = __webpack_require__(155);
var sharedKey = __webpack_require__(158);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject -- old IE */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(25);
var definePropertyModule = __webpack_require__(50);
var anObject = __webpack_require__(20);
var objectKeys = __webpack_require__(316);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(160);
var enumBugKeys = __webpack_require__(91);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(90);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(8);

module.exports = fails(function () {
  // babel-minify transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
  var re = RegExp('.', (typeof '').charAt(0));
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(8);

module.exports = fails(function () {
  // babel-minify transpiles RegExp('.', 'g') -> /./g and it causes SyntaxError
  var re = RegExp('(?<a>b)', (typeof '').charAt(5));
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__(83);
var redefine = __webpack_require__(34);
var regexpExec = __webpack_require__(92);
var fails = __webpack_require__(8);
var wellKnownSymbol = __webpack_require__(52);
var createNonEnumerableProperty = __webpack_require__(33);

var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });

    redefine(String.prototype, KEY, methods[0]);
    redefine(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var userAgent = __webpack_require__(322);

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] < 4 ? 1 : match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(90);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(164);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(325).charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(51);
var requireObjectCoercible = __webpack_require__(48);

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

var toObject = __webpack_require__(153);

var floor = Math.floor;
var replace = ''.replace;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace.call(replacement, symbols, function (match, ch) {
    var capture;
    switch (ch.charAt(0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return str.slice(0, position);
      case "'": return str.slice(tailPos);
      case '<':
        capture = namedCaptures[ch.slice(1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(85);
var regexpExec = __webpack_require__(92);

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};



/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(329);

/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(165);
var path = __webpack_require__(3);

module.exports = path.setInterval;


/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(331);

/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(332);

module.exports = parent;


/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

var indexOf = __webpack_require__(333);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.indexOf;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.indexOf) ? indexOf : own;
};


/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(334);
var entryVirtual = __webpack_require__(24);

module.exports = entryVirtual('Array').indexOf;


/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $ = __webpack_require__(2);
var $indexOf = __webpack_require__(129).indexOf;
var arrayMethodIsStrict = __webpack_require__(166);

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(336);

/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(337);

module.exports = parent;


/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

var splice = __webpack_require__(338);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.splice;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.splice) ? splice : own;
};


/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(339);
var entryVirtual = __webpack_require__(24);

module.exports = entryVirtual('Array').splice;


/***/ }),
/* 339 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var toAbsoluteIndex = __webpack_require__(71);
var toInteger = __webpack_require__(40);
var toLength = __webpack_require__(22);
var toObject = __webpack_require__(16);
var arraySpeciesCreate = __webpack_require__(64);
var createProperty = __webpack_require__(31);
var arrayMethodHasSpeciesSupport = __webpack_require__(43);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(341);

module.exports = parent;


/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

var concat = __webpack_require__(342);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.concat;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.concat) ? concat : own;
};


/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(122);
var entryVirtual = __webpack_require__(24);

module.exports = entryVirtual('Array').concat;


/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(344);

module.exports = parent;


/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(345);
var path = __webpack_require__(3);

module.exports = path.Date.now;


/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);

// `Date.now` method
// https://tc39.es/ecma262/#sec-date.now
$({ target: 'Date', stat: true }, {
  now: function now() {
    return new Date().getTime();
  }
});


/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(134);
var forEach = __webpack_require__(347);
var classof = __webpack_require__(47);
var ArrayPrototype = Array.prototype;

var DOMIterables = {
  DOMTokenList: true,
  NodeList: true
};

module.exports = function (it) {
  var own = it.forEach;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.forEach)
    // eslint-disable-next-line no-prototype-builtins -- safe
    || DOMIterables.hasOwnProperty(classof(it)) ? forEach : own;
};


/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(348);

module.exports = parent;


/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(349);
var entryVirtual = __webpack_require__(24);

module.exports = entryVirtual('Array').forEach;


/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var forEach = __webpack_require__(350);

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__(76).forEach;
var arrayMethodIsStrict = __webpack_require__(166);

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;


/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(352);

/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(353);

module.exports = parent;


/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(354);
var path = __webpack_require__(3);

module.exports = path.Object.keys;


/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);
var toObject = __webpack_require__(16);
var nativeKeys = __webpack_require__(70);
var fails = __webpack_require__(6);

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(356);

/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(357);

module.exports = parent;


/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(125);
var path = __webpack_require__(3);

module.exports = path.Object.getOwnPropertySymbols;


/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(359);

/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(360);

module.exports = parent;


/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

var filter = __webpack_require__(361);

var ArrayPrototype = Array.prototype;

module.exports = function (it) {
  var own = it.filter;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.filter) ? filter : own;
};


/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(362);
var entryVirtual = __webpack_require__(24);

module.exports = entryVirtual('Array').filter;


/***/ }),
/* 362 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2);
var $filter = __webpack_require__(76).filter;
var arrayMethodHasSpeciesSupport = __webpack_require__(43);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 363 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(364);

/***/ }),
/* 364 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(365);

module.exports = parent;


/***/ }),
/* 365 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(366);
var path = __webpack_require__(3);

var Object = path.Object;

var getOwnPropertyDescriptor = module.exports = function getOwnPropertyDescriptor(it, key) {
  return Object.getOwnPropertyDescriptor(it, key);
};

if (Object.getOwnPropertyDescriptor.sham) getOwnPropertyDescriptor.sham = true;


/***/ }),
/* 366 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);
var fails = __webpack_require__(6);
var toIndexedObject = __webpack_require__(12);
var nativeGetOwnPropertyDescriptor = __webpack_require__(38).f;
var DESCRIPTORS = __webpack_require__(10);

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});


/***/ }),
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(368);

/***/ }),
/* 368 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(369);

module.exports = parent;


/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(370);
var path = __webpack_require__(3);

module.exports = path.Object.getOwnPropertyDescriptors;


/***/ }),
/* 370 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);
var DESCRIPTORS = __webpack_require__(10);
var ownKeys = __webpack_require__(371);
var toIndexedObject = __webpack_require__(12);
var getOwnPropertyDescriptorModule = __webpack_require__(38);
var createProperty = __webpack_require__(31);

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});


/***/ }),
/* 371 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(42);
var getOwnPropertyNamesModule = __webpack_require__(73);
var getOwnPropertySymbolsModule = __webpack_require__(130);
var anObject = __webpack_require__(17);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),
/* 372 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(373);

/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(374);

module.exports = parent;


/***/ }),
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(375);
var path = __webpack_require__(3);

var Object = path.Object;

var defineProperties = module.exports = function defineProperties(T, D) {
  return Object.defineProperties(T, D);
};

if (Object.defineProperties.sham) defineProperties.sham = true;


/***/ }),
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);
var DESCRIPTORS = __webpack_require__(10);
var defineProperties = __webpack_require__(127);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperties: defineProperties
});


/***/ }),
/* 376 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(377);

/***/ }),
/* 377 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(149);

module.exports = parent;


/***/ }),
/* 378 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__emotion_cache__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__emotion_serialize__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__emotion_utils__ = __webpack_require__(386);




function insertWithoutScoping(cache, serialized) {
  if (cache.inserted[serialized.name] === undefined) {
    return cache.insert('', serialized, cache.sheet, true);
  }
}

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = Object(__WEBPACK_IMPORTED_MODULE_2__emotion_utils__["a" /* getRegisteredStyles */])(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var createEmotion = function createEmotion(options) {
  var cache = Object(__WEBPACK_IMPORTED_MODULE_0__emotion_cache__["a" /* default */])(options); // $FlowFixMe

  cache.sheet.speedy = function (value) {
    if (false) {
      throw new Error('speedy must be changed before any rules are inserted');
    }

    this.isSpeedy = value;
  };

  cache.compat = true;

  var css = function css() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var serialized = Object(__WEBPACK_IMPORTED_MODULE_1__emotion_serialize__["a" /* serializeStyles */])(args, cache.registered, undefined);
    Object(__WEBPACK_IMPORTED_MODULE_2__emotion_utils__["b" /* insertStyles */])(cache, serialized, false);
    return cache.key + "-" + serialized.name;
  };

  var keyframes = function keyframes() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var serialized = Object(__WEBPACK_IMPORTED_MODULE_1__emotion_serialize__["a" /* serializeStyles */])(args, cache.registered);
    var animation = "animation-" + serialized.name;
    insertWithoutScoping(cache, {
      name: serialized.name,
      styles: "@keyframes " + animation + "{" + serialized.styles + "}"
    });
    return animation;
  };

  var injectGlobal = function injectGlobal() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var serialized = Object(__WEBPACK_IMPORTED_MODULE_1__emotion_serialize__["a" /* serializeStyles */])(args, cache.registered);
    insertWithoutScoping(cache, serialized);
  };

  var cx = function cx() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return merge(cache.registered, css, classnames(args));
  };

  return {
    css: css,
    cx: cx,
    injectGlobal: injectGlobal,
    keyframes: keyframes,
    hydrate: function hydrate(ids) {
      ids.forEach(function (key) {
        cache.inserted[key] = true;
      });
    },
    flush: function flush() {
      cache.registered = {};
      cache.inserted = {};
      cache.sheet.flush();
    },
    // $FlowFixMe
    sheet: cache.sheet,
    cache: cache,
    getRegisteredStyles: __WEBPACK_IMPORTED_MODULE_2__emotion_utils__["a" /* getRegisteredStyles */].bind(null, cache.registered),
    merge: merge.bind(null, cache.registered, css)
  };
};

var classnames = function classnames(args) {
  var cls = '';

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

/* harmony default export */ __webpack_exports__["a"] = (createEmotion);


/***/ }),
/* 379 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__emotion_sheet__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_stylis__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__emotion_weak_memoize__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__emotion_memoize__ = __webpack_require__(168);





var last = function last(arr) {
  return arr.length ? arr[arr.length - 1] : null;
};

var toRules = function toRules(parsed, points) {
  // pretend we've started with a comma
  var index = -1;
  var character = 44;

  do {
    switch (Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["o" /* token */])(character)) {
      case 0:
        // &\f
        if (character === 38 && Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["i" /* peek */])() === 12) {
          // this is not 100% correct, we don't account for literal sequences here - like for example quoted strings
          // stylis inserts \f after & to know when & where it should replace this sequence with the context selector
          // and when it should just concatenate the outer and inner selectors
          // it's very unlikely for this sequence to actually appear in a different context, so we just leverage this fact here
          points[index] = 1;
        }

        parsed[index] += Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["f" /* identifier */])(__WEBPACK_IMPORTED_MODULE_1_stylis__["j" /* position */] - 1);
        break;

      case 2:
        parsed[index] += Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["d" /* delimit */])(character);
        break;

      case 4:
        // comma
        if (character === 44) {
          // colon
          parsed[++index] = Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["i" /* peek */])() === 58 ? '&\f' : '';
          points[index] = parsed[index].length;
          break;
        }

      // fallthrough

      default:
        parsed[index] += Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["e" /* from */])(character);
    }
  } while (character = Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["h" /* next */])());

  return parsed;
};

var getRules = function getRules(value, points) {
  return Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["c" /* dealloc */])(toRules(Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["a" /* alloc */])(value), points));
}; // WeakSet would be more appropriate, but only WeakMap is supported in IE11


var fixedElements = /* #__PURE__ */new WeakMap();
var compat = function compat(element) {
  if (element.type !== 'rule' || !element.parent || // .length indicates if this rule contains pseudo or not
  !element.length) {
    return;
  }

  var value = element.value,
      parent = element.parent;
  var isImplicitRule = element.column === parent.column && element.line === parent.line;

  while (parent.type !== 'rule') {
    parent = parent.parent;
    if (!parent) return;
  } // short-circuit for the simplest case


  if (element.props.length === 1 && value.charCodeAt(0) !== 58
  /* colon */
  && !fixedElements.get(parent)) {
    return;
  } // if this is an implicitly inserted rule (the one eagerly inserted at the each new nested level)
  // then the props has already been manipulated beforehand as they that array is shared between it and its "rule parent"


  if (isImplicitRule) {
    return;
  }

  fixedElements.set(element, true);
  var points = [];
  var rules = getRules(value, points);
  var parentRules = parent.props;

  for (var i = 0, k = 0; i < rules.length; i++) {
    for (var j = 0; j < parentRules.length; j++, k++) {
      element.props[k] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
    }
  }
};
var removeLabel = function removeLabel(element) {
  if (element.type === 'decl') {
    var value = element.value;

    if ( // charcode for l
    value.charCodeAt(0) === 108 && // charcode for b
    value.charCodeAt(2) === 98) {
      // this ignores label
      element["return"] = '';
      element.value = '';
    }
  }
};
var ignoreFlag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';

var isIgnoringComment = function isIgnoringComment(element) {
  return !!element && element.type === 'comm' && element.children.indexOf(ignoreFlag) > -1;
};

var createUnsafeSelectorsAlarm = function createUnsafeSelectorsAlarm(cache) {
  return function (element, index, children) {
    if (element.type !== 'rule') return;
    var unsafePseudoClasses = element.value.match(/(:first|:nth|:nth-last)-child/g);

    if (unsafePseudoClasses && cache.compat !== true) {
      var prevElement = index > 0 ? children[index - 1] : null;

      if (prevElement && isIgnoringComment(last(prevElement.children))) {
        return;
      }

      unsafePseudoClasses.forEach(function (unsafePseudoClass) {
        console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
      });
    }
  };
};

var isImportRule = function isImportRule(element) {
  return element.type.charCodeAt(1) === 105 && element.type.charCodeAt(0) === 64;
};

var isPrependedWithRegularRules = function isPrependedWithRegularRules(index, children) {
  for (var i = index - 1; i >= 0; i--) {
    if (!isImportRule(children[i])) {
      return true;
    }
  }

  return false;
}; // use this to remove incorrect elements from further processing
// so they don't get handed to the `sheet` (or anything else)
// as that could potentially lead to additional logs which in turn could be overhelming to the user


var nullifyElement = function nullifyElement(element) {
  element.type = '';
  element.value = '';
  element["return"] = '';
  element.children = '';
  element.props = '';
};

var incorrectImportAlarm = function incorrectImportAlarm(element, index, children) {
  if (!isImportRule(element)) {
    return;
  }

  if (element.parent) {
    console.error("`@import` rules can't be nested inside other rules. Please move it to the top level and put it before regular rules. Keep in mind that they can only be used within global styles.");
    nullifyElement(element);
  } else if (isPrependedWithRegularRules(index, children)) {
    console.error("`@import` rules can't be after other rules. Please put your `@import` rules before your other rules.");
    nullifyElement(element);
  }
};

var defaultStylisPlugins = [__WEBPACK_IMPORTED_MODULE_1_stylis__["k" /* prefixer */]];

var createCache = function createCache(options) {
  var key = options.key;

  if (false) {
    throw new Error("You have to configure `key` for your cache. Please make sure it's unique (and not equal to 'css') as it's used for linking styles to your cache.\n" + "If multiple caches share the same key they might \"fight\" for each other's style elements.");
  }

  if ( key === 'css') {
    var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])"); // get SSRed styles out of the way of React's hydration
    // document.head is a safe place to move them to(though note document.head is not necessarily the last place they will be)
    // note this very very intentionally targets all style elements regardless of the key to ensure
    // that creating a cache works inside of render of a React component

    Array.prototype.forEach.call(ssrStyles, function (node) {
      // we want to only move elements which have a space in the data-emotion attribute value
      // because that indicates that it is an Emotion 11 server-side rendered style elements
      // while we will already ignore Emotion 11 client-side inserted styles because of the :not([data-s]) part in the selector
      // Emotion 10 client-side inserted styles did not have data-s (but importantly did not have a space in their data-emotion attributes)
      // so checking for the space ensures that loading Emotion 11 after Emotion 10 has inserted some styles
      // will not result in the Emotion 10 styles being destroyed
      var dataEmotionAttribute = node.getAttribute('data-emotion');

      if (dataEmotionAttribute.indexOf(' ') === -1) {
        return;
      }
      document.head.appendChild(node);
      node.setAttribute('data-s', '');
    });
  }

  var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;

  if (false) {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {}; // $FlowFixMe

  var container;
  var nodesToHydrate = [];

  {
    container = options.container || document.head;
    Array.prototype.forEach.call( // this means we will ignore elements which don't have a space in them which
    // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
    document.querySelectorAll("style[data-emotion^=\"" + key + " \"]"), function (node) {
      var attrib = node.getAttribute("data-emotion").split(' '); // $FlowFixMe

      for (var i = 1; i < attrib.length; i++) {
        inserted[attrib[i]] = true;
      }

      nodesToHydrate.push(node);
    });
  }

  var _insert;

  var omnipresentPlugins = [compat, removeLabel];

  if (false) {
    omnipresentPlugins.push(createUnsafeSelectorsAlarm({
      get compat() {
        return cache.compat;
      }

    }), incorrectImportAlarm);
  }

  {
    var currentSheet;
    var finalizingPlugins = [__WEBPACK_IMPORTED_MODULE_1_stylis__["n" /* stringify */],  false ? function (element) {
      if (!element.root) {
        if (element["return"]) {
          currentSheet.insert(element["return"]);
        } else if (element.value && element.type !== COMMENT) {
          // insert empty rule in non-production environments
          // so @emotion/jest can grab `key` from the (JS)DOM for caches without any rules inserted yet
          currentSheet.insert(element.value + "{}");
        }
      }
    } : Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["l" /* rulesheet */])(function (rule) {
      currentSheet.insert(rule);
    })];
    var serializer = Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["g" /* middleware */])(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));

    var stylis = function stylis(styles) {
      return Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["m" /* serialize */])(Object(__WEBPACK_IMPORTED_MODULE_1_stylis__["b" /* compile */])(styles), serializer);
    };

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      currentSheet = sheet;

      if (false) {
        currentSheet = {
          insert: function insert(rule) {
            sheet.insert(rule + serialized.map);
          }
        };
      }

      stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);

      if (shouldCache) {
        cache.inserted[serialized.name] = true;
      }
    };
  }

  var cache = {
    key: key,
    sheet: new __WEBPACK_IMPORTED_MODULE_0__emotion_sheet__["a" /* StyleSheet */]({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy,
      prepend: options.prepend
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  cache.sheet.hydrate(nodesToHydrate);
  return cache;
};

/* harmony default export */ __webpack_exports__["a"] = (createCache);


/***/ }),
/* 380 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StyleSheet; });
/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  tag.setAttribute('data-s', '');
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  function StyleSheet(options) {
    var _this = this;

    this._insertTag = function (tag) {
      var before;

      if (_this.tags.length === 0) {
        before = _this.prepend ? _this.container.firstChild : _this.before;
      } else {
        before = _this.tags[_this.tags.length - 1].nextSibling;
      }

      _this.container.insertBefore(tag, before);

      _this.tags.push(tag);
    };

    this.isSpeedy = options.speedy === undefined ? "production" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.prepend = options.prepend;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.hydrate = function hydrate(nodes) {
    nodes.forEach(this._insertTag);
  };

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      this._insertTag(createStyleElement(this));
    }

    var tag = this.tags[this.tags.length - 1];

    if (false) {
      var isImportRule = rule.charCodeAt(0) === 64 && rule.charCodeAt(1) === 105;

      if (isImportRule && this._alreadyInsertedOrderInsensitiveRule) {
        // this would only cause problem in speedy mode
        // but we don't want enabling speedy to affect the observable behavior
        // so we report this error at all times
        console.error("You're attempting to insert the following rule:\n" + rule + '\n\n`@import` rules must be before all other types of rules in a stylesheet but other rules have already been inserted. Please ensure that `@import` rules are before all other rules.');
      }
      this._alreadyInsertedOrderInsensitiveRule = this._alreadyInsertedOrderInsensitiveRule || !isImportRule;
    }

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length);
      } catch (e) {
        if (false) {
          console.error("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;

    if (false) {
      this._alreadyInsertedOrderInsensitiveRule = false;
    }
  };

  return StyleSheet;
}();




/***/ }),
/* 381 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export CHARSET */
/* unused harmony export COMMENT */
/* unused harmony export COUNTER_STYLE */
/* unused harmony export DECLARATION */
/* unused harmony export DOCUMENT */
/* unused harmony export FONT_FACE */
/* unused harmony export FONT_FEATURE_VALUES */
/* unused harmony export IMPORT */
/* unused harmony export KEYFRAMES */
/* unused harmony export MEDIA */
/* unused harmony export MOZ */
/* unused harmony export MS */
/* unused harmony export NAMESPACE */
/* unused harmony export PAGE */
/* unused harmony export RULESET */
/* unused harmony export SUPPORTS */
/* unused harmony export VIEWPORT */
/* unused harmony export WEBKIT */
/* unused harmony export abs */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return T; });
/* unused harmony export append */
/* unused harmony export caret */
/* unused harmony export char */
/* unused harmony export character */
/* unused harmony export characters */
/* unused harmony export charat */
/* unused harmony export column */
/* unused harmony export combine */
/* unused harmony export comment */
/* unused harmony export commenter */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ae; });
/* unused harmony export copy */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return U; });
/* unused harmony export declaration */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return V; });
/* unused harmony export delimiter */
/* unused harmony export escaping */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return d; });
/* unused harmony export hash */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return re; });
/* unused harmony export indexof */
/* unused harmony export length */
/* unused harmony export line */
/* unused harmony export match */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return oe; });
/* unused harmony export namespace */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return L; });
/* unused harmony export node */
/* unused harmony export parse */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return N; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return E; });
/* unused harmony export prefix */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return ve; });
/* unused harmony export prev */
/* unused harmony export replace */
/* unused harmony export ruleset */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return le; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return ie; });
/* unused harmony export sizeof */
/* unused harmony export slice */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return fe; });
/* unused harmony export strlen */
/* unused harmony export substr */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return R; });
/* unused harmony export tokenize */
/* unused harmony export tokenizer */
/* unused harmony export trim */
/* unused harmony export whitespace */
var e="-ms-";var r="-moz-";var a="-webkit-";var c="comm";var n="rule";var t="decl";var s="@page";var u="@media";var i="@import";var f="@charset";var o="@viewport";var l="@supports";var v="@document";var h="@namespace";var p="@keyframes";var b="@font-face";var w="@counter-style";var $="@font-feature-values";var k=Math.abs;var d=String.fromCharCode;function m(e,r){return(((r<<2^z(e,0))<<2^z(e,1))<<2^z(e,2))<<2^z(e,3)}function g(e){return e.trim()}function x(e,r){return(e=r.exec(e))?e[0]:e}function y(e,r,a){return e.replace(r,a)}function j(e,r){return e.indexOf(r)}function z(e,r){return e.charCodeAt(r)|0}function C(e,r,a){return e.slice(r,a)}function A(e){return e.length}function M(e){return e.length}function O(e,r){return r.push(e),e}function S(e,r){return e.map(r).join("")}var q=1;var B=1;var D=0;var E=0;var F=0;var G="";function H(e,r,a,c,n,t,s){return{value:e,root:r,parent:a,type:c,props:n,children:t,line:q,column:B,length:s,return:""}}function I(e,r,a){return H(e,r.root,r.parent,a,r.props,r.children,0)}function J(){return F}function K(){F=E>0?z(G,--E):0;if(B--,F===10)B=1,q--;return F}function L(){F=E<D?z(G,E++):0;if(B++,F===10)B=1,q++;return F}function N(){return z(G,E)}function P(){return E}function Q(e,r){return C(G,e,r)}function R(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function T(e){return q=B=1,D=A(G=e),E=0,[]}function U(e){return G="",e}function V(e){return g(Q(E-1,_(e===91?e+2:e===40?e+1:e)))}function W(e){return U(Y(T(e)))}function X(e){while(F=N())if(F<33)L();else break;return R(e)>2||R(F)>3?"":" "}function Y(e){while(L())switch(R(F)){case 0:O(re(E-1),e);break;case 2:O(V(F),e);break;default:O(d(F),e)}return e}function Z(e,r){while(--r&&L())if(F<48||F>102||F>57&&F<65||F>70&&F<97)break;return Q(e,P()+(r<6&&N()==32&&L()==32))}function _(e){while(L())switch(F){case e:return E;case 34:case 39:return _(e===34||e===39?e:F);case 40:if(e===41)_(e);break;case 92:L();break}return E}function ee(e,r){while(L())if(e+F===47+10)break;else if(e+F===42+42&&N()===47)break;return"/*"+Q(r,E-1)+"*"+d(e===47?e:L())}function re(e){while(!R(N()))L();return Q(e,E)}function ae(e){return U(ce("",null,null,null,[""],e=T(e),0,[0],e))}function ce(e,r,a,c,n,t,s,u,i){var f=0;var o=0;var l=s;var v=0;var h=0;var p=0;var b=1;var w=1;var $=1;var k=0;var m="";var g=n;var x=t;var j=c;var z=m;while(w)switch(p=k,k=L()){case 34:case 39:case 91:case 40:z+=V(k);break;case 9:case 10:case 13:case 32:z+=X(p);break;case 92:z+=Z(P()-1,7);continue;case 47:switch(N()){case 42:case 47:O(te(ee(L(),P()),r,a),i);break;default:z+="/"}break;case 123*b:u[f++]=A(z)*$;case 125*b:case 59:case 0:switch(k){case 0:case 125:w=0;case 59+o:if(h>0&&A(z)-l)O(h>32?se(z+";",c,a,l-1):se(y(z," ","")+";",c,a,l-2),i);break;case 59:z+=";";default:O(j=ne(z,r,a,f,o,n,u,m,g=[],x=[],l),t);if(k===123)if(o===0)ce(z,r,j,j,g,t,l,u,x);else switch(v){case 100:case 109:case 115:ce(e,j,j,c&&O(ne(e,j,j,0,0,n,u,m,n,g=[],l),x),n,x,l,u,c?g:x);break;default:ce(z,j,j,j,[""],x,l,u,x)}}f=o=h=0,b=$=1,m=z="",l=s;break;case 58:l=1+A(z),h=p;default:if(b<1)if(k==123)--b;else if(k==125&&b++==0&&K()==125)continue;switch(z+=d(k),k*b){case 38:$=o>0?1:(z+="\f",-1);break;case 44:u[f++]=(A(z)-1)*$,$=1;break;case 64:if(N()===45)z+=V(L());v=N(),o=A(m=z+=re(P())),k++;break;case 45:if(p===45&&A(z)==2)b=0}}return t}function ne(e,r,a,c,t,s,u,i,f,o,l){var v=t-1;var h=t===0?s:[""];var p=M(h);for(var b=0,w=0,$=0;b<c;++b)for(var d=0,m=C(e,v+1,v=k(w=u[b])),x=e;d<p;++d)if(x=g(w>0?h[d]+" "+m:y(m,/&\f/g,h[d])))f[$++]=x;return H(e,r,a,t===0?n:i,f,o,l)}function te(e,r,a){return H(e,r,a,c,d(J()),C(e,2,-2),0)}function se(e,r,a,c){return H(e,r,a,t,C(e,0,c),C(e,c+1,-1),c)}function ue(c,n){switch(m(c,n)){case 5103:return a+"print-"+c+c;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return a+c+c;case 5349:case 4246:case 4810:case 6968:case 2756:return a+c+r+c+e+c+c;case 6828:case 4268:return a+c+e+c+c;case 6165:return a+c+e+"flex-"+c+c;case 5187:return a+c+y(c,/(\w+).+(:[^]+)/,a+"box-$1$2"+e+"flex-$1$2")+c;case 5443:return a+c+e+"flex-item-"+y(c,/flex-|-self/,"")+c;case 4675:return a+c+e+"flex-line-pack"+y(c,/align-content|flex-|-self/,"")+c;case 5548:return a+c+e+y(c,"shrink","negative")+c;case 5292:return a+c+e+y(c,"basis","preferred-size")+c;case 6060:return a+"box-"+y(c,"-grow","")+a+c+e+y(c,"grow","positive")+c;case 4554:return a+y(c,/([^-])(transform)/g,"$1"+a+"$2")+c;case 6187:return y(y(y(c,/(zoom-|grab)/,a+"$1"),/(image-set)/,a+"$1"),c,"")+c;case 5495:case 3959:return y(c,/(image-set\([^]*)/,a+"$1"+"$`$1");case 4968:return y(y(c,/(.+:)(flex-)?(.*)/,a+"box-pack:$3"+e+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+a+c+c;case 4095:case 3583:case 4068:case 2532:return y(c,/(.+)-inline(.+)/,a+"$1$2")+c;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(A(c)-1-n>6)switch(z(c,n+1)){case 109:if(z(c,n+4)!==45)break;case 102:return y(c,/(.+:)(.+)-([^]+)/,"$1"+a+"$2-$3"+"$1"+r+(z(c,n+3)==108?"$3":"$2-$3"))+c;case 115:return~j(c,"stretch")?ue(y(c,"stretch","fill-available"),n)+c:c}break;case 4949:if(z(c,n+1)!==115)break;case 6444:switch(z(c,A(c)-3-(~j(c,"!important")&&10))){case 107:return y(c,":",":"+a)+c;case 101:return y(c,/(.+:)([^;!]+)(;|!.+)?/,"$1"+a+(z(c,14)===45?"inline-":"")+"box$3"+"$1"+a+"$2$3"+"$1"+e+"$2box$3")+c}break;case 5936:switch(z(c,n+11)){case 114:return a+c+e+y(c,/[svh]\w+-[tblr]{2}/,"tb")+c;case 108:return a+c+e+y(c,/[svh]\w+-[tblr]{2}/,"tb-rl")+c;case 45:return a+c+e+y(c,/[svh]\w+-[tblr]{2}/,"lr")+c}return a+c+e+c+c}return c}function ie(e,r){var a="";var c=M(e);for(var n=0;n<c;n++)a+=r(e[n],n,e,r)||"";return a}function fe(e,r,a,s){switch(e.type){case i:case t:return e.return=e.return||e.value;case c:return"";case n:e.value=e.props.join(",")}return A(a=ie(e.children,s))?e.return=e.value+"{"+a+"}":""}function oe(e){var r=M(e);return function(a,c,n,t){var s="";for(var u=0;u<r;u++)s+=e[u](a,c,n,t)||"";return s}}function le(e){return function(r){if(!r.root)if(r=r.return)e(r)}}function ve(c,s,u,i){if(!c.return)switch(c.type){case t:c.return=ue(c.value,c.length);break;case p:return ie([I(y(c.value,"@","@"+a),c,"")],i);case n:if(c.length)return S(c.props,(function(n){switch(x(n,/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":return ie([I(y(n,/:(read-\w+)/,":"+r+"$1"),c,"")],i);case"::placeholder":return ie([I(y(n,/:(plac\w+)/,":"+a+"input-$1"),c,""),I(y(n,/:(plac\w+)/,":"+r+"$1"),c,""),I(y(n,/:(plac\w+)/,e+"input-$1"),c,"")],i)}return""}))}}function he(e){switch(e.type){case n:e.props=e.props.map((function(r){return S(W(r),(function(r,a,c){switch(z(r,0)){case 12:return C(r,1,A(r));case 0:case 40:case 43:case 62:case 126:return r;case 58:if(c[++a]==="global")c[a]="",c[++a]="\f"+C(c[a],a=1,-1);case 32:return a===1?"":r;default:switch(a){case 0:e=r;return M(c)>1?"":r;case a=M(c)-1:case 2:return a===2?r+e+e:r+e;default:return r}}}))}))}}
//# sourceMappingURL=stylis.mjs.map


/***/ }),
/* 382 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

/* unused harmony default export */ var _unused_webpack_default_export = (weakMemoize);


/***/ }),
/* 383 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return serializeStyles; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__emotion_hash__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__emotion_unitless__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__emotion_memoize__ = __webpack_require__(168);




var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = /* #__PURE__ */Object(__WEBPACK_IMPORTED_MODULE_2__emotion_memoize__["a" /* default */])(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (__WEBPACK_IMPORTED_MODULE_1__emotion_unitless__["a" /* default */][key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if (false) {
  var contentValuePattern = /(attr|counters?|url|(((repeating-)?(linear|radial))|conic)-gradient)\(|(no-)?(open|close)-quote/;
  var contentValues = ['normal', 'none', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        throw new Error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

function handleInterpolation(mergedProps, registered, interpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if (false) {
      throw new Error('Component selectors can only be used in conjunction with @emotion/babel-plugin.');
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          if (false) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        } else if (false) {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      if (false) {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (match, p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];
  return cached !== undefined ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && "production" !== 'production') {
          throw new Error('Component selectors can only be used in conjunction with @emotion/babel-plugin.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if (false) {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var sourceMapPattern;

if (false) {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//g;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings);
  } else {
    if (false) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i]);

    if (stringMode) {
      if (false) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += strings[i];
    }
  }

  var sourceMap;

  if (false) {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = Object(__WEBPACK_IMPORTED_MODULE_0__emotion_hash__["a" /* default */])(styles) + identifierName;

  if (false) {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};




/***/ }),
/* 384 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

/* harmony default export */ __webpack_exports__["a"] = (murmur2);


/***/ }),
/* 385 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

/* harmony default export */ __webpack_exports__["a"] = (unitlessKeys);


/***/ }),
/* 386 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getRegisteredStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return insertStyles; });
var isBrowser = "object" !== 'undefined';
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className] + ";");
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false ) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      var maybeStyles = cache.insert(serialized === current ? "." + className : '', current, cache.sheet, true);

      current = current.next;
    } while (current !== undefined);
  }
};




/***/ }),
/* 387 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = useCSSKey;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es_regexp_exec_js__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es_regexp_exec_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es_regexp_exec_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es_string_replace_js__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es_string_replace_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_modules_es_string_replace_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es_date_to_string_js__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_modules_es_date_to_string_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_modules_es_date_to_string_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es_object_to_string_js__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_modules_es_object_to_string_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_modules_es_object_to_string_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es_regexp_to_string_js__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_modules_es_regexp_to_string_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_modules_es_regexp_to_string_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_math_random__ = __webpack_require__(393);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_math_random___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_math_random__);






/* eslint no-magic-numbers: "off" */

function useCSSKey() {
  return __WEBPACK_IMPORTED_MODULE_5_math_random___default()().toString(26).substr(2, 5).replace(/[0-9]/g, function (value) {
    return String.fromCharCode(value.charCodeAt(0) + 65);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jcmVhdGVDU1NLZXkuanMiXSwibmFtZXMiOlsicmFuZG9tIiwidXNlQ1NTS2V5IiwidG9TdHJpbmciLCJzdWJzdHIiLCJyZXBsYWNlIiwidmFsdWUiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjaGFyQ29kZUF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUVBLE9BQU9BLE1BQVAsTUFBbUIsYUFBbkI7QUFFQSxlQUFlLFNBQVNDLFNBQVQsR0FBcUI7QUFDbEMsU0FBT0QsTUFBTSxHQUNWRSxRQURJLENBQ0ssRUFETCxFQUVKQyxNQUZJLENBRUcsQ0FGSCxFQUVNLENBRk4sRUFHSkMsT0FISSxDQUdJLFFBSEosRUFHWSxVQUFBQyxLQUFLO0FBQUEsV0FBSUMsTUFBTSxDQUFDQyxZQUFQLENBQW9CRixLQUFLLENBQUNHLFVBQU4sQ0FBaUIsQ0FBakIsSUFBc0IsRUFBMUMsQ0FBSjtBQUFBLEdBSGpCLENBQVA7QUFJRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludCBuby1tYWdpYy1udW1iZXJzOiBcIm9mZlwiICovXG5cbmltcG9ydCByYW5kb20gZnJvbSAnbWF0aC1yYW5kb20nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VDU1NLZXkoKSB7XG4gIHJldHVybiByYW5kb20oKVxuICAgIC50b1N0cmluZygyNilcbiAgICAuc3Vic3RyKDIsIDUpXG4gICAgLnJlcGxhY2UoL1xcZC9ndSwgdmFsdWUgPT4gU3RyaW5nLmZyb21DaGFyQ29kZSh2YWx1ZS5jaGFyQ29kZUF0KDApICsgNjUpKTtcbn1cbiJdfQ==

/***/ }),
/* 388 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(34);

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var nativeDateToString = DatePrototype[TO_STRING];
var getTime = DatePrototype.getTime;

// `Date.prototype.toString` method
// https://tc39.es/ecma262/#sec-date.prototype.tostring
if (new Date(NaN) + '' != INVALID_DATE) {
  redefine(DatePrototype, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare -- NaN check
    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
  });
}


/***/ }),
/* 389 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(94);
var redefine = __webpack_require__(34);
var toString = __webpack_require__(390);

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),
/* 390 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(94);
var classof = __webpack_require__(391);

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),
/* 391 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(94);
var classofRaw = __webpack_require__(85);
var wellKnownSymbol = __webpack_require__(52);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),
/* 392 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefine = __webpack_require__(34);
var anObject = __webpack_require__(20);
var fails = __webpack_require__(8);
var flags = __webpack_require__(162);

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}


/***/ }),
/* 393 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (function (crypto) {
  if (!crypto) return Math.random

  var max = Math.pow(2, 32)
  var u32 = new Uint32Array(1)

  return function random () {
    return crypto.getRandomValues(u32)[0] / max
  }
})(__webpack_require__(394))


/***/ }),
/* 394 */
/***/ (function(module, exports) {

var global = typeof window !== 'undefined' ? window : self
module.exports = global.crypto || global.msCrypto


/***/ }),
/* 395 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = debug;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__babel_runtime_corejs3_core_js_stable_array_is_array__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__babel_runtime_corejs3_core_js_stable_array_is_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__babel_runtime_corejs3_core_js_stable_array_is_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__babel_runtime_corejs3_core_js_stable_instance_for_each__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__babel_runtime_corejs3_core_js_stable_instance_for_each___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__babel_runtime_corejs3_core_js_stable_instance_for_each__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__styleConsole__ = __webpack_require__(170);






/* eslint no-console: ["off"] */


function format(category, arg0) {
  var _context, _context2;

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context = [__WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context2 = "%c".concat(category, "%c ")).call(_context2, arg0)]).call(_context, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(Object(__WEBPACK_IMPORTED_MODULE_5__styleConsole__["a" /* default */])('green', 'white')), args);
}

function debug(category) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$force = _ref.force,
      force = _ref$force === void 0 ? false : _ref$force;

  if (!force) {
    return function () {
      return 0;
    };
  }

  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (!args.length) {
      return;
    }

    var _args = args,
        _args2 = __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray___default()(_args, 1),
        arg0 = _args2[0];

    if (typeof arg0 === 'function') {
      args = arg0();
    }

    var lines = __WEBPACK_IMPORTED_MODULE_3__babel_runtime_corejs3_core_js_stable_array_is_array___default()(args[0]) ? args : [args];
    var oneLiner = lines.length === 1;

    __WEBPACK_IMPORTED_MODULE_4__babel_runtime_corejs3_core_js_stable_instance_for_each___default()(lines).call(lines, function (line, index) {
      if (oneLiner) {
        var _console, _context3;

        (_console = console).log.apply(_console, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(format.apply(void 0, __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context3 = [category]).call(_context3, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(line)))));
      } else if (index) {
        var _console2;

        (_console2 = console).log.apply(_console2, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(__WEBPACK_IMPORTED_MODULE_3__babel_runtime_corejs3_core_js_stable_array_is_array___default()(line) ? line : [line]));
      } else {
        var _console3, _context4;

        (_console3 = console).groupCollapsed.apply(_console3, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(format.apply(void 0, __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context4 = [category]).call(_context4, __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_helpers_toConsumableArray___default()(line)))));
      }
    });

    oneLiner || console.groupEnd();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9kZWJ1Zy5qcyJdLCJuYW1lcyI6WyJzdHlsZUNvbnNvbGUiLCJmb3JtYXQiLCJjYXRlZ29yeSIsImFyZzAiLCJhcmdzIiwiZGVidWciLCJmb3JjZSIsImxlbmd0aCIsImxpbmVzIiwib25lTGluZXIiLCJsaW5lIiwiaW5kZXgiLCJjb25zb2xlIiwibG9nIiwiZ3JvdXBDb2xsYXBzZWQiLCJncm91cEVuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFQSxPQUFPQSxZQUFQLE1BQXlCLGdCQUF6Qjs7QUFFQSxTQUFTQyxNQUFULENBQWdCQyxRQUFoQixFQUEwQkMsSUFBMUIsRUFBeUM7QUFBQTs7QUFBQSxvQ0FBTkMsSUFBTTtBQUFOQSxJQUFBQSxJQUFNO0FBQUE7O0FBQ3ZDLDZGQUFhRixRQUFiLDBCQUEyQkMsSUFBM0Isc0NBQXNDSCxZQUFZLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBbEQsR0FBeUVJLElBQXpFO0FBQ0Q7O0FBRUQsZUFBZSxTQUFTQyxLQUFULENBQWVILFFBQWYsRUFBaUQ7QUFBQSxpRkFBSixFQUFJO0FBQUEsd0JBQXRCSSxLQUFzQjtBQUFBLE1BQXRCQSxLQUFzQiwyQkFBZCxLQUFjOztBQUM5RCxNQUFJLENBQUNBLEtBQUwsRUFBWTtBQUNWLFdBQU87QUFBQSxhQUFNLENBQU47QUFBQSxLQUFQO0FBQ0Q7O0FBRUQsU0FBTyxZQUFhO0FBQUEsdUNBQVRGLElBQVM7QUFBVEEsTUFBQUEsSUFBUztBQUFBOztBQUNsQixRQUFJLENBQUNBLElBQUksQ0FBQ0csTUFBVixFQUFrQjtBQUNoQjtBQUNEOztBQUVELGdCQUFlSCxJQUFmO0FBQUE7QUFBQSxRQUFPRCxJQUFQOztBQUVBLFFBQUksT0FBT0EsSUFBUCxLQUFnQixVQUFwQixFQUFnQztBQUM5QkMsTUFBQUEsSUFBSSxHQUFHRCxJQUFJLEVBQVg7QUFDRDs7QUFFRCxRQUFNSyxLQUFLLEdBQUcsZUFBY0osSUFBSSxDQUFDLENBQUQsQ0FBbEIsSUFBeUJBLElBQXpCLEdBQWdDLENBQUNBLElBQUQsQ0FBOUM7QUFDQSxRQUFNSyxRQUFRLEdBQUdELEtBQUssQ0FBQ0QsTUFBTixLQUFpQixDQUFsQzs7QUFFQSw2QkFBQUMsS0FBSyxNQUFMLENBQUFBLEtBQUssRUFBUyxVQUFDRSxJQUFELEVBQU9DLEtBQVAsRUFBaUI7QUFDN0IsVUFBSUYsUUFBSixFQUFjO0FBQUE7O0FBQ1osb0JBQUFHLE9BQU8sRUFBQ0MsR0FBUixvQ0FBZVosTUFBTSxNQUFOLDhDQUFPQyxRQUFQLHNDQUFvQlEsSUFBcEIsR0FBZjtBQUNELE9BRkQsTUFFTyxJQUFJQyxLQUFKLEVBQVc7QUFBQTs7QUFDaEIscUJBQUFDLE9BQU8sRUFBQ0MsR0FBUixxQ0FBZ0IsZUFBY0gsSUFBZCxJQUFzQkEsSUFBdEIsR0FBNkIsQ0FBQ0EsSUFBRCxDQUE3QztBQUNELE9BRk0sTUFFQTtBQUFBOztBQUNMLHFCQUFBRSxPQUFPLEVBQUNFLGNBQVIscUNBQTBCYixNQUFNLE1BQU4sOENBQU9DLFFBQVAsc0NBQW9CUSxJQUFwQixHQUExQjtBQUNEO0FBQ0YsS0FSSSxDQUFMOztBQVVBRCxJQUFBQSxRQUFRLElBQUlHLE9BQU8sQ0FBQ0csUUFBUixFQUFaO0FBQ0QsR0F6QkQ7QUEwQkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgbm8tY29uc29sZTogW1wib2ZmXCJdICovXG5cbmltcG9ydCBzdHlsZUNvbnNvbGUgZnJvbSAnLi9zdHlsZUNvbnNvbGUnO1xuXG5mdW5jdGlvbiBmb3JtYXQoY2F0ZWdvcnksIGFyZzAsIC4uLmFyZ3MpIHtcbiAgcmV0dXJuIFtgJWMke2NhdGVnb3J5fSVjICR7YXJnMH1gLCAuLi5zdHlsZUNvbnNvbGUoJ2dyZWVuJywgJ3doaXRlJyksIC4uLmFyZ3NdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWJ1ZyhjYXRlZ29yeSwgeyBmb3JjZSA9IGZhbHNlIH0gPSB7fSkge1xuICBpZiAoIWZvcmNlKSB7XG4gICAgcmV0dXJuICgpID0+IDA7XG4gIH1cblxuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICBpZiAoIWFyZ3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgW2FyZzBdID0gYXJncztcblxuICAgIGlmICh0eXBlb2YgYXJnMCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXJncyA9IGFyZzAoKTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lcyA9IEFycmF5LmlzQXJyYXkoYXJnc1swXSkgPyBhcmdzIDogW2FyZ3NdO1xuICAgIGNvbnN0IG9uZUxpbmVyID0gbGluZXMubGVuZ3RoID09PSAxO1xuXG4gICAgbGluZXMuZm9yRWFjaCgobGluZSwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChvbmVMaW5lcikge1xuICAgICAgICBjb25zb2xlLmxvZyguLi5mb3JtYXQoY2F0ZWdvcnksIC4uLmxpbmUpKTtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXgpIHtcbiAgICAgICAgY29uc29sZS5sb2coLi4uKEFycmF5LmlzQXJyYXkobGluZSkgPyBsaW5lIDogW2xpbmVdKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKC4uLmZvcm1hdChjYXRlZ29yeSwgLi4ubGluZSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgb25lTGluZXIgfHwgY29uc29sZS5ncm91cEVuZCgpO1xuICB9O1xufVxuIl19

/***/ }),
/* 396 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(116);

module.exports = parent;


/***/ }),
/* 397 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_core_js_stable_date_now__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_core_js_stable_date_now___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_core_js_stable_date_now__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es_function_name_js__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_modules_es_function_name_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_modules_es_function_name_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__debounce__ = __webpack_require__(398);





var EventSpy = function EventSpy(_ref) {
  var debounce = _ref.debounce,
      name = _ref.name,
      onEvent = _ref.onEvent,
      target = _ref.target;
  // We need to save the "onEvent" to ref.
  // This is because "onEvent" may change from time to time, but debounce may still fire to the older callback.
  var onEventRef = Object(__WEBPACK_IMPORTED_MODULE_2_react__["useRef"])();
  onEventRef.current = onEvent;
  var debouncer = Object(__WEBPACK_IMPORTED_MODULE_2_react__["useMemo"])(function () {
    return Object(__WEBPACK_IMPORTED_MODULE_3__debounce__["a" /* default */])(function (event) {
      var current = onEventRef.current;
      current && current(event);
    }, debounce);
  }, [debounce, onEventRef]);
  var handleEvent = Object(__WEBPACK_IMPORTED_MODULE_2_react__["useCallback"])(function (event) {
    event.timeStampLow = __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_core_js_stable_date_now___default()();
    debouncer(event);
  }, [debouncer]);
  Object(__WEBPACK_IMPORTED_MODULE_2_react__["useLayoutEffect"])(function () {
    target.addEventListener(name, handleEvent, {
      passive: true
    });
    handleEvent({
      target: target,
      type: name
    });
    return function () {
      return target.removeEventListener(name, handleEvent);
    };
  }, [name, handleEvent, target]);
  return false;
};

EventSpy.defaultProps = {
  debounce: 200
};
/* harmony default export */ __webpack_exports__["a"] = (EventSpy);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9FdmVudFNweS5qcyJdLCJuYW1lcyI6WyJ1c2VDYWxsYmFjayIsInVzZUxheW91dEVmZmVjdCIsInVzZU1lbW8iLCJ1c2VSZWYiLCJkZWJvdW5jZUZuIiwiRXZlbnRTcHkiLCJkZWJvdW5jZSIsIm5hbWUiLCJvbkV2ZW50IiwidGFyZ2V0Iiwib25FdmVudFJlZiIsImN1cnJlbnQiLCJkZWJvdW5jZXIiLCJldmVudCIsImhhbmRsZUV2ZW50IiwidGltZVN0YW1wTG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInBhc3NpdmUiLCJ0eXBlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxXQUFULEVBQXNCQyxlQUF0QixFQUF1Q0MsT0FBdkMsRUFBZ0RDLE1BQWhELFFBQThELE9BQTlEO0FBRUEsT0FBT0MsVUFBUCxNQUF1QixZQUF2Qjs7QUFFQSxJQUFNQyxRQUFRLEdBQUcsU0FBWEEsUUFBVyxPQUF5QztBQUFBLE1BQXRDQyxRQUFzQyxRQUF0Q0EsUUFBc0M7QUFBQSxNQUE1QkMsSUFBNEIsUUFBNUJBLElBQTRCO0FBQUEsTUFBdEJDLE9BQXNCLFFBQXRCQSxPQUFzQjtBQUFBLE1BQWJDLE1BQWEsUUFBYkEsTUFBYTtBQUN4RDtBQUNBO0FBQ0EsTUFBTUMsVUFBVSxHQUFHUCxNQUFNLEVBQXpCO0FBRUFPLEVBQUFBLFVBQVUsQ0FBQ0MsT0FBWCxHQUFxQkgsT0FBckI7QUFFQSxNQUFNSSxTQUFTLEdBQUdWLE9BQU8sQ0FDdkI7QUFBQSxXQUNFRSxVQUFVLENBQUMsVUFBQVMsS0FBSyxFQUFJO0FBQ2xCLFVBQVFGLE9BQVIsR0FBb0JELFVBQXBCLENBQVFDLE9BQVI7QUFFQUEsTUFBQUEsT0FBTyxJQUFJQSxPQUFPLENBQUNFLEtBQUQsQ0FBbEI7QUFDRCxLQUpTLEVBSVBQLFFBSk8sQ0FEWjtBQUFBLEdBRHVCLEVBT3ZCLENBQUNBLFFBQUQsRUFBV0ksVUFBWCxDQVB1QixDQUF6QjtBQVVBLE1BQU1JLFdBQVcsR0FBR2QsV0FBVyxDQUM3QixVQUFBYSxLQUFLLEVBQUk7QUFDUEEsSUFBQUEsS0FBSyxDQUFDRSxZQUFOLEdBQXFCLFdBQXJCO0FBRUFILElBQUFBLFNBQVMsQ0FBQ0MsS0FBRCxDQUFUO0FBQ0QsR0FMNEIsRUFNN0IsQ0FBQ0QsU0FBRCxDQU42QixDQUEvQjtBQVNBWCxFQUFBQSxlQUFlLENBQUMsWUFBTTtBQUNwQlEsSUFBQUEsTUFBTSxDQUFDTyxnQkFBUCxDQUF3QlQsSUFBeEIsRUFBOEJPLFdBQTlCLEVBQTJDO0FBQUVHLE1BQUFBLE9BQU8sRUFBRTtBQUFYLEtBQTNDO0FBQ0FILElBQUFBLFdBQVcsQ0FBQztBQUFFTCxNQUFBQSxNQUFNLEVBQU5BLE1BQUY7QUFBVVMsTUFBQUEsSUFBSSxFQUFFWDtBQUFoQixLQUFELENBQVg7QUFFQSxXQUFPO0FBQUEsYUFBTUUsTUFBTSxDQUFDVSxtQkFBUCxDQUEyQlosSUFBM0IsRUFBaUNPLFdBQWpDLENBQU47QUFBQSxLQUFQO0FBQ0QsR0FMYyxFQUtaLENBQUNQLElBQUQsRUFBT08sV0FBUCxFQUFvQkwsTUFBcEIsQ0FMWSxDQUFmO0FBT0EsU0FBTyxLQUFQO0FBQ0QsQ0FsQ0Q7O0FBb0NBSixRQUFRLENBQUNlLFlBQVQsR0FBd0I7QUFDdEJkLEVBQUFBLFFBQVEsRUFBRTtBQURZLENBQXhCO0FBSUEsZUFBZUQsUUFBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VMYXlvdXRFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IGRlYm91bmNlRm4gZnJvbSAnLi9kZWJvdW5jZSc7XG5cbmNvbnN0IEV2ZW50U3B5ID0gKHsgZGVib3VuY2UsIG5hbWUsIG9uRXZlbnQsIHRhcmdldCB9KSA9PiB7XG4gIC8vIFdlIG5lZWQgdG8gc2F2ZSB0aGUgXCJvbkV2ZW50XCIgdG8gcmVmLlxuICAvLyBUaGlzIGlzIGJlY2F1c2UgXCJvbkV2ZW50XCIgbWF5IGNoYW5nZSBmcm9tIHRpbWUgdG8gdGltZSwgYnV0IGRlYm91bmNlIG1heSBzdGlsbCBmaXJlIHRvIHRoZSBvbGRlciBjYWxsYmFjay5cbiAgY29uc3Qgb25FdmVudFJlZiA9IHVzZVJlZigpO1xuXG4gIG9uRXZlbnRSZWYuY3VycmVudCA9IG9uRXZlbnQ7XG5cbiAgY29uc3QgZGVib3VuY2VyID0gdXNlTWVtbyhcbiAgICAoKSA9PlxuICAgICAgZGVib3VuY2VGbihldmVudCA9PiB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudCB9ID0gb25FdmVudFJlZjtcblxuICAgICAgICBjdXJyZW50ICYmIGN1cnJlbnQoZXZlbnQpO1xuICAgICAgfSwgZGVib3VuY2UpLFxuICAgIFtkZWJvdW5jZSwgb25FdmVudFJlZl1cbiAgKTtcblxuICBjb25zdCBoYW5kbGVFdmVudCA9IHVzZUNhbGxiYWNrKFxuICAgIGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LnRpbWVTdGFtcExvdyA9IERhdGUubm93KCk7XG5cbiAgICAgIGRlYm91bmNlcihldmVudCk7XG4gICAgfSxcbiAgICBbZGVib3VuY2VyXVxuICApO1xuXG4gIHVzZUxheW91dEVmZmVjdCgoKSA9PiB7XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgaGFuZGxlRXZlbnQsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICBoYW5kbGVFdmVudCh7IHRhcmdldCwgdHlwZTogbmFtZSB9KTtcblxuICAgIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBoYW5kbGVFdmVudCk7XG4gIH0sIFtuYW1lLCBoYW5kbGVFdmVudCwgdGFyZ2V0XSk7XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuRXZlbnRTcHkuZGVmYXVsdFByb3BzID0ge1xuICBkZWJvdW5jZTogMjAwXG59O1xuXG5leHBvcnQgZGVmYXVsdCBFdmVudFNweTtcbiJdfQ==

/***/ }),
/* 398 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_core_js_stable_date_now__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_core_js_stable_date_now___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_core_js_stable_date_now__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_set_timeout__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_set_timeout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_set_timeout__);


/* harmony default export */ __webpack_exports__["a"] = (function (fn, ms) {
  if (!ms) {
    return fn;
  }

  var last = 0;
  var timeout = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var now = __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_core_js_stable_date_now___default()();

    if (now - last > ms) {
      fn.apply(void 0, args);
      last = now;
    } else {
      clearTimeout(timeout);
      timeout = __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_set_timeout___default()(function () {
        fn.apply(void 0, args);
        last = __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_core_js_stable_date_now___default()();
      }, Math.max(0, ms - now + last));
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZWJvdW5jZS5qcyJdLCJuYW1lcyI6WyJmbiIsIm1zIiwibGFzdCIsInRpbWVvdXQiLCJhcmdzIiwibm93IiwiY2xlYXJUaW1lb3V0IiwiTWF0aCIsIm1heCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxlQUFlLFVBQVVBLEVBQVYsRUFBY0MsRUFBZCxFQUFrQjtBQUMvQixNQUFJLENBQUNBLEVBQUwsRUFBUztBQUNQLFdBQU9ELEVBQVA7QUFDRDs7QUFFRCxNQUFJRSxJQUFJLEdBQUcsQ0FBWDtBQUNBLE1BQUlDLE9BQU8sR0FBRyxJQUFkO0FBRUEsU0FBTyxZQUFhO0FBQUEsc0NBQVRDLElBQVM7QUFBVEEsTUFBQUEsSUFBUztBQUFBOztBQUNsQixRQUFNQyxHQUFHLEdBQUcsV0FBWjs7QUFFQSxRQUFJQSxHQUFHLEdBQUdILElBQU4sR0FBYUQsRUFBakIsRUFBcUI7QUFDbkJELE1BQUFBLEVBQUUsTUFBRixTQUFNSSxJQUFOO0FBQ0FGLE1BQUFBLElBQUksR0FBR0csR0FBUDtBQUNELEtBSEQsTUFHTztBQUNMQyxNQUFBQSxZQUFZLENBQUNILE9BQUQsQ0FBWjtBQUVBQSxNQUFBQSxPQUFPLEdBQUcsWUFBVyxZQUFNO0FBQ3pCSCxRQUFBQSxFQUFFLE1BQUYsU0FBTUksSUFBTjtBQUNBRixRQUFBQSxJQUFJLEdBQUcsV0FBUDtBQUNELE9BSFMsRUFHUEssSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZUCxFQUFFLEdBQUdJLEdBQUwsR0FBV0gsSUFBdkIsQ0FITyxDQUFWO0FBSUQ7QUFDRixHQWREO0FBZUQiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZm4sIG1zKSB7XG4gIGlmICghbXMpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICBsZXQgbGFzdCA9IDA7XG4gIGxldCB0aW1lb3V0ID0gbnVsbDtcblxuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuXG4gICAgaWYgKG5vdyAtIGxhc3QgPiBtcykge1xuICAgICAgZm4oLi4uYXJncyk7XG4gICAgICBsYXN0ID0gbm93O1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZm4oLi4uYXJncyk7XG4gICAgICAgIGxhc3QgPSBEYXRlLm5vdygpO1xuICAgICAgfSwgTWF0aC5tYXgoMCwgbXMgLSBub3cgKyBsYXN0KSk7XG4gICAgfVxuICB9O1xufVxuIl19

/***/ }),
/* 399 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(400);

/***/ }),
/* 400 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(165);
var path = __webpack_require__(3);

module.exports = path.setTimeout;


/***/ }),
/* 401 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es_function_name_js__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_modules_es_function_name_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_modules_es_function_name_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_math_sign__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_math_sign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_math_sign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_date_now__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_date_now___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_date_now__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);




/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 1.5, 5] }] */



function squareStepper(current, to) {
  var sign = __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_math_sign___default()(to - current);

  var step = Math.sqrt(Math.abs(to - current));
  var next = current + step * sign;

  if (sign > 0) {
    return Math.min(to, next);
  }

  return Math.max(to, next);
}

function step(from, to, stepper, index) {
  var next = from;

  for (var i = 0; i < index; i++) {
    next = stepper(next, to);
  }

  return next;
}

var SpineTo = function SpineTo(_ref) {
  var name = _ref.name,
      onEnd = _ref.onEnd,
      target = _ref.target,
      value = _ref.value;
  var animator = Object(__WEBPACK_IMPORTED_MODULE_4_react__["useRef"])();
  var animate = Object(__WEBPACK_IMPORTED_MODULE_4_react__["useCallback"])(function (name, from, to, index) {
    var start = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_date_now___default()();

    if (to === '100%' || typeof to === 'number') {
      cancelAnimationFrame(animator.current);
      animator.current = requestAnimationFrame(function () {
        if (target) {
          var toNumber = to === '100%' ? target.scrollHeight - target.offsetHeight : to;
          var nextValue = step(from, toNumber, squareStepper, (__WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_date_now___default()() - start) / 5);

          if (Math.abs(toNumber - nextValue) < 1.5) {
            nextValue = toNumber;
          }

          target[name] = nextValue;

          if (toNumber === nextValue) {
            onEnd && onEnd(true);
          } else {
            animate(name, from, to, index + 1, start);
          }
        }
      });
    }
  }, [animator, onEnd, target]);
  var handleCancelAnimation = Object(__WEBPACK_IMPORTED_MODULE_4_react__["useCallback"])(function () {
    cancelAnimationFrame(animator.current);
    onEnd && onEnd(false);
  }, [onEnd]);
  Object(__WEBPACK_IMPORTED_MODULE_4_react__["useLayoutEffect"])(function () {
    animate(name, target[name], value, 1);

    if (target) {
      target.addEventListener('pointerdown', handleCancelAnimation, {
        passive: true
      });
      target.addEventListener('wheel', handleCancelAnimation, {
        passive: true
      });
      return function () {
        target.removeEventListener('pointerdown', handleCancelAnimation);
        target.removeEventListener('wheel', handleCancelAnimation);
        cancelAnimationFrame(animator.current);
      };
    }

    return function () {
      return cancelAnimationFrame(animator.current);
    };
  }, [animate, animator, handleCancelAnimation, name, target, value]);
  return false;
};

SpineTo.propTypes = {
  name: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.string.isRequired,
  onEnd: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.func,
  target: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.any.isRequired,
  value: __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.number, __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.oneOf(['100%'])]).isRequired
};
/* harmony default export */ __webpack_exports__["a"] = (SpineTo);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TcGluZVRvLmpzIl0sIm5hbWVzIjpbIlByb3BUeXBlcyIsInVzZUNhbGxiYWNrIiwidXNlTGF5b3V0RWZmZWN0IiwidXNlUmVmIiwic3F1YXJlU3RlcHBlciIsImN1cnJlbnQiLCJ0byIsInNpZ24iLCJzdGVwIiwiTWF0aCIsInNxcnQiLCJhYnMiLCJuZXh0IiwibWluIiwibWF4IiwiZnJvbSIsInN0ZXBwZXIiLCJpbmRleCIsImkiLCJTcGluZVRvIiwibmFtZSIsIm9uRW5kIiwidGFyZ2V0IiwidmFsdWUiLCJhbmltYXRvciIsImFuaW1hdGUiLCJzdGFydCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwidG9OdW1iZXIiLCJzY3JvbGxIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJuZXh0VmFsdWUiLCJoYW5kbGVDYW5jZWxBbmltYXRpb24iLCJhZGRFdmVudExpc3RlbmVyIiwicGFzc2l2ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiZnVuYyIsImFueSIsIm9uZU9mVHlwZSIsIm51bWJlciIsIm9uZU9mIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFFQSxPQUFPQSxTQUFQLE1BQXNCLFlBQXRCO0FBQ0EsU0FBU0MsV0FBVCxFQUFzQkMsZUFBdEIsRUFBdUNDLE1BQXZDLFFBQXFELE9BQXJEOztBQUVBLFNBQVNDLGFBQVQsQ0FBdUJDLE9BQXZCLEVBQWdDQyxFQUFoQyxFQUFvQztBQUNsQyxNQUFNQyxJQUFJLEdBQUcsV0FBVUQsRUFBRSxHQUFHRCxPQUFmLENBQWI7O0FBQ0EsTUFBTUcsSUFBSSxHQUFHQyxJQUFJLENBQUNDLElBQUwsQ0FBVUQsSUFBSSxDQUFDRSxHQUFMLENBQVNMLEVBQUUsR0FBR0QsT0FBZCxDQUFWLENBQWI7QUFDQSxNQUFNTyxJQUFJLEdBQUdQLE9BQU8sR0FBR0csSUFBSSxHQUFHRCxJQUE5Qjs7QUFFQSxNQUFJQSxJQUFJLEdBQUcsQ0FBWCxFQUFjO0FBQ1osV0FBT0UsSUFBSSxDQUFDSSxHQUFMLENBQVNQLEVBQVQsRUFBYU0sSUFBYixDQUFQO0FBQ0Q7O0FBRUQsU0FBT0gsSUFBSSxDQUFDSyxHQUFMLENBQVNSLEVBQVQsRUFBYU0sSUFBYixDQUFQO0FBQ0Q7O0FBRUQsU0FBU0osSUFBVCxDQUFjTyxJQUFkLEVBQW9CVCxFQUFwQixFQUF3QlUsT0FBeEIsRUFBaUNDLEtBQWpDLEVBQXdDO0FBQ3RDLE1BQUlMLElBQUksR0FBR0csSUFBWDs7QUFFQSxPQUFLLElBQUlHLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELEtBQXBCLEVBQTJCQyxDQUFDLEVBQTVCLEVBQWdDO0FBQzlCTixJQUFBQSxJQUFJLEdBQUdJLE9BQU8sQ0FBQ0osSUFBRCxFQUFPTixFQUFQLENBQWQ7QUFDRDs7QUFFRCxTQUFPTSxJQUFQO0FBQ0Q7O0FBRUQsSUFBTU8sT0FBTyxHQUFHLFNBQVZBLE9BQVUsT0FBb0M7QUFBQSxNQUFqQ0MsSUFBaUMsUUFBakNBLElBQWlDO0FBQUEsTUFBM0JDLEtBQTJCLFFBQTNCQSxLQUEyQjtBQUFBLE1BQXBCQyxNQUFvQixRQUFwQkEsTUFBb0I7QUFBQSxNQUFaQyxLQUFZLFFBQVpBLEtBQVk7QUFDbEQsTUFBTUMsUUFBUSxHQUFHckIsTUFBTSxFQUF2QjtBQUVBLE1BQU1zQixPQUFPLEdBQUd4QixXQUFXLENBQ3pCLFVBQUNtQixJQUFELEVBQU9MLElBQVAsRUFBYVQsRUFBYixFQUFpQlcsS0FBakIsRUFBK0M7QUFBQSxRQUF2QlMsS0FBdUIsdUVBQWYsV0FBZTs7QUFDN0MsUUFBSXBCLEVBQUUsS0FBSyxNQUFQLElBQWlCLE9BQU9BLEVBQVAsS0FBYyxRQUFuQyxFQUE2QztBQUMzQ3FCLE1BQUFBLG9CQUFvQixDQUFDSCxRQUFRLENBQUNuQixPQUFWLENBQXBCO0FBRUFtQixNQUFBQSxRQUFRLENBQUNuQixPQUFULEdBQW1CdUIscUJBQXFCLENBQUMsWUFBTTtBQUM3QyxZQUFJTixNQUFKLEVBQVk7QUFDVixjQUFNTyxRQUFRLEdBQUd2QixFQUFFLEtBQUssTUFBUCxHQUFnQmdCLE1BQU0sQ0FBQ1EsWUFBUCxHQUFzQlIsTUFBTSxDQUFDUyxZQUE3QyxHQUE0RHpCLEVBQTdFO0FBQ0EsY0FBSTBCLFNBQVMsR0FBR3hCLElBQUksQ0FBQ08sSUFBRCxFQUFPYyxRQUFQLEVBQWlCekIsYUFBakIsRUFBZ0MsQ0FBQyxjQUFhc0IsS0FBZCxJQUF1QixDQUF2RCxDQUFwQjs7QUFFQSxjQUFJakIsSUFBSSxDQUFDRSxHQUFMLENBQVNrQixRQUFRLEdBQUdHLFNBQXBCLElBQWlDLEdBQXJDLEVBQTBDO0FBQ3hDQSxZQUFBQSxTQUFTLEdBQUdILFFBQVo7QUFDRDs7QUFFRFAsVUFBQUEsTUFBTSxDQUFDRixJQUFELENBQU4sR0FBZVksU0FBZjs7QUFFQSxjQUFJSCxRQUFRLEtBQUtHLFNBQWpCLEVBQTRCO0FBQzFCWCxZQUFBQSxLQUFLLElBQUlBLEtBQUssQ0FBQyxJQUFELENBQWQ7QUFDRCxXQUZELE1BRU87QUFDTEksWUFBQUEsT0FBTyxDQUFDTCxJQUFELEVBQU9MLElBQVAsRUFBYVQsRUFBYixFQUFpQlcsS0FBSyxHQUFHLENBQXpCLEVBQTRCUyxLQUE1QixDQUFQO0FBQ0Q7QUFDRjtBQUNGLE9BakJ1QyxDQUF4QztBQWtCRDtBQUNGLEdBeEJ3QixFQXlCekIsQ0FBQ0YsUUFBRCxFQUFXSCxLQUFYLEVBQWtCQyxNQUFsQixDQXpCeUIsQ0FBM0I7QUE0QkEsTUFBTVcscUJBQXFCLEdBQUdoQyxXQUFXLENBQUMsWUFBTTtBQUM5QzBCLElBQUFBLG9CQUFvQixDQUFDSCxRQUFRLENBQUNuQixPQUFWLENBQXBCO0FBQ0FnQixJQUFBQSxLQUFLLElBQUlBLEtBQUssQ0FBQyxLQUFELENBQWQ7QUFDRCxHQUh3QyxFQUd0QyxDQUFDQSxLQUFELENBSHNDLENBQXpDO0FBS0FuQixFQUFBQSxlQUFlLENBQUMsWUFBTTtBQUNwQnVCLElBQUFBLE9BQU8sQ0FBQ0wsSUFBRCxFQUFPRSxNQUFNLENBQUNGLElBQUQsQ0FBYixFQUFxQkcsS0FBckIsRUFBNEIsQ0FBNUIsQ0FBUDs7QUFFQSxRQUFJRCxNQUFKLEVBQVk7QUFDVkEsTUFBQUEsTUFBTSxDQUFDWSxnQkFBUCxDQUF3QixhQUF4QixFQUF1Q0QscUJBQXZDLEVBQThEO0FBQUVFLFFBQUFBLE9BQU8sRUFBRTtBQUFYLE9BQTlEO0FBQ0FiLE1BQUFBLE1BQU0sQ0FBQ1ksZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUNELHFCQUFqQyxFQUF3RDtBQUFFRSxRQUFBQSxPQUFPLEVBQUU7QUFBWCxPQUF4RDtBQUVBLGFBQU8sWUFBTTtBQUNYYixRQUFBQSxNQUFNLENBQUNjLG1CQUFQLENBQTJCLGFBQTNCLEVBQTBDSCxxQkFBMUM7QUFDQVgsUUFBQUEsTUFBTSxDQUFDYyxtQkFBUCxDQUEyQixPQUEzQixFQUFvQ0gscUJBQXBDO0FBQ0FOLFFBQUFBLG9CQUFvQixDQUFDSCxRQUFRLENBQUNuQixPQUFWLENBQXBCO0FBQ0QsT0FKRDtBQUtEOztBQUVELFdBQU87QUFBQSxhQUFNc0Isb0JBQW9CLENBQUNILFFBQVEsQ0FBQ25CLE9BQVYsQ0FBMUI7QUFBQSxLQUFQO0FBQ0QsR0FmYyxFQWVaLENBQUNvQixPQUFELEVBQVVELFFBQVYsRUFBb0JTLHFCQUFwQixFQUEyQ2IsSUFBM0MsRUFBaURFLE1BQWpELEVBQXlEQyxLQUF6RCxDQWZZLENBQWY7QUFpQkEsU0FBTyxLQUFQO0FBQ0QsQ0F0REQ7O0FBd0RBSixPQUFPLENBQUNrQixTQUFSLEdBQW9CO0FBQ2xCakIsRUFBQUEsSUFBSSxFQUFFcEIsU0FBUyxDQUFDc0MsTUFBVixDQUFpQkMsVUFETDtBQUVsQmxCLEVBQUFBLEtBQUssRUFBRXJCLFNBQVMsQ0FBQ3dDLElBRkM7QUFHbEJsQixFQUFBQSxNQUFNLEVBQUV0QixTQUFTLENBQUN5QyxHQUFWLENBQWNGLFVBSEo7QUFJbEJoQixFQUFBQSxLQUFLLEVBQUV2QixTQUFTLENBQUMwQyxTQUFWLENBQW9CLENBQUMxQyxTQUFTLENBQUMyQyxNQUFYLEVBQW1CM0MsU0FBUyxDQUFDNEMsS0FBVixDQUFnQixDQUFDLE1BQUQsQ0FBaEIsQ0FBbkIsQ0FBcEIsRUFBbUVMO0FBSnhELENBQXBCO0FBT0EsZUFBZXBCLE9BQWYiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgbm8tbWFnaWMtbnVtYmVyczogW1wiZXJyb3JcIiwgeyBcImlnbm9yZVwiOiBbMCwgMSwgMS41LCA1XSB9XSAqL1xuXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUxheW91dEVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuXG5mdW5jdGlvbiBzcXVhcmVTdGVwcGVyKGN1cnJlbnQsIHRvKSB7XG4gIGNvbnN0IHNpZ24gPSBNYXRoLnNpZ24odG8gLSBjdXJyZW50KTtcbiAgY29uc3Qgc3RlcCA9IE1hdGguc3FydChNYXRoLmFicyh0byAtIGN1cnJlbnQpKTtcbiAgY29uc3QgbmV4dCA9IGN1cnJlbnQgKyBzdGVwICogc2lnbjtcblxuICBpZiAoc2lnbiA+IDApIHtcbiAgICByZXR1cm4gTWF0aC5taW4odG8sIG5leHQpO1xuICB9XG5cbiAgcmV0dXJuIE1hdGgubWF4KHRvLCBuZXh0KTtcbn1cblxuZnVuY3Rpb24gc3RlcChmcm9tLCB0bywgc3RlcHBlciwgaW5kZXgpIHtcbiAgbGV0IG5leHQgPSBmcm9tO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZXg7IGkrKykge1xuICAgIG5leHQgPSBzdGVwcGVyKG5leHQsIHRvKTtcbiAgfVxuXG4gIHJldHVybiBuZXh0O1xufVxuXG5jb25zdCBTcGluZVRvID0gKHsgbmFtZSwgb25FbmQsIHRhcmdldCwgdmFsdWUgfSkgPT4ge1xuICBjb25zdCBhbmltYXRvciA9IHVzZVJlZigpO1xuXG4gIGNvbnN0IGFuaW1hdGUgPSB1c2VDYWxsYmFjayhcbiAgICAobmFtZSwgZnJvbSwgdG8sIGluZGV4LCBzdGFydCA9IERhdGUubm93KCkpID0+IHtcbiAgICAgIGlmICh0byA9PT0gJzEwMCUnIHx8IHR5cGVvZiB0byA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0b3IuY3VycmVudCk7XG5cbiAgICAgICAgYW5pbWF0b3IuY3VycmVudCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgY29uc3QgdG9OdW1iZXIgPSB0byA9PT0gJzEwMCUnID8gdGFyZ2V0LnNjcm9sbEhlaWdodCAtIHRhcmdldC5vZmZzZXRIZWlnaHQgOiB0bztcbiAgICAgICAgICAgIGxldCBuZXh0VmFsdWUgPSBzdGVwKGZyb20sIHRvTnVtYmVyLCBzcXVhcmVTdGVwcGVyLCAoRGF0ZS5ub3coKSAtIHN0YXJ0KSAvIDUpO1xuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModG9OdW1iZXIgLSBuZXh0VmFsdWUpIDwgMS41KSB7XG4gICAgICAgICAgICAgIG5leHRWYWx1ZSA9IHRvTnVtYmVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBuZXh0VmFsdWU7XG5cbiAgICAgICAgICAgIGlmICh0b051bWJlciA9PT0gbmV4dFZhbHVlKSB7XG4gICAgICAgICAgICAgIG9uRW5kICYmIG9uRW5kKHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYW5pbWF0ZShuYW1lLCBmcm9tLCB0bywgaW5kZXggKyAxLCBzdGFydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFthbmltYXRvciwgb25FbmQsIHRhcmdldF1cbiAgKTtcblxuICBjb25zdCBoYW5kbGVDYW5jZWxBbmltYXRpb24gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0b3IuY3VycmVudCk7XG4gICAgb25FbmQgJiYgb25FbmQoZmFsc2UpO1xuICB9LCBbb25FbmRdKTtcblxuICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4ge1xuICAgIGFuaW1hdGUobmFtZSwgdGFyZ2V0W25hbWVdLCB2YWx1ZSwgMSk7XG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBoYW5kbGVDYW5jZWxBbmltYXRpb24sIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIGhhbmRsZUNhbmNlbEFuaW1hdGlvbiwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBoYW5kbGVDYW5jZWxBbmltYXRpb24pO1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBoYW5kbGVDYW5jZWxBbmltYXRpb24pO1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRvci5jdXJyZW50KTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuICgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdG9yLmN1cnJlbnQpO1xuICB9LCBbYW5pbWF0ZSwgYW5pbWF0b3IsIGhhbmRsZUNhbmNlbEFuaW1hdGlvbiwgbmFtZSwgdGFyZ2V0LCB2YWx1ZV0pO1xuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cblNwaW5lVG8ucHJvcFR5cGVzID0ge1xuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9uRW5kOiBQcm9wVHlwZXMuZnVuYyxcbiAgdGFyZ2V0OiBQcm9wVHlwZXMuYW55LmlzUmVxdWlyZWQsXG4gIHZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMubnVtYmVyLCBQcm9wVHlwZXMub25lT2YoWycxMDAlJ10pXSkuaXNSZXF1aXJlZFxufTtcblxuZXhwb3J0IGRlZmF1bHQgU3BpbmVUbztcbiJdfQ==

/***/ }),
/* 402 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(403);

/***/ }),
/* 403 */
/***/ (function(module, exports, __webpack_require__) {

var parent = __webpack_require__(404);

module.exports = parent;


/***/ }),
/* 404 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(405);
var path = __webpack_require__(3);

module.exports = path.Math.sign;


/***/ }),
/* 405 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(2);
var sign = __webpack_require__(406);

// `Math.sign` method
// https://tc39.es/ecma262/#sec-math.sign
$({ target: 'Math', stat: true }, {
  sign: sign
});


/***/ }),
/* 406 */
/***/ (function(module, exports) {

// `Math.sign` method implementation
// https://tc39.es/ecma262/#sec-math.sign
// eslint-disable-next-line es/no-math-sign -- safe
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};


/***/ }),
/* 407 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = useStateRef;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);


function useStateRef(initialState) {
  var _useState = Object(__WEBPACK_IMPORTED_MODULE_1_react__["useState"])(initialState),
      _useState2 = __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_slicedToArray___default()(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var ref = Object(__WEBPACK_IMPORTED_MODULE_1_react__["useRef"])();
  var setValue = Object(__WEBPACK_IMPORTED_MODULE_1_react__["useCallback"])(function (nextValue) {
    if (typeof nextValue === 'function') {
      setValue(function (state) {
        nextValue = nextValue(state);
        ref.current = nextValue;
        return nextValue;
      });
    } else {
      ref.current = nextValue;
      setValue(nextValue);
    }
  }, [ref]);
  ref.current = state;
  return [state, setState, ref];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ob29rcy9pbnRlcm5hbC91c2VTdGF0ZVJlZi5qcyJdLCJuYW1lcyI6WyJ1c2VDYWxsYmFjayIsInVzZVJlZiIsInVzZVN0YXRlIiwidXNlU3RhdGVSZWYiLCJpbml0aWFsU3RhdGUiLCJzdGF0ZSIsInNldFN0YXRlIiwicmVmIiwic2V0VmFsdWUiLCJuZXh0VmFsdWUiLCJjdXJyZW50Il0sIm1hcHBpbmdzIjoiO0FBQUEsU0FBU0EsV0FBVCxFQUFzQkMsTUFBdEIsRUFBOEJDLFFBQTlCLFFBQThDLE9BQTlDO0FBRUEsZUFBZSxTQUFTQyxXQUFULENBQXFCQyxZQUFyQixFQUFtQztBQUNoRCxrQkFBMEJGLFFBQVEsQ0FBQ0UsWUFBRCxDQUFsQztBQUFBO0FBQUEsTUFBT0MsS0FBUDtBQUFBLE1BQWNDLFFBQWQ7O0FBQ0EsTUFBTUMsR0FBRyxHQUFHTixNQUFNLEVBQWxCO0FBQ0EsTUFBTU8sUUFBUSxHQUFHUixXQUFXLENBQzFCLFVBQUFTLFNBQVMsRUFBSTtBQUNYLFFBQUksT0FBT0EsU0FBUCxLQUFxQixVQUF6QixFQUFxQztBQUNuQ0QsTUFBQUEsUUFBUSxDQUFDLFVBQUFILEtBQUssRUFBSTtBQUNoQkksUUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNKLEtBQUQsQ0FBckI7QUFFQUUsUUFBQUEsR0FBRyxDQUFDRyxPQUFKLEdBQWNELFNBQWQ7QUFFQSxlQUFPQSxTQUFQO0FBQ0QsT0FOTyxDQUFSO0FBT0QsS0FSRCxNQVFPO0FBQ0xGLE1BQUFBLEdBQUcsQ0FBQ0csT0FBSixHQUFjRCxTQUFkO0FBRUFELE1BQUFBLFFBQVEsQ0FBQ0MsU0FBRCxDQUFSO0FBQ0Q7QUFDRixHQWZ5QixFQWdCMUIsQ0FBQ0YsR0FBRCxDQWhCMEIsQ0FBNUI7QUFtQkFBLEVBQUFBLEdBQUcsQ0FBQ0csT0FBSixHQUFjTCxLQUFkO0FBRUEsU0FBTyxDQUFDQSxLQUFELEVBQVFDLFFBQVIsRUFBa0JDLEdBQWxCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VTdGF0ZVJlZihpbml0aWFsU3RhdGUpIHtcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShpbml0aWFsU3RhdGUpO1xuICBjb25zdCByZWYgPSB1c2VSZWYoKTtcbiAgY29uc3Qgc2V0VmFsdWUgPSB1c2VDYWxsYmFjayhcbiAgICBuZXh0VmFsdWUgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXh0VmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc2V0VmFsdWUoc3RhdGUgPT4ge1xuICAgICAgICAgIG5leHRWYWx1ZSA9IG5leHRWYWx1ZShzdGF0ZSk7XG5cbiAgICAgICAgICByZWYuY3VycmVudCA9IG5leHRWYWx1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0VmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmLmN1cnJlbnQgPSBuZXh0VmFsdWU7XG5cbiAgICAgICAgc2V0VmFsdWUobmV4dFZhbHVlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtyZWZdXG4gICk7XG5cbiAgcmVmLmN1cnJlbnQgPSBzdGF0ZTtcblxuICByZXR1cm4gW3N0YXRlLCBzZXRTdGF0ZSwgcmVmXTtcbn1cbiJdfQ==

/***/ }),
/* 408 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__ = __webpack_require__(18);
/* eslint no-magic-numbers: ["error", { "ignore": [2] }] */

function useAnimating() {
  var _useStateContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__["a" /* default */])(2),
      animating = _useStateContext.animating;

  return [animating];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VBbmltYXRpbmcuanMiXSwibmFtZXMiOlsidXNlU3RhdGVDb250ZXh0IiwidXNlQW5pbWF0aW5nIiwiYW5pbWF0aW5nIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUVBLE9BQU9BLGVBQVAsTUFBNEIsNEJBQTVCO0FBRUEsZUFBZSxTQUFTQyxZQUFULEdBQXdCO0FBQ3JDLHlCQUFzQkQsZUFBZSxDQUFDLENBQUQsQ0FBckM7QUFBQSxNQUFRRSxTQUFSLG9CQUFRQSxTQUFSOztBQUVBLFNBQU8sQ0FBQ0EsU0FBRCxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgbm8tbWFnaWMtbnVtYmVyczogW1wiZXJyb3JcIiwgeyBcImlnbm9yZVwiOiBbMl0gfV0gKi9cblxuaW1wb3J0IHVzZVN0YXRlQ29udGV4dCBmcm9tICcuL2ludGVybmFsL3VzZVN0YXRlQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUFuaW1hdGluZygpIHtcbiAgY29uc3QgeyBhbmltYXRpbmcgfSA9IHVzZVN0YXRlQ29udGV4dCgyKTtcblxuICByZXR1cm4gW2FuaW1hdGluZ107XG59XG4iXX0=

/***/ }),
/* 409 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__ = __webpack_require__(18);
/* eslint no-magic-numbers: ["error", { "ignore": [2] }] */

function useAnimatingToEnd() {
  var _useStateContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__["a" /* default */])(2),
      animatingToEnd = _useStateContext.animatingToEnd;

  return [animatingToEnd];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VBbmltYXRpbmdUb0VuZC5qcyJdLCJuYW1lcyI6WyJ1c2VTdGF0ZUNvbnRleHQiLCJ1c2VBbmltYXRpbmdUb0VuZCIsImFuaW1hdGluZ1RvRW5kIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUVBLE9BQU9BLGVBQVAsTUFBNEIsNEJBQTVCO0FBRUEsZUFBZSxTQUFTQyxpQkFBVCxHQUE2QjtBQUMxQyx5QkFBMkJELGVBQWUsQ0FBQyxDQUFELENBQTFDO0FBQUEsTUFBUUUsY0FBUixvQkFBUUEsY0FBUjs7QUFFQSxTQUFPLENBQUNBLGNBQUQsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50IG5vLW1hZ2ljLW51bWJlcnM6IFtcImVycm9yXCIsIHsgXCJpZ25vcmVcIjogWzJdIH1dICovXG5cbmltcG9ydCB1c2VTdGF0ZUNvbnRleHQgZnJvbSAnLi9pbnRlcm5hbC91c2VTdGF0ZUNvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VBbmltYXRpbmdUb0VuZCgpIHtcbiAgY29uc3QgeyBhbmltYXRpbmdUb0VuZCB9ID0gdXNlU3RhdGVDb250ZXh0KDIpO1xuXG4gIHJldHVybiBbYW5pbWF0aW5nVG9FbmRdO1xufVxuIl19

/***/ }),
/* 410 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__ = __webpack_require__(18);

function useAtBottom() {
  var _useStateContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__["a" /* default */])(1),
      atBottom = _useStateContext.atBottom;

  return [atBottom];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VBdEJvdHRvbS5qcyJdLCJuYW1lcyI6WyJ1c2VTdGF0ZUNvbnRleHQiLCJ1c2VBdEJvdHRvbSIsImF0Qm90dG9tIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxlQUFQLE1BQTRCLDRCQUE1QjtBQUVBLGVBQWUsU0FBU0MsV0FBVCxHQUF1QjtBQUNwQyx5QkFBcUJELGVBQWUsQ0FBQyxDQUFELENBQXBDO0FBQUEsTUFBUUUsUUFBUixvQkFBUUEsUUFBUjs7QUFFQSxTQUFPLENBQUNBLFFBQUQsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVzZVN0YXRlQ29udGV4dCBmcm9tICcuL2ludGVybmFsL3VzZVN0YXRlQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUF0Qm90dG9tKCkge1xuICBjb25zdCB7IGF0Qm90dG9tIH0gPSB1c2VTdGF0ZUNvbnRleHQoMSk7XG5cbiAgcmV0dXJuIFthdEJvdHRvbV07XG59XG4iXX0=

/***/ }),
/* 411 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__ = __webpack_require__(18);

function useAtEnd() {
  var _useStateContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__["a" /* default */])(1),
      atEnd = _useStateContext.atEnd;

  return [atEnd];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VBdEVuZC5qcyJdLCJuYW1lcyI6WyJ1c2VTdGF0ZUNvbnRleHQiLCJ1c2VBdEVuZCIsImF0RW5kIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxlQUFQLE1BQTRCLDRCQUE1QjtBQUVBLGVBQWUsU0FBU0MsUUFBVCxHQUFvQjtBQUNqQyx5QkFBa0JELGVBQWUsQ0FBQyxDQUFELENBQWpDO0FBQUEsTUFBUUUsS0FBUixvQkFBUUEsS0FBUjs7QUFFQSxTQUFPLENBQUNBLEtBQUQsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVzZVN0YXRlQ29udGV4dCBmcm9tICcuL2ludGVybmFsL3VzZVN0YXRlQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUF0RW5kKCkge1xuICBjb25zdCB7IGF0RW5kIH0gPSB1c2VTdGF0ZUNvbnRleHQoMSk7XG5cbiAgcmV0dXJuIFthdEVuZF07XG59XG4iXX0=

/***/ }),
/* 412 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__ = __webpack_require__(18);

function useAtStart() {
  var _useStateContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__["a" /* default */])(1),
      atStart = _useStateContext.atStart;

  return [atStart];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VBdFN0YXJ0LmpzIl0sIm5hbWVzIjpbInVzZVN0YXRlQ29udGV4dCIsInVzZUF0U3RhcnQiLCJhdFN0YXJ0Il0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxlQUFQLE1BQTRCLDRCQUE1QjtBQUVBLGVBQWUsU0FBU0MsVUFBVCxHQUFzQjtBQUNuQyx5QkFBb0JELGVBQWUsQ0FBQyxDQUFELENBQW5DO0FBQUEsTUFBUUUsT0FBUixvQkFBUUEsT0FBUjs7QUFFQSxTQUFPLENBQUNBLE9BQUQsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVzZVN0YXRlQ29udGV4dCBmcm9tICcuL2ludGVybmFsL3VzZVN0YXRlQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUF0U3RhcnQoKSB7XG4gIGNvbnN0IHsgYXRTdGFydCB9ID0gdXNlU3RhdGVDb250ZXh0KDEpO1xuXG4gIHJldHVybiBbYXRTdGFydF07XG59XG4iXX0=

/***/ }),
/* 413 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__ = __webpack_require__(18);

function useAtTop() {
  var _useStateContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__["a" /* default */])(1),
      atTop = _useStateContext.atTop;

  return [atTop];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VBdFRvcC5qcyJdLCJuYW1lcyI6WyJ1c2VTdGF0ZUNvbnRleHQiLCJ1c2VBdFRvcCIsImF0VG9wIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxlQUFQLE1BQTRCLDRCQUE1QjtBQUVBLGVBQWUsU0FBU0MsUUFBVCxHQUFvQjtBQUNqQyx5QkFBa0JELGVBQWUsQ0FBQyxDQUFELENBQWpDO0FBQUEsTUFBUUUsS0FBUixvQkFBUUEsS0FBUjs7QUFFQSxTQUFPLENBQUNBLEtBQUQsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVzZVN0YXRlQ29udGV4dCBmcm9tICcuL2ludGVybmFsL3VzZVN0YXRlQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUF0VG9wKCkge1xuICBjb25zdCB7IGF0VG9wIH0gPSB1c2VTdGF0ZUNvbnRleHQoMSk7XG5cbiAgcmV0dXJuIFthdFRvcF07XG59XG4iXX0=

/***/ }),
/* 414 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__ = __webpack_require__(18);

function useMode() {
  var _useStateContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useStateContext__["a" /* default */])(1),
      mode = _useStateContext.mode;

  return [mode];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VNb2RlLmpzIl0sIm5hbWVzIjpbInVzZVN0YXRlQ29udGV4dCIsInVzZU1vZGUiLCJtb2RlIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxlQUFQLE1BQTRCLDRCQUE1QjtBQUVBLGVBQWUsU0FBU0MsT0FBVCxHQUFtQjtBQUNoQyx5QkFBaUJELGVBQWUsQ0FBQyxDQUFELENBQWhDO0FBQUEsTUFBUUUsSUFBUixvQkFBUUEsSUFBUjs7QUFFQSxTQUFPLENBQUNBLElBQUQsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVzZVN0YXRlQ29udGV4dCBmcm9tICcuL2ludGVybmFsL3VzZVN0YXRlQ29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZU1vZGUoKSB7XG4gIGNvbnN0IHsgbW9kZSB9ID0gdXNlU3RhdGVDb250ZXh0KDEpO1xuXG4gIHJldHVybiBbbW9kZV07XG59XG4iXX0=

/***/ }),
/* 415 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_toConsumableArray__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_array_is_array__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_array_is_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_array_is_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__internal_useInternalContext__ = __webpack_require__(147);





function useObserveScrollPosition(observer) {
  var _context;

  var deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (observer && typeof observer !== 'function') {
    console.error('react-scroll-to-bottom: First argument passed to "useObserveScrollPosition" must be a function.');
  } else if (!__WEBPACK_IMPORTED_MODULE_1__babel_runtime_corejs3_core_js_stable_array_is_array___default()(deps)) {
    console.error('react-scroll-to-bottom: Second argument passed to "useObserveScrollPosition" must be an array if specified.');
  }

  var _useInternalContext = Object(__WEBPACK_IMPORTED_MODULE_4__internal_useInternalContext__["a" /* default */])(),
      observeScrollPosition = _useInternalContext.observeScrollPosition;
  /* eslint-disable-next-line react-hooks/exhaustive-deps */


  Object(__WEBPACK_IMPORTED_MODULE_3_react__["useEffect"])(function () {
    return observer && observeScrollPosition(observer);
  }, __WEBPACK_IMPORTED_MODULE_2__babel_runtime_corejs3_core_js_stable_instance_concat___default()(_context = []).call(_context, __WEBPACK_IMPORTED_MODULE_0__babel_runtime_corejs3_helpers_toConsumableArray___default()(deps), [!observer, observeScrollPosition]));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VPYnNlcnZlU2Nyb2xsUG9zaXRpb24uanMiXSwibmFtZXMiOlsidXNlRWZmZWN0IiwidXNlSW50ZXJuYWxDb250ZXh0IiwidXNlT2JzZXJ2ZVNjcm9sbFBvc2l0aW9uIiwib2JzZXJ2ZXIiLCJkZXBzIiwiY29uc29sZSIsImVycm9yIiwib2JzZXJ2ZVNjcm9sbFBvc2l0aW9uIl0sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFTQSxTQUFULFFBQTBCLE9BQTFCO0FBRUEsT0FBT0Msa0JBQVAsTUFBK0IsK0JBQS9CO0FBRUEsZUFBZSxTQUFTQyx3QkFBVCxDQUFrQ0MsUUFBbEMsRUFBdUQ7QUFBQTs7QUFBQSxNQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQ3BFLE1BQUlELFFBQVEsSUFBSSxPQUFPQSxRQUFQLEtBQW9CLFVBQXBDLEVBQWdEO0FBQzlDRSxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxpR0FBZDtBQUNELEdBRkQsTUFFTyxJQUFJLENBQUMsZUFBY0YsSUFBZCxDQUFMLEVBQTBCO0FBQy9CQyxJQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FDRSw2R0FERjtBQUdEOztBQUVELDRCQUFrQ0wsa0JBQWtCLEVBQXBEO0FBQUEsTUFBUU0scUJBQVIsdUJBQVFBLHFCQUFSO0FBRUE7OztBQUNBUCxFQUFBQSxTQUFTLENBQUM7QUFBQSxXQUFNRyxRQUFRLElBQUlJLHFCQUFxQixDQUFDSixRQUFELENBQXZDO0FBQUEsR0FBRCwyRUFBd0RDLElBQXhELElBQThELENBQUNELFFBQS9ELEVBQXlFSSxxQkFBekUsR0FBVDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdXNlSW50ZXJuYWxDb250ZXh0IGZyb20gJy4vaW50ZXJuYWwvdXNlSW50ZXJuYWxDb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlT2JzZXJ2ZVNjcm9sbFBvc2l0aW9uKG9ic2VydmVyLCBkZXBzID0gW10pIHtcbiAgaWYgKG9ic2VydmVyICYmIHR5cGVvZiBvYnNlcnZlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ3JlYWN0LXNjcm9sbC10by1ib3R0b206IEZpcnN0IGFyZ3VtZW50IHBhc3NlZCB0byBcInVzZU9ic2VydmVTY3JvbGxQb3NpdGlvblwiIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShkZXBzKSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAncmVhY3Qtc2Nyb2xsLXRvLWJvdHRvbTogU2Vjb25kIGFyZ3VtZW50IHBhc3NlZCB0byBcInVzZU9ic2VydmVTY3JvbGxQb3NpdGlvblwiIG11c3QgYmUgYW4gYXJyYXkgaWYgc3BlY2lmaWVkLidcbiAgICApO1xuICB9XG5cbiAgY29uc3QgeyBvYnNlcnZlU2Nyb2xsUG9zaXRpb24gfSA9IHVzZUludGVybmFsQ29udGV4dCgpO1xuXG4gIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHMgKi9cbiAgdXNlRWZmZWN0KCgpID0+IG9ic2VydmVyICYmIG9ic2VydmVTY3JvbGxQb3NpdGlvbihvYnNlcnZlciksIFsuLi5kZXBzLCAhb2JzZXJ2ZXIsIG9ic2VydmVTY3JvbGxQb3NpdGlvbl0pO1xufVxuIl19

/***/ }),
/* 416 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__ = __webpack_require__(32);

function useScrollTo() {
  var _useFunctionContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__["a" /* default */])(),
      scrollTo = _useFunctionContext.scrollTo;

  return scrollTo;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VTY3JvbGxUby5qcyJdLCJuYW1lcyI6WyJ1c2VGdW5jdGlvbkNvbnRleHQiLCJ1c2VTY3JvbGxUbyIsInNjcm9sbFRvIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxrQkFBUCxNQUErQiwrQkFBL0I7QUFFQSxlQUFlLFNBQVNDLFdBQVQsR0FBdUI7QUFDcEMsNEJBQXFCRCxrQkFBa0IsRUFBdkM7QUFBQSxNQUFRRSxRQUFSLHVCQUFRQSxRQUFSOztBQUVBLFNBQU9BLFFBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1c2VGdW5jdGlvbkNvbnRleHQgZnJvbSAnLi9pbnRlcm5hbC91c2VGdW5jdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VTY3JvbGxUbygpIHtcbiAgY29uc3QgeyBzY3JvbGxUbyB9ID0gdXNlRnVuY3Rpb25Db250ZXh0KCk7XG5cbiAgcmV0dXJuIHNjcm9sbFRvO1xufVxuIl19

/***/ }),
/* 417 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__ = __webpack_require__(32);

function useScrollToBottom() {
  var _useFunctionContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__["a" /* default */])(),
      scrollToBottom = _useFunctionContext.scrollToBottom;

  return scrollToBottom;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VTY3JvbGxUb0JvdHRvbS5qcyJdLCJuYW1lcyI6WyJ1c2VGdW5jdGlvbkNvbnRleHQiLCJ1c2VTY3JvbGxUb0JvdHRvbSIsInNjcm9sbFRvQm90dG9tIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxrQkFBUCxNQUErQiwrQkFBL0I7QUFFQSxlQUFlLFNBQVNDLGlCQUFULEdBQTZCO0FBQzFDLDRCQUEyQkQsa0JBQWtCLEVBQTdDO0FBQUEsTUFBUUUsY0FBUix1QkFBUUEsY0FBUjs7QUFFQSxTQUFPQSxjQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXNlRnVuY3Rpb25Db250ZXh0IGZyb20gJy4vaW50ZXJuYWwvdXNlRnVuY3Rpb25Db250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlU2Nyb2xsVG9Cb3R0b20oKSB7XG4gIGNvbnN0IHsgc2Nyb2xsVG9Cb3R0b20gfSA9IHVzZUZ1bmN0aW9uQ29udGV4dCgpO1xuXG4gIHJldHVybiBzY3JvbGxUb0JvdHRvbTtcbn1cbiJdfQ==

/***/ }),
/* 418 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__ = __webpack_require__(32);

function useScrollToStart() {
  var _useFunctionContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__["a" /* default */])(),
      scrollToStart = _useFunctionContext.scrollToStart;

  return scrollToStart;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VTY3JvbGxUb1N0YXJ0LmpzIl0sIm5hbWVzIjpbInVzZUZ1bmN0aW9uQ29udGV4dCIsInVzZVNjcm9sbFRvU3RhcnQiLCJzY3JvbGxUb1N0YXJ0Il0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxrQkFBUCxNQUErQiwrQkFBL0I7QUFFQSxlQUFlLFNBQVNDLGdCQUFULEdBQTRCO0FBQ3pDLDRCQUEwQkQsa0JBQWtCLEVBQTVDO0FBQUEsTUFBUUUsYUFBUix1QkFBUUEsYUFBUjs7QUFFQSxTQUFPQSxhQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXNlRnVuY3Rpb25Db250ZXh0IGZyb20gJy4vaW50ZXJuYWwvdXNlRnVuY3Rpb25Db250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlU2Nyb2xsVG9TdGFydCgpIHtcbiAgY29uc3QgeyBzY3JvbGxUb1N0YXJ0IH0gPSB1c2VGdW5jdGlvbkNvbnRleHQoKTtcblxuICByZXR1cm4gc2Nyb2xsVG9TdGFydDtcbn1cbiJdfQ==

/***/ }),
/* 419 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__ = __webpack_require__(32);

function useScrollToTop() {
  var _useFunctionContext = Object(__WEBPACK_IMPORTED_MODULE_0__internal_useFunctionContext__["a" /* default */])(),
      scrollToTop = _useFunctionContext.scrollToTop;

  return scrollToTop;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VTY3JvbGxUb1RvcC5qcyJdLCJuYW1lcyI6WyJ1c2VGdW5jdGlvbkNvbnRleHQiLCJ1c2VTY3JvbGxUb1RvcCIsInNjcm9sbFRvVG9wIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxrQkFBUCxNQUErQiwrQkFBL0I7QUFFQSxlQUFlLFNBQVNDLGNBQVQsR0FBMEI7QUFDdkMsNEJBQXdCRCxrQkFBa0IsRUFBMUM7QUFBQSxNQUFRRSxXQUFSLHVCQUFRQSxXQUFSOztBQUVBLFNBQU9BLFdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1c2VGdW5jdGlvbkNvbnRleHQgZnJvbSAnLi9pbnRlcm5hbC91c2VGdW5jdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VTY3JvbGxUb1RvcCgpIHtcbiAgY29uc3QgeyBzY3JvbGxUb1RvcCB9ID0gdXNlRnVuY3Rpb25Db250ZXh0KCk7XG5cbiAgcmV0dXJuIHNjcm9sbFRvVG9wO1xufVxuIl19

/***/ }),
/* 420 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Message_css__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Message_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Message_css__);
//import ReactEmoji from 'react-emoji';
var Message=function Message(_ref){var _ref$message=_ref.message,text=_ref$message.text,user=_ref$message.user,name=_ref.name;var isSentByCurruentUser=false;var trimmedName=name.trim().toLowerCase();if(user===trimmedName){isSentByCurruentUser=true;}return isSentByCurruentUser?__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div",{className:"messageContainer justifyEnd"},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("p",{className:"sentText pr-10"},trimmedName),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div",{className:"messageBox backgroundBlue"},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("p",{className:"messageText colorWhite"},text))):__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div",{className:"messageContainer justifyStart"},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div",{className:"messageBox backgroundLight"},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("p",{className:"messageText colorDark"},text)),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("p",{className:"sentText pl-10 "},user));};/* harmony default export */ __webpack_exports__["a"] = (Message);

/***/ }),
/* 421 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: BrowserslistError: Unknown browser query `dead`\n    at error (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:37:11)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:222:9\n    at Array.forEach (<anonymous>)\n    at browserslist (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:196:13)\n    at cleanBrowsersList (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/utils.js:56:59)\n    at setBrowserScope (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:29:43)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:91:1)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at Module.load (node:internal/modules/cjs/loader:973:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:813:14)\n    at Module.require (node:internal/modules/cjs/loader:997:19)\n    at require (node:internal/modules/cjs/helpers:92:18)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-merge-rules/dist/lib/ensureCompatibility.js:7:19)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/webpack/lib/NormalModule.js:195:19\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:233:18\n    at runSyncOrAsync (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:143:3)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:232:2)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:221:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:236:3\n    at context.callback (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-loader/lib/index.js:180:9\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:94:5)");

/***/ }),
/* 422 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: BrowserslistError: Unknown browser query `dead`\n    at error (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:37:11)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:222:9\n    at Array.forEach (<anonymous>)\n    at browserslist (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:196:13)\n    at cleanBrowsersList (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/utils.js:56:59)\n    at setBrowserScope (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:29:43)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:91:1)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at Module.load (node:internal/modules/cjs/loader:973:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:813:14)\n    at Module.require (node:internal/modules/cjs/loader:997:19)\n    at require (node:internal/modules/cjs/helpers:92:18)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-merge-rules/dist/lib/ensureCompatibility.js:7:19)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/webpack/lib/NormalModule.js:195:19\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:233:18\n    at runSyncOrAsync (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:143:3)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:232:2)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:221:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:236:3\n    at context.callback (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-loader/lib/index.js:180:9\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:94:5)");

/***/ }),
/* 423 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__icons_onlineIcon_png__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__icons_onlineIcon_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__icons_onlineIcon_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icons_closeIcon_png__ = __webpack_require__(424);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__icons_closeIcon_png___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__icons_closeIcon_png__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__InfoBar_css__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__InfoBar_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__InfoBar_css__);
var InfoBar=function InfoBar(_ref){var room=_ref.room;return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',{className:'infoBar'},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',{className:'leftInnerContainer'},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input',{type:'image',className:'onlineIcon',src:__WEBPACK_IMPORTED_MODULE_1__icons_onlineIcon_png__["default"],alt:'online image'}),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('h3',null,room)),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div',{className:'rightInnerContainer'},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('a',{href:'/'},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input',{type:'image',src:__WEBPACK_IMPORTED_MODULE_2__icons_closeIcon_png__["default"],alt:'close image'}))));};/* harmony default export */ __webpack_exports__["a"] = (InfoBar);

/***/ }),
/* 424 */
/***/ (function(module, exports) {

throw new Error("Module build failed: TypeError: validateOptions is not a function\n    at Object.module.exports (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/url-loader/index.js:15:3)");

/***/ }),
/* 425 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: BrowserslistError: Unknown browser query `dead`\n    at error (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:37:11)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:222:9\n    at Array.forEach (<anonymous>)\n    at browserslist (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:196:13)\n    at cleanBrowsersList (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/utils.js:56:59)\n    at setBrowserScope (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:29:43)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:91:1)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at Module.load (node:internal/modules/cjs/loader:973:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:813:14)\n    at Module.require (node:internal/modules/cjs/loader:997:19)\n    at require (node:internal/modules/cjs/helpers:92:18)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-merge-rules/dist/lib/ensureCompatibility.js:7:19)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/webpack/lib/NormalModule.js:195:19\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:233:18\n    at runSyncOrAsync (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:143:3)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:232:2)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:221:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:236:3\n    at context.callback (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-loader/lib/index.js:180:9\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:94:5)");

/***/ }),
/* 426 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Input_css__ = __webpack_require__(427);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Input_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__Input_css__);
var Input=function Input(_ref){var setMessage=_ref.setMessage,sendMessage=_ref.sendMessage,message=_ref.message;return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('form',{className:'form'},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input',{className:'input',type:'text',placeholder:'Type a message...',value:message,onChange:function onChange(_ref2){var value=_ref2.target.value;return setMessage(value);},onKeyPress:function onKeyPress(event){return event.key==='Enter'?sendMessage(event):null;}}),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('button',{className:'sendButton',onClick:function onClick(event){return sendMessage(event);}},'\uC804\uC1A1'));};/* harmony default export */ __webpack_exports__["a"] = (Input);

/***/ }),
/* 427 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: BrowserslistError: Unknown browser query `dead`\n    at error (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:37:11)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:222:9\n    at Array.forEach (<anonymous>)\n    at browserslist (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:196:13)\n    at cleanBrowsersList (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/utils.js:56:59)\n    at setBrowserScope (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:29:43)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:91:1)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at Module.load (node:internal/modules/cjs/loader:973:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:813:14)\n    at Module.require (node:internal/modules/cjs/loader:997:19)\n    at require (node:internal/modules/cjs/helpers:92:18)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-merge-rules/dist/lib/ensureCompatibility.js:7:19)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/webpack/lib/NormalModule.js:195:19\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:233:18\n    at runSyncOrAsync (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:143:3)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:232:2)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:221:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:236:3\n    at context.callback (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-loader/lib/index.js:180:9\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:94:5)");

/***/ }),
/* 428 */
/***/ (function(module, exports) {

throw new Error("Module build failed: ModuleBuildError: Module build failed: BrowserslistError: Unknown browser query `dead`\n    at error (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:37:11)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:222:9\n    at Array.forEach (<anonymous>)\n    at browserslist (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/node_modules/browserslist/index.js:196:13)\n    at cleanBrowsersList (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/utils.js:56:59)\n    at setBrowserScope (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:29:43)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/caniuse-api/dist/index.js:91:1)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at Module.load (node:internal/modules/cjs/loader:973:32)\n    at Function.Module._load (node:internal/modules/cjs/loader:813:14)\n    at Module.require (node:internal/modules/cjs/loader:997:19)\n    at require (node:internal/modules/cjs/helpers:92:18)\n    at Object.<anonymous> (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-merge-rules/dist/lib/ensureCompatibility.js:7:19)\n    at Module._compile (node:internal/modules/cjs/loader:1108:14)\n    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/webpack/lib/NormalModule.js:195:19\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:367:11\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:233:18\n    at runSyncOrAsync (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:143:3)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:232:2)\n    at iterateNormalLoaders (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:221:10)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:236:3\n    at context.callback (/mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at /mnt/c/Users/99space/dev/vscode/NodeJS-chatApp/client/node_modules/postcss-loader/lib/index.js:180:9\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (node:internal/process/task_queues:94:5)");

/***/ })
/******/ ]);
//# sourceMappingURL=main.0350e4b2.js.map