<template>
    <div id="cmptVersion">
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
        <el-card class="his-ver-content">
            <div class="tools">
                <el-form @submit.native.prevent :inline="true" size="mini">
                    <!--<el-form-item label="组件名">-->
                        <!--<el-input placeholder="请输入组件名" v-model="bindQueryDto.cmptName"></el-input>-->
                    <!--</el-form-item>-->
                    <!--因为目前定为不需要支持查询，所以v-model绑定的数据是cmptQueryDto中的数据，若是后面改为支持查询，要还原为bindQueryDto-->
<!--                    <el-form-item label="组件ID">-->
<!--                        <el-input placeholder="请输入组件ID" v-model="cmptQueryDto.cmptId" readonly></el-input>-->
<!--                    </el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-button type="primary" @click="queryCmptVersionList">查询</el-button>-->
                    <!--</el-form-item>-->

                    <el-form-item style=" margin-bottom: 10px;">
                        <el-button type="success" @click="onlineClick" :disabled="selectedCmptVersionList.length === 0"
                                   :loading="onlineBtnLoading"> <svg-icon icon-class="puton"/>上线</el-button>
                    </el-form-item>
                    <el-form-item style=" margin-bottom: 10px;">
                        <el-button type="warning" @click="offlineClick" :disabled="selectedCmptVersionList.length === 0"
                                   :loading="offlineBtnLoading"> <svg-icon icon-class="putoff"/>下线</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-divider></el-divider>
            <div>
                <el-table
                        ref="multipleTable"
                        :data="cmptVersionList"
                        v-loading="loading"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        stripe
                        size="mini"
                        style="width: 100%; min-height: 708px;">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <cmpt-detail-show :cmpt-entity="props.row" page-type="versionPage"></cmpt-detail-show>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="cmptId" align="center" show-overflow-tooltip label="组件ID"></el-table-column>
                    <el-table-column prop="cmptName" align="center" show-overflow-tooltip label="组件名"></el-table-column>
                    <el-table-column prop="status" align="center" show-overflow-tooltip label="状态">
                        <template slot-scope="props">
                            <el-tag :type="tagType[props.row.status]">{{statusFormatter(props.row)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cmptVersion" align="center" show-overflow-tooltip label="版本"></el-table-column>
                    <el-table-column prop="updateTime" align="center" show-overflow-tooltip label="修改时间"></el-table-column>
                    <el-table-column prop="updateUser" align="center" show-overflow-tooltip label="修改人"></el-table-column>
                    <el-table-column label="操作" align="center" show-overflow-tooltip width="130px">
                        <template slot-scope="scope">
                            <el-button class="icon-button" size="mini" icon="el-icon-video-play" @click="debugClick(scope['row'])" title="调试"></el-button>
                            <el-button type="danger"  class="icon-button" icon="el-icon-delete"
                                       size="mini" @click="deleteCmptClick(scope['row'])"
                                       style=" width: 1.9em;height: 1.9em; color: #f56c6c;" title="删除"></el-button>
                            <el-button class="icon-button" size="mini" v-if="scope['row'].inteType === 'M'" icon="el-icon-download" @click="downloadPmml(scope['row'])" title="模型文件下载"></el-button>
                            <!--<el-button type="primary" size="mini" icon="el-icon-document" @click="onlineClick(scope['row'])" :disabled="true">上线</el-button>-->
                            <!--<el-button type="primary" size="mini" icon="el-icon-files" @click="offlineClick(scope['row'])" :disabled="true">下线</el-button>-->
                        </template>
                    </el-table-column>
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
    import {tagType, tabType, actType, routePath, statusFormatterCommon} from "../common/common";
    import {successTip, errorTip, isNotEmpty} from "../../utils/tools";
    import {metaTitleConstants} from "../../constants/meta-title";
    import {Prod} from "../../entity/prod";
    import {checkOnlineSelectedCmptVersionList, checkOfflineSelectedCmptVersionList, historyPathStore} from "./cmpt-version";
    import {
        getCmptVersionPaged,
        onlineCmptVersion,
        offlineCmptVersion,
        deleteCmptVersion
    } from "../../api/cmpt-version";
    import CmptDetailShow from "../common/cmpt-detail-show";
    import {downloadCmptModelFile} from "../../api/cmpt-interface";
    import FileSaver from "file-saver";

    export default {
        name: "CmptVersion",
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
                title: '组件版本',
                // =====表格+分页=====
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0,
                cmptVersionList: [],
                selectedCmptVersionList: [],
                prod: new Prod(),
                // =====发布按钮加载=====
                onlineBtnLoading: false,
                offlineBtnLoading: false,
                // =====面包屑=====
                tabType: tabType,
                // =====记录跳转的路由=====
                historyPathStore: historyPathStore,
                // =====操作=====
                actType: actType,
                act: '',
                tagType: tagType,
                // =====路由路径=====
                routePath: routePath
            };
        },

        methods: {
            queryCmptVersionList () {
                this.pageNum = 1;
                this.cmptQueryDto.cmptId = this.bindQueryDto.cmptId;
                this.cmptQueryDto.cmptName = this.bindQueryDto.cmptName;
                this.refreshPage();
            },
            tohelperVer(){
                window.open(this.helper.helpUri.uri+this.nextPath,"_blank")
            },

            refreshPage () {
                this.cmptQueryDto.start = (this.pageNum - 1) * this.pageSize;
                this.cmptQueryDto.limit = this.pageSize;
                this.loading = true;
                let that = this;
                getCmptVersionPaged(this.prod.prodId, this.cmptQueryDto).then(res => {
                    if (res.data.data != null) {
                        that.cmptVersionList = res.data.data['objectList'];
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
                this.act = this.$route.query['act'] === undefined ? '' : this.$route.query['act'];
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
                this.pageSize = val;
                this.pageNum = 1;
                this.refreshPage();
            },

            /**
             * 勾选表格选项
             * */
            handleSelectionChange (selection) {
                this.selectedCmptVersionList = selection;
            },

            /**
             * 表格数据转换
             * */
            statusFormatter (row) {
                return statusFormatterCommon(row);
            },


            deleteCmptClick(row){
                let that = this;
                this.$confirm('确定要删除组件嘛？（不可恢复）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    deleteCmptVersion(row).then(res=>{
                        that.$message({type: 'success', message: "删除成功"});
                        that.refreshPage();
                    })
                }).catch(() => {});
            },


            /**
             * 上线接口
             * */
            onlineClick () {
                if (checkOnlineSelectedCmptVersionList(this.selectedCmptVersionList)) {
                    this.onlineBtnLoading = true;
                    let cmptIdList = [];
                    let cmptVersionList = [];
                    this.selectedCmptVersionList.forEach(function (cmptVersion) {
                        cmptIdList.push(cmptVersion['cmptId']);
                        cmptVersionList.push(cmptVersion['cmptVersion']);
                    });
                    let that = this;
                    onlineCmptVersion(that.prod.prodId, cmptIdList.join(','), cmptVersionList.join(',')).then((res) => {
                        if (res.data.data == null || !(res.data.data instanceof Array) || res.data.data.length === 0) {
                            successTip('上线组件成功');
                            that.refreshPage();
                        } else {
                            errorTip('上线组件失败，失败组件版本号如下：' + res.data.data.join(','));
                        }
                        // successTip(res.data.data);
                        that.refreshPage();
                    }).catch((res) => {
                        // errorTip('上线组件失败，' + res.message);
                    }).finally(() => {
                        setTimeout(() => {
                            this.onlineBtnLoading = false;
                        }, 500);
                    })
                }
            },

            /**
             * 下线接口
             * */
            offlineClick () {
                if (checkOfflineSelectedCmptVersionList(this.selectedCmptVersionList)) {
                    this.offlineBtnLoading = true;
                    let cmptIdList = [];
                    let cmptVersionList = [];
                    this.selectedCmptVersionList.forEach(function (cmptVersion) {
                        cmptIdList.push(cmptVersion['cmptId']);
                        cmptVersionList.push(cmptVersion['cmptVersion']);
                    });
                    let that = this;
                    offlineCmptVersion(that.prod.prodId, cmptIdList.join(','), cmptVersionList.join(',')).then((res) => {
                        if (res.data.data == null || !(res.data.data instanceof Array) || res.data.data.length === 0) {
                            successTip('下线组件成功');
                            that.refreshPage();
                        } else {
                            errorTip('下线组件失败，失败组件的版本号如下：' + res.data.data.join(','));
                        }
                        // successTip(res.data.data);
                        that.refreshPage();
                    }).catch((res) => {
                        // errorTip('下线组件失败，' + res.message);
                    }).finally(() => {
                        setTimeout(() => {
                            this.offlineBtnLoading = false;
                        }, 500);
                    })
                }
            },

            downloadPmml(row) {
                downloadCmptModelFile(this.prod.prodId, row['cmptVersion']).then(res => {
                    if(isNotEmpty(res.data)) {
                        let blob = new Blob([res.data], {
                            type: "application/xml"
                        });
                        let conf = JSON.parse(row['inteConf']);
                        if(isNotEmpty(conf.rawModelFile))
                            FileSaver.saveAs(blob, conf.rawModelFile);
                        else
                            FileSaver.saveAs(blob, conf.modelFile);
                    }
                });
            },

            /**
             * 调试
             * */
            debugClick (row) {
                if (row['inteType'] === 'H') {
                    this.$router.push({
                        path: this.routePath.httpActionPath,
                        query: {cmptId: row['cmptId'], cmptVersion: row['cmptVersion'] , act: this.actType.httpVersion}
                    });
                } else if(row['inteType'] === 'M') {
                    this.$router.push({
                        path: this.routePath.modelActionPath,
                        query: {cmptId: row['cmptId'], cmptVersion: row['cmptVersion'] , act: this.actType.modelVersion}
                    });
                } else {
                    this.$router.push({
                        path: this.routePath.kafkaActionPath,
                        query: {cmptId: row['cmptId'], cmptVersion: row['cmptVersion'],  act: this.actType.kafkaVersion}
                    });
                }
            },
            /**
             * 返回
             * */
            goBackClick () {
                let historyPath = this.historyPathStore.getHistoryPath();
                if (historyPath === this.routePath.httpBasePath || historyPath === this.routePath.kafkaBasePath
                    || historyPath === this.routePath.modelBasePath) {
                    this.$router.push({path: historyPath});
                }
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
                    vm.historyPathStore.setHistoryPath(from.path)
                }
                if (from.meta.title === metaTitleConstants.HttpComponentsManage){
                    vm.nextPath='/modules/component/4.html#http组件版本'
                }else if(from.meta.title === metaTitleConstants.KafkaComponentsManage){
                    vm.nextPath='/modules/component/4.html#kafka组件配置'
                }else{
                    vm.nextPath='/modules/component/4.html#模型组件配置'
                }
            })
        }
    }
</script>
