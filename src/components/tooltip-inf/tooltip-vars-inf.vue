<template>
    <div>
        <el-table
                :data="computeVarBaseList"
                tooltip-effect="dark"
                stripe
                size="mini">
            <el-table-column prop="varsId" align="center" label="变量Id"></el-table-column>
            <el-table-column prop="dataType" width="80px" align="center" label="变量类型"></el-table-column>
            <el-table-column prop="desc" align="center" label="变量描述"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {isEmpty} from "../../utils";

    export default {
        name: "tooltip-vars-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {
                }
            }
        },
        computed: {
            computeVarBaseList(){
                if (isEmpty(this.pNode.nData) || isEmpty(this.pNode.nData.varConfigList)){
                    return [];
                }

                return this.pNode.nData.varConfigList.map(item=>item.varBase);
            }
        }
    }
</script>

<style scoped>

</style>
