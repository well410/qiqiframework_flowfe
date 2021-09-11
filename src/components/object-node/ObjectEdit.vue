<template>
    <!--json解析节点（设置json对象的路径，解析json中的数据，生成新的变量传给子节点）-->
    <div id="jsonEdit" ref="jsonEdit">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled">
                <template slot="right">
                    <el-divider direction="vertical"></el-divider>
                    <el-dropdown trigger="click"  @command="handleCommand">
                        <el-button type="primary" size="mini">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  command="addBefore">添加</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </node-inf>

            <el-card>
                <el-collapse v-model="activeNames">
                    <el-collapse-item name="1">
                        <template slot="title">
                            <div title="决策图中所有object或array变量列表" style="width: 100%">
                                <div style="float: left">
                                    <div style="line-height: 60px;height: 60px;">可解析变量列表</div>
                                </div>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                            </div>
                        </template>
                        <el-scrollbar style="height: 250px">
                            <el-table
                                    :data="objRelVarList"
                                    tooltip-effect="dark"
                                    stripe
                                    border
                                    max-height="600px"
                                    row-key="cdId"
                                    size="mini"
                                    style="width: 100%" @select="selectRow" @select-all="selectAll">
                                <el-table-column
                                        type="selection"
                                        width="55" :selectable="isSelectable" >
                                </el-table-column>
                                <el-table-column
                                        label="序号"
                                        type="index"
                                        width="55">
                                </el-table-column>
                                <el-table-column prop="varFrom" label="变量名">
                                    <template slot-scope="scope">{{ scope.row.getPrefixVarName()}}</template>
                                </el-table-column>
                                <el-table-column prop="varDesc" label="变量描述">
                                </el-table-column>
                                <el-table-column prop="varType" label="变量类型">
                                </el-table-column>
                            </el-table>
                        </el-scrollbar>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template slot="title">
                            <div title="决策图中需JSon解析的变量列表">
                                <div style="float: left">
                                    <div style="line-height: 60px;height: 60px;">Json解析变量列表</div>
                                </div>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                            </div>
                            <div style="margin-left: 10px">
                                <span style="margin-left: 20px;color: red">{{computeError}}</span>
                            </div>
                        </template>
                        <comm-var-table-inf :p-var-list="objVarList">
                            <el-table-column prop="valuePath" :label="messageEnums.VAR_NAME_REAL.name" >
                                <template slot-scope="scope" slot="header">
                                    <span>{{messageEnums.PARSE_PATH.name}}</span>
                                    <el-tooltip class="item" effect="dark" content="示例：https://blog.csdn.net/itguangit/article/details/78764212" placement="top">
                                        <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                                    </el-tooltip>
                                </template>
                                <template slot-scope="props">
                                    {{props.row.valuePath}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="mapField" :label="messageEnums.PARSE_OBJECT.name" >
                                <template slot-scope="scope" slot="header">
                                    <span>{{messageEnums.PARSE_OBJECT.name}}</span>
                                    <el-tooltip class="item" effect="dark" content="可以是数组类型或者对象类型" placement="top">
                                        <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                                    </el-tooltip>
                                </template>
                                <template slot-scope="props">
                                    {{props.row.mapField}}
                                </template>
                            </el-table-column>
                            <el-table-column :label="messageEnums.PARSE_OBJECT_TYPE.name" >
                                <template slot-scope="props">
                                    {{mapFieldType(props.row.mapField)}}
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" width="100px" >
                                <template slot-scope="props">
                                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-edit" type="primary" @click="editBefore(props.row)" title="编辑"></el-button>
                                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-delete" type="danger" @click="deleteObjVar(props.row)" title="删除"></el-button>
                                </template>
                            </el-table-column>
                        </comm-var-table-inf>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>



        <el-dialog :visible.sync="addOrEdit.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">JSON解析操作设置</div>
                </div>
            </div>
            <div class="common-title">{{messageEnums.CONFIG_OF_FIELD.name}}</div>
            <comm-var-inf ref="commVarInf" :disabled="disabled" :p-var="addOrEdit.objVar" :p-alias-list="computeParentVarList"></comm-var-inf>
            <div class="common-title">{{messageEnums.CONFIG_OF_PARSE.name}}</div>
            <el-form ref="objVarFrom" size="mini" label-width="120px" :rules="rules" :model="addOrEdit.objVar" >
                <el-form-item label="路径" prop="valuePath">
                    <el-input :disabled="disabled" style="width: 80%" v-model="addOrEdit.objVar.valuePath"></el-input>
                    <el-tooltip class="item" effect="dark" content="示例：http://helper.tcs.paas.cmbchina.cn/modules/decision/1.html#411209" placement="top">
                        <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="解析对象" prop="mapField">
                    <template slot-scope="props">
                        <el-select :disabled="disabled" v-model="addOrEdit.objVar.mapField" placeholder="请配置映射参数"
                                   clearable
                                   filterable
                                   :title="addOrEdit.objVar.mapField"
                                   style="width: 80%"
                                   size="mini">
                            <el-option v-for="item in objRelVarList"
                                       :key="item.getPrefixVarName()"
                                       :label="item.getDescVarName()"
                                       :value="item.getPrefixVarName()">
                                <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span></el-option>
                        </el-select>

                        <el-tooltip class="item" effect="dark" content="可以是数组类型或者对象类型" placement="top">
                            <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                        </el-tooltip>
                    </template>
                </el-form-item>

                <el-form-item label="解析对象类型">
                    {{mapFieldType(addOrEdit.objVar.mapField)}}
                </el-form-item>
            </el-form>
            <template slot="footer">
                <template v-if="addOrEdit.type === 'add'">
                    <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="addAfter">添加</el-button>
                </template>

                <template v-if="addOrEdit.type === 'edit'">
                    <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="editAfter">保存</el-button>
                </template>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    import {DOVar, OBJVar} from "../../entity/vars";
    import {dataTypeEnums, messageEnums, patternEnums, varFromEnums} from "../../entity/enumns";
    import {isContainEmpty, isEmpty} from "../../utils";
    import resizeForDrawer from "../mixins/resizeForDrawer"
    import NodeInf from "../common/node-inf";
    import {G6Model} from "../../entity/g6Model";
    import CommVarInf from "../common/CommVarInf";
    import CommVarTableInf from "../common/CommVarTableInf";

    export default {
        name: "ObjectEdit",
        components: {CommVarTableInf, CommVarInf, NodeInf},
        mixins:[resizeForDrawer],
        props: {
            decisionTree: {
                default: () => {
                }, type: Object
            },
            node: {
                default: () => {
                }, type: Object
            },
            disabled: {default: false, type: Boolean},
            // 决策结果节点的输入（可以使用的变量：json临时变量）
            objInputVarList: {default: () => [], type: Array},
        },

        data() {
            return {
                objVarList: [],
                objRelVar: {objInputVarList: [], totalVarList:[]},
                addOrEdit: {dialog: false, objVar: new OBJVar(), type: 'add'},
                patternEnums:patternEnums,
                messageEnums: messageEnums,
                rules: {
                    varName: [
                        { required: true, message: '请输入字段名', trigger: 'blur' },
                    ],
                    valuePath: [
                        { required: true, message: '请输入JSON解析路径', trigger: 'blur' }
                    ],
                    mapField: [
                        { required: true, message: '请选择引用对象', trigger: 'change' }
                    ],
                },
                activeNames:["1","2"],
            }
        },

        mounted() {
        },

        computed: {
            computeParentVarList(){
                let result = [];
                result.push(...this.objRelVar.objInputVarList);
                result.push(... this.objRelVar.totalVarList);
                return result;
            },

            objRelVarList() {
                let result = [];
                result.push(...this.objRelVar.objInputVarList);
                result.push(... this.objRelVar.totalVarList);
                return result.filter(item => isEmpty(item.varType) || [dataTypeEnums.OBJECT.code, dataTypeEnums.ARRAY.code].includes(item.varType));
            },

            mapFieldType() {
                return (mapField) => {
                    let filterItem = this.objRelVarList.filter(item => item.getPrefixVarName() === mapField);
                    if (isEmpty(filterItem)) {
                        return "";
                    } else {
                        return filterItem[0].varType
                    }

                }
            },

            computeError(){
                let index = 0;
                let result = [];
                this.objVarList.forEach(bojVar => {
                    index++;
                    if (bojVar.enableAlias()) {
                        if (isContainEmpty([bojVar.varAlias, bojVar.valuePath])) {
                            result.push(index);
                        }
                    } else {
                        if (isContainEmpty([bojVar.varName, bojVar.valuePath])) {
                            result.push(index);
                        }
                    }
                });
                if (result.length > 0) {
                    return "序号为 【" + result.join(", ") + "】 的配置项字段未填写完整";
                } else {
                    return "";
                }
            }
        },

        watch: {
            objVarList: {
                handler(value) {
                    let that = this;
                    that.node.nData.objVarList = value;
                },
                deep: true
            },
        },

        methods: {
            handleCommand(command){
                switch (command) {
                    case 'addBefore':
                        this.addBefore();
                        break;
                }
            },
            init() {
                // 节点信息初始化
                let that = this;
                that.isEmpty(that.node.nData.objVarList) ? that.objVarList = [] : that.objVarList = that.node.nData.objVarList.map(item=>new OBJVar(item));


                // 可以引用变量的初始化
                this.objRelVar.objInputVarList = that.objInputVarList;
                this.objRelVar.totalVarList = G6Model.getTotalVarsOfParents(that.node, that.decisionTree);
            },


            addBefore() {
                let that = this;
                that.addOrEdit = {dialog: true, objVar: new OBJVar(), type: 'add'};
                that.$nextTick(() => {
                    that.$refs.objVarFrom.clearValidate()
                })
            },

            addAfter() {
                let that = this;
                Promise.all([this.$refs.commVarInf.validate(), this.$refs.objVarFrom.validate()]).then(res => {
                    if (res[0] && res[1]) {
                        that.addOrEdit.dialog = false;
                        that.objVarList.push(that.addOrEdit.objVar);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            editBefore(objVar){
                let that = this;
                that.addOrEdit.dialog = true;
                that.addOrEdit.type = 'edit';
                that.addOrEdit.objVar = OBJVar.obj2OBJVar(JSON.parse(JSON.stringify(objVar)));
                that.$nextTick(() => {
                    that.$refs.objVarFrom.clearValidate();
                    that.$refs.commVarInf.clearValidate();
                })
            },

            editAfter(){
                let that = this;
                Promise.all([this.$refs.commVarInf.validate(), this.$refs.objVarFrom.validate()]).then(res => {
                    if (res[0] && res[1]) {
                        that.addOrEdit.dialog = false;
                        that.objVarList.forEach(item=>{
                            if (item.uuid === this.addOrEdit.objVar.uuid){
                                Object.assign(item, this.addOrEdit.objVar)
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            deleteObjVar(row) {
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.objVarList = this.objVarList.filter(item => item.uuid !== row.uuid)
                }).catch(() => {});

            },
            /**
             * 表格中复选框的选择，选择一行
             * @param selection 选择中列表集合
             * @param row 当前选中行
             */
            selectRow(selection,row){
                if (row.selected === undefined || row.selected === false) {
                    row.selected = true;
                } else {
                    row.selected = false;
                }
                let that = this;
                if (row.selected) {
                    that.objVarList.push(new OBJVar({
                        varName: "",
                        valuePath: row.valuePath,
                        varDesc: row.varDesc,
                        mapField: row.getPrefixVarName(),
                    }));
                }
            },
            selectAll(selection){
                let that = this;
                selection.forEach(item=>{
                    that.objVarList.push(new OBJVar({
                        varName: "",
                        valuePath: item.valuePath,
                        varDesc: item.varDesc,
                        mapField: item.getPrefixVarName(),
                    }));
                });
            },

            isSelectable(row, index){
                return !this.disabled;
            },
        }
    }
</script>

<style>
    #jsonEdit {
        width: 100%;
        height: 100%;
        overflow: auto;
        min-height: 100%;
    }
    #jsonEdit .el-table__header .el-checkbox{
        display:none !important
    }
</style>
