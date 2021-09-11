import {format2Month, formatToMinute, formatToMinuteWithoutYear} from "../utils/dateFormat";
import {Message} from 'element-ui'
import {getSmoothLineTemplate, getBarTemplate} from "../components/charts-config/theme1-config";
import {statisticalPatternsEnums} from "../entity/enumns";


/**
 *判断一个对象是否为空
 */
export const isEmpty = (obj) => {
    if (obj === undefined || obj === null || obj === '') {
        return true
    }
    return false
};

/**
 * 提示函数
 * 禁止点击蒙层、显示3秒后关闭
 */
export const errorTip = msg => {
    if (msg == null || msg === '') {
        msg = '发生未知错误，请联系管理员'
    }
    Message.error({
        message: msg,
        duration: 3000,
        showClose: true,
        center: true,
        customClass:'zZindex'
    })
};

// 信息提示
export const infoTip = msg => {
    Message.info({
        message: msg,
        duration: 3000,
        showClose: true,
        center: true,
        customClass:'zZindex'
    })
};


/*时间范围为空时，添加默认显示时间，并组织查询对象到一个新的对象*/
export const getChartsQueryDtoOfID = (chartsSearchDto) => {
    let queryDtoRes = {};
    //当未选择起止时间的时候，赋一个默认的起始时间
    let timeRange = {};
    // 当起止时间都没有的时候
    if (isEmpty(chartsSearchDto.startTime) && isEmpty(chartsSearchDto.endTime)) {
        timeRange = getDefaultTimeRangeByTimeHorizon(chartsSearchDto.timeHorizon);
    } else {    // 当起止时间有可能有时
        timeRange = getTimeRangeByTimeHorizon(chartsSearchDto);
    }
    queryDtoRes.startTime = timeRange.startTime;
    queryDtoRes.endTime = timeRange.endTime;
    /*case列出所有监控可能出现的查询条件字段，以便复用*/
    for (let key in chartsSearchDto) {
        switch (key) {
            case 'timeHorizon':
            case 'decsId':
            case 'decsIds':
            case 'prodId':
            case 'nodeId':
            case 'nodeIds':
            case 'statusCodes':
            case 'errorCodes':
                queryDtoRes[key] = chartsSearchDto[key];
        }
    }
    return queryDtoRes;
};


/*根据统计方式计算默认的开始时间和结束时间*/
export const getDefaultTimeRangeByTimeHorizon = (timeHorizon) => {
    let now = new Date();
    let timeRange = {'startTime': '', 'endTime': ''};
    switch (timeHorizon) {
        case statisticalPatternsEnums.ONEMINUTE.code:    //按分钟，默认展示一小时的数据量
            timeRange.endTime = formatToMinute(now);
            timeRange.startTime = formatToMinute(new Date(now.getTime() - 59 * 60 * 1000));
            break;
        case statisticalPatternsEnums.FIVEMINUTE.code:   //按五分钟，默认展示两小时的数据量
            // 将五分钟之内的零头抹掉
            let endTime1 = now.getTime() - (now.getMinutes() % 5) * 60 * 1000;
            timeRange.endTime = formatToMinute(new Date(endTime1));
            timeRange.startTime = formatToMinute(new Date(endTime1 - 115 * 60 * 1000));
            break;
        case statisticalPatternsEnums.THIRTYMINUTE.code: //按三十分钟，默认展示两天的数据量
            let endTime2 = now.getTime() - (now.getMinutes() % 30) * 60 * 1000;
            timeRange.endTime = formatToMinute(new Date(endTime2));
            timeRange.startTime = formatToMinute(new Date(endTime2 - 47 * 30 * 60 * 1000));
            break;
        case statisticalPatternsEnums.ONEHOUR.code:  //按小时，默认展示两天的数据量
            let endTime3 = now.getTime() - (now.getMinutes() % 60) * 60 * 1000;
            timeRange.endTime = formatToMinute(new Date(endTime3));
            timeRange.startTime = formatToMinute(new Date(endTime3 - 47 * 60 * 60 * 1000));
            break;
        case statisticalPatternsEnums.ONEDAY.code:   //按每天，默认展示一周的数据量
            let endTime4 = now.getTime() - (now.getHours() % 24) * 60 * 60 * 1000 - (now.getMinutes() % 60) * 60 * 1000;
            timeRange.endTime = formatToMinute(new Date(endTime4));
            timeRange.startTime = formatToMinute(new Date(endTime4 - 6 * 24 * 60 * 60 * 1000));
            break;
        default:    //默认按分钟，默认展示一小时的数据量
            timeRange.endTime = formatToMinute(now);
            timeRange.startTime = formatToMinute(new Date(now.getTime() - 59 * 60 * 1000));
            break;
    }
    return timeRange;
};


// 截取到分钟
export const getTimeRangeByTimeHorizon = (chartsSearchDto) => {
    let timeRange = {'startTime': '', 'endTime': ''};
    timeRange.startTime = isEmpty(chartsSearchDto.startTime) ? '' : formatToMinute(new Date(chartsSearchDto.startTime));
    timeRange.endTime = isEmpty(chartsSearchDto.endTime) ? '' : formatToMinute(new Date(chartsSearchDto.endTime));
    return timeRange;
};


//根据统计方式验证时间范围是否正确
export const validateTimeInterval = function ({startTime, endTime, timeHorizon}) {
    if (isEmpty(startTime) && isEmpty(endTime)) {
        return true;
    } else if (isEmpty(startTime) || isEmpty(endTime)) {
        errorTip("请将时间范围填写完整")
        return false;
    }

    // 覆盖分钟，5分钟，30分钟，小时，天统计的时间检查
    let nowDate = new Date();
    let endDate = new Date(endTime + ":00");    // 扩充到秒
    if (endDate > nowDate) {
        errorTip("时间超出当前时间，请重新选择");
        return false;
    }
    // 开始时间和结束时间的时间差，以分钟为单位
    let date1 = new Date(startTime.replace(/\-/g, "/") + ":00");
    let date2 = new Date(endTime.replace(/\-/g, "/") + ":00");
    let timeDif = parseInt(date2 - date1) / 1000 / 60;

    if(timeDif <= 0){
        errorTip("结束时间不得小于或等于开始时间");
        return false;
    }
    if (timeHorizon == statisticalPatternsEnums.ONEMINUTE.code && timeDif < 2) {
        errorTip("按分钟统计，时间差不能少于2分钟，请重新选择");
        return false;
    } else if (timeHorizon == statisticalPatternsEnums.FIVEMINUTE.code && timeDif < 10) {
        errorTip("按五分钟统计，时间差不能少于10分钟，请重新选择");
        return false;
    } else if (timeHorizon == statisticalPatternsEnums.THIRTYMINUTE.code && timeDif < 60) {
        errorTip("按三十分钟统计，时间差不能少于1小时，请重新选择");
        return false;
    } else if (timeHorizon == statisticalPatternsEnums.ONEHOUR.code && timeDif < 120) {
        errorTip("按小时统计，时间差不能少于2小时，请重新选择");
        return false;
    } else if (timeHorizon == statisticalPatternsEnums.ONEDAY.code && timeDif < 2 * 24 * 60) {
        errorTip("按天统计，时间差不能少于2天，请重新选择");
        return false;
    } else {
        return true;
    }
};



//解析获取x轴时间数据xAxisData,参数为List<T> lastResult
export const getXAxisData = (lastResult,timeHorizon) => {
    let xAxisData = [];
    for (let i in lastResult) {
        //按月的进行特殊处理
        if(timeHorizon == '8'){
            xAxisData.push(format2Month(new Date(lastResult[i].transDate)));
        }else{
            xAxisData.push(formatToMinuteWithoutYear(new Date(lastResult[i].transDate)));
        }
    }
    return xAxisData;
};


//(多个bar叠加在同一个柱子上)解析获取SeriesData，适用于交易量堆叠柱形图，参数为lastResultNumList：String name,List<T> lastResult
export const getSeriesDataOfNum = lastResultNumList => {
    let seriesData = [];
    for (let i in lastResultNumList) {
        let seriesDataItem = getBarTemplate({
            stack: '统计类型(时延区间/状态码/决策值等)',
            // name: lastResultNumList[i].name,
            data: []
        }, i);
        let lastResult = lastResultNumList[i].lastResult;
        for (let j in lastResult) {
            seriesDataItem.data.push(lastResult[j].transCnt);
        }
        seriesData.push(seriesDataItem);
    }
    return seriesData;
};


//解析获取SeriesData，适用于占比折线图，参数为lastResultPctList：String name,List<T> lastResult
export const getSeriesDataOfPct = lastResultPctList => {
    let seriesData = [];
    for (let i in lastResultPctList) {
        let seriesDataItem = getSmoothLineTemplate({
            name: lastResultPctList[i].name,
            data: []
        }, i);
        let lastResult = lastResultPctList[i].lastResult;
        for (let j in lastResult) {
            // seriesDataItem.data.push((lastResult[j].transPct * 100).toFixed(2));
            seriesDataItem.data.push(lastResult[j].transCnt);
        }
        seriesData.push(seriesDataItem);
    }
    return seriesData;
};

// 默认的起止时间（进入页面）
export const getDefaultTimeRange = () => {
    let now = new Date();
    let timeRange = {'startTime': '', 'endTime': ''};
    timeRange.endTime = formatToMinute(now);
    timeRange.startTime = formatToMinute(new Date(now.getTime() - 59 * 60 * 1000));
    return timeRange;
};

// pie数据生成
export const getDataOfPie = lastResult => {
    let data = [];
    for (let i in lastResult) {
        let pieDto = {"value": 0, "name": ""};
        pieDto.name = lastResult[i].name;
        pieDto.value = lastResult[i].transNum;
        if (pieDto.value > 0) {
            data.push(pieDto);
        }
    }
    return data;
};


