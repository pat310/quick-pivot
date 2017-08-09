import { expect } from 'chai';
import { fixDataFormat } from '../../src/logic.js';

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
    const newData = fixDataFormat(['name', 'patrick', 'bill', 'greg']);
    const expectedData = [{name: 'bill'}, {name: 'greg'}, {name: 'patrick'}];

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

  it('should sort data in reverse order if provided an array of headers to ' +
    'sort on', () => {
    const newData = fixDataFormat(data, ['borough', 'gender', 'name']);
    const expectedData = [
      { name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f' },
      { name: 'greg', borough: 'brooklyn', age: '29', gender: 'm' },
      { name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm' },
      { name: 'jared', borough: 'manhattan', age: '29', gender: 'm' },
      { name: 'markus', borough: 'manhattan', age: '28', gender: 'm' },
      { name: 'niles', borough: 'manhattan', age: '30', gender: 'm' },
      { name: 'sarah', borough: 'queens', age: '30', gender: 'f' },
      { name: 'vishakh', borough: 'queens', age: '28', gender: 'm' },
    ];

    expect(newData).to.deep.equal(expectedData);
  });

  it('should sort data as stringified obj if no headers are provided', () => {
    const newData = fixDataFormat(data);
    const expectedData = [
      {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
      {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
      {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'},
      {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'},
      {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
      {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
      {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
      {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'},
    ];

    expect(newData).to.deep.equal(expectedData);
  });
};
