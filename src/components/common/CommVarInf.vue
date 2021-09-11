<template>
    <!--所有的变量都用这个模版 @see varTypeEnums-->
    <div>
        <el-form size="mini" label-width="90px" ref="from" :model="pVar" :inline="inline" :rules="rules">
            <el-form-item :label="messageEnums.VAR_NAME_REAL.name">
                <el-tag>{{computeVarRealName}}</el-tag>
            </el-form-item>
            <el-form-item prop="varName" :label="messageEnums.VAR_NAME_DEFAULT.name"
                          v-if="varNameShow && ((isEmpty(pVar.varNameType) || pVar.varNameType === varNameTypeEnums.S.code))">
                <el-input v-model.trim="pVar.varName" :disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item prop="varAlias" :label="messageEnums.VAR_NAME_ALIAS.name"
                          v-if="pVar.varNameType === varNameTypeEnums.A.code">
                <el-select filterable clearable allow-create v-model="pVar.varAlias" @change="onAliasChange"
                           :disabled="disabled">
                    <el-option v-for="item in computeRelVarList"
                               :key="item.varAlias"
                               :label="item.varAlias"
                               :value="item.varAlias">
                        <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                        <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-button v-if="computeVarNameReplaceFlag" style="margin-right: 10px;" type="primary" size="mini"
                       @click="reNameOverAll">全局修改
            </el-button>
            <el-form-item prop="varNameType" :label="messageEnums.VAR_NAME_TYPE.name">
                <el-select v-model="pVar.varNameType" :disabled="varNameTypeDisable || disabled">
                    <el-option :label="varNameTypeEnums.S.name" :key="varNameTypeEnums.S.code"
                               :value="varNameTypeEnums.S.code"></el-option>
                    <el-option :label="varNameTypeEnums.A.name" :key="varNameTypeEnums.A.code"
                               :value="varNameTypeEnums.A.code"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="varType" :label="messageEnums.VAR_TYPE.name">
                <template v-if="isDTCommVar">
                    <el-select v-model="pVar.varType" :disabled="varTypeDisable || disabled">
                        <el-option :label="dataTypeEnums.STRING.code" :value="dataTypeEnums.STRING.code"
                                   :key="dataTypeEnums.STRING.code"></el-option>
                        <el-option :label="dataTypeEnums.INTEGER.code" :value="dataTypeEnums.INTEGER.code"
                                   :key="dataTypeEnums.INTEGER.code"></el-option>
                        <el-option :label="dataTypeEnums.DOUBLE.code" :value="dataTypeEnums.DOUBLE.code"
                                   :key="dataTypeEnums.DOUBLE.code"></el-option>
                    </el-select>
                </template>
                <template v-else>
                    <el-select v-model="pVar.varType" :disabled="varTypeDisable || disabled">
                        <el-option :label="dataTypeEnums.STRING.code" :value="dataTypeEnums.STRING.code"
                                   :key="dataTypeEnums.STRING.code"></el-option>
                        <el-option :label="dataTypeEnums.INTEGER.code" :value="dataTypeEnums.INTEGER.code"
                                   :key="dataTypeEnums.INTEGER.code"></el-option>
                        <el-option :label="dataTypeEnums.DOUBLE.code" :value="dataTypeEnums.DOUBLE.code"
                                   :key="dataTypeEnums.DOUBLE.code"></el-option>
                        <el-option :label="dataTypeEnums.TIMESTAMP.code" :value="dataTypeEnums.TIMESTAMP.code"
                                   :key="dataTypeEnums.TIMESTAMP.code"></el-option>
                        <el-option :label="dataTypeEnums.OBJECT.code" :value="dataTypeEnums.OBJECT.code"
                                   :key="dataTypeEnums.OBJECT.code"></el-option>
                        <el-option :label="dataTypeEnums.ARRAY.code" :value="dataTypeEnums.ARRAY.code"
                                   :key="dataTypeEnums.ARRAY.code"></el-option>
                        <el-option :label="dataTypeEnums.BOOLEAN.code" :value="dataTypeEnums.BOOLEAN.code"
                                   :key="dataTypeEnums.BOOLEAN.code"></el-option>
                    </el-select>
                </template>
            </el-form-item>

            <el-form-item :label="messageEnums.VAR_DESC.name">
                <el-input v-model="pVar.varDesc" :disabled="disabled"></el-input>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import {dataTypeEnums, messageEnums, varNameTypeEnums, varTypeEnums} from "../../entity/enumns";
    import {SCVar, URVar} from "../index";
    import {isEmpty, isNotEmpty} from "../../utils";
    import {DTVar, UnitResult, URGVar} from "../../entity/vars";

    export default {
        name: "CommVarInf",
        props: {
            pVar: {type: Object, require: true},
            pNode: {type: Object, required: false},
            pAliasList: {type: Array, required: false, default: () => []},

            // 设置变量名是否显示
            varNameShow: {type: Boolean, default: true, required: false},
            // 设置变量名类型是否显示
            varNameTypeDisable: {type: Boolean, default: false, required: false},
            // 设置变量类型是否显示
            varTypeDisable: {type: Boolean, default: false, required: false},

            disabled: {type: Boolean, default: false, required: false},
            inline: {type: Boolean, default: true, required: false},

            // 控制下拉框类型的入参(当是决策表时，下拉框只需要数字型和字符串型)
            isDTCommVar: {type: Boolean, default: false, require: false}

        },

        computed: {
            computeVarRealName() {
                if (isEmpty(this.pVar)) {
                    console.log("CommVar pVar字段为空");
                    return "";
                }

                // 元规则的流程变量 和 元规则（图）的流程变量
                if (this.pVar instanceof UnitResult ||
                    this.pVar instanceof URGVar ||
                    this.pVar instanceof URVar ||
                    this.pVar instanceof SCVar ||
                    this.pVar instanceof DTVar) {
                    if (this.pVar.enableAlias()) {
                        return this.pVar.getAliasName();
                    } else {
                        return this.pNode.nData.uniqueName;
                    }
                }

                // 普通节点的变量
                if (this.pVar.enableAlias()) {
                    return this.pVar.getAliasName();
                } else {
                    return this.pVar.getPrefixVarName();
                }
            },

            computeRelVarList() {
                let alias = new Set();
                let result = [];
                this.pAliasList.filter(item => item.enableAlias()).forEach(item => {
                    // 不包含的情况下加入
                    if (!alias.has(item.getAliasName())) {
                        result.push(item)
                    }
                    alias.add(item.getAliasName())
                });
                return result;
            },

            // 服务于变量名全局替换的计算属性函数
            computeVarNameReplaceFlag() {
                if (this.judgeNameChange(this.oldPVar, this.pVar) && this.judgeExceptNameSame(this.oldPVar, this.pVar)) {
                    return true;
                } else {
                    return false;
                }
            },


        },
        data() {
            const validateVarName = (rule, value, callback) => {
                let bResult = true;
                for (let chart of value) {
                    let reg = new RegExp(/[a-zA-Z_$0-9]/g);
                    if (!(reg.test(chart))) {
                        bResult = false;
                        break;
                    }
                }
                if (bResult) {
                    callback();
                } else {
                    callback(new Error('下划线、字母、美元符以及数字'))
                }
            };


            return {
                rules: {
                    varName: [
                        {required: true, message: '请输入名称(常规)', trigger: 'blur'},
                        {validator: validateVarName, trigger: 'blur'},
                    ],
                    varAlias: [
                        {required: true, message: '请输入名称(别名)', trigger: 'blur'},
                        {validator: validateVarName, trigger: 'change'},
                    ],
                    varNameType: [
                        {required: true, message: '请选择名称类型', trigger: 'change'},
                    ],
                    varType: [
                        {required: true, message: '请选择变量类型', trigger: 'change'},
                    ]
                },
                dataTypeEnums: dataTypeEnums,
                messageEnums: messageEnums,
                varNameTypeEnums: varNameTypeEnums,


                oldPVar: {},


            };
        },


        mounted() {
            console.log("comm mounted");
            this.$nextTick(() => {

                // 绑定全局总线，拿到ruleJson
                // this.bindDecsTree();
                // debugger
                // 赋默认值
                if (this.pVar && isEmpty(this.pVar.varNameType)) {
                    this.pVar.varNameType = varNameTypeEnums.S.code;
                }

                // 将原始的pVar记录一下
                // debugger
                this.oldPVar = JSON.parse(JSON.stringify(this.pVar));
                // console.log("comm mounted");
            });

        },

        methods: {


            /**
             * 别名修改
             */
            onAliasChange(alias) {
                let filterList = this.computeRelVarList.filter(item => item.getAliasName() === alias);
                if (isNotEmpty(filterList)) {
                    this.pVar.varType = filterList[filterList.length - 1].varType;
                    this.pVar.varDesc = filterList[filterList.length - 1].varDesc;
                }
            },

            /**
             * 提交该组件
             * @param onErrorFunc：异常时的回调函数
             * @param onSuccessFunc：正常情况下的回调函数
             */
            submitForm(onErrorFunc, onSuccessFunc) {
                this.$refs['from'].validate((valid) => {
                    if (valid) {
                        if (!isEmpty(onSuccessFunc)) {
                            onSuccessFunc();
                        }
                    } else {
                        if (!isEmpty(onErrorFunc)) {
                            onErrorFunc();
                        }
                        return false;
                    }
                });
            },

            setOldPVar(oldPVar) {
                debugger
                this.oldPVar = JSON.parse(JSON.stringify(oldPVar));
            },

            validate() {
                return this.$refs['from'].validate();
            },

            resetForm() {
                this.$refs['from'].resetFields();
            },

            clearValidate() {
                this.$refs['from'].clearValidate()
            },


            // 当且只有在varName或者varAlias不同的时候进行替换
            judgeNameChange(oldPVar, curPVar) {
                let result = false;

                if ((oldPVar.varNameType === curPVar.varNameType)) {
                    // 常量 命名
                    if (curPVar.varNameType === varNameTypeEnums.S.code) {
                        if ((curPVar.varName !== oldPVar.varName) && !isEmpty(oldPVar.varName)) result = true;
                    } else {    // 别名 命名
                        if ((curPVar.varAlias !== oldPVar.varAlias) && !isEmpty(oldPVar.varAlias)) result = true;
                    }
                } else {    // 需要进行全局替换的情况
                    result = false;
                }

                return result;
            },

            // 变量对象中除了name之外的一致性
            judgeExceptNameSame(oldPVar, curPVar) {
                if (oldPVar.varType !== curPVar.varType || oldPVar.varValue !== curPVar.varValue || oldPVar.varDesc !== curPVar.varDesc) {
                    return false;
                }
                return true;
            },


            reNameOverAll() {
                this.$confirm('##慎用## 确定当前变量名要全局替换吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(({value}) => {
                    // 进行替换逻辑
                    this.execReNameOverAll();
                }).catch(() => {
                });
            },

            execReNameOverAll() {
                debugger
                let that = this;
                let curName = that.getVarRealName(that.pVar);
                let oldName = that.getOldVarRealName(curName, that.oldPVar, that.pVar);     // 变量类型

                // 替换逻辑
                that.$g6Editor.graph.getNodes().forEach(item => {
                    debugger
                    let nData = item.getModel().nData;
                    // 替换掉前缀加变量名的情况
                    // let decsTreeString = JSON.stringify(nData).replace(new RegExp(`${oldName}`, "gm"), curName);
                    // Object.assign(nData, JSON.parse(JSON.stringify(nData).replace(new RegExp(`${oldName}`, "gm"), curName)));
                    let decsTreeString = JSON.stringify(nData).replace(new RegExp(`:"${oldName}"`, "gm"), `:"${curName}"`);

                    // 替换掉变量名的场景
                    if (that.pVar.enableAlias()) {  // av_别名场景
                        decsTreeString = decsTreeString.replace(new RegExp(`"varAlias":"${that.oldPVar.varAlias}"`, "gm"), `"varAlias":"${that.pVar.varAlias}"`);
                    } else {    // 常规名场景
                        decsTreeString = decsTreeString.replace(new RegExp(`"varName":"${that.oldPVar.varName}"`, "gm"), `"varName":"${that.pVar.varName}"`);
                    }
                    Object.assign(nData, JSON.parse(decsTreeString));
                });


                // 更新一下oldPVar
                that.oldPVar = JSON.parse(JSON.stringify(that.pVar));
                // 提示一下，如果当前是弹窗，提示记得保存
                this.$message.warning("如果当前字段配置页面是独立弹窗，请记得按保存按钮");
            },

            getVarRealName(pVarItem) {
                debugger
                if (isEmpty(pVarItem)) {
                    console.log("CommVar pVar字段为空");
                    return "";
                }

                // 元规则的流程变量 和 元规则（图）的流程变量
                if (pVarItem instanceof UnitResult ||
                    pVarItem instanceof URGVar ||
                    pVarItem instanceof URVar ||
                    pVarItem instanceof SCVar ||
                    pVarItem instanceof DTVar) {
                    if (pVarItem.enableAlias()) {
                        return pVarItem.getAliasName();
                    } else {
                        return pVarItem.varName;
                    }
                }

                // 普通节点的变量
                if (pVarItem.enableAlias()) {
                    return pVarItem.getAliasName();
                } else {
                    return pVarItem.getPrefixVarName();
                }
            },

            getOldVarRealName(curNameStr, oldPVarItem, pVarItem) {
                debugger
                let result = "";
                if (isEmpty(oldPVarItem)) {
                    console.log("CommVar oldPVarItem字段为空");
                    return "";
                }

                if (pVarItem.enableAlias()) {
                    result = curNameStr.replace(new RegExp(`${pVarItem.varAlias}`, "gm"), oldPVarItem.varAlias);
                } else {
                    result = curNameStr.replace(new RegExp(`${pVarItem.varName}`, "gm"), oldPVarItem.varName);
                }

                return result;
            },

            // getOldVarRealName(oldPVarItem, pVarItem) {
            //     debugger
            //     if (isEmpty(oldPVarItem)){
            //         console.log("CommVar oldPVarItem字段为空");
            //         return "";
            //     }
            //
            //     // 元规则的流程变量 和 元规则（图）的流程变量
            //     if (pVarItem instanceof UnitResult ||
            //         pVarItem instanceof URGVar ||
            //         pVarItem instanceof URVar ||
            //         pVarItem instanceof SCVar ||
            //         pVarItem instanceof DTVar) {
            //         if (pVarItem.enableAlias()) {
            //             return [varTypeEnums.av.code, oldPVarItem.varAlias].join("_");
            //         } else {
            //             return oldPVarItem.varName;
            //         }
            //     }
            //
            //     // 普通节点的变量
            //     if (pVarItem.enableAlias()) {
            //         return [varTypeEnums.av.code, oldPVarItem.varAlias].join("_");
            //     } else {
            //         return pVarItem.getPrefixVarName();
            //     }
            //
            // },
        }
    }
</script>

<style scoped>

</style>
