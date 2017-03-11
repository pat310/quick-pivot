import chai from 'chai';
import {
  fixDataFormat,
  groupByCategory,
  groupByCategories,
  createColumnHeaders,
  accumulator,
  tableCreator,
  checkPivotCategories,
} from '../src/logic.js';

chai.expect();
const expect = chai.expect;

const data = [
  {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
  {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
  {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
  {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
  {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'},
  {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
  {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'},
  {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'},
];

describe('logic functions', () => {

  describe('fixDataFormat', () => {

    it('should leave data alone if it is properly formatted', () => {
      const newData = fixDataFormat(data);

      expect(data).to.deep.equal(newData);
    });

    it('should turn an array of data into array of objects', () => {
      const arrayData = [
        ['name', 'borough', 'age', 'gender'],
        ['patrick', 'brooklyn', '28', 'm'],
        ['greg', 'brooklyn', '29', 'm'],
        ['niles', 'manhattan', '30', 'm'],
        ['jared', 'manhattan', '29', 'm'],
        ['markus', 'manhattan', '28', 'm'],
        ['sarah', 'queens', '30', 'f'],
        ['vishakh', 'queens', '28', 'm'],
        ['jessica', 'brooklyn', '28', 'f'],
      ];

      const newData = fixDataFormat(arrayData);

      expect(data).to.deep.equal(newData);
    });

    it('should turn an array of data into an array of objects', () => {
      const data = ['name', 'patrick', 'bill', 'greg'];
      const newData = fixDataFormat(data);
      const expectedData = [{name: 'patrick'}, {name: 'bill'}, {name: 'greg'}];

      expect(expectedData).to.deep.equal(newData);
    });

    it('should return an empty array if given an empty array', () => {
      const newData = fixDataFormat([]);

      expect(newData).to.be.empty;
    });

    it('should return an empty array if given something other than an array',
      () => {
        const newData = fixDataFormat('i am data');

        expect(Array.isArray(newData)).to.be.true;
        expect(newData).to.be.empty;
      });
  });

  describe('groupByCategory', () => {

    it('should return an object of arrays based on a provided category',
      () => {
        const groupedData = groupByCategory(data, 'borough');
        const expectedData = {
          brooklyn: [
            {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
            {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
            {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'},
          ],
          manhattan: [
            {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
            {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
            {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'},
          ],
          queens: [
            {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
            {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'},
          ],
        };

        expect(groupedData).to.deep.equal(expectedData);
      });
  });

  describe('groupByCategories', () => {
    it('should return an object of arrays if given a single category',
      () => {
        const groupedData = groupByCategories(data, ['borough']);
        const expectedData = {
          brooklyn: [
            {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
            {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
            {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'},
          ],
          manhattan: [
            {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
            {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
            {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'},
          ],
          queens: [
            {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
            {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'},
          ],
        };

        expect(groupedData).to.deep.equal(expectedData);
      });

    it('should return an empty object if data is empty', () => {
      const groupedData = groupByCategories([], ['borough']);

      expect([]).to.deep.equal(groupedData);
    });

    it('should return the original data if the group category is empty',
      () => {
        const groupedData = groupByCategories(data, []);

        expect(data).to.deep.equal(groupedData);
      });

    it('should deeply nest arrays by the groups if provided multiple groups',
      () => {
        const groupedData = groupByCategories(data, ['borough', 'gender']);
        const expectedData = {
          brooklyn: {
            m: [
              {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
              {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
            ],
            f: [
              {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'},
            ],
          },
          manhattan: {
            m: [
              {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
              {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
              {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'},
            ],
          },
          queens: {
            m: [
              {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'},
            ],
            f: [
              {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
            ],
          },
        };

        expect(groupedData).to.deep.equal(expectedData);
      });
  });

  describe('createColumnHeaders', () => {
    it('should return an object containing column headers and a map to the' +
      ' headers when given data and column header categories',
        () => {
          const columnData = createColumnHeaders(data, ['borough']);
          const expectedData = {
            columnHeaders: [['', 'brooklyn', 'manhattan', 'queens']],
            mapToHeader: {
              brooklyn: 1,
              manhattan: 2,
              queens: 3,
            },
          };

          expect(columnData).to.deep.equal(expectedData);
        });

    it('should fill the first column spot with an empty string or a provided' +
      ' string',
      () => {
        const columnDataNoString = createColumnHeaders(data, ['borough']);
        const columnDataWithString = createColumnHeaders(
            data, ['borough'], 'Test');

        expect(columnDataNoString.columnHeaders[0][0]).to.equal('');
        expect(columnDataWithString.columnHeaders[0][0]).to.equal('Test');
      });

    it('should work with multiple columns', () => {
      const columnData = createColumnHeaders(data, ['borough', 'gender']);
      const expectedData = {
        columnHeaders: [
          [
            '',
            'brooklyn',
            'brooklyn',
            'manhattan',
            'queens',
            'queens',
          ],
          [
            '',
            'm',
            'f',
            'm',
            'f',
            'm',
          ],
        ],
        mapToHeader: {
          brooklyn: {
            m: 1,
            f: 2,
          },
          manhattan: {
            m: 3,
          },
          queens: {
            f: 4,
            m: 5,
          },
        },
      };

      expect(columnData).to.deep.equal(expectedData);
    });

    it('should provide an array with an empty string if no column groups are' +
      ' provided',
        () => {
          const columnData = createColumnHeaders(data, [], '');
          const expectedData = {
            columnHeaders: [''],
            mapToHeader: 1,
          };

          expect(columnData).to.deep.equal(expectedData);
        });
  });

  describe('accumulator', () => {
    describe('accumulation category check',
        () => {
          it('average', () => {
            const accumulatedResults = accumulator(data, 'age', 'average');

            expect(accumulatedResults).to.equal(28.75);
          });
          it('count', () => {
            const accumulatedResults = accumulator(data, 'age', 'count');

            expect(accumulatedResults).to.equal(8);
          });
          it('min', () => {
            const accumulatedResults = accumulator(data, 'age', 'min');

            expect(accumulatedResults).to.equal(28);
          });
          it('max', () => {
            const accumulatedResults = accumulator(data, 'age', 'max');

            expect(accumulatedResults).to.equal(30);
          });
          it('sum', () => {
            const accumulatedResults = accumulator(data, 'age', 'sum');

            expect(accumulatedResults).to.equal(230);
          });
          it('default', () => {
            const accumulatedResults = accumulator(data, 'age', 'default');

            expect(accumulatedResults).to.equal(8);
          });
        });

    it('should take an accumulation start value', () => {
      const accumulatedResults = accumulator(data, 'age', 'count', 2);

      expect(accumulatedResults).to.equal(10);
    });

    it('should accept an accumulation function which receives an accumulation' +
      ' value, current value, index, and array',
      () => {
        function accFunction(acc, curr, index, array) {
          acc += Number(curr.age);
          if (index === array.length - 1) return acc / array.length;
          return acc;
        }

        function accFunctionNoType(acc, curr, index, array) {
          acc += Number(curr);
          if (index === array.length - 1) return acc / array.length;
          return acc;
        }

        const accumulatedResultsWithInit = accumulator(data, accFunction, 100);
        const accumulatedResultsNoInit = accumulator(data, accFunction);
        const accumulatedResultsWithTypeProvided = accumulator(
            data, 'age', accFunctionNoType);

        expect(accumulatedResultsWithInit).to.equal(41.25);
        expect(accumulatedResultsNoInit).to.equal(28.75);
        expect(accumulatedResultsWithTypeProvided).to.equal(28.75);
      });
  });

  describe('checkPivotCategories', () => {
    const actualCategories = ['pig', 'fish', 'dog'];

    it('should return undefined if pivot category exists', () => {
      expect(checkPivotCategories(actualCategories, ['dog'])).to.be.undefined;
    });

    it('should throw an error if pivot category does not exist', () => {
      const errorFunc = checkPivotCategories.bind(
          null, actualCategories, ['cat']);

      expect(errorFunc).to.throw(Error);
    });
  });

  describe('tableCreator', () => {
    it('should take an array of objects, an array of row categories, an array' +
      ' of column categories, an accumulation category, and an accumulation' +
      ' type and return an object containing the table and data comprising' +
      ' the table',
        () => {
          const tableResults = tableCreator(
              data, ['gender'], ['borough'], 'age', 'count');

          const expectedTableResults = [
            {
              value: ['count age', 'brooklyn', 'manhattan', 'queens'],
              depth: 0,
              row: 0,
              type: 'colHeader',
            },
            {
              value: ['m', 2, 3, 1],
              row: 1,
              type: 'data',
              depth: 0,
            },
            {
              value: ['f', 1, '', 1],
              row: 2,
              type: 'data',
              depth: 0,
            },
          ];
          const expectedRawDataResults = [
            {
              value: ['count age', 'brooklyn', 'manhattan', 'queens'],
              depth: 0,
              row: 0,
              type: 'colHeader',
            },
            {
              value: [
                'm',
                [
                  {
                    name: 'patrick',
                    borough: 'brooklyn',
                    age: '28',
                    gender: 'm',
                  },
                  {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
                ],
                [
                  {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
                  {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
                  {
                    name: 'markus',
                    borough: 'manhattan',
                    age: '28',
                    gender: 'm',
                  },
                ],
                [
                  {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'},
                ],
              ],
              type: 'data',
              depth: 0,
            },
            {
              value: [
                'f',
                [
                  {
                    name: 'jessica',
                    borough: 'brooklyn',
                    age: '28',
                    gender: 'f',
                  },
                ],
                '',
                [
                  {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
                ],
              ],
              type: 'data',
              depth: 0,
            },
          ];

          expect(tableResults.table).to.deep.equal(expectedTableResults);
          expect(tableResults.rawData).to.deep.equal(expectedRawDataResults);
        });

    it('should take an array of objects, an array of row categories, an array' +
      ' of column categories, an accumulation function and initial value and' +
      ' return an object containing the table and data comprising the table',
      () => {
        function accFunction(acc, curr) {
          acc += 1;
          return acc;
        }
        const tableResults = tableCreator(
            data, ['gender'], ['borough'], accFunction, 0);

        const expectedTableResults = [
          {
            value: ['Custom Agg', 'brooklyn', 'manhattan', 'queens'],
            row: 0,
            depth: 0,
            type: 'colHeader',
          },
          {
            value: ['m', 2, 3, 1],
            row: 1,
            depth: 0,
            type: 'data',
          },
          {
            value: ['f', 1, '', 1],
            row: 2,
            depth: 0,
            type: 'data',
          },
        ];
        const expectedRawDataResults = [
          {
            value: ['Custom Agg', 'brooklyn', 'manhattan', 'queens'],
            row: 0,
            depth: 0,
            type: 'colHeader',
          },
          {
            value: [
              'm',
              [
                {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
                {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
              ],
              [
                {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
                {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
                {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'},
              ],
              [
                {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'},
              ],
            ],
            depth: 0,
            type: 'data',
          },
          {
            value: [
              'f',
              [
                {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'},
              ],
              '',
              [
                {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
              ],
            ],
            depth: 0,
            type: 'data',
          },
        ];

        expect(tableResults.table).to.deep.equal(expectedTableResults);
        expect(tableResults.rawData).to.deep.equal(expectedRawDataResults);
      });

    it('should print columns as rows if column groups are provided and row' +
      ' groups are not',
      () => {
        const tableResults = tableCreator(data, [], ['borough'], 'age',
            'count');
        const expectedTableResults = [
          {
            value: ['count age', 'brooklyn', 'manhattan', 'queens'],
            row: 0,
            depth: 0,
            type: 'colHeader',
          },
          {
            value: ['brooklyn', 3, '', ''],
            row: 1,
            depth: 0,
            type: 'data',
          },
          {
            value: ['manhattan', '', 3, ''],
            row: 2,
            depth: 0,
            type: 'data',
          },
          {
            value: ['queens', '', '', 2],
            row: 3,
            depth: 0,
            type: 'data',
          },
        ];

        expect(tableResults.table).to.deep.equal(expectedTableResults);
      });

    it('should print rows under a single column if no column groups are' +
        'provided',
          () => {
            const tableResults = tableCreator(data, ['borough'], [], 'age',
                'count');
            const expectedTableResults = [
              {
                value: ['count age', 'count age'],
                row: 0,
                depth: 0,
                type: 'colHeader',
              },
              {
                value: ['brooklyn', 3],
                row: 1,
                depth: 0,
                type: 'data',
              },
              {
                value: ['manhattan', 3],
                row: 2,
                depth: 0,
                type: 'data',
              },
              {
                value: ['queens', 2],
                row: 3,
                depth: 0,
                type: 'data',
              },
            ];

            expect(tableResults.table).to.deep.equal(expectedTableResults);
          });

    it('should accumulate to a single value if no row groups or column groups' +
        ' are provided',
          () => {
            const tableResults = tableCreator(data, [], [], 'age', 'count');
            const expectedTableResults = [
              {
                value: ['count age', 'count age'],
                row: 0,
                depth: 0,
                type: 'colHeader',
              },
              {
                value: ['count age', 8],
                row: 1,
                depth: 0,
                type: 'data',
              },
            ];

            expect(tableResults.table).to.deep.equal(expectedTableResults);
          });

    it('should replace row header with provided row header', () => {
      const tableResults = tableCreator(data, [], [], 'age', 'count', 'total');
      const expectedTableResults = [
        {
          value: ['total', 'total'],
          row: 0,
          depth: 0,
          type: 'colHeader',
        },
        {
          value: ['total', 8],
          row: 1,
          depth: 0,
          type: 'data',
        },
      ];

      expect(tableResults.table).to.deep.equal(expectedTableResults);
    });

    it('should work with rows with the same key but different groups', () => {
      const data = [
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

      const tableResults = tableCreator(data, ['house', 'gender'], [], '',
          'count');

      const expectedResults = [
        {value: [ 'count ', 'count ' ], depth: 0, type: 'colHeader', row: 0 },
        { value: [ 'Stark', 4 ], depth: 0, type: 'rowHeader', row: 1 },
        { value: [ 'm', 2 ], type: 'data', depth: 1, row: 2 },
        { value: [ 'f', 2 ], type: 'data', depth: 1, row: 3 },
        { value: [ 'Baratheon', 2 ], depth: 0, type: 'rowHeader', row: 4 },
        { value: [ 'f', 1 ], type: 'data', depth: 1, row: 5 },
        { value: [ 'm', 1 ], type: 'data', depth: 1, row: 6 },
        { value: [ 'Lannister', 3 ], depth: 0, type: 'rowHeader', row: 7 },
        { value: [ 'm', 3 ], type: 'data', depth: 1, row: 8 },
      ];

      expect(tableResults.table).to.deep.equal(expectedResults);
    });

  });
});
