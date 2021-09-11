<template>
    <!--规则源码-->
    <div id="ruleCode">
        <!--<codemirror v-model="drlCode" :options="cmOptions"-->
                    <!--style="line-height:20px;z-index: 10000"></codemirror>-->
        <codemirror-show
                ref="cmShow"
                :p-code="drlCode"
                :p-mode="'text/javascript'"></codemirror-show>
    </div>

</template>

<script>

    import {isEmpty} from "../../../../utils";
    import CodemirrorShow from "../../../../components/codemirror/CodemirrorShow";
    import {tabType} from "../../../../entity/enumns";
    import {G6Model} from "../../../../entity/g6Model";

    export default {
        name: "RuleCode",
        components: {CodemirrorShow},
        props: {rule: Object},
        data() {
            return {
                drlCode: ''
            }
        },
        methods: {


            // 从外部直接设置源码
            setDrlCode(drlCode) {
                if (isEmpty(drlCode)) {
                    drlCode = '';
                }
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
                    let ruleFlowComp = that.$parent.$parent['panes'].filter(pane=>pane.name === tabType.ruleFlowG6)[0].$children[0];
                    that.drlCode = G6Model.getDrlCode(ruleFlowComp.getDecisionTree(), that.rule);
                    that.$refs.cmShow.refresh();

                } catch (e) {
                    console.error('RuleCode初始化失败', e)
                }
            }
        }
    }
</script>

<style scoped>
    #ruleCode >>> .CodeMirror{
        height: 666px;
        /*margin-left: 20px;*/
        /*margin-right: 20px;*/
    }
</style>
