<template>
    <!--规则源码-->
    <div id="decsCode">
        <codemirror-show
                ref="cmShow"
                :p-code="drlCode"
                :p-mode="'text/javascript'"></codemirror-show>
    </div>
</template>

<script>
    import {DecsBase} from "../../../../entity/decs";
    import CodemirrorShow from "../../../../components/codemirror/CodemirrorShow";
    import {tabType} from "../../../../entity/enumns";
    import {G6Model} from "../../../../entity/g6Model";

    export default {
        name: "TemplateCode",
        components: {CodemirrorShow},
        props: {pDecs: DecsBase},
        data() {
            return {
                drlCode: '',
            }
        },

        methods:{
            // 从外部直接设置源码
            setDrlCode(drlCode){
                this.drlCode = drlCode;
            },

            /**
             * 初始化规则源码（从规则图中加载源码）
             * 1. 获取 RuleFlow 组件
             * 2. 获取 RuleFlow 的规则代码并赋值
             */
            init() {
                try {
                    let that = this;
                    let decsFlowComp = that.$parent.$parent['panes'].filter(pane=>pane.name === tabType.decsFlowG6)[0].$children[0];

                    that.drlCode = G6Model.getDrlCode(decsFlowComp.getDecisionTree(), that.pDecs);
                    that.$refs.cmShow.refresh();
                    // key标记组件身份，当key改变时就是释放原始组件，重新加载新的组件
                } catch (e) {
                    console.error('RuleCode初始化失败', e)
                }
            }
        }
    }
</script>

<style scoped>
    #decsCode >>> .CodeMirror{
        height: 666px;
        /*margin-left: 20px;*/
        /*margin-right: 20px;*/
    }
</style>
