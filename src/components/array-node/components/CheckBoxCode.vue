<template>
    <!--用来选择需要生成什么代码-->
    <el-checkbox-group v-model="checkedCodeNo" @change="handleCheckedCodeChange">
        <el-checkbox v-if="!pRemoveList.includes('变量处理')" label="变量处理" :disabled="disabled" key="varHandle"></el-checkbox>
        <el-checkbox v-if="!pRemoveList.includes('过滤')" label="过滤" :disabled="disabled" key="filter"></el-checkbox>
        <el-checkbox v-if="!pRemoveList.includes('聚合')" label="聚合" :disabled="disabled" key="groupBy"></el-checkbox>
        <el-checkbox v-if="!pRemoveList.includes('统计')" label="统计" :disabled="disabled" key="statistics"></el-checkbox>
        <el-checkbox v-if="!pRemoveList.includes('循环')" label="循环" :disabled="disabled" key="iterationCode"></el-checkbox>
    </el-checkbox-group>
</template>

<script>
    export default {
        name: "CheckBoxCode",
        props: {
            pRemoveList: {default: () => [], type: Array},
            disabled: {default: false, type: Boolean},
        },
        data() {
            return {
                checkedCodeNo:[],
            }
        },
        methods:{
            handleCheckedCodeChange(val){
                this.$emit("handleCheckedCodeChange", val);
            },

            setCheckedCodeNo(arr){
                this.checkedCodeNo.length = 0;
                this.checkedCodeNo.push(...arr);
            }
        }
    }
</script>

<style scoped>

</style>
