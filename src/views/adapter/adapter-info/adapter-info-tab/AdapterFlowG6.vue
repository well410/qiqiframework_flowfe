<template>
    <div>
        <g6-editor ref="flow"
                   @drawerOpened="drawerOpenedDecsFlowClick"
                   @handleDebugBefore="handleDebugBefore"
                   @handleDebugAfter="handleDebugAfter"
                   @handleCheck="handleCheck"
                   @handlePublish="handlePublish"
                   @handleSave="handleSave"
                   :comp-list="componentList">
            <!--节点或者连线抽屉-->
            <template slot="drawer" slot-scope="data">
                <!--节点抽屉-->
                <template v-if="data.drawer.currItem.type === 'node'">
                    <data-process-edit v-if="data.drawer.currItem.nData.compType === compEnums.DATA_PROCESS.code"
                                         :ref="data.drawer.currItem.nData.compType"
                                         :node="data.drawer.currItem"
                                         :decisionTree="data.decisionTree"
                                         :data-process-input-var-list="dataProcessInputVarList"></data-process-edit>
                    <aviator-script-edit v-if="data.drawer.currItem.nData.compType === compEnums.AVIATOR_SCRIPT.code"
                                         :ref="data.drawer.currItem.nData.compType"
                                         :node="data.drawer.currItem"
                                         :decisionTree="data.decisionTree"
                                         :aviator-script-input-var-list="aviatorScriptInputVarList"></aviator-script-edit>
                    <unit-rule v-if="data.drawer.currItem.nData.compType === compEnums.UR.code"
                               :ref="data.drawer.currItem.nData.compType"
                               :node="data.drawer.currItem"
                               :decisionTree="data.decisionTree"
                               :p-decs="pDecs"
                               :unit-rule-input-var-list="unitRuleInputVarList"></unit-rule>
                    <unit-rule-v2 v-if="data.drawer.currItem.nData.compType === compEnums.URV2.code"
                               :ref="data.drawer.currItem.nData.compType"
                               :node="data.drawer.currItem"
                               :decisionTree="data.decisionTree"
                               :p-decs="pDecs"
                               :unit-rule-input-var-list="unitRuleInputVarList"></unit-rule-v2>
                    <cmpt-edit v-if="data.drawer.currItem.nData.compType === compEnums.Cmpt.code"
                               :ref="data.drawer.currItem.nData.compType"
                               :node="data.drawer.currItem"
                               :decisionTree="data.decisionTree"
                               :p-decs="pDecs"
                               :cmpt-edit-input-var-list="cmptEditInputVarList"></cmpt-edit>
                    <var-edit-v2 v-if="data.drawer.currItem.nData.compType === compEnums.VarsV2.code"
                                 :ref="data.drawer.currItem.nData.compType"
                                 :node="data.drawer.currItem"
                                 :decisionTree="data.decisionTree"
                                 :var-edit-input-var-list="varEditInputVarList"></var-edit-v2>
                    <tqs-var-edit v-if="data.drawer.currItem.nData.compType === compEnums.TqsVars.code"
                                  :ref="data.drawer.currItem.nData.compType"
                                  :node="data.drawer.currItem"
                                  :decisionTree="data.decisionTree"
                                  :p-decs="pDecs"
                                  :tqs-var-edit-input-var-list="tqsVarEditInputVarList"></tqs-var-edit>
                    <decs-result v-if="data.drawer.currItem.nData.compType === compEnums.DR.code"
                                 :ref="data.drawer.currItem.nData.compType"
                                 :node="data.drawer.currItem"
                                 :decisionTree="data.decisionTree"
                                 :dr-input-var-list="drInputVarList"></decs-result>
                    <object-edit v-if="data.drawer.currItem.nData.compType === compEnums.Obj.code"
                                 :ref="data.drawer.currItem.nData.compType"
                                 :node="data.drawer.currItem"
                                 :decisionTree="data.decisionTree"
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
                    <ev-edit v-if="data.drawer.currItem.nData.compType === compEnums.EVStore.code"
                             :ref="data.drawer.currItem.nData.compType"
                             :decisionTree="data.decisionTree"
                             :node="data.drawer.currItem"
                             :ev-s-edit-input-var-list="evSEditInputVarList"></ev-edit>

                    <ext-rule-v2-edit v-if="data.drawer.currItem.nData.compType === compEnums.ERV2.code"
                              :ref="data.drawer.currItem.nData.compType"
                              :decisionTree="data.decisionTree"
                              :node="data.drawer.currItem"
                              :p-decs="pDecs"
                              :ext-rule-input-var-list="extRuleInputVarList"></ext-rule-v2-edit>

                    <comp-var v-if="data.drawer.currItem.nData.compType === compEnums.CompVars.code"
                              :ref="data.drawer.currItem.nData.compType"
                              :decisionTree="data.decisionTree"
                              :node="data.drawer.currItem"
                              :p-decs="pDecs"
                              :comp-var-input-var-list="extRuleInputVarList"></comp-var>
                    <score-card v-if="data.drawer.currItem.nData.compType === compEnums.SC.code"
                               :ref="data.drawer.currItem.nData.compType"
                               :node="data.drawer.currItem"
                               :decisionTree="data.decisionTree"
                               :p-decs="pDecs"
                               :g6Editor="data.drawer.g6Editor"
                               :score-card-input-var-list="scoreCardInputVarList"></score-card>
                </template>
                <!--连线抽屉-->
                <template v-else-if="data.drawer.currItem.eData">
                    <edit-line
                            ref="edge"
                            :item="data.drawer.currItem"
                            :g6Editor="data.drawer.g6Editor"
                            :decisionTree="data.decisionTree"></edit-line>
                </template>
            </template>

            <!--测试时字段输入的弹框-->
            <template slot="debugDialog">
                <el-form ref="debugForm" :model="this" :rules="rules">
                    <el-form-item label="输入报文" prop="req">
                        <codemirror v-model="req"
                                    :options="cmOptions"
                                    style="line-height:20px;z-index: 10000;"></codemirror>

                    </el-form-item>
                    <el-form-item label="测试结果" v-if="debugResult !== ''">
                        <codemirror-show :p-code="debugResult"></codemirror-show>
                    </el-form-item>
                </el-form>
            </template>
        </g6-editor>

        <el-form v-if="debugResult !== ''">
            <el-form-item label="测试结果:">
                <codemirror-show :p-code="debugResult"></codemirror-show>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import G6Editor from "../../../../components/g6-editor/g6-editor";
    import {Component} from "../../../../entity/model";
    import {compEnums} from "../../../../entity/enumns";
    import {DecsBase} from "../../../../entity/decs";
    import {isEmpty, isNotEmpty, lsGet, lsSet} from "../../../../utils";
    import ConstEdie from "../../../../components/const-node/ConstEdie";
    import ArrayEdit from "../../../../components/array-node/ArrayEdit";
    import ObjectEdit from "../../../../components/object-node/ObjectEdit";
    import DecsResult from "../../../../components/result-node/DecsResult";
    import VarEdit from "../../../../components/vars-node/v1/VarEdit";
    import CodemirrorShow from "../../../../components/codemirror/CodemirrorShow";
    import CmptEdit from "../../../../components/cmpt-node/CmptEdit";
    import UnitRule from "../../../../components/rule-node/UnitRule";
    import UnitRuleV2 from "../../../../components/rule-node-v2/UnitRuleV2";
    import ExtRule from "../../../../components/ext-rule-node/v1/ExtRule"; //add by 074389
    import EditLine from "../../../../components/line/editLine";
    import {g6Enum} from "../../../../components/g6-editor/entity/entity";
    import {EVar, PreVar, ROVar} from "../../../../entity/vars";
    import {evVarParse} from "../../../../api/Utils";
    import {
        checkDecs,
        getDecsById,
        getDecsRuleList,
        getRuleListByDecsId,
        publishDecs,
        updateDecs
    } from "../../../../api/Decs";
    import {DecsUpdateDto} from "../../index";
    import {G6Model, GetRel, GetExistConfig} from "../../../../entity/g6Model";
    import {MyMessage, validateVarSpChar} from "../../../common";
    import "../../../../components/common/common.scss"
    //codemirror导入
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"
    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"
    import "codemirror/addon/lint/lint";
    import "codemirror/addon/lint/lint.css";
    import "codemirror/addon/lint/json-lint";
    import "../../../common/indexL.less"
    import VarEditV2 from "../../../../components/vars-node/v2/VarEditV2";
    import TqsVarEdit from "../../../../components/tqs-vars-node/TqsVarEdit";
    import EvEdit from "../../../../components/evCmpt-node/EvEdit2";
    import CompVar from "../../../../components/comp-vars/CompVars";
    import ScoreCard from "../../../../components/score-card/ScoreCard";
    import AviatorScriptEdit from "../../../../components/aviator-script-node/AviatorScriptEdit";
    import DataProcessEdit from "../../../../components/data-process-node/DataProcessEdit";
    import Editor from "../../../../components/g6-editor/Base/Editor";
    import command from "../../../../components/g6-editor/command";
    import {modifyTqsDs} from "../../../../api/TqsDatasource";
    import ExtRuleV2Edit from "../../../../components/ext-rule-node/v2/ExtRuleV2Edit";

    require("script-loader!jsonlint");

    export default {
        name: "AdapterFlowG6",
        props: {pDecs: DecsBase},
        components: {
            ExtRuleV2Edit,
            DataProcessEdit,
            AviatorScriptEdit,
            EvEdit,
            VarEditV2,
            TqsVarEdit,
            CompVar,
            EditLine, G6Editor,
            ConstEdie,
            ArrayEdit, ObjectEdit, DecsResult, VarEdit, CodemirrorShow, CmptEdit, UnitRule, ExtRule, ScoreCard,UnitRuleV2
        },
        data() {
            return {
                rules: {
                    req: [
                        {required: true, message: '请输入输入报文示例', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                    ]
                },

                componentList: [
                    compEnums.DATA_PROCESS,
                    compEnums.AVIATOR_SCRIPT,
                    compEnums.VarsV2,
                    compEnums.TqsVars,
                    compEnums.EVStore,
                    compEnums.UR,
                    compEnums.URV2,
                    compEnums.Obj,
                    compEnums.Arr,
                    compEnums.Const,
                    compEnums.Cmpt,
                    compEnums.ERV2,
                    compEnums.DR,
                    compEnums.CompVars,
                    compEnums.SC,

                    // new Component({icon: compEnums.DATA_PROCESS.icon, type: compEnums.DATA_PROCESS.code, name: compEnums.DATA_PROCESS.name}),
                    // new Component({icon: compEnums.AVIATOR_SCRIPT.icon, type: compEnums.AVIATOR_SCRIPT.code, name: compEnums.AVIATOR_SCRIPT.name}),
                    // new Component({icon: compEnums.VarsV2.icon, type: compEnums.VarsV2.code, name: compEnums.VarsV2.name}),
                    // new Component({icon: compEnums.TqsVars.icon, type: compEnums.TqsVars.code, name: compEnums.TqsVars.name}),
                    // new Component({icon: compEnums.EVStore.icon, type: compEnums.EVStore.code, name: compEnums.EVStore.name}),
                    // new Component({icon: compEnums.UR.icon, type: compEnums.UR.code, name: compEnums.UR.name}),
                    // new Component({icon: compEnums.URV2.icon, type: compEnums.URV2.code, name: compEnums.URV2.name}),
                    // new Component({icon: compEnums.Obj.icon, type: compEnums.Obj.code, name: compEnums.Obj.name}),
                    // new Component({icon: compEnums.Arr.icon, type: compEnums.Arr.code, name: compEnums.Arr.name}),
                    // new Component({icon: compEnums.Const.icon, type: compEnums.Const.code, name: compEnums.Const.name}),
                    // new Component({icon: compEnums.Cmpt.icon, type: compEnums.Cmpt.code, name: compEnums.Cmpt.name}),
		            // new Component({icon: compEnums.ERV2.icon, type: compEnums.ERV2.code, name: compEnums.ERV2.name}),
                    // new Component({icon: compEnums.DR.icon, type: compEnums.DR.code, name: compEnums.DR.name}),
                    // new Component({icon: compEnums.CompVars.icon, type: compEnums.CompVars.code, name: compEnums.CompVars.name}),
                    // new Component({icon: compEnums.SC.icon, type: compEnums.SC.code, name: compEnums.SC.name}),
                ],
                compEnums: compEnums,
                relVar: {eVarList: [], preVarList: [], roVarList: [], tVarList: []},
                debugResult: '',
                req: '',
                cmOptions: {
                    //使用的语言
                    mode: 'application/json',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    // gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
                    showCursorWhenSelecting: true,
                    autofocus: false,
                    line: true,
                    indentWithTabs: true,
                    smartIndent: true,
                    //显示行号
                    lineNumbers: true,
                    //括号匹配
                    matchBrackets: true,
                },
                editor: {},
                command: null,
                isDecsFlow:true
            }
        },
        created() {

            this.initData();
        },

        computed: {
            // 数据处理输入变量
            dataProcessInputVarList(){
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },

            // 脚本语言输入
            aviatorScriptInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },

            // 元规则输入（可以使用的变量）
            unitRuleInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },

            // 规则节点输入（可以映射的变量）
            extRuleInputVarList(){
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },
            // 组件编辑的输入（可以使用的变量：1 决策事件变量 2 规则的输出变量 3 临时变量）
            cmptEditInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                result.push(...this.relVar.tVarList);
                return result;
            },
            evSEditInputVarList(){
                let result = [];
                result.push(...this.relVar.eVarList);
                return result;
            },

            scoreCardInputVarList(){
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },
            tqsVarEditInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                result.push(...this.relVar.tVarList);
                return result;
            },

            varEditInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },

            drInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                result.push(...this.relVar.tVarList);
                return result;
            },

            objInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },

            arrInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            }
        },
        mounted() {
        },

        methods: {
            initData() {
                // console.log("initEditor");
                this.editor = new Editor();
                this.command = new command(this.editor);
                this.isDecsFlow =  true;
            },
            init() {
                try {
                    let that = this;
                    // 1. 初始化决策图
                    let ruleJson = that.pDecs.ruleJson;
                    that.req = JSON.parse(JSON.stringify(this.pDecs)).inputExample;

                    if (isNotEmpty(ruleJson)) {
                        that.$refs.flow.setDecisionTree(JSON.parse(ruleJson));
                        that.$refs.flow.setGraphMode("show");
                    }

                    // 2 初始化变量
                    that.initVarList();
                } catch (e) {
                    console.error("DecsFlow初始化失败", e)
                }
            },

            // 初始化可以引用的变量
            initVarList() {
                let that = this;
                // 2. 初始化决策事件变量（与规则映射的变量）
                let aj = that.pDecs.analysisJson;
                let ie = that.pDecs.inputExample;

                // 初始化事件变量（String，Double，Date，Integer，object，array类型）
                function setEVarList(res) {
                    let eVarList = res[0].data.data
                        .map(item => new EVar({
                            varName: item.path,
                            varDesc: item.desc,
                            varType: item.type,
                            varValue: item.value
                        }));
                    that.eVarList = eVarList;
                    that.relVar.eVarList = eVarList;
                }

                // 初始化规则输出变量
                function setROVarList(res) {
                    let roVarList = res[1].data.data.map(item => new ROVar({
                        varName: item.ruleId,
                        varDesc: item.ruleName,
                        varType: '',
                    }));
                    that.relVar.roVarList = roVarList;

                }



                function setPreVarList() {
                    that.relVar.preVarList = that.pDecs.preHandleReturnList.map(item => new PreVar(item));
                }

                Promise.all(
                    [
                        evVarParse({analysisJson: aj, inputExample: ie}),
                        getDecsRuleList({decsId: that.pDecs.decsId, prodId: this.gConfig.prodId.value}),
                        getRuleListByDecsId({decsId: that.pDecs.decsId, prodId: this.gConfig.prodId.value}),
                    ]
                ).then(res => {
                    that.setReq();
                    if (that.pDecs.preHandle === 'Y') {
                        setPreVarList();
                    }

                    setEVarList(res);
                    setROVarList(res);

                })
            },

            // 测试前从前端读取缓存
            setReq() {
                if (isNotEmpty(lsGet(this.pDecs.decsId))) {
                    this.req = lsGet(this.pDecs.decsId)
                }
            },


            // 抽屉打开完成初始化抽屉中的数据
            drawerOpenedDecsFlowClick(drawer) {
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
                        console.error(`flow-edit draw ${drawer.currItem.type}插槽节点未找到`);
                        return
                    }

                    if (isEmpty(ele.init)) {
                        console.error(`flow-edit draw ${drawer.currItem.type}没有初始化方法`);
                        return
                    }
                    ele.init();
                }
            },

            getDecisionTree() {
                return this.$refs.flow.getDecisionTree();
            },



            // 保存决策
            async handleSave(callBack) {

            },

            //天擎数据源更新（无则新增，有则更新）
            tqsRelatedUpdate(tqsDatasource){
            },

            // 测试之前
            handleDebugBefore(debugDialog) {
            },

            // 测试决策
            handleDebugAfter(debugDialog) {
            },

            // 决策验证
            handleCheck() {
            },

            //决策发布
            handlePublish() {
            },
        }
    }
</script>

<style scoped>

</style>
