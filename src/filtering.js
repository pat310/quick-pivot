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
  return data.filter(({[fieldName]: value}) => {
    if (typeof filterValues !== 'function') {
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
    }

    return filterValues(value);
  });
};
