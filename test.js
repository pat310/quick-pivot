'use strict';

const {
  fixDataFormat,
  groupByCategory,
  groupByCategories,
  createColumnHeaders,
  accumulator,
  tableCreator
} = require('./logic');

console.log('this is fixDataFormat', fixDataFormat);

var chai = require('chai').expect;
const assert = require('assert');
describe('Array', function(){
  it('should return -1', function(){
    assert.equal(-1, [1,2,3].indexOf(4));
  });
});
