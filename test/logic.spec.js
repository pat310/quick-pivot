import 'babel-polyfill';
import fixDataFormatTest from './logic/fixDataFormat';
import groupByCategoryTest from './logic/groupByCategory';
import groupByCategoriesTest from './logic/groupByCategories';
import createColumnHeadersTest from './logic/createColumnHeaders';
import accumulatorTest from './logic/accumulator';
import checkPivotCategoriesTest from './logic/checkPivotCategories';
import tableCreatorTest from './logic/tableCreator';

describe('logic functions', () => {
  describe('fixDataFormat', fixDataFormatTest);
  describe('groupByCategory', groupByCategoryTest);
  describe('groupByCategories', groupByCategoriesTest);
  describe('createColumnHeaders', createColumnHeadersTest);
  describe('accumulator', accumulatorTest);
  describe('checkPivotCategories', checkPivotCategoriesTest);
  describe('tableCreator', tableCreatorTest);
});
