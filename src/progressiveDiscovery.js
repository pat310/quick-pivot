'use strict';

export function collapse(rowNum, data) {
  const selectedRow = data.table[rowNum];
  const {type, depth} = selectedRow;

  if (type !== 'rowHeader' && type !== 'colHeader') {
    return {
      dataToReturn: data,
    };
  }

  let count = rowNum + 1;
  let currDepth = data.table[count].depth;
  let dataToReturn = {
    table: data.table.slice(0, count),
    rawData: data.rawData.slice(0, count),
  };

  let collapsed = {
    table: [],
    rawData: [],
  };

  while (count < data.table.length - 1 && currDepth > depth) {
    collapsed.rawData.push(data.rawData[count]);
    collapsed.table.push(data.table[count]);
    count += 1;
    currDepth = data.table[count].depth;
  }
  dataToReturn.table = dataToReturn.table.concat(data.table.slice(count));
  dataToReturn.rawData = dataToReturn.rawData.concat(data.rawData.slice(count));

  return {
    dataToReturn,
    collapsed,
  };
}

export function expand(rowNum, currData, collapsedRows) {
  if (!collapsedRows) return currData;
  currData.table.splice(rowNum + 1, 0, ...collapsedRows.table);
  currData.rawData.splice(rowNum + 1, 0, ...collapsedRows.rawData);
  return currData;
}

// function progressiveDiscoveryAccumulator(arr, accCat, accType, accValue)