// RXCUI|GENERIC_RXCUI|TTY|FULL_NAME|RXN_DOSE_FORM|FULL_GENERIC_NAME|BRAND_NAME|DISPLAY_NAME|ROUTE|NEW_DOSE_FORM|STRENGTH|SUPPRESS_FOR|DISPLAY_NAME_SYNONYM|IS_RETIRED|SXDG_RXCUI|SXDG_TTY|SXDG_NAME|PSN

var str = `
1000000|999996|SBD|amlodipine 5 MG / hydrochlorothiazide 12.5 MG / olmesartan medoxomil 40 MG Oral Tablet [Tribenzor]|Oral Tablet|amlodipine 5 MG / hydrochlorothiazide 12.5 MG / olmesartan medoxomil 40 MG Oral Tablet|TRIBENZOR|TRIBENZOR (Oral Pill)|Oral Pill|Tab|5-12.5-40 mg||||1182147|SBDG|Tribenzor Pill|TRIBENZOR 40 MG / 5 MG / 12.5 MG Oral Tablet
1000001||SCD|amlodipine 5 MG / hydrochlorothiazide 25 MG / olmesartan medoxomil 40 MG Oral Tablet|Oral Tablet|amlodipine 5 MG / hydrochlorothiazide 25 MG / olmesartan medoxomil 40 MG Oral Tablet||amLODIPine/Hydrochlorothiazide/Olmesartan (Oral Pill)|Oral Pill|Tab|5-25-40 mg||HCTZ||1152278|SCDG|amlodipine / hydrochlorothiazide / olmesartan Pill|olmesartan medoxomil 40 MG / amLODIPine 5 MG / hydroCHLOROthiazide 25 MG Oral Tablet
`

// var cells = str.split('|').map(function (el) { return el.split(/\s+/); });
// var headings = cells.shift();
// var out = cells.map(function (el) {
//   var obj = {};
//   for (var i = 0, l = el.length; i < l; i++) {
//     obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
//   }
//   return obj;
// });

// console.log(JSON.stringify(out, null, 2));
const fs = require('fs');
const readline = require('readline');
const readInterface = readline.createInterface({
    input: fs.createReadStream('c:/drugsearch/data/RxTerms202103.txt'),
    output: process.stdout,
    console: false
});

let count = 0;
var fd = fs.createWriteStream('c:/drugsearch/data/RxTerms202103.json', {flags: 'a'});  
readInterface.on('line', function(line) {    
    // let fd;
    // if (!fd)
    //     fd = fs.createWriteStream('c:/drugsearch/data/RxTerms202103.json', {flags: 'a'});    
    if (count++ === 0) {
        
        fd.write("[");
        convertColumnList(line); // row 1, column name
        return;
    }
    // convert one line
    var lj = convertline(line);
    console.log(count,lj); 

    fd.write(lj);       
    fd.write(",");
});


// readInterface.close(); // close all
// fd.close();


var columnList;
const convertColumnList = (line) => {
    columnList = line.split("|");
    //console.log(columnList);
};
const convertline = (line) => {
    // COLUMN HEADER (total 18)
    // RXCUI|GENERIC_RXCUI|TTY|FULL_NAME|RXN_DOSE_FORM|FULL_GENERIC_NAME|BRAND_NAME|
    // DISPLAY_NAME|ROUTE|NEW_DOSE_FORM|STRENGTH|SUPPRESS_FOR|DISPLAY_NAME_SYNONYM|IS_RETIRED|SXDG_RXCUI|SXDG_TTY|SXDG_NAME|PSN
    // 1st COLUMN:
    // 1000000|999996|SBD|amlodipine 5 MG / hydrochlorothiazide 12.5 MG / olmesartan medoxomil 40 MG Oral Tablet [Tribenzor]|Oral Tablet|amlodipine 5 MG / hydrochlorothiazide 12.5 MG / olmesartan medoxomil 40 MG Oral Tablet
    // |TRIBENZOR|TRIBENZOR (Oral Pill)|Oral Pill|Tab|5-12.5-40 mg||||1182147|SBDG|Tribenzor Pill|TRIBENZOR 40 MG / 5 MG / 12.5 MG Oral Tablet
    const tokens = line.split("|");

    // create json
    let lineInJson = "{";
    var i;
    for (i=0;i<columnList.length; i++){
        lineInJson += `"${columnList[i]}":"${tokens[i]}",`;
    }
    // remove the last ,
    // str = str.replace(/,\s*$/, "");
    lineInJson = lineInJson.replace(/,\s*$/, "");
    lineInJson += "}";
    //console.log(lineInJson);
    return lineInJson;
}
