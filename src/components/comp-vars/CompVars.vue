<template>
    <!--
        组合变量节点（变量选取，逻辑图组成）
        变量选取：选取组合变量需要的所有变量
        逻辑图：组合变量生成逻辑
    -->
    <div id="compVars">
        <div ref="sourceRule">
            <el-scrollbar>
            <node-inf :node="node">
                <template slot="right">
                    <el-divider direction="vertical"></el-divider>
                    <el-dropdown trigger="click"  @command="handleCommand">
                        <el-button type="primary" size="mini" :disabled="disabled">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  command="addCompVars">新增</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </node-inf>
<!--            <el-button type="primary" @click="addCompVars">新增</el-button>-->
            <el-card>
                <el-table
                    ref="multipleTable"
                    :data="ruleList"
                    tooltip-effect="dark"
                    stripe
                    border
                    size="mini"
                    @expand-change="expandChange"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <comp-vars-flow-g6 :ref="props.row.ruleId" :rule="props.row"
                                           :unit-rule-input-var-list="RuleRelVarList"
                                           :obj-input-var-list="RuleRelVarList"
                                           :arr-input-var-list="RuleRelVarList"
                                           :disabled="disabled"></comp-vars-flow-g6>
                    </template>
                </el-table-column>
                <el-table-column prop="ruleId" label="变量id"></el-table-column>
                <el-table-column prop="ruleName" label="变量名"></el-table-column>
                <el-table-column prop="status" align="center"  label="变量状态">
                    <template slot-scope="props">
                        <el-tag :type="tagType[props.row.status]" style="width: 60px">{{statusEnums[props.row.status].name}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="240px">
                    <template slot-scope="props">
                        <el-button :disabled="disabled" type="danger" size="mini" @click="varDelete(props['row'])">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </el-card>
            </el-scrollbar>

        </div>
        <!--产品注册-->
        <el-dialog
                title="组合变量新增"
                :modal="false"
                :append-to-body="true"
                :visible.sync="add.dialog">
            <div slot="title">
                <span>组合变量新增</span>
            </div>
            <el-form ref="addFrom" :model="add.rule" :rules="addRules" label-width="100px" size="mini">
                <el-form-item label="变量Id" prop="proId">
                    <el-input v-model="add.rule.ruleId"   style="width: 50%"  maxlength="32" show-word-limit> </el-input>
                </el-form-item>
                <el-form-item label="变量名称" prop="proId">
                    <el-input v-model="add.rule.ruleName"   style="width: 50%"  maxlength="32" show-word-limit> </el-input>
                </el-form-item>
            </el-form>

            <template slot="footer">
                <el-button size="mini" @click="add.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="addClick">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    import { isEmpty, isNotEmpty} from "../../utils";
    import VUnitResult from "../rule-node/children/VUnitResult";
    import VUnitCondition from "../rule-node/children/VUnitCondition";
    import VUnitTmpVar from "../rule-node/children/VUnitTmpVar";
    import resizeForDrawer from "../mixins/resizeForDrawer"
    import NodeInf from "../common/node-inf";
    import {statusEnums, tabType, tagType} from "../../entity/enumns";
    import CompVarsFlowG6 from "./CompVarsFlowG6";
    import {RuleBase,CompVarsRule} from "../../entity/rule";
    import {G6Model} from "../../entity/g6Model";

    export default {
        name: "CompVar",
        mixins: [resizeForDrawer],
        components: {CompVarsFlowG6, NodeInf, VUnitTmpVar, VUnitCondition, VUnitResult},
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
            // 上游传入的变量
            compVarInputVarList: {default: () => [], type: Array},
            disabled: {default: false, type: Boolean},
            // 控制是否可以选择变量类型（String，Integer，Double）
        },
        data() {
            return {
                activeNames: ['tmpVars', 'condition', 'unitResult'],
                // 判断条件数组
                cdList: [],
                // 中间变量数组
                tmpVarList: [],
                // 元规则结果数组
                uResultList: [],
                tabType: tabType,
                tagType:tagType,
                rule: new CompVarsRule(),
                ruleList: [],
                statusEnums :statusEnums,
                // 异常信息
                tmpVarErrorMsg: '',
                uResultErrorMsg: '',
                add: {dialog: false, rule: new CompVarsRule()},

                // 规则能够映射的变量（pTVarList：父节点临时变量, pUResultVarList：父节点输出，pVarPlatformVarList：变量平台变量, unitRuleInputVarList：父组件传入的变量, objVarList对象解析后的变量）
                ruleRelVar: {
                    pTVarList: [],
                    pUResultVarList: [],
                    pVarPlatformVarList: [],
                    compVarInputVarList: [],
                    cmptOutVarList: [],
                    objVarList: [],
                    arrVarList: [],
                    constVarList: [],
                    roVarList: [], //规则输出结果
                },


                addRules: {
                    ruleId: [
                        {required: true, message: '请输入变量id', trigger: 'blur'},
                    ],
                    ruleName: [
                        {required: true, message: '请输入变量名称', trigger: 'blur'},
                    ]
                },

                // 函数方法
                isNotEmpty: isNotEmpty,
                isEmpty: isEmpty
            }
        },


        computed: {
            // 根据规则id获取该规则目前上线的版本
            ruleVersionList() {
                return function (ruleId) {
                    return this.ruleVersionListRelByDecs.filter(rule => rule.ruleId === ruleId);
                }
            },

            /**
             *  规则能够映射的变量
             *
             *  pTVarList：父节点临时变量
             *  pUResultVarList：父节点输出
             *  pVarPlatformVarList：变量平台变量
             *  unitRuleInputVarList：父组件传入的变量
             *  tmpVarList：当前临时变量
             *  cmptOutVarList：父节点组件输出变量
             */
            RuleRelVarList() {
                let result = [];
                //let notNullTmpVarList = this.tmpVarList.filter(tmpVar=>isNotEmpty(tmpVar.varName));
                let compVarInputVarList = this.ruleRelVar.compVarInputVarList;
                //result.push(...notNullTmpVarList);
                result.push(...compVarInputVarList);
                result.push(...this.ruleRelVar.pTVarList);
                result.push(...this.ruleRelVar.pUResultVarList);
                result.push(...this.ruleRelVar.pVarPlatformVarList);
                result.push(...this.ruleRelVar.cmptOutVarList);
                result.push(...this.ruleRelVar.objVarList);
                result.push(...this.ruleRelVar.arrVarList);
                result.push(...this.ruleRelVar.constVarList);
                result.push(...this.ruleRelVar.roVarList);
                return result;
            },

        },

        mounted() {
        },

        watch: {
            rule: {
                handler(value) {
                    let that = this;
                    that.node.nData.rule = value;
                },
                deep: true
            },
            ruleList: {
                handler(value) {
                    let that = this;
                    that.node.nData.ruleList = value;
                },
                deep: true
            }

        },

        methods: {

            handleCommand(command){
                switch (command) {
                    case 'addCompVars':
                        this.addCompVars();
                        break;
                        break;
                }
            },

            expandChange(row,expandedRows){
                let that=this;
                if (expandedRows.length>0){
                    this.$nextTick(()=>{
                        this.$refs[row.ruleId] && this.$refs[row.ruleId].initFlow()
                    })
                }else{
                    that.$message({message: "关闭组合变量时请及时检查是否保存", type: "success"});
                }

            },

            addCompVars(){
                let that = this;
                that.add.dialog = true;
            },


            // 点击添加，添加决策
            addClick() {
                let that = this;
                this.$refs['addFrom'].validate((valid) => {
                    if (valid) {
                        that.add.rule.status=that.statusEnums['0'].code;
                        that.ruleList.push(that.add.rule);
                        that.add = {dialog: false, rule: new CompVarsRule()};
                        that.add.dialog = false;
                    } else {
                        console.log('error submit!!');
                        that.add.dialog = false;
                        return false;
                    }
                });
            },

            varDelete(row){
                let that = this;
                that.ruleList.splice(that.ruleList.findIndex(item => item.ruleId === row.ruleId), 1);
            },

            // 初始化元规则
            init() {
                let that = this;
                isEmpty(that.node.nData.rule) ? that.rule = new CompVarsRule() : that.rule = that.node.nData.rule;
                isEmpty(that.node.nData.ruleList) ? that.ruleList = [] : that.ruleList = that.node.nData.ruleList.map(rule => new CompVarsRule(rule));

               /* this.$nextTick(() => {
                    this.$refs[this.tabType.compVarFlowG6].initFlow();
                })*/


                // 初始化父节点的临时变量
                let pTVarList = [];
                G6Model.getTmpVarVarsOfParents(that.node, pTVarList, new Set(), this.decisionTree);

                // 初始化父节点的节点输出变量
                let pUResultVarList = [];
                G6Model.getUResultVarsOfParents(that.node, pUResultVarList, new Set(), this.decisionTree);


                // 初始化变量平台节点的输出变量
                let pVarPlatformVarList = [];
                G6Model.geVarPlatformVarsOfParents(that.node, pVarPlatformVarList, new Set(), this.decisionTree);

                // 组件输出变量
                let cmptOutVarList = [];
                G6Model.getCmptOutVarsOfParents(that.node, cmptOutVarList, new Set(), this.decisionTree);

                // 对象解析后的变量
                let objVarList = [];
                G6Model.getOBJVarsOfParents(that.node, objVarList, new Set(), this.decisionTree);

                // 数组解析后的变量
                let arrVarList = [];
                G6Model.getArrVarsOfParents(that.node, arrVarList, new Set(), this.decisionTree);

                // 数组解析后的变量
                let constVarList = [];
                G6Model.getConstVarsOfParents(that.node, constVarList, new Set(), this.decisionTree);
                // 父节点的规则结果 074389
                let roVarList = [];
                G6Model.getEResultVarsOfParents(that.node, roVarList, new Set(), this.decisionTree);

                // 设置判断条件能够引用的变量
                that.ruleRelVar.pTVarList = pTVarList;
                that.ruleRelVar.pUResultVarList = pUResultVarList;
                that.ruleRelVar.pVarPlatformVarList = pVarPlatformVarList;
                that.ruleRelVar.cmptOutVarList = cmptOutVarList;
                that.ruleRelVar.objVarList = objVarList;
                that.ruleRelVar.arrVarList = arrVarList;
                that.ruleRelVar.constVarList = constVarList;
                that.ruleRelVar.compVarInputVarList = that.compVarInputVarList;
                that.ruleRelVar.roVarList = roVarList;

            },

        },
    }
</script>

<style scoped>
    @import "../../views/common/index.css";

    #sourceRule {
        width: 100%;
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        margin-top: 15px;
        overflow: auto;
    }

    .tools {
        margin-left: 15px;
    }
</style>
