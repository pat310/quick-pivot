import chai from 'chai';
import {
    fixDataFormat,
    groupByCategory,
    groupByCategories,
    createColumnHeaders,
    accumulator,
    tableCreator,
    checkPivotCategories
  } from '../lib/quick-pivot.js';

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
  {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'}
];

describe('fixDataFormat', function() {

  it('should leave data alone if it is properly formatted', function() {
    var newData = fixDataFormat(data);

    expect(data).to.deep.equal(newData);
  });

  it('should turn an array of data into array of objects', function() {
    var arrayData = [
      ['name', 'borough', 'age', 'gender'],
      ['patrick', 'brooklyn', '28', 'm'],
      ['greg', 'brooklyn', '29', 'm'],
      ['niles', 'manhattan', '30', 'm'],
      ['jared', 'manhattan', '29', 'm'],
      ['markus', 'manhattan', '28', 'm'],
      ['sarah', 'queens', '30', 'f'],
      ['vishakh', 'queens', '28', 'm'],
      ['jessica', 'brooklyn', '28', 'f']
    ];

    var newData = fixDataFormat(arrayData);

    expect(data).to.deep.equal(newData);
  });

  it('should turn an array of data into an array of objects', function() {
    var data = ['name', 'patrick', 'bill', 'greg'];
    var newData = fixDataFormat(data);
    var expectedData = [{name: 'patrick'}, {name: 'bill'}, {name: 'greg'}];

    expect(expectedData).to.deep.equal(newData);
  });

  it('should return an empty array if given an empty array', function() {
    var newData = fixDataFormat([]);

    expect(newData).to.be.empty;
  });

  it('should return an empty array if given something other than an array',
    function() {
      var newData = fixDataFormat('i am data');

      expect(Array.isArray(newData)).to.be.true;
      expect(newData).to.be.empty;
    });
});

describe('groupByCategory', function() {

  it('should return an object of arrays based on a provided category',
    function() {
      var groupedData = groupByCategory(data, 'borough');
      var expectedData = {
        brooklyn: [
          {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
          {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
          {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'}
        ],
        manhattan: [
          {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
          {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
          {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'}
        ],
        queens: [
          {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
          {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'}
        ]
      };

      expect(groupedData).to.deep.equal(expectedData);
    });
});

describe('groupByCategories', function() {
  it('should return an object of arrays if given a single category',
    function() {
      var groupedData = groupByCategories(data, ['borough']);
      var expectedData = {
        brooklyn: [
          {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
          {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
          {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'}
        ],
        manhattan: [
          {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
          {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
          {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'}
        ],
        queens: [
          {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
          {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'}
        ]
      };

      expect(groupedData).to.deep.equal(expectedData);
    });

  it('should return an empty object if data is empty', function() {
    var groupedData = groupByCategories([], ['borough']);

    expect([]).to.deep.equal(groupedData);
  });

  it('should return the original data if the group category is empty',
    function() {
      var groupedData = groupByCategories(data, []);

      expect(data).to.deep.equal(groupedData);
    });

  it('should deeply nest arrays by the groups if provided multiple groups',
    function() {
      var groupedData = groupByCategories(data, ['borough', 'gender']);
      var expectedData = {
        brooklyn: {
          m: [
            {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
            {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'}
          ],
          f: [
            {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'}
          ]
        },
        manhattan: {
          m: [
            {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
            {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
            {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'}
          ]
        },
        queens: {
          m: [
            {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'}
          ],
          f: [
            {name: 'sarah', borough: 'queens', age: '30', gender: 'f'}
          ]
        }
      };

      expect(groupedData).to.deep.equal(expectedData);
    });
});

describe('createColumnHeaders', function() {
  it(`should return an object containing column headers and a map to the headers
      when given data and column header categories`,
      function() {
        var columnData = createColumnHeaders(data, ['borough']);
        var expectedData = {
          columnHeaders: [['', 'brooklyn', 'manhattan', 'queens']],
          mapToHeader: {
            brooklyn: 1,
            manhattan: 2,
            queens: 3
          }
        };

        expect(columnData).to.deep.equal(expectedData);
      });

  it(`should fill the first column spot with an empty string or a provided
    string`,
    function() {
      var columnDataNoString = createColumnHeaders(data, ['borough']);
      var columnDataWithString = createColumnHeaders(data, ['borough'], 'Test');

      expect(columnDataNoString.columnHeaders[0][0]).to.equal('');
      expect(columnDataWithString.columnHeaders[0][0]).to.equal('Test');
    });

  it('should work with multiple columns', function() {
    var columnData = createColumnHeaders(data, ['borough', 'gender']);
    var expectedData = {
      columnHeaders: [
        [
          '',
          'brooklyn',
          'brooklyn',
          'manhattan',
          'queens',
          'queens'
        ],
        [
          '',
          'm',
          'f',
          'm',
          'f',
          'm'
        ]
      ],
      mapToHeader: {
        brooklyn: {
          m: 1,
          f: 2
        },
        manhattan: {
          m: 3
        },
        queens: {
          f: 4,
          m: 5
        }
      }
    };

    expect(columnData).to.deep.equal(expectedData);
  });

  it(`should provide an array with an empty string if no column groups are
    provided`,
      function() {
        var columnData = createColumnHeaders(data, [], '');
        var expectedData = {
          columnHeaders: [''],
          mapToHeader: 1
        };

        expect(columnData).to.deep.equal(expectedData);
      });
});

describe('accumulator', function() {
  describe(`should take an array of objects, an accumulation category and an
    accumulation type and return the accumulated value`,
      function() {
        it('sum', function() {
          var accumulatedResults = accumulator(data, 'age', 'sum');

          expect(accumulatedResults).to.equal(230);
        });
        it('count', function() {
          var accumulatedResults = accumulator(data, 'age', 'count');

          expect(accumulatedResults).to.equal(8);
        });
      });

  it('should take an accumulation start value', function() {
    var accumulatedResults = accumulator(data, 'age', 'count', 2);

    expect(accumulatedResults).to.equal(10);
  });

  it(`should accept an accumulation function which receives an accumulation
    value, current value, index, and array`,
    function() {
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

      var accumulatedResultsWithInit = accumulator(data, accFunction, 100);
      var accumulatedResultsNoInit = accumulator(data, accFunction);
      var accumulatedResultsWithTypeProvided = accumulator(
          data, 'age', accFunctionNoType);

      expect(accumulatedResultsWithInit).to.equal(41.25);
      expect(accumulatedResultsNoInit).to.equal(28.75);
      expect(accumulatedResultsWithTypeProvided).to.equal(28.75);
    });
});

describe('checkPivotCategories', function() {
  var actualCategories = ['pig', 'fish', 'dog'];

  it('should return undefined if pivot category exists', function() {
    expect(checkPivotCategories(actualCategories, ['dog'])).to.be.undefined;
  });

  it('should throw an error if pivot category does not exist', function() {
    var errorFunc = checkPivotCategories.bind(null, actualCategories, ['cat']);

    expect(errorFunc).to.throw(Error);
  });
});

describe('tableCreator', function() {
  it(`should take an array of objects, an array of row categories, an array of
    column categories, an accumulation category, and an accumulation type and
    return an object containing the table and data comprising the table`,
      function() {
        var tableResults = tableCreator(
            data, ['gender'], ['borough'], 'age', 'count');

        var expectedTableResults = [
          [
            'count age',
            'brooklyn',
            'manhattan',
            'queens'
          ],
          [
            'm',
            2,
            3,
            1
          ],
          [
            'f',
            1,
            '',
            1
          ]
        ];
        var expectedRawDataResults = [
          ['m',
            [
              {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
              {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'}
            ],
            [
              {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
              {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
              {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'}
            ],
            [
              {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'}
            ]
          ],
          ['f',
            [
              {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'}
            ],
            '',
            [
              {name: 'sarah', borough: 'queens', age: '30', gender: 'f'}
            ]
          ]
        ];

        expect(tableResults.table).to.deep.equal(expectedTableResults);
        expect(tableResults.rawData).to.deep.equal(expectedRawDataResults);
      });

  it(`should take an array of objects, an array of row categories, an array of
    column categories, an accumulation function and initial value and return an
    object containing the table and data comprising the table`,
    function() {
      function accFunction(acc, curr) {
        acc += 1;
        return acc;
      }
      var tableResults = tableCreator(
          data, ['gender'], ['borough'], accFunction, 0);

      var expectedTableResults = [
        [
          'Custom Agg',
          'brooklyn',
          'manhattan',
          'queens'
        ],
        [
          'm',
          2,
          3,
          1
        ],
        [
          'f',
          1,
          '',
          1
        ]
      ];
      var expectedRawDataResults = [
        ['m',
          [
            {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
            {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'}
          ],
          [
            {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
            {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
            {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'}
          ],
          [
            {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'}
          ]
        ],
        ['f',
          [
            {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'}
          ],
          '',
          [
            {name: 'sarah', borough: 'queens', age: '30', gender: 'f'}
          ]
        ]
      ];

      expect(tableResults.table).to.deep.equal(expectedTableResults);
      expect(tableResults.rawData).to.deep.equal(expectedRawDataResults);
    });

  it(`should print columns as rows if column groups are provided and row groups
    are not`,
    function() {
      var tableResults = tableCreator(data, [], ['borough'], 'age', 'count');
      var expectedTableResults = [
        [
          'count age',
          'brooklyn',
          'manhattan',
          'queens'
        ],
        [
          'brooklyn',
          3,
          '',
          ''
        ],
        [
          'manhattan',
          '',
          3,
          ''
        ],
        [
          'queens',
          '',
          '',
          2
        ]
      ];

      expect(tableResults.table).to.deep.equal(expectedTableResults);
    });

  it('should print rows under a single column if no column groups are provided',
    function() {
      var tableResults = tableCreator(data, ['borough'], [], 'age', 'count');
      var expectedTableResults = [['count age', 'count age'],
        ['brooklyn', 3],
        ['manhattan', 3],
        ['queens', 2]];

      expect(tableResults.table).to.deep.equal(expectedTableResults);
    });

  it(`should accumulate to a single value if no row groups or column groups are
      provided`,
        function() {
          var tableResults = tableCreator(data, [], [], 'age', 'count');
          var expectedTableResults = [
            [
              'count age',
              'count age'
            ],
            [
              'count age',
              8
            ]
          ];

          expect(tableResults.table).to.deep.equal(expectedTableResults);
        });

  it('should replace row header with provided row header', function() {
    var tableResults = tableCreator(data, [], [], 'age', 'count', 'total');
    var expectedTableResults = [['total', 'total'], ['total', 8]];

    expect(tableResults.table).to.deep.equal(expectedTableResults);
  });

});
