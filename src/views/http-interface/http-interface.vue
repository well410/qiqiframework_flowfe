<template>
    <div id="httpInterface">
        <div class="tools">
            <el-form class="page-header" @submit.native.prevent>
                <el-form-item>
                    <div class="search-block">
                        <div class="search-input-container">
                            <el-input class='search-input' placeholder="请输入查询关键字" v-model.trim="searchCon"
                                      maxlength="64" show-word-limit
                                      @keydown.enter.native="refreshPage">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </div>
                        <span class="search-icon-container" @click="refreshPage">
                                <svg-icon icon-class="search"/>
                            </span>
                    </div>

                    <div class="tools-bar" style="margin-bottom: 8px;width: 200px">
                        <div class="clearfix">
                            <a class="helpHome" @click="tohelperHome">帮助文档</a>
                        </div>
                        <div class="tools-button">
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addClick" >
                                新增
                            </el-button>
                            <el-button type="success" size="mini" @click="publishClick" >
                                <svg-icon icon-class="puton"/>
                                发布
                            </el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>


        <div v-loading="loading" element-loading-background="#fff0">
            <div v-if="httpInterfaceList.length!=0"  v-show="httpInterfaceList.length!=0" v-loading="loading">
                <el-checkbox-group v-model="checkList">
                    <div style="display: flex;flex-wrap: wrap; justify-content: space-between;min-height: 719px" >

                        <div  class="card-block" v-for="(o,index) in httpInterfaceList" >
                            <el-checkbox :label="o">
                                <el-card :body-style="{ padding: '0px' }">
                                    <div slot="header" class="clearfix">
                                        <div>
                                            <div class="header-title">
                                                <div class="clearfix" style="width: 100%">
                                                    <span style="width: 20%"> <svg-icon icon-class="ID" class="gray-bule-icon"></svg-icon></span>
                                                    <el-tooltip class="item" effect="dark" :content="o.cmptId" placement="bottom-end" popper-class="card-header-tooltips">
                                                        <span>{{o.cmptId}}</span>
                                                    </el-tooltip>
                                                </div>
                                                <div class="clearfix" style="width: 100%"><span style="width: 20%"> <svg-icon icon-class="name"  class="gray-bule-icon"></svg-icon></span>
                                                    <el-tooltip class="item" effect="dark" :content="o.cmptName" placement="bottom-end" popper-class="card-header-tooltips">
                                                        <span>{{o.cmptName}}</span>
                                                    </el-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <el-tag class="card-status" :type="tagType[o.status]">{{statusFormatter(o)}}</el-tag>
                                        </div>
                                    </div>
                                    <div class="tips-container clearfix"
                                         v-loading="!citeShow"
                                         element-loading-text="拼命加载中"
                                         element-loading-spinner="el-icon-loading"
                                         @click="cmptCitationClick(o)">
                                        <div class="tips-box">
                                            <div class="icon blue">
                                                <svg-icon icon-class="tree_decs"></svg-icon>
                                            </div>
                                            <div class="tips">
                                                <p>被决策引用数</p>
                                                <p class="blue" >{{decsCounts[index]}}</p>
                                            </div>
                                        </div>
                                        <div class="tips-box">
                                            <div class="icon blue"> <svg-icon icon-class="tqs_vars"></svg-icon></div>
                                            <div class="tips">
                                                <p>被天擎变量引用数</p>
                                                <p class="blue">{{tqsCounts[index]}}</p>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="bottom ">
                                        <div>
                                            <el-button class="icon-button" type="primary" size="mini" icon="el-icon-edit" @click="editClick(o)" title="编辑" style="padding: 7px 30px;"></el-button>
                                            <el-button class="icon-button" type="primary" size="mini" icon="el-icon-video-play" @click="debugClick(o)" title="调试" style="padding: 7px 30px;"></el-button>
                                            <el-button class="icon-button" type="primary" size="mini" icon="el-icon-check" @click="verifyClick(o)" title="验证" style="padding: 7px 30px;"></el-button>
                                        </div>
                                        <div>
                                            <el-button class="icon-button" type="primary" size="mini" icon="el-icon-files" @click="versionClick(o)" title="版本" style="padding: 7px 30px;"></el-button>
                                            <el-button class="icon-button" type="primary" size="mini" icon="el-icon-document" @click="hisClick(o)" title="历史" style="padding: 7px 30px;"></el-button>
                                            <el-button class="icon-button" type="danger" size="mini" icon="el-icon-delete" @click="deleteClick(o)"  title="删除" style="padding: 7px 30px;"></el-button>
                                        </div>

                                    </div>
                                </el-card>
                            </el-checkbox>

                        </div>


                        <div  class="empty-card-block"> </div>
                        <div  class="empty-card-block"> </div>
                        <div  class="empty-card-block"> </div>
                        <div  class="empty-card-block"> </div>
                        <!--            </div>-->
                    </div>
                </el-checkbox-group>
            </div>

            <div v-else class="no-data">
                <svg-icon icon-class="list_http"/>
                <br/>
                <br/>
                <span>未查询到http组件数据</span>
            </div>
        </div>

        <div class="page-block clearfix">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 30, 60, 100]"
                    :page-size="pageSize"
                    :current-page=currentPage
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>



    </div>
</template>

<script>
    import {tabType, actType, tagType, statusType, routePath,
        statusFormatterCommon, checkPublishSelectedCmptVersionList} from "../common/common";
    import {successTip, errorTip} from "../../utils/tools";
    import {statusTypeConstants} from "../../constants/status-type";
    import {changeTypeConstants} from "../../constants/change-type";
    import {Prod} from "../../entity/prod";
    import {
        saveCmptBase,
        deleteCmptBase,
        publishCmptBase,
        getFuzzyCmptBasePaged,
        getFuzzyCmptBasePagedAndDecs, queryFuzzyCmptBasePagedAndCiteCount, queryCiteCount,
    } from "../../api/cmpt-interface";
    import CmptDetailShow from "../common/cmpt-detail-show";

    export default {
        name: "HttpInterface",
        components: {CmptDetailShow},
        data() {
            return {
                // =====查询=====
                bindQueryDto: {
                    'cmptId': '',
                    'cmptName': '',
                    'status': ''
                },
                cmptQueryDto: {
                    'cmptId': '',
                    'cmptName': '',
                    'status': '',
                    'inteType': 'H',
                    'pageNum': 1,
                    'pageSize': 10,
                },
                // =====表格+分页=====

                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0,
                cmptDecsList:[],
                decsUri:'',
                currentPage:1,
                httpInterfaceList: [],
                selectedCmptBaseList: [],
                checkList:[],
                searchCon:"",
                prod: new Prod(),
                // =====发布按钮加载=====
                publishBtnLoading: false,
                // =====状态=====
                statusTypeConstants: statusTypeConstants,
                // =====操作类型=====
                changeTypeConstants: changeTypeConstants,
                // =====面包屑=====
                tabType: tabType,
                actType: actType,
                tagType: tagType,
                statusType: statusType['base'],
                // =====路由路径=====
                routePath: routePath,
                decsCounts:[],
                tqsCounts:[],
                citeShow:false
            };
        },

        methods: {

            queryCmptBaseList () {
                this.pageNum = 1;
                this.cmptQueryDto.cmptId = this.bindQueryDto.cmptId;
                this.cmptQueryDto.cmptName = this.bindQueryDto.cmptName;
                this.cmptQueryDto.status = this.bindQueryDto.status;
                this.refreshPage();
            },
            tohelperHome(){
                window.open(this.helper.helpUri.uri+'/modules/component/4.html#http组件配置',"_blank")
            },
            toggle(showStatus){
                return !showStatus
            },
            connectDecsClick(decs){
                window.open(this.decsUri+`/ui/decsManage/decsInf?prodId=${decs.prodId}&decsId=${decs.decsId}&tab=decsFlowG6`,"_blank");
            },

            refreshPage () {

                let searchStatus = ''
                let searchCon = this.searchCon
                if (this.searchCon !== '' && (this.searchCon ==='草稿')) {
                    searchStatus = '0'
                    searchCon = ''
                } else if (this.searchCon !== '' && (['验证', '已验证'].includes(this.searchCon))) {
                    searchStatus = '1'
                    searchCon = ''
                } else if (this.searchCon !== '' && (['发布', '已发布'].includes(this.searchCon))) {
                    searchStatus = '2'
                    searchCon = ''
                }

                this.cmptQueryDto.status = searchStatus;
                this.cmptQueryDto.status = searchStatus;
                this.cmptQueryDto.cmptId = searchCon;
                this.cmptQueryDto.cmptName = searchCon;

                this.cmptQueryDto.pageNum = this.pageNum;
                this.cmptQueryDto.pageSize = this.pageSize;
                // this.cmptQueryDto.status = this.bindQueryDto.status;
                this.loading = true;
                let that = this;
                that.cmptDecsList=[];
                that.checkList=[];
                that.decsUri='';
                that.citeShow=false;
                // this.decsCounts=[];
                // this.tqsCounts=[];
                queryFuzzyCmptBasePagedAndCiteCount(this.prod.prodId,this.cmptQueryDto).then(res=>{
                    if (res.data!=null ){
                        that.total=res.data.data['total'];
                        that.httpInterfaceList=res.data.data["objectList"];;
                        // for (let i=0;i<that.httpInterfaceList.length;i++){
                        //     that.decsCounts[i]="..."
                        // }
                        that.showCiteCount(that.httpInterfaceList);
                    }
                }).catch((res) => {
                    // errorTip("查询失败，"+res.message);
                }).finally(() => {
                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                    // that.showCiteCount(that.httpInterfaceList);
                })
            },
            showCiteCount(httpInterfaceList){
                let that=this;
                // that.loading = true;
                let httpList=httpInterfaceList.map(item =>{
                    return {prodId:item.prodId,cmptId:item.cmptId};
                });
                this.decsCounts=[];
                this.tqsCounts=[];
                queryCiteCount(this.prod.prodId,httpList).then(res=>{
                    let resData=res.data.data;
                    for (let i=0;i<resData[0].length;i++){
                        this.decsCounts[i]=resData[0][i];
                        this.tqsCounts[i]=resData[1][i];
                    }
                    that.citeShow=true;
                }).finally(()=>{
                    // that.loading = false;
                })

            },

            init () {
                console.log("刷新http页面");
                this.refreshPage();
            },

            initData () {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
            },

            /**
             * 切换页面
             * */
            handleCurrentChange(val) {
                this.pageNum = val;
                this.currentPage = val;
                this.refreshPage();
            },

            handleSizeChange(val) {
                this.pageNum =1;
                this.pageSize = val;
                this.currentPage = 1;
                this.refreshPage();
            },

            /**
             * 勾选表格选项
             * */
            handleSelectionChange (selection) {
                this.selectedCmptBaseList = selection;
            },

            /**
             * 表格数据转换
             * */
            statusFormatter (row) {
                return statusFormatterCommon(row);
            },

            addClick () {
                // this.$router.push({path: this.routePath.httpActionPath, query: {tab: this.tabType.httpInterfaceConfig, act: this.actType.httpAdd}});
                this.$router.push({path: this.routePath.httpActionPath, query: {act: this.actType.httpAdd, title: "HTTP接口新增"}});
            },
            /**
             * 删除接口
             * */
            deleteClick (row) {
                let that = this;
                let msg = '确定删除组件' + row.cmptId + '吗?';
                this.$confirm(msg, '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(() => {
                    deleteCmptBase(that.prod.prodId, row.cmptId).then((res) => {
                        successTip('删除组件成功');
                        // successTip(res.data.data);
                        that.queryCmptBaseList();
                    }).catch((res) => {
                        // errorTip('删除组件失败，' + res.message);
                    })
                })
            },

            /**
             * 发布接口
             * */
            publishClick () {

                this.selectedCmptBaseList =this.checkList
                if ( this.selectedCmptBaseList.length === 0) {
                    this.$alert('请选择需发布的组件', '警告', {
                        confirmButtonText: '确定',
                        type: 'error'
                    });
                    return;
                }

                if (checkPublishSelectedCmptVersionList(this.selectedCmptBaseList)) {
                    this.publishBtnLoading = true;
                    let that = this;
                    publishCmptBase(this.prod.prodId, this.selectedCmptBaseList).then((res) => {
                        if (res.data.data == null || !(res.data.data instanceof Array) || res.data.data.length === 0) {
                            successTip('发布组件成功');
                            that.refreshPage();
                        } else {
                            errorTip('发布组件失败，失败组件编号如下：' + res.data.data.join(','));
                        }
                        // successTip(res.data.data);
                        that.refreshPage();
                    }).catch((res) => {
                        // errorTip('发布组件失败，' + res.message);
                    }).finally(() => {
                        setTimeout(() => {
                            this.publishBtnLoading = false;
                        }, 500);
                    })
                }
            },
            /**
             * 编辑
             * */
            editClick (row) {
                this.$router.push({
                    path: this.routePath.httpActionPath,
                    // query: {cmptId: row['cmptId'], tab: this.tabType.httpInterfaceConfig, act: this.actType.httpEdit}
                    // query: {cmptId: row['cmptId'], tab: this.tabType.httpInterfaceDebug, act: this.actType.httpEdit}
                    query: {cmptId: row['cmptId'], act: this.actType.httpEdit, title: 'HTTP接口'}
                });
            },
            /**
             * 调试
             * */
            debugClick (row) {
                this.$router.push({
                    path: this.routePath.httpActionPath,
                    query: {cmptId: row['cmptId'], act: this.actType.httpDebug, title: 'HTTP接口调试'}
                });
            },
            /**
             * 验证
             * */
            verifyClick (row) {
                let rowTmp = JSON.parse(JSON.stringify(row));
                rowTmp['status'] = this.statusTypeConstants.VERIFY.value;
                rowTmp['changeType'] = this.changeTypeConstants.CHECK.value;
                let that = this;
                saveCmptBase(this.prod.prodId, 'httpBase', rowTmp).then(() => {
                    successTip('验证组件成功');
                    that.refreshPage();
                }).catch(() => {
                    // errorTip('验证组件失败')
                });
            },
            /**
             * 历史
             * */
            hisClick (row) {
                this.$router.push({
                    path: this.routePath.httpHistoryPath,
                    query: {cmptId: row['cmptId']}
                });
            },
            /**
             * 版本
             * */
            versionClick (row) {
                this.$router.push({
                    path: this.routePath.httpVersionPath,
                    query: {cmptId: row['cmptId']}
                });
            },
            cmptCitationClick(cmpt){
                this.$router.push({
                    path: this.routePath.httpCitationPath,
                    query: {cmptId: cmpt['cmptId']}
                });
            },
        },
        mounted() {
            this.initData();
            this.refreshPage();
        },
    }
</script>
<style>
    #httpInterface{
        height: 100%;
        padding: 0 10px 0 10px;
        background-image: url('~@/assets/bg.png');
        background-size: 100% 100%;
    }
</style>
