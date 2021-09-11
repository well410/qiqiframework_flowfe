<template>
    <!--外部规则-->
    <div>
        <el-table
                :data="computeCompList"
                tooltip-effect="dark"
                stripe
                size="mini">
            <el-table-column prop="ruleId" align="center" label="变量ID"></el-table-column>
            <el-table-column prop="ruleName" align="center" label="变量名"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {isEmpty} from "../../utils";

    export default {
        name: "tooltip-comp-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {}
            }
        },
        computed:{
            computeCompList() {
                // 此时，你可能会比较迷糊，不是组合变量嘛。为什么是ruleList呢？组合变量和rule神似，所以直接套用了rule。
                if (isEmpty(this.pNode.nData) || isEmpty(this.pNode.nData.ruleList)){
                    return []
                }

                return this.pNode.nData.ruleList;
            }
        }
    }
</script>

<style scoped>

</style>
