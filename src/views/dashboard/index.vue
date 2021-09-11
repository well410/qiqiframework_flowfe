<template>
  <div class="dashboard-container">
    <panel-group class="card-container" @handleSetLineChartData="handleSetLineChartData"></panel-group>
    <statistics-chart class="card-container"
                      :p-platform-type="platformType"
                      :p-line-data="lineData"
                      :p-pie-data="pieData"></statistics-chart>
  </div>
</template>

<script>
  import PanelGroup from "./panel-group/panel-group";
  import StatisticsChart from "./statistics-chart/statistics-chart";
  import {setFirstInUserProdId} from '../../api/prod-manager'
  import {platformEnums} from "../entity/enumns";
  import {getLine, getPie} from "../../api/statistics";

  export default {
    components: {StatisticsChart, PanelGroup},
    data() {
      return {
        platformEnums: platformEnums,
        lineData: {},
        pieData: [],
        platformType: ''
      }
    },
    mounted() {
      setFirstInUserProdId().then(res => {

      })


    },
    methods: {
      handleSetLineChartData(platformType, prodId) {
        let that = this;
        that.platformType = platformType;
        Promise.all([getLine(platformType, prodId), getPie(platformType, prodId)]).then(res => {
          that.lineData = res[0].data;
          that.pieData = res[1].data;
        });
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .dashboard {
    &-container {
      margin: 5px;
      color: white;

      .card-container {
        margin-bottom: 2px;
      }
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
