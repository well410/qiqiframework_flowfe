<template>
    <div id="decsTable" ref="decsTable" style="min-height: 100%">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled"></node-inf>

            <el-card>
                <el-collapse v-model="activeNames">

                    <!--决策表输入配置-->
                    <el-collapse-item name="dtConfig">
                        <template slot="title">
                            <div title="行纵变量及其判断条件的编辑" style="width: 100px">
                                <span>决策表配置</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                            <div class="tools" style="width: 100%">
                                <span style="margin-left: 20px;color: red">{{computeDtInputVarWarmMsg}}</span>
                            </div>
                        </template>

                        <!--行、纵变量输入,矩阵-->
                        <decs-table-conf
                                :p-col-var="colVar"
                                :p-row-var="rowVar"
                                :p-row-cd-list="rowCdList"
                                :p-col-cd-list="colCdList"
                                :rel-input-var-list="computeConfInputVarList"
                                :disabled="disabled">
                        </decs-table-conf>
                    </el-collapse-item>


                    <!--矩阵配置-->
                    <el-collapse-item name="cellMapConf">
                        <template slot="title">
                            <div title="配置决策表分支结果(数字或者字符串)" style="width: 100px">
                                <span>矩阵结果值</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                            <div class="tools" style="width: 100%">
                                <span style="margin-left: 20px;color: red">{{uCellMapWarmMsg}}</span>
                            </div>
                        </template>

                        <!--矩阵-->
                        <cell-map-conf ref="cellMapConf" :disabled="disabled" @updateCellMap="dtUpdateCellMap">
                        </cell-map-conf>
                    </el-collapse-item>


                    <!--决策表结果-->
                    <el-collapse-item name="dtResult">
                        <template slot="title">
                            <div title="命中其中一组表条件，得到对应的输出，可以设置别名">
                                <span>字段配置(决策表结果)</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                        </template>
                        <comm-var-inf
                                ref="commVarInf"
                                :p-var="dtVar"
                                :p-node="node"
                                :disabled="disabled"
                                :var-name-show="false"
                                :is-d-t-comm-var="true"
                                :p-alias-list="cdRelVarList"></comm-var-inf>
                    </el-collapse-item>

                </el-collapse>
            </el-card>



        </el-scrollbar>
    </div>
</template>

<script>
    import {G6Editor} from "../g6-editor/entity/entity";
    import {isEmpty, isNotEmpty} from "../../utils";
    import {DTVar} from "../../entity/vars";
    import {RowOrColVar} from "./index";
    import {G6Model} from "../../entity/g6Model";
    import NodeInf from "../common/node-inf";
    import CommVarInf from "../common/CommVarInf";
    import DecsTableConf from "./children/DecsTableConf";
    import {dataTypeEnums, varNameTypeEnums} from "../../entity/enumns";
    import {DrlVar} from "../index";
    import {Condition} from "../rule-node";
    import CellMapConf from "./children/CellMapConf";

    export default {
        name: "DecsTable",

        components: {CommVarInf, NodeInf, DecsTableConf, CellMapConf},
        props: {
            decisionTree: Object,
            node: {default: () => {}, type: Object},
            pRule: {default: ()=>{}, type: Object},
            pDecs: {default: ()=>{}, type: Object},
            // 上游传入的变量
            decsTableInputVarList: {default: ()=>[], type: Array},
            disabled: {default: false, type: Boolean},
            // 控制是否可以选择变量类型（String，Integer，Float）
            g6Editor: G6Editor,

        },

        data() {
            return {
                // 下拉栅格
                activeNames: ['dtResult', 'dtConfig', 'cellMapConf'],

                // =========================核心数据结构==========================
                // 行变量（来自其它节点的变量）
                rowVar: {},
                // 行变量对应的判断条件
                rowCdList: [],

                // 纵变量（来自其它节点的变量）
                colVar: {},
                // 纵变量对应的判断条件
                colCdList: [],

                // 决策表结果变量
                dtVar: new DTVar(),

                // 矩阵信息(带输出的结果)
                cellMap: [[null]],
                // cellMap: computeCellMap();
                // ===================================================

                // cellMap的提醒信息
                uCellMapWarmMsg: '',

                // 决策表用到的相关的所有变量
                dtRelVar: {
                    totalVarList: [],
                },


                // 函数方法
                isNotEmpty: isNotEmpty,
                isEmpty: isEmpty,

                // 标志位
                isInit : false,
                // curButtomFlag: true,
                // enumsButtom: {unlock: false, lock: true},

            }

        },

        computed: {

            // 只保留数据类型为数字型和字符串型的变量 作为 行纵变量的可选项
            computeConfInputVarList() {
                let result = [];
                result.push(...this.decsTableInputVarList);
                result.push(...this.dtRelVar.totalVarList);
                return result.filter(item => item.varType === dataTypeEnums.STRING.code || item.varType === dataTypeEnums.INTEGER.code || item.varType === dataTypeEnums.DOUBLE.code);
            },


            // 只保留数据类型为数字型和字符串型的变量 作为 节点输出的可选项
            cdRelVarList() {
                let result = [];
                result.push(...this.dtRelVar.totalVarList);
                return result.filter(item => item.varType === dataTypeEnums.STRING.code || item.varType === dataTypeEnums.INTEGER.code || item.varType === dataTypeEnums.DOUBLE.code);
            },


            // 监听决策表输入变量
            computeDtInputVarWarmMsg() {
                let that = this;
                if (isEmpty(that.rowVar.varName) || isEmpty(that.colVar.varName)) {
                    return '请选择决策表的输入变量';
                }
                return '';
            }

        },

        watch: {
            dtVar: {
                handler(value) {
                    let that = this;
                    that.node.nData.dtVar = value;
                },
                deep: true
            },

            rowVar: {
                handler(value) {
                    let that = this;
                    that.node.nData.rowVar = value;

                    if (this.isInit) {
                        that.rowCdList = [];
                    }

                },
                deep: true
            },

            rowCdList: {
                handler(value) {
                    let that = this;
                    that.node.nData.rowCdList = value;
                    that.$refs.cellMapConf.rowColChange(that.rowCdList, that.colCdList);
                    if (this.isInit){
                        that.$refs.cellMapConf.clearCellMap(that.rowCdList, that.colCdList, that.cellMap);
                    }
                },
                deep: true
            },


            colVar: {
                handler(value) {
                    let that = this;
                    that.node.nData.colVar = value;

                    if (this.isInit) {
                        that.colCdList = [];
                    }
                },
                deep: true
            },

            colCdList: {
                handler(value) {
                    let that = this;
                    that.node.nData.colCdList = value;
                    that.$refs.cellMapConf.rowColChange(that.rowCdList, that.colCdList);
                    if (this.isInit){
                        that.$refs.cellMapConf.clearCellMap(that.rowCdList, that.colCdList, that.cellMap);
                    }
                },
                deep: true
            },

            cellMap: {
                handler(value) {
                    let that = this;
                    that.node.nData.cellMap = value;
                },
                deep: true
            }


        },

        mounted() {



        },

        methods: {


            // 初始化决策表
            init() {
                let that = this;

                // ---------------- 数据 ----------------
                isEmpty(that.node.nData.rowVar) ? that.rowVar = new RowOrColVar() : that.rowVar = RowOrColVar.obj2RowOrColVar(that.node.nData.rowVar);
                isEmpty(that.node.nData.rowCdList) ? that.rowCdList = [] : that.rowCdList = that.node.nData.rowCdList.map(item => new Condition(item));
                isEmpty(that.node.nData.colVar) ? that.colVar = new RowOrColVar() : that.colVar = RowOrColVar.obj2RowOrColVar(that.node.nData.colVar);
                isEmpty(that.node.nData.colCdList) ? that.colCdList = [] : that.colCdList = that.node.nData.colCdList.map(item => new Condition(item));
                if (isEmpty(that.node.nData.dtVar)) {
                    that.dtVar = new DTVar({varName: this.node.nData.uniqueName, varType: dataTypeEnums.STRING.code, varNameType: varNameTypeEnums.S.code});
                } else {
                    that.dtVar = DTVar.obj2DTVar(that.node.nData.dtVar)
                }
                isEmpty(that.node.nData.cellMap) ? that.cellMap = [[null]] : that.cellMap = that.node.nData.cellMap;

                // 所有父节点连线进来的当前节点可用数据
                let totalVarList = G6Model.getTotalVarsOfParents(that.node, this.decisionTree);
                that.dtRelVar.totalVarList = totalVarList;

                // 初始化cellMap组件
                that.$refs.cellMapConf.init(that.rowCdList, that.colCdList, that.cellMap);

                that.isInit = false;
                that.$nextTick(()=>{
                    that.isInit = true;
                    that.$refs.commVarInf.setOldPVar(that.dtVar);
                })
            },


            getInitCellMap() {
                let that = this;
                let result = [];
                let rowLength = that.rowCdList.length + 1;
                let colLength = that.colCdList.length + 1;


                for (let i = 0; i < rowLength; i++) {
                    let rowResult = [];
                    for (let i = 0; i < colLength; i++){
                        rowResult.push(null);
                    }
                    result.push(rowResult);
                }
                return result;
            },

            dtUpdateCellMap(cellMapData) {
                let that = this;
                that.cellMap = cellMapData;
                // Object.assign(that.cellMap, cellMapData);


                let warmMsg = '';
                that.cellMap.forEach(itemRow => {
                    itemRow.forEach(item => {
                        if (isEmpty(item))
                            warmMsg = '请将矩阵结果填满！';
                    })
                })

                that.uCellMapWarmMsg = warmMsg;
            }

        }





    }
</script>

<style scoped>

</style>
