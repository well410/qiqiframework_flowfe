<template>
    <div class="json-editor">
        <textarea ref="textarea"></textarea>
    </div>
</template>
<script>
    import CodeMirror from "codemirror";
    import "codemirror/addon/lint/lint.css";
    import "codemirror/lib/codemirror.css";
    import "codemirror/theme/idea.css";
    import "codemirror/mode/javascript/javascript";
    import "codemirror/addon/lint/lint";
    import "codemirror/addon/lint/json-lint";
    import "codemirror/addon/edit/closebrackets";
    import 'codemirror/addon/display/autorefresh'
    require("script-loader!jsonlint");

    export default {
        name: "JsonEditor",
        /* eslint-disable vue/require-prop-types */
        props: {
            value: {
            },
            // 是否只读，默认否
            readOnly: {
                type: Boolean,
                default: false,
            },
        },
        data () {
            return {
                jsonEditor: null,
            };
        },
        watch: {
            'value' : {
                handler (newVal, oldVal) {
                    const editorValue = this.jsonEditor.getValue();
                    if (newVal !== editorValue) {
                        this.jsonEditor.setValue(JSON.stringify(this.value, null, 4));
                    }
                },
                deep: true
            },
        },
        mounted() {
            this.initJsonEditor();
            this.jsonEditor.setOption("readOnly", this.readOnly);
        },
        methods: {
            // 初始化jsonEditor
            initJsonEditor() {
                this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
                    lineNumbers: true,
                    mode: "application/json",
                    gutters: ["CodeMirror-lint-markers"],
                    theme: "idea",
                    indentUnit: 4,
                    smartIndent: true,
                    lint: true,
                    matchBrackets: true,
                    styleActiveLine: true,
                    autoRefresh: true
                });
                this.jsonEditor.setValue(JSON.stringify(this.value, null, 4));
                // this.jsonEditor.setValue(this.value);
                this.jsonEditor.on("change", cm => {
                    this.$emit("changed", cm.getValue());
                    this.$emit("input", cm.getValue());
                });
            },
            // 获取json
            getValue() {
                return this.jsonEditor.getValue();
            },
            /**
             * autoRefresh有时候不起效，使用手动refresh
             * */
            refresh () {
                this.jsonEditor.refresh();
            }
        },
    };
</script>

<style lang="less">
    .json-editor {
        /*height: 300px;*/
        overflow-y: auto;
        position: relative;
        font-size: 14px;
        width: 100%;
        border: 1px solid #ddd;
        .CodeMirror {
            height: auto;
            /*min-height: 300px;*/
            .CodeMirror-line {
                line-height: 1.5;
            }
        }
        .CodeMirror-scroll {
            /*min-height: 300px;*/
        }
        .CodeMirror-linenumber {
            color: #2b91af;
            height: 20px;
            line-height: 20px;
        }
        .CodeMirror-gutters {
            //background-color: #fff;
            border-right: 0;
        }
        span.cm-string {
            color: #f08047;
        }
    }
</style>