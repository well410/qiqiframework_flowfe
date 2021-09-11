<template>
    <!--常量节点，用来定义给子节点使用的常量-->
    <div id="constEdit" ref="constEdit">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled">
                <template slot="right">
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="mini" :disabled="disabled" type="primary" @click="addConstBefore"><i class="el-icon-plus el-icon--left"></i>添加常量</el-button>
                </template>
            </node-inf>

            <el-card>
                <el-collapse v-model="activeName">
                    <el-collapse-item name="1">
                        <template slot="title">
                            <div title="常量字段映射">
                                <span>常量字段映射</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                        </template>
                        <comm-var-table-inf :p-var-list="constVarList">
                            <el-table-column prop="varValue" :label="messageEnums.VAR_VALUE.name">
                                <template slot-scope="props">{{props.row.varValue}}</template>
                            </el-table-column>
                            <el-table-column label="操作" width="80px">
                                <template slot-scope="props">
                                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-edit" type="primary" @click="editConstBefore(props.row)" title="编辑"></el-button>
                                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-delete" type="danger" @click="deleteConstVar(props.row)" title="删除"></el-button>
                                </template>
                            </el-table-column>
                        </comm-var-table-inf>

                    </el-collapse-item>
                </el-collapse>

                <el-dialog :visible.sync="addOrEdit.dialog"
                           :modal="false"
                           :close-on-click-modal="false"
                           class="new-dialog">
                    <div slot="title">
                        <div class="clearfix" style="width: 97%;">
                            <div class="dialog-title">常量配置</div>
                        </div>
                    </div>
                    <div class="common-title">{{messageEnums.CONFIG_OF_FIELD.name}}</div>
                    <comm-var-inf ref="commVarInf" :disabled="disabled" :p-var="addOrEdit.constVar" ></comm-var-inf>
                    <el-form size="mini" ref="constVarForm" :rules="constVarRules" :model="addOrEdit.constVar">
                        <el-form-item prop="varValue" label="字段值" label-width="90px">
                            <el-input v-model="addOrEdit.constVar.varValue" v-if="addOrEdit.constVar.varType !== dataTypeEnums.BOOLEAN.code"></el-input>
                            <el-select v-else v-model="addOrEdit.constVar.varValue" placeholder="请选择值"
                                       clearable
                                       filterable
                                       style="width: 80%"
                                       size="mini">
                                <el-option label="true" value="true" key="true"></el-option>
                                <el-option label="false" value="false" key="false"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <template slot="footer">
                        <template v-if="addOrEdit.type === 'add'">
                            <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="addConstAfter">添加</el-button>
                        </template>

                        <template v-if="addOrEdit.type === 'edit'">
                            <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="editConstAfter">保存</el-button>
                        </template>
                    </template>
                </el-dialog>
            </el-card>
        </el-scrollbar>
    </div>
</template>

<script>
    import {ConstVar} from "../../entity/vars";
    import {dataTypeEnums, messageEnums, patternEnums} from "../../entity/enumns";
    import resizeForDrawer from "../mixins/resizeForDrawer"
    import NodeInf from "../common/node-inf";
    import CommVarInf from "../common/CommVarInf";
    import CommVarTableInf from "../common/CommVarTableInf";

    export default {
        name: "ConstEdie",
        components: {CommVarTableInf, CommVarInf, NodeInf},
        mixins:[resizeForDrawer],
        props: {
            node: {
                default: () => {}, type: Object
            },
            disabled: {default: false, type: Boolean},
        },
        data() {
            return {
                constVarList: [],
                messageEnums: messageEnums,
                patternEnums: patternEnums,
                dataTypeEnums: dataTypeEnums,
                activeName: ["1"],
                addOrEdit: {dialog: false, type: '', constVar: new ConstVar()},

                constVarRules: {
                    varValue: [
                        {required: true, message: '请填写字段值', trigger: 'blur'},
                    ]
                },
            }
        },
        watch: {
            constVarList: {
                handler(value) {
                    let that = this;
                    debugger
                    that.node.nData.constVarList = value;
                },
                deep: true
            },
        },
        methods: {
            handleCommand(command){
                switch (command) {
                    case 'addConstVar':
                        this.addConstBefore();
                        break;
                }
            },
            init() {
                let that = this;
                that.isEmpty(that.node.nData.constVarList) ? that.constVarList = [] : that.constVarList = that.node.nData.constVarList.map(item=>new ConstVar(item));
            },

            addConstBefore() {
                this.addOrEdit.dialog = true;
                this.addOrEdit.type = 'add';
                this.addOrEdit.constVar = new ConstVar({});
                this.$nextTick(()=>{
                    this.$refs['commVarInf'].clearValidate();
                    this.$refs['constVarForm'].clearValidate();
                })
            },

            addConstAfter(){
                let that = this;
                Promise.all([this.$refs['commVarInf'].validate(), that.$refs['constVarForm'].validate()]).then(res=>{
                    if (res[0] && res[1]){
                        that.addOrEdit.dialog = false;
                        that.constVarList.push(that.addOrEdit.constVar);
                    }
                })
            },

            editConstAfter(){
                let that = this;
                Promise.all([this.$refs['commVarInf'].validate(), that.$refs['constVarForm'].validate()]).then(res=>{
                    if (res[0] && res[1]){
                        that.addOrEdit.dialog = false;
                        that.constVarList.forEach(item => {
                            if (item.uuid === that.addOrEdit.constVar.uuid) {
                                Object.assign(item, that.addOrEdit.constVar)
                            }
                        })
                    }
                });
            },

            editConstBefore(row){
                this.addOrEdit.dialog = true;
                this.addOrEdit.type = 'edit';
                this.addOrEdit.constVar = ConstVar.obj2ConstVar(JSON.parse(JSON.stringify(row)));
                this.$nextTick(()=>{
                    this.$refs['commVarInf'].setOldPVar(this.addOrEdit.constVar);
                })
            },

            deleteConstVar(row){
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.constVarList = this.constVarList.filter(item => item.uuid !== row.uuid)
                }).catch(() => {});

            }


        }
    }
</script>

<style scoped>
    #constEdit {
        width: 100%;
        height: 100%;
        overflow: auto;
        min-height: 100%;
    }
</style>
