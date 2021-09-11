<template>
    <el-form ref="addForm" size="mini" :model="func" :rules="addRules" label-width="100px" class="clearfix dialog-elform">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="产品ID:">
                    <el-input placeholder="产品Id" v-model="prod.prodId" disabled style="width: 100%"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="函数类型" prop="funcType">
                    <el-select v-model="func.funcType" placeholder="函数类型" @change="funcTypeChange" style="width: 100%">
                        <el-option v-for="(value, key) in funcTypeEnums" :label="value" :key="key" :value="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="函数ID:" prop="funcId">
                    <el-input v-model="func.funcId" placeholder="函数Id（英文并不包括特殊字符" style="width: 100%" maxlength="29" show-word-limit>
                        <template slot="prepend">{{`pub`}}</template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="函数名称" prop="funcName">
                    <el-input v-model="func.funcName" placeholder="函数名称" style="width: 100%" maxlength="50" show-word-limit></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="函数逻辑" prop="funcDrl">
                    <codemirror v-model="func.funcDrl" :options="cmOptions"
                                style="line-height:20px;z-index: 10000"></codemirror>
                </el-form-item>
            </el-col>
        </el-row>

        <template>
            <div class="new-dialog-footer">
                <el-button size="mini" @click="cancelVisible">取消</el-button>
                <el-button size="mini" type="primary" :loading="saveLoading" @click="addClick">确定</el-button>
            </div>
        </template>

    </el-form>


</template>

<script>
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"
    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"

    import {Prod} from "../../entity/prod";
    import {FuncBase} from "../../entity/func";
    import {funcTypeEnums, validateSameFuncName} from "./index";

    import {validateFuncId} from "./index";
    import {validateChinese, validateFuncName, validateSpChar} from "../../views/common";

    import {addFuncBase} from "../../api/Func";

    export default {
        name: 'AddFunction',
        data() {
            return {
                saveLoading:false, //判断是否正在加载，防止表单重复提交
                funcTypeEnums: funcTypeEnums,
                addRules: {
                    funcId: [
                        {required: true, message: '请输入函数id', trigger: 'blur'},
                        {validator: validateSpChar, trigger: 'blur'},
                        {validator: validateChinese, trigger: 'blur'},
                        {validator: validateFuncName, trigger: 'blur'},
                        {validator: validateFuncId, trigger: 'blur'},
                    ],
                    funcName: [
                        {required: true, message: '请输入函数名', trigger: 'blur'},
                        // {validator: validateSpChar, trigger: 'blur'},
                        // {validator: validateChinese, trigger: 'blur'},
                        // {validator: validateFuncName, trigger: 'blur'},
                        // {validator: validateSameFuncName, trigger: 'blur'}
                    ],
                    funcDrl: [
                        {required: true, message: '请输入函数体', trigger: 'blur'}
                    ],
                },
                cmOptions: {
                    //使用的语言
                    mode: 'application/json',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    showCursorWhenSelecting: true,
                    autofocus: true,
                    line: true,
                    indentWithTabs: true,
                    smartIndent: true,
                    //显示行号
                    lineNumbers: true,
                    //括号匹配
                    matchBrackets: true,
                }
            }
        },


        props: {  //父组件传入的数据
            'dialogTitle': String,
            'dialogFormVisible': Boolean,
            'func': FuncBase,
            'prod': Prod
        },

        watch: {
            'func.funcId': {
                handler(value) {
                    this.func.setFuncCode(value);
                },
            }
        },


        methods: {
            funcTypeChange(val){
                console.log(val);
              this.func.funcDrl = "";
            },


            // funcDrl中的函数名跟着prodId变动
            // funcNameChange(value){
            //     if(this.func.funcDrl === undefined || this.func.funcDrl === '' || this.func.funcDrl.indexOf('function String') === -1){
            //         this.func.funcDrl = `function String ${value}(){\n return "";\n}`;
            //         // this.func.funcDrl = `function String ` + this.func.funcName + `(){\n return "";\n}`
            //
            //     }else {
            //         let begin = this.func.funcDrl.indexOf('(');
            //         let rightCode = this.func.funcDrl.substring(begin);
            //         this.func.funcDrl = `function String ${value}` + rightCode;
            //         // this.func.funcDrl = `function String ` + this.func.funcName + rightCode;
            //     }
            // },


            // 确定按钮
            addClick() {
                let that = this;
                that.saveLoading = true;
                that.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        that.func.funcId = `pub` + that.func.funcId;
                        addFuncBase({funcBase:that.func, prodId:"pub"}).then(res => {
                            that.$message({message: '成功', type: 'success'});
                            that.saveLoading = false;
                            that.cancelVisible();
                        });
                    } else {
                        console.log('error submit!!');
                        that.saveLoading = false;
                        return false;
                    }
                });
            },
            /**
             * 子组件向父组件发送信息，用来取消dialog页面
             */
            cancelVisible: function () {
                let that = this;
                that.$emit('visibleChange', false);
                // 清一下表单
                // that.$refs['addForm'].resetFields();
            },

            init() {
                let that = this;
                that.saveLoading = false;
                that.$refs['addForm'].resetFields();
                that.func.funcType = '0';
                that.func.funcDrl = '返回类型和入参类型请选择Object';
            }

        },

    }



</script>



<style scoped>

    .show-line {
        height: 1px;
        background: #475669;
        overflow: hidden;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .show-title{
        font-size: larger;
    }

    .show-value{
        font-size: small;
        color: lightslategrey;
    }

    .base-info-div{
        margin-top: 20px;
    }

    .add-input {
        width: 100%;
    }

    .add-icon {
        margin-right: 10px;
        color: #409EFF;
        font-size: 25px;
    }

    .remove-icon {
        color: #F56C6C;
        font-size: 25px;
    }

    .dimension-map-table{
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .el-col-right {
        text-align: right;
    }

</style>
