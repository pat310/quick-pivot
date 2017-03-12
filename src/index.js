import { tableCreator } from './logic';
import { collapse, expand } from './progressiveDiscovery.js';

export default class Pivot {

  constructor(data, rows, cols, agg, type, header) {
    if (!data) {
      this.originalData = {};
    }else {
      this.originalData = tableCreator(data, rows, cols, agg, type, header);
    }

    this.data = this.originalData;
    this.collapsedRows = {};
  }

  update(data, rows, cols, agg, type, header) {
    this.originalData = tableCreator(data, rows, cols, agg, type, header);
    this.data = this.originalData;
    return this;
  }

  collapse(rowNum) {
    let returnedData = collapse(rowNum, this.data);

    this.collapsedRows[this.data.table[rowNum].row] =
        returnedData.collapsed;
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

}
