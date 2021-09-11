<template>
    <div>
        <el-form size="mini" label-width="90px" ref="from1" :model="pRowVar" :inline="inline" :rules="rulesRow">
            <!--行变量-->
            <el-form-item prop="rowVarName" label="行变量">
                <div style="display: flex;">
                    <el-select :disabled="disabled" v-model="pRowVar.varName" placeholder="选择行变量输入"
                               clearable
                               filterable
                               style="width: 260px"
                               size="mini">
                        <el-option v-for="item in relInputVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()"
                                  class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>

                    <el-button v-if="isNotEmpty(pRowVar.varName)" style="margin-left: 10px" type="primary"
                               class="icon-button" size="mini" icon="el-icon-edit"
                               @click="conditionEditRow"></el-button>
                </div>

            </el-form-item>
        </el-form>

        <!--纵变量-->
        <el-form size="mini" label-width="90px" ref="from2" :model="pColVar" :inline="inline" :rules="rulesCol">
            <el-form-item prop="colVarName" label="纵变量">
                <div style="display: flex;">
                    <el-select :disabled="disabled" v-model="pColVar.varName" placeholder="选择行变量输入"
                               clearable
                               filterable
                               style="width: 260px"
                               size="mini">
                        <el-option v-for="item in relInputVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()"
                                  class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>

                    <el-button v-if="isNotEmpty(pColVar.varName)" style="margin-left: 10px" type="primary" class="icon-button" size="mini"
                               icon="el-icon-edit" @click="conditionEditCol"></el-button>
                </div>
            </el-form-item>
        </el-form>


        <!--弹窗-展示条件列表-->
        <el-dialog :visible.sync="edit.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">判断条件</div>
                </div>
            </div>

            <v-unit-condition :p-cd-list="computeCdList"
                              :p-cd-rel-var-list="relInputVarList"
                              :p-left-lock-cd-rel-var-list="computeLeftVarList"
                              :is-show-add-need="true"
                              :disabled="disabled"
                              :is-lock-left="isLockLeft"
                              ref="vUnitCondition"
                              @addOrEditClick="cdAddOrEditClick"
                              @deleteClick="cdDeleteClick"></v-unit-condition>


            <template slot="footer">
                <el-button type="" size="mini" @click="edit.dialog = false">取消</el-button>
            </template>
        </el-dialog>

    </div>


</template>

<script>
    import VUnitCondition from "../../rule-node/children/VUnitCondition";

    export default {
        name: "DecsTableConf",
        components: {VUnitCondition},

        props: {
            pRowVar: {
                default: () => {
                }, type: Object
            },
            pColVar: {
                default: () => {
                }, type: Object
            },
            pRowCdList: {default: () => [], type: Array},
            pColCdList: {default: () => [], type: Array},
            pCellMap: {
                default: () => {
                }, type: Object
            },

            // 上游传入的变量 作为
            relInputVarList: {default: () => [], type: Array},


            inline: {type: Boolean, default: true, required: false},
            disabled: {type: Boolean, default: false, required: false},
            isLockLeft: {type: Boolean, default: true, required: false},
        },

        data() {

            return {

                curVarFlag: '1',      // 为了复用行纵变量的操作页面，用于记录的flag
                enumsFlags: {row: '1', col: '2'},

                edit: {dialog: false, type: ''},

                rulesRow: {},

                rulesCol: {}
            }
        },

        methods: {

            // 点击行纵变量的编辑
            conditionEditRow() {
                let that = this;
                that.curVarFlag = that.enumsFlags.row;
                this.edit.dialog = true;


            },


            conditionEditCol() {
                let that = this;
                that.curVarFlag = that.enumsFlags.col;
                this.edit.dialog = true;


            },


            // 判断条件弹窗的确认按键（将编辑和新增写在一起）
            cdAddOrEditClick(condition) {
                let that = this;
                if (that.curVarFlag === that.enumsFlags.row) {
                    let isAdd = that.pRowCdList.filter(item => item.cdId === condition.cdId).length === 0;
                    if (isAdd) {
                        that.pRowCdList.push(condition);
                    } else {
                        that.pRowCdList.forEach(item => {
                            if (item.cdId === condition.cdId) {
                                Object.assign(item, condition)
                            }
                        })
                    }
                } else {
                    let isAdd = that.pColCdList.filter(item => item.cdId === condition.cdId).length === 0;
                    if (isAdd) {
                        that.pColCdList.push(condition);
                    } else {
                        that.pColCdList.forEach(item => {
                            if (item.cdId === condition.cdId) {
                                Object.assign(item, condition)
                            }
                        })
                    }
                }
            },


            // 删除判断条件
            cdDeleteClick(row) {
                let that = this;
                if (that.curVarFlag === that.enumsFlags.row) {
                    that.pRowCdList.splice(that.pRowCdList.findIndex(cd => cd.cdId === row.cdId), 1);

                } else {
                    that.pColCdList.splice(that.pColCdList.findIndex(cd => cd.cdId === row.cdId), 1);
                }
            },

        },


        computed: {

            // 送显行还是纵的判定条件
            computeCdList() {
                let that = this;
                if (that.curVarFlag === that.enumsFlags.row) {
                    return that.pRowCdList;
                } else {
                    return that.pColCdList;
                }
            },

            // computeDiaglogVarList() {
            //     let that = this;
            //     let result = [];
            //     if (that.curVarFlag === that.enumsFlags.row) {
            //         result = that.relInputVarList.filter(item => item.getPrefixVarName() === that.pRowVar.getPrefixVarName());
            //     } else {
            //         result = that.relInputVarList.filter(item => item.getPrefixVarName() === that.pColVar.getPrefixVarName());
            //     }
            //     return result;
            // },

            computeLeftVarList() {
                let that = this;
                let result = [];
                if (that.curVarFlag === that.enumsFlags.row) {
                    result = that.relInputVarList.filter(item => item.getPrefixVarName() === that.pRowVar.varName);
                } else {
                    result = that.relInputVarList.filter(item => item.getPrefixVarName() === that.pColVar.varName);
                }
                return result;
            }

        },


    }
</script>

<style scoped>

</style>
