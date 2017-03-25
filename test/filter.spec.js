import 'babel-polyfill';
import createUniqueValuesTest from './filtering/createUniqueValues';
import filterTest from './filtering/filter';

describe('filtering', () => {
  describe('createUniqueValues', createUniqueValuesTest);
  describe('filter', filterTest);
});
