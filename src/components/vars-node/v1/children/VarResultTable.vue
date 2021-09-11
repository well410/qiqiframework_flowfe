<template>
    <!--变量平台映射后的结果-->
    <el-table
            :data="pVarList"
            tooltip-effect="dark"
            stripe
            size="mini"
            border
            style="width: 100%">
        <el-table-column prop="varsId" label="字段名"></el-table-column>
        <el-table-column prop="dataType" label="字段类型"></el-table-column>
        <el-table-column prop="desc" label="字段描述"></el-table-column>
        <el-table-column label="操作符" width="80px">
            <template slot-scope="props">
                <el-button type="danger" @click="deleteClick(props.row)" :disabled="disabled" size="mini">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "VarResultTable",
        props:{
            disabled: {default: false, type: Boolean},
            pVarList:{default:()=>[], Array}
        },
        methods:{
            deleteClick(row){
                this.$emit("deleteClick" ,row)
            }
        }

    }
</script>

<style scoped>

</style>
