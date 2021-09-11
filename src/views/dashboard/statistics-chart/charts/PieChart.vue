<template>
  <div :class="className" :style="{height:height,width:width}"/>
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
        default: '300px'
      },
      options: {
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
      options: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },

    mounted() {
      this.$nextTick(() => {
        debugger
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');
        this.setOptions(this.options);
      },

      setOptions({legendData, seriesDataList, seriesName} = {}){
        debugger
        let base = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '5',
            data: []
          },
          series: [
            {
              name: '',
              type: 'pie',
              roseType: 'radius',
              radius: [20, 90],
              center: ['50%', '38%'],
              data: [],
              animationEasing: 'cubicInOut',
              animationDuration: 1000
            },
          ]
        };
        base.legend.data = legendData;
        base.series[0].data = seriesDataList;
        base.series[0].name = seriesName;
        base.series.name = seriesName;
        this.chart.setOption(base, true)
      }


    }
  }
</script>
