<template>
    <!--规则历史-->
    <div id="ruleHis">
        <!--操作工具栏-->
        <div class="tools" v-if="false">
            <el-form @submit.native.prevent :inline="true" size="mini">
                <el-form-item label="规则名">
                    <el-input placeholder="规则名"  maxlength="64" show-word-limit v-model="ruleFilter.ruleName"></el-input>
                </el-form-item>
                <el-form-item label="规则版本">
                    <el-input placeholder="规则版本"  maxlength="64" show-word-limit v-model="ruleFilter.ruleVersion"></el-input>
                </el-form-item>
                <el-form-item label="规则状态">
                    <el-select placeholder="规则状态" v-model="ruleFilter.ruleStatus" clearable>
                        <el-option :label="statusEnums['0'].name" :key="statusEnums['0'].code" :value="statusEnums['0'].code"></el-option>
                        <el-option :label="statusEnums['1'].name" :key="statusEnums['1'].code" :value="statusEnums['1'].code"></el-option>
                        <el-option :label="statusEnums['Y'].name" :key="statusEnums['Y'].code" :value="statusEnums['Y'].code"></el-option>
                        <el-option :label="statusEnums['N'].name" :key="statusEnums['N'].code" :value="statusEnums['N'].code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="refreshPage"> 查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!--规则历史表格-->
        <el-table
                ref="multipleTable"
                :data="ruleHisList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                size="mini" style="min-height: 746px;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <rule-show :p-rule="props.row" :p-type="tabType.ruleHis"></rule-show>
                </template>
            </el-table-column>
            <el-table-column prop="ruleId"  align="center"  label="规则id"></el-table-column>
            <el-table-column prop="ruleName" align="center"  label="规则名"></el-table-column>
            <el-table-column prop="ruleVersion" align="center"  label="规则版本"></el-table-column>
            <el-table-column prop="createUser" align="center"  label="创建人"></el-table-column>
            <el-table-column prop="createTime" align="center"  label="创建时间"></el-table-column>
            <el-table-column prop="status" align="center"  label="规则状态">
                <template slot-scope="props">
                    <el-tag :type="tagType[props.row.status]" style="width: 60px">{{statusEnums[props.row.status].name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="changeType" align="center"  label="操作类型">
                <template slot-scope="props">
                    <el-tag :type="tagType[props.row.changeType]" style="width: 60px">{{isEmpty(changeTypeEnums[props.row.changeType]) ? props.row.changeType :
                        changeTypeEnums[props.row.changeType].name}}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                class="pagination-bar"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[15, 30, 60, 100]"
                :page-size="pageSize"
                :current-page.sync="pageNum"
                :total="total">
        </el-pagination>

    </div>
</template>

<script>
    import {RuleBase} from "../../../../entity/rule";
    import RuleShow from "../../rule-components/RuleShow";
    import {getRuleHistoryList} from "../../../../api/Rule";
    import {isEmpty} from "../../../../utils";
    import {RuleFilter} from "../..";
    import {changeTypeEnums, statusEnums, tabType, tagType} from "../../../../entity/enumns";

    export default {
        components: {RuleShow},
        props: {     //props属性用于获取父组件传给子组件的数据
            pRule: RuleBase,
            required: true
        },
        name: "RuleHis",
        data() {
            return {
                dialogTitle: "Test",
                ruleFilter: new RuleFilter(),
                pageNum: 1,
                pageSize: 15,
                total: 0,
                dialogVisible: false,
                ruleHisList: [],
                loading: false,
                ruleDetail: "",
                tabType: tabType,
                changeTypeEnums: changeTypeEnums,
                statusEnums: statusEnums,
                tagType: tagType,
                isEmpty: isEmpty
            };
        },
        methods: {
            init() {         /*这个方法是子组件中必须的,即使是个空方法*/
                this.refreshPage();
            },

            handleCurrentChange(val) {
                this.pageNum = val;
                this.refreshPage();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNum =1
                this.refreshPage();
            },

            refreshPage() {
                let that = this;
                let params = {
                    prodId: that.pRule.prodId,
                    ruleId: that.pRule.ruleId,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    ruleFilter: that.ruleFilter
                };
                that.loading = true;
                getRuleHistoryList(params).then(res => {
                    that.ruleHisList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.ruleHisList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(res => {
                    that.loading = false;
                })
            },
        },
    }
</script>

<style scoped>
    #ruleHis {
        width: 100%;
        height: 100%;
    }
</style>
