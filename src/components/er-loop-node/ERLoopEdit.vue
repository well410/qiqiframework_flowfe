<template>
    <div id="er-loop-edit">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled">
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
                    <template v-for="item in erlVarList">
                        <el-collapse-item :name="item.ruleId">
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
                                                <el-dropdown-item command="deleteRule">删除</el-dropdown-item>
                                                <el-dropdown-item command="synchronizationData">字段同步</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </span>
                                </div>
                            </template>
                            <el-card>
                                <div slot="header">
                                    <span>{{item.ruleName}}</span>
                                </div>
                                <el-form label-width="80px" size="mini" style="margin-top: 10px">
                                    <el-form-item label="循环结果">
                                        <span>{{item.getPrefixVarName()}}</span>
                                        <el-button @click="erlVarEditBefore(item)"  class="icon-button" icon="el-icon-edit" title="编辑" style="margin-left: 15px"></el-button>
                                    </el-form-item>

                                    <el-row :gutter="10">
                                        <el-col :span="12">
                                            <el-form-item label="数组引用">
                                                <el-select :disabled="disabled"
                                                           filterable
                                                           clearable
                                                           v-model="item.refListName" size="mini"
                                                           placeholder="请设置字段映射" style="width: 100%">
                                                    <el-option v-for="item in computeArrayRel"
                                                               :key="item.getPrefixVarName()"
                                                               :label="`[${item.getPrefixVarName()}][${item.getSimpleDesc()}]`"
                                                               :value="item.getPrefixVarName()">
                                                        <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                                        <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
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
                                        </el-col>
                                    </el-row>
                                    <el-form-item label="字段映射">
                                        <el-table
                                                id="conditionTable"
                                                :data="item.rivVarList"
                                                tooltip-effect="dark"
                                                stripe
                                                border
                                                max-height="400px"
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
                                            <el-table-column align="left" label="字段映射">
                                                <template slot-scope="scope">
                                                        <!--如果是jPath，则jPath生效-->
                                                        <template v-if="scope['row'].fieldFrom === varFromEnums.jPath.code">
                                                            <el-input v-model="scope['row'].jPath" style="width: 80%"></el-input>
                                                            <el-button @click="scope['row'].fieldFrom = varFromEnums.rel.code"
                                                                       title="编辑"
                                                                       style="margin-left: 15px" size="mini"  class="icon-button"  icon="el-icon-link" ></el-button>
                                                        </template>
                                                        <!--如果是其他的，则字段引用生效-->
                                                        <template v-else>
                                                            <el-select :disabled="disabled"
                                                                       filterable
                                                                       clearable
                                                                       v-model="scope['row'].mapField" size="mini"
                                                                       placeholder="请设置字段映射" style="width: 80%">
                                                                <el-option v-for="item in computeMapFieldRel"
                                                                           :key="item.getPrefixVarName()"
                                                                           :label="`[${item.getPrefixVarName()}][${item.getSimpleDesc()}]`"
                                                                           :value="item.getPrefixVarName()">
                                                                    <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                                                    <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                                                                </el-option>
                                                            </el-select>
                                                            <el-button @click="scope['row'].fieldFrom = varFromEnums.jPath.code"
                                                                       title="jsonPath"
                                                                       style="margin-left: 15px" size="mini"  class="icon-button"  icon="el-icon-edit" ></el-button>
                                                        </template>


                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-form-item>
                                    <el-form-item label="规则结果" v-if="isNotEmpty(item.rovVarList)">
                                        <span v-for="rovVar in item.rovVarList" style="margin-right: 15px">
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


        <!--循环结果编辑-->
        <el-dialog :visible.sync="erlVarDialog.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :title="erlVarDialog.title">
           <comm-var-inf ref="commVarInf" :p-var="erlVarDialog.erLoopConfigVar" :p-alias-list="computeAliasRel" :varTypeDisable="true" :inline="false"></comm-var-inf>

            <template slot="footer" class="dialog-footer">
                <el-button @click="erlVarDialog.dialog = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="erlVarEditAfter" size="mini">确 定
                </el-button>
            </template>
        </el-dialog>


    </div>
</template>

<script>
    import {isNotEmpty} from "../../utils";
    import {compEnums, dataTypeEnums, rQueryEnums, varFromEnums, varNameTypeEnums} from "../../entity/enumns";
    import NodeInf from "../common/node-inf";
    import {G6Model} from "../../entity/g6Model";
    import ExtRuleV2Table from "../ext-rule-node/v2/ExtRuleV2Table";
    import {ErLoopConfigVar, RIVar} from "../../entity/vars";
    import {pathParse} from "../../api/Utils";
    import {ExtRuleNodeV2} from "../../entity/model";
    import {getRuleDetail} from "../../api/Rule";
    import CommVarInf from "../common/CommVarInf";
    import isEmpty from "@antv/util/esm/is-empty";
    import {getRuleListVersionList} from "../../api/Adapter";
    import resizeForDrawer from "../mixins/resizeForDrawer";

    export default {
        name: "ERVLoopEdit",
        components: {CommVarInf, ExtRuleV2Table, NodeInf},
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
            erLoopInputVarList: {default: () => [], type: Array},
            disabled: {default: false, type: Boolean},
        },

        data() {
            return {
                erlVarList: [],
                extRuleTable: {dialog: false, title: '规则选择'},
                erlVarDialog: {dialog: false, title: "循环结果配置", erLoopConfigVar: {}},
                varFromEnums: varFromEnums,
                ruleVersionList: [],
                versionLoading: false,
                activeNames: [],

                isNotEmpty: isNotEmpty,
                ruleRelVar: {
                    totalVarList: [],
                },

            }
        },

        computed: {
            computeRuleLink() {
                return (item) => {
                    return `/ui/ruleManage/ruleInf?prodId=${this.gConfig.prodId.value}&ruleId=${item.ruleId}&tab=RuleFlowG6&${rQueryEnums.FROM_PAGE.code}=${compEnums.ERV2.code}`;
                }
            },

            computeDisableList(){
                if (isNotEmpty(this.pRule)) {
                    return [this.pRule.ruleId];
                }
                return [];
            },

            // 获取数组引用的变量
            computeArrayRel(){
                let result = [];
                result.push(...this.erLoopInputVarList);
                result.push(...this.ruleRelVar.totalVarList);
                return result.filter(item=>item.varType === dataTypeEnums.ARRAY.code || isEmpty(item.varType));

            },

            // 获取字段映射的引用变量
            computeMapFieldRel(){
                let result = [];
                result.push(...this.erLoopInputVarList);
                result.push(...this.ruleRelVar.totalVarList);
                return result;
            },

            // 获取别名的引用
            computeAliasRel(){
                let result = [];
                result.push(...this.erLoopInputVarList);
                result.push(...this.ruleRelVar.totalVarList);
                return result.filter(item=>item.enableAlias());
            }

        },

        watch: {
            /**
             * erl 变量结果配置
             *
             * @see ErLoopConfigVar
             *
             **/
            erlVarList: {
                handler(newValue) {
                    this.node.nData.erlVarList = newValue;
                },
                deep: true
            },
        },


        methods:{

            /**
             * 版本修改时触发
             *
             */
            versionChange(data, item){
                getRuleDetail({
                    prodId: this.gConfig.prodId.value,
                    ruleId: item.ruleId,
                    versionId: data,
                }).then(res => {
                    // 同步规则信息和输出
                    this.synchronizationRuleInf(res.data.data);
                    this.synchronizationRovVarList(res.data.data);
                    this.$forceUpdate();
                });
            },

            /**
             * 下拉框出现时触发
             *
             */
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
                        });
                        this.versionLoading = false;
                    })
                }
            },


            erlVarEditBefore(item){
                this.erlVarDialog.erLoopConfigVar = ErLoopConfigVar.obj2ERLVar(JSON.parse(JSON.stringify(item)));
                this.erlVarDialog.dialog = true;
            },

            erlVarEditAfter(){
                this.$refs.commVarInf.validate().then(res=>{
                    if (res){
                        this.erlVarList.forEach(item=>{
                            if (item.uuid === this.erlVarDialog.erLoopConfigVar.uuid){
                                Object.assign(item, this.erlVarDialog.erLoopConfigVar)
                            }
                        });
                        this.erlVarDialog.dialog = false;
                    }
                });
            },

            /**
             * 选择外部规则
             */
            extRuleSelAfter(extRule) {
                if (isNotEmpty(this.erlVarList.filter(item => item.ruleId === extRule.ruleId))) {
                    this.$message({type: 'warning', message: `${extRule.ruleId}规则已存在，请勿重复添加`});
                } else {
                    let data = {
                        varName: extRule.ruleId.split("_").splice(2).join("_"),
                        varType: dataTypeEnums.ARRAY.code,
                        varNameType : varNameTypeEnums.S.code,

                        ruleId: extRule.ruleId,
                        ruleName: extRule.ruleName,
                        ruleVersion: extRule.ruleVersion
                    };
                    let erlVar = new ErLoopConfigVar(data);
                    this.erlVarList.push(erlVar);

                    // 同步数据
                    this.synchronizationRivVarList(extRule);
                    this.synchronizationRovVarList(extRule);
                    this.$forceUpdate()
                }
            },


            init() {
                let that = this;
                // 根据节点数据初始化
                that.isEmpty(that.node.nData.erlVarList) ? that.erlVarList = [] : that.erlVarList = that.node.nData.erlVarList.map(item => new ErLoopConfigVar(item));


                that.ruleRelVar.totalVarList = G6Model.getTotalVarsOfParents(that.node, this.decisionTree);
            },

            /**
             * 同步规则信息
             *
             */
            synchronizationRuleInf(extRule){
                this.erlVarList.forEach(item=>{
                    if (item.ruleId === extRule.ruleId){
                        item.ruleId = extRule.ruleId;
                        item.ruleName = extRule.ruleName;
                        item.ruleVersion = extRule.ruleVersion;
                    }
                })
            },

            /**
             * 同步 rovVarList
             * @param extRule
             */
            synchronizationRovVarList(extRule) {
                this.erlVarList.forEach(item => {
                    if (item.ruleId === extRule.ruleId) {
                        item.rovVarList = ExtRuleNodeV2.getRuleResult(extRule);
                    }
                });
            },

            /**
             * 同步 rivVarList
             * @param extRule
             */
            synchronizationRivVarList(extRule) {
                pathParse({analysisJson: JSON.parse(extRule.analysisJson)}).then((res) => {
                    this.erlVarList.forEach(item => {
                        if (item.ruleId === extRule.ruleId) {
                            item.rivVarList = res.data.data.map(item => new RIVar({
                                varName: item.variable,
                                varDesc: item.description.split("-")[0],
                                varType: item.description.split("-")[1],
                                ruleId: extRule.ruleId,
                                jPath : `$.${item.variable}`,
                                fieldFrom : varFromEnums.jPath.code,
                            }));
                        }
                    });

                    // 异步的请求，所以这里也需要同步刷新页面
                    this.$forceUpdate()
                });
            },


            /**
             * 规则中的操作
             *
             *
             **/
            ruleHandleCommand(_command, _rule) {
                switch (_command) {
                    case 'deleteRule':
                        this.erlVarList = this.erlVarList.filter(item => item.ruleId !== _rule.ruleId);
                        break;
                    case 'synchronizationData':
                        this.$confirm('字段同步会初始化字段映射，确定要同步吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(({value}) => {
                            getRuleDetail({
                                prodId: this.gConfig.prodId.value,
                                ruleId: _rule.ruleId,
                                versionId: _rule.ruleVersion,
                            }).then(res => {
                                this.synchronizationRuleInf(res.data.data);
                                this.synchronizationRivVarList(res.data.data);
                                this.synchronizationRovVarList(res.data.data);
                            });
                        }).catch(() => {});
                }
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
                        this.activeNames = this.erlVarList.map(item => item.ruleId);
                        break;
                    case 'closeTotal':
                        this.activeNames = [];
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
        }
    }
</script>

<style scoped>

</style>
