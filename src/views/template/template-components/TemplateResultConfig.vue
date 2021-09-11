<template>
    <div>
        <vue-json-pretty
                selectableType="multiple"
                v-model="resultConfig"
                :showSelectController="true"
                :pathSelectable="pathSelectableFun"
                :data="resultFormat"
                @click="handleClick">
        </vue-json-pretty>
    </div>
</template>

<script>
    import VueJsonPretty from 'vue-json-pretty'

    export default {
        name: "DecsResultConfig",
        components: {
            VueJsonPretty
        },
        props: {pResultConfig: {type: Array, default: () => []}},
        data() {
            const pathSelectable = function (itemPath, itemData) {
                return !['root.vars', 'root'].includes(itemPath);
            };

            return {
                resultConfig: [],
                pathSelectableFun: pathSelectable,
                resultFormat: {
                    "errorMsgList": "异常信息", // 记录了所有的异常信息
                    "cmptResult": "组件返回结果",    // 记录了组件返回结果
                    "urResult": "元规则节点结果",      // 记录了元规则节点结果
                    "ruleIdSet": "节点执行顺序",     // 记录了节点执行顺序
                    "ruleResult": "规则结果",       // 记录了规则结果
                    "vars": {            // 记录了所有的变量
                        "arr": "数组节点变量",       // 数组节点产生的变量
                        "ev": "事件变量",        // 上游输入的变量
                        "tv": "元规则中间变量",        // 元规则节点中的中间变量
                        "const": "常量节点变量",      // 常量节点输出的变量
                        "rdv": "变量平台变量",       // 变量平台节点产生的变量
                        "obj": "对象节点变量",       // 对象节点产生的变量
                        "cov": "组件节点变量"        // 组件节点产生的变量
                    },
                    "decsResult": "决策结果节点变量"     // 决策结果节点产生的变量
                }
            }
        },

        methods: {
            handleClick(data) {
                console.log(data)
                console.log(this.resultConfig)
            }
        }
    }
</script>

<style scoped>

</style>
