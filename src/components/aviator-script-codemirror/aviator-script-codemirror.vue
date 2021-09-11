<template>
    <div id="aviator-script-codemirror">
        <div class="common-title">{{messageEnums.CONFIG_OF_FIELD.name}}</div>
        <comm-var-inf ref="commVarInf" :disabled="disabled"  :p-var="pAsVar" :p-alias-list="pVarList"></comm-var-inf>

        <div class="common-title">{{messageEnums.CONFIG_OF_CODE.name}}</div>
        <el-form label-width="80" size="mini">
            <el-form-item>
                <el-dropdown trigger="click" @command="handleCommand">
                    <el-button type="primary" size="mini" :disabled="disabled">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="debugScript">测试</el-dropdown-item>
                        <el-dropdown-item command="autoCreateInput">生成输入</el-dropdown-item>
                        <el-dropdown-item command="formatJSON">格式化JSON</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span style="color: #E6A23C;font-size: small;margin-left: 20px">{{computedError}}</span>
            </el-form-item>

            <el-form-item label="代码">
                <!--折叠栏内容-->
                <codemirror ref="codeCm"
                            v-model="pAsVar.code"
                            :key="cmKey"
                            :options="codeCmOptions"
                            style="line-height:20px;z-index: 500;"></codemirror>
            </el-form-item>
            <el-form-item label="输入">
                <codemirror v-model="pAsVar.asInput"
                            :options="jsonCmOptions"
                            :key="cmKey"
                            style="line-height:20px;z-index: 500;"></codemirror>
            </el-form-item>
            <el-form-item label="结果" v-if="isNotEmpty(debug.debugResult)">{{debug.debugResult}}</el-form-item>
        </el-form>
    </div>
</template>

<script>
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"

    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"
    import "codemirror/addon/hint/show-hint"
    import "codemirror/addon/hint/javascript-hint"

    import "codemirror/addon/lint/lint";
    import "codemirror/addon/lint/lint.css";
    import "codemirror/addon/lint/json-lint";

    require("script-loader!jsonlint");

    // lib
    import _CodeMirror from 'codemirror'
    import {testAviator} from "../../api/Aviator";
    import {dataTypeEnums, messageEnums} from "../../entity/enumns";
    import {ASVar} from "../../entity/vars";
    import {isContainEmpty, isEmpty} from "../../utils";
    import {funcList} from "./index";
    import CommVarInf from "../common/CommVarInf";
    import {getUUID} from "../index";

    const CodeMirror = window.CodeMirror || _CodeMirror

    export default {
        name: "aviator-script-codemirror",
        components: {CommVarInf},
        props: {
            disabled: {default: false, type: Boolean},
            /**
             * @see ASVar
             * @see DataProcessVar
             */
            pAsVar: {default: () => {}, type: Object, required: true},
            pVarList : {default :()=>[], type : Array}
        },
        data() {
            return {
                messageEnums:messageEnums,
                cmKey: getUUID(),
                activeName:'first',
                codeCmOptions: {
                    //使用的语言
                    mode: "text/javascript",
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
                    readOnly: this.disabled,
                    // 代码提示
                    // hint: CodeMirror.,
                    extraKeys: {"Tab": "autocomplete"},
                    autocomplete: true,
                    hintOptions: {
                        completeSingle: false
                    }
                },

                debug: {isShow: false, isLoading: false, debugResult: '', input: ''},
                jsonCmOptions: {
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
                    readOnly: this.disabled,
                    smartIndent: true,
                    //显示行号
                    lineNumbers: true,
                    //括号匹配
                    matchBrackets: true,
                    extraKeys: { "Tab": "autocomplete" }
                },
                dataTypeEnums : dataTypeEnums,

                isNeedSet: true,
            }
        },

        mounted() {
            let that = this;
            that.$refs.codeCm.codemirror.on('change', function (item) {
                that.$refs.codeCm.codemirror.showHint();  //满足自动触发自动联想功能
            });
        },

        computed: {
            computedError() {
                if (isContainEmpty([this.pAsVar.varName, this.pAsVar.varType, this.pAsVar.code])) {
                    return "结果命名、结果类型或代码未填写"
                }
                return "";
            }
        },

        watch: {
            // 监听组件变量变化
            pAsVar: {
                handler(value) {
                    this.debug.debugResult = '';
                    if(this.isNeedSet) {
                        this.$refs.commVarInf.setOldPVar(this.pAsVar);
                        this.isNeedSet = false;
                    }
                },
                deep: true
            },

            // 监听事件，修改代码提示
            pVarList: {
                handler(value) {
                    this.changeHint(value)
                },
                deep: true
            },
        },

        methods: {
            handleClick(){
                this.changeCMUUID();
            },

            changeCMUUID(){
              this.cmKey = getUUID();
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

            handleCommand(command) {
                switch (command) {
                    case 'debugScript':
                        this.debugScript();
                        break;
                    case 'formatJSON':
                        this.formatJSON();
                        break;
                    case 'autoCreateInput':
                        this.autoCreateInput();
                        break;
                }
            },

            // 格式化JSON
            formatJSON() {
                this.pAsVar.asInput = JSON.stringify(JSON.parse(this.pAsVar.asInput), null, 4)
            },

            // 根据脚本代码匹配脚本输入
            autoCreateInput() {
                const autoInput = {};
                const that = this;
                this.pVarList.forEach(item => {
                    const name = item.getPrefixVarName();
                    const type = isEmpty(item.varType) ? "" : item.varType;
                    if (that.pAsVar.code.includes(name)) {
                        switch (type.toLowerCase()) {
                            case dataTypeEnums.DOUBLE.code.toLowerCase():
                            case dataTypeEnums.INTEGER.code.toLowerCase():
                                autoInput[name] = 0;
                                break;
                            case dataTypeEnums.ARRAY.code.toLowerCase():
                                autoInput[name] = [];
                                break;
                            case dataTypeEnums.OBJECT.code.toLowerCase():
                                autoInput[name] = {};
                                break;
                            case dataTypeEnums.TIMESTAMP.code.toLowerCase():
                                autoInput[name] = new Date();
                                break;
                            default:
                                autoInput[name] = '';
                        }
                    }
                });
                this.pAsVar.asInput = JSON.stringify(autoInput, null, 4)
            },

            // 测试脚本
            debugScript() {
                const that = this;
                if (isEmpty(this.pAsVar.asInput)){
                    that.$message({message: "输入为空", type: 'warning'})
                }

                const params = {codeScript: this.pAsVar.code, input: JSON.parse(this.pAsVar.asInput)};
                that.debug.isLoading = true;
                testAviator(params).then((res) => {
                    const success= res.data.data.success ? "成功" :"失败";
                    const result = res.data.data.result;
                    that.debug.debugResult = `${success}，消息：${result}`
                }).finally(() => {
                    that.debug.isLoading = false;
                })
            },

            changeHint(value){
                function getVarHintWord() {
                    return value.map(item => {
                        const name = item.getPrefixVarName();
                        const simpleDesc = item.getSimpleDesc();
                        if (isEmpty(simpleDesc)) {
                            return name;
                        } else {
                            return `${name} ## ${simpleDesc}`
                        }
                    })
                }

                const hintWords = ("break case catch let continue default else false finally for function " +
                    "if in null return switch true try typeof while nil").split(" ");
                hintWords.push(...getVarHintWord());
                hintWords.push(...funcList);

                function filterKeyWords(keywords, token) {
                    return keywords.filter(item => (item.includes(token.string) && token.string.trim() !== ''))
                }
                function scriptHint(editor, keywords, getToken, options) {
                    let cur = editor.getCursor(), token = getToken(editor, cur);

                    return {
                        list: filterKeyWords(keywords, token),
                        from: CodeMirror.Pos(cur.line, token.start),
                        to: CodeMirror.Pos(cur.line, token.end)
                    };
                }
                function aviatorScriptHint(editor, options) {
                    return scriptHint(editor, hintWords, function (e, cur) {
                        return e.getTokenAt(cur);
                    }, options);
                }
                CodeMirror.registerHelper("hint", "javascript", aviatorScriptHint);
            }
        }
    }
</script>

<style scoped>
    #aviator-script-codemirror >>> .CodeMirror{
        height: 250px;
    }

    #aviator-script-codemirror {
        padding-left: 15px;
    }

</style>
