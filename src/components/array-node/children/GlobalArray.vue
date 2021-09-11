<template>
    <div id="globalArrTable">
        <el-table :data="pGlobalArrOperateList"
                  tooltip-effect="dark"
                  stripe
                  border
                  max-height="600px"
                  row-key="cdId"
                  size="mini"
                  style="width: 100%">
            <el-table-column
                    label="序号"
                    type="index"
                    width="55">
            </el-table-column>
            <el-table-column prop="mapGolbalArrField" label="全局数组变量">
                <template slot-scope="props">
                    <el-select :disabled="disabled" v-model="props.row.mapGolbalArrField" placeholder="请添加全局数组"
                               clearable
                               filterable
                               :title="props.row.mapGolbalArrField"
                               style="width: 90%"
                               size="mini">
                        <el-option v-for="item in pArrRelVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>
<!--                    <el-icon v-if="!disabled" class="el-icon-edit" style="margin-left: 5px" @click.native="iconClick(props['row'])"></el-icon>-->
                </template>
            </el-table-column>
            <el-table-column prop="mapGolbalArrElementField" label="待添加元素变量">
                <template slot-scope="props">
                    <el-select :disabled="disabled" v-model="props.row.mapGolbalArrElementField" placeholder="请添加全局数组"
                               clearable
                               filterable
                               :title="props.row.mapGolbalArrElementField"
                               style="width: 90%"
                               size="mini">
                        <el-option v-for="item in pExcludeArrVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>
<!--                    <el-icon v-if="!disabled" class="el-icon-edit" style="margin-left: 5px" @click.native="iconClick(props['row'])"></el-icon>-->
                </template>
            </el-table-column>

            <el-table-column label="操作" width="60px">
                <template slot-scope="props">
                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-delete" type="danger" @click="delectGlobalArrMap(props.row)" title="删除">
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import {GlobalArrOperate} from "../../../entity/operate";

    export default {
        name: "GlobalArray",

        props: {
            pExcludeArrVarList: {type : Array, default :()=> []},
            pGlobalArrOperateList: {type: Array, default: () => []},
            pArrRelVarList: {type: Array, default: () => []},
            disabled: {default: false, type: Boolean},
        },


        methods: {

            // 新增
            addGlobalArrMap() {
                let that = this;
                that.pGlobalArrOperateList.push(new GlobalArrOperate({
                    mapGolbalArrField: "",
                    mapGolbalArrElementField: "",
                }));
            },

            // 删除
            delectGlobalArrMap(row) {
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    let index = this.pGlobalArrOperateList.findIndex(item => item.uuid === row.uuid);
                    this.pGlobalArrOperateList.splice(index, 1);
                }).catch(() => {});
            }


        },
    }
</script>

<style scoped>

</style>
