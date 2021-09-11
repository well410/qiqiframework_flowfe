<template>
    <!--规则输出节点（整合所有的变量并重命名）-->
    <div id="ruleResult" ref="ruleResult">

        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled">
                <template slot="right">
                    <el-divider direction="vertical"></el-divider>
                    <el-dropdown trigger="click"  @command="handleCommand">
                        <el-button type="primary" size="mini">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  command="addRROutput">添加</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </node-inf>

            <el-card>
                <el-collapse v-model="activeNames">
                    <el-collapse-item name="1">
                        <template slot="title">
                            <div title="规则图中所有变量列表" style="width: 100%">
                                <div style="float: left">
                                    <div style="line-height: 60px;height: 60px;">规则图变量列表</div>
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
                                        width="55" :selectable="isSelectable" >
                                </el-table-column>
                                <el-table-column
                                        label="序号"
                                        type="index"
                                        width="55">
                                </el-table-column>
                                <el-table-column prop="varFrom" label="变量名">
                                    <template slot-scope="scope">{{ scope.row.getPrefixVarName()}}</template>
                                </el-table-column>
                                <el-table-column prop="varDesc" label="变量描述"></el-table-column>
                                <el-table-column prop="varType" label="变量类型"></el-table-column>
                            </el-table>
                            <el-pagination background layout="total,prev,pager,next" class="pagination"
                                           @current-change="handleCurrentChange"
                                           :page-size="filter.pageSize"
                                           :total="filter.total"></el-pagination>
                        </el-scrollbar>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template slot="title">
                            <div title="将规则图中变量映射到自定义名称的变量列表" style="width: 100%">
                                <div style="float: left">
                                    <div style="line-height: 60px;height: 60px;">规则图结果变量映射表</div>
                                </div>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                            </div>
                        </template>


                        <el-table
                                :data="ruleResultList"
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
                            <el-table-column prop="varName" label="规则结果字段名">
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
                            <el-table-column label="结果描述" width="250px" >
                                <template slot-scope="scope">
                                    {{scope['row'].varDesc}}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="80px">
                                <template slot-scope="props">
                                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-edit" type="primary"  @click="editRuleResultBefore(props['row'])" title="编辑"></el-button>
                                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-delete" type="danger" @click="deleteRuleResult(props.row)" title="删除"></el-button>
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
            <el-form label-width="120px" ref="resultForm" :model="resultEditDialog.roVar" :rules="resultRules">
                <el-form-item label="决策结果字段名" prop="varName">
                    <el-input size="mini" style="width: 80%" :disabled="disabled"
                              :placeholder="patternEnums.VarName.decs"
                              @input="resultEditDialog.roVar.varName = patternEnums.VarName.varNameFilter(resultEditDialog.roVar.varName)"
                              v-model="resultEditDialog.roVar.varName"></el-input>
                </el-form-item>
                <el-form-item label="结果映射类型" prop="fieldFrom">
                    <el-select :disabled="disabled" v-model="resultEditDialog.roVar.fieldFrom" placeholder="请选择映射类型"
                               clearable
                               filterable
                               style="width: 80%"
                               size="mini">
                        <el-option :label="varFromEnums.edit.name" :key="varFromEnums.edit.code" :value="varFromEnums.edit.code"></el-option>
                        <el-option :label="varFromEnums.rel.name" :key="varFromEnums.rel.code" :value="varFromEnums.rel.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="输入" v-if="resultEditDialog.roVar.fieldFrom === varFromEnums.edit.code">
                    <el-input :disabled="disabled" :title="resultEditDialog.roVar.fieldResult" size="mini" style="width: 80%" v-model="resultEditDialog.roVar.fieldResult"></el-input>
                </el-form-item>
                <el-form-item label="引用" v-else>
                    <el-select :disabled="disabled" v-model="resultEditDialog.roVar.mapField" placeholder="请配置映射参数"
                               clearable
                               filterable
                               :title="resultEditDialog.roVar.mapField"
                               style="width: 80%"
                               size="mini">
                        <el-option v-for="item in rrRelVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="结果描述">
                    <el-input :disabled="disabled" :title="resultEditDialog.roVar.varDesc" size="mini" style="width: 80%" v-model="resultEditDialog.roVar.varDesc"></el-input>
                </el-form-item>

            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="resultEditDialog.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="editRuleResultAfter" size="mini">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {patternEnums, varFromEnums, varTypeEnums} from "../../entity/enumns";
    import {DOVar, ROVar} from "../../entity/vars";
    import resizeForDrawer from "../mixins/resizeForDrawer"
    import {
        G6Model
    } from "../../entity/g6Model";
    import NodeInf from "../common/node-inf";
    import {isEmpty} from "../../utils";

    export default {
        name: "RuleResult",
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
            pRule: {
                default: () => {
                }, type: Object
            },
            // 规则结果节点的输入（可以使用的变量：1 规则事件变量 2 规则的输出变量 3 规则临时变量）
            rrInputVarList: {default: () => [], type: Array},
        },

        data() {
            return {
                resultEditDialog: {isShow: false, roVar : {}},
                resultRules: {
                    varName: [
                        {required: true, message: '请输入决策结果字段名', trigger: 'blur'},
                    ],
                    fieldFrom: [
                        {required: true, message: '请输入结果映射类型', trigger: 'change'},
                    ]
                },
                ruleResultList: [],
                varFromEnums: varFromEnums,
                patternEnums: patternEnums,
                varTypeEnums: varTypeEnums,
                rrRelVar: {
                    totalVarList:[],
                    rrInputVarList: [],
                },
                activeNames:["1","2"],
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
            ruleResultList: {
                handler(value) {
                    let that = this;
                    that.node.nData.ruleResultList = value;
                },
                deep: true
            },
        },

        computed:{

            rrRelVarList() {
                let result = [];
                result.push(...this.rrRelVar.totalVarList);
                result.push(...this.rrRelVar.rrInputVarList);
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
            editRuleResultBefore(row){
                this.resultEditDialog.isShow = true;
                this.resultEditDialog.roVar = JSON.parse(JSON.stringify(row));
            },

            /**
             * 编辑结果之后
             */
            editRuleResultAfter(){
                this.$refs['resultForm'].validate((val)=>{
                    if (val){
                        this.ruleResultList.forEach(item=>{
                            if (item.uuid === this.resultEditDialog.roVar.uuid){
                                Object.assign(item, this.resultEditDialog.roVar);
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
                let filterList = this.rrRelVarList.filter(item => {
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
                    case 'addRROutput':
                        this.addRROutput();
                        break;
                }
            },
            init(){
                let that = this;
                console.log(JSON.stringify(that.node.nData.ruleResultList));
                that.isEmpty(that.node.nData.ruleResultList) ? that.ruleResultList = [] : that.ruleResultList = that.node.nData.ruleResultList.map(item=>new ROVar(item));

                that.rrRelVar.totalVarList = G6Model.getTotalVars(that.decisionTree);
                that.rrRelVar.rrInputVarList = that.rrInputVarList;
                that.refreshPage();
            },

            addRROutput() {
                let that = this;
                that.ruleResultList.push(new ROVar({
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

            deleteRuleResult(row) {
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.ruleResultList = this.ruleResultList.filter(item => item.uuid !== row.uuid)
                }).catch(() => {});
            },
            selectRow(selection, row) {
                if (row.selected === undefined || row.selected === false) {
                    row.selected = true;
                } else {
                    row.selected = false;
                }
                let that = this;
                if (row.selected) {
                    that.ruleResultList.push(new ROVar({
                        varName: row.getPrefixVarName(),
                        varDesc: row.varDesc,
                        mapField: row.getPrefixVarName(),
                        fieldFrom: varFromEnums.rel.code
                    }));
                }
            },
            selectAll(selection){
                let that = this;
                selection.forEach(item=>{
                    that.ruleResultList.push(new ROVar({
                        varName: item.getPrefixVarName(),
                        varDesc: item.varDesc,
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
    #ruleResult {
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    #ruleResult .tools {
        margin-left: 15px;
    }

    #ruleResult .el-table__header .el-checkbox{
        display:none !important
    }
</style>
