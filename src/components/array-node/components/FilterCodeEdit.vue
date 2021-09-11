<template>
    <div>
        <span>{{logicMsg}}</span>
        <el-button type="primary" size="mini" style="margin-left: 10px" :disabled="disabled" @click="editConditionBefore">编辑</el-button>

        <el-dialog :visible.sync="dialog.isShow"
                   :modal="false"
                   title="过滤条件编辑"
                   :append-to-body="true"
                   :close-on-click-modal="false">
            <el-button type="success" size="mini" :disabled="disabled" @click="addConditionHandle">添加</el-button>
            <el-button type="danger" size="mini" :disabled="disabled" @click="deleteConditionHandle">删除</el-button>

            <el-table
                    id="conditionTable"
                    :data="filterCode.cdList"
                    tooltip-effect="dark"
                    stripe
                    border
                    max-height="266px"
                    size="mini"
                    @selection-change="handleSelectionChange"
                    style="width: 100%;margin-top: 10px;margin-bottom: 10px">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column prop="cdId" label="条件序号" width="80px" class-name="canDrop"></el-table-column>
                <el-table-column label="条件逻辑">
                    <template slot-scope="scope">
                        <el-row type="flex">
                            <!--左边变量-->
                            <div style="padding-left: 10px">
                                <template v-if="varFromEnums.edit.code === scope['row'].leftVarFrom">
                                    <el-input size="mini" v-model="scope['row'].leftVarValue" :disabled="disabled" style="width: 196px"></el-input>
                                </template>
                                <template v-else-if="varFromEnums.varPlatform.code === scope['row'].leftVarFrom">
                                    <span>{{scope['row'].leftVarObj.varsId}}</span>
                                </template>
                                <template v-else>
                                    <el-select
                                               size="mini"
                                               filterable
                                               :disabled="disabled"
                                               v-model="scope['row'].leftVarName"
                                               @change="varNameChange($event, scope['row'], 'left')" placeholder="请选择">
                                        <el-option v-for="leftVar in pRelVarList"
                                                   :key="leftVar.uuid"
                                                   :label="leftVar.getDescVarName()"
                                                   :value="leftVar.getPrefixVarName()">
                                            <span :title="leftVar.getPrefixVarName()" class="option-left">{{leftVar.getPrefixVarName()}}</span>
                                            <span :title="leftVar.getSimpleDesc()" class="option-right">{{leftVar.getSimpleDesc()}}</span>
                                        </el-option>
                                    </el-select>
                                </template>
                                <el-icon class="el-icon-edit vuc-icon" title="输入" @click.native="scope['row'].leftVarFrom = varFromEnums.edit.code"></el-icon>
                                <el-icon class="el-icon-link vuc-icon" title="引用临时或事件变量" @click.native="scope['row'].leftVarFrom = varFromEnums.rel.code"></el-icon>
                            </div>
                            <!--操作符-->
                            <div style="padding-left: 10px">
                                <el-select size="mini"
                                           :disabled="disabled"
                                           @change="varTypeChange(scope['row'])"
                                           style="width: 100px"
                                           v-model="scope['row'].cdVarType">
                                    <el-option label="String" value="String" key="String"></el-option>
                                    <el-option label="Integer" value="Integer" key="Integer"></el-option>
                                    <el-option label="Double" value="Double" key="Double"></el-option>
                                    <el-option label="Timestamp" value="Timestamp" key="Timestamp"></el-option>
                                </el-select>
                            </div>
                            <!--操作函数-->
                            <div style="padding-left: 10px">
                                <el-select
                                           size="mini"
                                           style="width: 100px"
                                           v-model="scope['row'].cdOpt" placeholder="请选择">
                                    <el-option v-for="type in computeOptList(scope['row'].getVarType())"
                                               :key="type.value"
                                               :label="type.label" :value="type.value"></el-option>
                                </el-select>
                            </div>
                            <!--右边变量-->
                            <div style="padding-left: 10px">
                                <template v-if="varFromEnums.edit.code === scope['row'].rightVarFrom">
                                    <el-input v-model="scope['row'].rightVarValue" :disabled="disabled" style="width: 196px" size="mini"></el-input>
                                </template>
                                <template v-else-if="varFromEnums.varPlatform.code === scope['row'].rightVarFrom">
                                    <span>{{scope['row'].rightVarObj.varsId}}</span>
                                </template>
                                <template v-else>
                                    <el-select
                                               size="mini"
                                               filterable
                                               :disabled="disabled"
                                               v-model="scope['row'].rightVarName"
                                               @change="varNameChange($event, scope['row'], 'right')" placeholder="请选择">
                                        <el-option v-for="rightVar in pRelVarList"
                                                   :key="rightVar.uuid"
                                                   :label="rightVar.getDescVarName()"
                                                   :value="rightVar.getPrefixVarName()">
                                            <span :title="rightVar.getPrefixVarName()" class="option-left">{{rightVar.getPrefixVarName()}}</span>
                                            <span :title="rightVar.getSimpleDesc()" class="option-right">{{rightVar.getSimpleDesc()}}</span>
                                        </el-option>
                                    </el-select>
                                </template>
                                <el-icon  class="el-icon-edit vuc-icon" title="输入"
                                         @click.native="scope['row'].rightVarFrom = varFromEnums.edit.code"></el-icon>
                                <el-icon  class="el-icon-link vuc-icon" title="引用临时或事件变量"
                                         @click.native="scope['row'].rightVarFrom = varFromEnums.rel.code"></el-icon>
                            </div>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <el-input placeholder="请输入过滤条件: 001 && (002 || 003)"
                      :disabled="disabled"
                      @input="filterCode.logic = patternEnums.UResultLogic.uResultLogicFilter(filterCode.logic)"
                      v-model="filterCode.logic" size="mini">
                <template slot="prepend">过滤条件</template>
            </el-input>
            <template slot="footer" class="dialog-footer">
                <el-button @click="dialog.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="editConditionAfter"  size="mini">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {Condition} from "../../rule-node";
    import {ls} from "../../index";
    import {DataTypeEnumsClass, patternEnums, varFromEnums} from "../../../entity/enumns";
    import {isNotEmpty} from "../../../utils";
    import {FilterCode} from "../index";

    export default {
        name: "FilterCodeEdit",
        props: {
            // 本组件操作的对象
            pFilterCode: {type: Object, default: () => {}},
            // 引用的变量
            pRelVarList: {type: Array, default: () => []},
            // 层级
            pLevel: {type: String, default: "level1"},
            disabled: {default: false, type: Boolean},
        },

        data() {
            return {
                dialog: {isShow: false},
                multipleSelection: [],
                patternEnums: patternEnums,
                varFromEnums: varFromEnums,
                filterCode: new FilterCode()
            }
        },
        computed: {
            computeOptList(){
                return (key)=>{
                    return DataTypeEnumsClass.getOptListByKey(key)
                }
            },

            logicMsg() {
                return `if(${this.pFilterCode.logic}): {`;
            }
        },
        methods: {
            // 左边变量名改变时联动改变变量类型，同时操作符制空
            varNameChange(varName, row, type) {
                let that = this;
                if (isNotEmpty(varName)) {
                    let varType = that.pRelVarList.filter(item => item.getPrefixVarName() === varName)[0].varType;
                    let varDecs = that.pRelVarList.filter(item => item.getPrefixVarName() === varName)[0].getDescVarName();
                    if (isNotEmpty(varType)){
                        row[`${type}VarType`] = varType;
                        row.cdVarType = varType;
                        that.varTypeChange(row)
                    }
                    if (isNotEmpty(varDecs)) row[`${type}VarDecs`] =varDecs;
                }
            },

            // 左边变量类型发生变化时，操作符制空
            varTypeChange(condition) {
                condition.cdOpt = '';
            },

            // 多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            deleteConditionHandle() {
                let cdIdList = this.multipleSelection.map(item => item.cdId);
                this.filterCode.cdList = this.filterCode.cdList.filter(item => !cdIdList.includes(item.cdId));
            },


            /**
             * 判断条件保存
             */
            editConditionAfter(){
                Object.assign(this.pFilterCode, this.filterCode);
                this.dialog.isShow = false;
            },

            // 判断条件编辑 editConditionHandle
            editConditionBefore(){
                Object.assign(this.filterCode, this.pFilterCode);
                this.filterCode.cdList = this.filterCode.cdList.map(item=> {
                    if (typeof item === 'object'){
                        return new Condition(item);
                    } else {
                        return item;
                    }
                });
                this.dialog.isShow = true;
            },

            // 添加判断条件
            addConditionHandle() {
                let that = this;
                let cdNum = 999;
                let cdIdList = ls(cdNum);

                // 新增没有出现的id
                let inCdListId = this.filterCode.cdList.map(cd => cd.cdId);
                let noInCdListId = cdIdList.filter(cdId => inCdListId.indexOf(cdId) === -1);
                if (noInCdListId.length === 0) {
                    that.$message({message: `目前仅支持${cdNum}个条件`, type: 'warning'});
                } else {
                    this.filterCode.cdList.push(new Condition({
                            cdId: noInCdListId[0],
                            leftVarFrom: varFromEnums.rel.code,
                            rightVarFrom: varFromEnums.edit.code,
                        }));
                    this.filterCode.cdList.sort((a, b)=>{
                        return parseInt(a.cdId) - parseInt(b.cdId)
                    });
                }

            },
        },

    }
</script>

<style scoped>

</style>
