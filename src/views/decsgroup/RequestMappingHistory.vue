<template>
    <div class="info-content">
        <request-mapping-comm-table
                :p-table-type="'history'"
                :p-loading="loading"
                :p-request-mapping-list="pHistoryDialog.reqHistoryList"></request-mapping-comm-table>

        <div style="margin-top: 10px">
            <div class="pagination-bar clearfix">
                <el-pagination background layout="total,prev,pager,next" class="pagination"
                               @current-change="handleCurrentChange"
                               :page-size="pHistoryDialog.pageSize"
                               :total="pHistoryDialog.total"></el-pagination>

            </div>
        </div>
    </div>
</template>

<script>
    import RequestMappingCommTable from "./RequestMappingCommTable";
    import {queryRequestMappingHistory} from "../../api/RequestMapping";

    export default {
        name: "RequestMappingHistory",
        components: {RequestMappingCommTable},
        props: {
            pHistoryDialog: Object,
        },
        data(){
          return{
              requestMapping :{},
              loading :false,
          }
        },

        methods: {

            setRequestMapping(row){
                this.requestMapping = row;
            },

            // 页面切换
            handleCurrentChange(val) {
                this.pHistoryDialog.pageNum = val;
                this.pHistoryDialog.currentPage = val;
                this.refreshPage();
            },


            refreshPage() {
                let that = this;
                const prodId = that.requestMapping.prodId;
                const pageNum = that.pHistoryDialog.pageNum;
                const pageSize = that.pHistoryDialog.pageSize;
                that.loading = true;
                queryRequestMappingHistory({
                    prodId: prodId,
                    pageNum: pageNum,
                    pageSize: pageSize,
                    requestMappingBase: that.requestMapping
                }).then(res => {
                    that.pHistoryDialog.reqHistoryList = res.data.data['objectList'];
                    that.pHistoryDialog.total = res.data.data['total'];
                }).finally(()=>{
                    that.loading = false;
                })
            },

        }
    }
</script>

<style scoped>

</style>
