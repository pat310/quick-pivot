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
  it('should collapse a header row when passed the index', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    pivot.collapse(5);

    const expectedTable = [
      {
        value: ['sum age', 'Stark', 'Baratheon', 'Lannister', 'aggregated'],
        depth: 0,
        type: 'colHeader',
        row: 0,
      },
      { value: ['f', 22, 38, '', ''],
        depth: 0,
        type: 'rowHeader',
        row: 1,
      },
      { value: ['Arya', 10, '', '', 10],
        type: 'data',
        depth: 1,
        row: 2,
      },
      { value: ['Cersei', '', 38, '', 38],
        type: 'data',
        depth: 1,
        row: 3,
      },
      { value: ['Sansa', 12, '', '', 12],
        type: 'data',
        depth: 1,
        row: 4,
      },
      { value: ['m', 22, 18, 133, ''],
        depth: 0,
        type: 'rowHeader',
        row: 5,
      },
      {
        type: 'aggregated',
        value: ['', 44, 56, 133, ''],
      },
    ];

    const expectedRawData = [
      { value: [ 'sum age', 'Stark', 'Baratheon', 'Lannister' ],
        depth: 0,
        type: 'colHeader',
        row: 0 },
      { value: [ 'f', 22, 38, '' ], depth: 0, type: 'rowHeader' },
      { value: [
        'Arya',
        [ { name: 'Arya', gender: 'f', house: 'Stark', age: 10 } ],
        '',
        '',
      ],
        type: 'data',
        depth: 1 },
      { value: [
        'Cersei',
        '',
        [ { name: 'Cersei', gender: 'f', house: 'Baratheon', age: 38 } ],
        '',
      ],
        type: 'data',
        depth: 1 },
      { value: [
        'Sansa',
        [ { name: 'Sansa', gender: 'f', house: 'Stark', age: 12 } ],
        '',
        '',
      ],
        type: 'data',
        depth: 1 },
      { value: [ 'm', 22, 18, 133 ], depth: 0, type: 'rowHeader' },
    ];

    expect(pivot.data.table).to.deep.equal(expectedTable);
    expect(pivot.data.rawData).to.deep.equal(expectedRawData);
  });

  it('should not collapse a data row', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    pivot.collapse(2);

    const expectedRow = {
      value: ['Arya', 10, '', '', 10],
      depth: 1,
      row: 2,
      type: 'data',
    };

    expect(pivot.data.table[2]).to.deep.equal(expectedRow);
  });

  it('should be able to chain to collapse multiple rows', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    pivot.collapse(1).collapse(2);
    const expectedTable = [
      {
        value: ['sum age', 'Stark', 'Baratheon', 'Lannister', 'aggregated'],
        depth: 0,
        type: 'colHeader',
        row: 0 },
      { value: ['f', 22, 38, '', ''],
        depth: 0,
        type: 'rowHeader',
        row: 1,
      },
      {
        value: ['m', 22, 18, 133, ''],
        depth: 0,
        type: 'rowHeader',
        row: 5,
      },
      {
        type: 'aggregated',
        value: ['', 44, 56, 133, ''],
      },
    ];

    expect(pivot.data.table).to.deep.equal(expectedTable);
  });

  it('should collapse to the same result regardless of order collapsed',
    () => {
      const pivot = new Pivot(
        dataArray,
        rowsToPivotTestOne,
        colsToPivotTestOne,
        aggregationCategory,
        aggregationType,
      );

      pivot.collapse(5).collapse(1);
      const expectedTable = [
        {
          value: ['sum age', 'Stark', 'Baratheon', 'Lannister', 'aggregated'],
          depth: 0,
          type: 'colHeader',
          row: 0 },
        { value: ['f', 22, 38, '', ''],
          depth: 0,
          type: 'rowHeader',
          row: 1,
        },
        {
          value: ['m', 22, 18, 133, ''],
          depth: 0,
          type: 'rowHeader',
          row: 5,
        },
        {
          type: 'aggregated',
          value: ['', 44, 56, 133, ''],
        },
      ];

      expect(pivot.data.table).to.deep.equal(expectedTable);
    });
};
