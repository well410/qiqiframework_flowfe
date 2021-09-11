<template>
    <div>

        <el-row>
            <el-col :span="18">
                <el-input placeholder="请输入搜索内容" v-model="search" size="mini" >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-col>
            <el-col :offset="2" :span="4" v-if="isNeedAdd">
                <el-button size="mini" type="primary" @click="onAddClick" :disabled="disabled">添加</el-button>
            </el-col>
        </el-row>



        <el-table
                id="conditionTable"
                :data="computeFilterCdList"
                tooltip-effect="dark"
                stripe
                border
                max-height="266px"
                row-key="cdId"
                size="mini"
                style="width: 100%">
            <el-table-column prop="cdId" label="条件序号" width="80px" align="center" class-name="canDrop"></el-table-column>
            <el-table-column align="center" label="数据类型" width="80px">
                <template slot-scope="scope">
                    {{scope['row'].getVarType()}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="条件逻辑">
                <template slot-scope="scope">
                    {{scope['row'].getSimpleInf()}}
                </template>
            </el-table-column>
            <el-table-column prop="cdDesc" align="center" label="条件描述"></el-table-column>
            <slot></slot>
        </el-table>
    </div>
</template>

<script>
    import {isEmpty} from "../../../utils";

    export default {
        name: "RuleCommCdTable",
        props: {
            disabled: {default: false, type: Boolean},
            // 逻辑操作
            pCdList: {default: ()=>[], type: Array},
            isNeedAdd: {default: false, type: Boolean},
        },

        computed: {
            computeFilterCdList() {
                if (!isEmpty(this.pCdList) && !isEmpty(this.search)) {
                    return this.pCdList.filter(item =>
                        JSON.stringify(item).toLowerCase().includes(this.search) ||
                        item.getVarType().toLowerCase().includes(this.search) ||
                        item.getSimpleInf().toLowerCase().includes(this.search)
                    )
                }

                if (isEmpty(this.search)){
                    return this.pCdList;
                }

                return [];
            }
        },

        data() {
            return {
                search: ""
            }
        },

        methods:{
            onAddClick(){
                this.$emit("onAddClick")
            }
        }
    }
</script>

<style scoped>

</style>
