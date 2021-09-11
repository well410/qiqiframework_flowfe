<template>
    <div id="evCmptTable">
        <div style="display: flex;justify-content: space-between">
        <div class="tools">
            <el-form @submit.native.prevent :model="singleRequest" :inline="true" size="mini">
                <el-form-item label="数据类型">
                    <el-select v-model="singleRequest.dsType" clearable>
                        <el-option label="事件源" value="evet"></el-option>
                        <el-option label="决策" value="decs"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据Id">
                    <el-input placeholder="事件源Id或者决策ID" v-model="singleRequest.dsTypeId"></el-input>
                </el-form-item>
                <el-form-item label="流水号">
                    <el-input placeholder="流水号" v-model="singleRequest.seqNo"></el-input>
                </el-form-item>
                <el-form-item label="日志时间">
                    <el-date-picker
                        v-model="value2"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="refreshPage"> 查询</el-button>
                </el-form-item>
            </el-form>
        </div>
<!--        <div>-->
<!--            <a class="helpHome" @click="tohelperHome">帮助文档</a>-->
<!--        </div>-->
    </div>

        <el-table
                ref="multipleTable"
                :data="datasourceList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                border
                size="mini">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <log-data-show :pLogData="scope.row"></log-data-show>
                </template>
            </el-table-column>
            <el-table-column prop="prod" show-overflow-tooltip label="产品id"></el-table-column>
            <el-table-column prop="dsType" show-overflow-tooltip label="数据类型"></el-table-column>
            <el-table-column prop="dsTypeId" show-overflow-tooltip label="数据类型Id"></el-table-column>
            <el-table-column prop="logTime" show-overflow-tooltip label="日志时间"></el-table-column>
            <el-table-column prop="docCollectTime" show-overflow-tooltip label="采集时间"></el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip label="入库时间"></el-table-column>
        </el-table>
        <el-pagination background layout="prev,pager,next" class="pagination" @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="pageSize" :total="total"></el-pagination>
    </div>

</template>

<script>
    import {isNotEmpty} from "../../utils";
    import {SingleRequest} from "../../entity/logdata";
    import LogDataShow from "./LogDataShow";
    import {getLogDataList} from "../../api/LogData";
    import {formatDate} from "../index";

    export default {
        name: "LogDataTable",
        components: {LogDataShow},
        data() {
            return {
                isShow:false,
                datasourceList: [],
                loading: false,
                singleRequest: new SingleRequest(),
                pageNumber: 1,
                pageSize: 10,
                total:0,
                cmptQueryDto:{cmptId:'', prodId:'', cmptName:'', inteType:'', from:'', pageSize:10, pageNum:1},
                isNotEmpty:isNotEmpty,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value2: [new Date(), new Date()],
            }
        },
        mounted() {
            this.init();
            //this.refreshPage();
        },
        methods: {
            init() {
                let that = this;
            },
            tohelperHome(){
                window.open(this.helper.helpUri.uri+'/modules/manage/3.html',"_blank")
            },
            refreshPage() {
                let that = this;
                that.loading = true;
                that.singleRequest.prod = this.gConfig.prodId;
                that.singleRequest.logTimeStart= formatDate(that.value2[0], "yyyy-MM-dd HH:mm:ss");
                that.singleRequest.logTimeEnd= formatDate(that.value2[1], "yyyy-MM-dd HH:mm:ss");
                that.singleRequest.page = this.pageNumber - 1;
                that.singleRequest.limit = this.pageSize;
                let para = {prodId: this.gConfig.prodId, singleRequest:that.singleRequest};
                if(isNotEmpty(that.singleRequest.dsTypeId) && isNotEmpty(that.singleRequest.dsType)){
                    getLogDataList(para)
                        .then(res => {
                            that.datasourceList = res.data.data['objectList'];
                            that.total = res.data.data['total'];
                            //如果实际有数据，并且当前页面没数据时
                            if (that.total > 0 && that.datasourceList.length === 0) {
                                that.pageNumber = 1;
                                that.refreshPage()
                            }
                        }).finally(() => {
                        that.loading = false;
                    })
                }else{
                    this.$message({type: 'warning', message: '检索条件数据类型或者数据ID为空'});
                    that.loading = false;
                }
            },
            handleCurrentChange(val) {
                this.pageNumber = val;
                this.refreshPage();
            },
        }
    }
</script>

<style scoped>

</style>
