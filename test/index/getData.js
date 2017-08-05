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
  it('should return data of a collapsed row', () => {
    const pivot = new Pivot(
      dataArray,
      rowsToPivotTestOne,
      colsToPivotTestOne,
      aggregationCategory,
      aggregationType,
    );

    pivot.collapse(1);

    const expectedCollapsedResult = [
      { value: [
        'Arya',
        [ { name: 'Arya', gender: 'f', house: 'Stark', age: 10 } ],
        '',
        '',
      ],
        type: 'data',
        depth: 1 },
      { value: [
        'Cersei',
        '',
        [ { name: 'Cersei', gender: 'f', house: 'Baratheon', age: 38 } ],
        '',
      ],
        type: 'data',
        depth: 1 },
      { value: [
        'Sansa',
        [ { name: 'Sansa', gender: 'f', house: 'Stark', age: 12 } ],
        '',
        '',
      ],
        type: 'data',
        depth: 1 },
    ];

    expect(pivot.getData(1)).to.deep.equal(expectedCollapsedResult);
  });
};
