'use strict';

function fixDataFormat(data) {
  if (!Array.isArray(data) || !data.length) return [];
  else if (typeof data[0] === 'object' && !Array.isArray(data[0])) return data;
  return data.reduce((dataCol, row, i, arr) => {
    if (i !== 0) {
      if (Array.isArray(row)) {
        dataCol.push(row.reduce((acc, curr, index) =>{
          acc[arr[0][index]] = curr;
          return acc;
        }, {}));
      } else {
        dataCol.push({[arr[0]]: row});
      }
    }
    return dataCol;
  }, []);
}

function groupByCategory(data, groupBy) {
  return data.reduce((acc, curr) =>{
    var category = curr[groupBy];

    if (!acc[category]) acc[category] = [];
    acc[category].push(curr);
    return acc;
  }, {});
}

function groupByCategories(data, groups = [], acc = {}) {
  if (!data.length) return [];

  groups = groups.filter(ele =>{
    return ele in data[0];
  });

  if (!groups.length) return data;

  var groupCopy = Object.assign([], groups);
  var groupedData = groupByCategory(data, groupCopy.shift());
  var groupedDataKeys = Object.keys(groupedData);
  var children = groupedDataKeys.map(el => {
    return groupedData[el];
  });

  for (let i = 0; i < children.length; i++) {
    acc[groupedDataKeys[i]] = groupCopy.length ? {} : [];
    acc[groupedDataKeys[i]] = groupByCategories(
        children[i], groupCopy, acc[groupedDataKeys[i]]);
  }

  return acc;
}

function createColumnHeaders(data, cols = [], firstColumn = '') {
  if (!cols.length) return {columnHeaders: [firstColumn], mapToHeader: 1};

  var groupedData = groupByCategories(data, cols);
  var columnHeaders = [];
  var mapToHeader = Object.assign({}, groupedData);
  var mapPos = 1;

  (function columnHeaderRecursion(data, pos = 0, headerMap) {
    if (typeof data !== 'object' || Array.isArray(data)) return 1;

    var currKeys = Object.keys(data);
    var reqLength = 0;

    for (let i = 0; i < currKeys.length; i++) {
      let currLength = columnHeaderRecursion(
          data[currKeys[i]], pos + 1, headerMap[currKeys[i]]);

      if (Array.isArray(data[currKeys[i]])) {
        headerMap[currKeys[i]] = mapPos;
        mapPos += 1;
      }
      reqLength += currLength;
      columnHeaders[pos] = !columnHeaders[pos] ?
          [firstColumn].concat(Array(currLength).fill(currKeys[i])) :
          columnHeaders[pos].concat(Array(currLength).fill(currKeys[i]));
    }
    return reqLength;

  })(groupedData, 0, mapToHeader);

  return {
    columnHeaders,
    mapToHeader,
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
  if (!accCat && typeof accType !== 'function') accType = 'count';
  else if (typeof accCat === 'function') {
    accValue = accType || 0;
    accType = accCat;
  }

  return arr.reduce((acc, curr, index, array) => {
    if (typeof accType === 'function') {
      return accType(acc, typeof accCat === 'string' ? curr[accCat] :
                                                       curr, index, array);
    }
    switch (accType) {
      case ('sum'): {
        acc += Number(curr[accCat]);
        return acc;
      }

      case ('count'): {
        acc += 1;
        return acc;
      }

      default: {
        acc += 1;
        return acc;
      }
    }
  }, accValue || 0);
}

function checkPivotCategories(actualCats, selectedCats) {
  var errMessage = [];

  selectedCats.forEach(selectedCat =>{
    if (actualCats.indexOf(selectedCat) === -1) errMessage.push(selectedCat);
  });
  if (errMessage.length) {
    throw new Error(
        `Check that these selected pivot categories exist: ${errMessage.join(
            ',')}`);
  }
}

export function tableCreator(
    data, rows = [], cols = [], accCatOrCB, accTypeOrInitVal, rowHeader) {
  data = fixDataFormat(data);
  if (!data.length) return [];
  checkPivotCategories(Object.keys(data[0]), rows);
  checkPivotCategories(Object.keys(data[0]), cols);

  if (typeof rowHeader === 'undefined') {
    rowHeader = typeof accCatOrCB !== 'function' ?
        `${accTypeOrInitVal} ${accCatOrCB}` :
        'Custom Agg';
  }

  const columnData = createColumnHeaders(data, cols, rowHeader);
  const columnHeaders = Array.isArray(columnData.columnHeaders[0]) ?
      columnData.columnHeaders :
      [columnData.columnHeaders.concat(rowHeader)];
  const mapToHeader = columnData.mapToHeader;
  const headerLength = columnHeaders[0].length;

  let dataRows = [];
  let rawData = [];
  let prevKey = '';

  function rowRecurse(rowGroups, depth) {
    for (let key in rowGroups) {
      if (Array.isArray(rowGroups[key])) {
        var recursedData = groupByCategories(rowGroups[key], cols);

        (function recurseThroughMap(dataPos, map) {
          if (Array.isArray(dataPos)) {
            console.log('data Depth', dataPos, depth);
            if (key === prevKey) {
              let datum = dataRows[dataRows.length - 1].value;

              datum[map] = accumulator(dataPos, accCatOrCB, accTypeOrInitVal);
              dataRows[dataRows.length - 1].value = datum;

              let rawDataDatum = rawData[rawData.length - 1].value;

              rawDataDatum[map] = dataPos;
              rawData[rawData.length - 1].value = rawDataDatum;
            } else {
              prevKey = key;
              let datum = [key].concat(
                  Array(map - 1).fill(''),
                  accumulator(dataPos, accCatOrCB, accTypeOrInitVal),
                  Array(headerLength - (map + 1)).fill(''));
              let rawDataDatum = [key].concat(
                Array(map - 1).fill(''),
                [dataPos],
                Array(headerLength - (map + 1)).fill(''));

              rawData.push({
                value: rawDataDatum,
                type: 'data',
                depth,
              });
              // rawData.push(rawDataDatum);
              dataRows.push({
                value: datum,
                type: 'data',
                depth,
              });
              // dataRows.push(datum);
            }
          } else {
            for (let innerKey in dataPos) {
              recurseThroughMap(dataPos[innerKey], map[innerKey]);
            }
          }
        })(recursedData, mapToHeader || 1);

      } else {
        console.log('header depth', key, depth)
        const value = [key].concat(Array(headerLength - 1).fill(''));

        dataRows.push({
          value,
          depth,
          type: 'header',
        });
        rawData.push({
          value,
          depth,
          type: 'header',
        });

        rowRecurse(rowGroups[key], depth + 1);
      }
    }
  }

  if (rows.length || cols.length) {
    rowRecurse(groupByCategories(data, rows.length ? rows : cols), 0);
  } else {
    dataRows.push([rowHeader, accumulator(data, accCatOrCB, accTypeOrInitVal)]);
    rawData = data;
  }

  return {
    table: columnHeaders.concat(dataRows),
    rawData,
  };

}
