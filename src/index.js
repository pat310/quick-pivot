import tableCreator from './logic';
import { collapse, expand } from './progressiveDiscovery.js';

export default class Pivot {

  constructor(data, rows, cols, agg, type, header) {
    if (!data) {
      this.originalData = {};
    }else {
      this.originalData = tableCreator(data, rows, cols, agg, type, header);
    }

    this.currData = this.originalData;
    this.collapsedRows = {};
  }

  update(data, rows, cols, agg, type, header) {
    this.originalData = tableCreator(data, rows, cols, agg, type, header);
    this.currData = this.originalData;
  }

  collapse(rowNum) {
    let returnedData = collapse(rowNum, this.currData);

    this.collapsedRows[this.currData.table[rowNum].row] =
        returnedData.collapsed;
    this.currData = returnedData.dataToReturn;
    return this;
  }

  expand(rowNum) {
    this.currData = expand(
      rowNum,
      this.currData,
      this.collapsedRows[this.currData.table[rowNum].row],
    );
    delete this.collapsedRows[this.currData.table[rowNum].row];
    return this;
  }

  getData(rowNum) {
    if (this.collapsedRows[this.currData.table[rowNum].row]) {
      return this.collapsedRows[this.currData.table[rowNum].row].rawData;
    }

    return this.originalData.rawData[this.currData.table[rowNum].row];
  }

}
