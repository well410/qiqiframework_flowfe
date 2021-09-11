import {isEmpty} from '@/libs/tools'

export const colorList = [
    "#296ef2", "#bd76f7", "#f8cb3d", "#00c9c9",
    "#d2f5a6", "#a2fffc", '#1DB0B8', '#37C6C0',
    '#D0E9FF', '#c7353a', '#f5b91e', '#915872',
    '#3077b7', '#9a8169', '#3f8797', '#5b8144',
    '#307889', '#9c6a79','#2AC9FD', '#76FBC0',
    '#35C96E', '#FCC708', '#48B188', '#5957C2',
    '#4A5D73', '#FEE449', "#00FFFF", "#00FFA8",
    "#9F17FF", "#FFE400", "#F76F01", "#01A4F7",
    "#FE2C8A",'#86D560', '#AF89D6', '#59ADF3',
    '#FF999A', '#FFCC67'];

export const pieColor1 = ['#915872', '#3077b7', '#9a8169', '#3f8797',
    '#5b8144', '#307889', '#9c6a79']
export const pieColor2 = ['#d74e67', '#0092ff', '#eba954', '#21b6b9',
    '#60a900', '#01949b', ' #f17677']


/*图例的默认配置*/
export const getDefaultLegend = () => {
    return {
        textStyle: {
            // color: "#d1d5de",
            color: "#242424",
            fontSize: 13
        },
        type: 'scroll',
        pageTextStyle: {
            // color: "#d1d5de",
            color: "#242424",
            fontSize: 13
        },
        pageIconColor: '#aaa',
        pageIconInactiveColor: '#2f4554',
        icon: 'rect',
        // 设置上下的内边距为 5，左右的内边距为 10
        padding: [5, 10],
        itemWidth: 12,
        itemGap: 12,
        itemHeight: 10,
        left: '2%',
        //top: 7,
    }
}

export const getDefaultPieLegend = () => {
    return {
        type: "scroll",
        orient: 'vertical',
        right: '3%',
        align: 'left',
        top: 'middle',
        textStyle: {
            // color: "#d1d5de",
            color: "#242424",
            fontSize: 13
        },
        pageTextStyle: {
            // color: "#d1d5de",
            color: "#242424",
            fontSize: 13
        },
        padding: [5, 10],
        itemWidth: 12,
        itemGap: 12,
        itemHeight: 10,
        pageIconColor: '#aaa',
        pageIconInactiveColor: '#2f4554',
        icon: 'rect',
        height: 250
    };
}

/*直角坐标系网格*/
export const getDefaultGrid = () => {
    return {
        left: '2%',
        right: '4%',
        bottom: '0%',
        top: '10%',
        width: '95%',
        height: '90%',
        containLabel: true
    };
}

/*数据缩放区域的配置*/
export const getDefaultDataZoom = () => {
    return [{
        "show": true,
        "height": 12,
        "left": 80,
        "right": 80,
        "xAxisIndex": [
            0
        ],
        bottom: '5%',
        "start": 0,
        "end": 100,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
            color: "#d3dee5",

        },
        textStyle: {
            color: "#fff"
        },
        borderColor: "#90979c"
    }, {
        "type": "inside",
        "show": true,
        "height": 15,
        "start": 1,
        "end": 35
    }];
}

/*Y坐标轴的默认配置*/
export const getDefaultAxisItemY = (type, name, uniqueConfig) => {
    let template = {
        type: type,
        name: name,
        /*坐标轴名称的文字样式*/
        nameTextStyle: {
            // color: "#d1d5de",
            color: "#242424",
            fontSize: 9,
        },
        /*坐标轴轴线相关设置。*/
        axisLine: {
            show: true,
            lineStyle: {
                color: "#666666",
            }
        },
        /*坐标轴刻度相关设置。*/
        axisTick: {
            show: true,
            lineStyle: {
                color: "#666666"
            }
        },
        /*坐标轴刻度标签的相关设置*/
        axisLabel: {
            show: true,
            textStyle: {
                // color: "#d1d5de",
                color: "#242424",
                fontSize: 9,
            },
        },
        /*坐标轴在 grid 区域中的分隔线。*/
        splitLine: {
            show: false,
            lineStyle: {
                color: [
                    "#e6e6e6"
                ]
            }
        },
        /*坐标轴在 grid 区域中的分隔区域，默认不显示。*/
        splitArea: {
            show: false,
            areaStyle: {
                color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"]
            }
        }
    }
    for (let key in uniqueConfig) {
        template[key] = uniqueConfig[key];
    }
    return template;
}

/*X坐标轴的默认配置*/
export const getDefaultAxisItemX = type => {
    return {
        type: type,
        boundaryGap: true,
        /*坐标轴轴线相关设置。*/
        axisLine: {
            show: true,
            lineStyle: {
                color: "#666666"
            }
        },
        /*坐标轴刻度相关设置。*/
        axisTick: {
            show: false,
            lineStyle: {
                color: "#666666"
            }
        },
        /*坐标轴刻度标签的相关设置*/
        axisLabel: {
            show: true,
            textStyle: {
                // color: "#d1d5de",
                color: "#242424",
                fontSize: 9,
            }
        }
    };
}

/*折线的默认配置，seq代表的是第几条折线*/
export const getSmoothLineTemplate = (uniqueConfig, seq) => {
    let template = {
        type: "line",
        smooth: true, //平滑曲线显示
        /*折线拐点标志的样式。*/
        itemStyle: {
            opacity: 0,
            //borderWidth: 6,
            //borderColor:isEmpty(seq) ? colorList[0] : colorList[seq],
            color: isEmpty(seq) ? colorList[0] : colorList[seq]
        },
        /*线条样式。*/
        lineStyle: {
            width: 3,
            color: isEmpty(seq) ? colorList[0] : colorList[seq],
        }
    };
    for (let key in uniqueConfig) {
        template[key] = uniqueConfig[key];
    }
    return template;
}

export const getBarTemplate = (uniqueConfig, seq) => {
    let template = {
        type: "bar",
        /*图形样式。*/
        itemStyle: {
            color: isEmpty(seq) ? colorList[0] : colorList[seq]
        }
    };
    for (let key in uniqueConfig) {
        template[key] = uniqueConfig[key];
    }
    return template;
}

export const getPieTemplate = (uniqueConfig) => {
    let template = {
        type: 'pie',
        center: ['35%', '55%'],
        radius:  ['38%', '50%'],
        clockwise: false, //饼图的扇区是否是顺时针排布
        label: {
            normal: {
                show: true,
                formatter:  '{b}：{d}%',
                textStyle: {
                    fontWeight: 'bold',
                },
                rich:{
                    yellow: {
                        color: "#ffc72b",
                        fontSize: 15,
                        align: 'center'
                    },
                    total: {
                        color: "#ffc72b",
                        fontSize: 40,
                        align: 'center'
                    },
                    blue: {
                        color: '#49dff0',
                        fontSize: 16,
                        align: 'center'
                    },
                    hr: {
                        borderColor: '#0b5263',
                        width: '100%',
                        borderWidth: 1,
                        height: 0,
                    }
                }
            },
            emphasis: {
                show: true
            }
        },
        labelLine: {
            normal: {
                length: 30,
                length2: 10,
                lineStyle: {
                    color: '#0b5263'
                }
            }
        },
    };
    for (let key in uniqueConfig) {
        template[key] = uniqueConfig[key];
    }
    return template;
}
