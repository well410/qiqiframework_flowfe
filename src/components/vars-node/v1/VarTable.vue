<template>
    <div id="VarsTable">
        <div class="tools">
            <el-form @submit.native.prevent :inline="true" size="mini">

                <el-form-item label="变量Id">
                    <el-input placeholder="变量Id"
                              maxlength="64" show-word-limit
                              v-model="varBaseFilter.varsId" @keydown.enter.native="refreshPage"></el-input>
                </el-form-item>

                <el-form-item label="数据源Id">
                    <el-select v-model="varBaseFilter.datasourceId" clearable filterable>
                        <el-option v-for="item in dsList" :key="item.datasourceId" :value="item.datasourceId"
                                   :label="`${item.datasourceId}${item.datasourceName}`">
                            <span :title="item.datasourceId" class="option-left">{{item.datasourceId}}</span>
                            <span :title="item.datasourceName" class="option-right">{{item.datasourceName}}</span>
                        </el-option>

                    </el-select>
                </el-form-item>


                <el-form-item label="变量类型">
                    <el-select v-model="varBaseFilter.typeList" multiple clearable>
                        <!--<el-option :key="varTypeEnums.ev.code" :value="varTypeEnums.ev.code" :label="`[${varTypeEnums.ev.code}]${varTypeEnums.ev.name}`"></el-option>-->
                        <el-option :key="varTypeEnums.rv.code" :value="varTypeEnums.rv.code" :label="`[${varTypeEnums.rv.code}]${varTypeEnums.rv.name}`"></el-option>
                        <el-option :key="varTypeEnums.bv.code" :value="varTypeEnums.bv.code" :label="`[${varTypeEnums.bv.code}]${varTypeEnums.bv.name}`"></el-option>
                        <!--<el-option :key="varTypeEnums.wv.code" :value="varTypeEnums.wv.code" :label="`[${varTypeEnums.wv.code}]${varTypeEnums.wv.name}`"></el-option>-->
                        <!--<el-option :key="varTypeEnums.mv.code" :value="varTypeEnums.mv.code" :label="`[${varTypeEnums.mv.code}]${varTypeEnums.mv.name}`"></el-option>-->
                        <!--<el-option :key="varTypeEnums.gv.code" :value="varTypeEnums.gv.code" :label="`[${varTypeEnums.gv.code}]${varTypeEnums.gv.name}`"></el-option>-->
                        <el-option :key="varTypeEnums.dv.code" :value="varTypeEnums.dv.code" :label="`[${varTypeEnums.dv.code}]${varTypeEnums.dv.name}`"></el-option>
                        <!--<el-option :key="varTypeEnums.ov.code" :value="varTypeEnums.ov.code" :label="`[${varTypeEnums.ov.code}]${varTypeEnums.ov.name}`"></el-option>-->
                    </el-select>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="refreshPage"> 查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
                ref="multipleTable"
                :data="varList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                border
                size="mini">
            <!--<el-table-column type="expand">-->
                <!--<template slot-scope="props">-->
                    <!--<var-show :p-var="props.row"></var-show>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="varsId" label="变量id"></el-table-column>
            <el-table-column prop="varsOriId" label="变量源id"></el-table-column>
            <el-table-column prop="datasourceId" label="数据源id"></el-table-column>
            <el-table-column prop="type" label="变量类型"></el-table-column>
            <el-table-column prop="dataType" label="变量数据类型"></el-table-column>
            <el-table-column prop="desc" label="变量描述"></el-table-column>
            <el-table-column prop="status" label="变量状态">
                <template slot-scope="props">
                    <el-tag v-if="isNotEmpty(varStatusEnums[props.row.status])"
                            :type="varStatusEnums[props.row.status].tagType">{{varStatusEnums[props.row.status].name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="props">
                    <el-button @click="varSel(props.row)" size="mini" :disabled="computeSelDisable(props.row)"
                               type="success">选择
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-bar">
            <el-pagination background layout="total,prev,pager,next" class="pagination"
                           @current-change="handleCurrentChange"
                           :page-size="pageSize"
                           :total="total"></el-pagination>

        </div>
    </div>
</template>

<script>
    import {VarBaseFilter} from ".";
    import VarShow from "./VarShow";
    import {statusEnums, tagType, varStatusEnums, varTypeEnums} from "../../../entity/enumns";
    import {getDSList, getVarList} from "../../../api/Var";
    import {isEmpty} from "../../../utils";

    export default {
        name: "VarTable",
        components: {VarShow},
        props: {pSelVarList: {default: () => [], Array}},
        data() {
            return {
                varBaseFilter: new VarBaseFilter({datasourceId: "", status: "1", typeList:[]}),
                varList: [],
                dsList: [],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                tagType: tagType,
                statusEnums: statusEnums,
                varTypeEnums: varTypeEnums,
                varStatusEnums:varStatusEnums,
                loading: false,
            }
        },
        computed: {
            computeSelDisable() {
                return (row) => {
                    return this.pSelVarList.filter(item => item.varsId === row.varsId).length > 0
                }
            }
        },
        methods: {
            init() {
                this.refreshPage();
                this.initDSList();
            },

            initDSList() {
                getDSList({prodId: this.gConfig.prodId.value}).then(res => {
                    this.dsList = res.data.data;
                })
            },

            varSelAfter(row) {
                this.$emit("varSelClick", row)
            },

            refreshPage() {
                let that = this;
                that.loading = true;
                let varBaseFilter = JSON.parse(JSON.stringify(that.varBaseFilter));
                if (isEmpty(varBaseFilter.typeList)){
                    varBaseFilter.typeList = [varTypeEnums.rv.code, varTypeEnums.dv.code, varTypeEnums.bv.code];
                }
                getVarList({
                    prodId: this.gConfig.prodId.value,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    varBaseFilter: varBaseFilter
                }).then(res => {
                    that.varList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.varList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage();
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },

            handleCurrentChange(val) {
                this.pageNum = val;
                this.refreshPage()
            },

        }
    }
</script>

<style scoped>
    .pagination {
        margin-top: 15px
    }

    .tools {
        margin-top: 15px;
    }
</style>
