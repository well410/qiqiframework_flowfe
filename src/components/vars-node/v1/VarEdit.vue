<template>
    <div id="varEdit" ref="varEdit">
        <node-inf :node="node" :disabled="disabled">
            <template slot="right">
                <el-form-item label="操作">
                    <el-button size="mini" :disabled="disabled" type="success" @click="varSelBefore">添加</el-button>
                </el-form-item>
            </template>
        </node-inf>
        <el-collapse v-model="activeNames" style="padding-left: 20px">
            <!--URL变量映射-->
            <el-collapse-item :name="item.redisKey" v-for="item in redisKeyVarsList" :key="item.redisKey">
                <template slot="title">
                    <div :title="item.redisKey">
                        <span>{{item.redisKey}}</span>
                        <i class="header-icon el-icon-info"></i>
                    </div>
                    <div class="tools">
                        <el-tooltip class="item" effect="dark" :content="item.mapFieldList.join(',')" placement="top-start">
                            <el-select :disabled="disabled" v-model="item.mapFieldList" placeholder="请配置映射参数"
                                       clearable
                                       filterable
                                       multiple
                                       collapse-tags
                                       style="width: 300px"
                                       size="mini">
                                <el-option v-for="item in varsRelList"
                                           :key="item.getPrefixVarName()"
                                           :label="item.getDescVarName()"
                                           :value="item.getPrefixVarName()">
                                    <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                    <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                                </el-option>
                            </el-select>
                        </el-tooltip>
                    </div>
                </template>
                <var-result-table
                        @deleteClick="deleteClick"
                        :disabled="disabled"
                        :p-var-list="item.varList"></var-result-table>
            </el-collapse-item>

        </el-collapse>


        <!--变量平台-->
        <el-dialog :visible.sync="varTable.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :title="varTable.title">
            <var-table
                    ref="varTable"
                    :p-sel-var-list="selVarList"
                    @varSelClick="varSelAfter"></var-table>
        </el-dialog>
    </div>
</template>

<script>
    import {isEmpty, isNotEmpty} from "../../../utils";
    import VarTable from "./VarTable";
    import {RedisKeyVars} from ".";
    import VarResultTable from "./children/VarResultTable";
    import resizeForDrawer from "../../mixins/resizeForDrawer"
    import {VarsNode} from "../../../entity/model";
    import {G6Model} from "../../../entity/g6Model";
    import NodeInf from "../../common/node-inf";

    export default {
        name: "VarEdit",
        mixins:[resizeForDrawer],
        components: {NodeInf, VarResultTable, VarTable},
        props: {
            decisionTree: Object,
            node: Object,
            disabled: {default: false, type: Boolean},
            // 变量节点编辑的输入（见varEditInputVarList ）
            varEditInputVarList: {default: () => [], type: Array},
        },

        data() {
            return {
                varTable: {dialog: false, title: '变量选择'},
                activeNames: [],
                // 已经选择的变量，用来置灰var-table中的按钮
                selVarList: [],
                // 节点中的配置
                redisKeyVarsList:[],
                // 可以引用的变量
                varsRel:{varEditInputVarList:[], pTVarList: [],}
            }
        },

        computed:{
            varsRelList(){
                let result = [];
                result.push(...this.varsRel.varEditInputVarList);
                result.push(...this.varsRel.pTVarList);
                return result
            }
        },


        watch: {
            redisKeyVarsList: {
                handler(value) {
                    let that = this;
                    that.node.nData.redisKeyVarsList = value;
                },
                deep: true
            },
        },
        mounted() {

        },

        methods: {
            init() {
                let that = this;
                // 2 节点如果有值组件和字段映射，则初始化
                that.isEmpty(that.node.nData.redisKeyVarsList) ? that.redisKeyVarsList = [] : that.redisKeyVarsList = that.node.nData.redisKeyVarsList;
                that.activeNames = that.redisKeyVarsList.map(item=>item.redisKey);
                that.selVarList = [];
                that.redisKeyVarsList.forEach(item=>{
                    that.selVarList.push(...item.varList)
                });

                // 初始化父节点的临时变量
                let pTVarList = [];
                G6Model.getTmpVarVarsOfParents(that.node, pTVarList, new Set(), that.decisionTree);
                that.varsRel.pTVarList = pTVarList;
                that.varsRel.varEditInputVarList = this.varEditInputVarList;
            },

            // 删除字段
            deleteClick(row){
                this.selVarList = this.selVarList.filter(item=>item.varsId !== row.varsId);
                this.setVarConfigList()
            },

            // 设置变量平台节点中的配置
            setVarConfigList() {
                let result = [];
                let that = this;
                function getMapFieldListByRedisKey(redisKey) {
                    let redisKeyVars = that.redisKeyVarsList.filter(item => item.redisKey === redisKey)[0];
                    if (isEmpty(redisKeyVars)){
                        return "";
                    } else {
                        return redisKeyVars.mapFieldList;
                    }
                }

                that.selVarList.forEach(varBase => {
                    let tmpVarBase = {
                        datasourceId: varBase.datasourceId,
                        dataType: varBase.dataType,
                        prodId: varBase.prodId,
                        type: varBase.type,
                        varsId: varBase.varsId,
                        desc: varBase.desc
                    };
                    // 拼出redis中key的前缀
                    let key = tmpVarBase.datasourceId + "_" + tmpVarBase.type;
                    let redisKeyVars = result.filter(item => item.redisKey === key)[0];
                    let mapFieldList = getMapFieldListByRedisKey(key);
                    // redisKeyVars 不存在初始化
                    if (isEmpty(redisKeyVars)) {
                        result.push(new RedisKeyVars({redisKey: key, varList: [tmpVarBase], mapFieldList: mapFieldList}))
                    } else {
                        // redisKeyVars 存在，向varList添加变量
                        result = result.map(item => {
                            if (item.redisKey === key) {
                                item.varList.push(tmpVarBase);
                                item.mapFieldList = mapFieldList;
                            }
                            return item;
                        })
                    }
                });

                that.redisKeyVarsList = result;
                that.activeNames = that.redisKeyVarsList.map(item=>item.redisKey);
            },

            varSelBefore() {
                let that = this;
                that.varTable.dialog = true;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.varTable)) {
                        that.$refs.varTable.init();
                    }
                });
            },

            varSelAfter(varBase) {
                let isHas = this.selVarList.filter(item=>item.varsId === varBase.varsId).length > 0;
                if (isHas){
                    this.$message({type: 'warning', message: `${varBase.varsId}字段已存在，请勿重复添加`});
                } else {
                    this.selVarList.push(varBase);
                    this.setVarConfigList();
                }

            },
        }
    }
</script>

<style scoped>
    @import "../../../views/common/index.css";

    #varEdit {
        margin-top: 15px;
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    .tools {
        margin-left: 15px;
    }
</style>
