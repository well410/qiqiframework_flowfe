<template>
    <div id="cmptTable">
        <div class="tools">
            <el-form @submit.native.prevent :inline="true" size="mini">
                <el-form-item label="查询内容">
                    <el-input placeholder="模糊匹配内容"
                              maxlength="64" show-word-limit
                              v-model="fuzzyContent" @keydown.enter.native="refreshPage"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="refreshPage"> 查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
                ref="multipleTable"
                :data="cmptList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                border
                size="mini">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <cmpt-show :p-cmpt="props.row"></cmpt-show>
                </template>
            </el-table-column>
            <el-table-column prop="prodId" align="center" label="产品id"/>
            <el-table-column prop="cmptId" align="center"  label="组件Id"/>
            <el-table-column prop="cmptName" align="center"  label="组件名称"/>
            <el-table-column prop="status" align="center"  label="组件状态">
                <template slot-scope="props">
                    <el-tag v-if="isNotEmpty(statusEnums[props.row.status])" type="success">
                        {{statusEnums[props.row.status].name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="props">
                    <el-button @click="versionSelBefore(props.row)" size="mini" type="success">选择版本</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-bar clearfix">
            <el-pagination background layout="total,prev,pager,next" class="pagination"
                           @current-change="handleCurrentChange"
                           :page-size="pageSize"
                           :total="total"></el-pagination>

        </div>

        <!--版本选择-->
        <el-dialog
                :visible.sync="isShow"
                :modal="false"
                :close-on-click-modal="false"
                title="选择版本">
            <el-table
                    ref="multipleTable"
                    :data="cmptVersionList"
                    tooltip-effect="dark"
                    stripe
                    border
                    size="mini">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <cmpt-show :p-cmpt="props.row"></cmpt-show>
                    </template>
                </el-table-column>
                <el-table-column prop="prodId"  label="产品id"></el-table-column>
                <el-table-column prop="cmptId"  label="组件id"></el-table-column>
                <el-table-column prop="cmptName" label="组件名"></el-table-column>
                <el-table-column prop="cmptVersion"  label="组件版本"></el-table-column>
                <el-table-column prop="status"  label="组件状态">
                    <template slot-scope="props">
                        <el-tag v-if="isNotEmpty(statusEnums[props.row.status])"
                                :type="tagType[props.row.status]">{{statusEnums[props.row.status].name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="props">
                        <el-button @click="versionSelAfter(props.row)" :disabled="props.row.disabled" size="mini"
                                   type="success">选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

    </div>
</template>

<script>
    import {getCmptBaseList, getCmptVersionList} from "../../api/Cmpt";
    import {statusEnums, tagType} from "../../entity/enumns";
    import * as ElementUI from "element-ui";
    import CmptShow from "../cmpt-node/CmptShow";
    import {G6Model} from "../../entity/g6Model";
    import {isNotEmpty} from "../../utils";

    export default {
        name: "CmptTable",
        components: {CmptShow},
        props: {
            pDecisionTree: Object
        },
        data() {
            return {
                fuzzyContent: '',
                cmptList: [],
                cmptVersionList: [],
                tagType: tagType,
                statusEnums: statusEnums,

                cmptQueryDto: {
                    cmptId: "",
                    cmptName: "",
                    inteType: "",
                    pageNum: 1,
                    pageSize: 10,
                },

                loading: false,
                isShow: false,
                pageNum: 1,
                pageSize: 10,
                total: 0,
            }
        },
        methods: {
            //初始化
            init() {
                this.refreshPage();
            },

            //组件版本选择
            versionSelAfter(cmpt) {
                this.isShow = false;
                let analysisJson = JSON.parse(cmpt.analysisJson);
                let requestBodyJson = analysisJson['requestBody'];
                let responseAnalysis = JSON.parse(cmpt.responseAnalysis);
                let requestValidate = analysisJson.hasOwnProperty('requestBody') && requestBodyJson.hasOwnProperty('dsType')
                    && (typeof (requestBodyJson['dsType']) == 'string') && requestBodyJson.hasOwnProperty('data')
                    && (typeof (requestBodyJson['data']) == 'object');
                let responseValidate = responseAnalysis.hasOwnProperty("data") && (typeof (responseAnalysis['data']) == 'object')
                    && responseAnalysis['data'].hasOwnProperty('vars') && (typeof (responseAnalysis['data']['vars']) == 'object');
                if (!(requestValidate && responseValidate)) {
                    ElementUI.Message({message: "组件输入/输出不合乎天擎规范~", type: 'error'});
                } else {
                    this.$emit("cmptSelAfter", cmpt);
                }
            },

            versionSelBefore(row) {
                let that = this;
                that.isShow = true;
                let cmptQueryDto = {cmptId: row.cmptId};

                // 判读当前组件是否能够选择
                function isDisabled(cmpt) {
                    let cmptList = G6Model.getCmptList(that.pDecisionTree);
                    let filterList = cmptList.filter(cmpt => cmpt.cmptId === row.cmptId);
                    if (filterList.length > 0) { // 如果该组件被使用，那么只能勾选相同的版本
                        return !(filterList[0].cmptVersion === cmpt.cmptVersion);
                    } else {
                        return false;
                    }
                }

                getCmptVersionList({prodId: this.gConfig.prodId.value, cmptQueryDto}).then(res => {
                    let arr = [];
                    if (isNotEmpty(res.data.data)) {
                        arr = res.data.data['objectList'].filter(cmpt=>cmpt.status === 'Y');
                    }
                    let cmptVersionList = [row, ...arr];
                    cmptVersionList.forEach(cmpt => {
                        this.$set(cmpt, "disabled", isDisabled(cmpt))
                    });
                    that.cmptVersionList = cmptVersionList;
                })
            },

            refreshPage() {
                let that = this;
                that.loading = true;
                let params = {
                    cmptId: that.fuzzyContent,
                    cmptName: that.fuzzyContent,
                    inteType: 'H',
                    pageNum: that.pageNum,
                    pageSize: that.pageSize
                };
                getCmptBaseList({
                    prodId: this.gConfig.prodId.value,
                    cmptQueryDto: params
                }).then(res => {
                    that.cmptList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    if (that.total > 0 && that.cmptList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage();
                    }
                }).finally(() => {
                    that.loading = false;
                });
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
