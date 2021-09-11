<template>
    <!--统计代码，生成 statisticsCode -->
    <div class="logic-box" style="padding-left: 10px;padding-top: 10px">
        <el-tag style="margin-right: 10px">统计</el-tag>
        <el-button type="success" size="mini" @click="addStatistics" :disabled="disabled">添加</el-button>
        <el-button type="danger" size="mini" @click="deleteStatistics" :disabled="disabled">删除</el-button>
        <span style="color: red; margin-left: 10px">{{errorMsg}}</span>
        <el-table
                :stripe="true"
                :data="pStatisticsCode.varHandleList"
                :show-header="true"
                style="margin-top: 10px"
                @selection-change="handleSelectionChange"
                size="mini">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column prop="varName" label="字段名" width="150px">
                <template slot-scope="scope">
                    <el-input v-model="scope['row'].varName" size="mini"
                              :disabled="disabled"
                              @input="scope['row'].varName = patternEnums.VarName.varNameFilter(scope['row'].varName)">
                        <template slot="prepend">s_</template>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column prop="varType" label="字段类型">
                <template slot-scope="scope">
                    <el-select v-model="scope['row'].varType" placeholder="请配置字段类型"
                               clearable
                               filterable
                               :disabled="disabled"
                               style="width: 80%"
                               size="mini">
                        <el-option label="String" value="String" key="String"></el-option>
                        <el-option label="Integer" value="Integer" key="Integer"></el-option>
                        <el-option label="Double" value="Double" key="Double"></el-option>
                        <el-option label="Timestamp" value="Timestamp" key="Timestamp"></el-option>
                        <el-option label="object" value="object" key="object"></el-option>
                        <el-option label="array" value="array" key="array"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="操作方法">
                <template slot-scope="scope">
                    <el-icon class="el-icon-edit"  @click.native="funSelBefore(scope['row'])" v-if="!disabled"></el-icon>
                    <el-icon class="el-icon-delete" style="margin-left: 5px" @click.native="deleteSelFunc(scope['row'])" v-if="!disabled"></el-icon>
                    <el-tag style="margin-left: 5px" size="mini" v-if="isNotEmpty(scope['row'].func.funcId)">
                        {{scope['row'].func.funcId}}
                    </el-tag>
                    <el-tag style="margin-left: 5px" size="mini" v-if="isNotEmpty(scope['row'].func.funcVersion)">
                        {{scope['row'].func.funcVersion}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作字段">
                <template slot-scope="scope">
                    <el-select placeholder="请选择"
                               v-model="scope['row'].optValNameList"
                               multiple
                               filterable
                               :disabled="disabled"
                               size="mini">
                        <el-option v-for="item in pRelVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()"
                                  class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>

        <!--函数选择-->
        <el-dialog :visible.sync="funDialog.isShow"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :title="funDialog.title">
            <func-table ref="funcTable"
                        :p-decision-tree="pDecisionTree"
                        @funSelClick="funSelClick"></func-table>
        </el-dialog>
    </div>
</template>

<script>
    import {VarHandle} from "../index";
    import {isContainEmpty, isEmpty, isNotEmpty} from "../../../utils";
    import FuncTable from "../../func/FuncTable";
    import {optTypeEnums, patternEnums} from "../../../entity/enumns";

    export default {
        name: "StatisticsCodeEdit",
        components: {FuncTable},
        props: {
            pStatisticsCode: {
                type: Object, default: () => {
                }
            },
            pRelVarList: {type: Array, default: () => []},
            pDecisionTree: {type: Object, default: () => {}},
            // 层级
            pLevel: {type: String, default: "level1"},
            disabled: {default: false, type: Boolean},
        },

        computed: {
            errorMsg() {
                let filter = this.pStatisticsCode.varHandleList.filter(item => {
                    if (item.optType === optTypeEnums.fun.code) {
                        return isContainEmpty([item.func, item.optValNameList, item.varType, item.varName])
                    } else {
                        return isContainEmpty([item.jsonPath, item.optValNameList, item.varType, item.varName])
                    }
                });

                if (isNotEmpty(filter)) {
                    return `${isEmpty(filter[0].varName) ? "" : filter[0].varName}未填完全`;
                }
                return "";
            }
        },

        data() {
            return {
                multipleSelection: [],
                funDialog: {isShow: false, title: "函数选择"},
                patternEnums: patternEnums,
            }
        },

        methods: {
            // 选择函数之前（弹框出需要选择的函数）
            funSelBefore(row) {
                let that = this;
                that.funDialog.isShow = true;
                that.currentVarHandle = row;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.funcTable)) {
                        that.$refs.funcTable.refreshPage();
                    }
                });
            },

            // 函数选择之后
            // 对象引用未发生变化，仅对象中属性发生变化，由子组件修改即可
            funSelClick(func) {
                let that = this;
                that.pStatisticsCode.varHandleList.forEach(item => {
                    if (item.uuid === that.currentVarHandle.uuid) {
                        item.func = func;
                    }
                });
                that.funDialog.isShow = false;
            },

            // 删除函数
            // 对象引用未发生变化，仅对象中属性发生变化，由子组件修改即可
            deleteSelFunc(row) {
                row.func = {}
            },

            // 多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val);
            },

            // 删除
            deleteStatistics() {
                let uuidList = this.multipleSelection.map(item => item.uuid);
                this.pStatisticsCode.varHandleList = this.pStatisticsCode.varHandleList.filter(item => !uuidList.includes(item.uuid));
            },

            // 添加
            addStatistics() {
                // 又忘记了这个写法，得记录下。当vue的双相绑定失效时，需要看下对象是否被vue对象进行代理，会生成get，set方法，如果没有，可手动添加
                if (this.pStatisticsCode.varHandleList === undefined) this.$set(this.pStatisticsCode, "varHandleList", []);
                this.pStatisticsCode.varHandleList.push(new VarHandle({varFrom : "s_", optType: optTypeEnums.fun.code}))
            }
        }
    }
</script>

<style scoped>

</style>
