'use strict';

const {
  fixDataFormat,
  groupByCategory,
  groupByCategories,
  createColumnHeaders,
  accumulator,
  tableCreator
} = require('./logic');

const chai = require('chai');
const expect = chai.expect;

describe('fixDataFormat', function(){
  function isEqualCheck(data1, data2){
    if(data1.length !== data2.length) return false;
    return data1.every((dataRow, i) =>{
      return Object.keys(dataRow).every(rowKey =>{
        return dataRow[rowKey] === data2[i][rowKey];
      });
    });
  }

  var data = [
    {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
    {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
    {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
    {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
    {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'},
    {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
    {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'},
    {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'}
  ];

  it('should leave data alone if it is properly formatted', function(){
    var newData = fixDataFormat(data);
    expect(isEqualCheck(data, newData)).to.be.true;
  });

  it('should turn an array of data into array of objects', function(){
    var arrayData = [
      ['name', 'borough', 'age', 'gender'],
      ['patrick', 'brooklyn', '28', 'm'],
      ['greg', 'brooklyn', '29', 'm'],
      ['niles', 'manhattan', '30', 'm'],
      ['jared', 'manhattan', '29', 'm'],
      ['markus', 'manhattan', '28', 'm'],
      ['sarah', 'queens', '30', 'f'],
      ['vishakh', 'queens', '28', 'm'],
      ['jessica', 'brooklyn', '28', 'f']
    ];

    var newData = fixDataFormat(arrayData);
    expect(isEqualCheck(data, newData)).to.be.true;
  });

  it('should turn an array of data into an array of objects', function(){
    var data = ['name', 'patrick', 'bill', 'greg'];
    var newData = fixDataFormat(data);
    var expectedData = [{name: 'patrick'}, {name: 'bill'}, {name: 'greg'}];
    expect(isEqualCheck(expectedData, newData)).to.be.true;
  });

  it('should return an empty array if given an empty array', function(){
    var newData = fixDataFormat([]);
    expect(newData).to.be.empty;
  });

  it('should return an empty array if given something other than an array', function(){
    var newData = fixDataFormat('i am data');
    expect(Array.isArray(newData)).to.be.true;
    expect(newData).to.be.empty;
  });
});
