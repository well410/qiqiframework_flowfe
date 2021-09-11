<template>
    <!-- 结果配置，把遍历中处理的结果导出 -->
    <div class="logic-box" style="padding-left: 10px;padding-top: 10px">
        <el-tag style="margin-right: 10px">结果配置</el-tag>
        <el-button type="success" size="mini" @click="addResultList" :disabled="disabled">添加</el-button>
        <el-button type="danger" size="mini" @click="deleteResultList" :disabled="disabled">删除</el-button>

        <el-table
                :stripe="true"
                :data="pArrIteration.resultList"
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
                              @input="scope['row'].varName = patternEnums.VarName.varNameFilter(scope['row'].varName)"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="varDesc" label="字段描述">
                <template slot-scope="scope">
                    <el-input v-model="scope['row'].varDesc" :disabled="disabled" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="varType" label="字段类型"></el-table-column>
            <el-table-column label="引用字段">
                <template slot-scope="scope">
                    <el-select placeholder="请选择"
                               :disabled="disabled"
                               v-model="scope['row'].mapField"
                               filterable
                               @change="mapFieldChange($event, scope['row'])"
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
    import {ArrIterationVar} from "../../../entity/vars";
    import {patternEnums} from "../../../entity/enumns";
    import {isNotEmpty} from "../../../utils";

    export default {
        name: "ResultListEdit",
        props: {
            pArrIteration: {type: Object, default: () => []},
            pRelVarList: {type: Array, default: () => []},
            disabled: {default: false, type: Boolean},
        },
        data() {
            return {
                multipleSelection: [],
                patternEnums: patternEnums,
            }
        },
        methods: {
            // 引用字段选择改变
            mapFieldChange(event, row){
                let filterArr = this.pRelVarList.filter(item=>item.getPrefixVarName() === event);
                if (isNotEmpty(filterArr)){
                    row.varType = filterArr[0].varType
                }
            },


            // 多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            // 添加结果
            addResultList() {
                this.pArrIteration.resultList.push(new ArrIterationVar())
            },

            // 删除
            deleteResultList() {
                let uuidList = this.multipleSelection.map(item => item.uuid);
                this.pArrIteration.resultList = this.pArrIteration.resultList.filter(item => !uuidList.includes(item.uuid));
            },
        }
    }
</script>

<style scoped>

</style>
