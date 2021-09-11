<template>
    <div>
        <el-card class="setting-card" :body-style="{padding:0}">
            <div slot="header" class="clearfix">
                <span style="font-weight: 600">【节点/边】信息</span>
                <div class="second-title">
                    <span v-if="node.type==='root-rect'">起点(ID:{{node.id}})</span>
                    <span v-else-if="node.type==='condition-rect'">条件(ID:{{node.id}})</span>
                    <span v-else-if="node.type==='result-rect'">结果(ID:{{node.id}})</span>
                    <span v-else-if="node.type==='flow-line'">边(ID:{{node.id}})</span>
                    <span v-else>暂无选择【节点/边】</span>
                </div>
            </div>
<!--            根节点编辑栏-->
            <div v-if="node.type==='root-rect'">
                <el-table
                        ref="varTable"
                        height="250"
                        :data="transformPCdRelVarList"
                        key="{{node.id}}table1"
                        style="width: 100%">
                    <el-table-column  align="center" label="上级节点变量信息">
                        <el-table-column
                                prop="prefixVarName"
                                label="变量ID">
                        </el-table-column>
                        <el-table-column
                                prop="varDesc"
                                label="变量描述">
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
<!--            条件节点编辑栏-->
            <div v-else-if="node.type==='condition-rect'">
                <el-form label-width="80px" style="margin:5px;">
                    <el-form-item label="条件逻辑:" style="margin-bottom: 5px;">
                        <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入内容" style="border: 1px solid #e4e7ed;" v-model="conditionCon" :disabled="disabled">
<!--                                v-model=""-->
<!--                        >-->
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-divider style="margin: 0"></el-divider>
                <el-table
                        height="200"
                        :data="transformPCdRelVarList"
                        key="{{node.id}}table2"
                        style="width: 100%">
                    <el-table-column
                    width="55">
                        <template slot-scope="props">
                        <el-button size="mini" style="padding: 0px;border: 0" @click="checkVar(props.row)" :disabled="disabled">
                            <svg-icon icon-class="choose_ver" style="width: 1.5em;height: 1.5em" ></svg-icon>
                        </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="prefixVarName"
                            label="变量ID">
                    </el-table-column>
                    <el-table-column
                            prop="varDesc"
                            label="变量描述">
                    </el-table-column>
                </el-table>
            </div>
            <!--结果节点编辑栏-->
            <div v-else-if="node.type==='result-rect'" style="padding: 5px">
                <el-form label-width="80px" style="margin:5px;">
                    <el-form-item label="结果标签:" style="margin-bottom: 5px;">
                        <el-input size="mini" laceholder="请输入内容" v-model="resultCon" :disabled="disabled"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!--边编辑栏-->
            <div v-else-if="node.type==='flow-line'" class="clearfix">
                <el-form label-width="140px" style="margin:5px;">
                    <el-form-item label="条件结果（边值）:" >
                        <el-select v-model="edgeCon" placeholder="请选择" :disabled="disabled">
                            <el-option key="true" label="Yes" value="Yes"></el-option>
                            <el-option key="false" label="No" value="No"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <!--未选择节点时的情况-->
            <div v-else>
                <el-form style="margin:5px;">
                    <el-form-item class="no-data">
                        <svg-icon icon-class="urule"></svg-icon>
                        <br/>
                        <span>暂无相关信息，请双击需要编辑/查看的【边/节点】~</span>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>


    </div>
</template>
<script>
    import {Condition, UnitResult} from "../../rule-node";
    import {ls} from "../../index";
    import {varFromEnums} from "../../../entity/enumns";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import {TVars} from "../../../entity/vars";
    import {G6Editor} from "../../g6-editor/entity/entity";

    export default {
        name: "RuleNodeSetting",
        props: {
            nodeType:"",
            pCdRelVarList: {default: [], type: Array},
            disabled: {default: false, type: Boolean},
            node: {default: () => {}, type: Object},
            g6Editor: G6Editor,
            ugvResultList:{}
        },
        data() {
            return {
                ruleNodeData:{},
                addOrEdit: {
                    dialog: false,
                    condition: new Condition(),
                    type: "add"
                },
                // logicConfig: logicConfig,
                varFromEnums: varFromEnums,
                // tansPCdRelVarList:[],
                conditionCon:"",
                resultCon:"",
                edgeCon:""


            }
        },
        computed:{
            //将变量转化为带前缀形式
            transformPCdRelVarList(){
                let that = this;
                let tansPCdRelVarList = []
                that.pCdRelVarList.forEach(item => {
                    var prefixVarName = item.getPrefixVarName();
                    tansPCdRelVarList.push({
                        prefixVarName: prefixVarName,
                        varDesc:item.varDesc
                    })
                })
                return tansPCdRelVarList;
            },
        },
        created() {

        },
        mounted() {

            // this.transformPCdRelVarList();

        },
        watch: {
            conditionCon: {
                handler(value) {
                    let that = this;
                    that.node.value = value;
                    if(value.length>25){
                        that.node.label = that.node.value.substring(0,25)+"...";
                    }else{
                        that.node.label = that.node.value;
                    }
                    const item = that.g6Editor.graph.findById(that.node.id);
                    that.g6Editor.graph.updateItem(item, that.node);
                    that.updataGraph(that.g6Editor);
                },
                deep: true
            },
            resultCon: {
                handler(value) {
                    let that = this;
                    that.node.value = value;
                    if(value.length>25){
                        that.node.label = that.node.value.substring(0,25)+"...";
                    }else{
                        that.node.label = that.node.value;
                    }
                    const item = that.g6Editor.graph.findById(that.node.id);
                    that.g6Editor.graph.updateItem(item, that.node);
                    that.updataGraph(that.g6Editor);
                    var uniqueNodeNum = that.node.nData.uniqueNodeNum;
                    if(that.ugvResultList[uniqueNodeNum]!==undefined){
                        that.ugvResultList[uniqueNodeNum] = value;
                        that.$emit("changeUgvResultList",that.ugvResultList);
                    }
                },
                deep: true
            },
            edgeCon: {
                handler(value) {
                    let that = this;
                    that.g6Editor.graph.findById(that.node.target)._cfg.model.nData.parentResult = value;
                    const item = that.g6Editor.graph.findById(that.node.id);
                    that.g6Editor.graph.updateItem(item, that.node);
                    that.updataGraph(that.g6Editor);
                },
                deep: true
            },
        },
        methods: {
            init() {
                let that = this;
                isEmpty(that.node.value) ? that.conditionCon = "" : that.conditionCon = that.node.value;
                isEmpty(that.node.value) ? that.resultCon = "" : that.resultCon = that.node.value;
                if(that.node.type==='flow-line'){
                    var targetId = isEmpty(that.node.target) ?"" : that.node.target;
                    var targetNode = that.g6Editor.graph.findById(targetId);
                    if(targetNode!==undefined&&targetNode!==null){
                        var edgeLabel = targetNode.getModel().nData.parentResult;
                        isEmpty(edgeLabel) ? that.edgeCon = "" : that.edgeCon = edgeLabel;
                    }

                }

            },

            //触发父亲组件中图的更新，便于代码生成
            updataGraph(value){
                let that = this;
                that.$emit("G6EditorChange", value);
                that.$nextTick(()=>{
                    that.$emit("handleChange");
                });
            },

            //填写条件逻辑时，点击左边的√自动将变量名称补充到输入框中
            checkVar(val){
                this.conditionCon += val.prefixVarName;

            },
        }
    }
</script>
<style>
    .setting-card.el-card.is-always-shadow{
        box-shadow: 0 0px 0px 0 rgba(0,0,0,.1);
        border-radius: 0px;
    }
    .setting-card .el-card__header{
        padding: 8px 0 8px 10px;
    }
    .second-title{
        float: right;
        font-size: 14px;
        color: rgb(15, 34, 45);
        background: #afcbea;
        border-radius: 5px 0 0 5px;
        padding: 1px 5px 1px 5px;
    }
    .setting-card .el-table th,.setting-card .el-table td{
        padding: 5px 0;
    }
    .setting-card .no-data{
        padding: 8px 0;
    }
    .no-data .svg.svg-icon{
        width: 10em;
        height: 10em;
    }
</style>
