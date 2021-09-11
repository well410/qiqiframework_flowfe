<template>
    <!--外部规则-->
    <div>
        <el-table
                :data="computeERList"
                tooltip-effect="dark"
                stripe
                size="mini">
            <el-table-column prop="ruleId" align="center" label="规则ID"></el-table-column>
            <el-table-column prop="ruleVersion" align="center" label="规则版本"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {isEmpty} from "../../utils";

    export default {
        name: "tooltip-er-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {}
            }
        },
        computed:{
            computeERList() {
                if (isEmpty(this.pNode.nData) || isEmpty(this.pNode.nData.extRuleRelList)){
                    return []
                }

                return this.pNode.nData.extRuleRelList;
            }
        }
    }
</script>

<style scoped>

</style>
