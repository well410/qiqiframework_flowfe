<template>
    <!--评分卡判断条件-->
    <div>
        <el-table
                id="conditionTable"
                :data="pCdList"
                :span-method="arraySpanMethod"
                tooltip-effect="dark"
                stripe
                border
                max-height="666px"
                row-key="cdId"
                size="mini"
                style="width: 100%">
            <el-table-column align="center" label="变量名" width="180px" prop="cdVarName">
                <template slot-scope="scope">
                    <el-tooltip placement="top" effect="dark">
                        <div slot="content">{{scope['row'].cdVarDecs}}</div>
                        <div>{{scope['row'].getVarName()}}</div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="变量类型" width="80px" prop="cdVarType">
                <template slot-scope="scope">
                    {{scope['row'].getVarType()}}
                </template>
            </el-table-column>
            <el-table-column prop="cdWeight" align="center" label="权重" width="80px"></el-table-column>
            <!--<el-table-column prop="cdId" label="条件序号" width="70px" align="center" class-name="canDrop"></el-table-column>-->
            <el-table-column align="center" label="逻辑组合" class-name="canDrop" >
                <template slot-scope="scope">
                    <el-tooltip placement="top" effect="dark">
                        <div slot="content">{{scope['row'].cdDesc}}</div>
                        <div>{{scope['row'].getSimpleInf()}}</div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="cdScore" align="center" label="分数" width="80px"></el-table-column>
            <el-table-column align="center" label="操作" width="150px">
                <template slot-scope="scope">
                    <el-button :disabled="disabled" type="primary" class="icon-button" icon="el-icon-edit" size="mini" @click="editBefore(scope['row'])" title="编辑">
                    </el-button>
                    <el-button :disabled="disabled" type="danger" class="icon-button" icon="el-icon-delete" size="mini" @click="deleteClick(scope['row'])" title="删除">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--判断条件-->
        <el-dialog :visible.sync="addOrEdit.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   class="node-new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">评分条件设置</div>
                </div>
            </div>
            <el-form size="mini" label-width="80px" style="padding: 0 20px">
                <el-form-item label="条件序号">
                    <el-input disabled v-model="addOrEdit.condition.cdId"></el-input>
                </el-form-item>

                <el-form-item label="变量名称">
                    <el-row type="flex">
                        <!--左边变量-->
                        <div>
                            <el-select :disabled="disabled||isEdit"
                                       size="mini"
                                       filterable
                                       v-model="addOrEdit.condition.cdVarName"
                                       @change="varNameChange($event, addOrEdit.condition)" placeholder="请选择">
                                <el-option v-for="leftVar in pCdRelVarList"
                                           :key="leftVar.getPrefixVarName()"
                                           :label="leftVar.getDescVarName()"
                                           :value="leftVar.getPrefixVarName()">
                                    <span :title="leftVar.getPrefixVarName()" class="option-left">{{leftVar.getPrefixVarName()}}</span>
                                    <span :title="leftVar.getSimpleDesc()" class="option-right">{{leftVar.getSimpleDesc()}}</span>
                                </el-option>
                            </el-select>
                        </div>
                        <!--操作符-->
                        <div class="vuc-margin">
                            <template>
                               <span>变量类型</span>
                            </template>
                        </div>
                        <div class="vuc-margin">
                            <el-select :disabled="disabled||isEdit||!canSelectVarType" size="mini"
                                       @change="varTypeChange(addOrEdit.condition)"
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
                        <!--权重-->
                        <div class="vuc-margin">
                            <template>
                               <span>权重</span>
                            </template>
                        </div>
                        <div class="vuc-margin">
                                <el-input-number v-model="addOrEdit.condition.cdWeight" :step="0.1" size="mini" :min="0" controls-position="right"
                                          class="vuc-input-width"></el-input-number>
                        </div>
                    </el-row>
                </el-form-item>

                <el-form-item label="逻辑组合">
                    <el-row type="flex">
                        <div>
                            <el-select :disabled="disabled" v-model="addOrEdit.condition.cdCompType">
                                <el-option label="或" key="or" value="or"></el-option>
                                <el-option label="且" key="and" value="and" selected></el-option>
                            </el-select>
                        </div>
                        <div class="vuc-margin">
                            <el-button :disabled="disabled" icon="el-icon-plus" class="cd-button" size="mini" @click.stop="cdAddBeforeClick">添加</el-button>
                        </div>
                    </el-row>
                </el-form-item>

                <el-form-item label="">
                    <el-table
                            id="logicTable"
                            :data="addOrEdit.condition.conditions"
                            tooltip-effect="dark"
                            stripe
                            border
                            max-height="266px"
                            size="mini"
                            row-key="cdId"
                            style="width: 100%">
                        <el-table-column prop="cdId" align="center" label="逻辑序号" width="80px"></el-table-column>
                        <el-table-column   align="center" label="操作符" width="150px">
                            <template slot-scope="scope">
                                <el-select :disabled="disabled"
                                       size="mini"
                                       style="width: 100px"
                                       v-model="scope['row'].cdOpt" placeholder="请选择">
                                    <!--<el-option v-for="type in logicConfig[addOrEdit.condition.getVarType()]"
                                           :key="type.value"
                                           :label="type.label" :value="type.value"></el-option> -->
                                    <el-option v-for="opt in computeOptList" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="变量或值">
                            <template slot-scope="scope" v-if="computeSingleOpt">
                            <template v-if="varFromEnums.edit.code === scope['row'].rightVarFrom">
                                <el-input v-model="scope['row'].rightVarValue"
                                          class="vuc-input-width"></el-input>
                            </template>
                            <template v-else>
                                <el-select :disabled="disabled"
                                           size="mini"
                                           filterable
                                           v-model="scope['row'].rightVarName"
                                        placeholder="请选择">
                                    <el-option v-for="rightVar in pCdRelVarList"
                                               :key="rightVar.getPrefixVarName()"
                                               :label="rightVar.getDescVarName()"
                                               :value="rightVar.getPrefixVarName()">
                                        <span :title="rightVar.getPrefixVarName()" class="option-left">{{rightVar.getPrefixVarName()}}</span>
                                        <span :title="rightVar.getSimpleDesc()" class="option-right">{{rightVar.getSimpleDesc()}}</span>
                                    </el-option>
                                </el-select>
                            </template>
                            <el-icon v-if="!disabled" class="el-icon-edit vuc-icon" title="输入"
                                     @click.native="scope['row'].rightVarFrom = varFromEnums.edit.code"></el-icon>
                            <el-icon v-if="!disabled" class="el-icon-link vuc-icon" title="引用临时或事件变量"
                                     @click.native="scope['row'].rightVarFrom = varFromEnums.rel.code"></el-icon>
                            </template>
                        </el-table-column>
                        <el-table-column  align="center" label="操作" width="80px" >
                            <template slot-scope="scope">
                                <el-button :disabled="disabled" type="danger" class="icon-button" icon="el-icon-delete" size="mini" @click="logicDeleteClick(scope['row'])" title="删除">
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="条件描述">
                    <el-input v-model="addOrEdit.condition.cdDesc"></el-input>
                </el-form-item>

                <el-form-item label="条件分数">
                    <el-input-number v-model="addOrEdit.condition.cdScore" size="mini" controls-position="right"></el-input-number>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <span style="color: red;margin-right: 15px">{{cdErrorMsg}}</span>
                <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                <el-button type="primary" :disabled="isNotEmpty(cdErrorMsg)" size="mini" @click="addAfter">确定</el-button>
            </template>
        </el-dialog>
    </div>


</template>

<script>
    import {Condition} from "../../rule-node/index";
    import {varFromEnums, DataTypeEnumsClass, dataTypeEnums} from "../../../entity/enumns";
    import {ls} from "../../index";
    import VarTable from "../../vars-node/v1/VarTable";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import {CompCondition} from "../index"

    export default {
        name: "ScCondition",
        components: {VarTable},
        props: {
            // 逻辑操作
            pCdList: {default: [], type: Array},
            // 引用的变量（临时变量和事件变量）
            pCdRelVarList: {default: [], type: Array},
            disabled: {default: false, type: Boolean},
        },

        data() {
            return {
                varTable: {dialog: false, title: '变量选择'},
                varFromEnums: varFromEnums,
                dataTypeEnums: dataTypeEnums,
                addOrEdit: {
                    dialog: false,
                    condition: new CompCondition(),
                    type: "add"
                },
                pLogicList: [],
                isEdit: false,
                canSelectVarType: true,
                spanArrs:{},
            }
        },

        computed: {
            /**
             * 计算是否是单值操作
             */
            computeSingleOpt(){
                return ![dataTypeEnums.OBJECT.code, dataTypeEnums.BOOLEAN.code].includes(this.addOrEdit.condition.cdVarType);
            },


            computeOptList(){
                return DataTypeEnumsClass.getOptListByKey(this.addOrEdit.condition.getVarType())
            },

            computePVNByName() {
                return (name) => {
                    if (isEmpty(name)) return "";
                    let result = this.pCdRelVarList.filter(item => item.getPrefixVarName() === name)[0];
                    if (isEmpty(result)) return "";
                    return result.getPrefixVarName();
                }
            },

            computeDecsByName() {
                return (name) => {
                    if (isEmpty(name)) return "";
                    let result = this.pCdRelVarList.filter(item => item.getPrefixVarName() === name)[0];
                    if (isEmpty(result)) return "";
                    return result.varDesc;
                }
            },

            cdErrorMsg(){
                return this.addOrEdit.condition.getErrorMsg()
            },
        },

        methods: {
            //添加逻辑
            cdAddBeforeClick(){
                // 添加逻辑
                let that = this;
                let cdNum = 4;
                let cdIdList = ls(cdNum);
                // 新增没有出现的id
                let inCdListId = that.addOrEdit.condition.conditions.map(cd => cd.cdId);
                let noInCdListId = cdIdList.filter(cdId => inCdListId.indexOf(cdId) === -1);
                if (noInCdListId.length === 0) {
                    that.$message({message: `目前仅支持${cdNum}个逻辑组合`, type: 'warning'});
                } else {
                      that.addOrEdit.condition.conditions.push(new Condition({
                            cdId: noInCdListId[0],
                            leftVarFrom: varFromEnums.rel.code,
                            rightVarFrom: varFromEnums.edit.code,
                            leftVarName: that.addOrEdit.condition.cdVarName,
                            cdVarType: that.addOrEdit.condition.cdVarType,
                    }));
                }
            },

            // 添加条件
            addBefore() {
                let that = this;
                that.isEdit = false;
                let cdNum = 999;
                let cdIdList = ls(cdNum);
                // that.pLogicList = [];
                // 新增没有出现的id
                let inCdListId = that.pCdList.map(cd => cd.cdId);
                let noInCdListId = cdIdList.filter(cdId => inCdListId.indexOf(cdId) === -1);
                if (noInCdListId.length === 0) {
                    that.$message({message: `目前仅支持${cdNum}个条件`, type: 'warning'});
                } else {
                    let lastVarName = '';
                    let lastVarType = '';
                    let lastVarWeight = '1';
                    if(isNotEmpty(that.pCdList)) {
                        let cond = that.pCdList[that.pCdList.length-1];
                        lastVarName = cond.cdVarName;
                        lastVarType = cond.cdVarType;
                        lastVarWeight = cond.cdWeight;
                        that.canSelectVarType = false;
                    }

                    that.addOrEdit = {
                        dialog: true,
                        condition: new CompCondition({
                            cdId: noInCdListId[0],
                            // leftVarFrom: varFromEnums.rel.code,
                            // rightVarFrom: varFromEnums.edit.code,
                            cdVarName: lastVarName,
                            cdVarType: lastVarType,
                            cdWeight: lastVarWeight,
                            cdScore: 1,
                            cdCompType: 'and',
                            conditions: [],
                        }),
                        type: 'add'
                    };
                }
            },

            // 添加条件之后
            addAfter() {
                let that = this;
                that.addOrEdit.dialog = false;
                that.pCdList.forEach(item=>{
                    if(item.cdVarName === this.addOrEdit.condition.cdVarName) {
                        item.cdWeight = this.addOrEdit.condition.cdWeight;
                    }
                });

                let result = this.pCdRelVarList.filter(item => item.getPrefixVarName() === that.addOrEdit.condition.cdVarName)[0];
                if (isEmpty(result)) {
                    that.addOrEdit.condition.cdVarDecs = "";
                } else {
                    that.addOrEdit.condition.cdVarDecs = result.varDesc;
                }


                that.$emit("addOrEditClick", that.addOrEdit.condition);
            },


            // 编辑之前
            editBefore(row) {
                let that = this;
                that.addOrEdit = {
                    dialog: true,
                    condition: CompCondition.obj2Condition(JSON.parse(JSON.stringify(row))),
                    type: 'edit'
                };
                that.isEdit = true;
            },

            // 删除条件
            deleteClick(row) {
                // 对象引用发生变化，父组件去修改对象值
                this.$confirm('确定要删除该条件吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.$emit("deleteClick", row);
                }).catch(() => {});
            },

            // 删除逻辑
            logicDeleteClick(row) {
                let that = this;
                that.addOrEdit.condition.conditions = that.addOrEdit.condition.conditions.filter(cd => cd.cdId !== row.cdId);
            },

            // 左边变量名改变时联动改变变量类型，同时操作符制空
            varNameChange(varName, row) {
                let that = this;
                if (isNotEmpty(varName)) {
                    let varType = that.pCdRelVarList.filter(item => item.getPrefixVarName() === varName)[0].varType;
                    //let varType = '';
                    let varWeight = '1';
                    let tmpCdList = that.pCdList.filter(item => item.cdVarName === varName);
                    if(isNotEmpty(tmpCdList)) {
                        varType = tmpCdList[0].getVarType();
                        varWeight = tmpCdList[0].getVarWeight();
                    }
                    row.cdWeight = varWeight;
                    if (isNotEmpty(varType)){
                        row.cdVarType = varType;
                        that.varTypeChange(row)
                    }
                    let varDecs = that.pCdRelVarList.filter(item => item.getPrefixVarName() === varName)[0].getDescVarName();
                    if (isNotEmpty(varDecs)) row[`cdVarDecs`] =varDecs;

                    if(isNotEmpty(row.conditions)) {
                        row.conditions.forEach(cond=>{
                            cond.leftVarName = row.cdVarName;
                            cond.leftVarFrom = varFromEnums.rel.code;
                        });
                    }

                    if (that.pCdList.filter(cond => cond.cdVarName === varName).length > 0) {
                        that.canSelectVarType = false;
                    } else {
                        that.canSelectVarType = true;
                    }


                }
            },

            // 左边变量类型发生变化时，操作符制空
            varTypeChange(condition) {
                if(isNotEmpty(condition.conditions)) {
                    condition.conditions.forEach(cond=>{
                        cond.cdOpt = '';
                        cond.cdVarType = condition.cdVarType;
                    });
                }
            },

            getSpanArr (data, key, key2) {
                let spanArr = []
                let spanIndex = null
                if (data == null) {
                    return []
                } else {
                    for (let i = 0; i < data.length; i++) {
                        if (i === 0) {
                            spanArr.push(1)
                            spanIndex = 0
                        } else {
                            if(isNotEmpty(key2)){
                                if (data[i][key] === data[i - 1][key] && data[i][key2] === data[i - 1][key2]) {
                                    spanArr[spanIndex] += 1
                                    spanArr.push(0)
                                } else {
                                    spanArr.push(1)
                                    spanIndex = i
                                }
                            } else {
                                if (data[i][key] === data[i - 1][key]) {
                                    spanArr[spanIndex] += 1
                                    spanArr.push(0)
                                } else {
                                    spanArr.push(1)
                                    spanIndex = i
                                }
                            }
                        }
                    }
                    return spanArr;
                }
            },

            arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
                if (this.spanArrs[column.property] && columnIndex < 3) { // 3
                    const _row = this.spanArrs[column.property][rowIndex]
                    const _col = _row > 0 ? 1 : 0
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                } else {
                    return {
                        rowspan: 1,
                        colspan: 1
                    }
                }
            },

            updateTable() {
                let that = this;
                that.spanArrs = {};
                const cdVarName = that.getSpanArr(that.pCdList, 'cdVarName');
                const cdVarType = that.getSpanArr(that.pCdList, 'cdVarType', 'cdVarName');
                const cdWeight = that.getSpanArr(that.pCdList, 'cdWeight', 'cdVarName');
                that.spanArrs = {
                    cdVarName:cdVarName,
                    cdVarType:cdVarType,
                    cdWeight:cdWeight,
                };
            }
        }
    }
</script>

<style scoped>
    .vuc-icon {
        margin-left: 10px;
    }

    .vuc-margin {
        margin-left: 10px;
    }

    .vuc-input-width {
        width: 70%;
    }

    .cd-button {
    background: #409EFF;
    border-radius: 4px;
    border: 1px solid #409EFF;
    color: #ffffff;
    font-size: 12px;
    }
</style>
