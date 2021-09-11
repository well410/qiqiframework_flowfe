<template>
    <!--规则源码-->
    <div id="funcCode">
        <codemirror v-model="drlCode" :options="cmOptions"
                    style="line-height:20px;z-index: 10000"></codemirror>
    </div>
</template>

<script>
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"
    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"


    export default {
        name: "FuncCode",
        props: {func: Object},
        data() {
            return {
                drlCode: '',
                cmOptions: {
                    //使用的语言
                    mode: 'text/javascript',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    showCursorWhenSelecting: true,
                    autofocus: false,
                    readOnly: true,
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
            // 从外部直接设置源码
            setDrlCode(drlCode){
                this.drlCode = drlCode;
            },
        }
    }
</script>

<style scoped>

</style>
