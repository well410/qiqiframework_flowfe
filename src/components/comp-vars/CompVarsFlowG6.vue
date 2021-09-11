<template>
    <g6-editor ref="flow"
               @drawerOpened="drawerOpenedRuleFlowClick"
               @handleDebugBefore="handleDebugBefore"
               @handleDebugAfter="handleDebugAfter"
               @handleCheck="handleCheck"
               @handlePublish="handlePublish"
               @handleSave="handleSave"
               :toolsRemoveList="['测试','验证','发布版本']"
               :pageId="pageId"
               :comp-list="componentList"
               :node-pre="nodePre">
        <!--节点或者连线抽屉-->
        <template slot="drawer" slot-scope="data">
            <!--节点抽屉-->
            <template v-if="data.drawer.currItem.type === 'node'">
                <unit-rule v-if="data.drawer.currItem.nData.compType === compEnums.UR.code"
                           :ref="data.drawer.currItem.nData.compType"
                           :node="data.drawer.currItem"
                           :decisionTree="data.decisionTree"
                           :p-rule="rule"
                           :unit-rule-input-var-list="unitRuleInputVarList"></unit-rule>
                <object-edit v-if="data.drawer.currItem.nData.compType === compEnums.Obj.code"
                             :ref="data.drawer.currItem.nData.compType"
                             :node="data.drawer.currItem"
                             :obj-input-var-list="objInputVarList"></object-edit>
                <array-edit v-if="data.drawer.currItem.nData.compType === compEnums.Arr.code"
                            :ref="data.drawer.currItem.nData.compType"
                            :node="data.drawer.currItem"
                            :decisionTree="data.decisionTree"
                            :arr-input-var-list="arrInputVarList"></array-edit>
                <const-edie v-if="data.drawer.currItem.nData.compType === compEnums.Const.code"
                            :ref="data.drawer.currItem.nData.compType"
                            :decisionTree="data.decisionTree"
                            :node="data.drawer.currItem"></const-edie>
                <!-- 规则结果节点 074389-->
                <rule-result v-if="data.drawer.currItem.nData.compType === compEnums.RR.code"
                             :ref="data.drawer.currItem.nData.compType"
                             :node="data.drawer.currItem"
                             :decisionTree="data.decisionTree"
                             :rr-input-var-list="riVarList"
                             :p-rule="rule"></rule-result>
            </template>
            <!--连线抽屉-->
            <template v-else>
                <edit-line
                        ref="edge"
                        :item="data.drawer.currItem"
                        :g6Editor="data.drawer.g6Editor"
                        :decisionTree="data.decisionTree"></edit-line>
            </template>
        </template>

        <!--测试时字段输入的弹框-->
        <template slot="debugDialog">
            <el-table
                    ref="multipleTable"
                    :data="riVarList"
                    tooltip-effect="dark"
                    stripe
                    border
                    size="mini"
                    max-height="500px"
                    style="width: 100%">
                <el-table-column prop="varName" label="变量名">
                    <template slot-scope="prop">{{prop.row.getPrefixVarName()}}</template>
                </el-table-column>
                <el-table-column prop="varType" label="变量类型"></el-table-column>
                <el-table-column prop="varDesc" label="变量描述"></el-table-column>
                <el-table-column prop="varValue" label="字段值">
                    <template slot-scope="prop">
                        <el-input size="mini" v-model="prop.row.varValue"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <el-form v-if="debugResult !== ''">
                <el-form-item label="测试结果:">
                    <codemirror-show :p-code="debugResult"></codemirror-show>
                </el-form-item>
            </el-form>
        </template>


    </g6-editor>
</template>

<script>
    import {Component} from "../../entity/model";
    import UnitRule from "../rule-node/UnitRule";
    import {RuleBase, CompVarsRule} from "../../entity/rule";
    import EditLine from "../line/editLine";
    import {isEmpty, isNotEmpty, lsGet, lsSet} from "../../utils";
    import {getUUID, RuleUpdateDto} from "../index";
    import CodemirrorShow from "../codemirror/CodemirrorShow";
    import {RIVar} from "../../entity/vars";
    import {compEnums, statusEnums} from "../../entity/enumns";
    import VarEdit from "../vars-node/v2/VarEditV2";
    import ObjectEdit from "../object-node/ObjectEdit";
    import {evVarParse} from "../../api/Utils";
    import ArrayEdit from "../array-node/ArrayEdit";
    import ConstEdie from "../const-node/ConstEdie";
    import {G6Model, GetRel} from "../../entity/g6Model";
    import G6Editor from "../g6-editor/g6-editor";
    import {g6Enum} from "../g6-editor/entity/entity";
    import RuleResult from "../result-node/RuleResult";

    export default {
        name: "CompVarsFlowG6",
        components: {
            G6Editor,
            ConstEdie,
            ArrayEdit,
            ObjectEdit,
            VarEdit,
            CodemirrorShow,
            EditLine,
            UnitRule,
            RuleResult
        },
        props: {
            rule: Object,
            unitRuleInputVarList: Array,
            objInputVarList: Array,
            arrInputVarList: Array,
            disabled: {default: false, type: Boolean},
        },
        data() {
            return {
                componentList: [
                    compEnums.UR,
                    compEnums.Obj,
                    compEnums.Arr,
                    compEnums.RR,
                    compEnums.Const,

                    // new Component({icon: compEnums.UR.icon, type: compEnums.UR.code, name: compEnums.UR.name}),
                    // new Component({icon: compEnums.Obj.icon, type: compEnums.Obj.code, name: compEnums.Obj.name}),
                    // new Component({icon: compEnums.Arr.icon, type: compEnums.Arr.code, name: compEnums.Arr.name}),
                    // new Component({icon: compEnums.RR.icon, type: compEnums.RR.code, name: compEnums.RR.name}), //074389 规则结果节点
                    // new Component({
                    //     icon: compEnums.Const.icon,
                    //     type: compEnums.Const.code,
                    //     name: compEnums.Const.name
                    // }),
                ],
                compEnums: compEnums,
                riVarList: [],
                statusEnums :statusEnums,
                debugResult: '',
                inputExample: {},
                unitRuleVar: {riVarList: []},
                varEditVar: {riVarList: []},
                objEditVar: {riVarList: []},
                arrEditVar: {riVarList: []},
                pageId: getUUID(),
                nodePre: ''
            }
        },

        mounted() {
            let that = this;
            if (isNotEmpty(that.rule.ruleId)) {
                that.init();
            }
        },
        watch: {
            rule: {
                handler(value) {
                    // let that = this;
                    // that.node.nData.rule = value;
                },
                deep: true
            },

        },
        computed: {

        },

        methods: {

            //获取uuid
            getNodePre() {
                let s = [];
                let hexDigits = "0123456789abcdef";
                for (let i = 0; i < 7; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                return s.join("");
            },

            initFlow() {
                try {
                    let that = this;
                    // 1. 初始化规则图
                    this.$nextTick(() => {
                        if (isEmpty(that.nodePre)) that.nodePre = that.rule.ruleId;
                        if (isNotEmpty(that.rule.ruleJson)) that.$refs.flow.setDecisionTree(JSON.parse(that.rule.ruleJson));
                    })

                    // 2 初始化变量
                    // if (isNotEmpty(that.rule.analysisJson)) that.initVarList();


                } catch (e) {
                    console.error("RuleFlow初始化失败", e)
                }
            },
            /*changeUUId() {
            this.pageId = getUUID();
        },*/

            getDecisionTree() {
                return this.$refs.flow.getDecisionTree();
            },

            // 抽屉打开完成初始化抽屉中的数据
            drawerOpenedRuleFlowClick(drawer) {
                if (drawer.currItem.type === g6Enum.NODE.code) {
                    let ele = this.$refs[drawer.currItem.nData.compType];
                    if (isEmpty(ele)) {
                        console.error(`flow-edit draw ${drawer.currItem.nData.compType}插槽节点未找到`);
                        return
                    }

                    if (isEmpty(ele.init)) {
                        console.error(`flow-edit draw ${drawer.currItem.nData.compType}没有初始化方法`);
                        return
                    }

                    ele.init();
                } else {
                    let ele = this.$refs['edge'];
                    if (isEmpty(ele)) {
                        console.error(`flow-edit draw edge 插槽节点未找到`);
                        return
                    }

                    if (isEmpty(ele.init)) {
                        console.error(`flow-edit draw edge 没有初始化方法`);
                        return
                    }

                    ele.init();
                }
            },


            // 发布规则
            handlePublish() {

            },

            // 校验规则
            handleCheck() {

            },

            setInputExampleCookie(varMap) {
                let that = this;
                lsSet(that.rule.ruleId, varMap)
            },

            getInputExampleFromCookie() {
                let that = this;
                let varMap = lsGet(that.rule.ruleId);
                if (isNotEmpty(varMap)) {
                    that.riVarList = that.riVarList.map(item => {
                        let value = varMap[item.getPrefixVarName()];
                        if (isNotEmpty(value)) item.varValue = value;
                        return item
                    });
                    console.log(that.riVarList)
                }
            },

            // 测试之前
            handleDebugBefore(debugDialog) {

            },

            // 测试规则
            handleDebugAfter(debugDialog) {

            },

            // 保存规则
            handleSave(callBack) {
                let rrFlag = false;
                let that = this;
                let rule = new CompVarsRule(JSON.parse(JSON.stringify(that.rule)));
                let ruleTemp = new CompVarsRule(JSON.parse(JSON.stringify(that.rule)));
                // 将json对象转换为字符串
                rule.ruleJson = JSON.stringify(that.getDecisionTree());
                rule.ruleDrl = G6Model.getDrlCode(that.getDecisionTree(), CompVarsRule.obj2CompVarsRule(that.rule));
                let nodes = JSON.parse(rule.ruleJson).nodes;
                if (!that.isEmpty(nodes)) {
                    nodes.forEach(node => {
                        if (compEnums.RR.code === node.nData.compType) {
                            rule.ruleResultList = node.nData.ruleResultList ? node.nData.ruleResultList : [];
                            rrFlag = true;
                        }
                    });
                }
                // rule.ruleResultList
                /*let funRelList = GetRel.getFuncRelList(rule, that.getDecisionTree());
                let varsRelList = GetRel.getVarsRelList(rule, that.getDecisionTree());
                let dsRelList = GetRel.getDSRelList(rule, that.getDecisionTree());
                let ruleUpdateDto = new RuleUpdateDto({
                    ruleBase: rule,
                    funcRelList: funRelList,
                    varsRelList: varsRelList,
                    dsRelList: dsRelList
                });*/


                if (rrFlag){
                    rule.status=that.statusEnums['Y'].code;
                    Object.assign(that.rule, rule);
                    that.$message({message: "组合变量保存成功", type: "success"});
                } else{
                    Object.assign(that.rule, ruleTemp);
                    that.$message({message: "组合变量当前变量无规则结果节点，更改未生效", type: "error"});
                }

                /*let params = {ruleUpdateDto: ruleUpdateDto, prodId: that.gConfig.prodId.value, ruleId: rule.ruleId};
            updateRuleBase(params).then(res => {
                that.$message({message: "保存成功", type: "success"});
                that.rule.status = '0';
                if (isNotEmpty(callBack)) callBack();
            });*/

            },


            /**
             * 初始化规则流程图
             */
            init() {
                try {
                    let that = this;
                    // 1. 初始化规则图
                    if (isNotEmpty(that.rule.ruleJson)) that.$refs.flow.setDecisionTree(JSON.parse(that.rule.ruleJson));
                    // 2 初始化变量
                    if (isNotEmpty(that.rule.analysisJson)) that.initVarList();
                    if (that.disabled) {
                        that.$nextTick(()=>{
                            that.$refs.flow.setGraphMode("show");
                        })
                    }

                } catch (e) {
                    console.error("RuleFlow初始化失败", e)
                }
            },

            initVarList() {
                let that = this;
                let aj = that.rule.analysisJson;
                let ie = that.rule.inputExample;


                // 初始化事件变量（String，Double，Date，Integer，object，array类型）
                function setEVarList(res) {
                    let rivVarList = res[0].data.data
                        .map(item => new RIVar({
                            varName: item.path,
                            varDesc: item.desc,
                            varType: item.type,
                            ruleId: that.rule.ruleId
                        }));
                    that.unitRuleVar.riVarList = rivVarList;
                    that.varEditVar.riVarList = rivVarList;
                    that.objEditVar.riVarList = rivVarList;
                    that.arrEditVar.riVarList = rivVarList;
                }

                Promise.all(
                    [
                        evVarParse({analysisJson: aj, inputExample: ie}),
                    ]
                ).then(res => {
                    that.riVarList = res[0].data.data.map(item => new RIVar({
                        varName: item.path,
                        varDesc: item.desc,
                        varType: item.type,
                        varValue: item.value,
                        ruleId: that.rule.ruleId
                    }));
                    that.getInputExampleFromCookie();
                    setEVarList(res);
                });

            }

        }
    }
</script>

<style scoped>

</style>
