<template>
    <el-form ref="editForm" :model="prodmanageBase" :rules="editRules" label-width="100px" :label-position="'right'" size="mini" class="clearfix dialog-elform">
        <el-row>
            <el-col :span="12">
                <el-form-item label="一事通ID" prop="ystId">
                    <el-input placeholder="一事通ID" v-model="prodmanageBase.ystId" style="width: 120px" maxlength="6" show-word-limit disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="角色" prop="userRole" label-width="60px">
                    <el-select v-model="prodmanageBase.userRole" placeholder="角色" style="width: 120px" >
                        <el-option v-for="(value, key) in prodmanageUserRoleEnums" :label="value.name" :key="key" :value="key"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="一事通姓名" prop="ystName">
                    <el-input placeholder="一事通姓名" v-model="prodmanageBase.ystName" style="width: 120px" maxlength="8" show-word-limit></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item>
                    <el-button type="success" @click="addProdClick" size="mini">新增产品</el-button>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
                <el-table :data="prodList"
                          tooltip-effect="dark"
                          stripe
                          border
                          max-height="300px"
                          row-key="cdId"
                          size="mini"
                >
                    <el-table-column
                            label="序号"
                            type="index"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="prodId" label="产品ID">
                        <template slot-scope="props">
                            <el-input  style="width: 120px" v-model="props.row.prodId" maxlength="8" show-word-limit></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="70px">
                        <template slot-scope="props">
                            <el-button type="danger" @click="deleteProdClick(props.row)" size="mini">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
        </el-row>
        <el-row>
            <template>
                <div class="new-dialog-footer">
                    <el-button @click="cancelVisible" size="mini">取消</el-button>
                    <el-button type="primary" :loading="editLoading" @click="editClick" size="mini">确定</el-button>
                </div>
            </template>
        </el-row>
        <!--        <el-form-item label="一事通ID:" prop="ystId">-->
        <!--            <el-input placeholder="一事通ID" v-model="prodmanageBase.ystId" style="width: 65%" maxlength="8" show-word-limit disabled></el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="一事通姓名:" prop="ystName">-->
        <!--            <el-input placeholder="一事通姓名" v-model="prodmanageBase.ystName" style="width: 65%" maxlength="8" show-word-limit></el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="产品ID:" prop="prodId">-->
        <!--            <el-input placeholder="产品ID" v-model="prodmanageBase.prodId" style="width: 65%" maxlength="8" show-word-limit></el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="角色:" prop="userRole">-->
        <!--            <el-select v-model="prodmanageBase.userRole" placeholder="角色"  style="width: 65%">-->
        <!--                <el-option v-for="(value, key) in prodmanageUserRoleEnums" :label="value.name" :key="key" :value="key"></el-option>-->
        <!--            </el-select>-->
        <!--        </el-form-item>-->
<!--        <template>-->
<!--            <div class="new-dialog-footer">-->
<!--                <el-button @click="cancelVisible" size="mini">取消</el-button>-->
<!--                <el-button type="primary" :loading="editLoading" @click="editClick" size="mini">确定</el-button>-->
<!--            </div>-->
<!--        </template>-->
    </el-form>
</template>

<script>
    import {updateProdmanageBase} from "../../api/ProdmanageBase";
    import {ProdmanageBase} from "../../entity/prod-manage-base";
    import {validateChinese, validateSpChar} from "../common";
    import {prodmanageUserRoleEnums} from "./index";
    import {getUUID, isEmpty} from "../../utils";

    export default {
        name: "ProdManageEdit",


        data() {
            return {

                prodmanageUserRoleEnums: prodmanageUserRoleEnums,
                prodList: [],

                // -----------el 组件属性-----------
                editLoading:false,          // 保存按钮


                // 表单的校验规则
                editRules: {
                    ystId: [
                        {required: true, message: '请输入一事通Id', trigger: 'blur'},
                    ],
                    ystName: [
                        {required: true, message: '请输入一事通姓名', trigger: 'blur'},
                        {validator: validateSpChar, trigger: 'blur'},
                    ],
                    prodId: [
                        {required: true, message: '请输入产品Id', trigger: 'blur'},
                        {validator: validateChinese, trigger: 'blur'},
                    ],
                },

            }
        },

        //----------父组件传入的数据----------
        props: {
            'dialogTitle': String,
            'dialogFormVisible': Boolean,
            'prodmanageBase': ProdmanageBase,
        },

        methods: {
            addProdClick(){
                let that = this;
                that.prodList.push({prodId: "", uuid: getUUID()});
            },
            deleteProdClick(row){
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    let that = this;
                    let index = that.prodList.findIndex(item => item.uuid === row.uuid);
                    this.prodList.splice(index, 1);
                }).catch(() => {});

            },
            // ------------弹窗页面上底部的两个按钮------------
            // 编辑确定按钮
            editClick() {
                let that = this;
                let flag = true;
                that.prodList.forEach(item => {
                    if(isEmpty(item.prodId)){
                        flag = false;
                        this.$confirm('产品Id为空，请补充完整', '提示', {
                            confirmButtonText: '确定',
                            type: 'success'
                        }).then(({value}) => {
                        }).catch(() => {});
                    }
                });
                if(flag){
                    that.$refs['editForm'].validate((valid)=>{
                        if (valid) {
                            debugger
                            that.prodmanageBase.prodList = that.prodList.map(item => item.prodId);
                            let params = {prodmanageBase: that.prodmanageBase, id: that.prodmanageBase.id};
                            updateProdmanageBase(params).then(res=>{
                                that.$message({message: '成功', type: 'success'});
                                that.cancelVisible();
                            }).finally(()=>{
                                that.editLoading = false;
                            })
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }

            },

            /**
             * 取消按钮
             * 子组件向父组件发送信息，用来取消dialog页面
             */
            cancelVisible: function () {
                let that = this;
                that.$emit('visibleChange', false);
            },

            // 页面的初始化方法
            init() {
                let that = this;
                that.editLoading = false;
                that.prodList = [];
                that.prodmanageBase.prodList.forEach(item =>{
                    that.prodList.push({prodId: item, uuid: getUUID()});
                });
            }

        },
    }
</script>

<style scoped>

</style>
