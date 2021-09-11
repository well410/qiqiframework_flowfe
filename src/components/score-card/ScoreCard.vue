<template>
    <div id="scoreCard" ref="scoreCard" style="min-height: 100%">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled"></node-inf>
            <!--<el-card class="node-content-card"> -->

            <el-card>
                <el-collapse v-model="activeNames">

                    <!--判断条件-->
                    <el-collapse-item name="condition">
                        <template slot="title">
                            <div title="每个变量命中其中一个条件，即获得分数" style="width: 100px">
                                <span>条件评分表</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                            <div class="tools" style="width: 100%">
                                <el-button :disabled="disabled" icon="el-icon-plus" size="mini"
                                           @click.stop="cdAddBeforeClick" class="node-set-button">添加
                                </el-button>
                                <span style="margin-left: 20px;color: red">{{cdErrorMsg}}</span>
                            </div>
                        </template>
                        <sc-condition :p-cd-list="cdList"
                                      :p-cd-rel-var-list="cdRelVarList"
                                      :disabled="disabled"
                                      ref="ScCondition"
                                      @addOrEditClick="cdAddOrEditClick"
                                      @deleteClick="cdDeleteClick"></sc-condition>
                        <template>
                            <div title="支持求和、加权求和、平均、加权平均" style="width: 100px;margin-top: 15px;">
                                <span>分数计算方式</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                            <div style="margin-top: 15px;margin-bottom: 15px">
                                <el-select :disabled="disabled" v-model="scoreType" size="mini">
                                    <el-option :label="scTypeEnums.SUM.name" :key="scTypeEnums.SUM.code" :value="scTypeEnums.SUM.code"></el-option>
                                    <el-option :label="scTypeEnums.MAX.name" :key="scTypeEnums.MAX.code" :value="scTypeEnums.MAX.code"></el-option>
                                    <el-option :label="scTypeEnums.MIN.name" :key="scTypeEnums.MIN.code" :value="scTypeEnums.MIN.code"></el-option>
                                    <el-option :label="scTypeEnums.WSUM.name" :key="scTypeEnums.WSUM.code" :value="scTypeEnums.WSUM.code"></el-option>
                                    <el-option :label="scTypeEnums.AVG.name" :key="scTypeEnums.AVG.code" :value="scTypeEnums.AVG.code"></el-option>
                                    <el-option :label="scTypeEnums.WAVG.name" :key="scTypeEnums.WAVG.code" :value="scTypeEnums.WAVG.code"></el-option>
                                </el-select>
                            </div>
                        </template>
                    </el-collapse-item>
                    <!--评分卡结果-->
                    <el-collapse-item name="scResult">
                        <template slot="title">
                            <div title="评分落在相应的区间内，对应一个输出结果。" style="width: 120px">
                                <span>评分结果映射</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                            <div class="tools" style="width: 100%">
                                <el-button :disabled="disabled" icon="el-icon-plus" size="mini"
                                           @click.stop="scResultAddClick" class="node-set-button">添加
                                </el-button>
                                <span style="margin-left: 20px;color: red">{{scResultErrorMsg}}</span>
                            </div>
                        </template>
                        <sc-result :p-sc-result-list="scResultList"
                                   :disabled="disabled"
                                   @deleteClick="scResultDeleteClick"></sc-result>
                    </el-collapse-item>

                    <el-collapse-item name="selectNext">
                        <template slot="title">
                            <div title="根据结果选择下一步操作，若未选择执行条件，则默认执行。" style="width: 100px">
                                <span>结果操作选择</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                            <div class="tools">
                            </div>
                        </template>
                        <template>
                            <div>
                                <el-table
                                        id="scNextNode"
                                        :data="pScNextNodeList"
                                        row-key="NodeId"
                                        tooltip-effect="dark"
                                        stripe
                                        border
                                        max-height="266px"
                                        size="mini"
                                        style="width: 100%">
                                    <el-table-column prop="nodeId" align="center" label="子节点编号"></el-table-column>
                                    <el-table-column prop="nodeName" align="center" label="子节点名称"></el-table-column>
                                    <el-table-column align="center" label="执行条件选择">
                                        <template slot-scope="scope">
                                            <el-select :disabled="disabled"
                                                       clearable
                                                       multiple
                                                       size="mini"
                                                       slot="empty"
                                                       v-model="scope['row'].logicIdList"
                                                       @change="selectChange(scope['row'])">
                                                <el-option v-for="scResult in scResultList2"
                                                           :value="scResult.logicId"
                                                           :key="scResult.logicId"
                                                           :label="`[${[scResult.logicId, scResult.resultValue].join('-')}] ${scResult.resultDesc}`">
                                                    <span :title="[scResult.logicId, scResult.resultValue].join('-')"
                                                          class="option-left">{{[scResult.logicId, scResult.resultValue].join('-')}}</span>
                                                    <span :title="scResult.resultDesc" class="option-right">{{scResult.resultDesc}}</span>
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </template>
                    </el-collapse-item>


                    <el-collapse-item name="configOfField">
                        <template slot="title">
                            <div title="元规则输出的字段配置，可以设置别名" style="width: 150px">
                                <span>字段配置(评分结果)</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                        </template>
                        <comm-var-inf ref="commVarInf" :p-var="scVar" :p-node="node" :disabled="disabled" :var-name-show="false" :p-alias-list="cdRelVarList"></comm-var-inf>
                    </el-collapse-item>
                </el-collapse>

            </el-card>
        </el-scrollbar>
    </div>
</template>

<script>
    import {isContainEmpty, isEmpty, isNotEmpty, isNotContainEmpty} from "../../utils";
    import Sortable from 'sortablejs';
    import ScCondition from "./children/ScCondition";
    import ScResult from "./children/ScResult";
    import resizeForDrawer from "../mixins/resizeForDrawer";
    import {CompCondition, ScoreCardResult} from "./index";
    import {dataTypeEnums, messageEnums, scTypeEnums, varNameTypeEnums} from "../../entity/enumns";
    import {ls, SCVar} from "../index";
    import {
        G6Model
    } from "../../entity/g6Model";
    import NodeInf from "../common/node-inf";
    import {G6Editor} from "../g6-editor/entity/entity";
    import CommVarInf from "../common/CommVarInf";
    import {URGVar} from "../../entity/vars";

    export default {
        name: "ScoreCard",
        mixins:[resizeForDrawer],
        components: {CommVarInf, NodeInf, ScCondition, ScResult},
        props: {
            decisionTree: Object,
            node: {default: () => {}, type: Object},
            pRule: {default: ()=>{}, type: Object},
            pDecs: {default: ()=>{}, type: Object},
            // 上游传入的变量
            scoreCardInputVarList: {default: ()=>[], type: Array},
            disabled: {default: false, type: Boolean},
            // 控制是否可以选择变量类型（String，Integer，Float）
            g6Editor: G6Editor,
        },
        data() {
            return {
                messageEnums: messageEnums,
                activeNames: ['condition', 'scResult', 'selectNext', 'configOfField'],
                // 判断条件数组
                cdList: [],
                // 中间变量数组
                tmpVarList: [],
                // 元规则结果数组
                scResultList: [],

                scResultList2: [],

                scoreType: 'sum',

                // 异常信息
                scResultErrorMsg: '',

                cdRelVar: {
                    totalVarList: [],
                },

                // 函数方法
                isNotEmpty: isNotEmpty,
                isEmpty: isEmpty,
                //计算方式
                scTypeEnums: scTypeEnums,

                pScNextNodeList: [],

                //下游的连线
                edgeList: [],

                //子节点
                nodeList: [],

                // 评分结果变量
                scVar: new SCVar()
            }
        },

        computed: {
            cdErrorMsg() {
                let that = this;
                let eList = that.cdList.map(item => new CompCondition(item)).filter(item => isNotEmpty(item.getErrorMsg()));
                if (eList.length === 0) {
                    return ""
                } else {
                    return eList[0].getErrorMsg();
                }
            },

            /**
             *  判断条件能够引用的变量
             *
             *  pTVarList：父节点临时变量
             *  pUResultVarList：父节点输出
             *  pVarPlatformVarList：变量平台变量
             *  scoreCardInputVarList：父组件传入的变量
             *  tmpVarList：当前临时变量
             *  cmptOutVarList：父节点组件输出变量
             */
            cdRelVarList() {
                let result = [];
                let notNullTmpVarList = this.tmpVarList.filter(tmpVar=>isNotEmpty(tmpVar.varName));
                result.push(...notNullTmpVarList);
                result.push(...this.scoreCardInputVarList);
                result.push(...this.cdRelVar.totalVarList);
                return result;
                //return result.filter(item=>!["array", "object"].includes(item.varType));
            },
        },

        watch: {
            scVar: {
                handler(value) {
                    let that = this;
                    that.node.nData.scVar = value;
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

            scoreType: {
                handler(value) {
                    let that = this;
                    that.node.nData.scoreType = value;
                },
                deep: true
            },

            scResultList: {
                handler(value) {
                    let that = this;
                    that.validateSCResult(value);
                    that.node.nData.scResultList = value;
                    let result = [];
                    if (isNotEmpty(this.scResultList)) {
                        this.scResultList.forEach(scResult => {
                            let isNotEmpty = isNotContainEmpty([scResult.logicId, scResult.logic, scResult.resultValue]);
                            if (isNotEmpty) {
                                if (isEmpty(scResult.resultDesc)) scResult.resultDesc = '';
                                result.push(scResult);
                            }
                        });

                        this.pScNextNodeList.forEach(n => {
                            if (isNotEmpty(n.logicIdList)) {
                                for (let i = n.logicIdList.length - 1; i >= 0; i--) {
                                    if (result.filter(item => item.logicId === n.logicIdList[i]).length === 0) {
                                        n.logicIdList.splice(i, 1);
                                    }
                                }
                            }
                            let filterList = result.filter(item => n.logicIdList.includes(item.logicId));
                            this.updateLine(n, filterList);
                        });

                        that.scResultList2 = result;

                    }
                },
                deep: true
            },

        },

        mounted() {
        },

        methods: {

            //行拖拽

            rowDrop() {
                // 评分结果拖拽
                const tbody2 = document.querySelector('#scResultTable .el-table__body-wrapper tbody');
                const _this = this;
                Sortable.create(tbody2, {
                    handle: ".canDrop",
                    onEnd({newIndex, oldIndex}) {
                        console.log(newIndex, oldIndex);
                        const currRow = _this.scResultList.splice(oldIndex, 1)[0];
                        _this.scResultList.splice(newIndex, 0, currRow);
                    }
                })
            },

            initNextNodeList() {
                let that = this;
                //获取子节点
                that.nodeList = G6Model.getNodeListOfChildren(that.node, that.decisionTree);
                //获取评分卡的下游连线
                that.edgeList = G6Model.getEdgeListOfChildren(that.node, that.decisionTree);
                if(isNotEmpty(that.nodeList) && isNotEmpty(that.edgeList)) {
                    that.pScNextNodeList = that.nodeList.map(node => {
                        let edges = that.edgeList.filter(edge => edge.target === node.id);
                        if(edges.length > 0) {
                            return {
                                'nodeId': node.nData.uniqueName,
                                'nodeName': node.name,
                                'id':node.id,
                                'logicIdList': edges[0].eData.logicIdList,
                            }
                        }
                    });
                }
            },

            updateLine(row, filterList) {
                let edges = this.edgeList.filter(edge => edge.target === row.id);
                // 如果子节点没有连线，那么要将 pScNextNodeList 初始化好
                if (isEmpty(edges)){
                    this.pScNextNodeList = [];
                    return
                }

                if (isNotEmpty(filterList)){
                    edges[0].label = filterList.map(item=>`[${item.resultValue}]`).join(" 或 ");
                    edges[0].eData.logicIdList = filterList.map(item=>item.logicId);
                } else {
                    edges[0].label = "";
                    edges[0].eData.logicIdList = [];
                }

                let len = this.decisionTree.edges.length;
                for(let i = 0; i < len; i++) {
                    if(this.decisionTree.edges[i].id === edges[0].id) {
                        Object.assign(this.decisionTree.edges[i], edges[0]);
                        break;
                    }
                }
                if (isNotEmpty(this.g6Editor)) {this.g6Editor.graph.refresh();}

            },

            refreshGraph(){
                if (isNotEmpty(this.g6Editor)) {this.g6Editor.graph.refresh();}
            },

            selectChange(row) {
                let filterList = this.scResultList2.filter(item=>row.logicIdList.includes(item.logicId));
                this.updateLine(row, filterList);
            },

            // 初始化评分卡
            init() {
                let that = this;
                isEmpty(that.node.nData.scResultList) ? that.scResultList = [] : that.scResultList = that.node.nData.scResultList.map(item => ScoreCardResult.obj2ScoreCardResult(item));
                isEmpty(that.node.nData.cdList) ? that.cdList = [] : that.cdList = that.node.nData.cdList.map(item => new CompCondition(item));
                isEmpty(that.node.nData.scoreType) ? that.scoreType = scTypeEnums.SUM.code : that.scoreType = that.node.nData.scoreType;
                if (isEmpty(that.node.nData.scVar)) {
                    that.scVar = new SCVar({varType: dataTypeEnums.STRING.code, varNameType: varNameTypeEnums.S.code});
                } else {
                    that.scVar = SCVar.obj2SCVar(that.node.nData.scVar);
                }

                that.node.nData.scoreType = that.scoreType;

                let totalVarList = G6Model.getTotalVarsOfParents(that.node, this.decisionTree);
                that.cdRelVar.totalVarList = totalVarList;

                that.initNextNodeList();

                // 添加默认逻辑
                if (that.scResultList.filter(scResult => scResult.logicId === 999).length === 0) {
                    that.scResultList.push(new ScoreCardResult({logicId: 999}))
                }

                this.$nextTick(()=>{that.$refs.ScCondition.updateTable();});

                this.$nextTick(()=>{this.rowDrop();})

                this.$nextTick(() => {
                    that.$refs.commVarInf.setOldPVar(that.scVar);
                })
            },

            // 删除判断条件
            cdDeleteClick(row) {
                let that = this;
                that.cdList = that.cdList.filter(cd => cd.cdId !== row.cdId);
                this.$nextTick(()=>{that.$refs.ScCondition.updateTable();});
            },

            // 判断条件添加之前
            cdAddBeforeClick(){
                this.$refs.ScCondition.addBefore();
            },

            // 添加判断条件
            cdAddOrEditClick(condition) {
               let that = this;
               let isAdd = that.cdList.filter(item=>item.cdId === condition.cdId).length === 0;
               if (isAdd){
                   let idx = that.cdList.length;
                   for(let j=that.cdList.length-1; j>=0; j--) {
                       if(that.cdList[j].cdVarName === condition.cdVarName){
                           idx = j;
                           break;
                       }
                   }
                   that.cdList.splice(idx+1, 0, condition);
               } else {
                   that.cdList.forEach(item=>{
                       if (item.cdId === condition.cdId){
                           Object.assign(item, condition)
                       }
                   })
               }

               that.$refs.ScCondition.updateTable();
            },

            validateSCResult(value) {
                try {
                    value.forEach(item => {
                        if(item.start*1 > item.end*1) {
                            throw new Error(`第${item.logicId}的分数区间中最大值不能小于最小值`);
                        }
                        if (isContainEmpty([item.logicId, item.resultValue]) || (isEmpty(item.start) && isEmpty(item.end) && item.logicId !== 999))
                            throw new Error(`第${item.logicId}的评分结果未填写全`);
                    });
                    this.scResultErrorMsg = "";
                } catch (e) {
                    this.scResultErrorMsg = e.message;
                }
            },

            // 删除评分结果
            scResultDeleteClick(row) {
                let that = this;
                that.scResultList = that.scResultList.filter(ur => ur.logicId !== row.logicId);
            },

            // 添加评分结果
            scResultAddClick() {
                let that = this;
                let cdNum = 999;
                let scrIdList = ls(cdNum);
                // 新增没有出现的id
                let inSCResultListId = that.scResultList.map(scr => scr.logicId);
                let noInSCResultListId = scrIdList.filter(scrId => inSCResultListId.indexOf(scrId) === -1);
                if (noInSCResultListId.length === 0) {
                    that.$message({message: `目前仅支持${cdNum}个评分结果`, type: 'warning'});
                } else {
                    that.scResultList.splice(that.scResultList.length-1, 0 , new ScoreCardResult({logicId: noInSCResultListId[0]}));
                }
            },

        }
    }
</script>

<style scoped>
    @import "../../views/common/index.css";

    #scoreCard {
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
