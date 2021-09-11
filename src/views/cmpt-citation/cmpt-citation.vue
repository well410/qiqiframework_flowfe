<template>
    <div id="cmptCitation">
        <el-scrollbar>
            <el-card class="his-ver-title">
                <div style="display: flex;justify-content: space-between">
                    <el-page-header @back="goBackClick">
                        <div slot="content">
                            <span class="is-bold">{{title}}</span>
                        </div>
                    </el-page-header>
                    <div>
                        <i class="el-icon-question icon-Add-style" @click="tohelperVer"></i>
                    </div>
                </div>
            </el-card>
            <el-card class="his-ver-title">

                <el-table
                        ref="multipleTable"
                        :data="cmptDto"
                        v-loading="loading"
                        tooltip-effect="dark"
                        stripe
                        size="mini"
                        style="width: 100%;">

                    <el-table-column prop="cmptId" align="center" show-overflow-tooltip label="组件ID"></el-table-column>
                    <el-table-column prop="cmptVersion" align="center" show-overflow-tooltip label="版本"></el-table-column>
                    <el-table-column prop="decsCount" align="center" show-overflow-tooltip label="被决策引用次数"></el-table-column>
                    <el-table-column v-if="isNotKafka" prop="tqsCount" align="center" show-overflow-tooltip label="被天擎变量引用次数"></el-table-column>
                    <el-table-column label="操作" align="center" show-overflow-tooltip width="130px">
                        <template slot-scope="scope">
                            <el-button  size="mini" type="primary" @click="showCitation(scope['row'])">
                                显示详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div>
                <el-pagination
                        background
                        class="paginationColor"
                        layout="total, sizes, prev, pager, next, jumper"
                        style="margin-top: 10px;margin-bottom: 10px"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="total">
                </el-pagination>
                </div>
            </el-card>

            <el-card class="his-ver-title">
                <div style="display: flex;justify-content: space-between">
                    <div style="margin: 15px 0">
                        引用关系
                        <el-divider direction="vertical" style="margin: 0 15px"></el-divider>
                        组件版本:<div class="cite-version">{{currentVersion==='0'?"无版本":currentVersion}}</div>
                    </div>
                </div>
                <el-collapse v-model="activeName">
                    <el-collapse-item name="decs">
                        <template slot="title" >
                            <div title="被决策引用展示" style="width: 100%">
                                <span>被决策引用展示</span>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>

                                <el-button  size="mini"  class="right-button" style="float: right;margin: 10px 0px;margin-right: 10px;">
                                    展开或关闭
                                </el-button>
                            </div>
                        </template>
                        <el-card style="margin: 20px 0">
                            <el-table
                                    ref="multipleTable"
                                    tooltip-effect="dark"
                                    :data="decsCitation"
                                    style="cursor: pointer"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="decsId" label="决策Id" width="350">
                                </el-table-column>
                                <el-table-column prop="decsName" label="决策名" width="350"></el-table-column>
                                <el-table-column prop="decsVersion" label="决策版本"></el-table-column>
                                <el-table-column prop="count" label="版本数量" width="70"></el-table-column>
                            </el-table>
                        </el-card>
                    </el-collapse-item>

                    <el-collapse-item name="tqs" v-if="isNotKafka">
                        <template slot="title" >
                            <div title="被天擎数据源引用展示" style="width: 100%">
                                <span>被天擎数据源引用展示</span>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>

                                <el-button  size="mini"  class="right-button" style="float: right;margin: 10px 0px;margin-right: 10px;">
                                    展开或关闭
                                </el-button>
                            </div>
                        </template>
                        <el-card style="margin: 20px 0">
                            <el-table
                                    ref="multipleTable"
                                    tooltip-effect="dark"
                                    :data="tqsDto"
                                    style="cursor: pointer"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="datasourceId" label="天擎数据源Id" >
                                </el-table-column>
                                <el-table-column prop="datasourceName" label="数据源名称" ></el-table-column>
                            </el-table>
                        </el-card>
                    </el-collapse-item>

                </el-collapse>

            </el-card>
        </el-scrollbar>
    </div>
</template>

<script>
    import {metaTitleConstants} from "../../constants/meta-title";
    import {
        historyPathStore,
        queryCmptVersionCitation,
        queryCmptVersionCiteCount
    } from "../cmpt-citation/cmpt-citation";
    import {routePath} from "../common/common";
    import {Prod} from "../../entity/prod";

    export default {
        name: "cmptCitation",
        data() {
            return {
                title: '组件引用关系',
                historyPathStore: historyPathStore,
                // =====路由路径=====
                routePath: routePath,
                cmptDto:[],
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0,
                prod: new Prod(),
                cmptQueryDto: {
                    'cmptId': '',
                    'cmptName': '',
                    'start': 0,
                    'limit': 10,
                },
                currentVersion:'',
                defaultVersion:'0',
                act: '',
                decsCitation:[],
                tqsDto:[],
                isNotKafka:false,
                nextPath:'/modules/component/4.html#http组件版本',
                activeName:[]
            }
        },
        methods: {
            init () {
                console.log("刷新组件引用页面");
                this.refreshPage();
            },
            refreshPage () {
                this.cmptQueryDto.start = (this.pageNum - 1) * this.pageSize;
                this.cmptQueryDto.limit = this.pageSize;
                this.loading = true;
                let that = this;
                queryCmptVersionCiteCount(that.prod.prodId,that.cmptQueryDto).then(res => {
                    if (res.data.data != null) {
                        that.cmptDto = res.data.data['objectList'];
                        that.total = res.data.data['total'];

                        if (that.pageNum===1 && that.total>0){
                            that.defaultVersion=that.cmptDto[0]["cmptVersion"];
                        }
                        that.currentVersion=that.defaultVersion;
                        that.showCitationChange(that.currentVersion);
                    }

                }).catch((res) => {
                    // errorTip("查询失败，"+res.message);
                }).finally(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                })
            },

            initData () {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
                this.act = this.$route.query['act'] === undefined ? '' : this.$route.query['act'];
                this.cmptQueryDto.cmptId = this.$route.query['cmptId'] === undefined ? '' : this.$route.query['cmptId'];
            },
            tohelperVer(){
                window.open(this.helper.helpUri.uri+this.nextPath,"_blank")
            },
            goBackClick () {
                let historyPath = this.historyPathStore.getHistoryPath();
                if (historyPath === this.routePath.httpBasePath || historyPath === this.routePath.kafkaBasePath || historyPath === this.routePath.modelBasePath) {
                    this.$router.push({path: historyPath});
                }
            },
            /**
             * 切换页面
             * */
            handleCurrentChange (val) {
                this.pageNum = val;
                this.refreshPage();
            },
            handleSizeChange (val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.refreshPage();
            },
            showCitation(row){
                let that=this;
                that.currentVersion=row.cmptVersion;
                that.showCitationChange(that.currentVersion);
            },
            showCitationChange(cv) {
                let that = this;
                queryCmptVersionCitation(that.prod.prodId, that.cmptQueryDto.cmptId, cv).then(res => {
                    if (res.data!=null && res.data.length==2){
                        that.decsCitation=res.data[0].data;
                        that.tqsDto=res.data[1].data;

                    }
                })
            }
        },
        mounted() {
            this.initData();
            this.refreshPage();
            this.activeName=['decs','tqs'];
        },
        beforeRouteEnter (to, from, next){
            next(vm => {
                // 通过 `vm` 访问组件实例
                if (from.meta.title === metaTitleConstants.HttpComponentsManage
                    || from.meta.title === metaTitleConstants.KafkaComponentsManage
                    || from.meta.title === metaTitleConstants.ModelComponentsManage) {
                    vm.historyPathStore.setHistoryPath(from.path)
                }
                if (from.meta.title === metaTitleConstants.HttpComponentsManage){
                    vm.nextPath='/modules/component/4.html#http组件版本'
                    vm.isNotKafka=true;
                }else if(from.meta.title === metaTitleConstants.KafkaComponentsManage){
                    vm.nextPath='/modules/component/4.html#kafka组件配置'
                    vm.isNotKafka=false;
                } else {
                    vm.nextPath='/modules/component/4.html#模型组件版本'
                    vm.isNotKafka=true;                    
                }
            })
        }
    }
</script>

<style scoped>


    /deep/ .paginationColor.el-pagination.is-background.el-pagination span{
        color: #333333;
    }
    /deep/ .paginationColor.el-pagination .el-input__inner{
        color: #333333;
    }
    /deep/ .paginationColor.el-pagination.is-background .el-pager li:not(.disabled).active{
        background-color: #409EFF;
        color: #FFF;
    }
    .cite-version{
        color: #ffffff;
        float: right;
        margin-left: 15px;
        background: #92b2ef;
        padding: 0px 15px;
        border-radius: 5px
    }
</style>