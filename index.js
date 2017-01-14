// var data = [
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

function grouper(data, groupBy){
  return data.reduce((acc, curr) =>{
    var category = curr[groupBy]
    if(!acc[category]) acc[category] = [];
    acc[category].push(curr);
    return acc;
  }, {});
}

function groupRecursion(data, groups = [], acc = {}){
  if(!groups.length) return data;
  else{
    var groupCopy = Object.assign([], groups);
    var groupedData = grouper(data, groupCopy.shift());
    var groupedDataKeys = Object.keys(groupedData);
    var children = groupedDataKeys.map(el => {
      return groupedData[el];
    });
    for(var i = 0; i < children.length; i++){
      acc[groupedDataKeys[i]] = groupCopy.length ? {} : [];
      acc[groupedDataKeys[i]] = groupRecursion(children[i], groupCopy, acc[groupedDataKeys[i]]);
    }
  }
  
  return acc;
}

function createColumnHeaders(data, cols = [], firstColumn = ''){
  var groupedData = groupRecursion(data, cols);
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

function accumulationFunction(arr, accCat, accType){
  if(!accCat) accType = 'count';
  return arr.reduce((acc, curr) => {
    switch(accType){
      case('sum'):{
        acc += parseInt(curr[accCat]);
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
  }, 0);
}

// accumulationFunction(data, 'age', 'sum')

function tableCreator(data, rows = [], cols = [], accCategory, accType){
  const {
    columnHeaders ,
    mapToHeader
  }= createColumnHeaders(data, cols);
  const headerLength = columnHeaders.length ? columnHeaders[0].length : 0;
  // console.log('map', mapToHeader, '\nheader', columnHeaders, '\nlength', headerLength)
  
  var dataRows = [];
  
  function rowRecurse(rowGroups){
    for(var key in rowGroups){
      if(Array.isArray(rowGroups[key])){

        var recursedData = groupRecursion(rowGroups[key], cols);
        
        (function recurseThroughMap(dataPos, map){
          if(Array.isArray(dataPos)){
            console.log('data pos', dataPos)
            var datum = [key].concat(Array(map).fill(''), accumulationFunction(dataPos, accCategory, accType), Array(headerLength - (map + 1)).fill(''));
            dataRows.push(datum)
          }else{
            for(var innerKey in dataPos){
              recurseThroughMap(dataPos[innerKey], map[innerKey]);
            }
          }
        })(recursedData, mapToHeader)
        
      }else{
        dataRows.push([key].concat(Array(headerLength).fill('')))
        rowRecurse(rowGroups[key], key)
      }
    }
  }
  
  // for(var i = 0; i < rows.length; i++){
  //   rowRecurse(groupRecursion(data, rows.slice(0, i + 1)))
  // }

  rowRecurse(groupRecursion(data, rows));
  
  return columnHeaders.concat(dataRows);
  
}

tableCreator(data, ['gender'], ['borough'], 'age', 'sum')



// function accumulator(data, cat, accCategory, accType){
//   return data.reduce((acc, curr) =>{
//     var category = curr[cat];
//     if(!acc[category]) acc[category] = {acc: 0, data: []};
//     acc[category].data.push(curr);
//     switch(accType){
//       case('sum'):{
//         acc[category].acc += parseFloat(curr[accCategory]);
//         return acc;
//       }
      
//       case('count'):{
//         acc[category].acc += 1;
//         return acc;
//       }
      
//       default:{
//         acc[category].acc += 1;
//         return acc;
//       }
//     }
//   }, {});
// }

// function createTable(data, rows, cols, value, type){
//   var colHeaders = ['columns'].concat(Object.keys(grouper(data, cols[0])));
//   var rowGroups = grouper(data, rows[0]);
  
//   var table = Object.assign([colHeaders]);
//   var groupedData = {};
  
//   for(var key in rowGroups){
//     var accumulated = accumulator(rowGroups[key], cols[0], value, type);
//     groupedData[key] = accumulated;
//     var newRow = colHeaders.map((col, i) => {
//       if(i === 0) return key;
//       else return typeof accumulated[col] !== 'undefined' ? accumulated[col].acc : '';
//     })
//     table.push(newRow);
//   }
  
//   return {
//     table: table,
//     groupedData: groupedData
//   };
// }

// createTable(data, ['name'], ['borough'], 'age', 'sum')