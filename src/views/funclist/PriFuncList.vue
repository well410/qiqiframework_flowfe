<template>
    <!--函数表格，所有产品下函数的信息-->
    <el-card class="box-card" :body-style="{padding: '0'}" id="priFuncCard">
        <!--操作工具栏-->
        <div class="search-bar">
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
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="funcAddClick">
                                新增
                            </el-button>
                            <el-button type="success" size="mini" @click="multiPublicClick">
                                <svg-icon icon-class="puton"/>
                                发布
                            </el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>

        </div>

        <div v-loading="loading" element-loading-background="#fff0">
            <div v-if="funcList.length!=0" v-show="funcList.length!=0" v-loading="loading">
                <el-checkbox-group v-model="checkList">
                    <div style="display: flex;flex-wrap: wrap; justify-content: space-between;min-height: 724px">
                        <div class="card-block" v-for="(o,index) in funcList">
                            <el-checkbox :label="o">
                                <el-card :body-style="{ padding: '0px' }">
                                    <div slot="header" class="clearfix">
                                        <div>
                                            <div class="header-title">
                                                <div class="clearfix" style="width: 100%">
                                                    <span style="width: 20%"> <svg-icon icon-class="ID"
                                                                                        class="gray-bule-icon"></svg-icon></span>
                                                    <el-tooltip class="item" effect="dark" :content="o.funcId"
                                                                placement="bottom-end"
                                                                popper-class="card-header-tooltips">
                                                        <span>{{o.funcId}}</span>
                                                    </el-tooltip>
                                                </div>
                                                <div class="clearfix" style="width: 100%"><span style="width: 20%"> <svg-icon
                                                        icon-class="name" class="gray-bule-icon"></svg-icon></span>
                                                    <el-tooltip class="item" effect="dark" :content="o.funcName"
                                                                placement="bottom-end"
                                                                popper-class="card-header-tooltips">
                                                        <span>{{o.funcName}}</span>
                                                    </el-tooltip>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <el-tag class="card-status" v-if="isNotEmpty(funcStatusEnums[o.status])"
                                                    :type="tagType[o.status]">
                                                {{funcStatusEnums[o.status].name}}
                                            </el-tag>
                                        </div>

                                    </div>
<!--                                    <div class="showCite" @click="funcCitationClick(o)">-->
<!--                                        <div class="showCite-topHalf">-->
<!--                                            <div class="citeShowFont">被决策引用数：</div>-->
<!--                                            <div class="citeShowCount" v-if="isCiteShow">{{o.decsCount}}</div>-->
<!--                                            <div class="citeShowCount" style="color: #5a89b9" v-if="!isCiteShow">加载中...</div>-->
<!--                                        </div>-->
<!--                                        <div class="vertical-space"></div>-->
<!--                                        <div class="showCite-bottomHalf">-->
<!--                                            <div class="citeShowFont">被规则引用数：</div>-->
<!--                                            <div class="citeShowCount" v-if="isCiteShow">{{o.ruleCount}}</div>-->
<!--                                            <div class="citeShowCount" style="color: #5a89b9" v-if="!isCiteShow">加载中...</div>-->
<!--                                        </div>-->
<!--                                    </div>-->

                                    <div class="tips-container clearfix"
                                         v-loading="!isCiteShow"
                                         element-loading-text="拼命加载中"
                                         element-loading-spinner="el-icon-loading"
                                         @click="funcCitationClick(o)">
                                        <div class="tips-box">
                                            <div class="icon blue">
                                                <svg-icon icon-class="tree_decs"></svg-icon>
                                            </div>
                                            <div class="tips">
                                                <p>被决策引用数</p>
                                                <p class="blue" >{{o.decsCount}}</p>
                                            </div>
                                        </div>
                                        <div class="tips-box">
                                            <div class="icon blue"> <svg-icon icon-class="tree_role"></svg-icon></div>
                                            <div class="tips">
                                                <p>被规则引用数</p>
                                                <p class="blue">{{o.ruleCount}}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="bottom ">
                                        <div>
                                            <el-button class="icon-button" type="primary" size="mini"
                                                       icon="el-icon-edit" @click="funcEditClick(o)"
                                                       title="编辑"
                                                       style="padding: 7px 30px;"></el-button>
                                            <el-button class="icon-button" type="success" size="mini"
                                                       icon="el-icon-video-play" @click="funcDebugClick(o)"
                                                       title="调试"
                                                       style="padding: 7px 30px;"></el-button>
                                            <el-button class="icon-button" type="primary" size="mini"
                                                       icon="el-icon-check" @click="funcCheckClick(o)"
                                                       title="验证"
                                                       style="padding: 7px 30px;"></el-button>
                                        </div>
                                        <div>
                                            <el-button class="icon-button" type="info" size="mini" icon="el-icon-files"
                                                       @click="funcVersionClick(o)"
                                                       title="版本"
                                                       style="padding: 7px 30px;"></el-button>
                                            <el-button class="icon-button" type="info" size="mini"
                                                       icon="el-icon-document" @click="funcHisClick(o)"
                                                       title="历史"
                                                       style="padding: 7px 30px;"></el-button>
                                            <el-button class="icon-button" type="danger" size="mini"
                                                       icon="el-icon-delete" @click="funcDelectClick(o)"
                                                       title="删除"
                                                       style="padding: 7px 30px;"></el-button>
                                        </div>

                                    </div>
                                </el-card>
                            </el-checkbox>

                        </div>


                        <div class="empty-card-block"></div>
                        <div class="empty-card-block"></div>
                        <div class="empty-card-block"></div>
                        <div class="empty-card-block"></div>
                    </div>
                </el-checkbox-group>
            </div>

            <div v-else class="no-data">
                <svg-icon icon-class="star_prifunc"/>
                <br/>
                <br/>
                <span>未查询到私有函数数据</span>
            </div>
        </div>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10, 30, 60, 100]"
                :page-size="pageSize"
                :current-page=currentPage
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>


        <!--新增界面-->
        <el-dialog width="50%" heigh="95%" :visible.sync="add.dialog" :close-on-click-modal="false"
                   class="text-font-family new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{add.title}}
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i>
                    </div>
                </div>
            </div>
            <add-function
                    ref="addFrom"
                    :dialogTitle="add.title"
                    :dialogFormVisible="add.dialog"
                    :func="add.func"
                    :prod="add.prod"
                    v-on:visibleChange="onVisibleChange($event)"
            ></add-function>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog :visible.sync="edit.dialog" :close-on-click-modal="false" class="text-font-family new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{edit.title}}
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i></div>
                </div>
            </div>
            <update-function
                    :dialogTitle="edit.title"
                    :dialogFormVisible="edit.dialog"
                    :func="edit.func"
                    :prod="edit.prod"
                    v-on:visibleChange="onVisibleChange($event)"
            ></update-function>
        </el-dialog>

        <!--调试界面-->
        <el-dialog width="65%" heigh="95%" :visible.sync="debug.dialog" :close-on-click-modal="false"
                   class="text-font-family new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{debug.title}}
                        <i class="el-icon-question icon-Add-style" @click="tohelperTest"></i></div>
                </div>
            </div>
            <pri-debug-function
                    ref="debugFrom"
                    :dialogTitle="debug.title"
                    :dialogFormVisible="debug.dialog"
                    :func="debug.func"
                    :prod="debug.prod"
                    v-on:visibleChange="onVisibleChangeDebug($event)">
            </pri-debug-function>
        </el-dialog>
        <!--版本界面-->
        <el-dialog width="80%" heigh="95%" :visible.sync="version.dialog" :close-on-click-modal="false"
                   class="text-font-family">
            <div slot="title">
                <span>{{version.title}}</span>
                <i class="el-icon-question icon-Add-style" @click="tohelperVer"></i>
            </div>
            <function-version
                    ref="versionFrom"
                    :modal="false"
                    :dialogTitle="version.title"
                    :dialogFormVisible="version.dialog"
                    :func="version.func"
                    :prod="version.prod"
                    v-on:visibleChange="onVisibleChange($event)">
            </function-version>
        </el-dialog>


    </el-card>
</template>

<script>
    // 页面组件
    import ShowFunction from '../../components/pri-function/ShowFunction'
    import AddFunction from '../../components/pri-function/AddFunction'
    import UpdateFunction from '../../components/pri-function/UpdateFunction'
    import FunctionVersion from '../../components/pri-function/FunctionVersion'
    import FunctionHistory from '../../components/pri-function/FunctionHistory'

    // entity,dto,常量
    import {FuncFilter, FuzzyFuncFilter} from "../../api";
    import {funcStatusEnums} from "../../components/pri-function/index";
    import {Prod} from "../../entity/prod";
    import {FuncBase} from "../../entity/func";

    // 后端接口
    import {
        checkFunc,
        deleteFunc, getCiteCount,
        getFuncById,
        getFuzzyFuncList, getFuzzyFuncListAndCiteCount, multiPublishFunc,
        publishFunc,
    } from "../../api/Func";
    import {isNotEmpty} from "../../utils";
    import {checkPublishSelectedFuncVersionList, tabType, tagType} from "../common";
    import {funcTypeEnums} from "../../components/pri-function";
    import {errorTip, successTip} from "../../utils/tools";
    import PriDebugFunction from "../../components/debug-comp/PriDebugFunction";

    export default {
        name: 'PriFuncList',
        components: {
            PriDebugFunction,
            ShowFunction,
            AddFunction,
            FunctionVersion,
            FunctionHistory,
            UpdateFunction,
        },
        data() {
            return {
                tagType: tagType,
                tabType: tabType,
                isNotEmpty: isNotEmpty,
                funcTypeEnums: funcTypeEnums,

                isCiteShow:false,

                loading: false,
                pageNum: 1,
                pageSize: 10,
                currentPage: 1,
                total: 0,
                funcFilter: new FuncFilter(),
                funcStatusEnums: funcStatusEnums,
                prod: new Prod(),
                funcList: [],
                checkList: [],
                searchCon: "",
                // 针对于弹窗的数据结构体
                add: {dialog: false, title: "函数添加", func: new FuncBase(), prod: this.prod},
                edit: {dialog: false, title: "函数编辑", func: new FuncBase(), prod: this.prod},
                his: {dialog: false, title: "函数历史", func: new FuncBase(), prod: this.prod},
                version: {dialog: false, title: "函数版本", func: new FuncBase(), prod: this.prod},
                citation: {dialog: false, title: "引用关系展示", func: new FuncBase(), prod: this.prod},
                debug: {dialog: false, title: "函数调试", func: new FuncBase(), prod: this.prod},
            }


        },
        created() {
            this.refreshPage();
        },
        methods: {

            // 重置按钮
            handleReset() {
                this.funcFilter = {
                    functionId: '',
                    functionName: '',
                    functionStatus: ''
                }
            },
            tohelperHome() {
                window.open(this.helper.helpUri.uri + this.helper.priHome.uri, "_blank")
            },
            tohelperAdd() {
                window.open(this.helper.helpUri.uri + this.helper.priAdd.uri, "_blank")
            },
            tohelperVer() {
                window.open(this.helper.helpUri.uri + this.helper.priVer.uri, "_blank")
            },
            tohelperHis() {
                window.open(this.helper.helpUri.uri + this.helper.priHis.uri, "_blank")
            },
            tohelperTest() {
                window.open(this.helper.helpUri.uri + this.helper.priTest.uri, "_blank")
            },
            // 函数删除按钮
            funcDelectClick(func) {
                let that = this;
                this.$confirm('确定要删除该函数吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(({value}) => {
                    deleteFunc({prodId: this.gConfig.prodId.value, funcId: func.funcId}).then(res => {
                        if (that.funcList.length - 1 === 0) {
                            if (that.pageNum > 1) {
                                that.pageNum = that.pageNum - 1
                            }
                        }
                        //删除完后刷新页面
                        that.refreshPage();
                        that.$message({message: "删除成功", type: "success"})
                    });
                }).catch(() => {
                });
            },

            // 页面切换
            handleCurrentChange(val) {
                this.pageNum = val;
                this.currentPage = val;
                this.refreshPage();
            },

            handleSizeChange(val) {
                this.pageNum = 1;
                this.pageSize = val;
                this.currentPage = 1;
                this.refreshPage();
            },

            // 刷新页面，查询
            refreshPage() {
                let that = this;
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
                let filterParams = {
                    status: searchStatus,
                    searchCon: searchCon
                }

                let params = {
                    prodId: this.gConfig.prodId.value,
                    actualProdId:this.gConfig.prodId.value,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    funcFilter: new FuzzyFuncFilter(filterParams)
                };
                that.loading = true;
                that.isCiteShow=false;
                getFuzzyFuncListAndCiteCount(params).then(res =>{
                    that.total = res.data.data['total'];
                    that.funcList=res.data.data['objectList'];
                    that.showCiteCount(that.funcList);
                    if (that.total > 0 && that.funcList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(res => {
                    that.loading = false;
                })
                that.checkList = [];
            },
            showCiteCount(funcList){
                let that=this;
                let prodId=this.gConfig.prodId.value;
                let funcs=funcList.map(item=>{
                    return {prodId:item.prodId,funcId:item.funcId};
                });
                getCiteCount({prodId:prodId,funcList:funcs}).then(res => {
                    let citeCount = res.data.data;
                    for (let i = 0; i < that.funcList.length; i++) {
                        that.funcList[i].decsCount = citeCount[0][i];
                        that.funcList[i].ruleCount = citeCount[1][i];
                    }
                    that.isCiteShow=true;
                })

            },

            /**
             * 显示新增界面
             */
            funcAddClick: function () {
                let that = this;
                // 清数据，跳弹窗
                that.add.func = new FuncBase();
                that.add.prod = new Prod();
                that.add.prod.prodId = this.gConfig.prodId.value;
                that.add.dialog = true;
                that.$nextTick(() => {
                    that.$refs['addFrom'].init();
                })
            },

            /**
             * 编辑信息
             * @param index: 选中的下标
             */
            funcEditClick: function (func) {
                // funcEditClick: function (index, func) {
                let that = this;
                let params = {prodId: this.gConfig.prodId.value, funcId: func.funcId};
                // 获得当前行的数据
                getFuncById(params).then((res) => {
                    that.edit.func = new FuncBase(res.data.data);
                    that.edit.dialog = true;
                    that.edit.prod = new Prod();
                    that.edit.prod.prodId = this.gConfig.prodId.value;
                })
            },

            /**
             * 查看历史信息
             * @param index: 选中的下标
             */
            funcHisClick(func) {
                let that = this;
                that.his.func = new FuncBase(func);
                this.$router.push({
                    path: "/priFuncHome/priFuncHistory",
                    query: {func: that.his.func, prod: this.prod}
                });
            },

            /**
             * 调试函数
             * @param index: 选中的下标
             */
            funcDebugClick: function (func) {
                let that = this;
                that.debug.func = new FuncBase(func);
                that.debug.dialog = true;
                that.$nextTick(() => {
                    debugger
                    that.$refs['debugFrom'].init();
                });
            },

            /**
             * 查看版本信息
             * @param index: 选中的下标
             */
            // funcVersionClick( func) {
            //     let that = this;
            //     that.version.func = new FuncBase(func);
            //     that.version.dialog = true;
            //     that.$nextTick(()=>{
            //         that.$refs['versionFrom'].init();
            //     });
            // },
            funcVersionClick(func) {
                let that = this;
                that.version.func = new FuncBase(func);
                this.$router.push({
                    path: "/priFuncHome/priFuncVersion",
                    query: {func: that.version.func, prod: this.prod}
                });
            },
            funcCitationClick(func){
                let that=this;
                that.citation.func=new FuncBase(func);
                this.$router.push({
                    path:"/priFuncHome/priFuncCitation",
                    query: {func: that.citation.func, prod: this.prod}
                });
            },

            /**
             * 函数验证（这期点击验证按钮直接从草稿状态跳转到已验证状态）
             * @param index: 选中的下标
             */
            funcCheckClick(func) {
                let that = this;
                if (func.status === '0') {
                    // 调用验证接口，后端验证成功后就更改状态
                    checkFunc({prodId: this.gConfig.prodId.value, funcId: func.funcId}).then(res => {
                        if (res.data.data['success']) {
                            that.$message({message: "验证成功", type: "success"});
                            func.status = '1';
                        } else {
                            that.$alert(res.data.data['result'], '验证结果', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        }
                        that.refreshPage();
                    })
                } else {
                    that.$alert("当前函数是草稿状态才能进行验证操作！")
                }
            },

            /**
             * 函数发布（这期点击验证按钮直接从已验证状态跳转到已发布状态）
             * @param index: 选中的下标
             */
            funcPublishClick(func) {
                let that = this;
                this.$confirm('确定要发布版本吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {

                    if (func.status === '1') {
                        // 调用发布接口
                        publishFunc({prodId: this.gConfig.prodId.value, funcId: func.funcId}).then(res => {
                            if (typeof (res.data.data) === "boolean") {
                                if (res.data.data) {
                                    that.$message({message: "成功", type: "success"});
                                    func.status = '2';
                                } else {
                                    that.$message({message: "失败", type: "error"});
                                }
                            } else {
                                that.$message({message: res.data.data, type: "success"});
                            }
                            that.refreshPage();
                        });
                    } else {
                        that.$alert("当前函数是已验证状态才能进行发布操作！");
                    }
                }).catch(() => {
                });
            },


            /**
             * 回调方法，子组件向父组件发送更改数据请求，父组件更改数据
             * @param msg: 子组件向父组件发送的信息
             */
            onVisibleChange: function (msg) {
                this.add.dialog = msg
                this.edit.dialog = msg
                this.his.dialog = msg
                this.version.dialog = msg
                // this.debug.dialog = msg
                this.refreshPage()
            },

            /**
             * 回调方法，子组件向父组件发送更改数据请求，父组件更改数据
             * @param msg: 子组件向父组件发送的信息
             */
            onVisibleChangeDebug: function (msg) {
                this.debug.dialog = msg
            },
            /**
             * 批量发布
             */
            multiPublicClick() {
                let selectData = this.checkList
                let that = this;
                if (checkPublishSelectedFuncVersionList(selectData, that)) {

                    multiPublishFunc({prodId: this.gConfig.prodId.value, funcBaseList: selectData}).then((res) => {
                        if (res.data.data == null || !(res.data.data instanceof Array) || res.data.data.length === 0) {
                            successTip('发布函数成功');
                            that.refreshPage();
                        } else {
                            errorTip('发布函数失败，失败函数编号如下：' + res.data.data.join(','));
                        }
                        // successTip(res.data.data);
                        that.refreshPage();
                    }).catch((res) => {
                        // errorTip('发布组件失败，' + res.message);
                    }).finally(() => {
                        setTimeout(() => {
                        }, 500);
                    })
                }

            }

        }

    }


</script>

<style scoped>

    .f1 {
        float: left;
    }

    .search-bar {
        overflow: hidden;
    }

    .tools-bar {
        margin-bottom: 20px;
    }

    #priFuncCard {
        height: 100%;
        padding: 0 10px 0 10px;
        background-image: url('~@/assets/bg.png');
        background-size: 100% 100%;
    }


</style>
