<template>
    <!--仅显示代码，子组件修改pCode值时，父组件值发生改变。不符合父组件的单向数据流，会有异常-->
    <codemirror v-model="pCode"
                id="codemirror"
                :key="key"
                :options="cmOptions"
                style="line-height:20px;z-index: 1"></codemirror>
</template>

<script>
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"
    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"
    import {getUUID} from "../index";

    export default {
        name: "CodemirrorShow",
        props: {
            pCode: {default: "", type: String},
            pMode: {default: "application/json", type: String},
        },


        mounted() {
            this.key = getUUID();
        },

        data() {
            return {
                key: getUUID(),
                cmOptions: {
                    //使用的语言
                    mode: this.pMode,
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    showCursorWhenSelecting: true,
                    autofocus: false,
                    line: true,
                    readOnly: true,
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
            // 重新刷新组件
            refresh() {
                this.key = getUUID();
            }
        }
    }
</script>

<style scoped>
 #codemirror >>> .CodeMirror {
     z-index: 1;
 }
</style>
