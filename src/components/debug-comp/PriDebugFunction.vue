<template>
    <!--私有函数测试，与共有函数区别在于产品id-->
    <div style="margin-top: 10px">
        <el-form ref="debugFrom" size="mini" :model="funcTestDto" :rules="inputVarsRules" label-width="100px" :label-position="'right'"
                 class="clearfix dialog-elform">

            <!--函数体展示-->
            <el-form-item label="函数源码" prop="funcDrl">
                <codemirror v-model="func.funcDrl"
                            :options="cmOptions"
                            style="line-height:20px;z-index: 5000"></codemirror>
            </el-form-item>

            <!--drl函数入参列表-->
            <el-form-item v-if="func.funcType === '0'" label="函数入参" prop="varsForDrl">
                <codemirror v-model="funcTestDto.varsForDrl"
                            :options="paramsCMOptions"
                            style="line-height:20px;z-index: 5000"></codemirror>
            </el-form-item>

            <!--java函数入参列表-->
            <el-form-item v-if="func.funcType === '1'" label="函数入参" prop="varsForJava">
                <codemirror v-model="funcTestDto.varsForJava"
                            :options="paramsCMOptions"
                            style="line-height:20px;z-index: 5000"></codemirror>
            </el-form-item>

            <!--测试结果显示栏-->
            <el-form-item label="测试结果：">
                <span>{{debugResult}}</span>
            </el-form-item>

            <template>
                <div class="new-dialog-footer">
                    <el-button size="mini" @click="cancelVisible">取消</el-button>
                    <el-button size="mini" type="primary" :loading="debugLoading" @click="debugFunctionClick">调试
                    </el-button>
                </div>
            </template>
        </el-form>


        <!--底部按钮-->


    </div>
</template>

<script>
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"
    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"

    import {FuncBase} from "../../entity/func";
    import {Prod} from "../../entity/prod";
    import FuncCode from "../pri-function/FuncCode";
    import {DrlCodeAutoCreate} from "../../entity/model";
    import {testFunc, updateFuncBase} from "../../api/Func";
    import {validateJSONArray, validateJSONObject} from "../../views/common";

    export default {
        name: "PriDebugFunction",
        components: {FuncCode},
        data() {
            return {
                debugLoading: false, //判断是否正在加载
                varsList: [],         // 输入变量数组，需要从funcDrl字段解析出来{变量类型， 变量名}
                debugResult: '',
                funcTestDto: {drlCode: '', varsForDrl: '', varsForJava: '[]'},
                cmOptions: {
                    //使用的语言
                    mode: 'application/json',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    showCursorWhenSelecting: true,
                    autofocus: false,
                    line: true,
                    indentWithTabs: true,
                    smartIndent: true,
                    //显示行号
                    lineNumbers: true,
                    //括号匹配
                    matchBrackets: true,
                    readOnly : false,
                },
                paramsCMOptions: {
                    //使用的语言
                    mode: 'application/json',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    showCursorWhenSelecting: true,
                    autofocus: false,
                    line: true,
                    indentWithTabs: true,
                    smartIndent: true,
                    //显示行号
                    lineNumbers: true,
                    //括号匹配
                    matchBrackets: true,
                    readOnly : false,
                },
                inputVarsRules: {
                    varsForDrl: [
                        {required: true, message: '请输入参数', trigger: 'blur'},
                        {validator: validateJSONObject, trigger: 'blur'},
                    ],
                    varsForJava: [
                        {required: true, message: '请输入参数', trigger: 'blur'},
                        {validator: validateJSONArray, trigger: 'blur'},
                    ],
                },
            }
        },


        props: {  //父组件传入的数据
            'dialogTitle': String,
            'dialogFormVisible': Boolean,
            'func': FuncBase,
            'prod': Prod,
            // 分为基础表调试和版本表调试，基础表调试可以修改函数源码，并且调试时是保存源码
            'pType': {type: String, default: 'baseDebug'}
        },

        mounted() {
        },

        watch: {
            // 监听函数代码，然后生成drlCode
            'func.funcDrl': {
                handler(value) {
                    let that = this;
                    // 解析入参
                    that.analysisVars();
                    that.setFuncTestDtoDrl(value);
                },
            }
        },


        methods: {
            /**
             * 子组件向父组件发送信息，用来取消dialog页面
             */
            cancelVisible() {
                let that = this;
                that.$emit('visibleChange', false);
                // 清一下表单
                that.$refs['debugFrom'].resetFields();
            },

            debugFunctionClick() {
                // 提示是否保存源码
                let that = this;
                if (this.pType === 'baseDebug'){
                    that.debugBaseFunction();
                } else {
                    that.debugVersionFunction();
                }
            },

            // 版本表调试
            debugVersionFunction(){
                this.debugFunction();
            },


            // 基础表调试
            debugBaseFunction() {
                const that = this;
                that.$refs['debugFrom'].validate((valid) => {
                    if (valid) {
                        that.$confirm('测试前，会先保存源码', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            updateFuncBase({funcBase: that.func, prodId: this.gConfig.prodId.value}).then(res => {
                                that.$message({message: '保存成功', type: 'success'});
                                that.debugFunction();
                            })
                        }).catch(() => {

                        });
                    } else {
                        console.log('error submit!!');
                        that.saveLoading = false;
                        return false;
                    }
                });
            },


            // 调试函数
            debugFunction() {
                // 调用更新的后端接口
                let that = this;
                that.debugLoading = true;
                let vars = {};
                that.varsList.forEach(tmpVar => {
                    vars[tmpVar.funcVarName] = tmpVar.funcVarValue;
                });

                let funcTestDto = {};
                funcTestDto.varsForDrl = (that.funcTestDto.varsForDrl === '') ? {} : JSON.parse(that.funcTestDto.varsForDrl);
                funcTestDto.varsForJava = (that.funcTestDto.varsForJava === '') ? [] : JSON.parse(that.funcTestDto.varsForJava);
                funcTestDto.drlCode = that.funcTestDto.drlCode;
                testFunc({
                    funcTestDto: funcTestDto,
                    prodId: that.gConfig.prodId.value,
                    funcId: that.func.funcId
                }).then(res => {
                    that.debugResult = res.data.data.result;
                    that.$message({type: 'info', message: '测试结果返回,请查看底部返回值'});
                    console.log(res)
                }).finally(() => {
                    that.debugLoading = false;
                })

            },

            init() {
                try {
                    const that = this;
                    that.debugResult = '';
                    that.debugLoading = false;
                    that.analysisVars();
                    that.setFuncTestDtoDrl(that.func.funcDrl);
                    that.cmOptions.readOnly = (that.pType !== 'baseDebug')
                } catch (e) {
                    console.error("调试页面数据初始化失败", e);
                }

            },

            analysisVars() {
                let that = this;
                that.varsList = [];
                // drl 函数的参数生成
                if (that.func.funcType === "0") {
                    let argsStr = that.func.funcDrl.match(/[(](.*?)[)]/)[1].trim().replace(/\s+/ig, " ");      //获取第一个括号内的内容,多个空格替换掉
                    if (argsStr === "") {
                        return;
                    }
                    let argsArr = argsStr.split(',');
                    let varsForDrl = {};
                    that.varsList = argsArr.map(item => {
                        let argArr = item.trim().split(' ');
                        const funcVarType = argArr[0].trim();
                        const funcVarName = argArr[1].trim();
                        varsForDrl[funcVarName] = null;
                        return {funcVarType: funcVarType, funcVarName: funcVarName};
                    });
                    that.funcTestDto.varsForDrl = JSON.stringify(varsForDrl, null, 4);
                }
            },

            setFuncTestDtoDrl(drl){
                const that = this;
                if (that.func.funcType === "0") {
                    that.funcTestDto.drlCode = new DrlCodeAutoCreate({
                        funcId: that.func.funcId,
                        funcDrl: drl,
                        varsList: that.varsList
                    }).getDrlCode();
                } else {
                    that.funcTestDto.drlCode = drl;
                }
            }

        },


    }
</script>

<style scoped>
    .f1 {
        float: left;
    }

    .search-bar {
        overflow: hidden;
    }

    .tools-bar {
        margin-bottom: 20px;
    }

    .show-function-row {
        margin: 10px;
    }

    .show-function-line {
        height: 1px;
        background: #475669;
        overflow: hidden;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .show-function-title {
        font-size: large;
    }

    .show-function-info-div {
        margin-left: 20px;
    }

    .show-function-key {
        font-size: larger;
    }

    .show-function-value {
        font-size: medium;
        color: lightslategrey;
    }

    .el-col-right {
        text-align: right;
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

    el-table::before {
        width: 0;
    }

</style>
