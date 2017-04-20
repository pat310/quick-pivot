import { expect } from 'chai';
import { groupByCategories } from '../../src/logic.js';

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
};
