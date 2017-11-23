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
const rowsToPivotTestOne = ['house', 'gender', 'name'];
const colsToPivotTestOne = [];
const aggregationCategory = 'age';
const aggregationType = 'sum';

export default () => {
  it('should return an unmodified pivot if parameters are wrong type', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );
    const originalTable = [...pivot.data.table];

    pivot.filter(['house', 'name'], ['Stark', 'Jon', 'Sanza']);
    expect(pivot.data.table).to.deep.equal(originalTable);
  });

  it('should take a fieldName string, filterValues array, filterType', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedResult = [
      {
        value: [ 'sum age', 'sum age', 'aggregated' ],
        depth: 0,
        type: 'colHeader',
        row: 0,
      },
      { value: [ 'Baratheon', 56, '' ], depth: 0, type: 'rowHeader', row: 1 },
      { value: [ 'f', 38, '' ], depth: 1, type: 'rowHeader', row: 2 },
      { value: [ 'Cersei', 38, 38 ], type: 'data', depth: 2, row: 3 },
      { value: [ 'm', 18, '' ], depth: 1, type: 'rowHeader', row: 4 },
      { value: [ 'Joffrey', 18, 18 ], type: 'data', depth: 2, row: 5 },
      { value: [ 'Lannister', 133, '' ], depth: 0, type: 'rowHeader', row: 6 },
      { value: [ 'm', 133, '' ], depth: 1, type: 'rowHeader', row: 7 },
      { value: [ 'Jaime', 32, 32 ], type: 'data', depth: 2, row: 8 },
      { value: [ 'Tyrion', 34, 34 ], type: 'data', depth: 2, row: 9 },
      { value: [ 'Tywin', 67, 67 ], type: 'data', depth: 2, row: 10 },
      { value: [ 'Stark', 30, '' ], depth: 0, type: 'rowHeader', row: 11 },
      { value: [ 'f', 22, '' ], depth: 1, type: 'rowHeader', row: 12 },
      { value: [ 'Arya', 10, 10 ], type: 'data', depth: 2, row: 13 },
      { value: [ 'Sansa', 12, 12 ], type: 'data', depth: 2, row: 14 },
      { value: [ 'm', 8, '' ], depth: 1, type: 'rowHeader', row: 15 },
      { value: [ 'Bran', 8, 8 ], type: 'data', depth: 2, row: 16 },
      { type: 'aggregated', value: ['', 219, ''] },
    ];

    pivot.filter('name', ['Jon'], 'exclude');

    expect(pivot.data.table).to.deep.equal(expectedResult);
  });

  it('should take a fieldName string and filterValues array', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedResult = [
      { value: [ 'sum age', 'sum age', 'aggregated' ],
        depth: 0,
        type: 'colHeader',
        row: 0 },
      { value: [ 'Baratheon', 56, '' ],
        depth: 0,
        type: 'rowHeader',
        row: 1 },
      { value: [ 'f', 38, '' ], depth: 1, type: 'rowHeader', row: 2 },
      { value: [ 'Cersei', 38, 38 ], type: 'data', depth: 2, row: 3 },
      { value: [ 'm', 18, '' ], depth: 1, type: 'rowHeader', row: 4 },
      { value: [ 'Joffrey', 18, 18 ], type: 'data', depth: 2, row: 5 },
      { value: [ 'Lannister', 133, '' ],
        depth: 0,
        type: 'rowHeader',
        row: 6 },
      { value: [ 'm', 133, '' ], depth: 1, type: 'rowHeader', row: 7 },
      { value: [ 'Jaime', 32, 32 ], type: 'data', depth: 2, row: 8 },
      { value: [ 'Tyrion', 34, 34 ], type: 'data', depth: 2, row: 9 },
      { value: [ 'Tywin', 67, 67 ], type: 'data', depth: 2, row: 10 },
      { value: [ 'Stark', 30, '' ], depth: 0, type: 'rowHeader', row: 11 },
      { value: [ 'f', 22, '' ], depth: 1, type: 'rowHeader', row: 12 },
      { value: [ 'Arya', 10, 10 ], type: 'data', depth: 2, row: 13 },
      { value: [ 'Sansa', 12, 12 ], type: 'data', depth: 2, row: 14 },
      { value: [ 'm', 8, '' ], depth: 1, type: 'rowHeader', row: 15 },
      { value: [ 'Bran', 8, 8 ], type: 'data', depth: 2, row: 16 },
      {type: 'aggregated', value: ['', 219, ''] },
    ];

    pivot.filter('name', ['Jon']);

    expect(pivot.data.table).to.deep.equal(expectedResult);
  });

  it('should take a callback function', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedResult = [
      {
        value: [ 'sum age', 'sum age', 'aggregated' ],
        depth: 0,
        type: 'colHeader',
        row: 0,
      },
      { value: [ 'Stark', 44, '' ], depth: 0, type: 'rowHeader', row: 1 },
      { value: [ 'f', 22, '' ], depth: 1, type: 'rowHeader', row: 2 },
      { value: [ 'Arya', 10, 10 ], type: 'data', depth: 2, row: 3 },
      { value: [ 'Sansa', 12, 12 ], type: 'data', depth: 2, row: 4 },
      { value: [ 'm', 22, '' ], depth: 1, type: 'rowHeader', row: 5 },
      { value: [ 'Bran', 8, 8 ], type: 'data', depth: 2, row: 6 },
      { value: [ 'Jon', 14, 14 ], type: 'data', depth: 2, row: 7 },
      { type: 'aggregated', value: ['', 44, ''] },
    ];

    function filterFunc(dataRow) {
      return dataRow.age < 15;
    }

    pivot.filter(filterFunc);

    expect(pivot.data.table).to.deep.equal(expectedResult);
  });

  it('should maintain collapsed state if filtering after collapse', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedResult = [
      { value: [ 'sum age', 'sum age', 'aggregated'],
        depth: 0,
        type: 'colHeader',
        row: 0 },
      { value: [ 'Baratheon', 56, '' ],
        depth: 0,
        type: 'rowHeader',
        row: 1 },
      { value: [ 'f', 38, '' ], depth: 1, type: 'rowHeader', row: 2 },
      { value: [ 'm', 18, '' ], depth: 1, type: 'rowHeader', row: 4 },
      { value: [ 'Joffrey', 18, 18 ], type: 'data', depth: 2, row: 5 },
      { value: [ 'Lannister', 133, '' ],
        depth: 0,
        type: 'rowHeader',
        row: 6 },
      { value: [ 'm', 133, '' ], depth: 1, type: 'rowHeader', row: 7 },
      { value: [ 'Stark', 30, '' ], depth: 0, type: 'rowHeader', row: 11 },
      { type: 'aggregated', value: ['', 219, ''] },
    ];

    pivot.collapse(11).collapse(2).collapse(6);
    pivot.filter('name', ['Jon'], 'exclude');

    expect(pivot.data.table).to.deep.equal(expectedResult);
  });

  it('should maintain collapsed state even when categories are filtered ' +
    'out', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedResult = [
      {
        value: [ 'sum age', 'sum age', 'aggregated' ],
        depth: 0,
        type: 'colHeader',
        row: 0,
      },
      { value: [ 'Stark', 44, '' ], depth: 0, type: 'rowHeader', row: 1 },
      { type: 'aggregated', value: ['', 44, ''] },
    ];

    function filterFunc(dataRow) {
      return dataRow.age < 15;
    }

    pivot.collapse(11).collapse(6).collapse(1);
    pivot.filter(filterFunc);

    expect(pivot.data.table).to.deep.equal(expectedResult);
  });

  it('should progressively filter, when the filter method is called in' +
    ' succession', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedResult = [
      {
        value: [ 'sum age', 'sum age', 'aggregated' ],
        depth: 0,
        type: 'colHeader',
        row: 0,
      },
      { value: [ 'Baratheon', 38, '' ], depth: 0, type: 'rowHeader', row: 1 },
      { value: [ 'f', 38, '' ], depth: 1, type: 'rowHeader', row: 2 },
      { value: [ 'Cersei', 38, 38 ], type: 'data', depth: 2, row: 3 },
      { type: 'aggregated', value: ['', 38, ''] },
    ];

    pivot.filter('house', ['Stark'], 'exclude')
      .filter('gender', ['m'], 'exclude');

    expect(pivot.data.table).to.deep.equal(expectedResult);
  });

  it('should progressively filter, when the filter method is called in' +
    ' succession and then collapse', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedResult = [
      { value: [ 'sum age', 'sum age', 'aggregated' ],
        depth: 0,
        type: 'colHeader',
        row: 0 },
      { value: [ 'Baratheon', 18, '' ],
        depth: 0,
        type: 'rowHeader',
        row: 1 },
      { value: [ 'Lannister', 34, '' ],
        depth: 0,
        type: 'rowHeader',
        row: 4 },
      { value: [ 'm', 34, '' ], depth: 1, type: 'rowHeader', row: 5 },
      { value: [ 'Tyrion', 34, 34 ], type: 'data', depth: 2, row: 6 },
      { value: [ 'Stark', 44, '' ], depth: 0, type: 'rowHeader', row: 7 },
      { value: [ 'f', 22, '' ], depth: 1, type: 'rowHeader', row: 8 },
      { value: [ 'Arya', 10, 10 ], type: 'data', depth: 2, row: 9 },
      { value: [ 'Sansa', 12, 12 ], type: 'data', depth: 2, row: 10 },
      { value: [ 'm', 22, '' ], depth: 1, type: 'rowHeader', row: 11 },
      { value: [ 'Bran', 8, 8 ], type: 'data', depth: 2, row: 12 },
      { value: [ 'Jon', 14, 14 ], type: 'data', depth: 2, row: 13 },
      { type: 'aggregated', value: ['', 96, ''] },
    ];

    pivot.filter('name', ['Cersei'], 'exclude')
      .filter('name', ['Jaime'], 'exclude')
      .collapse(1)
      .filter('name', ['Tywin'], 'exclude');

    expect(pivot.data.table).to.deep.equal(expectedResult);
  });

  it('should progressively filter, when the filter method is called in' +
    ' succession and then collapse and then expand', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedResult = [
      { value: [ 'sum age', 'sum age', 'aggregated' ],
        depth: 0,
        type: 'colHeader',
        row: 0 },
      { value: [ 'Baratheon', 18, '' ],
        depth: 0,
        type: 'rowHeader',
        row: 1 },
      { value: [ 'm', 18, '' ], depth: 1, type: 'rowHeader', row: 2 },
      { value: [ 'Joffrey', 18, 18 ], type: 'data', depth: 2, row: 3 },
      { value: [ 'Lannister', 34, '' ],
        depth: 0,
        type: 'rowHeader',
        row: 4 },
      { value: [ 'm', 34, '' ], depth: 1, type: 'rowHeader', row: 5 },
      { value: [ 'Tyrion', 34, 34 ], type: 'data', depth: 2, row: 6 },
      { value: [ 'Stark', 44, '' ], depth: 0, type: 'rowHeader', row: 7 },
      { value: [ 'f', 22, '' ], depth: 1, type: 'rowHeader', row: 8 },
      { value: [ 'Arya', 10, 10 ], type: 'data', depth: 2, row: 9 },
      { value: [ 'Sansa', 12, 12 ], type: 'data', depth: 2, row: 10 },
      { value: [ 'm', 22, '' ], depth: 1, type: 'rowHeader', row: 11 },
      { value: [ 'Bran', 8, 8 ], type: 'data', depth: 2, row: 12 },
      { value: [ 'Jon', 14, 14 ], type: 'data', depth: 2, row: 13 },
      { type: 'aggregated', value: ['', 96, ''] },
    ];

    pivot.filter('name', ['Cersei'], 'exclude')
      .filter('name', ['Jaime'], 'exclude')
      .collapse(1)
      .filter('name', ['Tywin'], 'exclude')
      .expand(1);

    expect(pivot.data.table).to.deep.equal(expectedResult);
  });
};
