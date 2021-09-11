<template>
    <!--
        元规则节点（中间变量，判断条件，元规则结果组成）
        中间变量：引用函数生成（见VUnitTmpVar.vue）
        判断条件：引用父节点的变量生成true和false的逻辑（见VUnitCondition.vue）
        元规则结果：通过判断条件进行逻辑组合，生成对应的结果（见VUnitResult.vue）
    -->
    <div id="sourceRule" ref="sourceRule" style="min-height: 100%">
        <el-scrollbar style="height: 100%">
            <node-inf :node="node" :disabled="disabled"></node-inf>
            <el-card class="node-content-card">

                <el-collapse v-model="activeNames">
                <!--中间变量-->
                <el-collapse-item name="tmpVars">
                    <template slot="title">
                        <div title="经过事件变量和变量平台中的变量计算而来" style="width: 90px">
                            <span>中间变量</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                        <div style="margin-left: 10px;width: 100%">
                            <el-button :disabled="disabled" icon="el-icon-plus" size="mini" @click.stop="tmpVarAddBeforeClick" class="node-set-button">添加</el-button>
                            <span style="margin-left: 20px;color: red">{{computeTVarError}}</span>
                        </div>
                    </template>
                    <v-unit-tmp-var :p-tmp-var-list="tmpVarList"
                                    :p-fun-ref-var-list="funRefVarList"
                                    :p-rule="pRule"
                                    :p-decs="pDecs"
                                    :node="node"
                                    :decision-tree="decisionTree"
                                    :disabled="disabled"
                                    ref="vUnitTmpVar"
                                    @deleteClick="tmpVarDeleteClick"></v-unit-tmp-var>
                </el-collapse-item>

                <!--判断条件-->
                <el-collapse-item name="condition">
                    <template slot="title">
                        <div title="每个变量和对照值进行对比，计算出逻辑True和False" style="width: 90px">
                            <span>判断条件</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                        <div class="tools" style="width: 100%">
                            <el-button :disabled="disabled" icon="el-icon-plus" size="mini" @click.stop="cdAddBeforeClick" class="node-set-button">添加</el-button>
                            <span style="margin-left: 20px;color: red">{{cdErrorMsg}}</span>
                        </div>
                    </template>
                    <v-unit-condition :p-cd-list="cdList"
                                      :p-cd-rel-var-list="cdRelVarList"
                                      :disabled="disabled"
                                      ref="vUnitCondition"
                                      @addOrEditClick="cdAddOrEditClick"
                                      @deleteClick="cdDeleteClick"></v-unit-condition>
                </el-collapse-item>

                <!--元规则结果-->
                <el-collapse-item name="unitResult">
                    <template slot="title">
                        <div title="对判断条件进行组合，生成条件组合逻辑，每个条件组合逻辑对应一个输出结果。" style="width: 110px">
                            <span>元规则结果</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                        <div class="tools" style="width: 100%">
                            <el-button :disabled="disabled" icon="el-icon-plus" size="mini" @click.stop="uResultAddClick" class="node-set-button">添加</el-button>
                            <span style="margin-left: 20px;color: red">{{uResultErrorMsg}}</span>
                        </div>
                    </template>
                    <v-unit-result :p-u-result-list="uResultList"
                                   :p-node="node"
                                   :disabled="disabled"
                                   :p-cd-list="cdList"
                                   ref="vUnitResult"
                                   @deleteClick="uResultDeleteClick"></v-unit-result>
                </el-collapse-item>

                    <!--字段配置-->
                    <el-collapse-item name="configOfField">
                        <template slot="title">
                            <div title="元规则输出的字段配置，可以设置别名" style="width: 150px">
                                <span>{{messageEnums.CONFIG_OF_FIELD.name}}(元规则结果)</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                        </template>
                        <comm-var-inf :p-var="urVar"
                                      :p-node="node"
                                      :disabled="disabled"
                                      :var-name-show="false"
                                      ref="commVarInf"
                                      :p-alias-list="commVarInfRelVarList" ></comm-var-inf>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>
    </div>
</template>

<script>

    import {Condition} from "./index";
    import {ls, URVar} from "../index";
    import {isContainEmpty, isEmpty, isNotEmpty} from "../../utils";
    import Sortable from 'sortablejs'
    import VUnitResult from "./children/VUnitResult";
    import VUnitCondition from "./children/VUnitCondition";
    import VUnitTmpVar from "./children/VUnitTmpVar";
    import {TVars, UnitResult} from "../../entity/vars";
    import resizeForDrawer from "../mixins/resizeForDrawer"
    import {
        G6Model
    } from "../../entity/g6Model";
    import NodeInf from "../common/node-inf";
    import {dataTypeEnums, messageEnums, varNameTypeEnums} from "../../entity/enumns";
    import CommVarInf from "../common/CommVarInf";

    export default {
        name: "UnitRule",
        mixins:[resizeForDrawer],
        components: {CommVarInf, NodeInf, VUnitTmpVar, VUnitCondition, VUnitResult},
        props: {
            decisionTree: Object,
            node: {default: () => {}, type: Object},
            pRule: {default: ()=>{}, type: Object},
            pDecs: {default: ()=>{}, type: Object},
            // 上游传入的变量
            unitRuleInputVarList: {default: ()=>[], type: Array},
            disabled: {default: false, type: Boolean},
            // 控制是否可以选择变量类型（String，Integer，Float）
        },
        data() {
            return {
                messageEnums: messageEnums,
                activeNames: ['tmpVars', 'condition', 'unitResult', 'configOfField'],
                // 判断条件数组
                cdList: [],
                // 中间变量数组
                tmpVarList: [],
                // 元规则结果数组
                uResultList: [],
                // 元规则的输出
                urVar: new URVar(),


                // 异常信息
                uResultErrorMsg: '',

                cdRelVar: {
                    totalVarList: [],
                },
                funRelVar: {
                    totalVarList: [],
                },


                // 函数方法
                isNotEmpty: isNotEmpty,
                isEmpty: isEmpty
            }
        },

        computed: {
            cdErrorMsg() {
                let that = this;
                let eList = that.cdList.map(item => new Condition(item)).filter(item => isNotEmpty(item.getErrorMsg()));
                if (eList.length === 0) {
                    return ""
                } else {
                    return eList[0].getErrorMsg();
                }
            },

            computeTVarError(){
                for (let i = 0; i < this.tmpVarList.length; i++) {
                    let item = this.tmpVarList[i];
                    if (isNotEmpty(item.errorList())){
                        return `第 [${i+1}] 个变量${item.errorList()[0]}`
                    }
                }
                return "";
            },


            cdRelVarList() {
                let result = [];
                let notNullTmpVarList = this.tmpVarList.filter(tmpVar => isNotEmpty(tmpVar.varName) || isNotEmpty(tmpVar.varAlias));
                result.push(...notNullTmpVarList);
                result.push(...this.unitRuleInputVarList);
                result.push(...this.cdRelVar.totalVarList);
                return result;
            },


            funRefVarList() {
                let result = [];
                result.push(...this.unitRuleInputVarList);
                result.push(...this.funRelVar.totalVarList);
                return result;
            },

            commVarInfRelVarList() {
                let result = [];
                let notNullTmpVarList = this.tmpVarList.filter(tmpVar => isNotEmpty(tmpVar.varName) || isNotEmpty(tmpVar.varAlias));
                result.push(...notNullTmpVarList);
                result.push(...this.unitRuleInputVarList);
                result.push(...this.cdRelVar.totalVarList);
                return result;
            }

        },

        watch: {
            urVar:{
                handler(value) {
                    let that = this;
                    that.node.nData.urVar = value;
                },
                deep: true
            },

            cdList: {
                handler(value) {
                    let that = this;
                    that.node.nData.cdList = value;
                },
                deep: true
            },
            tmpVarList: {
                handler(value) {
                    let that = this;
                    that.node.nData.tmpVarList = value;
                },
                deep: true
            },
            uResultList: {
                handler(value) {
                    let that = this;
                    that.validateUResult(value);
                    that.node.nData.uResultList = value;
                },
                deep: true
            },
        },

        mounted() {
        },

        methods: {
            //行拖拽
            rowDrop() {
                // 判断条件拖拽
                const tbody1 = document.querySelector('#conditionTable .el-table__body-wrapper tbody');
                const _this = this;
                Sortable.create(tbody1, {
                    // css选择器，为该类得才可以成为拖动元素
                    handle: ".canDrop",
                    onEnd({newIndex, oldIndex}) {
                        console.log(newIndex, oldIndex);
                        const currRow = _this.cdList.splice(oldIndex, 1)[0];
                        _this.cdList.splice(newIndex, 0, currRow)
                    }
                });

                // 元规则结果拖拽
                const tbody2 = document.querySelector('#uResultTable .el-table__body-wrapper tbody');
                Sortable.create(tbody2, {
                    handle: ".canDrop",
                    onEnd({newIndex, oldIndex}) {
                        console.log(newIndex, oldIndex);
                        const currRow = _this.uResultList.splice(oldIndex, 1)[0];
                        _this.uResultList.splice(newIndex, 0, currRow)
                    }
                })
            },

            // 初始化元规则
            init() {
                let that = this;
                isEmpty(that.node.nData.uResultList) ? that.uResultList = [] : that.uResultList = that.node.nData.uResultList.map(item => UnitResult.obj2UnitResult(item));
                isEmpty(that.node.nData.cdList) ? that.cdList = [] : that.cdList = that.node.nData.cdList.map(item => new Condition(item));
                isEmpty(that.node.nData.tmpVarList) ? that.tmpVarList = [] : that.tmpVarList = that.node.nData.tmpVarList.map(item => new TVars(item));

                if (isEmpty(that.node.nData.urVar)) {
                    that.urVar = new URVar({ varName: this.node.nData.uniqueName, varType: dataTypeEnums.STRING.code, varNameType: varNameTypeEnums.S.code});
                } else {
                    that.urVar = URVar.obj2UrVar(that.node.nData.urVar);
                }

                let totalVarList = G6Model.getTotalVarsOfParents(that.node, this.decisionTree);
                that.cdRelVar.totalVarList = totalVarList;
                that.funRelVar.totalVarList = totalVarList;

                // 添加默认逻辑
                if (that.uResultList.filter(uResult => uResult.logicId === 999).length === 0) {
                    that.uResultList.push(new UnitResult({logicId: 999, logic: '默认逻辑'}))
                }
                this.$nextTick(() => {
                    this.rowDrop();
                    that.$refs.commVarInf.setOldPVar(that.urVar);
                })
            },

            validateUResult(value) {
                try {
                    value.forEach(item => {
                        if (isContainEmpty([item.logicId, item.logic, item.resultValue]))
                            throw new Error(`第${item.logicId}的元规则结果未填写全`);
                    });
                    this.uResultErrorMsg = "";
                } catch (e) {
                    this.uResultErrorMsg = e.message;
                }
            },

            // 删除元规则结果
            uResultDeleteClick(row) {
                let that = this;
                that.uResultList = that.uResultList.filter(ur => ur.logicId !== row.logicId);
            },

            // 删除临时变量
            tmpVarDeleteClick(row) {
                let that = this;
                that.tmpVarList = that.tmpVarList.filter(tmpVar => tmpVar.uuid !== row.uuid);
            },

            // 添加临时变量
            tmpVarAddBeforeClick() {
                this.$refs.vUnitTmpVar.addBefore();
            },

            // 添加元规则结果
            uResultAddClick() {
                this.$refs['vUnitResult'].addBefore();
            },

            // 删除判断条件
            cdDeleteClick(row) {
                let that = this;
                that.cdList = that.cdList.filter(cd => cd.cdId !== row.cdId);
            },

            // 判断条件添加之前
            cdAddBeforeClick(){
                this.$refs.vUnitCondition.addBefore();
            },

            // 添加判断条件
            cdAddOrEditClick(condition) {
               let that = this;
               let isAdd = that.cdList.filter(item=>item.cdId === condition.cdId).length === 0;
               if (isAdd){
                   that.cdList.push(condition);
               } else {
                   that.cdList.forEach(item=>{
                       if (item.cdId === condition.cdId){
                           Object.assign(item, condition)
                       }
                   })
               }
            },

        }
    }
</script>

<style scoped>
    @import "../../views/common/index.css";

    #sourceRule {
        width: 100%;
        height: 100%;
        /*padding-left: 20px;*/
        /*padding-right: 20px;*/
        /*margin-top: 15px;*/
        overflow: auto;
    }

    .tools {
        margin-left: 15px;
    }
</style>
