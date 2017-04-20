import { expect } from 'chai';
import { createUniqueValues } from '../../src/filtering.js';

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
  it('should create an object with the categories with values of objects ' +
    'containing all the unique combinations', () => {
    const expectedResults = {
      name: {
        Jon: true,
        Arya: true,
        Cersei: true,
        Tywin: true,
        Tyrion: true,
        Joffrey: true,
        Bran: true,
        Jaime: true,
        Sansa: true,
      },
      gender: { m: true, f: true },
      house: { Stark: true, Baratheon: true, Lannister: true },
      age: {
        '8': true,
        '10': true,
        '12': true,
        '14': true,
        '18': true,
        '32': true,
        '34': true,
        '38': true,
        '67': true,
      },
    };

    expect(createUniqueValues(data)).to.deep.equal(expectedResults);
  });
};

