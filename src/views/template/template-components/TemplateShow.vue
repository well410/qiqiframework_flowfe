<template>
    <div id="decsShow">
        <!--展示模板历史和规则版本里面的信息-->
        <div id="ruleShow">
            <el-form ref="form1" label-width="100px" :inline="true" size="mini" class="table-expand">
                <el-form-item :label="labelEnums.TEMPLATE_ID">
                    <el-input class="input-show-width" :readonly="true" v-model="pDecs.templateId"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.TEMPLATE_NAME">
                    <el-input class="input-show-width" :readonly="true" v-model="pDecs.templateName"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.TEMPLATE_VERSION">
                    <el-input class="input-show-width" :readonly="true" v-model="pDecs.templateVersion"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.TEMPLATE_STATUS">
                    <el-input class="input-show-width" :readonly="true"
                              v-model="isNotEmpty(statusEnums[pDecs.status]) ? statusEnums[pDecs.status].name : pDecs.status"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.CREATE_TIME">
                    <el-input class="input-show-width" :readonly="true" v-model="pDecs.createTime"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.CREATE_USER">
                    <el-input class="input-show-width" :readonly="true" v-model="pDecs.createUser"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.UPDATE_TIME">
                    <el-input class="input-show-width" :readonly="true" v-model="pDecs.updateTime"></el-input>
                </el-form-item>

                <el-form-item :label="labelEnums.UPDATE_USER">
                    <el-input class="input-show-width" :readonly="true" v-model="pDecs.updateUser"></el-input>
                </el-form-item>
            </el-form>

            <el-form ref="form2" label-width="100px" size="mini" class="table-expand">


                <el-form-item :label="labelEnums.TEMPLATE_FLOW">
                    <g6-editor ref="flowShow"
                               :page-id="pageId"
                               @drawerOpened="drawerOpenedDecsFlowClick">
                        <!--节点或者连线抽屉-->
                        <template slot="drawer" slot-scope="data">
                            <template v-if="data.drawer.currItem.type === 'node'">
                                <template-node
                                        :ref="data.drawer.currItem.nData.compType"
                                        :node="data.drawer.currItem"
                                        :decisionTree="data.decisionTree"
                                        :p-decs="pDecs"
                                        :unit-rule-input-var-list="unitRuleInputVarList"></template-node>
                            </template>
                            <template v-else>
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

                <el-form-item label="模板源码" v-if="false">
                    <decs-code ref="decsCode"></decs-code>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    import {isEmpty, isNotEmpty} from "../../../utils";
    import DecsCode from "../template-info/template-info-tab/TemplateCode";
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
    import TemplateNode from "../../../components/template-node/TemplateNode";

    export default {
        name: "TemplateShow",
        components: {
            AviatorScriptEdit,
            EvEdit,
            VarEditV2,
            G6Editor,
            ObjectEdit,
            ArrayEdit,
            ConstEdie, DecsResult, VarEdit, CodemirrorShow, EditLine, CmptEdit, UnitRule, DecsCode, ExtRule,CompVar,TemplateNode}, // add ExtRule by 074389
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
                labelEnums:{
                    TEMPLATE_ID : "模板id",
                    TEMPLATE_NAME : "模板名",
                    TEMPLATE_VERSION : "模板版本",
                    TEMPLATE_STATUS : "模板状态",
                    CREATE_TIME : "创建时间",
                    CREATE_USER : "创建人",
                    UPDATE_TIME : "修改时间",
                    UPDATE_USER : "修改人",
                    SDK_VERSION : "SDK版本",
                    INTE_TYPE:"接入类型",
                    SEQ_NO : "主键seqNo",
                    ANALYSIS_JSON : "解析报文格式",
                    INPUT_EXAMPLE : "输入报文示例",
                    TEMPLATE_FLOW : "模板流程图",
                },
                relVar: {eVarList: [], preVarList: [], roVarList: [], tVarList: []},
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
            let that = this;
            if (isNotEmpty(that.pDecs.templateId)) {
                that.init();
            }
        },
        methods: {
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
                    // 1. 初始化模板图和模板源码
                    let ruleJson = that.pDecs.ruleJson;
                    if (isNotEmpty(ruleJson)) {
                        that.$nextTick(()=>{
                            that.$refs.flowShow.setDecisionTree(JSON.parse(ruleJson));
                            that.$refs.flowShow.setGraphMode("show");
                        })
                    }

                    // 3. 判断元素是否显示
                    that.$nextTick(() => {
                        that.initShow();
                        isNotEmpty(that.$refs.ajCm) && that.$refs.ajCm.refresh();
                        isNotEmpty(that.$refs.ieCm) && that.$refs.ieCm.refresh();
                    })
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
                that.noShowItem[tabType.decsTable] = [that.labelEnums.TEMPLATE_VERSION];
                that.noShowItem[tabType.decsHis] = [that.labelEnums.UPDATE_USER, that.labelEnums.UPDATE_TIME];
                that.noShowItem[tabType.decsInf] = [that.labelEnums.TEMPLATE_FLOW, that.labelEnums.TEMPLATE_VERSION];
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
