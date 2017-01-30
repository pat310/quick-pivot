import Pivot from './lib/quick-pivot';

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
 ['Sansa', 'f', 'Stark', 12]
];

var rowsToPivot = ['name'];
var colsToPivot = ['house', 'gender'];
var aggregationCategory = 'age';
var aggregationType = 'sum';

var pivot = new Pivot(
		dataArray,
		rowsToPivot,
		colsToPivot,
		aggregationCategory,
		aggregationType);

console.log(pivot.getData());