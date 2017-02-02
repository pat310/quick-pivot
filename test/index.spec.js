import chai from 'chai';

import Pivot from '../lib/quick-pivot';

chai.expect();
const expect = chai.expect;

var dataArray = [
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

var rowsToPivot = [];
var colsToPivot = [];
var aggregationCategory = 'age';
var aggregationType = 'sum';

var pivot = new Pivot(
		dataArray,
		rowsToPivot,
		colsToPivot,
		aggregationCategory,
		aggregationType
  );

describe('this is a test', function() {
  it('is this a pivot?', function() {
    // console.log('testing', pivot.originalData.table);
    // pivot.collapse(1).collapse(2);
    // pivot.collapse(1).expand(1)
    // pivot.collapse(1);
    // console.log('table', pivot.originalData.table);
    // console.log('data', pivot.originalData.rawData)
    console.log('this is data', pivot.data.table)
    console.log('this is rawData', pivot.data.rawData)
    // console.log('this is rawData', pivot.getData(1))
  });
});
