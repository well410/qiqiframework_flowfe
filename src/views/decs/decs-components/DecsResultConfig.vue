<template>
    <div>
        <vue-json-pretty
                :key="uuid"
                selectableType="multiple"
                v-model="pResultConfig"
                :pathChecked="pResultConfig"
                :showSelectController="true"
                :highlightSelectedNode="true"
                :pathSelectable="pathSelectableFun"
                :data="resultFormat">
        </vue-json-pretty>
    </div>
</template>

<script>
    import VueJsonPretty from 'vue-json-pretty'
    import 'vue-json-pretty/lib/styles.css'
    import {getUUID} from "../../../components";

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
                uuid:getUUID(),
                pathSelectableFun: pathSelectable,
                resultFormat: {
                    "nLog": "节点日志信息", // 记录了所有的异常信息
                    "cmptResult": "组件返回结果",    // 记录了组件返回结果
                    "urResult": "元规则节点结果",      // 记录了元规则节点结果
                    "ruleIdSet": "节点执行顺序",     // 记录了节点执行顺序
                    "ruleResult": "规则结果",       // 记录了规则结果
                    "vars": {            // 记录了所有的变量
                        "df": "节点默认输出",
                        "av": "别名变量",
                        "cov": "组件节点变量",
                        "tv": "元规则中间变量",
                        "riv": "规则输入变量",
                        "urv": "元规则输出变量",
                        "ugv": "元规则-流程式输出变量",
                        "obj": "对象节点变量",
                        "arr": "数组节点变量",
                        "const": "常量节点变量",
                        "pre": "预处理结果",
                        "rdv": "变量平台变量",
                        "scv": "评分卡输出变量",
                        "tqsMv": "天擎平台返回变量",
                        "ev": "事件变量",
                        "asv": "AviatorScript脚本语言",
                        "dpv": "数据处理节点输出"
                    },
                    "decsResult": "决策结果节点变量"     // 决策结果节点产生的变量
                }
            }
        },

        methods: {
            // 重新修改 key 可以渲染页面
            changeKey(){
                this.uuid = getUUID();
            },

            getResultConfig(){
                return this.pResultConfig;
            }
        }
    }
</script>

<style scoped>

</style>
