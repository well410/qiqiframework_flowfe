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

                <el-form-item>
                    <el-button type="primary" @click="refreshPage"> 查询</el-button>
                </el-form-item>
            </el-form>
            <!--            <el-form @submit.native.prevent>-->
            <!--                <el-form-item style="margin: 0">-->
            <!--                    <div class="node-search-block">-->
            <!--                        <el-row>-->
            <!--                            <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="22">-->

            <!--                                <el-input class='node-search-input' prefix-icon="el-icon-search" placeholder="请输入查询关键字" v-model="searchCon"-->
            <!--                                          maxlength="64" show-word-limit-->
            <!--                                          @keydown.enter.native="refreshPage">-->
            <!--                                </el-input>-->
            <!--                            </el-col>-->
            <!--                            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="2">-->
            <!--                                <el-button size="mini" @click="cancel">取消</el-button>-->
            <!--                            </el-col>-->
            <!--                        </el-row>-->
            <!--                    </div>-->
            <!--                </el-form-item>-->
            <!--            </el-form>-->
        </div>

        <el-table
                ref="multipleTable"
                :data="varList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                border
                size="mini">
            <el-table-column prop="varsId" align="center"  label="变量id"></el-table-column>
            <el-table-column prop="datasourceId" align="center"  label="数据源id"></el-table-column>
            <el-table-column prop="dataType" align="center"  label="变量数据类型"></el-table-column>
            <el-table-column prop="desc" align="center"  label="变量描述"></el-table-column>
            <el-table-column prop="status" align="center"  label="变量状态">
                <template slot-scope="props">
                    <el-tag v-if="isNotEmpty(varStatusEnums[props.row.status])"
                            :type="varStatusEnums[props.row.status].tagType">{{varStatusEnums[props.row.status].name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="操作">
                <template slot-scope="props">
                    <el-button @click="varSelAfter(props.row)" size="mini" :disabled="computeSelDisable(props.row)"
                               class="icon-button"
                               title="选择">
                        <svg-icon icon-class="choose_ver" style="width: 1.6em;height: 1.6em;color: #409eff"></svg-icon>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-bar clearfix">
            <el-pagination background layout="total,prev,pager,next" class="pagination"
                           @current-change="handleCurrentChange"
                           :page-size="pageSize"
                           :total="total"></el-pagination>

        </div>
    </div>
</template>

<script>
    import VarShow from "../v1/VarShow";
    import {statusEnums, tagType, varStatusEnums, varTypeEnums} from "../../../entity/enumns";
    import {getDSList, getVarList} from "../../../api/Var";
    import {isNotEmpty} from "../../../utils";
    import {VarConfig} from "./index";
    import {pathParse} from "../../../api/Utils";
    import {RedisVal} from "../../../entity/vars";
    import {VarBaseFilter} from "../index";

    export default {
        name: "VarTableV2",
        components: {VarShow},
        props: {pVarConfigList: {default: () => [], Array}},
        data() {
            return {
                varBaseFilter: new VarBaseFilter({queryDimensionFlg: '1', datasourceId: '', status: 1}),
                varList: [],
                dsList: [],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                tagType: tagType,
                statusEnums: statusEnums,
                varTypeEnums: varTypeEnums,
                varStatusEnums: varStatusEnums,
                loading: false,
                searchCon: "",
                isNotEmpty: isNotEmpty
            }
        },
        computed: {
            computeSelDisable() {
                return (row) => {
                    let uniqueIdList = this.pVarConfigList.map(item => item.getUniqueId());
                    let rowUniqueId = row.datasourceId + row.varsId;
                    return uniqueIdList.includes(rowUniqueId)
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

            // 生成 VarConfig
            varSelAfter(row) {
                function getQdMapList(varBase) {
                    let qdK = varBase.queryDimensionKey;
                    let keyArray = qdK.match(/(?<=\{)[^}]*(?=\})/g);
                    if (isNotEmpty(keyArray)) {
                        let result = keyArray.map(item => {
                            let qdMap = {};
                            qdMap.qKey = item;
                            qdMap.mapField = "";
                            return qdMap;
                        });
                        return Array.from(new Set(result))
                    }
                    return [];
                }

                let ds = this.dsList.filter(item => item.datasourceId === row.datasourceId)[0];
                let varBase = row;
                let qdMapList = getQdMapList(varBase);
                let rdvList = [];

                // 如果时对象类型，解析对象返回的结果
                if (row.dataType === 'object') {
                    pathParse({analysisJson: row.queryDimensionVal}).then(res => {
                        rdvList = res.data.data.map(item => {
                            return new RedisVal({
                                varName: item['path'],
                                varDesc: item['description'].split("-")[0],
                                varType: item['description'].split("-")[1],
                                varsId: varBase.varsId
                            })
                        });
                        this.$emit("varSelAfter", VarConfig.obj2VarConfig({
                            ds: ds,
                            varBase: varBase,
                            qdMapList: qdMapList,
                            rdvList: rdvList
                        }));
                    })
                } else {
                    // 如果时单个值，直接返回值（注：此时不传入 varsId，这是因为变量名就是 varsId）
                    rdvList = [new RedisVal({
                        varName: varBase.varsId,
                        varDesc: varBase.desc,
                        varType: varBase.dataType,
                    })];
                    this.$emit("varSelAfter", VarConfig.obj2VarConfig({
                        ds: ds,
                        varBase: varBase,
                        qdMapList: qdMapList,
                        rdvList: rdvList
                    }));
                }
            },

            refreshPage() {
                let that = this;
                that.loading = true;
                // let filterParams = {
                //     status:"1",
                //     searchCon: that.searchCon,
                //     queryDimensionFlg:"1"
                // }
                // let params = {
                //     prodId: this.gConfig.prodId.value,
                //     pageNum: that.pageNum,
                //     pageSize: that.pageSize,
                //     varsBaseFilter: new VarFuzzyFilter(filterParams)
                // };
                // that.loading = true;
                // getFuzzyVarBaseList(params).then(res => {
                let varBaseFilter = JSON.parse(JSON.stringify(that.varBaseFilter));
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
            cancel() {
                this.searchCon = "";
            }

        }
    }
</script>

<style scoped>
    .pagination {
        margin-top: 15px
    }

    .tools {
        padding: 15px 15px 0 15px;
        background: #f7f7f7;
        border: 1px solid #e4e7ed;
    }
</style>
