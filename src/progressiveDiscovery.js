'use strict';

export function collapse(rowNum, data) {
  const selectedRow = data.table[rowNum];
  const {type, depth} = selectedRow;

  if (type !== 'rowHeader' && type !== 'colHeader') {
    return {
      uncollapsed: data,
    };
  }

  let count = rowNum + 1;
  let currDepth = data.table[count].depth;
  let uncollapsed = {
    table: data.table.slice(0, count),
    rawData: data.rawData.slice(0, count),
  };

  let collapsed = {
    table: [],
    rawData: [],
  };

  while (count < data.table.length && currDepth > depth) {
    collapsed.rawData.push(data.rawData[count]);
    collapsed.table.push(data.table[count]);
    count += 1;
    if (count < data.table.length) currDepth = data.table[count].depth;
  }

  uncollapsed.table = uncollapsed.table.concat(data.table.slice(count));
  uncollapsed.rawData = uncollapsed.rawData.concat(data.rawData.slice(count));

  return {
    uncollapsed,
    collapsed,
  };
}

export function expand(rowNum, currData, collapsedRows) {
  if (!collapsedRows) return currData;
  currData.table.splice(rowNum + 1, 0, ...collapsedRows.table);
  currData.rawData.splice(rowNum + 1, 0, ...collapsedRows.rawData);
  return currData;
}
