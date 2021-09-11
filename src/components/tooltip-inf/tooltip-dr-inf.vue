<template>
    <div>
        <el-table
                :data="computeDRList"
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
    import {DOVar} from "../../entity/vars";

    export default {
        name: "tooltip-dr-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {}
            }
        },
        computed:{
            computeDRList() {
                if (isEmpty(this.pNode.nData) || isEmpty(this.pNode.nData.decsResultList)){
                    return []
                }

                return this.pNode.nData.decsResultList.map(item => {
                    const doVar = DOVar.obj2DOVar(item);
                    return {
                        prefixVarName: doVar.getPrefixVarName(),
                        mapField: doVar.mapField,
                        varDesc: doVar.varDesc,
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
