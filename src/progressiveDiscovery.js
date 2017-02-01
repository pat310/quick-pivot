'use strict';

export function collapse(rowNum, data) {
  const selectedRow = data.table[rowNum];
  const {type, depth} = selectedRow;

  if (type !== 'rowHeader' || type !== 'colHeader') {
    return data;
  }

  let count = rowNum + 1;
  let currDepth = depth;
  let dataToReturn = {
    table: data.slice(0, count),
    rawData: data.slice(0, count),
  };

  while (count < data.table.length || currDepth <= depth) {
    count += 1;
    currDepth = data.table[count].depth;
  }

  dataToReturn.table.concat(data.slice(count));
  dataToReturn.rawData.concat(data.slice(count));

  return dataToReturn;
}

export function expand(rowNum, data) {

}
