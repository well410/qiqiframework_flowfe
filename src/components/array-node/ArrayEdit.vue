<template>
    <!--json解析节点（设置json对象的路径，解析json中的数据，生成新的变量传给子节点）-->
    <div id="arrEdit" ref="arrEdit">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled"></node-inf>

            <el-card>
                <el-collapse v-model="activeNames" style="">
                    <!--全局数组-->
                    <el-collapse-item name="GlobalArray">
                        <template slot="title">
                            <div title="全局数组添加元素，赋予数组动态添加元素的能力" style="width: 100%">
                                <span>全局数组</span>
                                <i class="header-icon el-icon-info"></i>
                                <el-button :disabled="disabled" type="success" icon="el-icon-plus" size="mini"
                                           @click.stop="globalArrayAdd" class="node-set-button"
                                           style="margin-right: 30px">添加
                                </el-button>
                                <span style="margin-left: 20px;color: red">{{uGlobalArrErrorMsg}}</span>
                            </div>
                        </template>
                        <global-array :disabled="disabled"
                                      ref="globalArray"
                                      :p-exclude-arr-var-list="computeExcludeArrVarList"
                                      :p-global-arr-operate-list="globalArrOperateList"
                                      :p-arr-rel-var-list="computeGlobalArrRelVarList"></global-array>
                    </el-collapse-item>


                    <!--数组函数-->
                    <el-collapse-item name="ArrayFunc">
                        <template slot="title">
                            <div title="简单的数组操作，通过函数返回计算值" style="width: 100%">
                                <span>数组函数</span>
                                <i class="header-icon el-icon-info"></i>
                                <el-button :disabled="disabled" type="success" icon="el-icon-plus" size="mini"
                                           @click.stop="arrayFuncAddBefore" class="node-set-button"
                                           style="margin-right: 30px">添加
                                </el-button>
                            </div>
                        </template>
                        <array-func
                                ref="arrayFunc"
                                @deleteArrVar="arrayFuncDelete"
                                :p-var-list="computePVarList"
                                :p-arr-var-list="arrVarList"


                                :p-arr-rel-var-list="computeArrRelVarList"
                                :p-in-opt-rel-var-list="computeInOptRelVarList"
                                :disabled="disabled"></array-func>
                    </el-collapse-item>



                </el-collapse>
            </el-card>
        </el-scrollbar>
    </div>
</template>

<script>
    import resizeForDrawer from "../mixins/resizeForDrawer";
    import ArrayFunc from "./children/ArrayFunc";
    import {G6Model} from "../../entity/g6Model";
    import {ArrVar} from "../../entity/vars";
    import NodeInf from "../common/node-inf";
    import {dataTypeEnums} from "../../entity/enumns";
    import GlobalArray from "./children/GlobalArray";
    import {GlobalArrOperate} from "../../entity/operate";
    import {isContainEmpty} from "../../utils";

    export default {
        name: "ArrayEdit",
        components: {NodeInf, ArrayFunc, GlobalArray},
        mixins:[resizeForDrawer],
        props: {
            decisionTree: {default: () => {}, type: Object},
            node: {default: () => {}, type: Object},
            disabled: {default: false, type: Boolean},
            // 决策结果节点的输入（可以使用的变量：json临时变量）
            arrInputVarList: {default: () => [], type: Array},
        },

        data() {
            return {
                arrVarList: [],
                // arrIteration: new ArrIteration(), todo 2021/3/10 先注释，下个迭代没问题删除
                // 全局数组操作变量数据源
                globalArrOperateList:[],
                // 异常信息
                uGlobalArrErrorMsg: '',

                activeNames: ['ArrayFunc', 'GlobalArray'],
                relVar: {
                    totalVarList:[],
                    arrInputVarList: [],
                },
            }
        },

        computed:{
            // 所有的父节点变量
            computePVarList() {
                let result = [];
                result.push(...this.relVar.totalVarList);
                return result;
            },

            // 父节点变量和事件变量中非数组的全部节点变量
            computeExcludeArrVarList() {
                let result = [];
                result.push(...this.relVar.arrInputVarList);
                result.push(...this.relVar.totalVarList);
                return result.filter(item => item.varType !== dataTypeEnums.ARRAY.code);
            },

            // 数据类型为数组的字段(去除ev中的数组变量)
            computeGlobalArrRelVarList() {
                let result = [];
                // result.push(...this.relVar.arrInputVarList);
                result.push(...this.relVar.totalVarList);
                return result.filter(item => item.varType === dataTypeEnums.ARRAY.code);
            },

            // 数据类型为数组的字段
            computeArrRelVarList() {
                let result = [];
                result.push(...this.relVar.arrInputVarList);
                result.push(...this.relVar.totalVarList);
                return result.filter(item => item.varType === dataTypeEnums.ARRAY.code);
            },

            // 属于操作方法可以用的字段
            computeInOptRelVarList() {
                let result = [];
                result.push(...this.relVar.arrInputVarList);
                result.push(...this.relVar.totalVarList);
                return result.filter(item => ![dataTypeEnums.ARRAY.code, dataTypeEnums.OBJECT.code].includes(item.varType));
            },


        },

        watch: {
            // 数组函数
            arrVarList: {
                handler(value) {
                    this.node.nData.arrVarList = value;
                },
                deep: true
            },


            // 全局数组
            globalArrOperateList: {
                handler(value) {
                    this.validateGlobalArrOperateList(value);
                    this.node.nData.globalArrOperateList = value;
                },
                deep: true
            }


        },

        mounted() {
        },

        methods:{
            // 数组函数字段添加
            arrayFuncAddBefore() {
                this.$refs.arrayFunc.addBefore();
            },

            // 全局数组添加
            globalArrayAdd() {
                this.$refs.globalArray.addGlobalArrMap();
            },

            // 数组函数字段删除
            arrayFuncDelete(row){
                this.arrVarList = this.arrVarList.filter(item => item.uuid !== row.uuid)
            },


            init(){
                // 节点信息初始化
                let that = this;
                // 获取该节点自己拥有的节点变量
                that.isEmpty(that.node.nData.arrVarList) ? that.arrVarList = [] : that.arrVarList = that.node.nData.arrVarList.map(item=>new ArrVar(item));
                // 为全局数组增加一个节点数据源信息
                that.isEmpty(that.node.nData.globalArrOperateList) ? that.globalArrOperateList = [] : that.globalArrOperateList = that.node.nData.globalArrOperateList.map(item=>new GlobalArrOperate(item));

                // 获取当前节点可获取的全部数据
                that.relVar.totalVarList = G6Model.getTotalVarsOfParents(this.node, this.decisionTree);
                // 可以引用变量的初始化
                that.relVar.arrInputVarList = that.arrInputVarList;

            },

            validateGlobalArrOperateList(value) {
                try {
                    value.forEach(item => {
                        if (isContainEmpty([item.mapGolbalArrField, item.mapGolbalArrElementField]))
                            throw new Error(`请将内容填写完整`);
                    });
                    this.uGlobalArrErrorMsg = "";
                } catch (e) {
                    this.uGlobalArrErrorMsg = e.message;
                }
            }
        }
    }
</script>

<style scoped>
    #arrEdit {
        width: 100%;
        height: 100%;
        overflow: auto;
        min-height: 100%;
    }
</style>
