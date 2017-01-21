var data = [
  {name: 'patrick', borough: 'brooklyn', age: '28', gender: 'm'},
  {name: 'greg', borough: 'brooklyn', age: '29', gender: 'm'},
  {name: 'niles', borough: 'manhattan', age: '30', gender: 'm'},
  {name: 'jared', borough: 'manhattan', age: '29', gender: 'm'},
  {name: 'markus', borough: 'manhattan', age: '28', gender: 'm'},
  {name: 'sarah', borough: 'queens', age: '30', gender: 'f'},
  {name: 'vishakh', borough: 'queens', age: '28', gender: 'm'},
  {name: 'jessica', borough: 'brooklyn', age: '28', gender: 'f'}
];

function fixDataFormat(data){
 if(!Array.isArray(data) || !data.length) return [];
 else if(typeof data[0] === 'object' && !Array.isArray(data[0])) return data;
 else{
  return data.reduce((dataColl, row, i, arr) => {
   if(i !== 0){
    if(Array.isArray(row)){
     dataColl.push(row.reduce((acc, curr, index) =>{
      acc[arr[0][index]] = curr;
      return acc;
     }, {})); 
    }else{
     dataColl.push({[arr[0]]: row});
    }
   }
   return dataColl;
  },[]);
 }
}

//console.log(fixDataFormat(data));
//var data2 = ['name', 'patrick', 'bill', 'greg'];
//console.log(fixDataFormat(data2));
// var data3 = [
//   ['name', 'borough', 'age', 'gender'],
//   ['patrick', 'brooklyn', '28', 'm'],
//   ['greg', 'brooklyn', '29', 'm'],
//   ['niles', 'manhattan', '30', 'm'],
//   ['jared', 'manhattan', '29', 'm'],
//   ['markus', 'manhattan', '28', 'm'],
//   ['sarah', 'queens', '30', 'f'],
//   ['vishakh', 'queens', '28', 'm'],
//   ['jessica', 'brooklyn', '28', 'f']
// ];
//console.log(fixDataFormat(data3));
//var data4='hello';
//console.log(fixDataFormat(data4));
//var data5 = [];
//console.log(fixDataFormat(data5));

function groupByCategory(data, groupBy){
  return data.reduce((acc, curr) =>{
    var category = curr[groupBy]
    if(!acc[category]) acc[category] = [];
    acc[category].push(curr);
    return acc;
  }, {});
}

function groupByCategories(data, groups = [], acc = {}){
  if(!data.length) return [];
  
  groups = groups.filter(ele =>{
    return ele in data[0];
  });
  
  if(!groups.length) return data;
  
  var groupCopy = Object.assign([], groups);
  var groupedData = groupByCategory(data, groupCopy.shift());
  var groupedDataKeys = Object.keys(groupedData);
  var children = groupedDataKeys.map(el => {
    return groupedData[el];
  });
  for(var i = 0; i < children.length; i++){
    acc[groupedDataKeys[i]] = groupCopy.length ? {} : [];
    acc[groupedDataKeys[i]] = groupByCategories(children[i], groupCopy, acc[groupedDataKeys[i]]);
  }
  
  return acc;
}

function createColumnHeaders(data, cols = [], firstColumn = ''){
  if(!cols.length) return {columnHeaders: [firstColumn], mapToheader: 1};
  
  var groupedData = groupByCategories(data, cols);
  var columnHeaders = [];
  var mapToHeader = Object.assign({}, groupedData);
  var mapPos = 1;
  
  (function columnHeaderRecursion(data, pos = 0, headerMap){
    if(typeof data !== 'object' || Array.isArray(data)) return 1;
    else{
      var currKeys = Object.keys(data);
      var reqLength = 0;
      for(var i = 0; i < currKeys.length; i++){
        var currLength = columnHeaderRecursion(data[currKeys[i]], pos + 1, headerMap[currKeys[i]]);
        if(Array.isArray(data[currKeys[i]])){
          headerMap[currKeys[i]] = mapPos;
          mapPos += 1;
        }
        reqLength += currLength;
        columnHeaders[pos] = !columnHeaders[pos] ? [firstColumn].concat(Array(currLength).fill(currKeys[i])) : columnHeaders[pos].concat(Array(currLength).fill(currKeys[i]));
      }
      return reqLength;
    }
  })(groupedData, 0, mapToHeader);
  
  return {
    columnHeaders,
    mapToHeader
  };
}

// console.log('headers', createColumnHeaders(data, ['borough', 'gender'], 'Table'));


//accumulator has two different signatures
//1. it takes an array of objects, an accumulation category as a string (like age), and supported accumulation type as a string (like count)
//2. it takes an array of objects, a callback function (which operates the same as reduce), and an initial value
function accumulator(arr, accCat, accType, accValue){
  if(!accCat && typeof accType !== 'function') accType = 'count';
  else if(typeof accCat === 'function'){
    accValue = accType;
    accType = accCat;
  }
  
  return arr.reduce((acc, curr, index, array) => {
    if(typeof accType === 'function'){
      return accType(acc, curr, index, array); 
    }
    switch(accType){
      case('sum'):{
        acc += Number(curr[accCat]);
        return acc;
      }
      
      case('count'):{
        acc += 1;
        return acc;
      }
      
      default:{
        acc += 1;
        return acc;
      }
    }
  }, accValue || 0);
}

// accumulator(data, 'age', 'sum')
// accumulator(data, function(acc, curr, index, array){
//   if(index === array.length - 1) return (acc + parseInt(curr.age)) / array.length;
//   return acc += parseInt(curr.age);
// }, 0)

function tableCreator(data, rows = [], cols = [], accCatOrCB, accTypeOrInitVal){
  const columnData = createColumnHeaders(data, cols);
  const messageIfNoHeaders = typeof accCatOrCB !== 'function' ? `${accTypeOrInitVal} ${accCatOrCB}` : 'Custom Agg';
  const columnHeaders = Array.isArray(columnData.columnHeaders[0]) ? columnData.columnHeaders : [columnData.columnHeaders.concat(messageIfNoHeaders)];
  const mapToHeader = columnData.mapToHeader;
  const headerLength = columnHeaders[0].length;
  
  var dataRows = [];
  var rawData = [];
  var prevKey = '';
  
  function rowRecurse(rowGroups){
    for(var key in rowGroups){
      if(Array.isArray(rowGroups[key])){
        var recursedData = groupByCategories(rowGroups[key], cols);
        
        (function recurseThroughMap(dataPos, map){
          if(Array.isArray(dataPos)){
            if(key === prevKey){
              let datum = dataRows[dataRows.length - 1];
              datum[map] =  accumulator(dataPos, accCatOrCB, accTypeOrInitVal);
              dataRows[dataRows.length - 1] = datum;

              let rawDataDatum = rawData[rawData.length - 1];
              rawDataDatum[map] = [dataPos];
              rawData[rawData.length - 1] = rawDataDatum; 
            }else{
              prevKey = key;
              let datum = [key].concat(Array(map - 1).fill(''), accumulator(dataPos, accCatOrCB, accTypeOrInitVal), Array(headerLength - (map + 1)).fill(''));
              let rawDataDatum = [key].concat(Array(map - 1).fill(''), [dataPos], Array(headerLength - (map + 1)).fill(''));
              rawData.push(rawDataDatum);
              dataRows.push(datum);
            }
          }else{
            for(var innerKey in dataPos){
              recurseThroughMap(dataPos[innerKey], map[innerKey]);
            }
          }
        })(recursedData, mapToHeader || 1);

      }else{
        dataRows.push([key].concat(Array(headerLength - 1).fill('')));
        rowRecurse(rowGroups[key], key);
      }
    }
  }
  
  if(rows.length || cols.length) rowRecurse(groupByCategories(data, rows.length ? rows : cols));
  else{
    dataRows.push([messageIfNoHeaders, accumulator(data, accCatOrCB, accTypeOrInitVal)]);
    rawData = data;
  }
  
  return {
    table: columnHeaders.concat(dataRows),
    rawData
  };
  
}

tableCreator(data, [], ['borough'], 'age', 'sum');
// tableCreator(data, ['gender'], ['borough'], function(acc, curr, index, array){
//   if(index === array.length - 1) return (acc + parseInt(curr.age)) / array.length;
//   return acc += parseInt(curr.age);
// }, 0)
