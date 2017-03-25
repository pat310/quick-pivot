import { tableCreator, fixDataFormat } from './logic';
import { collapse, expand } from './progressiveDiscovery.js';
import { createUniqueValues } from './filtering.js';

export default class Pivot {

  constructor(data, rows, cols, agg, type, header) {
    if (!data) this.originalData = {};
    else {
      data = fixDataFormat(data);
      this.originalData = tableCreator(data, rows, cols, agg, type, header);
      this.uniqueValues = createUniqueValues(data);
    }

    this.data = this.originalData;
    this.collapsedRows = {};
  }

  update(data, rows, cols, agg, type, header) {
    data = fixDataFormat(data);
    this.originalData = tableCreator(data, rows, cols, agg, type, header);
    this.data = this.originalData;
    this.uniqueValues = createUniqueValues(data);

    return this;
  }

  collapse(rowNum) {
    const returnedData = collapse(rowNum, this.data);

    if (returnedData.collapsed) {
      this.collapsedRows[this.data.table[rowNum].row] = returnedData.collapsed;
    }
    this.data = returnedData.uncollapsed;

    return this;
  }

  expand(rowNum) {
    this.data = expand(
      rowNum,
      this.data,
      this.collapsedRows[this.data.table[rowNum].row],
    );
    delete this.collapsedRows[this.data.table[rowNum].row];

    return this;
  }

  toggle(rowNum) {
    if (this.data.table[rowNum].row in this.collapsedRows) {
      return this.expand(rowNum);
    }
    return this.collapse(rowNum);
  }

  getData(rowNum) {
    if (!this.data.table[rowNum]) return null;
    if (this.collapsedRows[this.data.table[rowNum].row]) {
      return this.collapsedRows[this.data.table[rowNum].row].rawData;
    }

    return this.originalData.rawData[this.data.table[rowNum].row];
  }

  getUniqueValues(fieldName) {
    return Object.keys(this.uniqueValues[fieldName]);
  }

}
