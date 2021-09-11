<template>
    <div>
        <el-table
                :data="pVarList"
                tooltip-effect="dark"
                stripe
                border
                max-height="600px"
                size="mini"
                style="width: 100%">
            <el-table-column
                    label="序号"
                    type="index"
                    width="55">
            </el-table-column>
            <el-table-column  :label="messageEnums.VAR_NAME_REAL.name" >
                <template slot-scope="scope" slot="header">
                    <span>{{messageEnums.VAR_NAME_REAL.name}}</span>
                    <el-tooltip class="item" effect="dark" content="传给子节点的变量名" placement="top">
                        <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                    </el-tooltip>
                </template>
                <template slot-scope="props">
                    {{props.row.getPrefixVarName()}}
                </template>
            </el-table-column>

            <el-table-column  :label="messageEnums.VAR_TYPE.name" >
                <template slot-scope="props">
                    {{props.row.varType}}
                </template>
            </el-table-column>

            <el-table-column prop="varDesc" :label="messageEnums.VAR_DESC.name" >
                <template slot-scope="props">
                    {{props.row.varDesc}}
                </template>
            </el-table-column>

            <slot></slot>

        </el-table>
    </div>
</template>

<script>

    import {messageEnums} from "../../entity/enumns";

    export default {
        name: "CommVarTableInf",
        props: {
            pVarList: {type: Array, require: true},
        },
        data(){
            return{
                messageEnums: messageEnums,
            }
        },
    }
</script>

<style scoped>

</style>
