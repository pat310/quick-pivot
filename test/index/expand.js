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
const rowsToPivotTestTwo = ['name'];
const colsToPivotTestTwo = ['house', 'gender'];
const aggregationCategory = 'age';
const aggregationType = 'sum';

export default () => {
  it('should not expand a row that is not collapsed', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    pivot.expand(1);
    const uncollapsedData = {
      value: [ 'f', 22, 38, '' ],
      depth: 0,
      type: 'rowHeader',
    };

    expect(pivot.getData(1)).to.deep.equal(uncollapsedData);
  });

  it('should return table to normal state when completely expanded', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );
    const uncollapsedData = {
      value: [ 'f', 22, 38, '' ],
      depth: 0,
      type: 'rowHeader',
    };
    const startState = pivot.data.table;

    pivot.collapse(1).expand(1);

    expect(startState).to.deep.equal(pivot.data.table);
    expect(pivot.getData(1)).to.deep.equal(uncollapsedData);
  });

  it('should expand correct rows', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedTable = [
      { value: [ 'sum age', 'Stark', 'Baratheon', 'Lannister', 'aggregated' ],
        depth: 0,
        type: 'colHeader',
        row: 0 },
      { value: [ 'f', 22, 38, '', '' ],
        depth: 0,
        type: 'rowHeader',
        row: 1 },
      { value: [ 'Arya', 10, '', '', 10 ], type: 'data', depth: 1, row: 2 },
      { value: [ 'Cersei', '', 38, '', 38 ],
        type: 'data',
        depth: 1,
        row: 3 },
      { value: [ 'Sansa', 12, '', '', 12 ], type: 'data', depth: 1, row: 4 },
      { value: [ 'm', 22, 18, 133, '' ],
        depth: 0,
        type: 'rowHeader',
        row: 5 },
      {
        type: 'aggregated',
        value: ['', 44, 56, 133, ''],
      },
    ];

    const expectedCollapsedResult = [
      { value: [
        'Bran',
        [ { name: 'Bran', gender: 'm', house: 'Stark', age: 8 } ],
        '',
        '',
      ],
        type: 'data',
        depth: 1 },
      { value: [
        'Jaime',
        '',
        '',
        [ { name: 'Jaime', gender: 'm', house: 'Lannister', age: 32 } ],
      ],
        type: 'data',
        depth: 1 },
      { value: [
        'Joffrey',
        '',
        [ { name: 'Joffrey', gender: 'm', house: 'Baratheon', age: 18 } ],
        '',
      ],
        type: 'data',
        depth: 1 },
      { value: [
        'Jon',
        [ { name: 'Jon', gender: 'm', house: 'Stark', age: 14 } ],
        '',
        '',
      ],
        type: 'data',
        depth: 1 },
      { value: [
        'Tyrion',
        '',
        '',
        [ { name: 'Tyrion', gender: 'm', house: 'Lannister', age: 34 } ],
      ],
        type: 'data',
        depth: 1 },
      { value: [
        'Tywin',
        '',
        '',
        [ { name: 'Tywin', gender: 'm', house: 'Lannister', age: 67 } ],
      ],
        type: 'data',
        depth: 1 },
    ];

    pivot.collapse(1).collapse(2).expand(1);

    expect(pivot.data.table).to.deep.equal(expectedTable);
    expect(pivot.getData(5)).to.deep.equal(expectedCollapsedResult);
  });

  it('should return null if row does not exist', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    pivot.collapse(1).collapse(2).expand(1);
    expect(pivot.getData(9)).to.be.null;
  });

  it('should pivot correctly provided multiple columns to pivot', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestTwo,
      colsToPivotTestTwo,
      aggregationCategory,
      aggregationType,
    );

    const expectedTable = [
      {
        value:
        [ 'sum age',
          'Stark',
          'Stark',
          'Baratheon',
          'Baratheon',
          'Lannister',
          'aggregated',
        ],
        depth: 0,
        type: 'colHeader',
        row: 0,
      },
      {
        value: [ 'sum age', 'f', 'm', 'f', 'm', 'm', '' ],
        depth: 1,
        type: 'colHeader',
        row: 1,
      },
      {
        value: [ 'Arya', 10, '', '', '', '', 10 ],
        type: 'data',
        depth: 0,
        row: 2,
      },
      {
        value: [ 'Bran', '', 8, '', '', '', 8 ],
        type: 'data',
        depth: 0,
        row: 3,
      },
      {
        value: [ 'Cersei', '', '', 38, '', '', 38 ],
        type: 'data',
        depth: 0,
        row: 4,
      },
      {
        value: [ 'Jaime', '', '', '', '', 32, 32 ],
        type: 'data',
        depth: 0,
        row: 5,
      },
      {
        value: [ 'Joffrey', '', '', '', 18, '', 18 ],
        type: 'data',
        depth: 0,
        row: 6,
      },
      {
        value: [ 'Jon', '', 14, '', '', '', 14],
        type: 'data',
        depth: 0,
        row: 7,
      },
      {
        value: [ 'Sansa', 12, '', '', '', '', 12],
        type: 'data',
        depth: 0,
        row: 8,
      },
      {
        value: [ 'Tyrion', '', '', '', '', 34, 34],
        type: 'data',
        depth: 0,
        row: 9,
      },
      {
        value: [ 'Tywin', '', '', '', '', 67, 67],
        type: 'data',
        depth: 0,
        row: 10,
      },
      {
        type: 'aggregated',
        value: ['', 22, 22, 38, 18, 133, ''],
      },
    ];

    expect(pivot.data.table).to.deep.equal(expectedTable);
  });
};
