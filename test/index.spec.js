import 'babel-polyfill';
import constructorTest from './index/constructor';
import collapseTest from './index/collapse';
import collapseAllTest from './index/collapseAll';
import getDataTest from './index/getData';
import expandTest from './index/expand';
import expandAllTest from './index/expandAll';
import toggleTest from './index/toggle';
import getUniqueValuesTest from './index/getUniqueValues';
import filterTest from './index/filter';
import updateTest from './index/update';

describe('pivot', () => {
  describe('constructor', constructorTest);
  describe('collapse', collapseTest);
  describe('collapseAll', collapseAllTest);
  describe('getData', getDataTest);
  describe('expand', expandTest);
  describe('expandAll', expandAllTest);
  describe('toggle', toggleTest);
  describe('getUniqueValues', getUniqueValuesTest);
  describe('filter', filterTest);
  describe('update', updateTest);
});
