<template>
    <div id="evCmptTable">
        <div class="tools">
            <el-form @submit.native.prevent :model="dsFilter" >
                <el-form-item style="margin: 0">
                    <div class="node-search-block">
                        <el-row>
                            <el-col :xs="24" :sm="12" :md="11" :lg="11" :xl="11" style="padding-right:10px ">
                                <el-input placeholder="数据源ID" v-model="dsFilter.datasourceId" class="radius-input" @keydown.enter.native="refreshPage"></el-input>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="11" :lg="11" :xl="11" style="padding-right:10px ">
                                <el-input placeholder="数据源名" v-model="dsFilter.datasourceName" class="radius-input" @keydown.enter.native="refreshPage"></el-input>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="2" :lg="2" :xl="2" style="padding-right:10px ">
                                <el-button type="primary" @click="refreshPage" size="mini"> 查询</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <el-table
                ref="multipleTable"
                :data="datasourceList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                border
                size="mini">
            <!--            <el-table-column type="expand">-->
            <!--                <template slot-scope="scope">-->
            <!--                    <cmpt-show :p-cmpt="scope.row"></cmpt-show>-->
            <!--                </template>-->
            <!--            </el-table-column>-->
            <el-table-column prop="datasourceId"  label="数据源id"></el-table-column>
            <el-table-column prop="datasourceName"  label="数据源名"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="props">
                    <el-button @click="datasourceSelClick(props.row)"  size="mini" class="icon-button"
                               title="选择">
                        <svg-icon icon-class="choose_ver" style="width: 1.6em;height: 1.6em;color: #409eff"></svg-icon>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="clearfix">
            <el-pagination background layout="total,prev,pager,next" class="pagination" @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="pageSize" :total="total"></el-pagination>
        </div>

    </div>

</template>

<script>
    import {isNotEmpty} from "../../utils";
    import {compEnums} from '../../entity/enumns'
    import {getDsListEv} from "../../api/Datasource";

    export default {
        name: "DatasourceTable",
        props: {
            pDecisionTree: Object,
            pNode: Object,
        },
        mounted() {
            this.refreshPage();
        },
        data() {
            return {
                isShow:false,
                datasourceList: [],
                loading: false,
                dsFilter: {},
                pageNumber: 1,
                pageSize: 10,
                total:0,
                // cmptQueryDto:{cmptId:'', prodId:'', cmptName:'', inteType:'', from:'', pageSize:10, pageNum:1},
                isNotEmpty:isNotEmpty,
            }
        },
        methods:{
            refreshPage(){
                let that = this;
                that.loading = true;
                let para = {prodId: this.gConfig.prodId, pageNum: that.pageNumber, pageSize: that.pageSize, dsFilter:that.dsFilter};
                getDsListEv(para)
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
            },
            datasourceSelClick(datasource) {
                let that = this;
                that.isShow = false;
                switch (that.pNode.nData.compType) {
                    case compEnums.EVStore.code:
                        that.$emit("evCmptSelClick",datasource);
                        break;
                    default:
                        throw new Error("节点类型未知");
                        break;
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
    .tools {
        padding: 15px 0;
        background: #f7f7f7;
        border: 1px solid #e4e7ed;
    }

</style>
