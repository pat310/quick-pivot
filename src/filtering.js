/**
 * @file Utility functions for filtering functionality
*/

/**
 * Construct an object of field names with the unique values for each field
 * @param {!Array<Object>} data
 * @returns {!Object} Keys are field names, each value is an object with the unique values as keys
*/
export function createUniqueValues(data) {
  return data.reduce((acc, curr) => {
    Object.keys(curr).forEach((fieldName) => {
      if (!acc[fieldName]) acc[fieldName] = {};
      /** by using an object instead of an array, we avoid extra work checking the array for duplicates*/
      acc[fieldName][curr[fieldName]] = true;
    });

    return acc;
  }, {});
};

/**
 * Filter a provided data set
 * @param {!Array<Object>} data
 * @param {string|function} fieldName Callback function or a field name
 * @param {Array<string>} filterValues Values to perform filter on
 * @param {string} filterType Enumerated string either 'include' or 'exclude'
 * @returns {!Array<Object>} filtered data set
*/
export function filter(data, fieldName, filterValues, filterType) {
  /** check that fieldName isn't actually a callback */
  if (typeof fieldName !== 'function') {
    /** filter out the data set based on the provided fieldName and filterValues */
    return data.filter(({[fieldName]: value}) => {
      switch (filterType) {
        case ('include'): {
          return filterValues.indexOf(value) !== -1;
        }

        case ('exclude'): {
          return filterValues.indexOf(value) === -1;
        }

        default: {
          return filterValues.indexOf(value) === -1;
        }
      }
    });
  }

  /** if custom callback provided, filter using the callback */
  return data.filter((dataRow, index, array) => {
    return fieldName(dataRow, index, array);
  });
};
