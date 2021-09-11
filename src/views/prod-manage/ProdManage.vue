<template>
    <!--    产品管理表单，所有产品的配置信息-->
    <el-card class="box-card" :body-style="{padding: '0'}" id="prodManage">
        <!--操作工具栏-->
        <div class="search-bar ">
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
                        <span class="search-icon-container" @click="refreshPage" v-cmb-auth-remove="'FrontProdSearchCode'">
                                <svg-icon icon-class="search"/>
                            </span>
                    </div>

                    <div class="tools-bar" style="margin-bottom: 8px;width: 300px">
                        <div class="clearfix">
                            <a class="helpHome" @click="tohelperHome">帮助文档</a>
                        </div>
                        <div class="tools-button">
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addClick" v-cmb-auth-remove="'FrontProdAddCode'">
                                新增
                            </el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <div v-loading="loading" element-loading-background="#fff0">
            <div v-if="prodmanageList.length!=0"  v-show="prodmanageList.length!=0" v-loading="loading">
                <div style="display: flex;flex-wrap: wrap; justify-content: space-between;min-height: 719px" >
                    <div  class="card-block" v-for="(o,index) in prodmanageList"  v-bind:key=index>
                        <el-card :body-style="{ padding: '0px' }">
                            <div slot="header" class="clearfix">
                                <div class="clearfix" style="width: 68%;float: left">
                                    <div class="header-title">
                                        <div class="clearfix" style="width: 100%">
                                            <span style="width: 20%"> <svg-icon icon-class="ID" class="gray-bule-icon"></svg-icon></span>
                                            <el-tooltip class="item" effect="dark" :content="o.ystId" placement="bottom-end" popper-class="card-header-tooltips">
                                                <span >{{o.ystId}}</span>
                                            </el-tooltip>
                                        </div>
                                        <div class="clearfix" style="width: 100%"><span style="width: 20%"> <svg-icon icon-class="name"  class="gray-bule-icon"></svg-icon></span>
                                            <el-tooltip class="item" effect="dark" :content="o.ystName" placement="bottom-end" popper-class="card-header-tooltips">
                                                <span>{{o.ystName}}</span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="o.userRole==='M'" class="clearfix" style="width: 32%;float: left">
                                    <svg-icon icon-class="manager"  style="width: 100%"/>
                                    <div class="time-block" style="margin: 8px 0 0 0;width: 100%" >
                                        {{(o.updateTime==""||o.updateTime==null)?o.createTime.substr(0,10):o.updateTime.substr(0,10)}}
                                    </div>
                                </div>
                                <div v-else class="clearfix">
                                    <div class="time-block">
                                        {{(o.updateTime==""||o.updateTime==null)?o.createTime.substr(0,10):o.updateTime.substr(0,10)}}
                                    </div>
                                </div>


                            </div>


                            <div class="bottom ">

                                <el-button class="icon-button" type="primary" size="mini" icon="el-icon-edit" @click="editClick(o)" v-cmb-auth-remove="'FrontProdEditCode'" title="编辑" style="margin: 0px 12.8%;"></el-button>
                                <el-button class="icon-button" type="danger" size="mini" icon="el-icon-delete" @click="deleteClick(o)" v-cmb-auth-remove="'FrontProdDelectCode'" title="删除" style="margin: 0px 12.8%;"></el-button>

                            </div>
                        </el-card>
                    </div>


                    <div  class="empty-card-block"> </div>
                    <div  class="empty-card-block"> </div>
                    <div  class="empty-card-block"> </div>
                    <div  class="empty-card-block"> </div>
                    <!--            </div>-->
                </div>
            </div>

            <div v-else class="no-data">
                <svg-icon icon-class="manage_prod"/>
                <br/>
                <br/>
                <span>未查询到产品管理数据</span>
            </div>
        </div>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[20, 50, 75, 100]"
                :page-size="pageSize"
                :current-page=currentPage
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>



        <!--新增界面-->
        <el-dialog :visible.sync="add.dialog" :close-on-click-modal="false" class="text-font-family new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{add.title}}
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i></div>
                </div>
            </div>
            <prod-manage-add
                    ref="addForm"
                    :dialogTitle="add.title"
                    :dialogFormVisible="add.dialog"
                    :prodmanageBase="add.prodmanageBase"
                    v-on:visibleChange="onVisibleChangeAdd($event)">
            </prod-manage-add>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog :visible.sync="edit.dialog" :close-on-click-modal="false" class="text-font-family new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{edit.title}}
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i></div>
                </div>
            </div>
            <prod-manage-edit
                    ref="editForm"
                    :dialogTitle="edit.title"
                    :dialogFormVisible="edit.dialog"
                    :prodmanageBase="edit.prodmanageBase"
                    v-on:visibleChange="onVisibleChangeEdit($event)">
            </prod-manage-edit>
        </el-dialog>

    </el-card>
</template>

<script>


    import ProdManageAdd from "./ProdManageAdd";
    import ProdManageEdit from "./ProdManageEdit";
    import {statusEnums, tabType, tagType} from "../common";
    import {isNotEmpty} from "../../utils";
    import {FuzzyProdmanageFilter, ProdmanageFilter,prodmanageUserRoleEnums} from "./index";
    import {ProdmanageBase} from "../../entity/prod-manage-base";
    import {
        deleteProdmanage,
        getFuzzyProdmanageList,
        getProdmanageById,
        getProdmanageList
    } from "../../api/ProdmanageBase";

    export default {
        name: "ProdManage",
        components: {
            ProdManageAdd,
            ProdManageEdit,
        },

        data() {
            return {
                // --------自定义常量或者方法--------
                statusEnums: statusEnums,
                tagType: tagType,
                tabType: tabType,
                isNotEmpty: isNotEmpty,
                prodmanageUserRoleEnums: prodmanageUserRoleEnums,

                // --------el 组件属性--------
                loading: false,
                pageNum: 1,
                pageSize: 20,
                currentPage:1,
                total: 0,
                searchCon: "",

                // --------数据--------
                filter: new ProdmanageFilter(),
                prodmanageList: [],

                // --------针对于弹窗的数据结构体--------
                add: {dialog: false, title: "产品管理信息添加", prodmanageBase: new ProdmanageBase()},
                edit: {dialog: false, title: "产品管理信息编辑", prodmanageBase: new ProdmanageBase()}

            }
        },

        created() {
            this.refreshPage();
        },

        methods: {
            // 分页查询页面
            refreshPage() {
                let that = this;
                let filterParams = {
                    searchCon: that.searchCon
                }
                let params = {
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    filter: new FuzzyProdmanageFilter(filterParams)
                }
                that.loading = true;
                getFuzzyProdmanageList(params).then(res => {
                    // getProdmanageList(params).then(res => {
                    that.prodmanageList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.prodmanageList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(res => {
                    that.loading = false;
                })
            },
            tohelperHome(){
                window.open(this.helper.helpUri.uri+'/modules/manage/2.html',"_blank")
            },
            tohelperAdd(){
                window.open(this.helper.helpUri.uri+'/modules/manage/2.html#新增',"_blank")
            },


            // ---------------操作工具栏中的按钮-----------------
            addClick() {
                let that = this;
                // 清数据，跳弹窗
                that.add.prodmanageBase = new ProdmanageBase();
                that.add.dialog = true;
                that.$nextTick(()=>{
                    that.$refs['addForm'].init();
                })
            },


            // ---------------表单中的按钮-----------------
            editClick(data) {
                let that = this;
                let params = {id: data.id};
                getProdmanageById(params).then((res)=>{
                    debugger
                    that.edit.prodmanageBase = new ProdmanageBase(res.data.data);
                    that.edit.dialog = true;
                    that.$nextTick(()=>{
                        that.$refs['editForm'].init();
                    })
                })
            },



            deleteClick(data) {
                let that = this;
                this.$confirm('确定要删除该产品管理信息吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(({ value })=>{
                    let params = {id: data.id};
                    deleteProdmanage(params).then(res=>{
                        if (that.prodmanageList.length - 1 === 0) {
                            if (that.pageNum > 1) {
                                that.pageNum = that.pageNum - 1
                            }
                        }
                        //删除完后刷新页面
                        that.refreshPage();
                        that.$message({message:"删除成功", type:"success"})
                    });
                }).catch(()=>{});
            },


            // ---------------左下角页面导航组件相关---------------
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


            // ---------------弹窗的监听触发方法---------------
            /**
             * 回调方法，子组件向父组件发送更改数据请求，父组件更改数据
             * @param msg: 子组件向父组件发送的信息
             */
            onVisibleChangeAdd: function (msg) {
                this.add.dialog = msg
                this.refreshPage()
            },
            onVisibleChangeEdit: function (msg) {
                this.edit.dialog = msg
                this.refreshPage()
            },
        }
    }
</script>

<style scoped>
    #prodManage{
        height: 100%;
        padding: 0 10px 0 10px;
        background-image: url('~@/assets/bg.png');
        background-size: 100% 100%;
    }

</style>
