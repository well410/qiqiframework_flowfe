<template>
    <div>
        <g6-editor ref="flow"
                   @drawerOpened="drawerOpenedDecsFlowClick"
                   @handleDebugBefore="handleDebugBefore"
                   @handleDebugAfter="handleDebugAfter"
                   @handleCheck="handleCheck"
                   @handlePublish="handlePublish"
                   @handleSave="handleSave"
                   @handleCopyDT="handleCopyDTBefore"
                   @doDebugOfMenu="doDebugOfMenuBefore"
                   :comp-list="componentList">
            <!--节点或者连线抽屉-->
            <template slot="drawer" slot-scope="data">
                <!--节点抽屉-->
                <template v-if="data.drawer.type === g6Enum.NODE.code">
                    <filter-edit v-if="data.drawer.currItem.nData.compType === compEnums.FILTER.code"
                                 :ref="data.drawer.currItem.nData.compType"
                                 :node="data.drawer.currItem"
                                 :filter-input-var-list="defaultInputVarList"
                                 :decisionTree="data.decisionTree"></filter-edit>
                    <rate-ctrl v-if="data.drawer.currItem.nData.compType === compEnums.RATE_CTRL.code"
                                       :ref="data.drawer.currItem.nData.compType"
                                       :node="data.drawer.currItem"
                                       :decisionTree="data.decisionTree"></rate-ctrl>
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

                    <!--外部规则节点-->
                    <ext-rule-v2-edit v-if="data.drawer.currItem.nData.compType === compEnums.ERV2.code"
                              :ref="data.drawer.currItem.nData.compType"
                              :decisionTree="data.decisionTree"
                              :node="data.drawer.currItem"
                              :p-decs="pDecs"
                              :ext-rule-input-var-list="extRuleInputVarList"></ext-rule-v2-edit>

                    <!--规则循环节点-->
                    <e-r-v-loop-edit v-if="data.drawer.currItem.nData.compType === compEnums.ER_LOOP.code"
                                     :ref="data.drawer.currItem.nData.compType"
                                     :decisionTree="data.decisionTree"
                                     :node="data.drawer.currItem"
                                     :p-decs="pDecs"
                                     :er-loop-input-var-list="defaultInputVarList"></e-r-v-loop-edit>

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

                    <!--决策表节点-->
                    <decs-table v-if="data.drawer.currItem.nData.compType === compEnums.DT.code"
                                :ref="data.drawer.currItem.nData.compType"
                                :node="data.drawer.currItem"
                                :decisionTree="data.decisionTree"
                                :p-decs="pDecs"
                                :g6Editor="data.drawer.g6Editor"
                                :decs-table-input-var-list="decsTableInputVarList"></decs-table>


                </template>
                <!--连线抽屉-->
                <template v-else-if="data.drawer.type === g6Enum.EDGE.code">
                    <edit-line
                            :ref="g6Enum.EDGE.code"
                            :item="data.drawer.currItem"
                            :g6Editor="data.drawer.g6Editor"
                            :decisionTree="data.decisionTree"></edit-line>
                </template>
                <!--组合抽屉-->
                <template v-else-if="data.drawer.type === g6Enum.COMBO.code">
                    <edit-combo :ref="g6Enum.COMBO.code"
                                :item="data.drawer.currItem"
                                :g6Editor="data.drawer.g6Editor"
                                :decisionTree="data.decisionTree"></edit-combo>
                </template>
            </template>

            <!--测试时字段输入的弹框-->
            <template slot="debugDialog">
                <el-form ref="debugForm" :model="this" :rules="rules">
                    <el-collapse v-model="activeNames" style="padding-bottom: 20px">
                        <el-collapse-item name="JSONSCHEMA">
                            <template slot="title">
                                <div title="按照JSON Schema格式配置校验报文">
                                    <span>校验配置</span>
                                    <i class="header-icon el-icon-info"></i>
                                </div>
                            </template>
                                <el-form-item prop="jsonSchema">
                                    <codemirror v-model="jsonSchema"
                                                :options="cmOptions"
                                                style="line-height:20px;z-index: 10000;"></codemirror>

                                </el-form-item>
                        </el-collapse-item>
                        <el-collapse-item name="INPUTEXAMPLE">
                            <template slot="title">
                                <div title="按照JSON格式配置测试报文">
                                    <span>测试报文</span>
                                    <i class="header-icon el-icon-info"></i>
                                </div>
                            </template>
                                <el-form-item prop="req">
                                    <codemirror v-model="req"
                                                :options="cmOptions"
                                                style="line-height:20px;z-index: 10000;"></codemirror>

                                </el-form-item>
                        </el-collapse-item>
                        <el-collapse-item name="DEBUGRESULT">
                            <template slot="title">
                                <div title="测试结果">
                                    <span>测试结果</span>
                                    <i class="header-icon el-icon-info"></i>
                                </div>
                            </template>
                            <el-form size="mini">
                                <el-form-item v-if="debugResult !== ''">
                                    <codemirror-show :p-code="debugResult"></codemirror-show>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                    </el-collapse>

<!--                    <el-form-item label="输入报文" prop="req">-->
<!--                        <codemirror v-model="req"-->
<!--                                    :options="cmOptions"-->
<!--                                    style="line-height:20px;z-index: 10000;"></codemirror>-->

<!--                    </el-form-item>-->
<!--                    <el-form-item label="测试结果" v-if="debugResult !== ''">-->
<!--                        <codemirror-show :p-code="debugResult"></codemirror-show>-->
<!--                    </el-form-item>-->
                </el-form>
            </template>
        </g6-editor>




        <el-dialog
                :visible.sync="copyRuleJson.isShow"
                title="拷贝版本表流程图"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                :modal="false"
                :fullscreen="true">
            <div style="margin: 15px">
                <el-button @click="copyRuleJson.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="handleCopyDTAfter" size="mini">确 定</el-button>
            </div>

            <el-form size="mini" label-width="80px">
                <el-form-item label="版本信息">
                    <el-select
                            style="width: 100%"
                            v-model="copyRuleJson.selectVersion"
                            @change="onSelectVersionChange(copyRuleJson.selectVersion)"
                            filterable>
                        <el-option
                                v-for="item in copyRuleJson.versionList"
                                :key="item.decsVersion"
                                :label="item.decsVersion"
                                :value="item.decsVersion">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <decs-show ref="decsShow" v-if="isNotEmpty(copyRuleJson.selectVersion)" :p-decs="copyRuleJson.selectRule" :p-type="tabType.decsCitation"></decs-show>
        </el-dialog>

        <el-dialog
                :visible.sync="debugOneNode.isShow"
                title="单节点测试"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                :modal="false"
                width="800px">
            <el-form>
                <el-form-item label="输入报文" prop="req">
                    <codemirror v-model="debugOneNode.req" :options="cmOptions"
                                style="line-height:20px;z-index: 5000"></codemirror>

                </el-form-item>
                <el-form-item label="测试结果" v-if="debugOneNode.result !== ''">
                    <codemirror-show :p-code="debugOneNode.result"></codemirror-show>
                </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="debugOneNode.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="doDebugOfMenuAfter" :loading="debugOneNode.loading" size="mini">确 定</el-button>
            </template>
        </el-dialog>

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
    import {compEnums, tabType} from "../../../../entity/enumns";
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
        getRuleListByDecsId, getTotalDecsVersionList,
        publishDecs,
        testDecs, testDecsOneNode,
        updateDecs
    } from "../../../../api/Decs";
    import {DecsFilter, DecsUpdateDto} from "../../index";
    import {G6Model, GetRel, GetExistConfig, TestFun} from "../../../../entity/g6Model";
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
    import RateCtrl from "../../../../components/rateCtrl-node/RateCtrl";
    import Editor from "../../../../components/g6-editor/Base/Editor";
    import command from "../../../../components/g6-editor/command";
    import {modifyTqsDs} from "../../../../api/TqsDatasource";
    import ExtRuleV2Edit from "../../../../components/ext-rule-node/v2/ExtRuleV2Edit";
    import ERVLoopEdit from "../../../../components/er-loop-node/ERLoopEdit";
    import DecsShow from "../../decs-components/DecsShow";
    import FilterEdit from "../../../../components/filter-node/FilterEdit";
    import DecsTable from "../../../../components/decs-table/DecsTable";
    import EditCombo from "../../../../components/combo/editCombo";

    require("script-loader!jsonlint");

    export default {
        name: "DecsFlowG6",
        props: {pDecs: DecsBase},
        components: {
            EditCombo,
            FilterEdit,
            DecsShow,
            ERVLoopEdit,
            ExtRuleV2Edit,
            DataProcessEdit,
            AviatorScriptEdit,
            EvEdit,
            VarEditV2,
            TqsVarEdit,
            CompVar,
            EditLine, G6Editor,
            ConstEdie,RateCtrl,
            ArrayEdit, ObjectEdit, DecsResult, VarEdit, CodemirrorShow, CmptEdit, UnitRule, ExtRule, ScoreCard,UnitRuleV2, DecsTable
        },
        data() {
            return {
                // 拷贝版本表 ruleJson
                copyRuleJson: {isShow: false, versionList: [], selectVersion: {}, selectRule: {}},

                // 单节点测试
                debugOneNode: {isShow: false, req: "{}", result: "", node: {}, loading : false},
                rules: {
                    req: [
                        {required: true, message: '请输入输入报文示例', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                    ],
                    jsonSchema: [
                        {required: true, message: '请输入校验配置', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                    ],
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
                    compEnums.FILTER,
                    compEnums.Const,
                    compEnums.Cmpt,
                    compEnums.ERV2,
                    compEnums.DR,
                    compEnums.SC,
                    compEnums.RATE_CTRL,
                    compEnums.ER_LOOP,
                    compEnums.DT
                ],
                tabType: tabType,
                compEnums: compEnums,
                g6Enum: g6Enum,
                relVar: {eVarList: [], preVarList: [], roVarList: [], tVarList: []},
                debugResult: '',
                req: '',
                jsonSchema:'',
                cmOptions: {
                    //使用的语言
                    mode: 'application/json',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
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
                isDecsFlow: true,
                activeNames: ["JSONSCHEMA", "INPUTEXAMPLE", "DEBUGRESULT"],

            }
        },
        created() {

            this.initData();
        },

        watch: {
            // 监听测试结果，修改节点状态
            'debugResult': {
                handler(value) {
                    try {
                        let json = JSON.parse(value);
                        let success = [];
                        let error = [];
                        let that = this;

                        Object.keys(json['nLog']).forEach(item=>{
                            if (json['nLog'][item]['errorCodeList'].length > 0){
                                error.push(item);
                            } else {
                                success.push(item);
                            }
                        });

                        that.$refs['flow'].getGraph().getNodes().forEach(item=>{
                            // 初始化下，都设置为false
                            that.$refs['flow'].getGraph().setItemState(item, g6Enum.SUCCESS_TYPE.code, false);
                            that.$refs['flow'].getGraph().setItemState(item, g6Enum.ERROR_TYPE.code, false);

                            // 根据返回结果，设置状态
                            success.includes(item.getModel()['nData']['uniqueName']) && true && that.$refs['flow'].getGraph().setItemState(item, g6Enum.SUCCESS_TYPE.code, true);
                            error.includes(item.getModel()['nData']['uniqueName']) && true && that.$refs['flow'].getGraph().setItemState(item, g6Enum.ERROR_TYPE.code, true);
                        })
                    } catch (e) {
                        console.error("测试结果中修改节点状态失败")
                    }
                },
                deep: true
            }
        },

        computed: {
            /**
             * 默认的输入变量，之前由于有些节点需要合并规则中的临时变量，所以每个节点都有自己的处理方式
             * 现在定义一个默认的输入变量，仅包含预处理和事件变量
             * @returns {Array}
             */
            defaultInputVarList(){
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },

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
                result.push(...this.relVar.preVarList);
                return result;
            },

            scoreCardInputVarList(){
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },

            // 决策表
            decsTableInputVarList() {
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

            // 从版本表中拷贝ruleJson
            handleCopyDTBefore(){
                let that = this;
                that.copyRuleJson.isShow = false;
                that.copyRuleJson.versionList = [];
                that.copyRuleJson.selectRule = {};
                that.copyRuleJson.selectVersion = '';

                let param = {prodId: that.pDecs.prodId, decsId: that.pDecs.decsId};
                getTotalDecsVersionList(param).then(res => {
                    that.copyRuleJson.versionList = res.data.data;
                    that.copyRuleJson.isShow = true;
                })
            },

            // 从版本表中拷贝ruleJson
            handleCopyDTAfter(){
                isNotEmpty(this.copyRuleJson.selectVersion) && this.$refs.flow.setDecisionTree(JSON.parse(this.copyRuleJson.selectRule.ruleJson));
                this.copyRuleJson.isShow = false;
            },

            // 版本选择改变的时候
            onSelectVersionChange(version){
                if (isEmpty(version)){
                    this.copyRuleJson.selectRule = {};
                } else {
                    this.copyRuleJson.selectRule = this.copyRuleJson.versionList.filter(item=>item.decsVersion === version)[0];
                    this.$nextTick(()=>{
                        this.$refs['decsShow'].init();
                    })

                }
            },

            init() {
                try {
                    let that = this;
                    // 1. 初始化决策图
                    let ruleJson = that.pDecs.ruleJson;
                    that.req = JSON.parse(JSON.stringify(this.pDecs)).inputExample;
                    that.jsonSchema = JSON.parse(JSON.stringify(this.pDecs)).jsonSchema;

                    if (isNotEmpty(ruleJson)) {
                        that.$refs.flow.setDecisionTree(JSON.parse(ruleJson));
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

            // 保存决策
            async handleSave(callBack) {
                let that = this;
                MyMessage.versionMessage(that.getDecisionTree());
                let decs = new DecsBase(JSON.parse(JSON.stringify(that.pDecs)));
                // 将json对象转换为字符串
                decs.jsonSchema = that.jsonSchema;//更新jsonSchema
                decs.ruleJson = JSON.stringify(that.getDecisionTree());
                decs.ruleDrl = G6Model.getDrlCode(that.getDecisionTree(), that.pDecs);
                let funRelList = GetRel.getFuncRelList(decs, that.getDecisionTree());
                let cmptRelList = GetRel.getCmptRelList(decs, that.getDecisionTree());
                let tqsRelInfo = GetRel.getTqsDSRelList(decs, that.getDecisionTree());
                let dsRelList = GetRel.getDSRelList(decs, that.getDecisionTree());
                let varsRelList = GetRel.getVarsRelList(decs, that.getDecisionTree());
                let ruleRelList = GetRel.getRuleRelList(decs, that.getDecisionTree()); //074389

                //判断是否存在天擎数据源，并确定是否新增/编辑改事件源
                let tqsVarsNodeList = GetExistConfig.getTqsDSConfig(decs, that.getDecisionTree());
                let updateTqsDsFlg = false;
                if (isNotEmpty(tqsVarsNodeList)) {
                    if (await this.$confirm('存在天擎数据源，是否进行同步新增/更新？', '提示', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '保存',
                        cancelButtonText: '取消'
                    }).then(()=>{
                        updateTqsDsFlg=true;
                    }).catch(() => {}) !== 'confirm') {
                    }
                }
                if(updateTqsDsFlg) {
                    that.tqsRelatedUpdate(tqsVarsNodeList[0].nData.tqsVarConfig.tqsDatasource);
                }

                let decsUpdateDto = new DecsUpdateDto({
                    decsBase: decs,
                    funcRelList: funRelList,
                    cmptRelList: cmptRelList,
                    tqsRelInfo: tqsRelInfo,
                    dsRelList: dsRelList,
                    varsRelList: varsRelList,
                    decsRuleRelList: ruleRelList,
                });
                updateDecs({
                    prodId: that.gConfig.prodId.value,
                    decsId: decs.decsId,
                    decsUpdateDto: decsUpdateDto
                }).then(res => {
                    that.$message({message: "保存成功", type: "success"});
                    Object.assign(that.pDecs, res.data.data);
                    that.initVarList();
                    if (callBack !== undefined) callBack();
                });

            },

            doDebugOfMenuBefore(item){
                let that = this;
                this.$confirm('单节点测试前先保存规则', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    that.handleSave().then(()=>{
                        that.debugOneNode.isShow = true;
                        that.debugOneNode.node = item.getModel();
                        const varList = TestFun.getUseVarOneNode(that.getDecisionTree(), that.pDecs, that.debugOneNode.node, that.defaultInputVarList);
                        that.debugOneNode.req = JSON.stringify(TestFun.varListToMap(varList), null, 4);
                    });
                }).catch(() => {});
            },

            doDebugOfMenuAfter(){
                let that = this;
                const drlCode = TestFun.getDrlCodeOneNode(that.getDecisionTree(), that.pDecs, that.debugOneNode.node);
                const req = JSON.parse(that.debugOneNode.req);
                const prodId = that.gConfig.prodId.value;
                const decsId = that.pDecs.decsId;
                let params = {req, prodId, decsId, drlCode};
                that.debugOneNode.loading = true;
                testDecsOneNode(params).then(res=>{
                    if (res.data.data.success) {
                        that.debugOneNode.result = JSON.stringify(res.data.data.data, null, 4);
                        // that.debugOneNode.result = JSON.stringify(JSON.parse(res.data.data.result), null, 4);
                        that.$message({type: 'info', message: '测试结果返回'});
                    } else {
                        that.$message({type: 'warning', message: '测试异常'});
                        that.debugOneNode.result = res.data.data.message;
                    }
                }).finally(()=>{
                    that.debugOneNode.loading = false;
                })
            },

            //天擎数据源更新（无则新增，有则更新）
            tqsRelatedUpdate(tqsDatasource){
                let that= this;
                let upTqsDs = JSON.parse(JSON.stringify(tqsDatasource));
                if(typeof upTqsDs.evVars == 'object'){
                    upTqsDs.evVars = JSON.stringify(upTqsDs.evVars);
                }
                modifyTqsDs({
                    prodId: that.gConfig.prodId.value,
                    tqsDatasource: upTqsDs,
                }).then(res => {
                    if (res.data.data.success) {
                        that.$message({message: res.data.data.message, type: "success"});
                    }else{
                        that.$message({message: res.data.data.message, type: "error"});
                    }
                });
            },

            // 测试之前
            handleDebugBefore(debugDialog) {
                let that = this;
                this.$confirm('测试前会先保存规则', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    that.handleSave();
                    that.debugResult = '';
                    debugDialog.isShow = true;
                    that.setReq();
                }).catch(() => {
                });
            },

            // 测试决策
            handleDebugAfter(debugDialog) {
                let that = this;
                // 前端缓存测试的字段
                lsSet(that.pDecs.decsId, that.req);
                that.$refs['debugForm'].validate((valid) => {
                    if (valid) {
                        debugDialog.isLoading = true;
                        //此处再次执行保存，是为了更新jsonSchema
                        that.handleSave();
                        testDecs({
                            prodId: this.gConfig.prodId.value,
                            req: JSON.parse(that.req),
                            jsonSchema: JSON.parse(that.jsonSchema),
                            decsId: that.pDecs.decsId
                        }).then(res => {
                            if (res.data.data.success) {
                                // that.debugResult = JSON.stringify(JSON.parse(res.data.data.data), null, 4);
                                that.debugResult = JSON.stringify(res.data.data.data, null, 4);
                                that.$message({type: 'info', message: '测试结果返回'});
                            } else {
                                that.$message({type: 'warning', message: '测试异常'});
                                that.debugResult = res.data.data.message;
                            }
                        }).finally(() => {
                            debugDialog.isLoading = false;
                        })
                    }
                })
            },

            // 决策验证
            handleCheck() {
                let that = this;
                let checkFun = () => {
                    let params = {prodId: this.gConfig.prodId.value, decsId: that.pDecs.decsId};
                    checkDecs(params).then(res => {
                        if (res.data.data['success']) {
                            that.$message({message: "验证成功", type: "success"});
                            getDecsById(params).then(res => {
                                that.pDecs.status = res.data.data.status
                            });
                        } else {
                            this.$alert(res.data.data['result'], '验证结果', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        }
                    })
                };

                that.$confirm('验证前会先保存规则', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    that.handleSave(checkFun);
                }).catch(e => {
                    throw new Error(e)
                });
            },

            //决策发布
            handlePublish() {
                let that = this;
                this.$confirm('确定要发布版本吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'success'
                }).then(({ value }) => {
                    let params = {prodId: this.gConfig.prodId.value, decsId: that.pDecs.decsId};
                    publishDecs(params).then(res => {
                        that.$message({message: res.data.data, type: "success"});
                        // 修改状态
                        getDecsById(params).then(res=>{
                            that.pDecs.status = res.data.data.status
                        });
                    });
                }).catch(() => {
                });
            },

            // 抽屉打开完成初始化抽屉中的数据
            drawerOpenedDecsFlowClick(drawer) {
                let ele = null;
                switch (drawer.type) {
                    case g6Enum.NODE.code:
                        ele = this.$refs[drawer.currItem.nData.compType];
                        if (isEmpty(ele) || isEmpty(ele.init)) {
                            console.error(`flow-edit draw ${drawer.currItem.nData.compType}插槽节点未找到`);
                            return
                        }
                        ele.init();
                        break;
                    case g6Enum.EDGE.code:
                        ele = this.$refs[g6Enum.EDGE.code];
                        if (isEmpty(ele) || isEmpty(ele.init)) {
                            console.error(`flow-edit draw ${drawer.currItem.type}插槽节点未找到`);
                            return
                        }
                        ele.init();
                        break;
                    case g6Enum.COMBO.code:
                        ele = this.$refs[g6Enum.COMBO.code];
                        if (isEmpty(ele) || isEmpty(ele.init)) {
                            console.error(`combo插槽节点未找到`);
                            return
                        }
                        ele.init();
                        break;
                }
            },

            getDecisionTree() {
                return this.$refs.flow.getDecisionTree();
            },
        }
    }
</script>

<style scoped>

</style>
