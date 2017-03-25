export function createUniqueValues(data) {
  return data.reduce((acc, curr) => {
    Object.keys(curr).forEach((fieldName) => {
      if (!acc[fieldName]) acc[fieldName] = {};
      acc[fieldName][curr[fieldName]] = true;
    });

    return acc;
  }, {});
};
