import { expect } from 'chai';
import { filter } from '../../src/filtering.js';

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

export default () => {
  it('should filter out values given the data, a field name, array of ' +
    'filter values, and type "exclude"', () => {
    const expectedResults = [
      { name: 'Arya', gender: 'f', house: 'Stark', age: 10 },
      { name: 'Cersei', gender: 'f', house: 'Baratheon', age: 38 },
      { name: 'Tywin', gender: 'm', house: 'Lannister', age: 67 },
      { name: 'Tyrion', gender: 'm', house: 'Lannister', age: 34 },
      { name: 'Joffrey', gender: 'm', house: 'Baratheon', age: 18 },
      { name: 'Bran', gender: 'm', house: 'Stark', age: 8 },
      { name: 'Jaime', gender: 'm', house: 'Lannister', age: 32 },
      { name: 'Sansa', gender: 'f', house: 'Stark', age: 12 },
    ];

    const filteredResults = filter(data, 'name', ['Jon'], 'exclude');

    expect(filteredResults).to.deep.equal(expectedResults);
  });

  it('should filter out values given the data, a field name, multiple ' +
    'filter values, and type "exclude"', () => {
    const expectedResults = [
      { name: 'Arya', gender: 'f', house: 'Stark', age: 10 },
      { name: 'Cersei', gender: 'f', house: 'Baratheon', age: 38 },
      { name: 'Tywin', gender: 'm', house: 'Lannister', age: 67 },
      { name: 'Tyrion', gender: 'm', house: 'Lannister', age: 34 },
      { name: 'Joffrey', gender: 'm', house: 'Baratheon', age: 18 },
      { name: 'Bran', gender: 'm', house: 'Stark', age: 8 },
      { name: 'Jaime', gender: 'm', house: 'Lannister', age: 32 },
    ];

    const filteredResults = filter(data, 'name', ['Jon', 'Sansa'], 'exclude');

    expect(filteredResults).to.deep.equal(expectedResults);
  });

  it('should filter out values given the data, a field name, multiple ' +
    'filter values, and type "include"', () => {
    const expectedResults = [
      { name: 'Sansa', gender: 'f', house: 'Stark', age: 12 },
    ];

    const filteredResults = filter(data, 'name', ['Sansa'], 'include');

    expect(filteredResults).to.deep.equal(expectedResults);
  });

  it('should default to type "exclude"', () => {
    const expectedResults = [
      { name: 'Arya', gender: 'f', house: 'Stark', age: 10 },
      { name: 'Cersei', gender: 'f', house: 'Baratheon', age: 38 },
      { name: 'Tywin', gender: 'm', house: 'Lannister', age: 67 },
      { name: 'Tyrion', gender: 'm', house: 'Lannister', age: 34 },
      { name: 'Joffrey', gender: 'm', house: 'Baratheon', age: 18 },
      { name: 'Bran', gender: 'm', house: 'Stark', age: 8 },
      { name: 'Jaime', gender: 'm', house: 'Lannister', age: 32 },
      { name: 'Sansa', gender: 'f', house: 'Stark', age: 12 },
    ];

    const filteredResults = filter(data, 'name', ['Jon']);

    expect(filteredResults).to.deep.equal(expectedResults);
  });

  it('should take a callback instead of fieldName, filterValues and ' +
    'filterType', () => {
    const expectedResults = [
      { name: 'Jon', gender: 'm', house: 'Stark', age: 14 },
      { name: 'Arya', gender: 'f', house: 'Stark', age: 10 },
      { name: 'Bran', gender: 'm', house: 'Stark', age: 8 },
      { name: 'Sansa', gender: 'f', house: 'Stark', age: 12 },
    ];

    function filterFunc(dataRow) {
      return dataRow.age < 15;
    }

    const filteredResults = filter(data, filterFunc);

    expect(filteredResults).to.deep.equal(expectedResults);
  });

  it('should have access to data row, index, and arr in callback', () => {
    const expectedResults = [
      { name: 'Bran', gender: 'm', house: 'Stark', age: 8 },
      { name: 'Sansa', gender: 'f', house: 'Stark', age: 12 },
    ];

    function filterFunc(dataRow, index, array) {
      return dataRow.age < 15 && index > 1 && array.length > 5;
    }

    const filteredResults = filter(data, filterFunc);

    expect(filteredResults).to.deep.equal(expectedResults);
  });

  it('should work if pivot filters out all the results', () => {
    const results = filter(data, 'gender', ['m', 'f'], 'exclude');

    expect(results).to.deep.equal([]);
  });

  it('should return an empty array if including a value that does not ' +
    'exist', () => {
    const results = filter(data, 'gender', ['dogman'], 'include');

    expect(results).to.deep.equal([]);
  });

  it('should return all values if excluding a value that does not ' +
    'exist', () => {
    const results = filter(data, 'gender', ['dogman'], 'exclude');

    expect(results).to.deep.equal(data);
  });

  it('should return an empty array if including on a dimension that does not ' +
    'exist', () => {
    const results = filter(data, 'dogman', ['dogman'], 'include');

    expect(results).to.deep.equal([]);
  });

  it('should return all values if excluding on a dimension that does not ' +
    'exist', () => {
    const results = filter(data, 'dogman', ['dogman'], 'exclude');

    expect(results).to.deep.equal(data);
  });
};
