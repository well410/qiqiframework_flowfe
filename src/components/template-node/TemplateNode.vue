<template>
    <!--
        元规则节点（中间变量，判断条件，元规则结果组成）
        中间变量：引用函数生成（见VUnitTmpVar.vue）
        判断条件：引用父节点的变量生成true和false的逻辑（见VUnitCondition.vue）
        元规则结果：通过判断条件进行逻辑组合，生成对应的结果（见VUnitResult.vue）
    -->
    <div id="sourceRule" ref="sourceRule" style="min-height: 100%">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled"></node-inf>
            <el-card class="node-content-card">

                <el-collapse>
                <!--中间变量-->
                <el-collapse-item name="tmpVars">
                    <template slot="title">
                        <div title="权限列表" >
                            <span>权限列表</span>
                            <i class="header-icon el-icon-info"></i>
                            <el-button :disabled="disabled" icon="el-icon-plus" size="mini" @click.stop="addBeforeClick" class="node-set-button">添加</el-button>
                        </div>
<!--                        <div>-->
<!--                            <el-button :disabled="disabled" icon="el-icon-plus" size="mini" @click.stop="addBeforeClick" class="node-set-button">添加</el-button>-->
<!--                        </div>-->
                    </template>

                    <el-table
                            ref="prodIdTable"
                            :data="prodIdList"
                            tooltip-effect="dark"
                            stripe
                            border
                            size="mini"
                            max-height="230px"
                            style="width: 100%">
                        <el-table-column align="center"  fixed label="产品编号" width="300px">
                            <template slot-scope="props">
                                <el-input readonly v-model="props.row.prodId" size="mini"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column align="center"  label="操作" fixed="right" width="100px">
                            <template slot-scope="props">
                                <el-button :disabled="disabled" class="icon-button" icon="el-icon-delete" type="danger" size="mini" @click="prodIdDeleteClick(props.row)" title="删除"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>






                </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>


        <el-dialog :visible.sync="add.dialog"
                   :modal="false"
                   :close-on-click-modal="false" class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">节点权限配置
                        <i class="el-icon-question icon-Add-style"></i></div>
                </div>
            </div>

            <el-form size="mini" label-width="80px" >
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="产品ID:">
                            <el-select v-model="add.tempLateProdVars.prodId" placeholder="产品ID">
                                <el-option v-for="(prodId) in curAllProd" :label="prodId" :value="prodId" :key="JSON.stringify(prodId)"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>


                </el-row>
            </el-form>
            <template slot="footer">
                <el-button type="" size="mini" @click="add.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="addOrEditAfter">确定</el-button>
            </template>
        </el-dialog>

    </div>
</template>

<script>

    import { isEmpty, isNotEmpty} from "../../utils";
    import {TempLateProdVars} from "../../entity/vars";
    import resizeForDrawer from "../mixins/resizeForDrawer"
    import NodeInf from "../common/node-inf";
    import {getAllProdId} from "../../api/Template";

    export default {
        name: "TemplateNode",
        mixins:[resizeForDrawer],
        components: {NodeInf},
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
                // 中间变量数组
                prodIdList: [],
                prodIdItems: [],
                add: {dialog: false, tempLateProdVars:new TempLateProdVars},
                // 异常信息
                tmpVarErrorMsg: '',
                // 函数方法
                isNotEmpty: isNotEmpty,
                isEmpty: isEmpty,
                curAllProd: []
            }
        },

        computed: {

        },

        watch: {
            prodIdList: {
                handler(value) {
                    let that = this;
                    that.node.nData.prodIdList = value;
                },
                deep: true
            },
        },

        mounted() {
            this.getAllProd();
        },

        methods: {


            // 初始化
            init() {
                let that = this;
                isEmpty(that.node.nData.prodIdList) ? that.prodIdList = [] : that.prodIdList = that.node.nData.prodIdList.map(item => new TempLateProdVars(item));
            },

            // 添加临时变量
            addBeforeClick() {
                this.add.dialog = true
            },
            // 编辑或者添加之后
            addOrEditAfter(){
                let that = this;
                let tempLateProdVars={};
                Object.assign(tempLateProdVars,that.add.tempLateProdVars);
                if (isEmpty(that.prodIdList.filter(tempVars=>tempLateProdVars.prodId===tempVars.prodId))){
                    that.prodIdList.push(tempLateProdVars);
                }
                that.add.tempLateProdVars=new TempLateProdVars;
                that.add.dialog = false
            },

            // 删除临时变量
            prodIdDeleteClick(row) {
                let that = this;
                that.prodIdList = that.prodIdList.filter(
                    tmpVar => tmpVar.uuid !== row.uuid
                );
            },

            // 获取所有产品
            getAllProd() {
                let that = this;
                that.curAllProd = [];
                getAllProdId().then(res => {
                    that.curAllProd = res.data.data;
                })
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
