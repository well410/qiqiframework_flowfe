<template>
    <div id="ExtRulesTable">
        <!--操作工具栏-->
        <div class="tools">
            <el-form @submit.native.prevent :inline="true" size="mini">
                <el-form-item label="规则Id">
                    <el-input placeholder="规则Id" v-model="ruleFilter.ruleId"
                              maxlength="64" show-word-limit
                              @keydown.enter.native="refreshPage"></el-input>
                </el-form-item>

                <el-form-item label="规则名">
                    <el-input placeholder="规则名" v-model="ruleFilter.ruleName"
                              maxlength="64" show-word-limit
                              @keydown.enter.native="refreshPage"></el-input>
                </el-form-item>

                <el-form-item label="规则状态">
                    <el-select placeholder="规则状态" v-model="ruleFilter.ruleStatus" clearable>
                        <el-option :label="statusEnums['0'].name" :key="statusEnums['0'].code"
                                   :value="statusEnums['0'].code"></el-option>
                        <el-option :label="statusEnums['1'].name" :key="statusEnums['1'].code"
                                   :value="statusEnums['1'].code"></el-option>
                        <el-option :label="statusEnums['2'].name" :key="statusEnums['2'].code"
                                   :value="statusEnums['2'].code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="refreshPage"> 查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!--规则列表-->
        <el-table
                ref="multipleTable"
                :data="ruleList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                border
                size="mini">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <rule-show :p-rule="props.row" ref="ruleShow"></rule-show>
                </template>
            </el-table-column>
            <el-table-column prop="ruleId" label="规则id"></el-table-column>
            <el-table-column prop="ruleName" label="规则名"></el-table-column>
            <el-table-column prop="status" label="规则状态">
                <template slot-scope="props">
                    <el-tag v-if="isNotEmpty(statusEnums[props.row.status])" :type="tagType[props.row.status]">
                        {{statusEnums[props.row.status].name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="props">
                    <el-button @click="versionSelBefore(props.row)" size="mini" type="success">选择版本</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-bar">
            <el-pagination background layout="total,prev,pager,next" class="pagination"
                           @current-change="handleCurrentChange"
                           :page-size="pageSize"
                           :total="total"></el-pagination>

        </div>
        <!--版本选择-->
        <el-dialog
                :visible.sync="isShow"
                :close-on-click-modal="false"
                :modal="false"
                title="选择版本">
            <el-table
                    ref="multipleTable"
                    :data="ruleVersionList"
                    tooltip-effect="dark"
                    stripe
                    border
                    size="mini"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <rule-show :p-rule="props.row" :p-type="tabType.ruleVersion"></rule-show>
                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index" width="60"></el-table-column>
                <el-table-column label="规则ID" prop="ruleId"></el-table-column>
                <el-table-column label="规则名字" prop="ruleName"></el-table-column>
                <el-table-column label="规则版本" prop="ruleVersion"></el-table-column>
                <el-table-column label="规则状态" prop="status">
                    <template slot-scope="props">
                        <el-tag :type="tagType[props.row.status]">{{statusEnums[props.row.status].name}}</el-tag>
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
    import {RuleFilter} from "../../../views/rule";
    import {statusEnums, tabType, tagType} from "../../../entity/enumns";
    import {getRuleList} from "../../../api/Rule";
    import {getRuleListVersionList} from "../../../api/Decs";
    import {isNotEmpty} from "../../../utils";
    import {G6Model} from "../../../entity/g6Model";
    import RuleShow from "../../../views/rule/rule-components/RuleShow";

    export default {
        name: "ExtRuleTables",
        components: {RuleShow},
        props: {
            pSelExtRuleList: {default: () => [], Array},
            pDecisionTree: Object,
        },
        data() {
            return {
                ruleFilter: new RuleFilter(),
                statusEnums: statusEnums,
                loading: false,
                ruleList: [],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                tagType: tagType,
                ruleVersionList: [],
                isShow: false,
                tabType: tabType,
            }
        },
        mounted() {
            this.refreshPage();
        },
        computed: {
            computeSelDisable() {
                return (row) => {
                    return this.pSelExtRuleList.filter(item => item.ruleId === row.ruleId).length > 0
                }
            },
        },
        methods: {
            // 初始化外部规则
            init() {
            },

            versionSelBefore(row) {
                let that = this;
                that.isShow = true;

                // 判读当前规则是否能够选择
                function isDisabled(rule) {
                    let ruleList = G6Model.getRuleList(that.pDecisionTree);
                    let filterList = ruleList.filter(rule => rule.ruleId === row.ruleId);
                    if (rule.ruleVersion === undefined) {
                        rule.ruleVersion = '';
                    }
                    if (filterList.length > 0) { // 如果该组件被使用，那么只能勾选相同的版本
                        return !(filterList[0].ruleVersion === rule.ruleVersion);
                    } else {
                        return false;
                    }
                }

                let ruleIdList = [row.ruleId];
                //ruleIdList.push(row.ruleId);

                getRuleListVersionList({prodId: that.gConfig.prodId.value, ruleIdList: ruleIdList}).then(res => {
                    let arr = [];
                    if (isNotEmpty(res.data.data)) {
                        arr = res.data.data;
                        // 启用的才能选择
                        arr = arr.filter(rule => rule.status === 'Y');
                    }
                    let ruleVersionList = [row, ...arr];
                    //console.log('list:' + JSON.stringify(ruleVersionList));
                    ruleVersionList.forEach(rule => {
                        this.$set(rule, "disabled", isDisabled(rule))
                    });
                    that.ruleVersionList = ruleVersionList;
                })
            },

            versionSelAfter(row) {
                this.isShow = false;
                this.$emit("extRuleSelClick", row);
            },

            /*
            extRuleSel(row) {
                this.$emit("extRuleSelClick", row)
            },
            */
            // 分页查询页面
            refreshPage() {
                let that = this;
                let params = {
                    prodId: that.gConfig.prodId.value,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    ruleFilter: that.ruleFilter
                };
                that.loading = true;
                getRuleList(params).then(res => {
                    that.ruleList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.ruleList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },
            // 页面切换
            handleCurrentChange(val) {
                this.pageNum = val;
                this.refreshPage();
            },
        },


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
