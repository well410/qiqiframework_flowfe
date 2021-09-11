<template>
  <el-card>
    <el-row :gutter="40" class="panel-group">

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData(platformEnums.variables.code)">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="drag" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              数据源和变量
            </div>
            <div class="card-panel-num" title="数据源管理">
              数据源：
              <vue-count-to :start-val="0" :end-val="statisticsNum['dsNum']" :duration="2600"/>
            </div>
            <div class="card-panel-num" title="变量管理">
              变量：
              <vue-count-to :start-val="0" :end-val="statisticsNum['varNum']" :duration="2600"/>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData(platformEnums.decisions.code)">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="tree" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              决策和规则
            </div>
            <div class="card-panel-num" title="决策个数">
              决策：
              <vue-count-to :start-val="0" :end-val="statisticsNum['decsNum']" :duration="2600"/>
            </div>
            <div class="card-panel-num" title="规则个数">
              规则：
              <vue-count-to :start-val="0" :end-val="statisticsNum['ruleNum']" :duration="2600"/>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData(platformEnums.functions.code)">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="star" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              函数
            </div>
            <div class="card-panel-num" title="公共函数个数">
              公有函数：
              <vue-count-to :start-val="0" :end-val="statisticsNum['pubFunNum']" :duration="2600"/>
            </div>
            <div class="card-panel-num" title="私有函数个数">
              私有函数：
              <vue-count-to :start-val="0" :end-val="statisticsNum['priFunNum']" :duration="2600"/>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData(platformEnums.components.code)">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="list" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              组件
            </div>
            <div class="card-panel-num" title="http组件个数">
              http组件：
              <vue-count-to :start-val="0" :end-val="statisticsNum['httpNum']" :duration="2600"/>
            </div>
            <div class="card-panel-num" title="Kafka组件个数">
              Kafka组件：
              <vue-count-to :start-val="0" :end-val="statisticsNum['kafkaNum']" :duration="2600"/>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import VueCountTo from "vue-count-to/src/vue-countTo";
  import {getNum} from "../../../api/statistics";
  import {getUserProdId} from "../../../api/prod-manager";
  import {platformEnums} from "../../entity/enumns";

  export default {
    name: "panel-group",
    components: {VueCountTo},
    data() {
      return {
        statisticsNum: {decsNum: 0, ruleNum: 0, pubFunNum: 0, priFunNum: 0, httpNum: 0, kafkaNum: 0, dsNum : 0, varNum : 0},
        platformEnums: platformEnums,
        prodId: ''
      }
    },

    methods: {
      handleSetLineChartData(platformType) {
        this.$emit('handleSetLineChartData', platformType, this.prodId)
      },

      initStatisticsNum(res) {
        this.statisticsNum = res[0].data;
      }
    },

    mounted() {
      let that = this;
      getUserProdId().then(res => {
        that.prodId = res.data;
        Promise.all([getNum(that.prodId)]).then(res => {
          that.initStatisticsNum(res);
          that.handleSetLineChartData(platformEnums.decisions.code)
        })
      });
    }
  }
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 0px;

    .card-panel-col {
      margin-bottom: 10px;
    }

    .card-panel {
      height: 140px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 25px 0 0 25px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
