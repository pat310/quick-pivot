import { expect } from 'chai';
import { createColumnHeaders } from '../../src/logic.js';

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
  it('should return an object containing column headers and a map to the ' +
    'headers when given data and column header categories',
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
          mapToHeader: null,
        };

        expect(columnData).to.deep.equal(expectedData);
      });
};
