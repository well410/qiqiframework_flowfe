<template>
    <div>
        <el-table></el-table>
    </div>
</template>

<script>
    export default {
        name: "tooltip-arr-inf",
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {}
            }
        },
    }
</script>

<style scoped>

</style>
