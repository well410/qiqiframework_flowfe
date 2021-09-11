<template>
    <!--元规则判断条件-->
    <div>

        <rule-comm-cd-table :p-cd-list="pCdList" :is-need-add="isShowAddNeed" @onAddClick="addBefore">
            <el-table-column align="center" label="操作" width="80x">
                <template slot-scope="scope">
                    <el-button :disabled="disabled" type="primary" class="icon-button" icon="el-icon-edit" size="mini" @click="editBefore(scope['row'])" title="编辑"></el-button>
                    <el-button :disabled="disabled" type="danger" class="icon-button" icon="el-icon-delete" size="mini" @click="deleteClick(scope['row'])" title="删除"></el-button>
                </template>
            </el-table-column>
        </rule-comm-cd-table>

        <!--判断条件-->
        <el-dialog :visible.sync="addOrEdit.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   class="node-new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">判断条件设置</div>
                </div>
            </div>
            <el-form size="mini" label-width="80px" style="padding: 0 20px">
                <el-form-item label="条件序号">
                    <el-input disabled v-model="addOrEdit.condition.cdId"></el-input>
                </el-form-item>

                <el-form-item label="条件逻辑">
                    <el-row type="flex">
                        <!--左边变量-->
                        <div>
                            <template v-if="varFromEnums.edit.code === addOrEdit.condition.leftVarFrom">
                                <el-input v-model="addOrEdit.condition.leftVarValue" class="vuc-input-width" :placeholder="messageEnums.CD_EDIT_PLACEHOLDER.name"></el-input>
                            </template>
                            <template v-else>
                                <el-select :disabled="disabled || isLockLeft"
                                           size="mini"
                                           filterable
                                           v-model="addOrEdit.condition.leftVarName"
                                           @change="varNameChange($event, addOrEdit.condition, 'left')" :placeholder="messageEnums.CD_REL_PLACEHOLDER.name">
                                    <el-option v-for="leftVar in pCdRelVarList"
                                               :key="leftVar.getPrefixVarName()"
                                               :label="leftVar.getDescVarName()"
                                               :value="leftVar.getPrefixVarName()">
                                        <span :title="leftVar.getPrefixVarName()" class="option-left">{{leftVar.getPrefixVarName()}}</span>
                                        <span :title="leftVar.getSimpleDesc()" class="option-right">{{leftVar.getSimpleDesc()}}</span>
                                    </el-option>
                                </el-select>
                            </template>
                            <el-icon v-if="!disabled && !isLockLeft" class="el-icon-edit vuc-icon" title="输入"
                                     @click.native="addOrEdit.condition.leftVarFrom = varFromEnums.edit.code"></el-icon>
                            <el-icon v-if="!disabled && !isLockLeft" class="el-icon-link vuc-icon" title="引用临时或事件变量"
                                     @click.native="addOrEdit.condition.leftVarFrom = varFromEnums.rel.code"></el-icon>
                        </div>
                        <!--操作符-->
                        <div class="vuc-margin">
                            <el-select :disabled="disabled || isLockLeft" size="mini"
                                       @change="varTypeChange(addOrEdit.condition)"
                                       style="width: 100px"
                                       v-model="addOrEdit.condition.cdVarType">
                                <el-option :label="dataTypeEnums.STRING.code" :value="dataTypeEnums.STRING.code" :key="dataTypeEnums.STRING.code"></el-option>
                                <el-option :label="dataTypeEnums.INTEGER.code" :value="dataTypeEnums.INTEGER.code" :key="dataTypeEnums.INTEGER.code"></el-option>
                                <el-option :label="dataTypeEnums.DOUBLE.code" :value="dataTypeEnums.DOUBLE.code" :key="dataTypeEnums.DOUBLE.code"></el-option>
                                <el-option :label="dataTypeEnums.TIMESTAMP.code" :value="dataTypeEnums.TIMESTAMP.code" :key="dataTypeEnums.TIMESTAMP.code"></el-option>
                                <el-option :label="dataTypeEnums.ARRAY.code" :value="dataTypeEnums.ARRAY.code" :key="dataTypeEnums.ARRAY.code"></el-option>
                                <el-option :label="dataTypeEnums.OBJECT.code" :value="dataTypeEnums.OBJECT.code" :key="dataTypeEnums.OBJECT.code"></el-option>
                                <el-option :label="dataTypeEnums.BOOLEAN.code" :value="dataTypeEnums.BOOLEAN.code" :key="dataTypeEnums.BOOLEAN.code"></el-option>
                            </el-select>
                        </div>
                        <!--操作函数-->
                        <div class="vuc-margin">
                            <el-select :disabled="disabled"
                                       size="mini"
                                       style="width: 100px"
                                       v-model="addOrEdit.condition.cdOpt" placeholder="请选择">
                                <el-option v-for="opt in computeOptList" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                            </el-select>
                        </div>
                        <!--右边变量-->
                        <div class="vuc-margin" v-if="computeSingleOpt">
                            <template v-if="varFromEnums.edit.code === addOrEdit.condition.rightVarFrom">
                                <el-input v-model="addOrEdit.condition.rightVarValue"
                                          :placeholder="messageEnums.CD_EDIT_PLACEHOLDER.name"
                                          class="vuc-input-width"></el-input>
                            </template>
                            <template v-else-if="varFromEnums.varPlatform.code === addOrEdit.condition.rightVarFrom">
                                <span>{{addOrEdit.condition.rightVarObj.varsId}}</span>
                            </template>
                            <template v-else>
                                <el-select :disabled="disabled"
                                           size="mini"
                                           filterable
                                           v-model="addOrEdit.condition.rightVarName"
                                           @change="varNameChange($event, addOrEdit.condition, 'right')" :placeholder="messageEnums.CD_REL_PLACEHOLDER.name">
                                    <el-option v-for="rightVar in pCdRelVarList"
                                               :key="rightVar.getPrefixVarName()"
                                               :label="rightVar.getDescVarName()"
                                               :value="rightVar.getPrefixVarName()">
                                        <span :title="rightVar.getPrefixVarName()" class="option-left">{{rightVar.getPrefixVarName()}}</span>
                                        <span :title="rightVar.getSimpleDesc()" class="option-right">{{rightVar.getSimpleDesc()}}</span>
                                    </el-option>
                                </el-select>
                            </template>
                            <el-icon v-if="!disabled" class="el-icon-edit vuc-icon" title="输入"
                                     @click.native="addOrEdit.condition.rightVarFrom = varFromEnums.edit.code"></el-icon>
                            <el-icon v-if="!disabled" class="el-icon-link vuc-icon" title="引用临时或事件变量"
                                     @click.native="addOrEdit.condition.rightVarFrom = varFromEnums.rel.code"></el-icon>
                        </div>
                    </el-row>
                </el-form-item>

                <el-form-item label="变量信息">
                    <el-row>
                        <el-col :span="12">
                            <template v-if="varFromEnums.rel.code === addOrEdit.condition.leftVarFrom">
                                <el-form>
                                    <el-form-item label="变量名">{{computePVNByName(addOrEdit.condition.leftVarName)}}
                                    </el-form-item>
                                    <el-form-item label="变量描述">{{computeDecsByName(addOrEdit.condition.leftVarName)}}
                                    </el-form-item>
                                </el-form>
                            </template>
                            <template v-else>
                                <el-form>
                                    <el-form-item label="输入值">{{addOrEdit.condition.leftVarValue}}</el-form-item>
                                </el-form>
                            </template>
                        </el-col>
                        <el-col :span="12" v-if="computeSingleOpt">
                            <template v-if="varFromEnums.rel.code === addOrEdit.condition.rightVarFrom">
                                <el-form>
                                    <el-form-item label="变量名">{{computePVNByName(addOrEdit.condition.rightVarName)}}</el-form-item>
                                    <el-form-item label="变量描述">{{computeDecsByName(addOrEdit.condition.rightVarName)}}</el-form-item>
                                </el-form>
                            </template>
                            <template v-else>
                                <el-form>
                                    <el-form-item label="输入值">{{addOrEdit.condition.rightVarValue}}</el-form-item>
                                </el-form>
                            </template>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item label="条件描述">
                    <el-input v-model="addOrEdit.condition.cdDesc"></el-input>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <span style="color: red;margin-right: 15px">{{cdErrorMsg}}</span>
                <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                <el-button type="primary" :disabled="isNotEmpty(cdErrorMsg)" size="mini" @click="addAfter">确定</el-button>
            </template>
        </el-dialog>
    </div>


</template>

<script>
    import {Condition} from "../index";
    import {dataTypeEnums, DataTypeEnumsClass, messageEnums, varFromEnums} from "../../../entity/enumns";
    import {ls} from "../../index";
    import VarTable from "../../vars-node/v1/VarTable";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import RuleCommCdTable from "../common/RuleCommCdTable";

    export default {
        name: "VUnitCondition",
        components: {RuleCommCdTable, VarTable},
        props: {
            // 逻辑操作
            pCdList: {default: ()=>{}, type: Array},
            // 引用的变量（临时变量和事件变量）
            pCdRelVarList: {default: ()=>[], type: Array},
            disabled: {default: false, type: Boolean},
            isShowAddNeed: {default: false, type: Boolean},
            // 左边的下拉框进行锁定情况下 需要的相关的参数
            isLockLeft: {default: false, type: Boolean, required: false},
            pLeftLockCdRelVarList:{default: ()=>[], type: Array, required: false},

        },

        data() {
            return {
                varTable: {dialog: false, title: '变量选择'},
                // 配置信息
                varFromEnums: varFromEnums,
                dataTypeEnums: dataTypeEnums,
                messageEnums: messageEnums,
                addOrEdit: {
                    dialog: false,
                    condition: new Condition(),
                    type: "add"
                },
            }
        },

        computed: {
            /**
             * 计算是否是单值操作
             */
            computeSingleOpt(){
                return ![dataTypeEnums.OBJECT.code, dataTypeEnums.BOOLEAN.code].includes(this.addOrEdit.condition.cdVarType);
            },

            computeOptList(){
                return DataTypeEnumsClass.getOptListByKey(this.addOrEdit.condition.getVarType())
            },

            computePVNByName() {
                return (name) => {
                    if (isEmpty(name)) return "";
                    let result = this.pCdRelVarList.filter(item => item.getPrefixVarName() === name)[0];
                    if (isEmpty(result)) return "";
                    return result.getPrefixVarName();
                }
            },

            computeDecsByName() {
                return (name) => {
                    if (isEmpty(name)) return "";
                    let result = this.pCdRelVarList.filter(item => item.getPrefixVarName() === name)[0];
                    if (isEmpty(result)) return "";
                    return result.varDesc;
                }
            },

            cdErrorMsg(){
                return this.addOrEdit.condition.getErrorMsg()
            },
        },

        methods: {
            // 添加条件
            addBefore() {
                let that = this;
                let cdNum = 999;
                let cdIdList = ls(cdNum);

                // 新增没有出现的id
                let inCdListId = that.pCdList.map(cd => cd.cdId);
                let noInCdListId = cdIdList.filter(cdId => inCdListId.indexOf(cdId) === -1);
                if (noInCdListId.length === 0) {
                    that.$message({message: `目前仅支持${cdNum}个条件`, type: 'warning'});
                } else {
                    if (that.isLockLeft) {
                        that.addOrEdit = {
                            dialog: true,
                            condition: new Condition({
                                cdId: noInCdListId[0],
                                leftVarName: that.pLeftLockCdRelVarList[0].getPrefixVarName(),
                                cdVarType: that.pLeftLockCdRelVarList[0].varType,
                                leftVarFrom: varFromEnums.rel.code,
                                rightVarFrom: varFromEnums.edit.code,
                            }),
                            type: 'add'
                        };
                    } else {
                        that.addOrEdit = {
                            dialog: true,
                            condition: new Condition({
                                cdId: noInCdListId[0],
                                leftVarFrom: varFromEnums.rel.code,
                                rightVarFrom: varFromEnums.edit.code,
                            }),
                            type: 'add'
                        };
                    }

                }
            },

            // 添加条件之后
            addAfter() {
                let that = this;
                that.addOrEdit.dialog = false;
                that.$emit("addOrEditClick", this.addOrEdit.condition);
            },

            // 编辑之前
            editBefore(row) {
                let that = this;
                that.addOrEdit = {
                    dialog: true,
                    condition: Condition.obj2Condition(JSON.parse(JSON.stringify(row))),
                    type: 'edit'
                };
            },

            // 删除条件
            deleteClick(row) {
                // 对象引用发生变化，父组件去修改对象值
                this.$confirm('确定要删除该条件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.$emit("deleteClick", row);
                }).catch(() => {});
            },

            // 左边变量名改变时联动改变变量类型，同时操作符制空
            varNameChange(varName, row, type) {
                let that = this;
                if (isNotEmpty(varName)) {
                    let varType = that.pCdRelVarList.filter(item => item.getPrefixVarName() === varName)[0].varType;
                    let varDecs = that.pCdRelVarList.filter(item => item.getPrefixVarName() === varName)[0].getDescVarName();
                    if (isNotEmpty(varType)){
                        row[`${type}VarType`] = varType;
                        row.cdVarType = varType;
                        that.varTypeChange(row)
                    }
                    if (isNotEmpty(varDecs)) row[`${type}VarDecs`] =varDecs;
                }
            },

            // 左边变量类型发生变化时，操作符制空
            varTypeChange(condition) {
                condition.cdOpt = '';
            },
        }
    }
</script>

<style scoped>
    .vuc-icon {
        margin-left: 10px;
    }

    .vuc-margin {
        margin-left: 10px;
    }

    .vuc-input-width {
        width: 70%;
    }
</style>
