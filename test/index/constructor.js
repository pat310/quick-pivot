import { expect } from 'chai';
import Pivot from '../../src';

const dataArray = [
 ['name', 'gender', 'house', 'age'],
 ['Jon', 'm', 'Stark', 14],
 ['Arya', 'f', 'Stark', 10],
 ['Cersei', 'f', 'Baratheon', 38],
 ['Tywin', 'm', 'Lannister', 67],
 ['Tyrion', 'm', 'Lannister', 34],
 ['Joffrey', 'm', 'Baratheon', 18],
 ['Bran', 'm', 'Stark', 8],
 ['Jaime', 'm', 'Lannister', 32],
 ['Sansa', 'f', 'Stark', 12],
];
const rowsToPivotTestOne = ['gender', 'name'];
const colsToPivotTestOne = ['house'];
const aggregationCategory = 'age';
const aggregationType = 'sum';

export default () => {
  it('should create an empty pivot when instantiated without params', () => {
    const pivot = new Pivot();

    expect(pivot.data).to.deep.equal({});
  });

  it('should create a pivot when passed data', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    expect(pivot.data.table).to.have.length.above(0);
  });

  it('should create a pivot with sorted columns when passed data', () => {
    const expected = [
      { value: [ 'sum age', 'Baratheon', 'Lannister', 'Stark', 'Totals' ],
        depth: 0,
        type: 'colHeader',
        row: 0,
      },
      { value: [ 'f', 38, '', 22, '' ], depth: 0, type: 'rowHeader', row: 1 },
      { value: [ 'Arya', '', '', 10, 10 ], type: 'data', depth: 1, row: 2 },
      { value: [ 'Cersei', 38, '', '', 38 ], type: 'data', depth: 1, row: 3 },
      { value: [ 'Sansa', '', '', 12, 12 ], type: 'data', depth: 1, row: 4 },
      { value: [ 'm', 18, 133, 22, '' ], depth: 0, type: 'rowHeader', row: 5 },
      { value: [ 'Bran', '', '', 8, 8 ], type: 'data', depth: 1, row: 6 },
      { value: [ 'Jaime', '', 32, '', 32 ], type: 'data', depth: 1, row: 7 },
      { value: [ 'Joffrey', 18, '', '', 18 ], type: 'data', depth: 1, row: 8 },
      { value: [ 'Jon', '', '', 14, 14 ], type: 'data', depth: 1, row: 9 },
      { value: [ 'Tyrion', '', 34, '', 34 ], type: 'data', depth: 1, row: 10 },
      { value: [ 'Tywin', '', 67, '', 67 ], type: 'data', depth: 1, row: 11 },
      { type: 'aggregated', value: ['Totals', 56, 133, 44, ''] },
    ];

    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
      undefined,
      undefined,
      (data, cols, pos) => (a, b) => a < b ? -1 : 1
    );

    expect(pivot.data.table).to.deep.equal(expected);
  });

  it('should create a pivot with reverse sorted columns when passed data',
    () => {
    const expected = [
      { value: [ 'sum age', 'Stark', 'Lannister', 'Baratheon', 'Totals' ],
        depth: 0,
        type: 'colHeader',
        row: 0,
      },
      { value: [ 'f', 22, '', 38, '' ], depth: 0, type: 'rowHeader', row: 1 },
      { value: [ 'Arya', 10, '', '', 10 ], type: 'data', depth: 1, row: 2 },
      { value: [ 'Cersei', '', '', 38, 38 ], type: 'data', depth: 1, row: 3 },
      { value: [ 'Sansa', 12, '', '', 12 ], type: 'data', depth: 1, row: 4 },
      { value: [ 'm', 22, 133, 18, '' ], depth: 0, type: 'rowHeader', row: 5 },
      { value: [ 'Bran', 8, '', '', 8 ], type: 'data', depth: 1, row: 6 },
      { value: [ 'Jaime', '', 32, '', 32 ], type: 'data', depth: 1, row: 7 },
      { value: [ 'Joffrey', '', '', 18, 18 ], type: 'data', depth: 1, row: 8 },
      { value: [ 'Jon', 14, '', '', 14 ], type: 'data', depth: 1, row: 9 },
      { value: [ 'Tyrion', '', 34, '', 34 ], type: 'data', depth: 1, row: 10 },
      { value: [ 'Tywin', '', 67, '', 67 ], type: 'data', depth: 1, row: 11 },
      { type: 'aggregated', value: ['Totals', 44, 133, 56, ''] },
    ];

    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
      undefined,
      undefined,
      (data, cols, pos) => (a, b) => a < b ? 1 : -1
    );

    expect(pivot.data.table).to.deep.equal(expected);
  });
};
