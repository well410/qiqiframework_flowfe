<template>
    <div style="margin-top: 10px">
        <el-form label-width="100px">
            <el-form-item label="函数id">
                {{pFunc.funcId}}
            </el-form-item>

            <el-form-item label="函数名">
                {{pFunc.funcName}}
            </el-form-item>

            <el-form-item label="函数版本">
                {{pFunc.funcVersion}}
            </el-form-item>

            <el-form-item label="函数类型">
                {{funTypeEnums[pFunc.funcType].name}}
            </el-form-item>

            <el-form-item label="函数状态">
                {{statusEnums[pFunc.status].name}}
            </el-form-item>

            <el-form-item label="函数源码">
                <codemirror-show :p-code="pFunc.funcDrl"></codemirror-show>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>


    import CodemirrorShow from "../codemirror/CodemirrorShow";
    import {funTypeEnums, statusEnums} from "../../entity/enumns";

    export default {
        name: 'FuncShow',
        components: {CodemirrorShow},
        props: {
            pFunc: Object
        },

        data() {
            return {
                funTypeEnums: funTypeEnums,
                statusEnums: statusEnums
            }
        },
        mounted() {

        },

        methods: {}
    }


</script>


<style scoped>
    .show-function-row {
        margin: 10px;
    }

    .show-function-line {
        height: 1px;
        background: #475669;
        overflow: hidden;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .show-function-title {
        font-size: large;
    }

    .show-function-info-div {
        margin-left: 20px;
    }

    .show-function-key {
        font-size: larger;
    }

    .show-function-value {
        font-size: medium;
        color: lightslategrey;
    }


</style>
