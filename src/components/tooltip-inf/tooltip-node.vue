<template>
    <!--tooltip的信息展示-->
    <div>
        <el-form size="mini" label-width="80px">
            <el-form-item size="mini" label="节点编号">{{computeNode.nData.uniqueName}}</el-form-item>
            <el-form-item size="mini" label="节点名称">{{computeNode.name}}</el-form-item>
            <el-form-item size="mini" label="连线类型">{{computeNode.nData.connType}}</el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {isEmpty} from "../../utils";

    export default {
        name: "tooltip-node",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {
                }
            }
        },
        computed: {
            computeNode() {
                if (isEmpty(this.pNode.nData)) {
                    return {nData: {}}
                } else {
                    return this.pNode;
                }
            }
        }
    }
</script>

<style scoped>

</style>
