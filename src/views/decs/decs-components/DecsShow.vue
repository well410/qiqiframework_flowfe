<template>
    <div id="decsShow">
        <!--展示决策历史和规则版本里面的信息-->
        <div id="ruleShow">
            <el-form ref="form1" label-width="100px" :inline="true" size="mini" class="table-expand">
                <el-form-item :label="labelEnums.DECS_ID">
                    <el-input class="input-show-width" :readonly="true" :title="pDecs.decsId" v-model="pDecs.decsId"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.DECS_NAME">
                    <el-input class="input-show-width" :readonly="true" :title="pDecs.decsName" v-model="pDecs.decsName"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.DECS_VERSION">
                    <el-input class="input-show-width" :readonly="true" :title="pDecs.decsVersion" v-model="pDecs.decsVersion"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.DECS_STATUS">
                    <el-input class="input-show-width" :readonly="true"
                              :title="isNotEmpty(statusEnums[pDecs.status]) ? statusEnums[pDecs.status].name : pDecs.status"
                              v-model="isNotEmpty(statusEnums[pDecs.status]) ? statusEnums[pDecs.status].name : pDecs.status"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.CREATE_TIME">
                    <el-input class="input-show-width" :readonly="true" :title="pDecs.createTime" v-model="pDecs.createTime"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.CREATE_USER">
                    <el-input class="input-show-width" :readonly="true" :title="pDecs.createUser" v-model="pDecs.createUser"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.UPDATE_TIME">
                    <el-input class="input-show-width" :readonly="true" :title="pDecs.updateTime" v-model="pDecs.updateTime"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.UPDATE_USER">
                    <el-input class="input-show-width" :readonly="true" :title="pDecs.updateUser" v-model="pDecs.updateUser"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.SDK_VERSION">
                    <el-input class="input-show-width" :readonly="true" :title="pDecs.sdkVersion" v-model="pDecs.sdkVersion"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.INTE_TYPE" prop="inteType">
                    <el-input class="input-show-width" :readonly="true"
                              :title="isNotEmpty(inteTypeEnums[pDecs.inteType]) ? inteTypeEnums[pDecs.inteType].name : pDecs.inteType"
                              v-model="isNotEmpty(inteTypeEnums[pDecs.inteType]) ? inteTypeEnums[pDecs.inteType].name : pDecs.inteType"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.DECS_RESULT_CONFIG">
                    <el-input class="input-show-width" :readonly="true" :title="pDecs.resultConfig" v-model="pDecs.resultConfig"></el-input>
                </el-form-item>

                <template v-if="pDecs.inteType === 'H'">
                    <el-form-item :label="labelEnums.HTTP_URL">
                        <el-input class="input-show-width" :readonly="true" :title="pDecs.inteConf.uri" v-model="pDecs.inteConf.uri"></el-input>
                    </el-form-item>
                </template>

                <template v-if="pDecs.inteType === 'K'">
                    <el-form-item :label="labelEnums.KAFKA_SERVERS">
                        <el-input class="input-show-width" :readonly="true"
                                  :title="pDecs.inteConf.bootstrapServer"
                                  v-model="pDecs.inteConf.bootstrapServer"></el-input>
                    </el-form-item>
                    <el-form-item :label="labelEnums.KAFKA_TOPIC">
                        <el-input class="input-show-width" :readonly="true" :title="pDecs.inteConf.topic" v-model="pDecs.inteConf.topic"></el-input>
                    </el-form-item>
                    <el-form-item :label="labelEnums.KAFKA_GROUP_ID">
                        <el-input class="input-show-width" :readonly="true" :title="pDecs.inteConf.groupId" v-model="pDecs.inteConf.groupId"></el-input>
                    </el-form-item>
                    <el-form-item :label="labelEnums.KAFKA_USERNAME">
                        <el-input class="input-show-width" :readonly="true"
                                  :title="pDecs.inteConf.userName"
                                  v-model="pDecs.inteConf.userName"></el-input>
                    </el-form-item>
                    <el-form-item :label="labelEnums.KAFKA_PASSWORD">
                        <el-input class="input-show-width" :readonly="true"
                                  :title="pDecs.inteConf.password"
                                  v-model="pDecs.inteConf.password" show-password></el-input>
                    </el-form-item>
                </template>

                <template v-if="pDecs.inteType === 'S'">
                    <el-form-item label="域名">
                        <el-input class="input-show-width" :readonly="true" :title="pDecs.inteConf.mountUrl" v-model="pDecs.inteConf.mountUrl"></el-input>
                    </el-form-item>
                </template>

                <el-form-item :label="labelEnums.SEQ_NO" label-width="125px">
                    <span>{{JSON.stringify(pDecs.seqNo)}}</span>
                </el-form-item>
            </el-form>

            <el-form ref="form2" label-width="100px" size="mini" class="table-expand">
                <el-form-item :label="labelEnums.ANALYSIS_JSON">
                    <codemirror-show :p-code="pDecs.analysisJson" ref="ajCm"></codemirror-show>
                </el-form-item>
                <el-form-item :label="labelEnums.INPUT_EXAMPLE">
                    <codemirror-show :p-code="pDecs.inputExample" ref="ieCm"></codemirror-show>
                </el-form-item>
                <el-form-item :label="labelEnums.JSON_SCHEMA">
                    <codemirror-show :p-code="pDecs.jsonSchema" ref="jsonScm"></codemirror-show>
                </el-form-item>


                <el-form-item :label="labelEnums.DECS_FLOW">
                    <g6-editor ref="flowShow"
                               :page-id="pageId"
                               @drawerOpened="drawerOpenedDecsFlowClick">
                        <!--节点或者连线抽屉-->
                        <template slot="drawer" slot-scope="data">
                            <template v-if="data.drawer.currItem.type === 'node'">
                                <filter-edit v-if="data.drawer.currItem.nData.compType === compEnums.FILTER.code"
                                             :decisionTree="data.decisionTree"
                                             :ref="data.drawer.currItem.nData.compType"
                                             :node="data.drawer.currItem"
                                             :disabled="true"></filter-edit>
                                <!--规则循环节点-->
                                <e-r-v-loop-edit v-if="data.drawer.currItem.nData.compType === compEnums.ER_LOOP.code"
                                                 :ref="data.drawer.currItem.nData.compType"
                                                 :decisionTree="data.decisionTree"
                                                 :node="data.drawer.currItem"
                                                 :disabled="true"
                                                 :p-decs="pDecs"></e-r-v-loop-edit>
                                <rate-ctrl v-if="data.drawer.currItem.nData.compType === compEnums.RATE_CTRL.code"
                                           :ref="data.drawer.currItem.nData.compType"
                                           :disabled="true"
                                           :node="data.drawer.currItem"
                                           :decisionTree="data.decisionTree"></rate-ctrl>
                                <data-process-edit v-if="data.drawer.currItem.nData.compType === compEnums.DATA_PROCESS.code"
                                                   :ref="data.drawer.currItem.nData.compType"
                                                   :node="data.drawer.currItem"
                                                   :disabled="true"
                                                   :decisionTree="data.decisionTree"></data-process-edit>
                                <aviator-script-edit v-if="data.drawer.currItem.nData.compType === compEnums.AVIATOR_SCRIPT.code"
                                                     :ref="data.drawer.currItem.nData.compType"
                                                     :node="data.drawer.currItem"
                                                     :disabled="true"
                                                     :decisionTree="data.decisionTree"></aviator-script-edit>
                                <unit-rule v-if="data.drawer.currItem.nData.compType === compEnums.UR.code"
                                           :ref="data.drawer.currItem.nData.compType"
                                           :node="data.drawer.currItem"
                                           :disabled="true"
                                           :decisionTree="data.decisionTree"
                                           :p-decs="pDecs"></unit-rule>
                                <unit-rule-v2 v-if="data.drawer.currItem.nData.compType === compEnums.URV2.code"
                                              :ref="data.drawer.currItem.nData.compType"
                                              :node="data.drawer.currItem"
                                              :disabled="true"
                                              :rulePageId="rulePageId"
                                              :decisionTree="data.decisionTree"
                                              :p-decs="pDecs"
                                              :unit-rule-input-var-list="unitRuleInputVarList"></unit-rule-v2>
                                <cmpt-edit v-if="data.drawer.currItem.nData.compType === compEnums.Cmpt.code"
                                           :ref="data.drawer.currItem.nData.compType"
                                           :node="data.drawer.currItem"
                                           :decisionTree="data.decisionTree"
                                           :disabled="true"
                                           :p-decs="pDecs"></cmpt-edit>
                                <var-edit-v2 v-if="data.drawer.currItem.nData.compType === compEnums.VarsV2.code"
                                             :ref="data.drawer.currItem.nData.compType"
                                             :node="data.drawer.currItem"
                                             :disabled="true"
                                             :decisionTree="data.decisionTree"></var-edit-v2>
                                <tqs-var-edit v-if="data.drawer.currItem.nData.compType === compEnums.TqsVars.code"
                                              :ref="data.drawer.currItem.nData.compType"
                                              :node="data.drawer.currItem"
                                              :disabled="true"
                                              :decisionTree="data.decisionTree"
                                              :p-decs="pDecs"></tqs-var-edit>
                                <decs-result v-if="data.drawer.currItem.nData.compType === compEnums.DR.code"
                                             :ref="data.drawer.currItem.nData.compType"
                                             :node="data.drawer.currItem"
                                             :disabled="true"
                                             :decisionTree="data.decisionTree"
                                             :dr-input-var-list="drInputVarList"></decs-result>
                                <object-edit v-if="data.drawer.currItem.nData.compType === compEnums.Obj.code"
                                             :ref="data.drawer.currItem.nData.compType"
                                             :disabled="true"
                                             :decisionTree="data.decisionTree"
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
                                            :disabled="true"
                                            :node="data.drawer.currItem"></const-edie>
                                <ev-edit v-if="data.drawer.currItem.nData.compType === compEnums.EVStore.code"
                                         :ref="data.drawer.currItem.nData.compType"
                                         :decisionTree="data.decisionTree"
                                         :disabled="true"
                                         :node="data.drawer.currItem"></ev-edit>

                                <ext-rule-v2-edit v-if="data.drawer.currItem.nData.compType === compEnums.ERV2.code"
                                                  :ref="data.drawer.currItem.nData.compType"
                                                  :decisionTree="data.decisionTree"
                                                  :node="data.drawer.currItem"
                                                  :p-decs="pDecs"
                                                  :disabled="true"></ext-rule-v2-edit>

                                <comp-var v-if="data.drawer.currItem.nData.compType === compEnums.CompVars.code"
                                          :ref="data.drawer.currItem.nData.compType"
                                          :decisionTree="data.decisionTree"
                                          :node="data.drawer.currItem"
                                          :p-decs="pDecs"
                                          :disabled="true"></comp-var>
                                 <score-card v-if="data.drawer.currItem.nData.compType === compEnums.SC.code"
                                            :ref="data.drawer.currItem.nData.compType"
                                            :node="data.drawer.currItem"
                                            :decisionTree="data.decisionTree"
                                            :p-decs="pDecs"
                                            :disabled="true"></score-card>
                                <!--决策表节点-->
                                <decs-table v-if="data.drawer.currItem.nData.compType === compEnums.DT.code"
                                            :ref="data.drawer.currItem.nData.compType"
                                            :node="data.drawer.currItem"
                                            :decisionTree="data.decisionTree"
                                            :p-decs="pDecs"
                                            :disabled="true"></decs-table>
                            </template>
                            <template v-else-if="data.drawer.currItem.eData">
                                <!--连线-->
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

                <el-form-item label="决策源码" v-if="false">
                    <decs-code ref="decsCode"></decs-code>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    import {isEmpty, isNotEmpty} from "../../../utils";
    import DecsCode from "../decs-info/decs-info-tab/DecsCode";
    import UnitRule from "../../../components/rule-node/UnitRule";
    import ExtRule from "../../../components/ext-rule-node/v1/ExtRule"; //add by 074389
    import CmptEdit from "../../../components/cmpt-node/CmptEdit";
    import EditLine from "../../../components/line/editLine";
    import CodemirrorShow from "../../../components/codemirror/CodemirrorShow";
    import {compEnums, inteTypeEnums, statusEnums, tabType} from "../../../entity/enumns";
    import VarEdit from "../../../components/vars-node/v1/VarEdit";
    import DecsResult from "../../../components/result-node/DecsResult";
    import ConstEdie from "../../../components/const-node/ConstEdie";
    import ArrayEdit from "../../../components/array-node/ArrayEdit";
    import ObjectEdit from "../../../components/object-node/ObjectEdit";
    import G6Editor from "../../../components/g6-editor/g6-editor";
    import {getUUID} from "../../../components";
    import {g6Enum} from "../../../components/g6-editor/entity/entity";
    import VarEditV2 from "../../../components/vars-node/v2/VarEditV2";
    import EvEdit from "../../../components/evCmpt-node/EvEdit2";
    import CompVar from "../../../components/comp-vars/CompVars";
    import AviatorScriptEdit from "../../../components/aviator-script-node/AviatorScriptEdit";
    import ScoreCard from "../../../components/score-card/ScoreCard";
    import UnitRuleV2 from "../../../components/rule-node-v2/UnitRuleV2";
    import Editor from "../../../components/g6-editor/Base/Editor";
    import command from "../../../components/g6-editor/command";
    import TqsVarEdit from "../../../components/tqs-vars-node/TqsVarEdit";
    import ExtRuleV2Edit from "../../../components/ext-rule-node/v2/ExtRuleV2Edit";
    import DataProcessEdit from "../../../components/data-process-node/DataProcessEdit";
    import {EVar, PreVar, ROVar} from "../../../entity/vars";
    import {evVarParse} from "../../../api/Utils";
    import {getDecsRuleList, getRuleListByDecsId} from "../../../api/Decs";
    import DecsResultConfig from "./DecsResultConfig";
    import RateCtrl from "../../../components/rateCtrl-node/RateCtrl";
    import ERVLoopEdit from "../../../components/er-loop-node/ERLoopEdit";
    import FilterEdit from "../../../components/filter-node/FilterEdit";
    import DecsTable from "../../../components/decs-table/DecsTable";

    export default {
        name: "DecsShow",
        components: {
            FilterEdit,
            ERVLoopEdit,
            RateCtrl,
            DecsResultConfig,
            DataProcessEdit,
            ExtRuleV2Edit,
            ScoreCard,
            AviatorScriptEdit,
            EvEdit,
            TqsVarEdit,
            VarEditV2,
            G6Editor,
            ObjectEdit,
            ArrayEdit,
            ConstEdie, DecsResult, VarEdit, CodemirrorShow, EditLine, CmptEdit, UnitRule, DecsCode, ExtRule,CompVar,UnitRuleV2, DecsTable}, // add ExtRule by 074389
        props: {pDecs: Object, pType: {default: "", String}},
        data() {
            return {
                decs: {},
                tabType: tabType,
                compEnums: compEnums,
                statusEnums: statusEnums,
                isNotEmpty: isNotEmpty,
                inteTypeEnums: inteTypeEnums,
                noShowItem: {},
                pageId:getUUID(),
                rulePageId:getUUID(),
                labelEnums:{
                    DECS_ID : "决策id",
                    DECS_NAME : "决策名",
                    DECS_VERSION : "决策版本",
                    DECS_STATUS : "决策状态",
                    CREATE_TIME : "创建时间",
                    CREATE_USER : "创建人",
                    UPDATE_TIME : "修改时间",
                    UPDATE_USER : "修改人",
                    SDK_VERSION : "SDK版本",
                    INTE_TYPE:"接入类型",
                    SEQ_NO : "主键seqNo",
                    ANALYSIS_JSON : "解析报文格式",
                    INPUT_EXAMPLE : "输入报文示例",
                    JSON_SCHEMA : "输入校验配置",
                    DECS_FLOW : "决策流程图",
                    DECS_RESULT_CONFIG : "决策返回结果",
                    HTTP_URL :"http地址",
                    KAFKA_SERVERS :"集群地址",
                    KAFKA_TOPIC :"topic",
                    KAFKA_GROUP_ID :"groupId",
                    KAFKA_USERNAME :"userName",
                    KAFKA_PASSWORD :"password",

                },
                editor: {},
                command: null,
                isDecsFlow:true,
                relVar: {eVarList: [], preVarList: [], roVarList: [], tVarList: []},
            }
        },
        created() {

            this.initData();
        },
        mounted() {
            let that = this;
            if (isNotEmpty(that.pDecs.decsId)) {
                that.init();
            }
        },
        computed:{
            // 元规则输入（可以使用的变量）
            unitRuleInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },
            drInputVarList() {
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
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
                    // that.setReq();
                    if (that.pDecs.preHandle === 'Y') {
                        setPreVarList();
                    }

                    setEVarList(res);
                    setROVarList(res);
                })
            },
            initData() {
                // console.log("initEditor");
                this.editor = new Editor();
                this.command = new command(this.editor);
                this.isDecsFlow =  true;
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

            init() {
                try {
                    let that = this;
                    // 1. 初始化决策图和决策源码
                    let ruleJson = that.pDecs.ruleJson;
                    let ruleDrl = that.pDecs.ruleDrl;
                    if (isNotEmpty(ruleJson)) {
                        that.$nextTick(()=>{
                            that.$refs.flowShow.setDecisionTree(JSON.parse(ruleJson));
                            that.$refs.decsCode && that.$refs.decsCode.setDrlCode(ruleDrl);
                            that.$refs.flowShow.setGraphMode("show");
                        })
                    }

                    // 3. 判断元素是否显示
                    that.$nextTick(() => {
                        that.initShow();
                        isNotEmpty(that.$refs.ajCm) && that.$refs.ajCm.refresh();
                        isNotEmpty(that.$refs.ieCm) && that.$refs.ieCm.refresh();
                        isNotEmpty(that.$refs.jsonScm) && that.$refs.jsonScm.refresh();
                    })
                    that.initVarList();
                } catch (e) {
                    console.error("DecsFlow初始化失败", e)
                }
            },

            refresh(){
                this.$nextTick(() => {
                    if (isNotEmpty(this.$refs.ajCm)) this.$refs.ajCm.refresh();
                    if (isNotEmpty(this.$refs.ieCm)) this.$refs.ieCm.refresh();
                    if (isNotEmpty(this.$refs.jsonScm)) this.$refs.jsonScm.refresh();
                })
            },


            // 控制元素是否显示
            initShow() {
                let that = this;
                let formItemList = [];
                that.noShowItem[tabType.decsTable] = [that.labelEnums.DECS_VERSION, that.labelEnums.DECS_RESULT_CONFIG];
                that.noShowItem[tabType.decsHis] = [that.labelEnums.UPDATE_USER, that.labelEnums.UPDATE_TIME, that.labelEnums.DECS_RESULT_CONFIG];
                that.noShowItem[tabType.decsInf] = [that.labelEnums.DECS_FLOW, that.labelEnums.DECS_VERSION, that.labelEnums.DECS_RESULT_CONFIG];
                that.noShowItem[tabType.decsCitation] = [
                    that.labelEnums.DECS_ID,
                    that.labelEnums.DECS_NAME,
                    that.labelEnums.DECS_VERSION,
                    that.labelEnums.DECS_STATUS,
                    that.labelEnums.CREATE_TIME,
                    that.labelEnums.CREATE_USER,
                    that.labelEnums.UPDATE_TIME,
                    that.labelEnums.UPDATE_USER,
                    that.labelEnums.SDK_VERSION,
                    that.labelEnums.INTE_TYPE,
                    that.labelEnums.SEQ_NO,
                    that.labelEnums.ANALYSIS_JSON,
                    that.labelEnums.INPUT_EXAMPLE,
                    that.labelEnums.DECS_RESULT_CONFIG,
                    that.labelEnums.HTTP_URL,
                    that.labelEnums.KAFKA_SERVERS,
                    that.labelEnums.KAFKA_TOPIC,
                    that.labelEnums.KAFKA_GROUP_ID,
                    that.labelEnums.KAFKA_USERNAME,
                    that.labelEnums.KAFKA_PASSWORD,
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
            }
        }
    }
</script>

<style scoped>
    .input-show-width >>> input {
        width: 256px;
    }
</style>
