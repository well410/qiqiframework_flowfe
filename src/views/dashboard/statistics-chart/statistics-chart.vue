<template>
  <div>
    <!--时间序列图-->
    <el-row style="background:#fff;margin-top: 5px;margin-bottom: 5px;padding-top: 10px">
      <line-chart :chart-data="pLineData"/>
    </el-row>

    <!--饼图（状态统计）-->
    <template v-if="pPieData.length === 2">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="24" :lg="12" v-for="item in pPieData">
          <el-card>
            <div slot="header">
              <span>{{item.seriesName}}</span>
            </div>
            <pie-chart :options="item"/>
          </el-card>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <el-row>
        <el-card v-for="item in pPieData">
          <div slot="header">
            <span>{{item.seriesName}}</span>
          </div>
          <pie-chart :options="item"/>
        </el-card>
      </el-row>
    </template>

  </div>
</template>

<script>
  import LineChart from "./charts/LineChart";
  import PieChart from "./charts/PieChart";
  import RaddarChart from "./charts/RaddarChart";
  import BarChart from "./charts/BarChart";


  export default {
    name: "statistics-chart",
    components: {BarChart, RaddarChart, PieChart, LineChart},
    props: {
      pLineData: Object,
      pPieData: Array,
      pPlatformType: String
    },
    data() {
      return {}
    },
  }
</script>

<style scoped>

</style>
