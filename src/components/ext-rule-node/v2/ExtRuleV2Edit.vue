<template>
    <div id="extra-rule" ref="extraRule">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled" v-if="adapterRuleId===null">
                <template slot="right">
                    <el-divider direction="vertical"></el-divider>
                    <el-dropdown trigger="click" @command="handleCommand" >
                        <el-button :disabled="disabled" type="primary" size="mini">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="extRuleSelBefore">添加</el-dropdown-item>
                            <el-dropdown-item command="openTotal">展开全部</el-dropdown-item>
                            <el-dropdown-item command="closeTotal">关闭全部</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </node-inf>
            <el-card class="node-content-card">
                <el-collapse v-model="activeNames">
                    <template v-for="item in extRuleList">
                        <el-collapse-item :name="item.ruleId" v-if="isShowExRule(item.ruleId)">
                            <template slot="title">
                                <div title="规则配置" style="width: 100%">
                                    <span style="margin-right: 5px" @click.stop>
                                        <router-link :to="{path: computeRuleLink(item)}"  target="_blank"  tag="a">规则ID:{{item.ruleId}}</router-link>
                                    </span>
                                    <el-divider direction="vertical"></el-divider>
                                    <span style="margin-left: 5px" v-if="isNotEmpty(item.ruleVersion)">规则版本:{{item.ruleVersion}}</span>

                                    <span @click.stop>
                                        <el-dropdown  trigger="hover" @command="ruleHandleCommand($event, item)" class="right-button">
                                            <el-button :disabled="disabled" type="primary" size="mini">
                                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                                            </el-button>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="deleteRule" v-if="adapterRuleId===null">删除</el-dropdown-item>
                                                <el-dropdown-item command="autoMapping">字段映射</el-dropdown-item>
                                                <el-dropdown-item command="synchronizationData" v-if="adapterRuleId===null">字段同步</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </span>
                                </div>
                            </template>
                            <el-card>
                                <div slot="header">
                                    <span>{{item.ruleName}}</span>
                                </div>
                                <el-form label-width="80px" size="mini" style="margin-top: 15px">
                                    <el-form-item label="规则版本" >
                                        <el-select
                                                v-model="item.ruleVersion"
                                                filterable
                                                clearable
                                                placeholder="请选择版本"
                                                :loading="versionLoading"
                                                style="width: 100%"
                                                @change="versionChange($event, item)"
                                                @visible-change="visibleChange($event, item)">
                                            <el-option
                                                    v-for="item in ruleVersionList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="字段映射">
                                        <el-table
                                                id="conditionTable"
                                                :data="rivVarListMap[item.ruleId]"
                                                tooltip-effect="dark"
                                                stripe
                                                border
                                                max-height="266px"
                                                size="mini"
                                                style="width: 100%">
                                            <el-table-column align="center" label="字段名">
                                                <template slot-scope="scope">
                                                    {{scope['row'].varName}}
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="字段类型">
                                                <template slot-scope="scope">
                                                    {{scope['row'].varType}}
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="cdDesc" align="center" label="字段映射">
                                                <template slot-scope="scope">
                                                    <div style="display: flex;flex-wrap: nowrap;justify-content: space-between;align-items: center">
                                                        <div>
                                                            <template v-if="scope['row']['isSelect']">
                                                                <el-select :disabled="disabled"
                                                                           filterable
                                                                           clearable
                                                                           v-model="scope['row'].mapField" size="mini"
                                                                           placeholder="请设置字段映射" style="width: 100%">
                                                                    <el-option v-for="item in ruleRelVarList"
                                                                               :key="item.getPrefixVarName()"
                                                                               :label="`[${item.getPrefixVarName()}][${item.getSimpleDesc()}]`"
                                                                               :value="item.getPrefixVarName()">
                                                                        <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                                                        <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                                                                    </el-option>
                                                                </el-select>
                                                            </template>

                                                            <template v-else>
                                                                <div>{{scope['row'].mapField}}</div>
                                                            </template>
                                                        </div>

                                                        <div style="width: 50px">
                                                            <el-button size="mini"  class="icon-button" icon="el-icon-edit" @click="selectClick(scope['row'])" title="编辑"></el-button>
                                                        </div>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-form-item>
                                    <el-form-item label="规则结果" v-if="isNotEmpty(rovVarListMap[item.ruleId])">
                                        <span v-for="rovVar in rovVarListMap[item.ruleId]" style="margin-right: 15px">
                                            {{rovVar.varName}}
                                        </span>
                                    </el-form-item>
                                </el-form>

                            </el-card>
                        </el-collapse-item>
                    </template>
                </el-collapse>
            </el-card>
        </el-scrollbar>

        <!--规则列表-->
        <el-dialog :visible.sync="extRuleTable.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :title="extRuleTable.title">
            <ext-rule-v2-table
                    ref="extRuleTable"
                    :p-decision-tree="decisionTree"
                    :p-disable-list="computeDisableList"
                    @extRuleSelClick="extRuleSelAfter"></ext-rule-v2-table>
        </el-dialog>
    </div>
</template>

<script>
    import NodeInf from "../../common/node-inf";
    import resizeForDrawer from "../../mixins/resizeForDrawer";
    import ExtRuleV2Table from "./ExtRuleV2Table";
    import {isNotEmpty} from "../../../utils";
    import {pathParse} from "../../../api/Utils";
    import {RIVar} from "../../../entity/vars";
    import {G6Model} from "../../../entity/g6Model";
    import {RuleBase, RuleVersion} from "../../../entity/rule";
    import {ExtRuleNodeV2} from "../../../entity/model";
    import {getRuleListVersionList} from "../../../api/Decs";
    import {getRuleDetail} from "../../../api/Rule";
    import {AutoMapping} from "../../../views/common";
    import {compEnums, rQueryEnums} from "../../../entity/enumns";

    export default {
        name: "ExtRuleV2Edit",
        components: {ExtRuleV2Table, NodeInf},
        mixins: [resizeForDrawer],
        props: {
            decisionTree: Object,
            node: {
                default: () => {
                }, type: Object
            },
            pRule: {
                default: () => {
                }, type: Object
            },
            pDecs: {
                default: () => {
                }, type: Object
            },
            extRuleInputVarList: {default: () => [], type: Array},
            disabled: {default: false, type: Boolean},
            adapterRuleId: {
                type: String,
                default: null
            },
        },
        data() {
            return {
                /**
                 * @see ExtRuleNodeV2
                 **/
                extRuleList: [],
                decsVarsToRuleVarsMap: {},
                rovVarListMap: {},
                rivVarListMap: {},
                isNotEmpty: isNotEmpty,


                ruleVersionList: [],
                versionLoading: false,
                extRuleTable: {dialog: false, title: '规则选择'},
                ruleBaseTotal: [],
                activeNames: [],
                ruleRelVar: {
                    totalVarList: [],
                },

            }
        },

        computed: {
            computeRuleLink(){
                return (item)=>{
                    return `/ui/ruleManage/ruleInf?prodId=${this.gConfig.prodId.value}&ruleId=${item.ruleId}&tab=RuleFlowG6&${rQueryEnums.FROM_PAGE.code}=${compEnums.ERV2.code}`;
                }
            },

            computeDisableList(){
                if (isNotEmpty(this.pRule)) {
                    return [this.pRule.ruleId];
                }
                return [];
            },

            ruleRelVarList() {
                let result = [];
                result.push(...this.extRuleInputVarList);
                result.push(...this.ruleRelVar.totalVarList);
                return result;
            },
        },

        watch: {
            // 外部规则List
            extRuleList: {
                handler(newValue) {
                    this.node.nData.extRuleList = newValue;
                },
                deep: true
            },

            decsVarsToRuleVarsMap: {
                handler(newValue) {
                    this.node.nData.decsVarsToRuleVarsMap = newValue;
                },
                deep: true
            },

            //
            rovVarListMap: {
                handler(newValue) {
                    this.node.nData.rovVarListMap = newValue;
                },
                deep: true
            },

            rivVarListMap: {
                handler(newValue) {
                    this.node.nData.rivVarListMap = newValue;
                },
                deep: true
            }
        },

        methods: {
            selectClick(row){
                if (row['isSelect']){
                    this.$set(row, 'isSelect', false);
                } else {
                    this.$set(row, 'isSelect', true);
                }
            },


            init() {
                let that = this;
                that.isEmpty(that.node.nData.extRuleList) ? that.extRuleList = [] : that.extRuleList = that.node.nData.extRuleList.map(item => new RuleVersion(item));
                that.isEmpty(that.node.nData.decsVarsToRuleVarsMap) ? that.decsVarsToRuleVarsMap = {} : that.decsVarsToRuleVarsMap = that.node.nData.decsVarsToRuleVarsMap;
                that.isEmpty(that.node.nData.rovVarListMap) ? that.rovVarListMap = {} : that.rovVarListMap = that.node.nData.rovVarListMap;
                that.isEmpty(that.node.nData.rivVarListMap) ? that.rivVarListMap = {} : that.rivVarListMap = that.node.nData.rivVarListMap;
                that.ruleRelVar.totalVarList = G6Model.getTotalVarsOfParents(that.node, this.decisionTree);
                that.openTotal();

            },

            isShowExRule(item){
                let that = this;
                if (that.adapterRuleId===null){
                    return true;
                }
                return item===that.adapterRuleId;
            },

            // 版本修改
            versionChange(data, item){
                getRuleDetail({
                    prodId: this.gConfig.prodId.value,
                    ruleId: item.ruleId,
                    versionId: data,
                }).then(res => {
                    this.synchronizationExtRuleList(res.data.data);
                    this.synchronizationRovVarListMap(res.data.data);
                    this.$forceUpdate();
                });
            },


            visibleChange(query, rule) {
                if (query) {
                    this.versionLoading = true;
                    getRuleListVersionList({
                        prodId: this.gConfig.prodId.value,
                        ruleIdList: [rule.ruleId]
                    }).then(item => {
                        let ruleVersionList = item.data.data;
                        this.ruleVersionList = ruleVersionList.map(item => {
                            return {value: item.ruleVersion, label: item.ruleVersion};
                        })
                        this.versionLoading = false;
                    })
                }
            },

            ruleHandleCommand(_command, _rule) {
                switch (_command) {
                    case 'deleteRule':
                        this.extRuleList = this.extRuleList.filter(item => item.ruleId !== _rule.ruleId);
                        delete(this.rovVarListMap[_rule.ruleId]);
                        delete(this.rivVarListMap[_rule.ruleId]);
                        break;
                    case 'autoMapping':
                        this.autoMapping(_rule);
                        this.$forceUpdate();
                        break;
                    case 'synchronizationData':
                        getRuleDetail({
                            prodId: this.gConfig.prodId.value,
                            ruleId: _rule.ruleId,
                            versionId: _rule.ruleVersion,
                        }).then(res => {
                            this.synchronizationData(res.data.data);
                        });
                }
            },

            /**
             * 自动匹配
             */
            autoMapping(_rule){
                let result = this.rivVarListMap[_rule.ruleId];
                result.forEach(item => {
                    this.$set(item, 'mapField', AutoMapping.autoMappingByName(item.varName, this.ruleRelVarList));
                });
                this.rivVarListMap[_rule.ruleId] = result;
            },

            /**
             * 处理命令
             */
            handleCommand(command) {
                switch (command) {
                    case 'extRuleSelBefore':
                        this.extRuleSelBefore();
                        break;
                    case 'openTotal':
                        this.openTotal();
                        break;
                    case 'closeTotal':
                        this.closeTotal();
                        break;
                }
            },

            /**
             * 选择弹框
             */
            extRuleSelBefore() {
                let that = this;
                that.extRuleTable.dialog = true;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.extRuleTable)) {
                        that.$refs.extRuleTable.init();
                    }
                });
            },

            /**
             * 选择外部规则
             */
            extRuleSelAfter(extRule) {

                if (isNotEmpty(this.extRuleList.filter(item => item.ruleId === extRule.ruleId))) {
                    this.$message({type: 'warning', message: `${extRule.ruleId}规则已存在，请勿重复添加`});
                } else {
                    // 添加规则
                    const sampleRule = {
                        ruleId: extRule.ruleId,
                        ruleName: extRule.ruleName,
                        ruleVersion: extRule.ruleVersion
                    };
                    this.extRuleList.push(sampleRule);
                    // 同步数据
                    this.synchronizationExtRuleList(extRule);
                    this.synchronizationRivVarListMap(extRule, true);
                    this.synchronizationRovVarListMap(extRule);
                    this.$forceUpdate()
                }
            },

            /**
             * 同步 extRuleList
             * @param extRule
             */
            synchronizationExtRuleList(extRule){
                const sampleRule = {
                    ruleId: extRule.ruleId,
                    ruleName: extRule.ruleName,
                    ruleVersion: extRule.ruleVersion
                };
                this.extRuleList.forEach(item=>{
                    if (item.ruleId === sampleRule.ruleId){
                        Object.assign(item, sampleRule)
                    }
                });
            },

            /**
             * 同步 rovVarListMap
             * @param extRule
             */
            synchronizationRovVarListMap(extRule){
                this.rovVarListMap[extRule.ruleId] = ExtRuleNodeV2.getRuleResult(extRule);
            },

            /**
             * 同步 rivVarListMap
             * @param extRule
             */
            synchronizationRivVarListMap(extRule, isAutoMapping){
                pathParse({analysisJson: JSON.parse(extRule.analysisJson)}).then((res) => {
                    this.rivVarListMap[extRule.ruleId] = res.data.data.map(item => new RIVar({
                        varName: item.variable,
                        varDesc: item.description.split("-")[0],
                        varType: item.description.split("-")[1],
                        ruleId: extRule.ruleId
                    }));

                    if (isAutoMapping){
                        this.ruleHandleCommand("autoMapping", extRule);
                    }

                    // 异步的请求，所以这里也需要同步刷新页面
                    this.$forceUpdate()
                });
            },

            synchronizationData(extRule) {
                this.synchronizationExtRuleList(extRule);
                this.synchronizationRivVarListMap(extRule);
                this.synchronizationRovVarListMap(extRule);
                this.$forceUpdate()
            },

            openTotal() {
                this.activeNames = this.extRuleList.map(item => item.ruleId);
            },

            closeTotal() {
                this.activeNames = [];
            }


        }
    }
</script>

<style scoped>

</style>
