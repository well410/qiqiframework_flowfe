<template>
    <div id="unitRule" ref="unitRuleV2" style="min-height: 100%">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled">
                <template slot="right">
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="mini" style="padding: 0px;border: 0" @click="refreshGraph" title="刷新" v-if="true">
                        <svg-icon icon-class="refresh" style="width: 1.5em;height: 1.5em" ></svg-icon>
                    </el-button>
                    <el-button size="mini" style="padding: 0px;border: 0" @click="handleSave" title="保存|生成代码" :disabled="disabled">
                        <svg-icon icon-class="unit_save" style="width: 1.5em;height: 1.5em" ></svg-icon>
                    </el-button>
                    <el-button size="mini" style="padding: 0px;border: 0" @click="handleShowCode" title="显示代码" v-if="true">
                        <svg-icon icon-class="show_code" style="width: 1.5em;height: 1.5em" ></svg-icon>
                    </el-button>
<!--                    <el-form-item label="操作">-->
<!--                        <el-button size="mini" :disabled="disabled" type="success" @click="addBefore">添加</el-button>-->
<!--                    </el-form-item>-->
                </template>
            </node-inf>
            <unit-rule-code ref="unitRuleCodeShow" v-show="isCodeShow" @changeDrlCode="changeDrlCode"></unit-rule-code>

            <el-card class="node-content-card" :body-style="{padding:0}" v-show="!isCodeShow">
                <unit-rule-page ref="unitRulePage" :node="node" :rulePageId="rulePageId" @G6EditorChange="g6EditorChange" :ugvResultList="ugvResultList" :disabled="disabled"></unit-rule-page>
<!--                <el-divider style="margin: 0;padding: 0"></el-divider>-->
                <rule-node-setting ref="unitRuleSetting"
                                   :p-cd-rel-var-list="cdRelVarList"
                                   :disabled="disabled"
                                   :node-type="nodeType"
                                   :node="drawer.currItem"
                                   :r-node="node"
                                   :g6Editor="g6Editor"
                                   :ugvResultList="ugvResultList"
                                   @changeUgvResultList="changeUgvResultList"
                                   @G6EditorChange="g6EditorChange"
                                   @handleChange="handleSave" >
                </rule-node-setting>

                <div class="common-title">{{`${messageEnums.CONFIG_OF_FIELD.name}(元规则结果)`}}</div>
                <comm-var-inf ref="commVarInf"
                              :p-var="urgVar"
                              :disabled="disabled"
                              :var-name-show="false"
                              :var-type-disable="true"
                              :p-alias-list="cdRelVarList"
                              :p-node="node"></comm-var-inf>
            </el-card>
        </el-scrollbar>
    </div>

</template>
<script>
    import NodeInf from "../common/node-inf";
    import UnitRulePage from "./children/unitRulePage";
    import RuleNodeSetting from "./children/ruleNodeSetting";
    import {isEmpty, isNotEmpty} from "../../utils";
    import {g6Enum} from "../g6-editor/entity/entity";
    import {TVars, URGVar} from "../../entity/vars";
    import {G6Model} from "../../entity/g6Model";
    import UnitRuleCode from "./children/UnitRuleCode";
    import eventBus from "@/utils/eventBus";
    import {dataTypeEnums, messageEnums, varNameTypeEnums} from "../../entity/enumns";
    import resizeForDrawer from "../mixins/resizeForDrawer";
    import CommVarInf from "../common/CommVarInf";
    export default {
        name: "UnitRuleV2",
        components:{CommVarInf, UnitRuleCode, NodeInf,UnitRulePage,RuleNodeSetting},
        mixins:[resizeForDrawer],
        props: {
            decisionTree: Object,
            node: {default: () => {}, type: Object},
            pRule: {default: ()=>{}, type: Object},
            pDecs: {default: ()=>{}, type: Object},
            // 上游传入的变量
            unitRuleInputVarList: {default: ()=>[], type: Array},
            disabled: {default: false, type: Boolean},

            rulePageId: {
                type: String,
                default: "unitRulePageId"
            }
            // 控制是否可以选择变量类型（String，Integer，Float）
        },
        data() {
            return {
                messageEnums: messageEnums,
                isCodeShow: false,
                ruleData: [],
                tmpVarList: [],
                ugvResultList: {},
                cdRelVar: {
                    totalVarList: [],
                },
                nodeType: "",
                drawer: {currItem: {nData: {}}, conn: {}, type: '', title: ''},
                g6Editor: null,
                code: "",
                urgVar: new URGVar(),
            }
        },
        created() {

        },
        computed:{
            cdRelVarList() {
                let result = [];
                let notNullTmpVarList = this.tmpVarList.filter(tmpVar=>isNotEmpty(tmpVar.varName));
                result.push(...notNullTmpVarList);
                result.push(...this.unitRuleInputVarList);
                result.push(...this.cdRelVar.totalVarList);
                return result;
            },
        },
        mounted() {
            this.bindEvents()
        },
        methods:{
            bindEvents() {
                let that = this;
                //单击节点时的事件
                that.$bus.$on(g6Enum.ruleClick.code + this.rulePageId, data => {
                    that.drawer.currItem = data;

                    if(that.drawer.currItem.nData===undefined) {
                        that.drawer.currItem.nData = {}
                    }

                    if (isNotEmpty(that.drawer.currItem.nData.uniqueNodeNum)) {
                        // 结果节点，赋值结果变量
                        if (that.drawer.currItem.nData.uniqueNodeNum.startsWith("UR_RN")) {
                            that.drawer.currItem.nData.urgVar = URGVar.obj2UrgVar(that.drawer.currItem.nData.urgVar);
                        }
                    }

                    that.$nextTick(() => {
                        if(that.$refs.unitRuleSetting!==undefined){
                            that.$refs.unitRuleSetting.init();
                        }

                    });
                });
                eventBus.$on("deleteRusultNode", uniqueNodeNum => {
                    that.ugvResultList = this.node.nData.ugvResultList;
                    that.ugvResultList[uniqueNodeNum] = "";
                });
            },

            init() {
                let that = this;
                isEmpty(that.node.nData.tmpVarList) ? that.tmpVarList = [] : that.tmpVarList = that.node.nData.tmpVarList.map(item => new TVars(item));
                isEmpty(that.node.nData.ugvResultList) ? that.ugvResultList = {} : that.ugvResultList = that.node.nData.ugvResultList;
                isEmpty(that.node.nData.ruleDrl) ? that.ruleDrl = "" : that.ruleDrl = that.node.nData.ruleDrl;
                if (isEmpty(that.node.nData.urgVar)) {
                    that.urgVar = new URGVar({
                        varName: this.node.nData.uniqueName,
                        varType: dataTypeEnums.STRING.code,
                        varNameType: varNameTypeEnums.S.code
                    });
                } else {
                    that.urgVar = URGVar.obj2UrgVar(that.node.nData.urgVar);
                }


                let totalVarList = G6Model.getTotalVarsOfParents(that.node, this.decisionTree);
                that.cdRelVar.totalVarList = totalVarList;

                if(this.node.nData.ruleData===[]||this.node.nData.ruleData===undefined){
                    this.ruleData={
                        id: 'root',
                        label: '上层变量集',
                        value: '上层变量集',
                        type: "root-rect",
                        collapsed:false,
                        nData:{
                            uniqueNodeNum: "UnitRuleRoot",
                            uniqueIdList:[],
                        },


                    }
                    this.node.nData.ruleData = this.ruleData;
                    this.node.nData.ugvResultList = {};
                }
                this.$refs.unitRulePage.init();

                this.$nextTick(() => {
                    that.$refs.commVarInf.setOldPVar(that.urgVar);
                })
                // this.$bus.$emit(g6Enum.RuleDataChange.code + this.rulePageId, this.node.nData.ruleData);
            },
            validateTmpVar(value) {
                try {
                    value.forEach(item => {
                        if (isEmpty(item.varName) && !item.enableAlias()){
                            throw new Error(`临时变量未填写`)
                        }

                        if (isEmpty(item.varAlias) && !item.enableAlias()){
                            throw new Error(`临时变量未填写`)
                        }

                        if (isEmpty(item.func) || isEmpty(item.func.funcId)){
                            throw new Error(`${item.varName}的函数未填写全`);
                        }
                    });
                    this.tmpVarErrorMsg = "";
                } catch (e) {
                    this.tmpVarErrorMsg = e.message;
                }
            },
            //图变化后更新父组件中G6Editor的数据
            g6EditorChange(data) {
                this.g6Editor = data;
            },
            refreshGraph(){
                this.g6Editor.graph.data(this.node.nData.ruleData);
                this.g6Editor.graph.render();
                this.g6Editor.graph.fitView();
            },
            handleSave(){
                let that = this;
                if(!that.isCodeShow){
                    that.$refs.unitRuleCodeShow.initCode(that.g6Editor.graph,that.g6Editor.graph.save(),that.node);
                }
                this.$nextTick(()=>{
                    that.node.nData.ruleDrl = that.code;
                    // Vue.prototype.$message({message: `【元规则-流程式】 规则流程图保存成功`, type: 'success'});
                });

            },
            //控制代码的显示
            handleShowCode(){
                let that = this;
                that.isCodeShow = !that.isCodeShow;
                if(that.isCodeShow){
                    that.$refs.unitRuleCodeShow.initCode(that.g6Editor.graph,that.g6Editor.graph.save(),that.node);
                }
            },
            changeDrlCode(value){
                this.code = value;
                this.handleSave();
            },
            changeUgvResultList(value){
                let that = this;
                that.node.nData.ugvResultList = value;
            }
        },
        watch:{
            ruleData: {
                handler(value) {
                    let that = this;
                    that.node.nData.ruleData = value;
                },
                deep: true
            },
            tmpVarList: {
                handler(value) {
                    let that = this;
                    that.validateTmpVar(value);
                    that.node.nData.tmpVarList = value;
                },
                deep: true
            },
            ugvResultList: {
                handler(value) {
                    let that = this;
                    that.node.nData.ugvResultList = value;
                },
                deep: true
            },

            urgVar: {
                handler(value) {
                    let that = this;
                    that.node.nData.urgVar = value;
                },
                deep: true
            }
        }
    }
</script>
<style scoped>
    #unitRule {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
</style>
