export function createUniqueValues(data) {
  return data.reduce((acc, curr) => {
    Object.keys(curr).forEach((fieldName) => {
      if (!acc[fieldName]) acc[fieldName] = {};
      acc[fieldName][curr[fieldName]] = true;
    });

    return acc;
  }, {});
};

export function filter(data, fieldName, filterValues, filterType) {
  if (typeof fieldName !== 'function') {
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

  return data.filter((dataRow, index, array) => {
    return fieldName(dataRow, index, array);
  });
};
