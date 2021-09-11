<template>
    <div id="decsShow">
        <!--展示决策历史和规则版本里面的信息-->
        <div id="ruleShow">
            <el-form ref="form1" label-width="100px" :inline="true" size="mini" class="table-expand">
                <el-form-item :label="labelEnums.DECS_ID">
                    <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.decsId"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.DECS_NAME">
                    <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.decsName"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.DECS_VERSION">
                    <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.decsVersion"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.DECS_STATUS">
                    <el-input class="input-show-width" :readonly="true"
                              v-model="isNotEmpty(statusEnums[lDecsLocal.status]) ? statusEnums[lDecsLocal.status].name : lDecsLocal.status"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.CREATE_TIME">
                    <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.createTime"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.CREATE_USER">
                    <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.createUser"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.UPDATE_TIME">
                    <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.updateTime"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.UPDATE_USER">
                    <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.updateUser"></el-input>
                </el-form-item>
                <el-form-item :label="labelEnums.SDK_VERSION">
                    <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.sdkVersion"></el-input>
                </el-form-item>
                <el-form-item :label="labelEnums.INTE_TYPE" prop="inteType">
                    <el-input class="input-show-width" :readonly="true"
                              v-model="isNotEmpty(inteTypeEnums[lDecsLocal.inteType]) ? inteTypeEnums[lDecsLocal.inteType].name : lDecsLocal.inteType"></el-input>
                </el-form-item>

                <template v-if="lDecsLocal.inteType === 'H'">
                    <el-form-item label="http地址">
                        <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.inteConf.uri"></el-input>
                    </el-form-item>
                </template>

                <template v-if="lDecsLocal.inteType === 'K'">
                    <el-form-item label="集群地址">
                        <el-input class="input-show-width" :readonly="true"
                                  v-model="lDecsLocal.inteConf.bootstrapServer"></el-input>
                    </el-form-item>
                    <el-form-item label="topic">
                        <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.inteConf.topic"></el-input>
                    </el-form-item>
                    <el-form-item label="groupId">
                        <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.inteConf.groupId"></el-input>
                    </el-form-item>
                    <el-form-item label="userName">
                        <el-input class="input-show-width" :readonly="true"
                                  v-model="lDecsLocal.inteConf.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="password">
                        <el-input class="input-show-width" :readonly="true"
                                  v-model="lDecsLocal.inteConf.password" show-password></el-input>
                    </el-form-item>
                </template>

                <template v-if="lDecsLocal.inteType === 'S'">
                    <el-form-item label="域名">
                        <el-input class="input-show-width" :readonly="true" v-model="lDecsLocal.inteConf.mountUrl"></el-input>
                    </el-form-item>
                </template>

                <el-form-item :label="labelEnums.SEQ_NO" label-width="125px">
                    <span>{{JSON.stringify(lDecsLocal.seqNo)}}</span>
                </el-form-item>
            </el-form>

            <el-form ref="form2" label-width="100px" size="mini" class="table-expand">
                <el-row >
                    <el-col :span="12">
                        <el-form-item :label="labelEnums.ANALYSIS_JSON">
                            <codemirror-show :p-code="lDecsLocal.analysisJson" ref="ajCm"></codemirror-show>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="labelEnums.INPUT_EXAMPLE">
                            <codemirror-show :p-code="lDecsLocal.inputExample" ref="ieCm"></codemirror-show>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="labelEnums.DECS_FLOW">
                    <g6-editor ref="flowShow"
                               :page-id="pageId"
                               @drawerOpened="drawerOpenedDecsFlowClick">
                        <!--节点或者连线抽屉-->
                        <template slot="drawer" slot-scope="data">
                            <template v-if="data.drawer.currItem.type === 'node'">
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
                                           :p-decs="lDecsLocal"></unit-rule>
                                <unit-rule-v2 v-if="data.drawer.currItem.nData.compType === compEnums.URV2.code"
                                              :ref="data.drawer.currItem.nData.compType"
                                              :node="data.drawer.currItem"
                                              :disabled="true"
                                              :rulePageId="rulePageId"
                                              :decisionTree="data.decisionTree"
                                              :p-decs="lDecsLocal"
                                              :unit-rule-input-var-list="unitRuleInputVarList"></unit-rule-v2>
                                <cmpt-edit v-if="data.drawer.currItem.nData.compType === compEnums.Cmpt.code"
                                           :ref="data.drawer.currItem.nData.compType"
                                           :node="data.drawer.currItem"
                                           :decisionTree="data.decisionTree"
                                           :disabled="true"
                                           :p-decs="lDecsLocal"></cmpt-edit>
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
                                              :p-decs="lDecsLocal"></tqs-var-edit>
                                <decs-result v-if="data.drawer.currItem.nData.compType === compEnums.DR.code"
                                             :ref="data.drawer.currItem.nData.compType"
                                             :node="data.drawer.currItem"
                                             :disabled="true"
                                             :decisionTree="data.decisionTree"></decs-result>
                                <object-edit v-if="data.drawer.currItem.nData.compType === compEnums.Obj.code"
                                             :ref="data.drawer.currItem.nData.compType"
                                             :disabled="true"
                                             :decisionTree="data.decisionTree"
                                             :node="data.drawer.currItem"></object-edit>
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
                                                  :p-decs="lDecsLocal"
                                                  :disabled="true"></ext-rule-v2-edit>

                                <comp-var v-if="data.drawer.currItem.nData.compType === compEnums.CompVars.code"
                                          :ref="data.drawer.currItem.nData.compType"
                                          :decisionTree="data.decisionTree"
                                          :node="data.drawer.currItem"
                                          :p-decs="lDecsLocal"
                                          :disabled="true"></comp-var>
                                <score-card v-if="data.drawer.currItem.nData.compType === compEnums.SC.code"
                                            :ref="data.drawer.currItem.nData.compType"
                                            :node="data.drawer.currItem"
                                            :decisionTree="data.decisionTree"
                                            :p-decs="lDecsLocal"
                                            :disabled="true"></score-card>
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
    import DecsCode from "../adapter-info/adapter-info-tab/AdapterCode";
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
    import {DecsBase} from "../../../entity/decs";
    import {getDecsById} from "../../../api/Adapter";

    export default {
        name: "AdapterShow",
        components: {
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
            ConstEdie, DecsResult, VarEdit, CodemirrorShow, EditLine, CmptEdit, UnitRule, DecsCode, ExtRule,CompVar,UnitRuleV2}, // add ExtRule by 074389
        props: {pDecs: Object, pType: {default: "", String}},
        data() {
            return {
                lDecsLocal:new DecsBase(),
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
                    DECS_FLOW : "决策流程图",
                },
                editor: {},
                command: null,
                isDecsFlow:true,
                relVar: {eVarList: [], preVarList: [], roVarList: [], tVarList: []},
            }
        },
        created() {
            this.init();
            this.initData();
        },
        mounted() {
            let that = this;
            if (isNotEmpty(that.lDecsLocal.decsId)) {
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
        },
        methods: {
            // 初始化可以引用的变量
            initVarList() {
                let that = this;
                // 2. 初始化决策事件变量（与规则映射的变量）
                let aj = that.lDecsLocal.analysisJson;
                let ie = that.lDecsLocal.inputExample;

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
                    that.relVar.preVarList = that.lDecsLocal.preHandleReturnList.map(item => new PreVar(item));
                }
                Promise.all(
                    [
                        evVarParse({analysisJson: aj, inputExample: ie}),
                        getDecsRuleList({decsId: that.lDecsLocal.decsId, prodId: this.gConfig.prodId.value}),
                        getRuleListByDecsId({decsId: that.lDecsLocal.decsId, prodId: this.gConfig.prodId.value}),
                    ]
                ).then(res => {
                    // that.setReq();
                    if (that.lDecsLocal.preHandle === 'Y') {
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
                    getDecsById({decsId:that.pDecs.decsId, prodId : that.gConfig.prodId.value}).then(res => {

                        that.lDecsLocal = new DecsBase(res.data.data);

                        // 1. 初始化决策图和决策源码
                        let ruleJson = that.lDecsLocal.ruleJson;
                        let ruleDrl = that.lDecsLocal.ruleDrl;
                        if (isNotEmpty(ruleJson)) {    that.$refs.flowShow.setDecisionTree(JSON.parse(ruleJson));}
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
                        })
                        that.initVarList();
                    });
                } catch (e) {
                    console.error("DecsFlow初始化失败", e)
                }
            },

            refresh(){
                this.$nextTick(() => {
                    if (isNotEmpty(this.$refs.ajCm)) this.$refs.ajCm.refresh();
                    if (isNotEmpty(this.$refs.ieCm)) this.$refs.ieCm.refresh();
                })
            },


            // 控制元素是否显示
            initShow() {
                let that = this;
                let formItemList = [];
                that.noShowItem[tabType.decsTable] = [that.labelEnums.DECS_VERSION];
                that.noShowItem[tabType.decsHis] = [that.labelEnums.UPDATE_USER, that.labelEnums.UPDATE_TIME];
                that.noShowItem[tabType.decsInf] = [that.labelEnums.DECS_FLOW, that.labelEnums.DECS_VERSION];
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
