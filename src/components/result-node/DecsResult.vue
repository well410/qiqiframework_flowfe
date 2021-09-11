<template>
    <!--决策输出节点（整合所有的变量并重命名）-->
    <div id="decsResult" ref="decsResult">

        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled">
                <template slot="right">
                    <el-divider direction="vertical"></el-divider>
                    <el-dropdown trigger="click"  @command="handleCommand">
                        <el-button type="primary" size="mini">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  command="addDROutput">添加</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </node-inf>
            <el-card>
                <el-collapse v-model="activeNames">
                    <el-collapse-item name="1">
                        <template slot="title">
                            <div title="决策图中所有变量列表" style="width: 100%">
                                <div style="float: left">
                                    <div style="line-height: 60px;height: 60px;">决策图变量列表</div>
                                </div>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                            </div>
                        </template>
                        <el-scrollbar>
                            <el-input placeholder="请输入搜索内容" v-model="filter.filterWord" @input="refreshPage" size="mini" style="margin-top: 5px;margin-bottom: 5px">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                            <el-table
                                    :data="filter.pageVarList"
                                    tooltip-effect="dark"
                                    stripe
                                    border
                                    max-height="600px"
                                    row-key="cdId"
                                    size="mini"
                                    style="width: 100%" @select="selectRow" @select-all="selectAll">
                                <el-table-column
                                        type="selection"
                                        width="55" :selectable="isSelectable">
                                </el-table-column>
                                <el-table-column
                                        label="序号"
                                        type="index"
                                        width="55">
                                </el-table-column>
                                <el-table-column prop="varFrom" label="变量名">
                                    <template slot-scope="scope">{{ scope.row.getPrefixVarName()}}</template>
                                </el-table-column>
                                <el-table-column prop="varDesc" label="变量描述">
                                </el-table-column>
                                <el-table-column prop="varType" label="变量类型">
                                </el-table-column>
                            </el-table>
                            <el-pagination background layout="total,prev,pager,next" class="pagination"
                                           @current-change="handleCurrentChange"
                                           :page-size="filter.pageSize"
                                           :total="filter.total"></el-pagination>
                        </el-scrollbar>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template slot="title">
                            <div title="将决策图中变量映射到自定义名称的变量列表" style="width: 100%">
                                <div style="float: left">
                                    <div style="line-height: 60px;height: 60px;">决策图结果变量映射表</div>
                                </div>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                            </div>
                        </template>

                        <el-table
                                :data="decsResultList"
                                tooltip-effect="dark"
                                stripe
                                border
                                max-height="600px"
                                row-key="cdId"
                                size="mini"
                                style="width: 100%">
                            <el-table-column
                                    label="序号"
                                    type="index"
                                    width="55">
                            </el-table-column>
                            <el-table-column prop="varName" label="决策结果字段名">
                                <template slot-scope="props">
                                    {{props.row.varName}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="mapField" label="字段引用或字段值">
                                <template slot-scope="props">
                                    <template v-if="props['row'].fieldFrom === varFromEnums.edit.code">
                                        {{`[${varFromEnums.edit.name}]${props.row.fieldResult}`}}
                                    </template>
                                    <template v-else>
                                        {{`[${varFromEnums.rel.name}]${props.row.mapField}`}}
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="80px">
                                <template slot-scope="props">
                                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-edit" type="primary"  @click="editDecsResultBefore(props['row'])" title="编辑"></el-button>
                                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-delete" type="danger" @click="deleteDecsResult(props.row)" title="删除"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>


        <el-dialog
                :visible.sync="resultEditDialog.isShow"
                title="结果编辑"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                :modal="false"
                width="800px">
            <el-form label-width="120px" ref="resultForm" :model="resultEditDialog.doVar" :rules="resultRules">
                <el-form-item label="决策结果字段名" prop="varName">
                    <el-input size="mini" style="width: 80%" :disabled="disabled"
                              :placeholder="patternEnums.VarName.decs"
                              @input="resultEditDialog.doVar.varName = patternEnums.VarName.varNameFilter(resultEditDialog.doVar.varName)"
                              v-model="resultEditDialog.doVar.varName"></el-input>
                </el-form-item>
                <el-form-item label="结果映射类型" prop="fieldFrom">
                    <el-select :disabled="disabled" v-model="resultEditDialog.doVar.fieldFrom" placeholder="请选择映射类型"
                               clearable
                               filterable
                               style="width: 80%"
                               size="mini">
                        <el-option :label="varFromEnums.edit.name" :key="varFromEnums.edit.code" :value="varFromEnums.edit.code"></el-option>
                        <el-option :label="varFromEnums.rel.name" :key="varFromEnums.rel.code" :value="varFromEnums.rel.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="输入" v-if="resultEditDialog.doVar.fieldFrom === varFromEnums.edit.code">
                    <el-input :disabled="disabled" :title="resultEditDialog.doVar.fieldResult" size="mini" style="width: 80%" v-model="resultEditDialog.doVar.fieldResult"></el-input>
                </el-form-item>
                <el-form-item label="引用" v-else>
                    <el-select :disabled="disabled" v-model="resultEditDialog.doVar.mapField" placeholder="请配置映射参数"
                               clearable
                               filterable
                               :title="resultEditDialog.doVar.mapField"
                               style="width: 80%"
                               size="mini">
                        <el-option v-for="item in drRelVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="resultEditDialog.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="editDecsResultAfter" size="mini">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {patternEnums, varFromEnums} from "../../entity/enumns";
    import {DOVar} from "../../entity/vars";
    import resizeForDrawer from "../mixins/resizeForDrawer"
    import {
        G6Model
    } from "../../entity/g6Model";
    import NodeInf from "../common/node-inf";
    import isEmpty from "@antv/util/esm/is-empty";

    export default {
        name: "DecsResult",
        components: {NodeInf},
        mixins: [resizeForDrawer],
        props: {
            decisionTree: {
                default: () => {
                }, type: Object
            },
            node: {
                default: () => {
                }, type: Object
            },
            disabled: {default: false, type: Boolean},
            pDecs: {
                default: () => {
                }, type: Object
            },
            // 决策结果节点的输入（可以使用的变量：1 决策事件变量 2 规则的输出变量 3 规则临时变量）
            drInputVarList: {default: () => [], type: Array},
        },

        data() {
            return {
                resultRules: {
                    varName: [
                        {required: true, message: '请输入决策结果字段名', trigger: 'blur'},
                    ],
                    fieldFrom: [
                        {required: true, message: '请输入结果映射类型', trigger: 'change'},
                    ]
                },
                resultEditDialog: {isShow: false, doVar : {}},
                decsResultList: [],
                varFromEnums: varFromEnums,
                patternEnums: patternEnums,
                drRelVar: {totalVarList:[],drInputVarList:[]},
                activeNames: ['1','2'],
                filter: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0 ,
                    filterWord: "",
                    pageVarList: []
                }
            }
        },

        watch: {
            decsResultList: {
                handler(value) {
                    let that = this;
                    that.node.nData.decsResultList = value;
                },
                deep: true
            },
        },

        computed:{
            drRelVarList() {
                let result = [];
                result.push(...this.drRelVar.totalVarList);
                result.push(...this.drRelVar.drInputVarList);
                return result;
            }
        },


        mounted() {
        },
        methods: {
            /**
             * 编辑结果之前
             * @param row
             */
            editDecsResultBefore(row){
                this.resultEditDialog.isShow = true;
                this.resultEditDialog.doVar = JSON.parse(JSON.stringify(row));
            },

            /**
             * 编辑结果之后
             */
            editDecsResultAfter(){
                this.$refs['resultForm'].validate((val)=>{
                    if (val){
                        this.decsResultList.forEach(item=>{
                            if (item.uuid === this.resultEditDialog.doVar.uuid){
                                Object.assign(item, this.resultEditDialog.doVar);
                            }
                        });
                        this.resultEditDialog.isShow = false;
                    }
                });
            },

            handleCurrentChange(val){
                this.filter.pageNum = val;
                this.refreshPage();
            },

            refreshPage(){
                const pageNum = this.filter.pageNum;
                const pageSize = this.filter.pageSize;
                const filterWord = this.filter.filterWord;
                let filterList = this.drRelVarList.filter(item => {
                    if (isEmpty(filterWord)){
                        return true;
                    }
                    let b1 = item.getPrefixVarName().toLowerCase().includes(filterWord.toLowerCase());
                    let b2 = item.getSimpleDesc().toLowerCase().includes(filterWord.toLowerCase());
                    return b1 || b2;
                });

                if (filterList.length < pageNum * pageSize){
                    this.filter.pageNum = 1;
                }
                this.filter.total = filterList.length;
                this.filter.pageVarList = filterList.slice((pageNum - 1) * pageSize , pageNum * pageSize);
            },

            handleCommand(command){
                switch (command) {
                    case 'addDROutput':
                        this.addDROutput();
                        break;
                }
            },
            init(){
                let that = this;
                that.isEmpty(that.node.nData.decsResultList) ? that.decsResultList = [] : that.decsResultList = that.node.nData.decsResultList.map(item=>new DOVar(item));

                that.drRelVar.totalVarList = G6Model.getTotalVars(that.decisionTree);
                that.drRelVar.drInputVarList = that.drInputVarList;

                that.refreshPage();

            },

            addDROutput() {
                let that = this;
                that.decsResultList.push(new DOVar({
                    varName: "",
                    varDesc: "",
                    mapField: "",
                    fieldFrom: varFromEnums.rel.code
                }));
            },

            iconClick(row) {
                if (row.fieldFrom === this.varFromEnums.edit.code) {
                    row.fieldFrom = this.varFromEnums.rel.code
                } else {
                    row.fieldFrom = this.varFromEnums.edit.code
                }
                console.log(row)
            },

            deleteDecsResult(row) {
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.decsResultList = this.decsResultList.filter(item => item.uuid !== row.uuid)
                }).catch(() => {});

            },
            selectRow(selection, row){
                if(row.selected===undefined||row.selected===false){
                    row.selected=true;
                }else{
                    row.selected=false;
                }
                let that = this;
                if(row.selected){
                    that.decsResultList.push(new DOVar({
                        varName: row.getPrefixVarName(),
                        varDesc: "",
                        mapField: row.getPrefixVarName(),
                        fieldFrom: varFromEnums.rel.code
                    }));
                }
            },
            selectAll(selection){
                let that = this;
                selection.forEach(item=>{
                    that.decsResultList.push(new DOVar({
                        varName: item.getPrefixVarName(),
                        varDesc: "",
                        mapField: item.getPrefixVarName(),
                        fieldFrom: varFromEnums.rel.code
                    }));
                });
            },
            isSelectable(row, index){
                return !this.disabled;
            }


        }
    }
</script>

<style>
    #decsResult {
        width: 100%;
        height: 100%;
        overflow: auto;
        min-height: 100%;
    }

    #decsResult .tools {
        margin-left: 15px;
    }

    #decsResult .el-table__header .el-checkbox{
        display:none !important
    }
</style>
