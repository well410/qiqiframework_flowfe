<template>
    <div>
        <el-table
                :data="computeConstList"
                tooltip-effect="dark"
                stripe
                size="mini">
            <el-table-column prop="prefixVarName" align="center" label="变量名"></el-table-column>
            <el-table-column prop="varValue" align="center" label="变量值"></el-table-column>
            <el-table-column prop="varDesc" align="center" label="变量描述"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {ConstVar} from "../../entity/vars";
    import {isEmpty} from "../../utils";

    export default {
        name: "tooltip-const-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {
                }
            }
        },
        computed: {
            computeConstList() {
                if (isEmpty(this.pNode.nData) || isEmpty(this.pNode.nData.constVarList)) {
                    return [];
                }

                return this.pNode.nData.constVarList.map(item => {
                    return {
                        prefixVarName: ConstVar.obj2ConstVar(item).getPrefixVarName(),
                        varValue: ConstVar.obj2ConstVar(item).varValue,
                        varDesc: ConstVar.obj2ConstVar(item).varDesc,
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
