<template>
    <!--展示规则历史和规则版本里面的信息-->
    <div id="ruleShow">
        <el-form ref="form1" label-width="100px" :inline="true" size="mini" class="table-expand">
            <el-form-item :label="labelEnums.RULE_ID">
                <el-input class="input-show-width" :readonly="true" v-model="pRule.ruleId"></el-input>
            </el-form-item>

            <el-form-item :label="labelEnums.RULE_NAME">
                <el-input class="input-show-width" :readonly="true" v-model="pRule.ruleName"></el-input>
            </el-form-item>

            <el-form-item :label="labelEnums.RULE_VERSION">
                <el-input class="input-show-width" :readonly="true" v-model="pRule.ruleVersion"></el-input>
            </el-form-item>

            <el-form-item :label="labelEnums.RULE_STATUS">
                <el-input class="input-show-width" :readonly="true"
                          v-model="isNotEmpty(statusEnums[pRule.status]) ? statusEnums[pRule.status].name : pRule.status"></el-input>
            </el-form-item>

            <el-form-item :label="labelEnums.CREATE_TIME">
                <el-input class="input-show-width" :readonly="true" v-model="pRule.createTime"></el-input>
            </el-form-item>

            <el-form-item :label="labelEnums.CREATE_USER">
                <el-input class="input-show-width" :readonly="true" v-model="pRule.createUser"></el-input>
            </el-form-item>

            <el-form-item :label="labelEnums.UPDATE_TIME">
                <el-input class="input-show-width" :readonly="true" v-model="pRule.updateTime"></el-input>
            </el-form-item>

            <el-form-item :label="labelEnums.UPDATE_USER">
                <el-input class="input-show-width" :readonly="true" v-model="pRule.updateUser"></el-input>
            </el-form-item>
        </el-form>

        <el-form ref="form2" label-width="100px" size="mini" class="table-expand">
            <el-form-item :label="labelEnums.ANALYSIS_JSON">
                <codemirror-show :p-code="pRule.analysisJson" ref="ajCm"></codemirror-show>
            </el-form-item>
            <el-form-item :label="labelEnums.INPUT_EXAMPLE">
                <codemirror-show :p-code="pRule.inputExample" ref="ieCm"></codemirror-show>
            </el-form-item>

            <el-form-item :label="labelEnums.RULE_FLOW">
                <g6-editor ref="flowShow"
                           :page-id="pageId"
                           @drawerOpened="drawerOpenedRuleFlowClick">
                    <!--节点或者连线抽屉-->
                    <template slot="drawer" slot-scope="data">
                        <!--节点抽屉-->
                        <template v-if="data.drawer.currItem.type === 'node'">
                            <filter-edit
                                    v-if="data.drawer.currItem.nData.compType === compEnums.FILTER.code"
                                    :ref="data.drawer.currItem.nData.compType"
                                    :decisionTree="data.decisionTree"
                                    :node="data.drawer.currItem"
                                    :disabled="true"
                                    :p-rule="pRule"
                            ></filter-edit>
                            <!--规则循环节点-->
                            <e-r-v-loop-edit v-if="data.drawer.currItem.nData.compType === compEnums.ER_LOOP.code"
                                             :ref="data.drawer.currItem.nData.compType"
                                             :decisionTree="data.decisionTree"
                                             :node="data.drawer.currItem"
                                             :disabled="true"
                                             :p-rule="pRule"
                            ></e-r-v-loop-edit>
                            <ext-rule-v2-edit v-if="data.drawer.currItem.nData.compType === compEnums.ERV2.code"
                                              :ref="data.drawer.currItem.nData.compType"
                                              :decisionTree="data.decisionTree"
                                              :node="data.drawer.currItem"
                                              :p-rule="pRule"
                                              :disabled="true"></ext-rule-v2-edit>
                            <data-process-edit v-if="data.drawer.currItem.nData.compType === compEnums.DATA_PROCESS.code"
                                               :ref="data.drawer.currItem.nData.compType"
                                               :node="data.drawer.currItem"
                                               :disabled="true"
                                               :decisionTree="data.decisionTree"></data-process-edit>
                            <aviator-script-edit v-if="data.drawer.currItem.nData.compType === compEnums.AVIATOR_SCRIPT.code"
                                                 :ref="data.drawer.currItem.nData.compType"
                                                 :node="data.drawer.currItem"
                                                 :decisionTree="data.decisionTree"
                                                 :disabled="true"></aviator-script-edit>
                            <unit-rule v-if="data.drawer.currItem.nData.compType === compEnums.UR.code"
                                       :ref="data.drawer.currItem.nData.compType"
                                       :node="data.drawer.currItem"
                                       :decisionTree="data.decisionTree"
                                       :disabled="true"
                                       :p-rule="pRule"></unit-rule>
                            <unit-rule-v2 v-if="data.drawer.currItem.nData.compType === compEnums.URV2.code"
                                          :ref="data.drawer.currItem.nData.compType"
                                          :node="data.drawer.currItem"
                                          :disabled="true"
                                          :rulePageId="rulePageId"
                                          :decisionTree="data.decisionTree"
                                          :p-rule="pRule"
                                          :unit-rule-input-var-list="unitRuleInputVarList"></unit-rule-v2>
                            <!--todo 2021/5/21 这里去掉了变量平台节点，为了保证以前的也能展示，因此这里先不删除，后面如果规则中没有使用这个节点，自己按需删除-->
                            <var-edit-v2 v-if="data.drawer.currItem.nData.compType === compEnums.VarsV2.code"
                                         :ref="data.drawer.currItem.nData.compType"
                                         :node="data.drawer.currItem"
                                         :disabled="true"
                                         :decisionTree="data.decisionTree"></var-edit-v2>
                            <object-edit v-if="data.drawer.currItem.nData.compType === compEnums.Obj.code"
                                         :ref="data.drawer.currItem.nData.compType"
                                         :disabled="true"
                                         :node="data.drawer.currItem"
                                         :obj-input-var-list="objInputVarList"></object-edit>
                            <array-edit v-if="data.drawer.currItem.nData.compType === compEnums.Arr.code"
                                        :ref="data.drawer.currItem.nData.compType"
                                        :node="data.drawer.currItem"
                                        :disabled="true"
                                        :decisionTree="data.decisionTree"></array-edit>
                            <const-edie v-if="data.drawer.currItem.nData.compType === compEnums.Const.code"
                                        :ref="data.drawer.currItem.nData.compType"
                                        :decisionTree="data.decisionTree"
                                        :node="data.drawer.currItem"></const-edie>
                            <!-- 规则结果节点 074389-->
                            <rule-result v-if="data.drawer.currItem.nData.compType === compEnums.RR.code"
                                        :ref="data.drawer.currItem.nData.compType"
                                        :disabled="true"
                                        :node="data.drawer.currItem"
                                        :decisionTree="data.decisionTree"
                                         :rr-input-var-list="rrInputVarList"
                                        :p-rule="pRule"></rule-result>
                        </template>
                        <!--连线抽屉-->
                        <template v-else-if="data.drawer.currItem.eData">
                            <edit-line
                                    ref="edge"
                                    :disabled="true"
                                    :item="data.drawer.currItem"
                                    :g6Editor="data.drawer.g6Editor"
                                    :decisionTree="data.decisionTree"></edit-line>
                        </template>
                    </template>
                </g6-editor>
            </el-form-item>
            <!--根据要求不让显示-->
            <el-form-item label="规则源码" v-if="false">
                <rule-code ref="ruleCode"></rule-code>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import RuleCode from "../rule-info/rule-info-tab/RuleCode";
    import UnitRule from "../../../components/rule-node/UnitRule";
    import EditLine from "../../../components/line/editLine";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import CodemirrorShow from "../../../components/codemirror/CodemirrorShow";
    import {compEnums, statusEnums, tabType} from "../../../entity/enumns";
    import VarEdit from "../../../components/vars-node/v1/VarEdit";
    import ConstEdie from "../../../components/const-node/ConstEdie";
    import ArrayEdit from "../../../components/array-node/ArrayEdit";
    import ObjectEdit from "../../../components/object-node/ObjectEdit";
    import G6Editor from "../../../components/g6-editor/g6-editor";
    import {g6Enum} from "../../../components/g6-editor/entity/entity";
    import {getUUID} from "../../../components";
    import RuleResult from "../../../components/result-node/RuleResult"
    import VarEditV2 from "../../../components/vars-node/v2/VarEditV2";
    import AviatorScriptEdit from "../../../components/aviator-script-node/AviatorScriptEdit";
    import DataProcessEdit from "../../../components/data-process-node/DataProcessEdit";
    import UnitRuleV2 from "../../../components/rule-node-v2/UnitRuleV2";
    import Editor from "../../../components/g6-editor/Base/Editor";
    import command from "../../../components/g6-editor/command";
    import {RIVar} from "../../../entity/vars";
    import {evVarParse} from "../../../api/Utils";
    import ERVLoopEdit from "../../../components/er-loop-node/ERLoopEdit";
    import FilterEdit from "../../../components/filter-node/FilterEdit";

    export default {
        name: "RuleShow",
        props: {pRule: {default: undefined, type: Object}, pType: {default: "", type: String}},
        data() {
            return {
                statusEnums: statusEnums,
                tabType: tabType,
                compEnums: compEnums,
                noShowItem: {},
                isNotEmpty: isNotEmpty,
                pageId: getUUID(),
                rulePageId: getUUID(),
                labelEnums:{
                    RULE_ID : "规则id",
                    RULE_NAME : "规则名",
                    RULE_VERSION : "规则版本",
                    RULE_STATUS : "规则状态",
                    CREATE_TIME : "创建时间",
                    CREATE_USER : "创建人",
                    UPDATE_TIME : "修改时间",
                    UPDATE_USER : "修改人",
                    INTE_TYPE:"接入类型",
                    SEQ_NO : "主键seqNo",
                    ANALYSIS_JSON : "解析报文格式",
                    INPUT_EXAMPLE : "输入报文示例",
                    RULE_FLOW : "规则流程图",
                },
                editor: {},
                command: null,
                isDecsFlow:true,
                relVar: {riVarList: []},
            }
        },
        created() {
            this.initData();
        },


        components: {
            FilterEdit,
            ERVLoopEdit,
            // 异步构建组件，防止组件循环注册 https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E7%BB%84%E4%BB%B6%E4%B9%8B%E9%97%B4%E7%9A%84%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8
            ExtRuleV2Edit: () => import('../../../components/ext-rule-node/v2/ExtRuleV2Edit.vue'),
            DataProcessEdit,
            AviatorScriptEdit,
            VarEditV2,
            G6Editor,
            ObjectEdit, ArrayEdit, ConstEdie, VarEdit, CodemirrorShow, EditLine, UnitRule, RuleCode, RuleResult,UnitRuleV2},
        mounted() {
            if (this.pRule !== undefined) {
                this.init()
            }
        },
        computed:{
            // 元规则节点可以引用的变量
            unitRuleInputVarList() {
                let result = [];
                result.push(...this.relVar.riVarList);
                return result;
            },
            rrInputVarList(){
                let result = [];
                result.push(...this.relVar.riVarList);
                return result;
            },
            objInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },
        },
        methods: {
            initVarList() {
                let that = this;
                let aj = that.pRule.analysisJson;
                let ie = that.pRule.inputExample;


                // 初始化事件变量（String，Double，Date，Integer，object，array类型）
                function setEVarList(res) {
                    let rivVarList = res[0].data.data
                        .map(item => new RIVar({
                            varName: item.path,
                            varDesc: item.desc,
                            varType: item.type,
                            ruleId: that.pRule.ruleId
                        }));
                    that.relVar.riVarList = rivVarList;
                }

                Promise.all(
                    [
                        evVarParse({analysisJson: aj, inputExample: ie}),
                    ]
                ).then(res => {
                    setEVarList(res);
                })
            },
            initData() {
                // console.log("initEditor");
                this.editor = new Editor();
                this.command = new command(this.editor);
                this.isDecsFlow =  true;
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

            init() {
                try {
                    let that = this;
                    // 1. 初始化规则图和规则源码
                    if (isNotEmpty(that.pRule.ruleJson)) {
                        that.$nextTick(()=>{
                            that.$refs.flowShow.setDecisionTree(JSON.parse(that.pRule.ruleJson));
                            that.$refs.flowShow.setGraphMode("show");
                            that.$refs.ruleCode && that.$refs.ruleCode.setDrlCode(that.pRule.ruleDrl);
                        })
                    }


                    // 2. 判断元素是否显示
                    that.$nextTick(() => {
                        that.initShow();
                        isNotEmpty(that.$refs.ajCm) && that.$refs.ajCm.refresh();
                        isNotEmpty(that.$refs.ieCm) && that.$refs.ieCm.refresh();
                    })
                    that.initVarList();
                } catch (e) {
                    console.error("RuleShow初始化失败", e)
                }
            },

            // 控制元素是否显示
            initShow() {
                let that = this;
                that.$nextTick(()=>{
                    let formItemList = [];
                    that.noShowItem[tabType.ruleTable] = [that.labelEnums.RULE_VERSION];
                    that.noShowItem[tabType.ruleHis] = [that.labelEnums.UPDATE_USER,that.labelEnums.UPDATE_TIME];
                    that.noShowItem[tabType.ruleInf] = [that.labelEnums.RULE_FLOW,that.labelEnums.RULE_VERSION];
                    that.noShowItem[tabType.ruleCitation] = [
                        that.labelEnums.RULE_ID,
                        that.labelEnums.RULE_NAME,
                        that.labelEnums.RULE_VERSION,
                        that.labelEnums.RULE_STATUS,
                        that.labelEnums.CREATE_TIME,
                        that.labelEnums.CREATE_USER,
                        that.labelEnums.UPDATE_TIME,
                        that.labelEnums.UPDATE_USER,
                        that.labelEnums.INTE_TYPE,
                        that.labelEnums.SEQ_NO,
                        that.labelEnums.ANALYSIS_JSON,
                        that.labelEnums.INPUT_EXAMPLE,
                    ];
                    formItemList.push(...that.$refs.form1.$children);
                    formItemList.push(...that.$refs.form2.$children);

                    let noShowList = that.noShowItem[that.pType];
                    formItemList.forEach(formItem => {
                        if (isNotEmpty(noShowList)) {
                            if (noShowList.indexOf(formItem.label) > -1) {
                                formItem.$el.style.display = "none";
                            }
                        }
                    })
                });
            }
        }
    }
</script>

<style scoped>
    .input-show-width >>> input {
        width: 256px;
    }
</style>
