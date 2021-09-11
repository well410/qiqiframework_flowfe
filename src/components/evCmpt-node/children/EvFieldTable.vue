<template>
    <div>
        <pl-table
                ref="multipleTable"
                :data="pFieldList"
                :max-height="400"
                size="mini"
                :border="true"
                :highlight-current-row="true"
                :stripe="true"
                :use-virtual="true"
                :row-height="40"
                :excess-rows="3"
                :height-change="false"
                auto-resize>
            <pl-table-column prop="id" label="序号" width="50px"></pl-table-column>
            <pl-table-column prop="fieldName" label="入库字段名"></pl-table-column>
            <pl-table-column label="入库字段类型" prop="fieldType" width="150px"></pl-table-column>
            <pl-table-column prop="fieldDesc" label="入库字段描述"></pl-table-column>
            <pl-table-column label="字段映射">
                <template slot-scope="props">
                    <template v-if="props['row'].fieldFrom === varFromEnums.edit.code" class="flex-between-center">
                        {{props.row.fieldResult}}
                    </template>

                    <template v-else>
                        {{props.row.mapField}}
                    </template>
                </template>
            </pl-table-column>
            <pl-table-column label="操作" width="60px">
                <template slot-scope="props">
                    <el-button :disabled="disabled" class="icon-button" icon="el-icon-edit" type="primary" size="mini" @click="editClickBefore(props.row)" title="编辑"></el-button>
                </template>
            </pl-table-column>
        </pl-table>

        <el-dialog
                title="字段映射"
                width="800px"
                :modal="false"
                :close-on-click-modal="false"
                :visible.sync="editDialog.isShow">
            <el-form size="mini" label-width="80px">
                <el-form-item label="字段路径">{{editDialog.mapFields.fieldName}}</el-form-item>
                <el-form-item label="字段类型">{{editDialog.mapFields.fieldType}}</el-form-item>
                <el-form-item label="字段描述">{{editDialog.mapFields.fieldDesc}}</el-form-item>
                <el-form-item label="映射类型">
                        <el-select v-model="editDialog.mapFields.fieldFrom" placeholder="映射类型"
                                   filterable
                                   style="width: 80%"
                                   size="mini">
                            <el-option :key="varFromEnums.edit.code" :value="varFromEnums.edit.code" :label="varFromEnums.edit.name"></el-option>
                            <el-option :key="varFromEnums.rel.code" :value="varFromEnums.rel.code" :label="varFromEnums.rel.name"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="输入" v-if="editDialog.mapFields.fieldFrom === varFromEnums.edit.code">
                    <template class="flex-between-center">
                        <el-input :title="editDialog.mapFields.fieldResult" size="mini" style="width: 80%"
                                  v-model="editDialog.mapFields.fieldResult"></el-input>
                    </template>
                </el-form-item>
                <el-form-item label="引用变量" v-else>
                    <template>
                        <el-select v-model="editDialog.mapFields.mapField" placeholder="请配置映射参数"
                                   clearable
                                   filterable
                                   style="width: 80%"
                                   :title="editDialog.mapFields.mapField"
                                   size="mini">
                            <el-option v-for="item in pRefFieldList"
                                       :key="item.getPrefixVarName()"
                                       :label="item.getDescVarName()"
                                       :value="item.getPrefixVarName()">
                                <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>
            </el-form>

            <template slot="footer" class="dialog-footer">
                <el-button @click="editDialog.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="editClickAfter" size="mini">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {varFromEnums} from "../../../entity/enumns";
    import {MapFields} from "../../cmpt-node";

    export default {
        name: "EvFieldTable",
        props: {
            pFieldList: {default: () => [], type: Array},
            pRefFieldList: {default: () => [], type: Array},
            disabled: {default: false, type: Boolean},
        },
        data() {
            return {
                varFromEnums: varFromEnums,
                editDialog: {isShow: false, mapFields: new MapFields()}
            }
        },
        methods: {
            //
            editClickBefore(row) {
                Object.assign(this.editDialog.mapFields, row);
                this.editDialog.isShow = true;
            },

            // 修改规则之后
            editClickAfter(){
                this.pFieldList.forEach(item => {
                    if (item.fieldName === this.editDialog.mapFields.fieldName) {
                        Object.assign(item, this.editDialog.mapFields);
                    }
                });
                this.editDialog.isShow = false;
            },

            // 转换
            iconClick(row) {
                if (row.fieldFrom === this.varFromEnums.edit.code) {
                    row.fieldFrom = this.varFromEnums.rel.code
                } else {
                    row.fieldFrom = this.varFromEnums.edit.code
                }
                console.log(row)
            },
        }
    }
</script>

<style scoped>

</style>
