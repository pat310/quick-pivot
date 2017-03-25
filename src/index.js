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
    if (this.uniqueValues[fieldName]) {
      return Object.keys(this.uniqueValues[fieldName]);
    }

    return [];
  }

  filter(fieldName, filterValues, filterType) {
    if ((typeof fieldName === 'function') ||
      (typeof fieldName === 'string' && Array.isArray(filterValues))) {
      const filteredData =
        filter(this.originalArgs.data, fieldName, filterValues, filterType);
      const {rows, cols, agg, type, header} = this.originalArgs;
      const collapsedRowKeys = Object.keys(this.collapsedRows).reverse();
      const collapsedRows = collapsedRowKeys.map((num) => {
        return this.originalData.table[num].value[0];
      });

      this.update(filteredData, rows, cols, agg, type, header, true);

      if (collapsedRows.length > 0) {
        let pointer = this.data.table.length - 1;

        collapsedRows.forEach((rowValue) => {
          while (pointer >= 0) {
            if ((this.data.table[pointer].type === 'rowHeader') &&
              (rowValue === this.data.table[pointer].value[0])) {
              this.collapse(pointer);
              break;
            }
            pointer -= 1;
          }
        });
      }
    }

    return this;
  }

}
