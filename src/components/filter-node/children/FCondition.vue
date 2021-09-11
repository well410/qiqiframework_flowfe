<template>
    <!--数组过滤的条件-->
    <div>

        <rule-comm-cd-table :p-cd-list="pFilterVar.funBodyCdList" :is-need-add="true" :disabled="disabled" @onAddClick="addBefore">
            <el-table-column align="center" label="操作" width="80x">
                <template slot-scope="scope">
                    <el-button type="primary" class="icon-button" icon="el-icon-edit" size="mini" @click="editBefore(scope['row'])" :disabled="disabled" title="编辑"></el-button>
                    <el-button type="danger" class="icon-button" icon="el-icon-delete" size="mini" @click="deleteClick(scope['row'])" :disabled="disabled" title="删除"></el-button>
                </template>
            </el-table-column>
        </rule-comm-cd-table>

        <el-dialog :visible.sync="addOrEdit.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   title="判断条件设置"
                   :append-to-body="true">
            <div style="margin-left: 32px;margin-bottom: 15px;">{{`注：当选择${varFromEnums.jPath.name}时，解析的是数组遍历的对象`}}</div>
            <el-form size="mini" label-width="80px" style="padding: 0 20px">
                <el-form-item label="条件序号">
                    <el-input disabled v-model="addOrEdit.condition.cdId"></el-input>
                </el-form-item>

                <el-form-item label="条件逻辑">
                    <el-row type="flex">
                        <!--左边变量-->
                        <div>
                            <el-row :gutter="2">
                                <el-col :span="15">
                                    <template v-if="varFromEnums.edit.code === addOrEdit.condition.leftVarFrom">
                                        <el-input v-model="addOrEdit.condition.leftVarValue" :placeholder="messageEnums.CD_EDIT_PLACEHOLDER.name"></el-input>
                                    </template>
                                    <template v-else-if="varFromEnums.jPath.code === addOrEdit.condition.leftVarFrom">
                                        <el-input v-model="addOrEdit.condition.leftJPath" :placeholder="messageEnums.CD_J_PATH_PLACEHOLDER.name"></el-input>
                                    </template>
                                    <template v-else>
                                        <el-select size="mini"
                                                   filterable
                                                   v-model="addOrEdit.condition.leftVarName"
                                                   :placeholder="messageEnums.CD_REL_PLACEHOLDER.name">
                                            <el-option v-for="leftVar in pCdRelVarList"
                                                       :key="leftVar.getPrefixVarName()"
                                                       :label="leftVar.getDescVarName()"
                                                       :value="leftVar.getPrefixVarName()">
                                                <span :title="leftVar.getPrefixVarName()" class="option-left">{{leftVar.getPrefixVarName()}}</span>
                                                <span :title="leftVar.getSimpleDesc()" class="option-right">{{leftVar.getSimpleDesc()}}</span>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-col>
                                <el-col :span="8">
                                    <el-select size="mini" filterable v-model="addOrEdit.condition.leftVarFrom">
                                        <el-option :label="varFromEnums.edit.name" :value="varFromEnums.edit.code" :key="varFromEnums.edit.code"></el-option>
                                        <el-option :label="varFromEnums.rel.name" :value="varFromEnums.rel.code" :key="varFromEnums.rel.code"></el-option>
                                        <el-option :label="varFromEnums.jPath.name" :value="varFromEnums.jPath.code" :key="varFromEnums.jPath.code"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </div>
                        <!--操作符-->
                        <div>
                            <el-select size="mini"
                                       style="width: 100px"
                                       v-model="addOrEdit.condition.cdVarType">
                                <el-option :label="dataTypeEnums.STRING.code" :value="dataTypeEnums.STRING.code" :key="dataTypeEnums.STRING.code"></el-option>
                                <el-option :label="dataTypeEnums.INTEGER.code" :value="dataTypeEnums.INTEGER.code" :key="dataTypeEnums.INTEGER.code"></el-option>
                                <el-option :label="dataTypeEnums.DOUBLE.code" :value="dataTypeEnums.DOUBLE.code" :key="dataTypeEnums.DOUBLE.code"></el-option>
                                <el-option :label="dataTypeEnums.TIMESTAMP.code" :value="dataTypeEnums.TIMESTAMP.code" :key="dataTypeEnums.TIMESTAMP.code"></el-option>
                                <el-option :label="dataTypeEnums.ARRAY.code" :value="dataTypeEnums.ARRAY.code" :key="dataTypeEnums.ARRAY.code"></el-option>
                                <el-option :label="dataTypeEnums.OBJECT.code" :value="dataTypeEnums.OBJECT.code" :key="dataTypeEnums.OBJECT.code"></el-option>
                                <el-option :label="dataTypeEnums.BOOLEAN.code" :value="dataTypeEnums.BOOLEAN.code" :key="dataTypeEnums.BOOLEAN.code"></el-option>
                            </el-select>
                        </div>

                        <!--操作函数-->
                        <div>
                            <el-select
                                    size="mini"
                                    style="width: 100px"
                                    v-model="addOrEdit.condition.cdOpt" placeholder="请选择">
                                <el-option v-for="opt in computeOptList" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                            </el-select>
                        </div>

                        <!--右边变量-->
                        <div v-if="computeSingleOpt">
                            <el-row :gutter="2">
                                <el-col :span="15">
                                    <template v-if="varFromEnums.edit.code === addOrEdit.condition.rightVarFrom">
                                        <el-input v-model="addOrEdit.condition.rightVarValue" :placeholder="messageEnums.CD_EDIT_PLACEHOLDER.name"></el-input>
                                    </template>
                                    <template v-else-if="varFromEnums.jPath.code === addOrEdit.condition.rightVarFrom">
                                        <el-input v-model="addOrEdit.condition.rightJPath" :placeholder="messageEnums.CD_J_PATH_PLACEHOLDER.name"></el-input>
                                    </template>
                                    <template v-else>
                                        <el-select
                                                size="mini"
                                                filterable
                                                v-model="addOrEdit.condition.rightVarName"
                                                :placeholder="messageEnums.CD_REL_PLACEHOLDER.name">
                                            <el-option v-for="rightVar in pCdRelVarList"
                                                       :key="rightVar.getPrefixVarName()"
                                                       :label="rightVar.getDescVarName()"
                                                       :value="rightVar.getPrefixVarName()">
                                                <span :title="rightVar.getPrefixVarName()" class="option-left">{{rightVar.getPrefixVarName()}}</span>
                                                <span :title="rightVar.getSimpleDesc()" class="option-right">{{rightVar.getSimpleDesc()}}</span>
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-col>
                                <el-col :span="8">
                                    <el-select size="mini" filterable v-model="addOrEdit.condition.rightVarFrom">
                                        <el-option :label="varFromEnums.edit.name" :value="varFromEnums.edit.code" :key="varFromEnums.edit.code"></el-option>
                                        <el-option :label="varFromEnums.rel.name" :value="varFromEnums.rel.code" :key="varFromEnums.rel.code"></el-option>
                                        <el-option :label="varFromEnums.jPath.name" :value="varFromEnums.jPath.code" :key="varFromEnums.jPath.code"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </div>
                    </el-row>
                </el-form-item>

                <el-form-item label="条件描述">
                    <el-input v-model="addOrEdit.condition.cdDesc"></el-input>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="addOrEditAfter">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import RuleCommCdTable from "../../rule-node/common/RuleCommCdTable";
    import {Condition} from "../../rule-node";
    import {dataTypeEnums, DataTypeEnumsClass, messageEnums, varFromEnums} from "../../../entity/enumns";
    import {ls} from "../../index";

    export default {
        name: "FCondition",
        components: {RuleCommCdTable},
        props: {
            decisionTree: Object,
            pFilterVar: Object,
            disabled: {default: false, type: Boolean},
            // 引用的变量（临时变量和事件变量）
            pCdRelVarList: {default: () => [], type: Array},
        },
        data() {
            return {
                addOrEdit: {dialog: false, condition: new Condition()},
                varFromEnums: varFromEnums,
                dataTypeEnums: dataTypeEnums,
                messageEnums : messageEnums
            }
        },
        computed: {
            /**
             * 计算是否是单值操作
             */
            computeSingleOpt() {
                return ![dataTypeEnums.OBJECT.code, dataTypeEnums.BOOLEAN.code].includes(this.addOrEdit.condition.cdVarType);
            },

            computeOptList() {
                return DataTypeEnumsClass.getOptListByKey(this.addOrEdit.condition.getVarType())
            },
        },
        methods: {

            addBefore() {
                let that = this;
                let cdNum = 999;
                let cdIdList = ls(cdNum);

                // 新增没有出现的id
                let inCdListId = that.pFilterVar.funBodyCdList.map(cd => cd.cdId);
                let noInCdListId = cdIdList.filter(cdId => inCdListId.indexOf(cdId) === -1);
                if (noInCdListId.length === 0) {
                    that.$message({message: `目前仅支持${cdNum}个条件`, type: 'warning'});
                } else {
                    that.addOrEdit = {
                        dialog: true,
                        condition: new Condition({
                            cdId: noInCdListId[0],
                            leftVarFrom: varFromEnums.rel.code,
                            rightVarFrom: varFromEnums.edit.code,
                        }),
                        type: 'add'
                    };
                }

            },

            addOrEditAfter() {
                let that = this;
                that.addOrEdit.dialog = false;
                let isAdd = that.pFilterVar.funBodyCdList.filter(item=>item.cdId === that.addOrEdit.condition.cdId).length === 0;
                if (isAdd){
                    that.pFilterVar.funBodyCdList.push(that.addOrEdit.condition);
                } else {
                    that.pFilterVar.funBodyCdList.forEach(item=>{
                        if (item.cdId === that.addOrEdit.condition.cdId){
                            Object.assign(item, that.addOrEdit.condition)
                        }
                    })
                }
            },

            editBefore(row) {
                this.addOrEdit.dialog = true;
                this.addOrEdit.condition = new Condition(JSON.parse(JSON.stringify(row)));
            },



            deleteClick(row) {
                let that = this;
                that.$confirm('确定要删除该条件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    that.pFilterVar.funBodyCdList = that.pFilterVar.funBodyCdList.filter(cd => cd.cdId !== row.cdId);
                }).catch(() => {});
            },

        }
    }
</script>

<style scoped>

</style>
