[![NPM](https://nodei.co/npm/quick-pivot.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/quick-pivot/)

[![npm version](https://badge.fury.io/js/quick-pivot.svg)](https://www.npmjs.com/package/quick-pivot)
[![Build Status](https://img.shields.io/travis/pat310/quick-pivot.svg)](https://travis-ci.org/pat310/quick-pivot)
[![Coverage Status](https://coveralls.io/repos/github/pat310/quick-pivot/badge.svg?branch=addingCoveralls)](https://coveralls.io/github/pat310/quick-pivot?branch=addingCoveralls)
[![Code Climate](https://codeclimate.com/github/pat310/quick-pivot/badges/gpa.svg)](https://codeclimate.com/github/pat310/quick-pivot)
[![Dependency Status](https://img.shields.io/david/pat310/quick-pivot.svg?style=flat-square)](https://david-dm.org/pat310/quick-pivot)

## What it does
Say you have this example data set:<br>
![example data](/screenshots/ss1.png)

With this tool you can pivot the data given a particular row and column category:<br>
![example pivot 1](/screenshots/ss2.png)

Or given multiple rows and a column category:<br>
![example pivot 2](/screenshots/ss3.png)

Or multiple columns and a row category:<br>
![example pivot 3](/screenshots/ss4.png)

Or any combination of rows and/or columns

## Example use
Install with npm:
`npm install --save quick-pivot`


```js
import Pivot from 'quick-pivot';

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
 ['Sansa', 'f', 'Stark', 12]
];

const rowsToPivot = ['name'];
const colsToPivot = ['house', 'gender'];
const aggregationDimension = 'age';
const aggregator = 'sum';

const pivot = new Pivot(dataArray, rowsToPivot, colsToPivot, aggregationDimension, aggregator);

console.log('pivot.data', pivot.data, 'pivot.data.table', pivot.data.table);
```

console logs:
```js
pivot.data
{ table:
   [ { value: [Object], depth: 0, type: 'colHeader', row: 0 },
     { value: [Object], depth: 1, type: 'colHeader', row: 1 },
     { value: [Object], type: 'data', depth: 0, row: 2 },
     { value: [Object], type: 'data', depth: 0, row: 3 },
     { value: [Object], type: 'data', depth: 0, row: 4 },
     { value: [Object], type: 'data', depth: 0, row: 5 },
     { value: [Object], type: 'data', depth: 0, row: 6 },
     { value: [Object], type: 'data', depth: 0, row: 7 },
     { value: [Object], type: 'data', depth: 0, row: 8 },
     { value: [Object], type: 'data', depth: 0, row: 9 },
     { value: [Object], type: 'data', depth: 0, row: 10 },
     { value: [Object], type: 'aggregated' } ],
  rawData:
   [ { value: [Object], depth: 0, type: 'colHeader', row: 0 },
     { value: [Object], depth: 1, type: 'colHeader', row: 1 },
     { value: [Object], type: 'data', depth: 0 },
     { value: [Object], type: 'data', depth: 0 },
     { value: [Object], type: 'data', depth: 0 },
     { value: [Object], type: 'data', depth: 0 },
     { value: [Object], type: 'data', depth: 0 },
     { value: [Object], type: 'data', depth: 0 },
     { value: [Object], type: 'data', depth: 0 },
     { value: [Object], type: 'data', depth: 0 },
     { value: [Object], type: 'data', depth: 0 } ] }

pivot.data.table
[ { value:
     [ 'sum age',
       'Stark',
       'Stark',
       'Baratheon',
       'Baratheon',
       'Lannister',
       'aggregated' ],
    depth: 0,
    type: 'colHeader',
    row: 0 },
  { value: [ 'sum age', 'f', 'm', 'f', 'm', 'm', '' ],
    depth: 1,
    type: 'colHeader',
    row: 1 },
  { value: [ 'Arya', 10, '', '', '', '', 10 ],
    type: 'data',
    depth: 0,
    row: 2 },
  { value: [ 'Bran', '', 8, '', '', '', 8 ],
    type: 'data',
    depth: 0,
    row: 3 },
  { value: [ 'Cersei', '', '', 38, '', '', 38 ],
    type: 'data',
    depth: 0,
    row: 4 },
  { value: [ 'Jaime', '', '', '', '', 32, 32 ],
    type: 'data',
    depth: 0,
    row: 5 },
  { value: [ 'Joffrey', '', '', '', 18, '', 18 ],
    type: 'data',
    depth: 0,
    row: 6 },
  { value: [ 'Jon', '', 14, '', '', '', 14 ],
    type: 'data',
    depth: 0,
    row: 7 },
  { value: [ 'Sansa', 12, '', '', '', '', 12 ],
    type: 'data',
    depth: 0,
    row: 8 },
  { value: [ 'Tyrion', '', '', '', '', 34, 34 ],
    type: 'data',
    depth: 0,
    row: 9 },
  { value: [ 'Tywin', '', '', '', '', 67, 67 ],
    type: 'data',
    depth: 0,
    row: 10 },
  { value: [ '', 22, 22, 38, 18, 133, '' ], type: 'aggregated' } ]
```

## API
### Pivot `data` value
The `data` value returns an object with keys `table` and `rawData`.  `table` is an array of objects with each object containing four keys (except for the last object which is an aggregated row of all the previous data rows based on the selected aggregation function):
1. `value` - Array which contains the result of the pivot to be rendered
2. `type` - Enumerated string describing what this data row contains, [`data`, `rowHeader`, or `colHeader`]
3. `depth` - Number describing how deeply nested the row is within a parent row
4. `row` - Number describing the original row index within the table

`rawData` is an array of objects with three keys:
1. `value` - Array which contains the data that makes up that particular row
2. `type` - Enumerated string describing what this data row contains, [`data`, `rowHeader`, or `colHeader`]
3. `depth` - Number describing how deeply nested the row is within a parent row

### Syntax

**Note:** If modules are not supported in your environment, you can also require `var Pivot = require('quick-pivot');`

```js
import Pivot from 'quick-pivot';

const pivot = new Pivot(dataArray, rows, columns, [aggregationDimension or CBfunction], [aggregator or initialValue], rowHeader);
```

#### First way to use it:
* `dataArray` **required** is one of the following:
  * array of arrays ( the array in first index is assumed to be your headers, see the example above)
  * array of objects (the keys of each object are the headers)
  * a single array (a single column of data where the first element is the header)
* `rows` is an array of strings (the rows you want to pivot on) or an empty array **required**
* `columns` is an array of strings (the columns you want to pivot on) or an empty array **required**
* `aggregationDimension` is a string (the category you want to accumulate values for) **required**
* `aggregator` is an enumerated string - either `'sum'`, `'count'`, `'min'`, `'max'`, or `'average'` (the type of accumulation you want to perform). If no type is selected, `'count'` is chosen by default
* `rowHeader` is a string (this value will appear above the rows)

#### Second way to use it:
Parameters are the same as the first except for two, `aggregationDimension` and `aggregator`. Instead of `aggregationDimension` and `aggregator`, you can use the following:
* `CBfunction` is a callback function that receives four parameters `CBfunction(acc, curr, index, arr)` where `acc` is an accumulation value, `curr` is the current element being processed, `index` is the index of the current element being processed and `arr` is the array that is being acted on. This function must return the accumulation value (this is very similar to javascript's `.reduce`) **required**
* `initialValue` is the starting value for the callback function. If no starting value is selected, `0` is used by default.

### Methods/Instance Variables
#### `.data`
Instance variable that returns the data array shown above

#### `.update(dataArray, rows, columns, [aggregationDimension or CBfunction], [aggregator or initialValue], rowHeader)`
Updates the `.data` instance variable.  The `update` method is chainable.

#### `.collapse(rowNum)`
Collapses data into the specified row header provided.  `rowNum` is the row header's current index within the table (**Not** the original row index that is provided in the object).  The `collapse` method is chainable

#### `.expand(rowNum)`
Expands collapsed data that has previously been collapsed.  The `expand` method is chainable.

#### `.toggle(rowNum)`
Toggles data from collapsed to expanded or vice-versa. The `toggle` method is chainable.

#### `.getData(rowNum)`
Returns the data that comprises a collapsed row

#### `.getUniqueValues(fieldName)`
Returns all the unique values for a particular field as an array

#### `.filter([fieldName or CBfunction], filterValues, [filterType])`
Filters out values based on either:
- string `fieldName` field to filter on, array `filterValues` values to filter, string `filterType` optional enumerated string either `'include'` or `'exclude'` (defaults to exclude if not provided)
- function `CBfunction(element, index, array)` which iterates over each element in array (similar to Javascript array `.filter` method)


### Example with callback function
Check out [the  test spec for more examples](/test/index.spec.js).

```js
import Pivot from 'quick-pivot';

function cbFunc(acc, curr, index, arr){
  acc += curr.age;
  if(index === arr.length - 1) return acc / arr.length;
  return acc;
}
const pivot = new Pivot(dataArray, ['gender'], ['house'], cbFunc, 0, 'average age');

console.log(pivot.data.table);
/*
[ { value: [ 'average age', 'Stark', 'Baratheon', 'Lannister', 'aggregated' ],
    depth: 0,
    type: 'colHeader',
    row: 0 },
  { value: [ 'f', 11, 38, '', 20 ], type: 'data', depth: 0, row: 1 },
  { value: [ 'm', 11, 18, 44.333333333333336, 28.833333333333332 ],
    type: 'data',
    depth: 0,
    row: 2 },
  { value: [ '', 11, 28, 44.333333333333336, '' ],
    type: 'aggregated' } ]
*/

pivot.update(dataArray, ['gender', 'name'], ['house'], cbFunc, 0, 'average age')

console.log(pivot.data.table);
/*
[ { value: [ 'average age', 'Stark', 'Baratheon', 'Lannister', 'aggregated' ],
    depth: 0,
    type: 'colHeader',
    row: 0 },
  { value: [ 'f', 11, 38, '', '' ],
    depth: 0,
    type: 'rowHeader',
    row: 1 },
  { value: [ 'Arya', 10, '', '', 10 ],
    type: 'data',
    depth: 1,
    row: 2 },
  { value: [ 'Cersei', '', 38, '', 38 ],
    type: 'data',
    depth: 1,
    row: 3 },
  { value: [ 'Sansa', 12, '', '', 12 ],
    type: 'data',
    depth: 1,
    row: 4 },
  { value: [ 'm', 11, 18, 44.333333333333336, '' ],
    depth: 0,
    type: 'rowHeader',
    row: 5 },
  { value: [ 'Bran', 8, '', '', 8 ],
    type: 'data',
    depth: 1,
    row: 6 },
  { value: [ 'Jaime', '', '', 32, 32 ],
    type: 'data',
    depth: 1,
    row: 7 },
  { value: [ 'Joffrey', '', 18, '', 18 ],
    type: 'data',
    depth: 1,
    row: 8 },
  { value: [ 'Jon', 14, '', '', 14 ],
    type: 'data',
    depth: 1,
    row: 9 },
  { value: [ 'Tyrion', '', '', 34, 34 ],
    type: 'data',
    depth: 1,
    row: 10 },
  { value: [ 'Tywin', '', '', 67, 67 ],
    type: 'data',
    depth: 1,
    row: 11 },
  { value: [ '', 11, 28, 44.333333333333336, '' ],
    type: 'aggregated' } ]
*/

pivot.collapse(1);

console.log(pivot.data.table);
/*
[ { value: [ 'average age', 'Stark', 'Baratheon', 'Lannister', 'aggregated' ],
    depth: 0,
    type: 'colHeader',
    row: 0 },
  { value: [ 'f', 11, 38, '', '' ],
    depth: 0,
    type: 'rowHeader',
    row: 1 },
  { value: [ 'm', 11, 18, 44.333333333333336, '' ],
    depth: 0,
    type: 'rowHeader',
    row: 5 },
  { value: [ 'Bran', 8, '', '', 8 ],
    type: 'data',
    depth: 1,
    row: 6 },
  { value: [ 'Jaime', '', '', 32, 32 ],
    type: 'data',
    depth: 1,
    row: 7 },
  { value: [ 'Joffrey', '', 18, '', 18 ],
    type: 'data',
    depth: 1,
    row: 8 },
  { value: [ 'Jon', 14, '', '', 14 ],
    type: 'data',
    depth: 1,
    row: 9 },
  { value: [ 'Tyrion', '', '', 34, 34 ],
    type: 'data',
    depth: 1,
    row: 10 },
  { value: [ 'Tywin', '', '', 67, 67 ],
    type: 'data',
    depth: 1,
    row: 11 },
  { value: [ '', 11, 28, 44.333333333333336, '' ],
    type: 'aggregated' } ]
*/

console.log(pivot.getData(1));
/*
[ { value: [ 'Arya', [Array], '', '' ], type: 'data', depth: 1 },
  { value: [ 'Cersei', '', [Array], '' ], type: 'data', depth: 1 },
  { value: [ 'Sansa', [Array], '', '' ], type: 'data', depth: 1 } ]
*/

console.log(pivot.getData(1)[0].value)
/*
[ 'Arya',
  [ { name: 'Arya', gender: 'f', house: 'Stark', age: 10 } ],
  '',
  '' ]
*/

pivot.collapse(2);

console.log(pivot.data.table);
/*
[ { value: [ 'average age', 'Stark', 'Baratheon', 'Lannister', 'aggregated' ],
    depth: 0,
    type: 'colHeader',
    row: 0 },
  { value: [ 'f', 11, 38, '', '' ],
    depth: 0,
    type: 'rowHeader',
    row: 1 },
  { value: [ 'm', 11, 18, 44.333333333333336, '' ],
    depth: 0,
    type: 'rowHeader',
    row: 5 },
  { value: [ '', 11, 28, 44.333333333333336, '' ],
    type: 'aggregated' } ]
*/

pivot.expand(1);
console.log(pivot.data.table);
/*
[ { value: [ 'average age', 'Stark', 'Baratheon', 'Lannister', 'aggregated' ],
    depth: 0,
    type: 'colHeader',
    row: 0 },
  { value: [ 'f', 11, 38, '', '' ],
    depth: 0,
    type: 'rowHeader',
    row: 1 },
  { value: [ 'Arya', 10, '', '', 10 ],
    type: 'data',
    depth: 1,
    row: 2 },
  { value: [ 'Cersei', '', 38, '', 38 ],
    type: 'data',
    depth: 1,
    row: 3 },
  { value: [ 'Sansa', 12, '', '', 12 ],
    type: 'data',
    depth: 1,
    row: 4 },
  { value: [ 'm', 11, 18, 44.333333333333336, '' ],
    depth: 0,
    type: 'rowHeader',
    row: 5 },
  { value: [ '', 11, 28, 44.333333333333336, '' ],
    type: 'aggregated' } ]
```

## Changes
Check out the [change log](/CHANGES.md)
