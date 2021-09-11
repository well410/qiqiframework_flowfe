<template>
    <el-form ref="editFrom" size="mini" :model="func" :rules="editRules" label-width="100px" class="clearfix dialog-elform">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="产品ID:">
                    <el-input placeholder="产品Id" v-model="prod.prodId" disabled ></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="函数类型:" prop="funcType">
                    <el-select v-model="func.funcType" disabled placeholder="函数类型" style="width:100%">
                        <el-option v-for="(value, key) in funcTypeEnums" :label="value" :key="key" :value="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>

        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="函数ID:" prop="funcId">
                    <el-input v-model="func.funcId" disabled placeholder="函数Id（英文并不包括特殊字符）" maxlength="32" show-word-limit></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="函数名称:" prop="funcName">
                    <el-input v-model="func.funcName" placeholder="函数名称（不包括特殊字符）" maxlength="50" show-word-limit></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="函数逻辑:" prop="funcDrl">
                    <codemirror v-model="func.funcDrl" :options="cmOptions"
                                style="line-height:20px;z-index: 10000"></codemirror>
                </el-form-item>
            </el-col>
        </el-row>
        <template>
            <div class="new-dialog-footer">
                <el-button size="mini" @click="cancelVisible">取消</el-button>
                <el-button size="mini" type="primary" :loading="editLoading" @click="editClick">确定</el-button>
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
    import {funcTypeEnums} from "./index";
    import {validateSpChar} from "../../views/common";
    import {FuncBase} from "../../entity/func";
    import {updateFuncBase} from "../../api/Func";


    export default {
        name: "UpdateFunction",
        props: {  //父组件传入的数据
            'dialogTitle': String,
            'dialogFormVisible': Boolean,
            'func': FuncBase,
            'prod': Prod
        },
        data() {
            return {
                editLoading:false, //判断是否正在加载，防止表单重复提交
                funcTypeEnums: funcTypeEnums,
                editRules: {
                    funcId: [
                        {required: true, message: '请输入函数id', trigger: 'blur'},
                    ],
                    funcName: [
                        {required: true, message: '请输入函数名', trigger: 'blur'},
                        // {validator: validateSpChar, trigger: 'blur'},
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
        methods: {

            funcNameChange(value){
                if(this.func.funcDrl === undefined || this.func.funcDrl === '' || this.func.funcDrl.indexOf('function String') === -1){
                    this.func.funcDrl = `function String ${value}(){\n return null;\n}`
                }else {
                    let begin = this.func.funcDrl.indexOf('(');
                    let rightCode = this.func.funcDrl.substring(begin);
                    this.func.funcDrl = `function String ${value}` + rightCode;
                }
            },

            // 编辑确定按钮
            editClick() {
                let that = this;
                that.$refs['editFrom'].validate((valid)=>{
                    if (valid) {
                        // 调用更新的后端接口
                        updateFuncBase({funcBase:that.func, prodId: "pub"}).then(res=>{
                            that.$message({message: '成功', type: 'success'});
                            that.editLoading = false;
                            that.cancelVisible();
                        })
                    } else {
                        console.log('error submit!!');
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
                that.$refs['editFrom'].resetFields();
            },
        }
    }
</script>

<style scoped>

</style>
