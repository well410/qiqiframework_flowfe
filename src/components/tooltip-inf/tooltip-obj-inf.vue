<template>
    <!--JSON解析组件-->
    <div>
        <el-table
                :data="computeObjList"
                tooltip-effect="dark"
                stripe
                size="mini">
            <el-table-column prop="prefixVarName" align="center" label="变量名"></el-table-column>
            <el-table-column prop="valuePath" align="center" label="映射路径"></el-table-column>
            <el-table-column prop="mapField" align="center" label="引用对象"></el-table-column>
            <el-table-column prop="varDesc" align="center" label="变量描述"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {isEmpty} from "../../utils";
    import {OBJVar} from "../../entity/vars";

    export default {
        name: "tooltip-obj-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {
                }
            }
        },
        computed: {
            computeObjList() {
                if (isEmpty(this.pNode.nData) || isEmpty(this.pNode.nData.objVarList)) {
                    return [];
                }

                return this.pNode.nData.objVarList.map(item => {
                    const objVar = OBJVar.obj2OBJVar(item);
                    return {
                        prefixVarName: objVar.getPrefixVarName(),
                        varType: objVar.varType,
                        valuePath: objVar.valuePath,
                        mapField: objVar.mapField,
                        varDesc: objVar.varDesc,
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
