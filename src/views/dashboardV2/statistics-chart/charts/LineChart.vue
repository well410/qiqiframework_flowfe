<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../../mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData)
    },
    setOptions({ lineDataList, axisData, legendData } = {}) {
      let colorList = ['#3888fa', '#e65594', '#c07bff', '#ffac77'];
      let seriesList = (lineDataList ? lineDataList.map((item, index) => {
        let base = {
          name: '',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: colorList[index % colorList.length],
              lineStyle: {
                color: colorList[index % colorList.length],
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: [],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        };
        base.name = item['seriesName'];
        base.data = item['seriesDataList'];
        return base;
      }) : []);
      axisData = (axisData ? axisData : []);
      legendData = (legendData ? legendData : []);
      this.chart.setOption({
        xAxis: {
          data: axisData,
          boundaryGap: true,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: legendData
        },
        series: seriesList
      }, true)
    }
  }
}
</script>
