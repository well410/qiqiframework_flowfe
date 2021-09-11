<template>
    <!--规则结果-->
    <div>
        <el-table
                :data="computeRRList"
                tooltip-effect="dark"
                stripe
                size="mini">
            <el-table-column prop="prefixVarName" align="center" label="变量名"></el-table-column>
            <el-table-column prop="mapField" align="center" label="变量值映射"></el-table-column>
            <el-table-column prop="varDesc" align="center" label="变量描述"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {isEmpty} from "../../utils";
    import {ROVar} from "../../entity/vars";

    export default {
        name: "tooltip-rr-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {}
            }
        },
        computed:{
            computeRRList() {
                if (isEmpty(this.pNode.nData) || isEmpty(this.pNode.nData.ruleResultList)){
                    return []
                }

                return this.pNode.nData.ruleResultList.map(item => new ROVar(item)).map(item => {
                    return {
                        prefixVarName: item.getPrefixVarName(),
                        mapField: item.mapField,
                        varDesc: item.varDesc,
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
