<template>
  <!--版本公告 -->
  <div>
    <el-button type="primary" @click="addClick" size="mini" style="margin-left: 18px" v-cmb-auth-remove="'versionReportAddCode'">新增</el-button>
    <el-tabs ref="versionReportForm" :tab-position="tabPosition" style="height: 400px;">
      <el-tab-pane
        :key="item.id"
        v-for="(item, index) in versionReportList"
        :label="item.title"
        :name="item.id"
      >
        <el-row>
          <el-col :span="15">
            <el-input type="text" placeholder="请输入主题，如“0.0.1版本更新日志”" v-model="item.title" maxlength="20"  :disabled= "inputdisabled" ></el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="success" @click="saveClick(item)" size="mini" v-cmb-auth-remove="'versionReportSaveCode'">保存</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="info" @click="editClick(item)" size="mini" v-cmb-auth-remove="'versionReportEditCode'">编辑</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="danger" @click="deleteClick(item)" size="mini" v-cmb-auth-remove="'versionReportDeleteCode'">删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          {{item.createTime}}
        </el-row>
<!--        <el-row>-->
          <el-input type="textarea" :rows="13"  placeholder="请输入版本更新内容"  v-model="item.updateLog" :disabled= "inputdisabled"> </el-input>
<!--        </el-row>-->

      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
  import { delelteUpdateLog, getAllUpdatelog, updateUpdateLog } from '../../../../api/update-log'

    export default {
        name: "VersionReport",


        data() {
            return {
                updateLog :'',
                versionReportList: [],
                inputdisabled: true,
                tabPosition: 'left',
                // -----------el 组件属性-----------
                editLoading:false,          // 保存按钮

            }
        },

        //----------父组件传入的数据----------
        props: {
            'dialogTitle': String,
            'dialogFormVisible': Boolean,
        },

        methods: {

            addClick(){

              let maxIndex = 0;
              this.versionReportList.forEach(item =>{
                maxIndex = Math.max(item.id, maxIndex);
              });
              maxIndex++;

              let versionReportListCopy = [];
              versionReportListCopy.push({
                id: maxIndex + '',
                title: '版本更新日志',
                updateLog: ''
              });
              this.versionReportList.forEach(item =>{
                versionReportListCopy.push(item);
              });

              this.versionReportList = versionReportListCopy;
              debugger
            },
            // 编辑确定按钮
            editClick(data) {
               this.inputdisabled = false;
            },
            saveClick(data){
              let that = this;
              updateUpdateLog(data).then(res => {
                that.init();
                that.$message({message: '成功', type: 'success'});
              }).finally(res => {
              })
            },

            deleteClick(data){
                let that = this;
                this.$confirm('确定要删除该条版本更新日志吗？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(({ value })=>{
                  let params = {id: data.id};
                  delelteUpdateLog(params).then(res => {
                    that.init();
                    that.$message({message: '删除成功', type: 'success'});
                  }).finally(res => {
                  })
                }).catch(()=>{});
            },

            /**
             * 取消按钮
             * 子组件向父组件发送信息，用来取消dialog页面
             */
            cancelVisible: function () {
                let that = this;
                that.$emit('visibleChange', false);
            },

            // 页面的初始化方法
            init() {
                let that = this;
                that.editLoading = false;
                that.versionReportList = [];
                getAllUpdatelog().then(res => {
                  that.versionReportList = res.data;
                }).finally(res => {
                })
            }

        },
    }
</script>

<style scoped>

</style>
