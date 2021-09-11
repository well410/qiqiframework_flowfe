<!--适用于双坐标轴图：柱形和折线-->
<template>
    <div class="chartContainer">
        <div class="chart-header"><h1>{{title}}</h1></div>
        <div class="chart-body" ref="dom"></div>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>

<script>
    import echarts from "echarts";
    import {on} from "../../utils/tools";
    import {
        colorList,
        getDefaultAxisItemX, getDefaultAxisItemY,
        getDefaultDataZoom,
        getDefaultGrid,
        getDefaultLegend
    } from "../charts-config/theme1-config";


    export default {
        name: "NormalBarLine",
        props: {
            title: String,
            spinShow: {
                type: Boolean,
                default: false
            },
            yAxisTitleLeft: String,
            yAxisTitleRight: {
                required: false,
                type: String,
                default: ''
            },
            yAxisLeftUniqueConfig: {
                type: Object,
                required: false,
                default: function () {
                    return {};
                }
            },
            yAxisRightUniqueConfig: {
                type: Object,
                required: false,
                default: function () {
                    return {};
                }
            },
            seriesData: Array,
            xAxisData: Array,
            isShowYAxisRight: {
                required: false,
                type: Boolean,
                default: false
            },
            isShowExportTool: false
        },
        mounted(){
            // console.log("123")

        },
        methods: {
            resize() {
                this.dom.resize();
            },

            myShowLoading() {
                this.dom = echarts.init(this.$refs.dom);
                this.dom.showLoading();
            },

            myHideLoading() {
                this.dom.hideLoading();
            },

            renderCharts() {
                this.$nextTick(() => {
                        let that = this;
                        let option = {
                            color: colorList,
                            // backgroundColor: "#2b3049",
                            backgroundColor: "#ffffff",
                            toolbox: {
                                iconStyle: {
                                    // borderColor: '#d1d5de'
                                    borderColor: '#000000'
                                },
                                emphasis: {
                                    iconStyle: {
                                        // borderColor: '#d1d5de'
                                        borderColor: '#000000'
                                    },
                                },
                                orient: 'vertical',
                                itemGap: 10,
                                right: '0.5%',
                                top: '10%',
                                // feature: {
                                //     saveAsImage: {
                                //         type: "png",
                                //         title: "保存",
                                //         //不知道为什么image方式不行，只能用path矢量图方式
                                //         icon: 'path://M362.72 426.08l-24.128 24.128 173.408 173.408 173.408-173.408-24.128-24.128-132.224 132.224 0-540.064-34.112 0 0 540.064z M597.312 188.8l0 34.112 221.792 0 0 580.032-614.144 0 0-580.032 221.792 0 0-34.112-255.904 0 0 648.288 682.4 0 0-648.288z'
                                //     },
                                //     myExportTool: {
                                //         show: this.isShowExportTool,
                                //         title: '导出',
                                //         icon: 'path://M476.7 550.4v368h-368v-368h368m40-40h-448v448h448v-448zM161.4 877.6l110.7-149.2-97.7-137.1h45.1l52 73.4c10.8 15.2 18.5 27 23 35.2 6.4-10.4 13.9-21.3 22.7-32.6l57.6-76H416l-100.6 135 108.4 151.4H377l-72-102.3c-4-5.9-8.2-12.2-12.5-19.1-6.4 10.4-10.9 17.6-13.7 21.5l-71.9 99.8h-45.5z m633.9-349.4H580.6v40h214.8v-40z m0 144.4H580.6v40h214.8v-40zM683.1 64H215.3v397h40V104h411.2l16.6 16.6v215.6h215.6l16.6 16.6V920H580.6v40h374.8V336.2L683.1 64z m40 232.2V160.6l135.6 135.6H723.1z m72.2 87.6h-420v40h420v-40z',
                                //         onclick: function () {
                                //             that.exportExcel();
                                //         }
                                //     }
                                // }
                            },
                            // legend: getDefaultLegend(),
                            tooltip: {
                                trigger: "axis",
                                backgroundColor: "rgba(35, 47, 76, 0.5)",
                                textStyle: {
                                    color: 'white',
                                    fontSize: 8
                                },
                                enterable: true,//鼠标可以移入tooltip里
                                extraCssText: 'max-height:400px;overflow:auto;font-size:12px;', //向div一样设置最大高度,超出滚动
                                position: function (point, params, dom, rect, size) {
                                    // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                                    // 提示框位置
                                    var x = 0; // x坐标位置
                                    var y = 0; // y坐标位置

                                    // 当前鼠标位置
                                    var pointX = point[0];
                                    var pointY = point[1];

                                    // 外层div大小
                                    // var viewWidth = size.viewSize[0];
                                    // var viewHeight = size.viewSize[1];

                                    // 提示框大小
                                    var boxWidth = size.contentSize[0];
                                    var boxHeight = size.contentSize[1];

                                    // boxWidth > pointX 说明鼠标左边放不下提示框
                                    if (boxWidth > pointX) {
                                        x = 5;
                                    } else { // 左边放的下
                                        x = pointX - boxWidth;
                                    }

                                    // boxHeight > pointY 说明鼠标上边放不下提示框
                                    if (boxHeight > pointY) {
                                        y = 5;
                                    } else { // 上边放得下
                                        y = pointY - boxHeight;
                                    }

                                    return [x, y];
                                },
                                axisPointer: {
                                    type: "cross"
                                }
                            },
                            // dataZoom: getDefaultDataZoom(),
                            grid: getDefaultGrid(),
                            xAxis: [
                                getDefaultAxisItemX('category')
                            ],
                            yAxis: this.isShowYAxisRight ?
                                [getDefaultAxisItemY('value', this.yAxisTitleLeft, this.yAxisLeftUniqueConfig), getDefaultAxisItemY('value', this.yAxisTitleRight, this.yAxisRightUniqueConfig)]
                                : [getDefaultAxisItemY('value', this.yAxisTitleLeft, this.yAxisLeftUniqueConfig)],
                            series: this.seriesData
                        };
                        option.xAxis[0].data = this.xAxisData;
                        this.dom = echarts.init(this.$refs.dom);
                        this.dom.clear();
                        this.dom.setOption(option);
                        on(window, "resize", this.resize);
                    }
                );
            },
            exportExcel() {
                this.$emit('exportExcel');
            },
        }
    }
</script>

<style scoped>
    .chartContainer {
        position: relative;
        /*background: #2b3049;*/
        background: rgba(255, 255, 255, 0);
        margin-top: 5px;
        height: 120px;
    }

    .chart-header {
        line-height: 1;
        text-align: center;
    }

    .chart-header h1 {
        display: inline-block;
        width: 100%;
        line-height: 15px;
        font-size: 14px;
        height: 16px;
        padding-top: 0px;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        /*color: #d1d5de;*/
        color: #18413f;
        text-align: center;
        margin-bottom: 0px;
    }

    .chart-body {
        font-size: 12px;
        line-height: 1.5;
        width: 100%;
        /*color: #d1d5de;*/
        color: #242424;
        height: 100px;
        float: left;
    }
</style>
