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

const expectedTable = [
  { value: ['sum age', 'Stark', 'Baratheon', 'Lannister', 'Totals'], type: 'colHeader', depth: 0, row: 0 },
  { value: ['f', 22, 38, '', ''], depth: 0, type: 'rowHeader',  row: 1 },
  { value: ['Arya', 10, '', '', 10], type: 'data', depth: 1, row: 2 },
  { value: ['Cersei', '', 38, '', 38], type: 'data', depth: 1, row: 3 },
  { value: ['Sansa', 12, '', '', 12], type: 'data', depth: 1, row: 4 },
  { value: ['m', 22, 18, 133, ''], depth: 0, type: 'rowHeader', row: 5 },
  { value: ['Bran', 8, '', '', 8], type: 'data', depth: 1, row: 6 },
  { value: ['Jaime', '', '', 32, 32], type: 'data', depth: 1, row: 7 },
  { value: ['Joffrey', '', 18, '', 18], type: 'data', depth: 1, row: 8 },
  { value: ['Jon', 14, '', '', 14], type: 'data', depth: 1, row: 9 },
  { value: ['Tyrion', '', '', 34, 34], type: 'data', depth: 1, row: 10 },
  { value: ['Tywin', '', '', 67, 67], type: 'data', depth: 1, row: 11 },
  { value: ['Totals', 44, 56, 133, ''], type: 'aggregated' },
];
const expectedRawData = [
  { value: ['sum age', 'Stark', 'Baratheon', 'Lannister'], type: 'colHeader', depth: 0, row: 0 },
  { value: ['f', 22, 38, ''], type: 'rowHeader', depth: 0 },
  { value: ['Arya', [{ name: 'Arya', gender: 'f', house: 'Stark', age: 10 }], '', ''], type: 'data', depth: 1 },
  { value: ['Cersei', '', [{ name: 'Cersei', gender: 'f', house: 'Baratheon', age: 38 }], ''], type: 'data', depth: 1 },
  { value: ['Sansa', [{ name: 'Sansa', gender: 'f', house: 'Stark', age: 12 }], '', ''], type: 'data', depth: 1 },
  { value: ['m', 22, 18, 133], type: 'rowHeader', depth: 0 },
  { value: ['Bran', [{ name: 'Bran', gender: 'm', house: 'Stark', age: 8 }], '', ''], type: 'data', depth: 1 },
  { value: ['Jaime', '', '', [{ name: 'Jaime', gender: 'm', house: 'Lannister', age: 32 }]], type: 'data', depth: 1 },
  { value: ['Joffrey', '', [{ name: 'Joffrey', gender: 'm', house: 'Baratheon', age: 18 }], ''], type: 'data', depth: 1 },
  { value: ['Jon', [{ name: 'Jon', gender: 'm', house: 'Stark', age: 14 }], '', ''], type: 'data', depth: 1 },
  { value: ['Tyrion', '', '', [{ name: 'Tyrion', gender: 'm', house: 'Lannister', age: 34 }]], type: 'data', depth: 1 },
  { value: ['Tywin', '', '', [{ name: 'Tywin', gender: 'm', house: 'Lannister', age: 67 }]], type: 'data', depth: 1 },
];

const create = () => new Pivot(
  dataArray,
  rowsToPivotTestOne,
  colsToPivotTestOne,
  aggregationCategory,
  aggregationType,
);

export default () => {
  it('should expand all header rows', () => {
    const pivot = create();
    pivot.collapseAll();

    pivot.expandAll();

    expect(pivot.data.table).to.deep.equal(expectedTable);
    expect(pivot.data.rawData).to.deep.equal(expectedRawData);
  });

  it('should not fail if called multiple times', () => {
    const pivot = create();
    pivot.collapse(5).collapse(1);

    pivot.expandAll();
    pivot.expandAll();

    expect(pivot.data.table).to.deep.equal(expectedTable);
    expect(pivot.data.rawData).to.deep.equal(expectedRawData);
  });

  it('should be chainable', () => {
    const pivot = create();

    const result = pivot.expandAll();

    expect(result).to.equal(pivot);
  });
};
