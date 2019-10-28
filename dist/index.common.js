module.exports =
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "1fe0":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoPlayer_vue_vue_type_style_index_0_id_1c218ecc_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5193");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoPlayer_vue_vue_type_style_index_0_id_1c218ecc_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoPlayer_vue_vue_type_style_index_0_id_1c218ecc_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoPlayer_vue_vue_type_style_index_0_id_1c218ecc_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "21bd":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("e450");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("27113f69", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "2350":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "2faf":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, ".video-overlay[data-v-ea6e5e6a]{height:100%;width:100%;top:0;left:0;position:absolute}", ""]);

// exports


/***/ }),

/***/ "3d54":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoPoster_vue_vue_type_style_index_0_id_b5717866_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("21bd");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoPoster_vue_vue_type_style_index_0_id_b5717866_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoPoster_vue_vue_type_style_index_0_id_b5717866_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoPoster_vue_vue_type_style_index_0_id_b5717866_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "493a":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("2faf");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("62da6ba7", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addStylesClient; });
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "5193":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("e106");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("58fa12c1", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "5abf":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("683d");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("63c48799", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "683d":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, ".vue-responsive-videobg[data-v-6d7f1cfc]{background:none;position:relative;width:100%;overflow:hidden}.vue-responsive-videobg .videobg-content[data-v-6d7f1cfc]{position:absolute;top:0;left:0;width:100%;height:100%}", ""]);

// exports


/***/ }),

/***/ "8069":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoOverlay_vue_vue_type_style_index_0_id_ea6e5e6a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("493a");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoOverlay_vue_vue_type_style_index_0_id_ea6e5e6a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoOverlay_vue_vue_type_style_index_0_id_ea6e5e6a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoOverlay_vue_vue_type_style_index_0_id_ea6e5e6a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "bea1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoBackground_vue_vue_type_style_index_0_id_6d7f1cfc_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5abf");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoBackground_vue_vue_type_style_index_0_id_6d7f1cfc_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoBackground_vue_vue_type_style_index_0_id_6d7f1cfc_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VideoBackground_vue_vue_type_style_index_0_id_6d7f1cfc_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "e106":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, ".video-wrapper[data-v-1c218ecc]{display:flex;justify-content:center;align-items:center;width:100%;height:100%;position:absolute;overflow:hidden;z-index:0}.fade[data-v-1c218ecc]{backface-visibility:hidden}.fade-enter-active[data-v-1c218ecc],.fade-leave-active[data-v-1c218ecc]{transition:opacity 1s}.fade-enter[data-v-1c218ecc],.fade-leave-to[data-v-1c218ecc]{opacity:0}video[data-v-1c218ecc]{visibility:visible;pointer-events:none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:100%;width:100%}", ""]);

// exports


/***/ }),

/***/ "e450":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, ".video-buffering[data-v-b5717866]{width:100%;overflow:hidden;background-size:cover;background-position:50%;height:100%;top:0;left:0;position:absolute}", ""]);

// exports


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2dd602f9-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/VideoBackground.vue?vue&type=template&id=6d7f1cfc&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{ref:"vidbg",staticClass:"vue-responsive-videobg"},[(_vm.current.poster || _vm.poster)?_c('video-poster',{attrs:{"poster":_vm.current.poster || _vm.poster}}):_vm._e(),_c('video-player',{ref:"player",attrs:{"src":_vm.current.src,"muted":_vm.muted,"loop":_vm.loop,"preload":_vm.preload},on:{"ready":_vm.playVideo,"playing":function($event){return _vm.$emit('playing')},"error":function($event){return _vm.$emit('error')},"loading":function($event){return _vm.$emit('loading')},"ended":function($event){return _vm.$emit('ended')}}}),(_vm.overlay)?_c('video-overlay',{attrs:{"overlay":_vm.overlay}}):_vm._e(),_c('div',{staticClass:"videobg-content"},[_vm._t("default")],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/VideoBackground.vue?vue&type=template&id=6d7f1cfc&scoped=true&

// CONCATENATED MODULE: ./src/core/playerProps.js
/* harmony default export */ var playerProps = ({
  src: {
    type: String,
    required: true
  },
  muted: {
    type: Boolean,
    default: true
  },
  loop: {
    type: Boolean,
    default: true
  },
  preload: {
    type: String,
    default: 'auto'
  },
  objectFit: {
    type: String,
    default: 'cover'
  }
});
// CONCATENATED MODULE: ./src/core/props.js

const sourcesProperties = ['src', 'res', 'autoplay'];

const sourcesValidator = value => {
  if (!Array.isArray(value)) {
    return false;
  }

  if (value.length === 0) {
    return true;
  }

  return arrayContainsProps(value, sourcesProperties);
};

const arrayContainsProps = (array, arrayPropNames) => {
  if (arrayPropNames.length === 1) {
    return containsProp(array, arrayPropNames[0]);
  }

  return containsProp(array, arrayPropNames[0]) * arrayContainsProps(array, arrayPropNames.slice(1));
};

const containsProp = (array, propName) => {
  for (let i = array.length - 1; i > -1; i -= 1) {
    const propObj = array[i];

    if (!isObject(propObj)) {
      return false;
    }

    if (exists(propObj, propName)) {
      return true;
    }
  }

  return false;
};

const isObject = obj => obj != null && obj.constructor.name === 'Object';

const exists = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/* harmony default export */ var props = ({
  sources: {
    type: Array,

    default() {
      return [];
    },

    validator: sourcesValidator
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  poster: {
    type: String,
    default: ''
  },
  overlay: {
    type: String,
    default: ''
  },
  ...playerProps
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2dd602f9-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VideoPlayer.vue?vue&type=template&id=1c218ecc&scoped=true&
var VideoPlayervue_type_template_id_1c218ecc_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showVideo),expression:"showVideo"}],staticClass:"video-wrapper"},[_c('video',{ref:"video",style:(_vm.styleObject),attrs:{"playsinline":"","loop":_vm.loop,"preload":_vm.preload},domProps:{"muted":_vm.muted}},[_c('source',{attrs:{"src":_vm.src,"type":_vm.getMediaType(_vm.src)}})])])])}
var VideoPlayervue_type_template_id_1c218ecc_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/VideoPlayer.vue?vue&type=template&id=1c218ecc&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VideoPlayer.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VideoPlayervue_type_script_lang_js_ = ({
  props: playerProps,

  data() {
    return {
      showVideo: false
    };
  },

  computed: {
    styleObject() {
      if (!this.objectFit) {
        return {};
      }

      return {
        objectFit: this.objectFit
      };
    }

  },
  watch: {
    src() {
      this.load();
    }

  },
  methods: {
    load() {
      this.hide(); // ugly, but we want to give hide 1 sec pause until we load the next video

      setTimeout(() => {
        this.$refs.video.load();
        this.$emit('loading');
      }, 1000);
    },

    play() {
      this.$refs.video.play();
      this.show();
      this.$emit('playing');
    },

    show() {
      this.showVideo = true;
    },

    hide() {
      this.showVideo = false;
    },

    getMediaType(src) {
      return `video/${src.split('.').pop()}`;
    },

    videoCanPlay() {
      return !!this.$refs.video.canPlayType;
    },

    videoReady() {
      this.$emit('ready');
    },

    videoError() {
      this.$emit('error');
    },

    videoEnded() {
      this.$emit('ended');
    }

  },

  mounted() {
    if (this.videoCanPlay()) {
      this.$refs.video.addEventListener('canplay', this.videoReady);
      this.$refs.video.addEventListener('error', this.videoError);
      this.$refs.video.addEventListener('ended', this.videoEnded);
    }
  },

  beforeDestroy() {
    this.$refs.video.removeEventListener('canplay', this.videoReady);
    this.$refs.video.removeEventListener('error', this.videoError);
    this.$refs.video.removeEventListener('ended', this.videoEnded);
  }

});
// CONCATENATED MODULE: ./src/components/VideoPlayer.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VideoPlayervue_type_script_lang_js_ = (VideoPlayervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/VideoPlayer.vue?vue&type=style&index=0&id=1c218ecc&scoped=true&lang=css&
var VideoPlayervue_type_style_index_0_id_1c218ecc_scoped_true_lang_css_ = __webpack_require__("1fe0");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/VideoPlayer.vue






/* normalize component */

var component = normalizeComponent(
  components_VideoPlayervue_type_script_lang_js_,
  VideoPlayervue_type_template_id_1c218ecc_scoped_true_render,
  VideoPlayervue_type_template_id_1c218ecc_scoped_true_staticRenderFns,
  false,
  null,
  "1c218ecc",
  null
  
)

/* harmony default export */ var VideoPlayer = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2dd602f9-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VideoPoster.vue?vue&type=template&id=b5717866&scoped=true&
var VideoPostervue_type_template_id_b5717866_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"video-buffering",style:(_vm.image)})}
var VideoPostervue_type_template_id_b5717866_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/VideoPoster.vue?vue&type=template&id=b5717866&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VideoPoster.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
/* harmony default export */ var VideoPostervue_type_script_lang_js_ = ({
  props: {
    poster: {
      type: String,
      required: true
    }
  },
  computed: {
    image() {
      return {
        backgroundImage: `url(${this.poster})`
      };
    }

  }
});
// CONCATENATED MODULE: ./src/components/VideoPoster.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VideoPostervue_type_script_lang_js_ = (VideoPostervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/VideoPoster.vue?vue&type=style&index=0&id=b5717866&scoped=true&lang=css&
var VideoPostervue_type_style_index_0_id_b5717866_scoped_true_lang_css_ = __webpack_require__("3d54");

// CONCATENATED MODULE: ./src/components/VideoPoster.vue






/* normalize component */

var VideoPoster_component = normalizeComponent(
  components_VideoPostervue_type_script_lang_js_,
  VideoPostervue_type_template_id_b5717866_scoped_true_render,
  VideoPostervue_type_template_id_b5717866_scoped_true_staticRenderFns,
  false,
  null,
  "b5717866",
  null
  
)

/* harmony default export */ var VideoPoster = (VideoPoster_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"2dd602f9-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VideoOverlay.vue?vue&type=template&id=ea6e5e6a&scoped=true&
var VideoOverlayvue_type_template_id_ea6e5e6a_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"video-overlay",style:({background: _vm.overlay})})}
var VideoOverlayvue_type_template_id_ea6e5e6a_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/VideoOverlay.vue?vue&type=template&id=ea6e5e6a&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VideoOverlay.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
/* harmony default export */ var VideoOverlayvue_type_script_lang_js_ = ({
  props: {
    overlay: {
      type: String,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./src/components/VideoOverlay.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VideoOverlayvue_type_script_lang_js_ = (VideoOverlayvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/VideoOverlay.vue?vue&type=style&index=0&id=ea6e5e6a&scoped=true&lang=css&
var VideoOverlayvue_type_style_index_0_id_ea6e5e6a_scoped_true_lang_css_ = __webpack_require__("8069");

// CONCATENATED MODULE: ./src/components/VideoOverlay.vue






/* normalize component */

var VideoOverlay_component = normalizeComponent(
  components_VideoOverlayvue_type_script_lang_js_,
  VideoOverlayvue_type_template_id_ea6e5e6a_scoped_true_render,
  VideoOverlayvue_type_template_id_ea6e5e6a_scoped_true_staticRenderFns,
  false,
  null,
  "ea6e5e6a",
  null
  
)

/* harmony default export */ var VideoOverlay = (VideoOverlay_component.exports);
// CONCATENATED MODULE: ./src/lib/throttle.js
// Based on https://stackoverflow.com/questions/27078285/simple-throttle-in-js
/* harmony default export */ var throttle = ((callback, limit) => {
  let timeoutHandler = 'null';
  return (...args) => {
    if (timeoutHandler === 'null') {
      timeoutHandler = setTimeout(() => {
        callback(...args);
        timeoutHandler = 'null';
      }, limit);
    }
  };
});
// CONCATENATED MODULE: ./src/core/resize.js

/* harmony default export */ var resize = ({
  data() {
    return {
      width: 0
    };
  },

  computed: {
    current() {
      if (this.sources.length === 0) {
        return this.default;
      }

      const current = this.sources.sort((a, b) => a.res - b.res).filter(source => source.res >= this.width);

      if (current.length === 0) {
        return this.default;
      }

      return current[0];
    },

    default() {
      return {
        src: this.src,
        poster: this.poster,
        autoplay: this.autoplay
      };
    }

  },
  methods: {
    $_change_video_resolution() {
      this.width = this.$_innerWidth();
    },

    $_innerWidth() {
      return window.innerWidth && document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    }

  },

  beforeMount() {
    this.$_change_video_resolution();
  },

  mounted() {
    window.addEventListener('resize', throttle(this.$_change_video_resolution, 250));
  },

  beforeDestroy() {
    window.removeEventListener('resize', throttle(this.$_change_video_resolution, 250));
  }

});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/VideoBackground.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ var VideoBackgroundvue_type_script_lang_js_ = ({
  props: props,
  mixins: [resize],
  components: {
    VideoPlayer: VideoPlayer,
    VideoPoster: VideoPoster,
    VideoOverlay: VideoOverlay
  },
  computed: {
    player() {
      return this.$refs.player;
    }

  },
  methods: {
    playVideo() {
      this.$emit('ready');
      if (!this.current.autoplay) return;
      this.player.play();
    }

  }
});
// CONCATENATED MODULE: ./src/VideoBackground.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_VideoBackgroundvue_type_script_lang_js_ = (VideoBackgroundvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/VideoBackground.vue?vue&type=style&index=0&id=6d7f1cfc&scoped=true&lang=css&
var VideoBackgroundvue_type_style_index_0_id_6d7f1cfc_scoped_true_lang_css_ = __webpack_require__("bea1");

// CONCATENATED MODULE: ./src/VideoBackground.vue






/* normalize component */

var VideoBackground_component = normalizeComponent(
  src_VideoBackgroundvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "6d7f1cfc",
  null
  
)

/* harmony default export */ var VideoBackground = (VideoBackground_component.exports);
// CONCATENATED MODULE: ./src/index.js

const Plugin = {
  install(Vue) {
    Vue.component('video-background', VideoBackground);
  }

};
/* harmony default export */ var src = (VideoBackground);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js
/* concated harmony reexport Plugin */__webpack_require__.d(__webpack_exports__, "Plugin", function() { return Plugin; });


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src);



/***/ })

/******/ });