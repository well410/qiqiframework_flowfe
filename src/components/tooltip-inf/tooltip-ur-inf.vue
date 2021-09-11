<template>
    <div>
        <el-table
                :data="computeUResultList"
                tooltip-effect="dark"
                stripe
                size="mini">
            <el-table-column prop="logicId" width="80px" align="center" label="逻辑序号"></el-table-column>
            <el-table-column prop="resultValue" align="center" label="结果值"></el-table-column>
            <el-table-column prop="resultDesc" align="center" label="结果描述"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {isEmpty} from "../../utils";

    export default {
        name: "tooltip-ur-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {}
            }
        },
        computed: {
            computeUResultList(){
                if (isEmpty(this.pNode.nData) || isEmpty(this.pNode.nData.uResultList)){
                    return [];
                }

                return this.pNode.nData.uResultList;
            }
        }
    }
</script>

<style scoped>

</style>
