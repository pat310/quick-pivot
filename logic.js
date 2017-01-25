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

function fixDataFormat(data){
 if(!Array.isArray(data) || !data.length) return [];
 else if(typeof data[0] === 'object' && !Array.isArray(data[0])) return data;
 else{
  return data.reduce((dataCol, row, i, arr) => {
   if(i !== 0){
    if(Array.isArray(row)){
     dataCol.push(row.reduce((acc, curr, index) =>{
      acc[arr[0][index]] = curr;
      return acc;
     }, {})); 
    }else{
     dataCol.push({[arr[0]]: row});
    }
   }
   return dataCol;
  },[]);
 }
}

function groupByCategory(data, groupBy){
  return data.reduce((acc, curr) =>{
    var category = curr[groupBy]
    if(!acc[category]) acc[category] = [];
    acc[category].push(curr);
    return acc;
  }, {});
}

function groupByCategories(data, groups = [], acc = {}){
  if(!data.length) return [];
  
  groups = groups.filter(ele =>{
    return ele in data[0];
  });
  
  if(!groups.length) return data;
  
  var groupCopy = assignObject([], groups);
  var groupedData = groupByCategory(data, groupCopy.shift());
  var groupedDataKeys = Object.keys(groupedData);
  var children = groupedDataKeys.map(el => {
    return groupedData[el];
  });
  for(let i = 0; i < children.length; i++){
    acc[groupedDataKeys[i]] = groupCopy.length ? {} : [];
    acc[groupedDataKeys[i]] = groupByCategories(children[i], groupCopy, acc[groupedDataKeys[i]]);
  }
  
  return acc;
}

function createColumnHeaders(data, cols = [], firstColumn = ''){
  if(!cols.length) return {columnHeaders: [firstColumn], mapToHeader: 1};
  
  var groupedData = groupByCategories(data, cols);
  var columnHeaders = [];
  var mapToHeader = assignObject({}, groupedData);
  var mapPos = 1;
  
  (function columnHeaderRecursion(data, pos = 0, headerMap){
    if(typeof data !== 'object' || Array.isArray(data)) return 1;
    else{
      var currKeys = Object.keys(data);
      var reqLength = 0;
      for(let i = 0; i < currKeys.length; i++){
        var currLength = columnHeaderRecursion(data[currKeys[i]], pos + 1, headerMap[currKeys[i]]);
        if(Array.isArray(data[currKeys[i]])){
          headerMap[currKeys[i]] = mapPos;
          mapPos += 1;
        }
        reqLength += currLength;
        columnHeaders[pos] = !columnHeaders[pos] ? [firstColumn].concat(arrayFill.call(Array(currLength), currKeys[i])) : columnHeaders[pos].concat(arrayFill.call(Array(currLength), currKeys[i]));
      }
      return reqLength;
    }
  })(groupedData, 0, mapToHeader);
  
  return {
    columnHeaders,
    mapToHeader
  };
}

//accumulator has two different signatures
//1. it takes an array of objects, an accumulation category as a string (like age), and supported accumulation type as a string (like count)
//2. it takes an array of objects, a callback function (which operates the same as reduce), and an initial value
function accumulator(arr, accCat, accType, accValue){
  if(!accCat && typeof accType !== 'function') accType = 'count';
  else if(typeof accCat === 'function'){
    accValue = accType || 0;
    accType = accCat;
  }
  
  return arr.reduce((acc, curr, index, array) => {
    if(typeof accType === 'function'){
      return accType(acc, typeof accCat === 'string' ? curr[accCat] : curr, index, array); 
    }
    switch(accType){
      case('sum'):{
        acc += Number(curr[accCat]);
        return acc;
      }
      
      case('count'):{
        acc += 1;
        return acc;
      }
      
      default:{
        acc += 1;
        return acc;
      }
    }
  }, accValue || 0);
}

function tableCreator(data, rows = [], cols = [], accCatOrCB, accTypeOrInitVal, rowHeader){
  data = fixDataFormat(data);
  if(typeof rowHeader === 'undefined') rowHeader = typeof accCatOrCB !== 'function' ? `${accTypeOrInitVal} ${accCatOrCB}` : 'Custom Agg';
  
  const columnData = createColumnHeaders(data, cols, rowHeader);
  const columnHeaders = Array.isArray(columnData.columnHeaders[0]) ? columnData.columnHeaders : [columnData.columnHeaders.concat(rowHeader)];
  const mapToHeader = columnData.mapToHeader;
  const headerLength = columnHeaders[0].length;
  
  var dataRows = [];
  var rawData = [];
  var prevKey = '';
  
  function rowRecurse(rowGroups){
    for(let key in rowGroups){
      if(Array.isArray(rowGroups[key])){
        var recursedData = groupByCategories(rowGroups[key], cols);
        
        (function recurseThroughMap(dataPos, map){
          if(Array.isArray(dataPos)){
            if(key === prevKey){
              let datum = dataRows[dataRows.length - 1];
              datum[map] =  accumulator(dataPos, accCatOrCB, accTypeOrInitVal);
              dataRows[dataRows.length - 1] = datum;

              let rawDataDatum = rawData[rawData.length - 1];
              rawDataDatum[map] = dataPos;
              rawData[rawData.length - 1] = rawDataDatum; 
            }else{
              prevKey = key;
              let datum = [key].concat(arrayFill.call(Array(map - 1), ''), accumulator(dataPos, accCatOrCB, accTypeOrInitVal), arrayFill.call(Array(headerLength - (map + 1)), ''));
              let rawDataDatum = [key].concat(arrayFill.call(Array(map - 1), ''), [dataPos], arrayFill.call(Array(headerLength - (map + 1)), ''));
              rawData.push(rawDataDatum);
              dataRows.push(datum);
            }
          }else{
            for(let innerKey in dataPos){
              recurseThroughMap(dataPos[innerKey], map[innerKey]);
            }
          }
        })(recursedData, mapToHeader || 1);

      }else{
        dataRows.push([key].concat(arrayFill.call(Array(headerLength - 1), '')));
        rowRecurse(rowGroups[key], key);
      }
    }
  }
  
  if(rows.length || cols.length) rowRecurse(groupByCategories(data, rows.length ? rows : cols));
  else{
    dataRows.push([rowHeader, accumulator(data, accCatOrCB, accTypeOrInitVal)]);
    rawData = data;
  }
  
  return {
    table: columnHeaders.concat(dataRows),
    rawData
  };
  
}

module.exports = {
  tableCreator,
  fixDataFormat,
  groupByCategory,
  groupByCategories,
  createColumnHeaders,
  accumulator
};
