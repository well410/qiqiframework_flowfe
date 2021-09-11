<template>
    <div>
        <g6-editor ref="flow"
                   :toolsRemoveList="['测试','验证']"
                   @drawerOpened="drawerOpenedDecsFlowClick"
                   @handlePublish="handlePublish"
                   @handleSave="handleSave"
                   :comp-list="componentList">
            <!--节点或者连线抽屉-->
            <template slot="drawer" slot-scope="data">
                <!--节点抽屉-->
                <template v-if="data.drawer.currItem.type === 'node'">
                    <template-node
                               :ref="data.drawer.currItem.nData.compType"
                               :node="data.drawer.currItem"
                               :decisionTree="data.decisionTree"
                               :p-decs="pDecs"
                               :unit-rule-input-var-list="unitRuleInputVarList"></template-node>
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
        testDecs,
        updateDecs
    } from "../../../../api/Decs";
    import {TemplateUpdateDto} from "../../index";
    import {G6Model, GetRel} from "../../../../entity/g6Model";
    import {validateVarSpChar} from "../../../common";
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
    import EvEdit from "../../../../components/evCmpt-node/EvEdit2";
    import CompVar from "../../../../components/comp-vars/CompVars";
    import AviatorScriptEdit from "../../../../components/aviator-script-node/AviatorScriptEdit";
    import DataProcessEdit from "../../../../components/data-process-node/DataProcessEdit";
    import TemplateNode from "../../../../components/template-node/TemplateNode";
    import {getTemplateById, publishTemplate, updateTemplate} from "../../../../api/Template";
    import {TemplateBase} from "../../../../entity/template";
    import ScoreCard from "../../../../components/score-card/ScoreCard";
    import UnitRuleV2 from "../../../../components/rule-node-v2/UnitRuleV2";

    require("script-loader!jsonlint");

    export default {
        name: "TemplateFlowG6",
        props: {pDecs: DecsBase},
        components: {
            DataProcessEdit,
            AviatorScriptEdit,
            EvEdit,
            VarEditV2,
            CompVar,
            EditLine, G6Editor,
            ConstEdie,
            ArrayEdit, ObjectEdit, DecsResult, VarEdit, CodemirrorShow, CmptEdit, UnitRule, ExtRule,ScoreCard,TemplateNode,UnitRuleV2
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
                    // new Component({icon: compEnums.Obj.icon, type: compEnums.Obj.code, name: compEnums.Obj.name}),
                    // new Component({icon: compEnums.Arr.icon, type: compEnums.Arr.code, name: compEnums.Arr.name}),
                    // new Component({icon: compEnums.Const.icon, type: compEnums.Const.code, name: compEnums.Const.name}),
                    // new Component({icon: compEnums.Cmpt.icon, type: compEnums.Cmpt.code, name: compEnums.Cmpt.name}),
                    // new Component({icon: compEnums.ERV2.icon, type: compEnums.ERV2.code, name: compEnums.ERV2.name}),
                    // new Component({icon: compEnums.DR.icon, type: compEnums.DR.code, name: compEnums.DR.name}),
                    // new Component({icon: compEnums.CompVars.icon, type: compEnums.CompVars.code, name: compEnums.CompVars.name}),
                    // new Component({icon: compEnums.SC.icon, type: compEnums.SC.code, name: compEnums.SC.name}),
                    // new Component({icon: compEnums.URV2.icon, type: compEnums.URV2.code, name: compEnums.URV2.name}),
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
            }
        },

        computed: {

            // 元规则输入（可以使用的变量）
            unitRuleInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            }

        },
        mounted() {
        },

        methods: {
            init() {
                try {
                    let that = this;
                    // 1. 初始化决策图
                    let ruleJson = that.pDecs.ruleJson;
                    that.req = JSON.parse(JSON.stringify(this.pDecs)).inputExample;

                    if (isNotEmpty(ruleJson)) {
                        that.$refs.flow.setDecisionTree(JSON.parse(ruleJson));
                    }
                    // 2 初始化变量
                    // that.initVarList();
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

                // 初始化临时变量
                function setTVarList(res) {
                    let ruleList = res[2].data.data;
                    let result = [];
                    if (isNotEmpty(ruleList)) {
                        ruleList.forEach(rule => {
                            result.push(...G6Model.getTmpVarList(JSON.parse(rule.ruleJson)));
                        })
                    }
                    that.relVar.tVarList = result;
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
                    setTVarList(res);

                })
            },

            setReq() {
                if (isNotEmpty(lsGet(this.pDecs.decsId))) {
                    this.req = lsGet(this.pDecs.decsId)
                }
            },

            // 保存决策
            handleSave(callBack) {
                let that = this;
                let decs = new DecsBase(JSON.parse(JSON.stringify(that.pDecs)));
                // 将json对象转换为字符串
                decs.ruleJson = JSON.stringify(that.getDecisionTree());
                decs.ruleDrl = G6Model.getDrlCode(that.getDecisionTree(), that.pDecs);
                let templateBase = new TemplateBase(decs);
                updateTemplate({
                    prodId: that.gConfig.prodId.value,
                    templateId: decs.decsId,
                    templateBase: templateBase
                }).then(res => {
                    that.$message({message: "保存成功", type: "success"});
                    Object.assign(that.pDecs, res.data.data);
                    that.initVarList();
                    if (callBack !== undefined) callBack();
                });
            },


            //决策发布
            handlePublish() {
                let that = this;
                if (that.pDecs.status==='2'){
                    that.$message({message: "请勿重复上线", type: "warnning"});
                    return
                }
                this.$confirm('确定要发布版本吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'success'
                }).then(({ value }) => {
                    let params = {prodId: this.gConfig.prodId.value, templateId: that.pDecs.decsId};
                    publishTemplate(params).then(res => {
                        that.$message({message: res.data.data, type: "success"});
                        // 修改状态
                        getTemplateById(params).then(res=>{
                            Object.assign(that.pDecs, res.data.data);
                        });
                    });
                }).catch(() => {
                });
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
        }
    }
</script>

<style scoped>

</style>
