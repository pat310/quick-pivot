import { expect } from 'chai';
import { groupByCategory } from '../../src/logic.js';

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
};
