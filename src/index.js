import { tableCreator } from './logic';

export default class Pivot {

  constructor(data, rows, cols, agg, type, header) {
    if (!data) {
      this.data = {};
    }else {
      this.data = tableCreator(data, rows, cols, agg, type, header);
    }
  }

  update(data, rows, cols, agg, type, header) {
    this.data = tableCreator(data, rows, cols, agg, type, header);
  }

}
