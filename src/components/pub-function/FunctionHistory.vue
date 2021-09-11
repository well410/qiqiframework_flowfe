<template>
    <!--函数历史-->
    <div id="funcHis">
        <el-card class="his-ver-title">
            <div style="display: flex;justify-content: space-between">
                <el-page-header @back="$router.push('/pubFuncHome')">
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
            <div>
                <el-table
                        ref="multipleTable"
                        :data="funcHisList"
                        v-loading="loading"
                        tooltip-effect="dark"
                        stripe
                        style="min-height: 758px"
                        size="mini">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <show-function :p-func="props.row" :p-type="tabType.funcHis"></show-function>
                        </template>
                    </el-table-column>
                    <!--// 显示栏位-->
                    <el-table-column prop="funcId" align="center" show-overflow-tooltip label="函数ID"></el-table-column>
                    <el-table-column prop="funcName" align="center" show-overflow-tooltip label="函数名"></el-table-column>
                    <el-table-column prop="funcVersion" align="center" show-overflow-tooltip label="函数版本"></el-table-column>
                    <el-table-column prop="createUser" align="center" show-overflow-tooltip label="创建人"></el-table-column>
                    <el-table-column prop="createTime" align="center" show-overflow-tooltip label="创建时间"></el-table-column>
                    <el-table-column prop="status" align="center" show-overflow-tooltip label="函数状态">
                        <template slot-scope="props">
                            <el-tag class="card-status" v-if="isNotEmpty(funcStatusEnums[props.row.status])" :type="tagType[props.row.status]" style="width: 56px">
                                {{funcStatusEnums[props.row.status].name}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="funcType" align="center" show-overflow-tooltip label="函数类型">
                        <template slot-scope="props">
                            {{funcTypeEnums[props.row.funcType]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="changeType" align="center" label="操作类型" >
                        <template slot-scope="props">
                            <el-tag class="card-status" v-if="!isEmpty(changeTypeEnums[props.row.changeType])" :type="tagType[props.row.changeType]" style="width: 56px">
                                {{isEmpty(changeTypeEnums[props.row.changeType]) ? props.row.changeType : changeTypeEnums[props.row.changeType].name}}
                            </el-tag>
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
            </div>
        </el-card>

    </div>
</template>


<script>

    import {funcStatusEnums, funcTypeEnums} from "./index";
    import {changeTypeEnums, tabType, tagType} from "../../views/common";
    import {getFuncEditHisRoll} from "../../api/Func";
    import {FuncBase} from "../../entity/func";
    import ShowFunction from "./ShowFunction";
    import {isEmpty, isNotEmpty} from "../../utils";
    import {Prod} from "../../entity/prod";

    export default {
        name: 'PubFuncHistory',
        components: {ShowFunction},
        data() {
            return {
                tabType: tabType,
                funcHisList:[],
                loading: false,
                funcStatusEnums: funcStatusEnums,
                funcTypeEnums: funcTypeEnums,
                changeTypeEnums: changeTypeEnums,
                isEmpty: isEmpty,
                prod:"",
                func: new FuncBase(),
                title:"公有函数历史",
                pageNum:1,
                total: 0,
                pageSize: 20,
                isNotEmpty: isNotEmpty,
                tagType: tagType,
            }

        },
        mounted() {
            this.initData();
            this.init();
        },

        // props: {  //父组件传入的数据
        //     'dialogTitle': String,
        //     'dialogFormVisible': Boolean,
        //     'func': FuncBase,
        //     'prod': Prod
        // },

        methods: {
            init() {
                this.queryHistory();
            },
            initData () {
                this.prod = this.$route.query['prod'] === undefined ? '' : this.$route.query['prod'];
                this.func = this.$route.query['func'] === undefined ? '' : this.$route.query['func'];
            },

            //初始化的时候根据产品id和函数id查询所有历史记录
            queryHistory() {
                let that = this;
                let params = {
                    prodId:that.gConfig.prodId.value,
                    funcId:that.func.funcId,
                    pageNum:that.pageNum,
                    pageSize:that.pageSize
                }
                if (params.funcId == null || params.funcId === '' || params.prodId == null || params.prodId === '') {
                    return;
                }
                this.loading = true;
                getFuncEditHisRoll(params).then(res => {
                    that.funcHisList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    if (that.total > 0 && that.funcHisList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(()=>{
                    this.loading = false;
                });
            },

            /**
             * 子组件向父组件发送信息，用来取消dialog页面
             */
            cancelVisible: function () {
                this.$emit('visibleChange', false)
            },
            currentChangeHandle(val) {
                this.pageNum = val;
                this.queryHistory();
            },
            tohelperHis(){
                window.open(this.helper.helpUri.uri+this.helper.priHis.uri,"_blank")
            },
            // 改变页面size
            handleSizeChange(val) {
                let that = this;
                that.pageSize = val
                that.queryHistory()
            },

            // 跳页
            handleCurrentChange(val) {
                let that = this;
                that.pageNum = val
                that.queryHistory()
            },
        },

    }


</script>


<style scoped>





</style>
