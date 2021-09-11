<template>
    <div class="info-content">
        <request-mapping-comm-table
                :p-table-type="'version'"
                :p-loading="loading"
                :p-request-mapping-list="pVersionDialog.reqVersionList">
            <el-table-column label="操作" width="210px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="onlineReqVersion(scope['row'])" :disabled="scope['row'].status === 'Y'">启用</el-button>
                    <el-button type="warning" size="mini" @click="offlineReqVersion(scope['row'])" :disabled="scope['row'].status === 'N'">停用</el-button>
                    <el-button type="danger"  size="mini" @click="deleteReqVersion(scope['row'])" :disabled="scope['row'].status === 'Y'">删除</el-button>
                </template>
            </el-table-column>
        </request-mapping-comm-table>

        <div>
            <div class="pagination-bar clearfix">
                <el-pagination background layout="total,prev,pager,next" class="pagination"
                               @current-change="handleCurrentChange"
                               :page-size="pVersionDialog.pageSize"
                               :total="pVersionDialog.total"></el-pagination>

            </div>
        </div>
    </div>
</template>

<script>
    import RequestMappingCommTable from "./RequestMappingCommTable";
    import {
        deleteRequestMappingVersion, offlineRequestMappingVersion,
        onlineRequestMappingVersion,
        queryRequestMappingVersion
    } from "../../api/RequestMapping";
    export default {
        name: "RequestMappingVersion",
        components: {RequestMappingCommTable},
        props: {
            pVersionDialog: Object,
        },

        data(){
            return{
                requestMapping :{},
                loading :false,
            }
        },
        methods: {

            deleteReqVersion(row){
                let that = this;
                that.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    deleteRequestMappingVersion({requestMappingVersion: row}).then(res => {
                        that.$message({message: "删除成功", type: 'success'});
                        that.refreshPage();
                    })
                }).catch(() => {
                });
            },

            onlineReqVersion(row) {
                let that = this;
                that.$confirm('确定要启用吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    onlineRequestMappingVersion({requestMappingVersion: row}).then(res => {
                        that.$message({message: "启用成功", type: 'success'});
                        that.refreshPage();
                    })
                }).catch(() => {});
            },

            offlineReqVersion(row){
                let that = this;
                that.$confirm('确定要停用吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    offlineRequestMappingVersion({requestMappingVersion: row}).then(res => {
                        that.$message({message: "停用成功", type: 'success'});
                        that.refreshPage();
                    })
                }).catch(() => {});
            },

            setRequestMapping(row){
                this.requestMapping = row;
            },

            // 页面切换
            handleCurrentChange(val) {
                this.pVersionDialog.pageNum = val;
                this.pVersionDialog.currentPage = val;
                this.refreshPage();
            },

            refreshPage() {
                let that = this;
                const prodId = that.requestMapping.prodId;
                const pageNum = that.pVersionDialog.pageNum;
                const pageSize = that.pVersionDialog.pageSize;
                that.loading = true;
                queryRequestMappingVersion({
                    prodId: prodId,
                    pageNum: pageNum,
                    pageSize: pageSize,
                    requestMappingBase: that.requestMapping
                }).then(res => {
                    that.pVersionDialog.reqVersionList = res.data.data['objectList'];
                    that.pVersionDialog.total = res.data.data['total'];
                }).finally(()=>{
                    that.loading = false;
                })
            },

        }
    }
</script>

<style scoped>

</style>
