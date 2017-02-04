import chai from 'chai';

import Pivot from '../lib/quick-pivot';

chai.expect();
const expect = chai.expect;

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
const rowsToPivot = ['gender', 'name'];
const colsToPivot = ['house'];
const aggregationCategory = 'age';
const aggregationType = 'sum';

describe('pivot', () => {
  describe('constructor', () => {
    it('should create an empty pivot when instantiated without params', () => {
      const pivot = new Pivot();

      expect(pivot.data).to.deep.equal({});
    });

    it('should create a pivot when passed data', () => {
      const pivot = new Pivot(
        dataArray,
        rowsToPivot,
        colsToPivot,
        aggregationCategory,
        aggregationType,
      );

      expect(pivot.data.table).to.have.length.above(0);
    });
  });

  describe('collapse', () => {
    it('should collapse a header row when passed the index', () => {
      const pivot = new Pivot(
        dataArray,
        rowsToPivot,
        colsToPivot,
        aggregationCategory,
        aggregationType,
      );

      pivot.collapse(1);

      const expectedTable = [
        {
          value: ['sum age', 'Stark', 'Baratheon', 'Lannister'],
          depth: 0,
          type: 'colHeader',
          row: 0,
        },
        { value: ['m', 22, 18, 133],
          depth: 0,
          type: 'rowHeader',
          row: 1,
        },
        { value: ['f', 22, 38, ''],
          depth: 0,
          type: 'rowHeader',
          row: 8,
        },
        { value: ['Arya', 10, '', ''],
          type: 'data',
          depth: 1,
          row: 9,
        },
        { value: ['Cersei', '', 38, ''],
          type: 'data',
          depth: 1,
          row: 10,
        },
        { value: ['Sansa', 12, '', ''],
          type: 'data',
          depth: 1,
          row: 11,
        },
      ];

      const expectedRawData = [
        {
          value: ['sum age', 'Stark', 'Baratheon', 'Lannister'],
          depth: 0,
          type: 'colHeader',
          row: 0,
        },
        {
          value: ['m', 22, 18, 133],
          depth: 0,
          type: 'rowHeader',
        },
        {
          value: ['f', 22, 38, ''],
          depth: 0,
          type: 'rowHeader',
        },
        {
          value: [
            'Arya',
            [{name: 'Arya', gender: 'f', house: 'Stark', age: 10}],
            '',
            '',
          ],
          depth: 1,
          type: 'data',
        },
        {
          value: [
            'Cersei',
            '',
            [{name: 'Cersei', gender: 'f', house: 'Baratheon', age: 38}],
            '',
          ],
          depth: 1,
          type: 'data',
        },
        {
          value: [
            'Sansa',
            [{name: 'Sansa', gender: 'f', house: 'Stark', age: 12}],
            '',
            '',
          ],
          depth: 1,
          type: 'data',
        },
      ];

      expect(pivot.data.table).to.deep.equal(expectedTable);
      expect(pivot.data.rawData).to.deep.equal(expectedRawData);
    });

    it('should not collapse a data row', () => {
      const pivot = new Pivot(
        dataArray,
        rowsToPivot,
        colsToPivot,
        aggregationCategory,
        aggregationType,
      );

      pivot.collapse(2);

      const expectedRow = {
        value: ['Jon', 14, '', ''],
        depth: 1,
        row: 2,
        type: 'data',
      };

      expect(pivot.data.table[2]).to.deep.equal(expectedRow);
    });

    it('can chain to collapse multiple rows', () => {
      const pivot = new Pivot(
        dataArray,
        rowsToPivot,
        colsToPivot,
        aggregationCategory,
        aggregationType,
      );

      pivot.collapse(1).collapse(2);
      console.log('this is pivot', pivot.data.table);
    });
  });

  describe('getData', () => {
    it('should return data of a collapsed row', () => {

    });

  });
});

// describe('this is a test', function() {
//   it('is this a pivot?', function() {
//     // console.log('testing', pivot.originalData.table);
//     // pivot.collapse(1).collapse(2);
//     // pivot.collapse(1).expand(1)
//     // pivot.collapse(1);
//     // console.log('table', pivot.originalData.table);
//     // console.log('data', pivot.originalData.rawData)
//     console.log('this is data', pivot.data.table)
//     console.log('this is rawData', pivot.data.rawData)
//     // console.log('this is rawData', pivot.getData(1))
//   });
// });
