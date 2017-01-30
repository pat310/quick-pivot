import { tableCreator } from './logic';

export default class Pivot {

  constructor(data, rows, cols, agg, type, header) {
    this.rows = rows;
    this.cols = cols;
    this.agg = agg;
    this.type = type;
    this.header = header;
    this.data = tableCreator(data, rows, cols, agg, type, header);
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = tableCreator(
        data, this.rows, this.cols, this.agg, this.type, this.header);
  }

}
