<template>
  <el-card>
    <div style="margin-bottom: 15px;font-size: 24px;text-align: center">
      当日 <span style="color: #91bbe9">{{currentDate}}</span> TPS、错误、时延、报警前十的决策信息
    </div><!--#d6e1ef b3d4fc-->
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      :data="topTenSep"
      style="cursor: pointer"
      stripe
      border
      :header-cell-style="{background:'#d6e1ef',color:'#606266',fontSize:'14px'}"
      size="mini">
      <el-table-column type="index" width="36" align="center"></el-table-column>

      <el-table-column label="TPS" align="center">
        <el-table-column prop="tpsDecs" label="决策名" align="center" >
          <template slot-scope="props">
            <span @click="handleDecs(props.row.tpsDecs.tpsDecsId)" class="decsClass">{{props.row.tpsDecs.tpsDecsName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tpsCnt" label="tps" align="center" width="90">
          <template slot-scope="props">
            <span class="numClass">{{props.row.tpsCnt}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="错误" align="center">
        <el-table-column prop="errorDecs" label="决策名" align="center">
          <template slot-scope="props" class="column-slot">
            <span @click="handleDecs(props.row.errorDecs.errorDecsId)" class="decsClass">{{props.row.errorDecs.errorDecsName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="errorCnt" label="个数" align="center" width="90">
          <template slot-scope="props">
            <span class="numClass">{{props.row.errorCnt}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="时延" align="center">
        <el-table-column prop="delayDecs" label="决策名" align="center">
          <template slot-scope="props">
            <span @click="handleDecs(props.row.delayDecs.delayDecsId)" class="decsClass">{{props.row.delayDecs.delayDecsName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="delayAvg" label="平均时延" align="center" width="90">
          <template slot-scope="props">
            <span class="numClass">{{props.row.delayAvg}}</span>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="报警" align="center">
        <el-table-column prop="alarmDecs" label="决策ID" align="center">
          <template slot-scope="props">
            <span @click="handleDecs(props.row.alarmDecs.alarmDecsId)" class="decsClass">{{props.row.alarmDecs.alarmDecsName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="alarCnt" label="个数" align="center" width="90">
          <template slot-scope="props">
            <span class="numClass">{{props.row.alarCnt}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>

  import {getDecsUrl, getTopTen} from "../topTenAndUserInfo/topTenAndUserInfo";
    import {getUserProdId} from "../../../api/prod-manager";

    export default {
        name: "decs-top",
      data(){
          return{
            topTen:[],
            topTenSep:[],
            prodId: '',
            currentDate:'',
            decsUrl:'',
            tpsNumUnit:[[0, ' 笔/s'], [4, ' 万笔+/s'], [8, ' 亿笔+/s']],
          }
      },
      mounted() {
        /*let that=this;
        getUserProdId().then(res => {
          that.prodId=res.data;
          Promise.all([getTopTen(that.prodId)]).then(res => {
            that.handleRes(res);
          })

        });*/
        this.$nextTick(() => {
          getDecsUrl().then(result => {
            this.decsUrl=result.data;
          });

          this.init();
          this.timer = setInterval(this.init, 60000) // 使用定时器"0 */1 * * * ?"
        })
        // this.init();
      },
      beforeDestroy() {
        clearInterval(this.timer)   //清除定时器
      },
      methods: {


        handleDecs(decsId){
          window.open(this.decsUrl+`/ui/decsManage/decsInf?prodId=${this.prodId}&decsId=${decsId}&tab=decsFlowG6`,"_blank");

        },
        init(){
          let that=this;
          let date = new Date();
          that.currentDate=date.getFullYear()+"-"+(((date.getMonth()+1)<10)?'0':'')+(date.getMonth()+1)+"-"
                +((date.getDate()<10)?'0':'')+date.getDate();
          that.refresh();
        },
        handleRes(res){
          let resData=res[0].data;
          let newTopTenSep=[];
          for (let i=0;i<resData.length;i++){
            let topSep={};
            let tpsDecs={};
            tpsDecs.tpsDecsId=resData[i]["statTrxDto"]==null?"":resData[i]["statTrxDto"]["decsId"];
            tpsDecs.tpsDecsName=resData[i]["statTrxDto"]==null?"":resData[i]["statTrxDto"]["decsName"];
            topSep.tpsDecs=tpsDecs;
            topSep.tpsCnt=resData[i]["statTrxDto"]==null?"":resData[i]["statTrxDto"]["trxCnt"];

            let errorDecs={};
            errorDecs.errorDecsId=resData[i]["statStatusErrorCodeDto"]==null?"":resData[i]["statStatusErrorCodeDto"]["decsId"];
            errorDecs.errorDecsName=resData[i]["statStatusErrorCodeDto"]==null?"":resData[i]["statStatusErrorCodeDto"]["decsName"];
            topSep.errorDecs=errorDecs;
            topSep.errorCnt=resData[i]["statStatusErrorCodeDto"]==null?"":resData[i]["statStatusErrorCodeDto"]["trxCntErrorTotal"];

            let delayDecs={};
            delayDecs.delayDecsId=resData[i]["statDelayDto"]==null?"":resData[i]["statDelayDto"]["decsId"];
            delayDecs.delayDecsName=resData[i]["statDelayDto"]==null?"":resData[i]["statDelayDto"]["decsName"];
            topSep.delayDecs=delayDecs;
            topSep.delayAvg=resData[i]["statDelayDto"]==null?"":resData[i]["statDelayDto"]["delayAvg"];

            let alarmDecs={};
            alarmDecs.alarmDecsId="";
            alarmDecs.alarmDecsName="";
            topSep.alarmDecs=alarmDecs;
            topSep.alarCnt="";

            newTopTenSep.push(topSep);

          }

          for (let i=newTopTenSep.length;i<10;i++){
            let topSep={};
            let tpsDecs={};
            tpsDecs.tpsDecsId="";
            tpsDecs.tpsDecsName="";
            topSep.tpsDecs=tpsDecs;
            topSep.tpsCnt="";

            let errorDecs={};
            errorDecs.errorDecsId="";
            errorDecs.errorDecsName="";
            topSep.errorDecs=errorDecs;
            topSep.errorCnt="";

            let delayDecs={};
            delayDecs.delayDecsId="";
            delayDecs.delayDecsName="";
            topSep.delayDecs=delayDecs;
            topSep.delayAvg="";

            let alarmDecs={};
            alarmDecs.alarmDecsId="";
            alarmDecs.alarmDecsName="";
            topSep.alarmDecs=alarmDecs;
            topSep.alarCnt="";
            newTopTenSep.push(topSep);
          }
          this.topTenSep=newTopTenSep;

        },
        refresh(){
          let that=this;
          getUserProdId().then(res => {
            that.prodId=res.data;
            Promise.all([getTopTen(that.prodId)]).then(res => {
              that.handleRes(res);
            })

          });
        },
      },
    }
</script>

<style scoped>
  .column-slot{
    text-align: left;
  }

  /deep/.el-table--striped .el-table__body tr.el-table__row--striped td{
    /*background-color: #F0F0EE;*/
  }
  .numClass{
    font-size: 16px;
  }
  .decsClass{
    font-size: 16px;
  }

</style>
