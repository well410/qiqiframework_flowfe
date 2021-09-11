<template>
  <div>
    <el-card style="padding-bottom: 0;margin-bottom: 3px">
      <div style="margin-bottom: 15px;font-size: 24px;text-align: center">
        当前用户信息
      </div>
      <div class="rowClass">
        <el-card >
          <el-row :gutter="40"  style="height: 90px"  type="flex" justify="space-around">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div style="flex-direction: row">
                <div>
                  <svg-icon icon-class="order-fill" class="card-panel-icon"></svg-icon>
                </div>
                <div class="col-content">
                  <div  style="font-size: 22px">审批流程提交数</div>
                  <div style="margin-left: 63px" class="numClass" @click="showDetail">
                    <!--            {{UserInfo["needOthersApprNum"]}}-->
                    <vue-count-to :start-val="0" :end-val="UserInfo['needOthersApprNum']" :duration="1600"/>
                  </div>
                </div>
              </div>
            </el-col>
            <el-divider direction="vertical" style="background-color: #C0C4CC;width: 2px;height: 300px"></el-divider>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div style="flex-direction: row">
                <div>
                  <svg-icon icon-class="message center-fill" class="card-panel-icon"></svg-icon>
                </div>
                <div class="col-content">
                  <div  style="font-size: 22px">审批待办数</div>
                  <div style="margin-left: 43px;" class="numClass" @click="jumpToAppr">
                    <!--            {{UserInfo["apprForOthersNum"]}}-->
                    <vue-count-to :start-val="0" :end-val="UserInfo['apprForOthersNum']" :duration="1600"/>
                  </div>
                </div>
              </div>
            </el-col>
            <el-divider direction="vertical" style="background-color: #C0C4CC;width: 2px"></el-divider>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div style="flex-direction: row">
                <div>
                  <svg-icon icon-class="warning-filling" class="card-panel-icon"></svg-icon>
                </div>
                <div class="col-content">
                  <div style="font-size: 22px">报警数</div>
                  <div style="margin-left: 23px" class="numClass">
                    <!--            {{UserInfo["alarmNum"]}}-->
                    <vue-count-to :start-val="0" :end-val="UserInfo['alarmNum']" :duration="1600"/>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-card>

    <el-dialog title="审批详情" class="new-dialog" :visible.sync="dialogVisible" align="center"
               width="40%"
    >
      <el-card>
        <el-table
          :data="apprInfo"
          stripe
          :header-cell-style="{fontSize:'16px'}"
          tooltip-effect="dark"
          size="mini">
          <el-table-column prop="createTime" label="创建时间" align="center">
            <template slot-scope="props">
              <span class="detail-col">{{props.row.createTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="recallDesc" label="审批描述" align="center">
            <template slot-scope="props">
              <span class="detail-col">{{props.row.recallDesc}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="currentNodeUser" label="当前审批人" align="center">
            <template slot-scope="props">
              <span class="detail-col">{{props.row.currentNodeUser}}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
  import VueCountTo from "vue-count-to/src/vue-countTo";
  import {getApprDetail, getApprUrl, getTopTen, getUserInfo} from "../topTenAndUserInfo/topTenAndUserInfo";
  import {getUserProdId} from "../../../api/prod-manager";
  import './index.scss'

  export default {
    name: "user-info",
    components:{VueCountTo},
    data(){
      return{
        UserInfo:{"needOthersApprNum":0,"apprForOthersNum":0,"alarmNum":0},
        apprUrl:'',
        dialogVisible:false,
        apprInfo:[]
      }
    },
    methods: {
      showDetail(){
        let that=this;
        that.dialogVisible=true;
        getApprDetail(that.prodId).then(res=>{
          that.apprInfo=res.data;
          // debugger;
        });
      },
      init(){
        this.refresh();
      },
      refresh(){
        let that=this;
        getUserInfo().then(res=>{

        });
      },
      jumpToAppr(){
        window.open(this.apprUrl+`/apprInstance`,"_blank");
      },
      handleRes(res){
        let resData=res[0].data;
        this.UserInfo=resData;
        getApprUrl().then(res =>{
          this.apprUrl=res.data;
        });
      },
    },
    mounted() {
      let that=this;
      getUserProdId().then(res => {
        that.prodId=res.data;
        Promise.all([getUserInfo(that.prodId)]).then(res => {
          that.handleRes(res);
        })

      });
    }
  }
</script>

<style scoped lang="scss">
  /deep/ .el-card__body{
    padding-top:15px;
    padding-bottom: 20px;
  }
  /deep/.el-dialog__body{
    padding-top:10px;
    padding-bottom: 20px;
  }
  /*.new-dialog{*/
  /*  .el-dialog{*/
  /*    border-radius: 30px;*/
  /*    max-width: 660px;*/
  /*  }*/
  /*  .el-dialog__body{*/
  /*    padding:10px 20px 30px 20px;*/
  /*  }*/
  /*}*/
  .detail-col{
    font-size: 14px;
  }
  .col-content{
    text-align: left;
    margin-left: 130px;
    margin-top: 10px;
  }

  .el-divider--vertical{
    height: 6em;
    width: 2px;
  }

  .card-panel-col {
    margin-bottom: 10px;
  }
  .card-panel-icon {
    float: left;
    font-size: 54px;
    width: 1em;
    height: 1em;
    margin-left: 30px;
    margin-top: 10px;
  }
  .numClass{
    font-size: 22px;
    cursor: pointer;
    margin-top: 15px;
  }
  .numClass:hover{
    color: #91bbe9;
  }


</style>
