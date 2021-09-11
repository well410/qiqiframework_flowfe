<template>
    <div>

        <!--判断条件-->
        <el-dialog :visible.sync="addOrEdit.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">元规则结果</div>
                </div>
            </div>

            <div class="common-title">元规则结果配置</div>
            <el-form size="mini" label-width="80px">
                <el-form-item label="逻辑序号">{{addOrEdit.unitResult.logicId}}</el-form-item>
                <el-form-item label="条件组合">
                    <el-input :disabled="disabled" v-if="addOrEdit.unitResult.logicId !== 999" size="mini"
                              :placeholder="patternEnums.UResultLogic.decs"
                              @input="addOrEdit.unitResult.logic = patternEnums.UResultLogic.uResultLogicFilter(addOrEdit.unitResult.logic)"
                              v-model.trim="addOrEdit.unitResult.logic"></el-input>
                    <el-input v-if="addOrEdit.unitResult.logicId === 999" disabled size="mini" v-model="addOrEdit.unitResult.logic"></el-input>
                </el-form-item>
                <el-form-item label="结果类型">
                    <el-select v-model="addOrEdit.unitResult.varFrom" size="mini" clearable>
                        <el-option :label="varFromEnums.edit.name" :value="varFromEnums.edit.code"></el-option>
                        <el-option :label="varFromEnums.aviatorScript.name" :value="varFromEnums.aviatorScript.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="输入结果">
                    <el-input :disabled="disabled" size="mini" v-model="addOrEdit.unitResult.resultValue"></el-input>
                </el-form-item>
                <el-form-item label="结果描述">
                    <el-input :disabled="disabled" size="mini" v-model="addOrEdit.unitResult.resultDesc"></el-input>
                </el-form-item>
            </el-form>
            <div class="common-title">条件搜索</div>
            <rule-comm-cd-table :p-cd-list="pCdList"></rule-comm-cd-table>



            <template slot="footer">
                <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                <el-button type="primary" v-if="addOrEdit.type === 'edit'"  size="mini" @click="editAfter">保存</el-button>
                <el-button type="primary" v-if="addOrEdit.type === 'add'"  size="mini" @click="addAfter">添加</el-button>
            </template>
        </el-dialog>

        <!--元规则结果-->
        <el-table
                id="uResultTable"
                :data="pUResultList"
                tooltip-effect="dark"
                stripe
                border
                max-height="266px"
                size="mini"
                row-key="logicId"
                style="width: 100%">
            <el-table-column prop="logicId" align="center" label="逻辑序号" width="80px" class-name="canDrop"></el-table-column>
            <el-table-column align="center" label="条件组合" prop="logic"></el-table-column>
            <el-table-column   align="center" label="结果类型">
                <template slot-scope="scope">
                    {{scope['row'].varFrom === varFromEnums.edit.code ? varFromEnums.edit.name : varFromEnums.aviatorScript.name}}
                </template>
            </el-table-column>
            <el-table-column  align="center" label="输入结果" prop="resultValue"></el-table-column>
            <el-table-column  align="center" label="结果描述" prop="resultDesc"></el-table-column>
            <el-table-column  align="left" label="操作" width="80px" >
                <template slot-scope="scope">
                    <el-button :disabled="disabled" class="icon-button" icon="el-icon-edit" type="primary" size="mini" title="编辑" @click="editBefore(scope['row'])"></el-button>
                    <el-button :disabled="disabled" v-if="scope['row'].logicId !== 999" type="danger" icon="el-icon-delete" class="icon-button" size="mini" @click="deleteClick(scope['row'])" title="删除"></el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>

</template>

<script>
    import {dataTypeEnums, messageEnums, patternEnums, varFromEnums} from "../../../entity/enumns";
    import {ls} from "../../index";
    import RuleCommCdTable from "../common/RuleCommCdTable";
    import CommVarInf from "../../common/CommVarInf";
    import {UnitResult} from "../../../entity/vars";
    import CommVarTableInf from "../../common/CommVarTableInf";
    import isEmpty from "@antv/util/esm/is-empty";

    export default {
        name: "VUnitResult",
        components: {CommVarTableInf, CommVarInf, RuleCommCdTable},
        props: {
            pUResultList: {default: [], type: Array},
            pNode: {type: Object, default: {}},
            disabled: {default: false, type: Boolean},
            // 逻辑操作
            pCdList: {default: [], type: Array},

        },

        data() {
            return {
                messageEnums: messageEnums,
                patternEnums: patternEnums,
                varFromEnums: varFromEnums,
                addOrEdit: {dialog: false, type: 'add', unitResult: new UnitResult()},
            }
        },

        methods:{
            // 删除元规则结果
            deleteClick(row) {
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.$emit("deleteClick", row);
                }).catch(() => {});
            },


            buildUnitResult(){
                let cdNum = 999;
                let urIdList = ls(cdNum);
                // 新增没有出现的id
                let inUResultListId = this.pUResultList.map(ur => ur.logicId);
                let noInUResultListId = urIdList.filter(urId => inUResultListId.indexOf(urId) === -1);
                if (noInUResultListId.length === 0) {
                    this.$message({message: `目前仅支持${cdNum}个元规则结果`, type: 'warning'});
                } else {
                    return new UnitResult({logicId: noInUResultListId[0], logic:'', varType : dataTypeEnums.STRING.code});
                }
            },


            addBefore(){
                this.addOrEdit.dialog = true;
                this.addOrEdit.type = 'add';
                this.addOrEdit.unitResult = this.buildUnitResult();

            },

            addAfter(){
                this.addOrEdit.dialog = false;
                this.pUResultList.splice(this.pUResultList.length-1, 0 , this.addOrEdit.unitResult);
            },


            editBefore(row){
                // 向前兼容，未填的类型都为字符串类型
                if (isEmpty(row.varType)){
                    row.varType = dataTypeEnums.STRING.code;
                }

                this.addOrEdit.dialog = true;
                this.addOrEdit.type = 'edit';
                this.addOrEdit.unitResult = UnitResult.obj2UnitResult(JSON.parse(JSON.stringify(row)));
            },

            editAfter(){
                this.pUResultList.forEach(item => {
                    if (item.uuid === this.addOrEdit.unitResult.uuid) {
                        Object.assign(item, this.addOrEdit.unitResult)
                    }
                });
                this.addOrEdit.dialog = false;
            }
        }
    }
</script>

<style scoped>

</style>
