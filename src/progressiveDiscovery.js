/**
 * @file Utility functions for collapsing and expanding functionality
*/

/**
 * Collapse a row given a row number and the data
 * @param {number} rowNum
 * @param {Array<Object>} data
 * @returns {Object}
*/
export function collapse(rowNum, data) {
  /** get the current row, row type, and row depth */
  const selectedRow = data.table[rowNum];
  const {type, depth} = selectedRow;

  /** if row is not a header, it is not collapsable*/
  if (type !== 'rowHeader' && type !== 'colHeader') {
    return {
      uncollapsed: data,
    };
  }

  let count = rowNum + 1;
  let currDepth = data.table[count].depth;

  /** any row above the row to collapse (including the row itself) can not collapse into the row */
  const uncollapsed = {
    table: data.table.slice(0, count),
    rawData: data.rawData.slice(0, count),
  };

  const collapsed = {
    table: [],
    rawData: [],
  };

  /**
   * while count is less than the number of rows
   * or while the current row is deeper than the row we are collapsing into
  */
  while (count < data.table.length && currDepth > depth) {
    /** roll data in collapsed state and advance pointer */
    collapsed.rawData.push(data.rawData[count]);
    collapsed.table.push(data.table[count]);
    count += 1;
    /** update the current depth */
    if (count < data.table.length) currDepth = data.table[count].depth;
  }

  /** remaining rows are not collapsed */
  uncollapsed.table = uncollapsed.table.concat(data.table.slice(count));
  uncollapsed.rawData = uncollapsed.rawData.concat(data.rawData.slice(count));

  return {
    uncollapsed,
    collapsed,
  };
}

/**
 * Expand a row given a row number, the current data, and the current collapsed rows
 * @param {number} rowNum
 * @param {Array<Object>} currData
 * @param {Object} collapsedRows
 * @returns {Object}
*/
export function expand(rowNum, currData, collapsedRows) {
  /** if there are no collapsed rows, then just return data */
  if (!collapsedRows) return currData;

  /** splicing the collapsed rows back onto the data table */
  currData.table.splice(rowNum + 1, 0, ...collapsedRows.table);
  currData.rawData.splice(rowNum + 1, 0, ...collapsedRows.rawData);

  return currData;
}
