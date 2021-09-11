export const dateFormat = (function (date) {
    let second = fillZero(date.getSeconds());
    return formatToMinute(date) + ':' + second;
});


export const  formatYMDHM = (date)=>{
  let year = date.getFullYear();
  let month = fillZero(date.getMonth() + 1);
  let day = fillZero(date.getDate());
  let hour = fillZero(date.getHours());
  let minute = fillZero(date.getMinutes());
  return `${year}-${month}-${day} ${hour}:${minute}`
}

export const formatToMinuteWithoutYear = (function (date) {
    let month = fillZero(date.getMonth() + 1);
    let day = fillZero(date.getDate());
    let hour = fillZero(date.getHours());
    let minute = fillZero(date.getMinutes());
    return month + '-' + day + ' ' + hour + ':' + minute;
});

export const formatToMinute = (function (date) {
    let year = date.getFullYear();
    return year + '-' + formatToMinuteWithoutYear(date);
});

export const format2Date = (function(date) {
    if(date === undefined || !(date instanceof Date)) {
        return "";
    }
    let year = date.getFullYear();
    let month = fillZero(date.getMonth() + 1);
    let day = fillZero(date.getDate());
    return year + '-' + month + '-' + day;
});

const fillZero = function (num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return num;
    }
};

export const format2Month = (function(date) {
    if(date === undefined || !(date instanceof Date)) {
        return "";
    }
    let year = date.getFullYear();
    let month = fillZero(date.getMonth() + 1);
    return year + '-' + month;
});



