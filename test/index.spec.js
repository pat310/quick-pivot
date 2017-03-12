import constructorTest from './index/constructor';
import collapseTest from './index/collapse';
import getDataTest from './index/getData';
import expandTest from './index/expand';
import toggleTest from './index/toggle';

describe('pivot', () => {
  describe('constructor', constructorTest);
  describe('collapse', collapseTest);
  describe('getData', getDataTest);
  describe('expand', expandTest);
  describe('toggle', toggleTest);
});
