/**
 * @file Contains logic to actually pivot data
*/

/**
 * @description Format data into an array of objects where the headers are the keys
 * @param {!Array|Object} data Array of arrays or an object
 * @returns {Array<Object>} Formatted object
*/
export function fixDataFormat(data, rows = []) {
  if (!Array.isArray(data) || !data.length) return [];

  let formattedData = [];

  if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
    formattedData = data;
  } else {
    formattedData = data.reduce((dataCol, row, i, arr) => {
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

  // sorting data initially to prevent changes in data ordering
  if (rows.length > 0) {
    return rows.reduceRight((acc, row) => {
      return acc.sort((a, b) => {
        return a[row] > b[row];
      });
    }, formattedData);
  }

  return formattedData.sort((a, b) => {
    return JSON.stringify(a) > JSON.stringify(b);
  });
}

/**
 * @description Groups the data into an object by the provided category
 * @param {!Array<Object>} data Array of objects
 * @param {string} groupBy Category to group by
 * @returns {Object} Each key in the object is one the category groups
*/
export function groupByCategory(data, groupBy) {
  return data.reduce((acc, curr) =>{
    const category = curr[groupBy];

    if (!acc[category]) acc[category] = [];
    acc[category].push(curr);
    return acc;
  }, {});
}

/**
 * @description Performs groupByCategory recursively (nesting objects within objects)
 * @param {!Array<Object>} data Array of objects
 * @param {Array} groups Items to categorize by
 * @param {Object} acc The accumulated results
 * @returns {Object} Deeply nested object
 * where each key is one the category groups
*/
export function groupByCategories(data, groups = [], acc = {}) {
  /**
   * base case - if data is empty
   * or if there are no more groups to group by
   * return result
  */
  if (data.length === 0 || groups.length === 0) return data;

  const groupedData = groupByCategory(data, groups[0]);
  const groupedDataKeys = Object.keys(groupedData);
  const children = Object.values(groupedData);

  for (let i = 0; i < children.length; i++) {
    acc[groupedDataKeys[i]] = groupByCategories(
        children[i], groups.slice(1), acc[groupedDataKeys[i]]);
  }

  return acc;
}

/**
 * @description Builds the column headers and a map to each header
 * @param {!Array<Object>} data Array of objects
 * @param {Array} cols Columns to pivot on
 * @param {string} firstColumn A string to place in the first column header
 * @returns {Object} columnHeaders (array of arrays) and mapToHeader (object)
*/
export function createColumnHeaders(data, cols = [], firstColumn = '') {
  if (cols.length === 0) {
    return {
      columnHeaders: [firstColumn],
      mapToHeader: null,
    };
  }

  const mapToHeader = groupByCategories(data, cols);
  const columnHeaders = [];
  let mapPos = 1;

  (function columnHeaderRecursion(data, pos = 0, headerMap) {
    /** base case - at actual data as opposed to another grouping */
    if (typeof data !== 'object' || Array.isArray(data)) return 1;

    const currKeys = Object.keys(data);
    let sumLength = 0;

    for (let i = 0; i < currKeys.length; i++) {
      const currLength = columnHeaderRecursion(
          data[currKeys[i]], pos + 1, headerMap[currKeys[i]]);

      if (Array.isArray(data[currKeys[i]])) {
        headerMap[currKeys[i]] = mapPos;
        mapPos += 1;
      }

      columnHeaders[pos] = typeof columnHeaders[pos] === 'undefined' ?
        [firstColumn].concat(Array(currLength).fill(currKeys[i])) :
        columnHeaders[pos].concat(Array(currLength).fill(currKeys[i]));

      sumLength += currLength;
    }

    return sumLength;

  }(mapToHeader, 0, mapToHeader));

  return {
    columnHeaders,
    mapToHeader,
  };
}

/**
 * @description Reduces an array of values to a result
 * @param {!Array} arr The array to reduce
 * @param {?requestCallback|string} accCat Callback, category to reduce, or null
 * @param {string} accType Reduce type (count, average, min, max, etc) or initial value
 * @param {*} accValue Initial value - string, number, array, or object
 * @returns {*} Reduced value
 * @todo Move accumulator to its own file since it will continue to grow
*/
export function accumulator(arr, accCat, accType, accValue) {
  if (typeof accCat === 'undefined') accType = 'count';
  else if (typeof accCat === 'function') accValue = accType || 0;

  return arr.reduce((acc, curr, index, array) => {
    if (typeof accCat === 'function') return accCat(acc, curr, index, array);

    switch (accType) {
      case ('average'): {
        acc += Number(curr[accCat]) / arr.length;

        return acc;
      }

      case ('count'): {
        acc += 1;

        return acc;
      }

      case ('min'): {
        if (index === 0) acc = Number(curr[accCat]);
        else if (curr[accCat] < acc) acc = Number(curr[accCat]);

        return acc;
      }

      case ('max'): {
        if (index === 0) acc = Number(curr[accCat]);
        else if (curr[accCat] > acc) acc = Number(curr[accCat]);

        return acc;
      }

      case ('sum'): {
        acc += Number(curr[accCat]);

        return acc;
      }

      default: {
        acc += 1;

        return acc;
      }
    }
  }, accValue || 0);
}

/**
 * @description Check that categories to pivot on actually exist
 * @param {!Object} actualCats Categories that actually exist in the data
 * @param {!Array<string>} selectedCats Categories to pivot selected by user
 * @throws Will throw an error if the category does not exist
*/
export function checkPivotCategories(actualCats, selectedCats) {
  const errMessage = selectedCats.filter((selectedCat) => {
    return !(selectedCat in actualCats);
  });

  if (errMessage.length > 0) {
    throw new Error('Check that these selected pivot categories exist: ' +
      errMessage.join(', '));
  }
}

export function tableCreator(data, rows = [], cols = [], accCatOrCB,
  accTypeOrInitVal, rowHeader) {

  /** if data is empty, return empty array */
  if (data.length === 0) {
    return {
      rawData: [],
      table: [],
    };
  };

  /** if rows/cols are not arrays, return throw an error */
  if (!Array.isArray(rows) || !Array.isArray(cols)) {
    throw new Error('rowsToPivot and colsToPivot must be of type array');
  }

  checkPivotCategories(data[0], rows);
  checkPivotCategories(data[0], cols);

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
  const formattedColumnHeaders = columnHeaders.map((value, depth) => {
    return {
      value,
      depth,
      type: 'colHeader',
      row: depth,
    };
  });

  let dataRows = [];
  let rawData = [];
  let prevKey = null;

  function rowRecurse(rowGroups, depth, rowHeaders = []) {
    for (const key in rowGroups) {
      if (Array.isArray(rowGroups[key])) {
        const recursedData = groupByCategories(rowGroups[key], cols);

        prevKey = null;

        (function recurseThroughMap(dataPos, map) {
          if (Array.isArray(dataPos)) {
            if (key === prevKey) {
              const datum = dataRows[dataRows.length - 1].value;

              datum[map] = accumulator(dataPos, accCatOrCB, accTypeOrInitVal);
              dataRows[dataRows.length - 1].value = datum;

              const rawDataDatum = rawData[rawData.length - 1].value;

              rawDataDatum[map] = dataPos;
              rawData[rawData.length - 1].value = rawDataDatum;
            } else {
              prevKey = key;
              const datum = [key].concat(
                Array(map - 1).fill(''),
                accumulator(dataPos, accCatOrCB, accTypeOrInitVal),
                Array(headerLength - (map + 1)).fill('')
              );
              const rawDataDatum = [key].concat(
                Array(map - 1).fill(''),
                [dataPos],
                Array(headerLength - (map + 1)).fill('')
              );

              rawData.push({
                value: rawDataDatum,
                type: 'data',
                depth,
              });
              dataRows.push({
                value: datum,
                type: 'data',
                depth,
                row: dataRows.length + formattedColumnHeaders.length,
              });
            }
          } else {
            for (const innerKey in dataPos) {
              recurseThroughMap(dataPos[innerKey], map[innerKey]);
            }
          }
        })(recursedData, mapToHeader || 1);

      } else {
        const rowHeaderValue = rowHeaders.shift();
        const value = rowHeaderValue ?
            rowHeaderValue.value :
            [key].concat(Array(headerLength - 1).fill(''));

        dataRows.push({
          value,
          depth,
          type: 'rowHeader',
          row: dataRows.length + formattedColumnHeaders.length,
        });
        rawData.push({
          value,
          depth,
          type: 'rowHeader',
        });

        rowRecurse(rowGroups[key], depth + 1, rowHeaders);
      }
    }
  }

  let dataGroups = [];

  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      // possible memoization opportunity
      rowRecurse(groupByCategories(data, rows.slice(0, i + 1)), 0, dataGroups);
      dataGroups = Object.assign([], dataRows);
      if (i + 1 < rows.length) {
        dataRows = [];
        rawData = [];
        prevKey = null;
      }
    }
  } else if (cols.length > 0) {
    for (let i = 0; i < cols.length; i++) {
      rowRecurse(groupByCategories(data, cols.slice(0, i + 1)), 0, dataGroups);
      dataGroups = Object.assign([], dataRows);
      if (i + 1 < cols.length) {
        dataRows = [];
        rawData = [];
        prevKey = null;
      }
    }
  } else {
    dataRows.push({
      value: [rowHeader, accumulator(data, accCatOrCB, accTypeOrInitVal)],
      type: 'data',
      row: 1,
      depth: 0,
    });
    rawData = data.map((value) => {
      return {
        value,
        type: 0,
        row: 1,
        depth: 0,
      };
    });
  }

  function tableRowAggregator(rows) {
    const filteredRows = rows.reduce((acc, { type, value }) => {
      if (acc.length === 0) {
        acc = Array(value.length).fill([]);
      }

      if (type === 'data') {
        value.forEach((valueElem, i) => {
          if (Array.isArray(valueElem)) {
            acc[i] = acc[i].concat(valueElem);
          }
        });
      }

      return acc;
    }, []);

    return filteredRows.map((accumulatedRawData) => {
      if (accumulatedRawData.length > 0) {
        return accumulator(accumulatedRawData, accCatOrCB, accTypeOrInitVal);
      }

      return '';
    });
  }

  function tableColumnAggregator(rows) {
    const filteredRows = rows.reduce((acc, { type, value }) => {
      if (type === 'data') {
        const i = acc.length;

        acc[i] = [];
        value.forEach((valueElem) => {
          if (Array.isArray(valueElem)) {
            acc[i] = acc[i].concat(valueElem);
          }
        });
      } else if (type === 0) {
        // TODO: Investigate why type is coming up as 0
        // happens when aggregating [] for rows and [] for cols
        acc.push(value);
      }

      return acc;
    }, []);

    return filteredRows.map((accumulatedRawData) => {
      if (accumulatedRawData.length > 0) {
        return accumulator(accumulatedRawData, accCatOrCB, accTypeOrInitVal);
      }

      return '';
    });
  }

  const columnAggregations = tableColumnAggregator(rawData);
  const accumulatedRows = {
    value: tableRowAggregator(rawData),
    type: 'aggregated',
  };

  const colHeadersValueCopies = formattedColumnHeaders.map(({ value }) => {
    return Object.assign([], value);
  });
  const colHeadersCopy = formattedColumnHeaders.map((colHeaderObj, i) => {
    const copy = Object.assign({}, colHeaderObj);

    copy.value = colHeadersValueCopies[i];
    return copy;
  });

  let counter = 0;
  const table = colHeadersCopy.concat(dataRows, accumulatedRows)
    .map((tableRow, i) => {
      if (tableRow.type === 'data') {
        tableRow.value = tableRow.value.concat(columnAggregations[counter]);
        counter += 1;
      } else {
        tableRow.value = tableRow.value.concat(i === 0 ? 'aggregated' : '');
      }

      return tableRow;
    });

  return {
    table,
    rawData: formattedColumnHeaders.concat(rawData),
  };
}
