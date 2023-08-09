
/*
 * @param str (Given Date String)
 * @param dateObj (Date Field Object)
 * @description This function is called when str is not blank.
 */
export const checkValidDateFormats = (str) => {
    str = str.replace(/[ ]/gi, "-").replace(/[*]/gi, "-").replace(/[.]/gi, "-").replace(/[+]/gi, "-").replace(/[/]/gi, "-")
    let split_str = str.split("-");
    if (split_str.length <= 3) { // Within dd,MM and yyyy.
        let DD = parseInt(split_str[0], 10) < 10 ? parseInt("0" + parseInt(split_str[0], 10), 10) : parseInt(split_str[0], 10),
            MM = parseInt(split_str[1], 10) < 10 ? parseInt("0" + parseInt(split_str[1], 10), 10) : parseInt(split_str[1], 10),
            YY = split_str[2],
            isDD = (!isNaN(DD) && DD) ? true : false,
            isMM = (!isNaN(MM) && MM) ? true : false,
            isYY = (!isNaN(YY) && YY) ? true : false,
            currDate = getCurrentDate("yyyy-MM-dd"),
            reqDate = "";
        // console.log(DD, "------", MM, "-------", YY)
        if ((isDD === true && isMM === true  && isYY === true)) {    // All three (dd-MM-yyy)
            let isValidDay1 = checkDay(DD, MM, YY);
            let isValidMonth1 = checkMonth(MM);
            if (isValidDay1 === true && isValidMonth1 === true) {
                return setYear(DD, MM, YY);
            } else {
                console.log("Date out of range. Please ensure you enter proper date.");
                return false
            }
        } else if (isDD === true && isMM === true && split_str.length === 2) {            // Only first two (dd-MM)
            let isValidDay2 = checkDay(DD, MM, YY);
            let isValidMonth2 = checkMonth(MM);
            //console.log(DD+"-DD---"+MM+"-MM---"+YY+"-YY---"+isValidDay2+"-isValidDay2---"+isValidMonth2+"-isValidMonth2")
            if (isValidDay2 === true && isValidMonth2 === true) {
                reqDate = getYear(DD, MM, currDate);
                // console.log("reqDate=====> ", reqDate)
                return reqDate
            } else {
                console.log("Date out of range. Please ensure you enter proper date.")
                return false
            }
        } else if (isDD === true && split_str.length === 1) {                                                // Only first one (dd)
            let isValidDay3 = checkDay(DD, MM, YY);
            if (isValidDay3 === true) {
                reqDate = getMonthYear(DD, currDate);
                return reqDate
                // checkValidDateFormats(reqDate);
            } else {
                console.log("Date out of range. Please ensure you enter proper date.")
                return false
            }
        } else {
            console.log("Please enter proper date in 'dd-MM-yyyy' format.");
            return false
        }
    } else { // Not Within dd,MM and yyyy.
        console.log("Please enter date in 'dd-MM-yyyy' format.")
        return false
    }
}



/*
 * @param DD (Given Day)
 * @param MM (Given Month)
 * @param YY (Given Year)
 * @return true if DD satisfy the valid day range, else false
 */
function checkDay(DD, MM, YY){
    var validDateRange = 31;
    if(MM !== undefined && !isNaN(MM)){
        if(MM === 1 || MM ===3 || MM === 5 || MM === 7 || MM === 8 || MM === 10 || MM === 12){
            validDateRange = 31;
        }else if(MM === 2){
            if(YY === undefined){
                console.log('YY not defined')
            }
            var isLeapYear = isleap(YY);
            validDateRange = isLeapYear === true ? 29 : 28;
        }else{
            validDateRange = 30;
        }
    }    
    return DD !== 0 ? (DD <= validDateRange ? true : false) : false;
}

/*
 * @param MM (Given Month)
 * @return true if MM satisfy the valid month range, else false
 */
function checkMonth(MM){
    var validMonthRange = 12;
    return MM !== 0 ? (MM <= validMonthRange ? true : false) : false;
}

/*
 * @param dateObj (Date Field Object)
 * @param DD (Given Day)
 * @param MM (Given Month)
 * @param YY (Given Year)
 * @description This function is called when DD, MM and YY is given.
 * Checks valid Year format and set required Date to the Date field.
 */
export function setYear(DD, MM, YY){
    var yyStrLen = YY.length,
    prefixStr = "",
    reqDate = DD+"-"+MM+"-"+YY;
        // console.log("DD: "+DD+"\nMM: "+MM+"\nYY: "+YY+"\nyyStrLen: "+yyStrLen)
    if(yyStrLen === 0){
        var d = new Date(),
        mm = (d.getMonth() + 1) < 10 ? "0"+(d.getMonth() + 1) : (d.getMonth() + 1),
        yyyy = d.getFullYear(),
        currYear = parseInt(mm, 10) > 6 ? (parseInt(yyyy, 10) + 1) : parseInt(yyyy, 10);
        reqDate = DD+"-"+MM+"-"+currYear;
    }else if(yyStrLen === 1){
        prefixStr = "200";
        reqDate = DD+"-"+MM+"-"+prefixStr+YY;
    }else if(yyStrLen === 2){
        prefixStr = parseInt(YY, 10) >= 80 && parseInt(YY, 10) <= 99 ? "19" : "20";
        reqDate = DD+"-"+MM+"-"+prefixStr+YY;
    }else if(yyStrLen === 3){
        var d = new Date(),
        mm = (d.getMonth() + 1) < 10 ? "0"+(d.getMonth() + 1) : (d.getMonth() + 1),
        yyyy = d.getFullYear(),
        currYear = parseInt(mm, 10) > 6 ? (parseInt(yyyy, 10) + 1) : parseInt(yyyy, 10);
        reqDate = DD+"-"+MM+"-"+currYear;
    }else if(yyStrLen === 4){
        if(parseInt(YY,10) < 1980){
            console.log("Year cannot be less than 1980");
        }
    }else{
        reqDate = ""
    }
    if(yyStrLen !== 2 && yyStrLen !== 4){
        console.log("Date out of range. Please ensure you enter proper date.");
    }
    // const rDt = getDateInYYYYMMDD(reqDate, "-", "-")
    // console.log('DD MM YY',reqDate)
    return reqDate
}

/*
 * @param DD (Given Day)
 * @param MM (Given Month)
 * @param currDate (Current Date)
 * @description This function is called when DD and MM is given.
 * @return Required Date
 */
function getYear(DD, MM, currDate){
    const vfDt = currDate
    var yy = vfDt.split("-")[0],
        mm = vfDt.split("-")[1],
        reqDate = "";
    if((parseInt(MM, 10) - parseFloat(mm, 10)) > 6 || (parseInt(MM, 10) - parseFloat(mm, 10)) < -1){
        reqDate = DD+"-"+MM+"-"+(parseInt(yy, 10) + 1);
    }else{
        reqDate = DD+"-"+MM+"-"+yy;
    }
    return reqDate;
}

/*
 * @param DD (Given Day)
 * @param currDate (Current Date)
 * @description This function is called when only DD is given.
 * @return Required Date
 */
function getMonthYear(DD, currDate){
    //    console.log("DD: "+DD)
    var yy = currDate.split("-")[0],
    mm = currDate.split("-")[1],
    dd = currDate.split("-")[2],
    nextMM = parseInt(mm, 10) === 12 ? '01' : ((parseInt(mm, 10) + 1) < 10 ? "0"+(parseInt(mm, 10) + 1) : (parseInt(mm, 10) + 1)),
    prevMM = parseInt(mm, 10) === 1 ? 12 : ((parseInt(mm, 10) - 1) < 10 ? "0"+(parseInt(mm, 10) - 1) : (parseInt(mm, 10) - 1)),
    nextYY = parseInt(mm, 10) === 12 ? parseInt(yy, 10) + 1 : yy,
    prevYY = parseInt(mm, 10) === 1 ? parseInt(yy, 10) - 1 : yy,
    calDate = yy+"-"+mm+"-"+DD,
    prevDate = prevYY+"-"+prevMM+"-"+DD,
    nextDate = nextYY+"-"+nextMM+"-"+DD,
    diff1 = "",
    diff2 = "",
    reqDate = "";
    //    console.log("calDate: "+calDate+"\nprevDate: "+prevDate+"\nnextDate: "+nextDate)
    if(parseInt(DD, 10) > parseInt(dd, 10)){
        diff1 = dateDiff(currDate, calDate);
        diff1 = parseInt(diff1, 10) < 0 ? (parseInt(diff1, 10) * (-1)) : diff1;
        diff2 = dateDiff(currDate, prevDate);
        diff2 = parseInt(diff2, 10) < 0 ? (parseInt(diff2, 10) * (-1)) : diff2;
        reqDate = parseInt(diff1, 10) < parseInt(diff2, 10) ? DD+"-"+mm+"-"+yy : DD+"-"+prevMM+"-"+prevYY;
    //        console.log("diff1: "+diff1+"\ndiff2: "+diff2)
    }else if(parseInt(DD, 10) < parseInt(dd, 10)){
        diff1 = dateDiff(currDate, calDate);
        diff1 = parseInt(diff1, 10) < 0 ? (parseInt(diff1, 10) * (-1)) : diff1;
        diff2 = dateDiff(currDate, nextDate);
        diff2 = parseInt(diff2, 10) < 0 ? (parseInt(diff2, 10) * (-1)) : diff2;
        reqDate = parseInt(diff1, 10) < parseInt(diff2, 10) ? DD+"-"+mm+"-"+yy : DD+"-"+nextMM+"-"+nextYY;
    //        console.log("diff1: "+diff1+"\ndiff2: "+diff2)
    }else{
        reqDate = DD+"-"+mm+"-"+yy;
    }  
    return reqDate;
}

/*
 * @param YY (Given Year)
 * @return true if the given year is a Leap Year, else false
 */
function isleap(YY){
    var yr = YY;
    if ((parseInt(yr, 10) % 4) === 0){
        if (parseInt(yr, 10) % 100 === 0){
            if (parseInt(yr, 10) % 400 !== 0){
                //                alert("Not Leap");
                return false;
            }else if(parseInt(yr, 10) % 400 === 0){
                //                alert("Leap");
                return true;
            }
        }else if(parseInt(yr, 10) % 100 !== 0){
            //            alert("Leap");
            return true;
        }
    }
    return false;
}

/*
 * @param format (Required Format)
 * @return Current Date
 */
function getCurrentDate(format){
    var d = new Date(),
    dd = d.getDate() < 10 ? "0"+d.getDate() : d.getDate(),
    mm = (d.getMonth() + 1) < 10 ? "0"+(d.getMonth() + 1) : (d.getMonth() + 1),
    yyyy = d.getFullYear(),
    currDate = "";
    if(format === "yyyy-MM-dd"){
        currDate = yyyy + "-" + mm + "-" + dd;
    }else if(format === "dd-MM-yyyy"){
        currDate = dd + "-" + mm + "-" + yyyy;
    }
    return currDate;
}

/*
 * @param date (Given Date)
 * @param separator (Given Separator)
 * @param reqseparator (Required Separator)
 * @return Given Date in yyyy-MM-dd
 */
export function getDateInYYYYMMDD(date){
    
    if (date !== undefined) {
        const date_split = date.split('-');
        let mm = parseInt(date_split[1], 10) < 10 ? '0' + date_split[1] : date_split[1] ;
        let dd =  parseInt(date_split[0], 10) < 10 ? '0' + date_split[0] :  date_split[0];
        let yyyy = date_split[2];
        let date1 = yyyy + '-' + mm.slice(-2) + '-' + dd.slice(-2)  ;
        console.log('new date', date1);
        return date1
      }
}

/*
 * @param v_fromDate (Voucher Period From Date)
 * @param v_toDate (Voucher Period To Date)
 * @param date (Given Date)
 * @return true if given date is within period range, else false
 */
function checkVperiodDate(v_fromDate, v_toDate, date){
    //    console.log("v_fromDate: "+v_fromDate+"\nv_toDate: "+v_toDate+"\ndate: "+date)
    var fDate = new Date(v_fromDate),
    tDate = new Date(v_toDate),
    avlDate = new Date(date);
    //    console.log("fDate: "+fDate+"\ntDate: "+tDate+"\ndate: "+avlDate)
    return fDate.getTime() <= avlDate.getTime() && avlDate.getTime() <= tDate.getTime();    
}

/*
 * @return Difference between two dates in number of day
 */
function dateDiff(date1, date2){ //date1: To Date(greater)-----date2: From Date(smaller)
    //    console.log("date1: "+date1+"\ndate2: "+date2)
    var dt1 = new Date(date1);
    var dt2 = new Date(date2);
    var oneDay=1000*60*60*24;    
    return Math.ceil((dt1.getTime()-dt2.getTime())/oneDay);
}

function timeDiff(time1, time2){//time1: To Time(greater)-----time2: From Time(smaller)
    //    console.log("date1: "+date1+"\ndate2: "+date2)
    var hms1 = time1;  
    var hms2 = time2;  
    var a = hms1.split(':');
    var b = hms2.split(':');
    var seconds1 = ((+a[0]) * 60 * 60) + (+a[1]) * 60; 
    var seconds2 = ((+b[0]) * 60 * 60) + (+b[1]) * 60; 
    
    return Math.ceil((seconds1-seconds2));
}