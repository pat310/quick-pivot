import chai from 'chai';
import { tableCreator } from '../../src/logic.js';

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

export default () => {
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
      { name: 'Jon', gender: 'm', house: 'Stark', age: 14 },
      { name: 'Arya', gender: 'f', house: 'Stark', age: 10 },
      { name: 'Cersei', gender: 'f', house: 'Baratheon', age: 38 },
      { name: 'Tywin', gender: 'm', house: 'Lannister', age: 67 },
      { name: 'Tyrion', gender: 'm', house: 'Lannister', age: 34 },
      { name: 'Joffrey', gender: 'm', house: 'Baratheon', age: 18 },
      { name: 'Bran', gender: 'm', house: 'Stark', age: 8 },
      { name: 'Jaime', gender: 'm', house: 'Lannister', age: 32 },
      { name: 'Sansa', gender: 'f', house: 'Stark', age: 12 },
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

  it('should throw an error if rows/cols are not provided as an array', () => {
    const rowError = tableCreator.bind(null, data, 'gender', ['house'], 'age',
      'count');
    const colError = tableCreator.bind(null, data, ['gender'], 'house', 'age',
      'count');

    expect(rowError).to.throw(Error);
    expect(colError).to.throw(Error);
  });

  it('should return empty rawData and empty table if data is empty', () => {
    const results = tableCreator([], ['house'], ['gender'], 'age', 'count');

    expect(results).to.deep.equal({table: [], rawData: []});
  });

};
