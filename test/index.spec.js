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
      const expectedTable = [
        {
          value: ['sum age', 'Stark', 'Baratheon', 'Lannister'],
          depth: 0,
          type: 'colHeader',
          row: 0 },
        {
          value: ['m', 22, 18, 133],
          depth: 0,
          type: 'rowHeader',
          row: 1,
        },
        { value: ['f', 22, 38, ''],
          depth: 0,
          type: 'rowHeader',
          row: 8,
        },
      ];

      expect(pivot.data.table).to.deep.equal(expectedTable);
    });

    it('should collapse to the same result regardless of order collapsed',
      () => {
        const pivot = new Pivot(
          dataArray,
          rowsToPivot,
          colsToPivot,
          aggregationCategory,
          aggregationType,
        );

        pivot.collapse(8).collapse(1);
        const expectedTable = [
          {
            value: ['sum age', 'Stark', 'Baratheon', 'Lannister'],
            depth: 0,
            type: 'colHeader',
            row: 0 },
          {
            value: ['m', 22, 18, 133],
            depth: 0,
            type: 'rowHeader',
            row: 1,
          },
          { value: ['f', 22, 38, ''],
            depth: 0,
            type: 'rowHeader',
            row: 8,
          },
        ];

        expect(pivot.data.table).to.deep.equal(expectedTable);
      });
  });

  describe('getData', () => {
    it('should return data of a collapsed row', () => {
      const pivot = new Pivot(
        dataArray,
        rowsToPivot,
        colsToPivot,
        aggregationCategory,
        aggregationType,
      );

      pivot.collapse(1);

      const expectedCollapsedResult = [
        {
          value: [
            'Jon',
            [{name: 'Jon', gender: 'm', house: 'Stark', age: 14}],
            '',
            '',
          ],
          type: 'data',
          depth: 1,
        },
        {
          value: [
            'Tywin',
            '',
            '',
            [{ name: 'Tywin', gender: 'm', house: 'Lannister', age: 67 }],
          ],
          type: 'data',
          depth: 1,
        },
        {
          value: [
            'Tyrion',
            '',
            '',
            [{ name: 'Tyrion', gender: 'm', house: 'Lannister', age: 34 }],
          ],
          type: 'data',
          depth: 1,
        },
        {
          value: ['Joffrey',
            '',
            [{ name: 'Joffrey', gender: 'm', house: 'Baratheon', age: 18 }],
            '',
          ],
          type: 'data',
          depth: 1,
        },
        {
          value: [
            'Bran',
            [{ name: 'Bran', gender: 'm', house: 'Stark', age: 8 }],
            '',
            '',
          ],
          type: 'data',
          depth: 1,
        },
        {
          value: [
            'Jaime',
            '',
            '',
            [{ name: 'Jaime', gender: 'm', house: 'Lannister', age: 32 }],
          ],
          type: 'data',
          depth: 1,
        },
      ];

      expect(pivot.getData(1)).to.deep.equal(expectedCollapsedResult);
    });
  });

  describe('expand', () => {
    it('should not expand a row that is not collapsed', () => {
      const pivot = new Pivot(
        dataArray,
        rowsToPivot,
        colsToPivot,
        aggregationCategory,
        aggregationType,
      );

      pivot.expand(1);
      const uncollapsedData = {
        value: [ 'm', 22, 18, 133 ],
        depth: 0,
        type: 'rowHeader',
      };

      expect(pivot.getData(1)).to.deep.equal(uncollapsedData);
    });

    it('should return table to normal state when completely expanded', () => {
      const pivot = new Pivot(
        dataArray,
        rowsToPivot,
        colsToPivot,
        aggregationCategory,
        aggregationType,
      );
      const uncollapsedData = {
        value: [ 'm', 22, 18, 133 ],
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
        rowsToPivot,
        colsToPivot,
        aggregationCategory,
        aggregationType,
      );

      const expectedTable = [
        {
          value: [ 'sum age', 'Stark', 'Baratheon', 'Lannister' ],
          depth: 0,
          type: 'colHeader',
          row: 0,
        },
        {
          value: [ 'm', 22, 18, 133 ],
          depth: 0,
          type: 'rowHeader',
          row: 1,
        },
        {
          value: [ 'Jon', 14, '', '' ],
          type: 'data',
          depth: 1,
          row: 2,
        },
        {
          value: [ 'Tywin', '', '', 67 ],
          type: 'data',
          depth: 1,
          row: 3,
        },
        {
          value: [ 'Tyrion', '', '', 34 ],
          type: 'data',
          depth: 1,
          row: 4,
        },
        {
          value: [ 'Joffrey', '', 18, '' ],
          type: 'data',
          depth: 1,
          row: 5,
        },
        {
          value: [ 'Bran', 8, '', '' ],
          type: 'data',
          depth: 1,
          row: 6,
        },
        {
          value: [ 'Jaime', '', '', 32 ],
          type: 'data',
          depth: 1,
          row: 7,
        },
        {
          value: [ 'f', 22, 38, '' ],
          depth: 0,
          type: 'rowHeader',
          row: 8,
        },
      ];

      const expectedCollapsedResult = [
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

      pivot.collapse(1).collapse(2).expand(1);
      expect(pivot.data.table).to.deep.equal(expectedTable);
      expect(pivot.getData(8)).to.deep.equal(expectedCollapsedResult);
    });

    it('should return null if row does not exist', () => {
      const pivot = new Pivot(
        dataArray,
        rowsToPivot,
        colsToPivot,
        aggregationCategory,
        aggregationType,
      );

      pivot.collapse(1).collapse(2).expand(1);
      expect(pivot.getData(9)).to.be.null;
    });
  });

});
