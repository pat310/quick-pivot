'use strict';

//polyfill for Object.assign
function assignObject(target, varArgs) { // .length of function is 2
  'use strict';
  if (target === null) { // TypeError if undefined or null
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var to = Object(target);

  for (var index = 1; index < arguments.length; index++) {
    var nextSource = arguments[index];

    if (nextSource !== null) { // Skip over if undefined or null
      for (var nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
}

// polyfill for Array.fill
function arrayFill(value) {

  // Steps 1-2.
  if (this === null) {
    throw new TypeError('this is null or not defined');
  }

  var O = Object(this);

  // Steps 3-5.
  var len = O.length >>> 0;

  // Steps 6-7.
  var start = arguments[1];
  var relativeStart = start >> 0;

  // Step 8.
  var k = relativeStart < 0 ?
    Math.max(len + relativeStart, 0) :
    Math.min(relativeStart, len);

  // Steps 9-10.
  var end = arguments[2];
  var relativeEnd = end === undefined ?
    len : end >> 0;

  // Step 11.
  var final = relativeEnd < 0 ?
    Math.max(len + relativeEnd, 0) :
    Math.min(relativeEnd, len);

  // Step 12.
  while (k < final) {
    O[k] = value;
    k++;
  }

  // Step 13.
  return O;
}

module.exports = {
  arrayFill: arrayFill,
  assignObject: assignObject
};
