/*各个组件当中共用到的一些公共的工具方法*/
/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
    if (document.addEventListener) {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler)
            }
        }
    }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
    if (document.removeEventListener) {
        return function (element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler)
            }
        }
    }
})();

/**
 * @description 生成随机数
 */
export function randomData() {
  return Math.round(Math.random()*500);
}

/**
 *  echarts tooltip 自动轮播
 *  @param myChart  //初始化echarts的实例
 *  @param num      //类目数量(原因：循环时达到最大值后，使其从头开始循环)
 *  @param time     //轮播间隔时长
 */
export function autoHover(myChart, num, time) {
    let defaultData = {   //设置默认值
        time: 2000,
        num: 100
    };
    if(!time){
      time = defaultData.time;
    }
    if(!num){
      num = defaultData.num;
    }

    let count = 0;
    let timeTicket = null;
    timeTicket && clearInterval(timeTicket);
    timeTicket = setInterval(function () {
      myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0 //serieIndex的索引值,可以触发多个
      });
      myChart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: count
      });
      myChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: count
      });
      count++;
      if (count >= num) {
        count = 0;
      }
    }, time);

    myChart.on("mouseover", function (params) {
      clearInterval(timeTicket);
      myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0
      });
      myChart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: params.dataIndex
      });
      myChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: params.dataIndex
      });
    });

    myChart.on("mouseout", function () {
      timeTicket && clearInterval(timeTicket);
      timeTicket = setInterval(function () {
        myChart.dispatchAction({
          type: "downplay",
          seriesIndex: 0
        });
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: count
        });
        myChart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: count
        });
        count++;
        if (count >= num) {
          count = 0;
        }
      }, time);
    });
}

/**
 * @description 四舍五入
 */
export function convertValueWithUnit(value) {
    let res = value;
    if(res >= 100000000){
        res =  (res/100000000).toFixed(2) + "亿";
    }else if(res >= 10000){
        res =  (res/10000).toFixed(2) + "万";
    }else{
        res = "" + res;
    }

    return res;
}

/**
 * 得到近十二个月的起止年月(不包含当月)
 */
export function getNear12MonthStartAndEndMonth() {
    let monthArr = [];
    let data = new Date();
    let year = data.getFullYear();
    // let month = data.getMonth() + 1;
    let month = data.getMonth();
    month = month < 10 ? "0" + month : month;
    let endMonth = year + "-" + month;
    data.setMonth(data.getMonth() - 12);
    year = data.getFullYear();
    month = data.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let startMonth = year + "-" + month;
    monthArr.push(startMonth);
    monthArr.push(endMonth);
    // console.log(monthArr);
    return monthArr;
}



export const isEmpty = (data) => {
    if (data instanceof Array) {
        return data.length === 0
    } else {
        return data === undefined || data === '' || data === null
    }
};


export const isNotEmpty = (data) => {
    return !isEmpty(data)
};

import {Message} from 'element-ui';

/**
 *判断一个对象是否为空
 */
export const isNull = (obj) => {
    return obj === undefined || obj === 'undefined' || obj === null
};

/**
 * 判断数组是否为空
 * */
export const isEmptyArray = (array) => {
    return array === null || array === false
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

/**
 * 提示函数
 * 禁止点击蒙层、显示3秒后关闭
 */
export const successTip = msg => {
    if (msg == null || msg === '') {
        msg = '操作成功'
    }
    Message.success({
        message: msg,
        duration: 3000,
        showClose: true,
        center: true,
        customClass:'zZindex'
    })
};

/**
 * 提示函数
 * 禁止点击蒙层、显示3秒后关闭
 */
export const warningTip = msg => {
    if (msg == null || msg === '') {
        msg = '警告';
    }
    Message.info({
        message: msg,
        duration: 3000,
        showClose: true,
        center: true,
        customClass:'zZindex'
    })
};

/**
 * 判断数组是否包含重复数据
 * */
export const isRepeat = (array) => {
    let has = {};
    for(let i in array) {
        if (!array.hasOwnProperty(i)) continue;
        if (has[array[i]]) {
            return true;
        }
        has[array[i]] = true;
    }
    return false;
};

/**
 * 提取大括号中的值
 * */
export const extractValueInBrace = (value) => {
    if (isEmpty(value)) {
        return ""
    } else {
        return value.substring(value.indexOf('{') + 1, value.lastIndexOf('}'));
    }
};


export const isEmptyNew = (data) => {
    if (data instanceof Array) {
        return data.length === 0
    } else {
        return data === undefined || data === '' || data === null
    }
};


