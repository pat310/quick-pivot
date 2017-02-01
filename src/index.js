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
    this.collapsedRows = [];
  }

  update(data, rows, cols, agg, type, header) {
    this.originalData = tableCreator(data, rows, cols, agg, type, header);
  }

  collapse(rowNum) {
    this.collapsedRows.push(rowNum);
    this.currData = collapse(rowNum, this.currData);
  }

  expand(rowNum) {
    this.currData = expand(rowNum, this.currData);
  }

}
