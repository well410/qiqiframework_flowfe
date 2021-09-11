<template>
    <div id="func-opt">
        <div class="common-title">{{messageEnums.CONFIG_OF_FIELD.name}}</div>
        <comm-var-inf ref="commVarInf" :disabled="disabled" :p-var="pDataProcessVar" :p-alias-list="pFunRefVarList"></comm-var-inf>
        <div class="common-title">{{messageEnums.CONFIG_OF_FUNC.name}}</div>
        <el-form size="mini" label-width="80px" >
            <el-row type="flex" justify="space-between">
                <el-col :xs="24" :sm="16" :md="18" :lg="18" :xl="20">
                    <el-form-item label="函数ID:">
                        <el-tooltip class="item" effect="dark" :content="pDataProcessVar.func.funcId+'('+pDataProcessVar.func.funcVersion+')'" placement="top"  v-if="isNotEmpty(pDataProcessVar.func.funcId)">
                            <el-tag class="func-col-tag" size="mini">
                                <span>{{pDataProcessVar.func.funcId}}</span>
                                <span v-if="isNotEmpty(pDataProcessVar.func.funcVersion)">({{pDataProcessVar.func.funcVersion}})</span>
                            </el-tag>
                        </el-tooltip>
                        <el-tag class="func-col-tag" size="mini" v-else></el-tag>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="4" :md="3" :lg="3" :xl="2">
                    <el-form-item class="button-form">
                        <el-button type="primary" @click="funSelBefore">选择</el-button>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="4" :md="3" :lg="3" :xl="2">
                    <el-form-item class="button-form">
                        <el-button type="danger" @click="deleteSelFunc">删除</el-button>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-form-item label="函数参数:" v-if="isNotEmpty(pDataProcessVar.func.funcId)">
                    <div>
                        <el-transfer
                                style="text-align: left; display: inline-block"
                                v-model="pDataProcessVar.inputParams"
                                filterable
                                target-order="push"
                                ref="transfer"
                                :titles="['可选参数', '输入参数']"
                                :data="computeTransferData">
                            <template slot-scope="{ option }">
                                <span :title="option.label">{{ option.label }}</span>
                            </template>
                            <div slot="right-footer">
                                <el-button size="mini" type="primary" @click="upClick">上移</el-button>
                                <el-button size="mini" type="primary" @click="downClick">下移</el-button>
                            </div>
                        </el-transfer>
                    </div>
                </el-form-item>
            </el-row>

            <el-form-item label="函数源码:" v-if="isNotEmpty(pDataProcessVar.func.funcId)">
                <codemirror-show :p-code="pDataProcessVar.func.funcDrl"></codemirror-show>
            </el-form-item>
        </el-form>


        <el-dialog :visible.sync="funDialog.isShow"
                   :modal="false"
                   :close-on-click-modal="false" class="node-new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{funDialog.title}}</div>
                </div>
            </div>
            <func-table ref="funcTable" :p-decision-tree="pDecisionTree" @funSelClick="funSelAfter"></func-table>
        </el-dialog>
    </div>
</template>

<script>
    import CodemirrorShow from "../codemirror/CodemirrorShow";
    import FuncTable from "../func/FuncTable";
    import {isNotEmpty} from "../../utils";
    import {dataTypeEnums, messageEnums, patternEnums} from "../../entity/enumns";
    import CommVarInf from "../common/CommVarInf";

    export default {
        name: "func-opt",
        components: {CommVarInf, FuncTable, CodemirrorShow},
        props: {
            disabled: {default: false, type: Boolean},
            pDataProcessVar: {default: () => {}, type: Object, required: true},
            pFunRefVarList: {default: ()=>[], type: Array},
            pDecisionTree: Object
        },
        data() {
            return {
                funDialog: {isShow: false, title: "函数选择"},
                patternEnums: patternEnums,
                dataTypeEnums: dataTypeEnums,
                messageEnums:messageEnums,
                // 穿梭框数据
                transferData: [],
                // 输入参数的key
                inputParamsOfKey: [],
                isNotEmpty: isNotEmpty
            }
        },

        computed: {
            computeTransferData() {
                return this.pFunRefVarList.map(item=>{
                    return {key:item.getPrefixVarName(), label: `${item.getPrefixVarName()} ${item.getSimpleDesc()}`}
                })
            }
        },

        methods: {
            /**
             * 验证组件
             */
            validate(){
                // 过滤掉不存在的变量
                this.pDataProcessVar.inputParams = this.pDataProcessVar.inputParams.filter(inputParam=>this.pFunRefVarList.map(refVar => refVar.getPrefixVarName()).includes(inputParam));
                return this.$refs['commVarInf'].validate();
            },

            /**
             * 提交该组件
             * @param onErrorFunc：异常时的回调函数
             * @param onSuccessFunc：正常情况下的回调函数
             */
            submitForm(onErrorFunc, onSuccessFunc) {
                this.$refs['commVarInf'].submitForm(onErrorFunc, onSuccessFunc);
            },

            resetForm() {
                this.$refs['commVarInf'].resetFields();
            },

            // 选择函数之前（弹框出需要选择的函数）
            funSelBefore() {
                let that = this;
                that.funDialog.isShow = true;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.funcTable)) {
                        that.$refs.funcTable.refreshPage();
                    }
                });
            },

            funSelAfter(func) {
                let that = this;
                that.pDataProcessVar.func = func;
                that.funDialog.isShow = false;
            },

            // 删除函数
            deleteSelFunc() {
                this.pDataProcessVar.func = {}
            },

            // 向上
            upClick(){
                const rightChecked = this.$refs.transfer.rightChecked;
                let that = this;
                if (rightChecked.length > 1){
                    that.$message({
                        message: '请勾选一个参数',
                        type: 'warning'
                    });
                    return
                }
                rightChecked.forEach(item => {
                    let indexOf = this.pDataProcessVar.inputParams.indexOf(item);
                    if (indexOf > 0) {
                        let preItem = that.pDataProcessVar.inputParams[indexOf - 1];
                        let curItem = that.pDataProcessVar.inputParams[indexOf];
                        that.pDataProcessVar.inputParams.splice(indexOf - 1, 2, curItem, preItem)
                    }
                });
            },

            downClick() {
                const rightChecked = this.$refs.transfer.rightChecked;
                let that = this;
                if (rightChecked.length > 1){
                    that.$message({
                        message: '请勾选一个参数',
                        type: 'warning'
                    });
                    return
                }
                rightChecked.forEach(item => {
                    let indexOf = this.pDataProcessVar.inputParams.indexOf(item);
                    if (indexOf < this.pDataProcessVar.inputParams.length - 1) {
                        let curItem = that.pDataProcessVar.inputParams[indexOf];
                        let nextItem = that.pDataProcessVar.inputParams[indexOf + 1];
                        that.pDataProcessVar.inputParams.splice(indexOf, 2, nextItem, curItem)
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
