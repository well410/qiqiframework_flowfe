<template>
    <div id="priFuncVer">
        <el-card class="his-ver-title">
            <div style="display: flex;justify-content: space-between">
                <el-page-header @back="$router.push('/priFuncHome')">
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

            <!--函数版本表单-->
            <div>
                <el-table
                        ref="multipleTable"
                        :data="funcVersionList"
                        v-loading="loading"
                        tooltip-effect="dark"
                        stripe
                        highlight-current-row
                        style="width: 100%;min-height:743px "
                        size="mini">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <show-function :p-func="scope.row" :p-type="tabType.funcVersion"></show-function>
                        </template>
                    </el-table-column>
                    <el-table-column label="函数ID" align="center" show-overflow-tooltip prop="funcId"></el-table-column>
                    <el-table-column label="函数名字" align="center" show-overflow-tooltip prop="funcName"></el-table-column>
                    <el-table-column label="函数版本" align="center" show-overflow-tooltip prop="funcVersion"></el-table-column>
                    <el-table-column label="版本状态" align="center" show-overflow-tooltip prop="status">
                        <template slot-scope="scope">
                            <el-tag v-if="isNotEmpty(funcStatusEnums[scope.row.status])" :type="tagType[scope.row.status]">
                                {{funcStatusEnums[scope.row.status].name}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建人" align="center" show-overflow-tooltip prop="createUser"></el-table-column>
                    <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
                    <el-table-column label="修改人" align="center" show-overflow-tooltip prop="updateUser"></el-table-column>
                    <el-table-column label="修改时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
                   <el-table-column label="操作" align="center" ><!-- fixed="right" width="200px"-->
                        <template slot-scope="props">
                            <el-button class="icon-button" size="mini" icon="el-icon-video-play" @click="testFuncVersionClick(props['row'])" title="测试"></el-button>
                            <el-button class="icon-button"  v-if="props.row.status === 'N'" size="mini" @click="onlineFuncVersion(props['row'])" title="启用"> <svg-icon icon-class="start" style=" width: 1.9em;height: 1.9em; color: #67c23a;"/> </el-button>
                            <el-button class="icon-button"  v-if="props.row.status === 'Y'" size="mini" @click="offlineFuncVersion(props['row'])" title="停用"><svg-icon icon-class="end" style=" width: 1.8em;height: 1.8em; color: #e6a23c;"/></el-button>
                            <el-button type="danger"  class="icon-button" icon="el-icon-delete"
                                       size="mini" @click="deleteFuncClick(props['row'])"
                                       style=" width: 1.9em;height: 1.9em; color: #f56c6c;" title="删除"></el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination-bar" style="margin-top: 15px">
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
                </div>
            </div>


            <el-dialog width="65%" heigh="95%" :title="debug.title" :modal="false" :visible.sync="debug.dialog" :close-on-click-modal="false" class="text-font-family">
                <pri-debug-function
                        ref="debugFrom"
                        :dialogTitle="debug.title"
                        :dialogFormVisible="debug.dialog"
                        :func="debug.func"
                        :prod="debug.prod"
                        :p-type="'versionDebug'"
                        v-on:visibleChange="onVisibleChange($event)">
                </pri-debug-function>
            </el-dialog>


        </el-card>
    </div>



</template>


<script>
    import {FuncBase} from "../../entity/func";
    import {funcStatusEnums} from "./index";
    import ShowFunction from "./ShowFunction";
    import {
        deleteFuncVersion,
        getFuncVersionList,
        getFuncVersionRoll,
        offlineFuncVersion,
        onlineFuncVersion
    } from "../../api/Func";
    import {FuncVersionFilter} from "../../api";
    import {tabType, tagType} from "../../views/common";
    import {isNotEmpty} from "../../utils";
    import PriDebugFunction from "../debug-comp/PriDebugFunction";

    export default {

        name: 'PriFuncVersion',
        components: {
            PriDebugFunction,
            ShowFunction,
        },

        // props: {  //父组件传入的数据
        //     'dialogTitle': String,
        //     'dialogFormVisible': Boolean,
        //     'func': FuncBase,
        //     'prod': Prod
        // },

        data() {

            return {
                tagType: tagType,
                tabType: tabType,
                isNotEmpty: isNotEmpty,
                debug:{dialog: false, title: "函数版本调试", func: new FuncBase(), prod: this.prod},

                pageNum: 1,
                pageSize: 20,
                total: 0,
                filter: new FuncVersionFilter(),
                funcVersionList: [],
                loading: false,
                funcStatusEnums: funcStatusEnums,
                prod:"",
                func: new FuncBase(),
                title:"私有函数版本",
            }
        },
        mounted() {
            this.initData();
            this.init();
        },

        methods: {
            init() {
                // 查询初始化数据
                try {
                    // this.queryFuncVersion(this.func.prodId, this.func.funcId);
                    this.filter = new FuncVersionFilter();
                    this.refreshPage();
                } catch (e) {
                    console.error('函数版本数据查询失败', e)
                } finally
                {
                    this.loading = false;
                }
            },
            initData () {
                this.prod = this.$route.query['prod'] === undefined ? '' : this.$route.query['prod'];
                this.func = this.$route.query['func'] === undefined ? '' : this.$route.query['func'];
            },

            // 版本页面的查询
            refreshPage() {
                let that = this;
                let params = {prodId: this.gConfig.prodId.value, funcId: that.func.funcId, pageNum: that.pageNum, pageSize: that.pageSize, funcVersionFilter: that.filter};
                that.loading = true;
                getFuncVersionList(params).then(res => {
                    that.funcVersionList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.funcVersionList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage();
                    }
                }).finally(res => {
                    that.loading = false;
                })
            },


            // 查询当前函数下的所有版本信息
            queryFuncVersion(prodId, funcId) {
                let that = this;
                if (funcId == null || funcId === '' || prodId == null || prodId === '') {
                    return;
                }
                that.loading = true;
                getFuncVersionRoll({prodId: this.gConfig.prodId.value, funcId: that.func.funcId}).then(res => {
                    if (res.data.data != null && res.data.data.length > 0) {
                        that.funcVersionList = res.data.data;
                        that.loading = false;
                    }
                })
            },


            // 启动版本
            onlineFuncVersion(func) {
                let that = this;
                let prodId = func.prodId;
                let funcId = func.funcId;
                let funcVersion = func.funcVersion;
                onlineFuncVersion({prodId: prodId, funcId: funcId, funcVersion: funcVersion}).then(res => {
                    if (typeof (res.data.data) === "boolean") {     // 返回时兼容加审批和不加审批的情况
                        if (res.data.data) {
                            that.$message({type:'success', message: "上线成功"});
                        } else {
                            this.$message({type:'error', message: "上线失败"});
                        }
                    } else {
                        that.$message({message: res.data.data, type: "success"});   // 审批提示
                    }
                    that.refreshPage();
                });
            },

            // 停用版本
            offlineFuncVersion(func) {
                let that = this;
                let prodId = func.prodId;
                let funcId = func.funcId;
                let funcVersion = func.funcVersion;
                offlineFuncVersion({prodId: prodId, funcId: funcId, funcVersion: funcVersion}).then(res => {
                    if (typeof (res.data.data) === "boolean") {     // 返回时兼容加审批和不加审批的情况
                        if (res.data.data) {
                            that.$message({type:'success', message: "下线成功"});
                        } else {
                            this.$message({type: 'error', message: '下线失败'})
                        }
                    } else {
                        that.$message({message: res.data.data, type: "success"});   // 审批提示
                    }
                    that.refreshPage();

                    // if (res.data.data) {
                    //     that.$message({type:'success', message: "下线成功"});
                    //     that.refreshPage();
                    // } else {
                    //     this.$message({type: 'error', message: '下线失败'})
                    // }
                });
            },

            // 版本测试按钮
            testFuncVersionClick(func) {
                let that = this;
                that.debug.func = new FuncBase(func);
                that.debug.dialog = true;
                that.$nextTick(()=>{
                    that.$refs['debugFrom'].init();
                });
            },

            /**
             * 回调方法，子组件向父组件发送更改数据请求，父组件更改数据
             * @param msg: 子组件向父组件发送的信息
             */
            onVisibleChange: function (msg) {
                this.debug.dialog = msg
                // this.refreshPage()
            },

            deleteFuncClick(row){
                let that = this;
                this.$confirm('确定要删除函数嘛？（不可恢复）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    let param = {prodId: row.prodId, funcId: row.funcId, versionId: row.funcVersion};
                    deleteFuncVersion(param).then(res=>{
                        that.$message({type: 'success', message: "删除成功"});
                        that.refreshPage();
                    })
                }).catch(() => {});
            },



            // 改变页面size
            handleSizeChange(val) {
                let that = this;
                that.pageSize = val
                that.refreshPage()
            },

            // 跳页
            handleCurrentChange(val) {
                let that = this;
                that.pageNum = val
                that.refreshPage()
            },
            tohelperVer(){
                window.open(this.helper.helpUri.uri+this.helper.priVer.uri,"_blank")
            },


        }



    }


</script>


<style scoped>

    .f1{
        float: left;
    }

    .search-bar{
        overflow: hidden;
    }

    .tools-bar{
        margin-bottom: 20px;
    }



</style>
