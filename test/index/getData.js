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
      {
        value: [
          'Jon',
          [{name: 'Jon', gender: 'm', house: 'Stark', age: 14}],
          '',
          '',
        ],
        type: 'data',
        depth: 1,
      },
      {
        value: [
          'Tywin',
          '',
          '',
          [{ name: 'Tywin', gender: 'm', house: 'Lannister', age: 67 }],
        ],
        type: 'data',
        depth: 1,
      },
      {
        value: [
          'Tyrion',
          '',
          '',
          [{ name: 'Tyrion', gender: 'm', house: 'Lannister', age: 34 }],
        ],
        type: 'data',
        depth: 1,
      },
      {
        value: ['Joffrey',
          '',
          [{ name: 'Joffrey', gender: 'm', house: 'Baratheon', age: 18 }],
          '',
        ],
        type: 'data',
        depth: 1,
      },
      {
        value: [
          'Bran',
          [{ name: 'Bran', gender: 'm', house: 'Stark', age: 8 }],
          '',
          '',
        ],
        type: 'data',
        depth: 1,
      },
      {
        value: [
          'Jaime',
          '',
          '',
          [{ name: 'Jaime', gender: 'm', house: 'Lannister', age: 32 }],
        ],
        type: 'data',
        depth: 1,
      },
    ];

    expect(pivot.getData(1)).to.deep.equal(expectedCollapsedResult);
  });
};
