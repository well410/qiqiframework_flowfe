<template>
    <div id="UnitRuleCode">
        <codemirror-show
                ref="urCode"
                :p-code="drlCode"
                :p-mode="'text/javascript'"></codemirror-show>
    </div>
</template>

<script>
    import {DecsBase} from "../../../entity/decs";
    import CodemirrorShow from "../../codemirror/CodemirrorShow";
    import {UnitRuleG6Model} from "../entity/UnitRuleG6Model";

    export default {
        name: "UnitRuleCode",
        components: {CodemirrorShow},
        data() {
            return {
                drlCode: '',
            }
        },
        watch:{
            drlCode:{
                handler(value) {
                    this.$emit("changeDrlCode",value);
                },
                deep: true
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
            initCode(graph, graphData,uRNode) {
                let that =  this;
                try {
                    that.drlCode = UnitRuleG6Model.getDrlCode(graph, graphData,uRNode);
                    that.$refs.urCode.refresh();
                    // key标记组件身份，当key改变时就是释放原始组件，重新加载新的组件
                } catch (e) {
                    console.error('RuleCode初始化失败', e)
                }
            }
        }
    }
</script>

<style scoped>
#UnitRuleCode>>>  .CodeMirror{
    height: 800px;
}
</style>