import { expect } from 'chai';
import { checkPivotCategories } from '../../src/logic.js';

export default () => {
  const actualCategories = {
    pig: 'babe',
    fish: 'filet',
    dog: 'henry',
  };

  it('should return undefined if pivot category exists', () => {
    expect(checkPivotCategories(actualCategories, ['dog'])).to.be.undefined;
  });

  it('should throw an error if pivot category does not exist', () => {
    const errorFunc = checkPivotCategories.bind(
        null, actualCategories, ['cat']);

    expect(errorFunc).to.throw(Error);
  });
};
