<template>
    <div id="middle-var">
        <!--元规则临时变量-->
        <comm-var-table-inf :p-var-list="pTmpVarList">
            <el-table-column prop="funName" align="center"  label="函数名">
                <template slot-scope="props">
                    <template v-if="isNotEmpty(props.row.func.funcId)">
                        <template v-if="isNotEmpty(props.row.func.funcVersion)">{{`${props.row.func.funcId}(${props.row.func.funcVersion})`}}</template>
                        <template v-else>{{props.row.func.funcId}}</template>
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="inputParams" align="center"  label="输入参数">
                <template slot-scope="props">
                    {{isNotEmpty(props.row.inputParams) ? props.row.inputParams.map(item=>`[${item}]`).join(",") : "无输入参数"}}
                </template>
            </el-table-column>
            <el-table-column align="center"  label="操作" fixed="right" width="80px">
                <template slot-scope="props">
                    <el-button :disabled="disabled" class="icon-button" icon="el-icon-edit" type="primary" size="mini" @click="editClick(props.row)" title="编辑"></el-button>
                    <el-button :disabled="disabled" class="icon-button" icon="el-icon-delete" type="danger" size="mini" @click="deleteClick(props.row)" title="删除"></el-button>
                </template>
            </el-table-column>
        </comm-var-table-inf>

        <!--中间变量-->
        <el-dialog :visible.sync="addOrEdit.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">中间变量设置
                        <i class="el-icon-question icon-Add-style"></i></div>
                </div>
            </div>
            <div class="common-title">{{messageEnums.CONFIG_OF_FIELD.name}}</div>
            <comm-var-inf :p-var="addOrEdit.tVar" :p-alias-list="pFunRefVarList" ref="commVarInf"></comm-var-inf>
            <div class="common-title">{{messageEnums.CONFIG_OF_FUNC.name}}</div>
            <el-form size="mini" label-width="80px" >
                <el-row type="flex" justify="space-between">
                    <el-col :xs="24" :sm="16" :md="18" :lg="18" :xl="20">
                        <el-form-item label="函数ID:">
                            <el-tooltip class="item" effect="dark" :content="addOrEdit.tVar.func.funcId+'('+addOrEdit.tVar.func.funcVersion+')'" placement="top"  v-if="isNotEmpty(addOrEdit.tVar.func.funcId)">
                                <el-tag class="func-col-tag" size="mini">
                                    <span>{{addOrEdit.tVar.func.funcId}}</span>
                                    <span v-if="isNotEmpty(addOrEdit.tVar.func.funcVersion)">({{addOrEdit.tVar.func.funcVersion}})</span>
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
                    <el-form-item label="函数参数:" v-if="isNotEmpty(addOrEdit.tVar.func.funcId)">
                        <div>
                            <el-transfer
                                    v-model="inputParamsOfKey"
                                    filterable
                                    target-order="push"
                                    ref="transfer"
                                    :titles="['可选参数', '输入参数']"
                                    :data="transferData">
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

                <el-form-item label="函数源码:" v-if="isNotEmpty(addOrEdit.tVar.func.funcId)">
                    <codemirror-show :p-code="addOrEdit.tVar.func.funcDrl"></codemirror-show>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="addOrEditAfter">确定</el-button>
            </template>
        </el-dialog>

        <!--函数选择-->
        <el-dialog :visible.sync="funDialog.isShow"
                   :modal="false"
                   :append-to-body="true"
                   :close-on-click-modal="false"
                   class="node-new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{funDialog.title}}</div>
                </div>
            </div>
            <func-table ref="funcTable"
                        :p-decision-tree="decisionTree"
                        @funSelClick="funSelClick"></func-table>
        </el-dialog>
    </div>
</template>

<script>
    import FuncTable from "../../func/FuncTable";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import {messageEnums, patternEnums} from "../../../entity/enumns";
    import {TVars} from "../../../entity/vars";
    import {FuncVersion} from "../../../entity/fun";
    import CodemirrorShow from "../../codemirror/CodemirrorShow";
    import CommVarInf from "../../common/CommVarInf";
    import CommVarTableInf from "../../common/CommVarTableInf";

    export default {
        name: "VUnitTmpVar",
        components: {CommVarTableInf, CommVarInf, CodemirrorShow, FuncTable},
        props: {
            decisionTree: Object,
            pTmpVarList: {default: ()=>[], type: Array},
            pFunRefVarList: {default: ()=>[], type: Array},
            disabled: {default: false, type: Boolean},
            pRule: {default: ()=>{}, type: Object},
            pDecs: {default: ()=>{}, type: Object},
            node: Object
        },

        data() {
            return {
                funDialog: {isShow: false, title: "函数选择"},
                patternEnums: patternEnums,
                messageEnums:messageEnums,
                addOrEdit: {
                    dialog: false,
                    tVar: {func: {}},
                    type: "add"
                },

                // 穿梭框数据
                transferData: [],
                // 输入参数的key
                inputParamsOfKey: [],

                isNotEmpty: isNotEmpty
            }
        },


        methods: {
            // 删除临时变量
            deleteClick(row) {
                // 对象引用发生变化，父组件去修改对象值
                this.$confirm('确定要删除临时变量吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.$emit("deleteClick", row);
                }).catch(() => {});
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

            // 函数选择之后
            // 对象引用未发生变化，仅对象中属性发生变化，由子组件修改即可
            funSelClick(func) {
                let that = this;
                that.addOrEdit.tVar.func = func;
                that.funDialog.isShow = false;
            },

            // 删除函数
            // 对象引用未发生变化，仅对象中属性发生变化，由子组件修改即可
            deleteSelFunc() {
                this.addOrEdit.tVar.func = {}
            },


            // 添加临时变量之前
            addBefore() {
                let that = this;
                this.addOrEdit = {
                    dialog: true,
                    tVar: new TVars({
                        varName: "",
                        varDesc: "",
                        func: new FuncVersion(),
                        nodeId: that.node['nData']['uniqueName'], // 074389 使用node.id的话变量名是一串uuid，懵
                        ruleId: isEmpty(that.pRule) ? "" : that.pRule.ruleId,
                        decsId: isEmpty(that.pDecs) ? "" : that.pDecs.decsId,
                        inputParams: []
                    }),
                    type: "add"
                };

                // 初始化穿梭框
                this.transferData = this.pFunRefVarList.map(item=>{
                    return {key:item.getPrefixVarName(), label: `${item.getPrefixVarName()} ${item.getSimpleDesc()}`}
                });
                this.inputParamsOfKey = [];

            },

            // 编辑或者添加之后
            addOrEditAfter(){
                let that = this;
                that.$refs.commVarInf.validate().then(res=>{
                   if (res){
                       that.addOrEdit.tVar.inputParams = that.inputParamsOfKey;
                       if (that.addOrEdit.type === 'add'){
                           that.pTmpVarList.push(this.addOrEdit.tVar)
                       } else {
                           that.pTmpVarList.forEach(item=>{
                               if (item.uuid === that.addOrEdit.tVar.uuid){
                                   Object.assign(item, that.addOrEdit.tVar)
                               }
                           })
                       }
                       that.addOrEdit.dialog = false
                   }
                });
            },

            // 编辑按钮点击
            editClick(row){
                let tVar = TVars.obj2TVars(JSON.parse(JSON.stringify(row)));
                this.addOrEdit = {
                    dialog: true,
                    tVar: tVar,
                    type: "edit"
                };

                this.transferData = this.pFunRefVarList.map(item=>{
                    return {key:item.getPrefixVarName(), label: `${item.getPrefixVarName()} ${item.getSimpleDesc()}`}
                });

                const keyList = this.transferData.map(item=>item.key);
                this.inputParamsOfKey = tVar.inputParams.filter(item => {
                    return keyList.includes(item)
                });
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
                    let indexOf = this.inputParamsOfKey.indexOf(item);
                    if (indexOf > 0) {
                        let preItem = that.inputParamsOfKey[indexOf - 1];
                        let curItem = that.inputParamsOfKey[indexOf];
                        that.inputParamsOfKey.splice(indexOf - 1, 2, curItem, preItem)
                    }
                });
            },

            // 向下
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
                    let indexOf = this.inputParamsOfKey.indexOf(item);
                    if (indexOf < this.inputParamsOfKey.length - 1) {
                        let curItem = that.inputParamsOfKey[indexOf];
                        let nextItem = that.inputParamsOfKey[indexOf + 1];
                        that.inputParamsOfKey.splice(indexOf, 2, nextItem, curItem)
                    }
                });
            },

        }
    }
</script>

<style scoped>
    .transfer-footer {
        padding: 6px 5px;
    }

</style>
