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
  { value: ['f', 22, 38, '', ''], type: 'rowHeader', depth: 0, row: 1 },
  { value: ['m', 22, 18, 133, ''], type: 'rowHeader', depth: 0, row: 5 },
  { value: ['Totals', 44, 56, 133, ''], type: 'aggregated' },
];
const expectedRawData = [
  { value: ['sum age', 'Stark', 'Baratheon', 'Lannister'], type: 'colHeader', depth: 0, row: 0 },
  { value: ['f', 22, 38, ''], type: 'rowHeader', depth: 0 },
  { value: ['m', 22, 18, 133], type: 'rowHeader', depth: 0 },
];

const create = () => new Pivot(
  dataArray,
  rowsToPivotTestOne,
  colsToPivotTestOne,
  aggregationCategory,
  aggregationType,
);

export default () => {
  it('should collapse all header rows', () => {
    const pivot = create();

    pivot.collapseAll();

    expect(pivot.data.table).to.deep.equal(expectedTable);
    expect(pivot.data.rawData).to.deep.equal(expectedRawData);
  });

  it('should not fail if called multiple times', () => {
    const pivot = create();

    pivot.collapseAll();
    pivot.collapseAll();

    expect(pivot.data.table).to.deep.equal(expectedTable);
    expect(pivot.data.rawData).to.deep.equal(expectedRawData);
  });

  it('should be chainable', () => {
    const pivot = create();

    const result = pivot.collapseAll();

    expect(result).to.equal(pivot);
  });
};
