(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("quick-pivot", [], factory);
	else if(typeof exports === 'object')
		exports["quick-pivot"] = factory();
	else
		root["quick-pivot"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _logic = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Pivot = function () {
	  function Pivot(data, rows, cols, agg, type, header) {
	    _classCallCheck(this, Pivot);
	
	    this.rows = rows;
	    this.cols = cols;
	    this.agg = agg;
	    this.type = type;
	    this.header = header;
	    this.data = (0, _logic.tableCreator)(data, rows, cols, agg, type, header);
	  }
	
	  _createClass(Pivot, [{
	    key: 'getData',
	    value: function getData() {
	      return this.data;
	    }
	  }, {
	    key: 'setData',
	    value: function setData(data) {
	      this.data = (0, _logic.tableCreator)(data, this.rows, this.cols, this.agg, this.type, this.header);
	    }
	  }]);
	
	  return Pivot;
	}();
	
	exports.default = Pivot;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.tableCreator = tableCreator;
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function fixDataFormat(data) {
	  if (!Array.isArray(data) || !data.length) return [];else if (_typeof(data[0]) === 'object' && !Array.isArray(data[0])) return data;
	  return data.reduce(function (dataCol, row, i, arr) {
	    if (i !== 0) {
	      if (Array.isArray(row)) {
	        dataCol.push(row.reduce(function (acc, curr, index) {
	          acc[arr[0][index]] = curr;
	          return acc;
	        }, {}));
	      } else {
	        dataCol.push(_defineProperty({}, arr[0], row));
	      }
	    }
	    return dataCol;
	  }, []);
	}
	
	function groupByCategory(data, groupBy) {
	  return data.reduce(function (acc, curr) {
	    var category = curr[groupBy];
	
	    if (!acc[category]) acc[category] = [];
	    acc[category].push(curr);
	    return acc;
	  }, {});
	}
	
	function groupByCategories(data) {
	  var groups = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  var acc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	  if (!data.length) return [];
	
	  groups = groups.filter(function (ele) {
	    return ele in data[0];
	  });
	
	  if (!groups.length) return data;
	
	  var groupCopy = Object.assign([], groups);
	  var groupedData = groupByCategory(data, groupCopy.shift());
	  var groupedDataKeys = Object.keys(groupedData);
	  var children = groupedDataKeys.map(function (el) {
	    return groupedData[el];
	  });
	
	  for (var i = 0; i < children.length; i++) {
	    acc[groupedDataKeys[i]] = groupCopy.length ? {} : [];
	    acc[groupedDataKeys[i]] = groupByCategories(children[i], groupCopy, acc[groupedDataKeys[i]]);
	  }
	
	  return acc;
	}
	
	function createColumnHeaders(data) {
	  var cols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  var firstColumn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	
	  if (!cols.length) return { columnHeaders: [firstColumn], mapToHeader: 1 };
	
	  var groupedData = groupByCategories(data, cols);
	  var columnHeaders = [];
	  var mapToHeader = Object.assign({}, groupedData);
	  var mapPos = 1;
	
	  (function columnHeaderRecursion(data) {
	    var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	    var headerMap = arguments[2];
	
	    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || Array.isArray(data)) return 1;
	
	    var currKeys = Object.keys(data);
	    var reqLength = 0;
	
	    for (var i = 0; i < currKeys.length; i++) {
	      var currLength = columnHeaderRecursion(data[currKeys[i]], pos + 1, headerMap[currKeys[i]]);
	
	      if (Array.isArray(data[currKeys[i]])) {
	        headerMap[currKeys[i]] = mapPos;
	        mapPos += 1;
	      }
	      reqLength += currLength;
	      columnHeaders[pos] = !columnHeaders[pos] ? [firstColumn].concat(Array(currLength).fill(currKeys[i])) : columnHeaders[pos].concat(Array(currLength).fill(currKeys[i]));
	    }
	    return reqLength;
	  })(groupedData, 0, mapToHeader);
	
	  return {
	    columnHeaders: columnHeaders,
	    mapToHeader: mapToHeader
	  };
	}
	
	/**
	 * accumulator has two different signatures
	 * 1. it takes an array of objects, an accumulation category as a string
	 *  (like age), and supported accumulation type as a string (like count)
	 * 2. it takes an array of objects, a callback function (which operates
	 *  the same as reduce), and an initial value
	 */
	function accumulator(arr, accCat, accType, accValue) {
	  if (!accCat && typeof accType !== 'function') accType = 'count';else if (typeof accCat === 'function') {
	    accValue = accType || 0;
	    accType = accCat;
	  }
	
	  return arr.reduce(function (acc, curr, index, array) {
	    if (typeof accType === 'function') {
	      return accType(acc, typeof accCat === 'string' ? curr[accCat] : curr, index, array);
	    }
	    switch (accType) {
	      case 'sum':
	        {
	          acc += Number(curr[accCat]);
	          return acc;
	        }
	
	      case 'count':
	        {
	          acc += 1;
	          return acc;
	        }
	
	      default:
	        {
	          acc += 1;
	          return acc;
	        }
	    }
	  }, accValue || 0);
	}
	
	function checkPivotCategories(actualCats, selectedCats) {
	  var errMessage = [];
	
	  selectedCats.forEach(function (selectedCat) {
	    if (actualCats.indexOf(selectedCat) === -1) errMessage.push(selectedCat);
	  });
	  if (errMessage.length) {
	    throw new Error('Check that these selected pivot categories exist: ' + errMessage.join(','));
	  }
	}
	
	function tableCreator(data) {
	  var rows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	  var cols = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	  var accCatOrCB = arguments[3];
	  var accTypeOrInitVal = arguments[4];
	  var rowHeader = arguments[5];
	
	  data = fixDataFormat(data);
	  if (!data.length) return [];
	  checkPivotCategories(Object.keys(data[0]), rows);
	  checkPivotCategories(Object.keys(data[0]), cols);
	
	  if (typeof rowHeader === 'undefined') {
	    rowHeader = typeof accCatOrCB !== 'function' ? accTypeOrInitVal + ' ' + accCatOrCB : 'Custom Agg';
	  }
	
	  var columnData = createColumnHeaders(data, cols, rowHeader);
	  var columnHeaders = Array.isArray(columnData.columnHeaders[0]) ? columnData.columnHeaders : [columnData.columnHeaders.concat(rowHeader)];
	  var mapToHeader = columnData.mapToHeader;
	  var headerLength = columnHeaders[0].length;
	
	  var dataRows = [];
	  var rawData = [];
	  var prevKey = '';
	
	  function rowRecurse(rowGroups) {
	    var _loop = function _loop(key) {
	      if (Array.isArray(rowGroups[key])) {
	        recursedData = groupByCategories(rowGroups[key], cols);
	
	
	        (function recurseThroughMap(dataPos, map) {
	          if (Array.isArray(dataPos)) {
	            if (key === prevKey) {
	              var datum = dataRows[dataRows.length - 1];
	
	              datum[map] = accumulator(dataPos, accCatOrCB, accTypeOrInitVal);
	              dataRows[dataRows.length - 1] = datum;
	
	              var rawDataDatum = rawData[rawData.length - 1];
	
	              rawDataDatum[map] = dataPos;
	              rawData[rawData.length - 1] = rawDataDatum;
	            } else {
	              prevKey = key;
	              var _datum = [key].concat(Array(map - 1).fill(''), accumulator(dataPos, accCatOrCB, accTypeOrInitVal), Array(headerLength - (map + 1)).fill(''));
	              var _rawDataDatum = [key].concat(Array(map - 1).fill(''), [dataPos], Array(headerLength - (map + 1)).fill(''));
	
	              rawData.push(_rawDataDatum);
	              dataRows.push(_datum);
	            }
	          } else {
	            for (var innerKey in dataPos) {
	              recurseThroughMap(dataPos[innerKey], map[innerKey]);
	            }
	          }
	        })(recursedData, mapToHeader || 1);
	      } else {
	        dataRows.push([key].concat(Array(headerLength - 1).fill('')));
	        rowRecurse(rowGroups[key], key);
	      }
	    };
	
	    for (var key in rowGroups) {
	      var recursedData;
	
	      _loop(key);
	    }
	  }
	
	  if (rows.length || cols.length) {
	    rowRecurse(groupByCategories(data, rows.length ? rows : cols));
	  } else {
	    dataRows.push([rowHeader, accumulator(data, accCatOrCB, accTypeOrInitVal)]);
	    rawData = data;
	  }
	
	  return {
	    table: columnHeaders.concat(dataRows),
	    rawData: rawData
	  };
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=quick-pivot.js.map