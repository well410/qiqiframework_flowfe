<template>
    <div id="filter-edit">
        <node-inf :node="node" :disabled="disabled"></node-inf>
        <el-card style="padding: 15px">
            <span style="color: red" v-if="isNotEmpty(filterVar.validate())">{{filterVar.validate()}}</span>
            <div class="common-title">基本配置</div>
            <el-form label-width="80px" size="mini" style="margin-top: 10px">
                <el-form-item label="过滤结果">
                    <span>{{filterVar.getPrefixVarName()}}</span>
                    <el-button @click="filterVarEditBefore"  class="icon-button" icon="el-icon-edit" title="编辑" style="margin-left: 15px"></el-button>
                </el-form-item>
                <el-form-item label="数组引用">
                    <el-select :disabled="disabled"
                               filterable
                               clearable
                               v-model="filterVar.filterArrName" size="mini"
                               placeholder="请设置字段映射" style="width: 100%">
                        <el-option v-for="item in computeArrayRel"
                                   :key="item.getPrefixVarName()"
                                   :label="`[${item.getPrefixVarName()}][${item.getSimpleDesc()}]`"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="common-title" title="TRUE为过滤后剩下的">过滤配置</div>

            <el-form label-width="80px" size="mini" style="margin-top: 10px">
                <el-form-item label="条件配置">
                    <f-condition :p-filter-var="filterVar" :p-cd-rel-var-list="computeTotalRel" :disabled="disabled"></f-condition>
                </el-form-item>
                <el-form-item label="结果配置">
                    <el-input :disabled="disabled"  size="mini"
                              :placeholder="patternEnums.UResultLogic.decs"
                              @input="filterVar.funBodyCdResult = patternEnums.UResultLogic.uResultLogicFilter(filterVar.funBodyCdResult)"
                              v-model.trim="filterVar.funBodyCdResult"></el-input>
                </el-form-item>
            </el-form>

        </el-card>


        <!--过滤结果编辑-->
        <el-dialog :visible.sync="filterVarDialog.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :title="filterVarDialog.title">
            <comm-var-inf ref="commVarInf" :p-var="filterVarDialog.filterVar" :p-alias-list="computeAliasRel" :varTypeDisable="true" :inline="false"></comm-var-inf>

            <template slot="footer" class="dialog-footer">
                <el-button @click="filterVarDialog.dialog = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="filterVarEditAfter" size="mini">确 定
                </el-button>
            </template>
        </el-dialog>


    </div>
</template>

<script>
    import NodeInf from "../common/node-inf";
    import {G6Model} from "../../entity/g6Model";
    import {ErLoopConfigVar, FilterVar, RIVar} from "../../entity/vars";
    import CommVarInf from "../common/CommVarInf";
    import resizeForDrawer from "../mixins/resizeForDrawer";
    import FCondition from "./children/FCondition";
    import {dataTypeEnums, patternEnums} from "../../entity/enumns";
    import {isEmpty} from "../../utils";
    import {Sortable} from "sortablejs";

    export default {
        name: "FilterEdit",
        components: {FCondition, CommVarInf, NodeInf},
        mixins: [resizeForDrawer],
        props: {
            decisionTree: Object,
            node: {
                default: () => {
                }, type: Object
            },
            pRule: {
                default: () => {
                }, type: Object
            },
            pDecs: {
                default: () => {
                }, type: Object
            },
            filterInputVarList: {default: () => [], type: Array},
            disabled: {default: false, type: Boolean},
        },

        data() {
            return {
                filterVarDialog: {dialog: false, filterVar: new FilterVar({})},
                filterRelVar: {
                    totalVarList: [],
                },
                filterVar: new FilterVar(),
                patternEnums: patternEnums
            }
        },

        computed: {
            computeAliasRel(){
                return this.computeTotalRel.filter(item=>item.enableAlias());
            },

            computeArrayRel(){
                return this.computeTotalRel.filter(item=>item.varType === dataTypeEnums.ARRAY.code || isEmpty(item.varType));
            },

            computeTotalRel(){
                let result = [];
                result.push(...this.filterRelVar.totalVarList);
                result.push(...this.filterInputVarList);
                return result;
            }
        },

        watch: {
            /**
             * erl 变量结果配置
             *
             * @see ErLoopConfigVar
             *
             **/
            filterVar: {
                handler(newValue) {
                    this.node.nData.filterVar = newValue;
                },
                deep: true
            },
        },


        methods:{
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
                        const currRow = _this.filterVar.funBodyCdList.splice(oldIndex, 1)[0];
                        _this.filterVar.funBodyCdList.splice(newIndex, 0, currRow)
                    }
                });
            },


            filterVarEditAfter(){
                this.$refs.commVarInf.validate().then(res=>{
                    if (res){
                        Object.assign(this.filterVar, this.filterVarDialog.filterVar);
                        this.filterVarDialog.dialog = false;
                    }
                });
            },

            filterVarEditBefore(){
                this.filterVarDialog.filterVar = FilterVar.obj2ERLVar(JSON.parse(JSON.stringify(this.filterVar)));
                this.filterVarDialog.dialog = true;
            },

            init() {
                let that = this;
                // 根据节点数据初始化
                that.isEmpty(that.node.nData.filterVar) ? that.filterVar = new FilterVar() : that.filterVar = new FilterVar(that.node.nData.filterVar);


                that.filterRelVar.totalVarList = G6Model.getTotalVarsOfParents(that.node, this.decisionTree);

                that.$nextTick(()=>{
                    that.rowDrop()
                })
            },
        }
    }
</script>

<style scoped>

</style>
