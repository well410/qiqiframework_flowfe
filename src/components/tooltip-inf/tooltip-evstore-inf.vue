<template>
    <!--入库组件-->
    <div>
        <el-form ref="form1" size="mini" label-width="80px" v-if="isNotEmpty(computeEV.datasourceId)">
            <el-form-item label="数据源Id">{{computeEV.datasourceId}}</el-form-item>
            <el-form-item label="数据源名">{{computeEV.datasourceName}}</el-form-item>
            <el-form-item label="数据源url">{{computeEV.dataLand['jdbc_url']}}</el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {isNotEmpty} from "../../utils";

    export default {
        name: "tooltip-evstore-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {}
            }
        },
        computed: {
            computeEV() {
                if (this.pNode.nData && isNotEmpty(this.pNode.nData.datasource)) {
                    return this.pNode.nData.datasource;
                } else {
                    return {}
                }
            }
        }
    }
</script>

<style scoped>

</style>
