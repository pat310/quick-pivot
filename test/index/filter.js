import chai from 'chai';
import { fixDataFormat } from '../../src/logic.js';

chai.expect();
const expect = chai.expect;
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
  it('should work', () => {
    expect(true).to.be.true;
  });
};

