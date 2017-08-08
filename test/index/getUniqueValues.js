import { expect } from 'chai';
import Pivot from '../../src';

const dataArray = [
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
const rowsToPivotTestOne = ['gender', 'name'];
const colsToPivotTestOne = ['house'];
const aggregationCategory = 'age';
const aggregationType = 'sum';

export default () => {
  it('should return an array of unique values for a given field', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    const expectedResults = ['Stark', 'Baratheon', 'Lannister'];

    expect(pivot.getUniqueValues('house')).to.deep.equal(expectedResults);
  });

  it('should return an empty array if field name does not exist', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    expect(pivot.getUniqueValues('dogman')).to.deep.equal([]);
  });

  it('should return all the unique values from the original data on multiple ' +
    'filters', () => {
    const pivot = new Pivot(dataArray, ['gender'], [], 'age', 'count');

    expect(pivot.getUniqueValues('gender')).to.deep.equal(['f', 'm']);
    pivot.filter('gender', ['m'], 'exclude');
    expect(pivot.getUniqueValues('gender')).to.deep.equal(['f', 'm']);
    pivot.filter('gender', ['f'], 'exclude');
    expect(pivot.getUniqueValues('gender')).to.deep.equal(['f', 'm']);
  });
};

