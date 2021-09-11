<template>
    <!--聚合的代码，生成 GroupByCodeEdit-->
    <div class="logic-box" style="padding-left: 10px;padding-top: 10px">
        <el-tag style="margin-right: 10px">聚合</el-tag>
        <el-button type="success" size="mini" @click="addGroupBy" :disabled="disabled">添加</el-button>
        <el-button type="danger" size="mini" @click="deleteGroupBy" :disabled="disabled">删除</el-button>
        <span style="color: red; margin-left: 10px">{{errorMsg}}</span>
        <el-table
                :stripe="true"
                :data="pGroupByCode.groupByList"
                :show-header="true"
                style="margin-top: 10px"
                @selection-change="handleSelectionChange"
                size="mini">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column prop="varName" label="字段名">
                <template slot-scope="scope">
                    <el-input v-model="scope['row'].varName" size="mini"
                              :disabled="disabled"
                              @input="scope['row'].varName = patternEnums.VarName.varNameFilter(scope['row'].varName)">
                        <template slot="prepend">g_</template>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="varType" label="字段类型"></el-table-column>
            <el-table-column label="操作字段">
                <template slot-scope="scope">
                    <el-select placeholder="请选择"
                               :disabled="disabled"
                               filterable
                               v-model="scope['row'].optValName"
                               size="mini">
                        <el-option v-for="item in pRelVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {optTypeEnums, patternEnums} from "../../../entity/enumns";
    import {GroupBy} from "../index";
    import {isContainEmpty, isEmpty, isNotEmpty} from "../../../utils";
    import FuncTable from "../../func/FuncTable";

    export default {
        name: "GroupByCodeEdit",
        components: {FuncTable},
        props: {
            pGroupByCode: {type: Object, default: () => {}},
            // 引用的变量
            pRelVarList: {type: Array, require : true},
            pDecisionTree: {type: Object, default: () => {}},
            // 层级
            pLevel: {type: String, default: "level1"},
            disabled: {default: false, type: Boolean},
        },

        computed: {
            errorMsg() {
                let filter = this.pGroupByCode.groupByList.filter(item => {
                    return isContainEmpty([item.optValName, item.varName])
                });

                if (isNotEmpty(filter)) {
                    return `${isEmpty(filter[0].varName) ? "" : filter[0].varName}未填完全`;
                }
                return "";
            }
        },

        data() {
            return {
                optTypeEnums: optTypeEnums,
                patternEnums: patternEnums,
                multipleSelection: [],
                funDialog: {isShow: false, title: "函数选择"},
            }
        },
        methods: {
            // 多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val);
            },

            // 删除
            deleteGroupBy() {
                let uuidList = this.multipleSelection.map(item => item.uuid);
                this.pGroupByCode.groupByList = this.pGroupByCode.groupByList.filter(item => !uuidList.includes(item.uuid));
            },

            // 添加
            addGroupBy() {
                this.pGroupByCode.groupByList.push(new GroupBy({varType : "array"}))
            }
        }
    }
</script>

<style scoped>

</style>
