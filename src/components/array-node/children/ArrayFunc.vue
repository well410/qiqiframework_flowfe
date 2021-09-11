<template>
    <!--数组函数-->
    <div id="arrayFunc">
        <comm-var-table-inf :p-var-list="pArrVarList">
            <el-table-column prop="arrOpt" label="操作方法" ></el-table-column>
            <el-table-column prop="arrOptPath" label="操作字段" ></el-table-column>
            <el-table-column prop="mapField" label="数组对象" ></el-table-column>
            <el-table-column label="操作" width="80px">
                <template slot-scope="props">
                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-edit" type="primary" @click="editBefore(props.row)" title="编辑"></el-button>
                    <el-button size="mini" :disabled="disabled" class="icon-button" icon="el-icon-delete" type="danger" @click="deleteArrVar(props.row)" title="删除"></el-button>
                </template>
            </el-table-column>
        </comm-var-table-inf>

        <el-dialog :visible.sync="addOrEdit.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%">
                    <div class="dialog-title">数组操作设置</div>
                </div>
            </div>
            <div class="common-title">{{messageEnums.CONFIG_OF_FIELD.name}}</div>
            <comm-var-inf :p-var="addOrEdit.arrVar" :p-alias-list="pVarList" :disabled="disabled" ref="commVarInf"></comm-var-inf>
            <div class="common-title">{{messageEnums.CONFIG_OF_ARR_OPT.name}}</div>

            <el-form size="mini" label-width="120px" :rules="rules" :model="addOrEdit.arrVar" ref="arrVarFrom">


                <el-form-item label="操作方法" prop="arrOpt">
                    <el-select v-model="addOrEdit.arrVar.arrOpt" clearable>
                        <el-option :value="arrOptEnums.MAX.code" :label="arrOptEnums.MAX.name" :key="arrOptEnums.MAX.code" :title="arrOptEnums.MAX.title"></el-option>
                        <el-option :value="arrOptEnums.MIN.code" :label="arrOptEnums.MIN.name" :key="arrOptEnums.MIN.code" :title="arrOptEnums.MIN.title"></el-option>
                        <el-option :value="arrOptEnums.MEAN.code" :label="arrOptEnums.MEAN.name" :key="arrOptEnums.MEAN.code" :title="arrOptEnums.MEAN.title"></el-option>
                        <el-option :value="arrOptEnums.IN.code" :label="arrOptEnums.IN.name" :key="arrOptEnums.IN.code" :title="arrOptEnums.IN.title"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="数组对象" prop="mapField">
                    <el-select :disabled="disabled" v-model="addOrEdit.arrVar.mapField" placeholder="请选择数组"
                               clearable
                               filterable
                               :title="addOrEdit.arrVar.mapField"
                               style="width: 80%"
                               size="mini">
                        <el-option v-for="item in pArrRelVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()"
                                  class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="属于方法的值" prop="relOfInOpt" v-if="addOrEdit.arrVar.arrOpt === arrOptEnums.IN.code">
                    <el-select :disabled="disabled" v-model="addOrEdit.arrVar.relOfInOpt" placeholder="请配置映射参数"
                               clearable
                               filterable
                               :title="addOrEdit.arrVar.relOfInOpt"
                               style="width: 80%"
                               size="mini">
                        <el-option v-for="item in pInOptRelVarList"
                                   :key="item.getPrefixVarName()"
                                   :label="item.getDescVarName()"
                                   :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()"
                                  class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="操作字段" prop="arrOptPath">
                    <el-input size="mini" style="width: 80%" :disabled="disabled" v-model="addOrEdit.arrVar.arrOptPath"
                              placeholder="数组为对象时用路径表示，非对象时不填"></el-input>
                </el-form-item>

            </el-form>
            <template slot="footer">
                <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                <el-button type="primary" v-if="addOrEdit.type === 'add'" size="mini" @click="addAfter">确定</el-button>
                <el-button type="primary" v-if="addOrEdit.type === 'edit'" size="mini" @click="editAfter">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {ArrVar} from "../../../entity/vars";
    import {arrOptEnums, messageEnums, patternEnums} from "../../../entity/enumns";
    import CommVarInf from "../../common/CommVarInf";
    import CommVarTableInf from "../../common/CommVarTableInf";

    export default {
        name: "ArrayFunc",
        components: {CommVarTableInf, CommVarInf},
        props: {
            // 父节点的所有变量（当前所有父节点以及父节点的父节点的变量）
            pVarList : {type : Array, default :()=> []},
            // 数据函数的所有变量（数组节点中的属性）
            pArrVarList: {type: Array, default: () => []},

            pArrRelVarList: {type: Array, default: () => []},
            pInOptRelVarList: {type: Array, default: () => []},
            disabled: {default: false, type: Boolean},
        },
        data() {
            return {
                addOrEdit: {dialog: false, type: "add", arrVar: new ArrVar()},
                arrOptEnums: arrOptEnums,
                patternEnums: patternEnums,
                messageEnums: messageEnums,
                rules: {
                    varName: [
                        {required: true, message: '请输入字段名', trigger: 'blur'},
                    ],
                    varDesc: [
                        {required: true, message: '请输入字段描述', trigger: 'blur'}
                    ],
                    relOfInOpt: [
                        {required: true, message: '请输入In操作的值', trigger: 'blur'}
                    ],
                    arrOpt: [
                        {required: true, message: '请选择操作方法', trigger: 'change'}
                    ],
                    mapField: [
                        {required: true, message: '请选择数组对象', trigger: 'change'}
                    ],
                }
            }
        },
        methods: {

            // 新增之前
            addBefore() {

                let that = this;
                that.addOrEdit = {dialog: true, arrVar: new ArrVar(), type: 'add'};
                that.$nextTick(() => {
                    that.$refs.arrVarFrom.clearValidate()
                })
            },

            // 或修改之后
            addAfter() {
                Promise.all([this.$refs.commVarInf.validate(),this.$refs.arrVarFrom.validate()]).then(res=>{
                    if (res[0] && res[1]){
                        let that = this;
                        that.pArrVarList.push(that.addOrEdit.arrVar);
                        that.addOrEdit.dialog = false;
                    }  else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },

            // 编辑之前
            editBefore(row) {
                let that = this;
                that.addOrEdit = {dialog: true, arrVar: ArrVar.obj2ArrVar(JSON.parse(JSON.stringify(row))), type: 'edit'};
                that.$nextTick(() => {
                    that.$refs.arrVarFrom.clearValidate()
                })
            },

            // 保存之后
            editAfter(){
                Promise.all([this.$refs.commVarInf.validate(),this.$refs.arrVarFrom.validate()]).then(res=>{
                    if (res[0] && res[1]){
                        let that = this;
                        that.pArrVarList.forEach(item=>{
                            if (item.uuid === that.addOrEdit.arrVar.uuid) {
                                Object.assign(item, that.addOrEdit.arrVar);
                            }
                        });
                        that.addOrEdit.dialog = false;
                    }  else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },


            // 向父组件发送删除行的命令
            deleteArrVar(row) {
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    this.$emit("deleteArrVar", row);
                }).catch(() => {});
            }
        }
    }
</script>

<style scoped>

</style>
