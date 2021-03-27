
//import { debounce } from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';
const search=document.getElementById('search');
const matchList=document.getElementById('match-list');
const numfound=document.getElementById("numfound");

const res = await fetch('../data/RxTerms202103.json');
const druglist = await res.json();

const debounce = (func, wait) => {
    let timeout;
  
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

// Search drug.json and filter it
const searchDrugs = async searchText => {
    
    console.log(searchText);
    // Get matches to current text input
    
    // const searcher = new FuzzySearch(druglist, ['FULL_NAME'], {
    //     caseSensitive: false,
    //   });
    //const matches = searcher.search(searchText);
   // regular search
   if (searchText.length < 2){
    numfound.innerHTML = '';
    matchList.innerHTML = '';
    return;
   }

    let st = searchText.toLowerCase().split(' ');
    let matches = druglist.filter( drug => {        
        // 1. let regex  = new RegExp(st.join("|"), "i");
        // 1. return regex.test(drug.FULL_NAME);
        return st.every( s => drug.FULL_NAME.toLowerCase().indexOf(s) !== -1);
        // 2. const regex = new RegExp(`^${searchText}`, 'gi');
        // 2. return drug.FULL_NAME.match(regex); // || drug.FULL_GENERIC_NAME.match(regex);
    });
    

    if (searchText.length < 2){
        matches = [];
        matchList.innerHTML = '';
        numfound.innerHTML = '';
    }
    outputNumFound(matches.length);
    //outputHtml(matches);
    outputHtmlWithHilight(matches, st);
}
const betterSearchDrug = debounce(searchDrugs, 500);
const outputHtmlWithHilight = (matches, st) => {
    if (matches.length > 0){
        const html = matches.map(match => {
            let regix = new RegExp(st.join('|'), "ig");
            let tmp = String(match.FULL_NAME);
            let str = tmp.replaceAll(regix, '<span class=\'highlight\'>$&</span>');
            
            return `
                <div class="suggestion card card-body mb-1">
                    <h5>${str}                 
                    </h5>
                    <small>RXCUI : <span class="text-primary">${match.RXCUI}</span> / SXDG_NAME: ${match.SXDG_NAME} / PSN: ${match.PSN}</small>
                </div>
                `}).join('');

        matchList.innerHTML = html;
    }
    else{
        matchList.innerHTML = '';
    }
}
const outputHtml = matches => {
    /*
    {"RXCUI":"999996","GENERIC_RXCUI":"","TTY":"SCD","FULL_NAME":"amlodipine 5 MG / hydrochlorothiazide 12.5 MG / olmesartan medoxomil 40 MG Oral Tablet",
    "RXN_DOSE_FORM":"Oral Tablet",
    "FULL_GENERIC_NAME":"amlodipine 5 MG / hydrochlorothiazide 12.5 MG / olmesartan medoxomil 40 MG Oral Tablet","BRAND_NAME":"",
    "DISPLAY_NAME":"amLODIPine/Hydrochlorothiazide/Olmesartan (Oral Pill)","ROUTE":"Oral Pill","NEW_DOSE_FORM":"Tab",
    "STRENGTH":"5-12.5-40 mg","SUPPRESS_FOR":"","DISPLAY_NAME_SYNONYM":"HCTZ","IS_RETIRED":"",
    "SXDG_RXCUI":"1152278","SXDG_TTY":"SCDG","SXDG_NAME":"amlodipine / hydrochlorothiazide / olmesartan Pill",
    "PSN":"olmesartan medoxomil 40 MG / amLODIPine 5 MG / hydroCHLOROthiazide 12.5 MG Oral Tablet"}
    */
    if (matches.length > 0){
        const html = matches.map(match => `
            <div class="suggestion card card-body mb-1">
                <h5>${match.FULL_NAME}                 
                </h5>
                <small>RXCUI : <span class="text-primary">${match.RXCUI}</span> / SXDG_NAME: ${match.SXDG_NAME} / PSN: ${match.PSN}</small>
            </div>
        `).join('');

        matchList.innerHTML = html;
    }
    else{
        matchList.innerHTML = '';
    }
}
const outputNumFound = num => {
    if (num === 0){
        numfound.innerHTML = '';
        return;
    }
    const html = `<h2>${num} Found!</h2>`;
    numfound.innerHTML = html;
}
// function debounce(func, wait, immediate) {
//     var timeout;
  
//     return function executedFunction() {
//       var context = this;
//       var args = arguments;
          
//       var later = function() {
//         timeout = null;
//         if (!immediate) func.apply(context, args);
//       };
  
//       var callNow = immediate && !timeout;
      
//       clearTimeout(timeout);
  
//       timeout = setTimeout(later, wait);
      
//       if (callNow) func.apply(context, args);
//     };
//   };
search.addEventListener('input', () => betterSearchDrug(search.value));

