import { tableCreator, fixDataFormat } from './logic';
import { collapse, expand } from './progressiveDiscovery.js';
import { createUniqueValues, filter } from './filtering.js';

export default class Pivot {

  constructor(data, rows, cols, agg, type, header) {
    if (!data) this.originalData = {};
    else {
      data = fixDataFormat(data);
      this.originalArgs = {data, rows, cols, agg, type, header};
      this.originalData = tableCreator(data, rows, cols, agg, type, header);
      this.uniqueValues = createUniqueValues(data);
    }

    this.data = this.originalData;
    this.collapsedRows = {};
  }

  update(data, rows, cols, agg, type, header, isFiltering) {
    data = fixDataFormat(data);
    if (!isFiltering) this.originalArgs = {data, rows, cols, agg, type, header};
    this.originalData = tableCreator(data, rows, cols, agg, type, header);
    this.data = this.originalData;
    this.uniqueValues = createUniqueValues(data);
    this.collapsedRows = {};

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

  filter(fieldName, filterValues, filterType) {
    const filteredData =
      filter(this.originalArgs.data, fieldName, filterValues, filterType);
    const {rows, cols, agg, type, header} = this.originalArgs;

    this.update(filteredData, rows, cols, agg, type, header, true);

    return this;
  }

}
