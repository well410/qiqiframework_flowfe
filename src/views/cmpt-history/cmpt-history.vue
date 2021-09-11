<template>
    <div id="cmptHistory">
        <el-card class="his-ver-title">
            <div style="display: flex;justify-content: space-between">
                <el-page-header @back="goBackClick">
                    <div slot="content">
                        <span class="is-bold">{{title}}</span>
                    </div>
                </el-page-header>
                <div>
                    <i class="el-icon-question icon-Add-style" @click="tohelperHis"></i>
                </div>
            </div>
        </el-card>
        <el-card class="his-ver-content">
            <!--查询条件暂时没用-->
            <!--<div class="tools">-->
                <!--<el-form @submit.native.prevent :inline="true" size="mini">-->
                    <!--<el-form-item label="组件名">-->
                        <!--<el-input placeholder="请输入组件名" v-model="bindQueryDto.cmptName"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="组件ID">-->
                        <!--<el-input placeholder="请输入组件ID" v-model="bindQueryDto.cmptId"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="queryCmptHistoryList">查询</el-button>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
            <!--</div>-->
            <div>
                <el-table
                        ref="multipleTable"
                        :data="cmptHistoryList"
                        v-loading="loading"
                        tooltip-effect="dark"
                        stripe
                        size="mini"
                        style="width: 100%; min-height: 753px;">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <cmpt-detail-show :cmpt-entity="props.row" page-type="historyPage"></cmpt-detail-show>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cmptId"  align="center" show-overflow-tooltip label="组件ID"></el-table-column>
                    <el-table-column prop="cmptName" align="center" show-overflow-tooltip label="组件名"></el-table-column>
                    <el-table-column prop="status"  align="center" show-overflow-tooltip label="状态">
                        <template slot-scope="props">
                            <el-tag :type="tagType[props.row.status]"  style="width: 60px">{{statusFormatter(props.row)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="changeType"  align="center" show-overflow-tooltip label="操作类型">
                        <template slot-scope="props">
                            <el-tag type="primary">{{changeTypeFormatter(props.row)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cmptVersion" align="center" show-overflow-tooltip label="版本"></el-table-column>
                    <el-table-column prop="createTime"  align="center" show-overflow-tooltip label="创建时间"></el-table-column>
                    <el-table-column prop="createUser" align="center" show-overflow-tooltip label="创建人"></el-table-column>
                </el-table>
                <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        class="pagination-bar"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[20, 50, 80, 100]"
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="total">
                </el-pagination>
<!--                <el-pagination background layout="total,prev,pager,next" class="pagination" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" :total="total"></el-pagination>-->
            </div>
        </el-card>
    </div>
</template>

<script>
    import {tagType, statusFormatterCommon, changeTypeFormatterCommon} from "../common/common";
    import {errorTip} from "../../utils/tools";
    import {metaTitleConstants} from "../../constants/meta-title";
    import {Prod} from "../../entity/prod";
    import {getCmptHistoryPaged} from "../../api/cmpt-history";
    import CmptDetailShow from "../common/cmpt-detail-show";

    export default {
        name: "CmptHistory",
        components: {CmptDetailShow},
        data() {
            return {
                // =====查询=====
                bindQueryDto: {
                    'cmptId': '',
                    'cmptName': ''
                },
                cmptQueryDto: {
                    'cmptId': '',
                    'cmptName': '',
                    'start': 0,
                    'limit': 10,
                },
                // =====标题=====
                title: '组件历史',
                // =====表格+分页=====
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0,
                cmptHistoryList: [],
                prod: new Prod(),
                act: '',
                tagType: tagType,
                // =====记录跳转的路由=====
                historyPath: ''
            };
        },

        methods: {
            queryCmptHistoryList () {
                this.pageNum = 1;
                this.cmptQueryDto.cmptId = this.bindQueryDto.cmptId;
                this.cmptQueryDto.cmptName = this.bindQueryDto.cmptName;
                this.refreshPage();
            },
            tohelperHis(){
                window.open(this.helper.helpUri.uri+this.nextPath,"_blank")
            },

            refreshPage () {
                this.cmptQueryDto.start = (this.pageNum - 1) * this.pageSize;
                this.cmptQueryDto.limit = this.pageSize;
                this.loading = true;
                let that = this;
                getCmptHistoryPaged(this.prod.prodId, this.cmptQueryDto).then(res => {
                    if (res.data.data != null) {
                        that.cmptHistoryList = res.data.data['objectList'];
                        that.total = res.data.data['total'];
                    }
                }).catch((res) => {
                    // errorTip("查询失败，"+res.message);
                }).finally(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                })
            },

            init () {
                console.log("刷新组件版本页面");
                this.refreshPage();
            },

            initData () {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
                this.cmptQueryDto.cmptId = this.$route.query['cmptId'] === undefined ? '' : this.$route.query['cmptId'];
            },

            /**
             * 切换页面
             * */
            handleCurrentChange (val) {
                this.pageNum = val;
                this.refreshPage();
            },

            handleSizeChange (val) {
                this.pageSize = val
                this.pageNum = 1;
                this.refreshPage();
            },

            /**
             * 表格数据转换
             * */
            statusFormatter (row) {
                return statusFormatterCommon(row);
            },

            changeTypeFormatter (row) {
                return changeTypeFormatterCommon(row);
            },
            /**
             * 返回
             * */
            goBackClick () {
                this.$router.push({path: this.historyPath});
            },

        },
        mounted() {
            this.initData();
            this.refreshPage();
        },
        beforeRouteEnter (to, from, next){
            next(vm => {
                // 通过 `vm` 访问组件实例
                if (from.meta.title === metaTitleConstants.HttpComponentsManage
                    || from.meta.title === metaTitleConstants.KafkaComponentsManage
                    || from.meta.title === metaTitleConstants.ModelComponentsManage) {
                    vm.historyPath = from.path
                }
                if (from.meta.title === metaTitleConstants.HttpComponentsManage){
                    vm.nextPath='/modules/component/4.html#http组件历史'
                }else if(from.meta.title === metaTitleConstants.KafkaComponentsManage){
                    vm.nextPath='/modules/component/4.html#kafka组件配置'
                }else{
                    vm.nextPath='/modules/component/4.html#模型组件配置'
                }
            })
        }
    }
</script>
