
import moment from 'moment'
import Fuse from 'fuse.js'


export const displayAmtInLakh = (val) =>{
    const reg = /(\d)(?=(\d{2})+\d\.)/g
    return parseFloat(val).toFixed(2).replace(reg, '$1,')  
  } 
  

export const displayDate = (val) => {
    if (moment(val).isValid())  
        return moment(val).format("DD-MM-YYYY")        
    return ""
}

export const textFilter = (filteredItms, filters ) => {
    const cols = Object.keys(filters)
    let v = '',
        key = []
    if(cols.length > 0){
        cols.forEach(col=>{
            if (filters[col].str != '' && filters[col].type === 'text'){
                v = filters[col].str
                key = filters[col].keys
            }
        })
    }
    if(v !== ''){
        const options = {
            tokenize: false,
            threshold: 0,
            location: false,
            findAllMatches: true,
            minMatchCharLength: 1,
            keys: key
        };
        let fuse = new Fuse(filteredItms, options)
        filteredItms = fuse.search(v)
    }    
    return filteredItms
}