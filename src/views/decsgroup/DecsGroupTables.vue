<template>
    <div id="decsGroupTables">
        <!--操作工具栏-->
        <div class="tools">
            <el-form class="page-header" @submit.native.prevent>
                <el-form-item>
                    <div class="search-block">
                        <div class="search-input-container">
                            <el-input class='search-input' placeholder="请输入查询关键字" v-model="searchCon"
                                      maxlength="64" show-word-limit
                                      @keydown.enter.native="refreshPage">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </div>
                        <span class="search-icon-container" @click="refreshPage" >
                            <svg-icon icon-class="search"/>
                        </span>
                    </div>
                    <div class="tools-bar" style="margin-bottom: 8px ;width: 80px;">
                        <div class="clearfix">
                            <a class="helpHome" @click="toHelperHome">帮助文档</a>
                        </div>
                        <div class="tools-button">
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addBefore">新增</el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <!--列表-->
        <div v-loading="loading" element-loading-background="#fff0">
            <div v-if="decsGroupList.length !== 0" v-show="decsGroupList.length !== 0" v-loading="loading">
                <div style="display: flex;flex-wrap: wrap; justify-content: space-between;; min-height: 719px">
                    <div class="card-block" v-for="(o, index) in decsGroupList">
                        <el-card :body-style="{ padding: '0px' }">
                            <!--ID标签-->
                            <div slot="header" class="clearfix">
                                <div @click="decsGroupClick(o)">
                                    <div class="header-title">
                                        <div class="clearfix" style="width: 100%">
                                            <span style="width: 20%"> <svg-icon icon-class="ID"
                                                                                class="gray-bule-icon"></svg-icon></span>
                                            <el-tooltip class="item" effect="dark" :content="o.decsGroupId"
                                                        placement="bottom-end" popper-class="card-header-tooltips">
                                                <span>{{o.decsGroupId}}</span>
                                            </el-tooltip>
                                        </div>
                                        <div class="clearfix" style="width: 100%"><span style="width: 20%"> <svg-icon
                                                icon-class="name" class="gray-bule-icon"></svg-icon></span>
                                            <el-tooltip class="item" effect="dark" :content="o.decsGroupName"
                                                        placement="bottom-end" popper-class="card-header-tooltips">
                                                <span>{{o.decsGroupName}}</span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!--详细信息-->
                            <div class="tips-container clearfix" style="width: 100%" @click="decsGroupClick(o)">
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="label_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips" style="width: 230px">
                                        <el-row>
                                            <el-col :span="8"><span>创建人</span></el-col>
                                            <el-col :span="16"><span class="blue">{{o.createUser}}</span></el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="vip_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips" style="width: 230px">
                                        <el-row>
                                            <el-col :span="8"><span>创建时间</span></el-col>
                                            <el-col :span="16"><span class="blue" >{{o.createTime}}</span></el-col>
                                        </el-row>

                                    </div>
                                </div>
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="label_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips" style="width: 230px">
                                        <el-row>
                                            <el-col :span="8"><span>修改人</span></el-col>
                                            <el-col :span="16"><span class="blue">{{o.updateUser}}</span></el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="tips-box">
                                    <div class="icon blue">
                                        <svg-icon icon-class="vip_icon" class="module-icon"></svg-icon>
                                    </div>
                                    <div class="tips" style="width: 230px">
                                        <el-row>
                                            <el-col :span="8"><span>修改时间</span></el-col>
                                            <el-col :span="16"><span class="blue" >{{o.updateTime}}</span></el-col>
                                        </el-row>

                                    </div>
                                </div>
                            </div>

                            <div class="bottom">
                                <el-button class="icon-button" type="primary" icon="el-icon-edit" size="mini" @click="editBefore(o)" title="编辑"></el-button>
                                <el-button class="icon-button" type="danger" icon="el-icon-delete" size="mini" @click="deleteClick(o)"></el-button>
                            </div>
                        </el-card>
                    </div>

                    <div class="empty-card-block"></div>
                    <div class="empty-card-block"></div>
                    <div class="empty-card-block"></div>
                    <div class="empty-card-block"></div>
                </div>
            </div>
            <div v-else class="no-data">
                <svg-icon icon-class="tree_role"/>
                <br/>
                <span>未查询到决策组数据</span>
            </div>
        </div>

        <!--翻页组件-->
        <div class="page-block clearfix">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=currentPage
                    :page-sizes="[10, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

        <!--决策组编辑-->
        <el-dialog :visible.sync="addOrEdit.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">决策组编辑</div>
                </div>
            </div>

            <el-form label-width="80px" size="mini" :rules="rules" :model="addOrEdit.decsGroup" ref="decsGroupFrom">
                <el-form-item label="产品ID" prop="prodId">
                    <el-input v-model="addOrEdit.decsGroup.prodId" disabled></el-input>
                </el-form-item>


                <!--添加时可以编辑-->
                <el-form-item label="决策组ID" prop="decsGroupId" v-if="addOrEdit.type === 'add'">
                    <el-input v-model.trim="addOrEdit.decsGroup.decsGroupId"
                              :maxlength="computeMaxLength"
                              @input="decsGroupIdInput"
                              placeholder="决策组ID（由小写字母、数字、下划线组成）"
                              show-word-limit>
                        <template slot="prepend">{{computePrepend}}</template>
                    </el-input>
                </el-form-item>


                <!--编辑时不能编辑-->
                <el-form-item label="决策组ID" prop="decsGroupId" v-if="addOrEdit.type === 'edit'">
                    <el-input v-model="addOrEdit.decsGroup.decsGroupId" disabled></el-input>
                </el-form-item>


                <el-form-item label="决策组名" prop="decsGroupName">
                    <el-input v-model.trim="addOrEdit.decsGroup.decsGroupName" maxlength="64" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="应用地址" prop="appUrl">
                    <el-input v-model.trim="addOrEdit.decsGroup.appUrl" maxlength="1024" show-word-limit></el-input>
                </el-form-item>
            </el-form>



            <template slot="footer">
                <el-button type="" size="mini" @click="addOrEdit.dialog = false">取消</el-button>
                <el-button type="primary" v-if="addOrEdit.type === 'edit'" :loading="addOrEdit.loading"  size="mini" @click="editAfter">保存</el-button>
                <el-button type="primary" v-if="addOrEdit.type === 'add'"  size="mini" @click="addAfter">添加</el-button>
            </template>
        </el-dialog>


    </div>
</template>

<script>
    import {DecsGroup} from "../../entity/decsgroup";
    import {rQueryEnums} from "../../entity/enumns";
    import {validateChinese, validateSpChar, validateUpperChar} from "../common";
    import {
        addDecsGroup,
        deleteDecsGroup,
        getDecsGroupById,
        queryDecsGroup,
        updateDecsGroup
    } from "../../api/DecsGroup";
    import {isEmpty} from "../../utils";

    export default {
        name: "DecsGroupTables",
        data() {
            return {
                addOrEdit: {
                    dialog: false,
                    loading: false,
                    type: 'edit',
                    decsGroup: {prodId: '', decsGroupId: '', appUrl: '', decsGroupName: ''}
                },
                rules: {
                    prodId: [
                        {required: true, message: '请输入产品id', trigger: 'blur'},
                    ],
                    decsGroupId: [
                        {required: true, message: '请输入决策组ID', trigger: 'blur'}
                    ],
                    decsGroupName: [
                        {required: true, message: '请输入决策组名', trigger: 'blur'},
                    ],
                    appUrl: [
                        {required: true, message: '请输入应用地址', trigger: 'blur'},
                    ],
                },

                // 搜索相关
                pageNum: 1,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                searchCon: "",
                decsGroupList: [],
                loading: false,
            }
        },


        mounted() {
            this.refreshPage();
        },

        computed: {
            childrenPath() {
                let router = this.$router.options.routes.filter(r => r.path === this.$route.path)[0];
                return this.$route.path + "/" + router.children[0].path;
            },

            computeMaxLength(){
                return 32 - `${this.gConfig.prodId.value}_dg_`.length
            },

            computePrepend(){
                return `${this.gConfig.prodId.value}_dg_`;
            }
        },

        methods: {

            decsGroupIdInput(value){
                if (isEmpty(value)){
                    this.addOrEdit.decsGroup.appUrl = "";
                    return;
                }

                let matchHref = this.getMatchHref();
                if (isEmpty(matchHref)) {
                    console.warn("当前网址不是*.cmbchina.cn类型");
                    this.addOrEdit.decsGroup.appUrl =  `http://${this.gConfig.prodId.value}-dg-${value.replace(/\_/g, "-")}.tcsdg.paas.cmbchina.cn/exec`.toLowerCase();
                } else {
                    this.addOrEdit.decsGroup.appUrl = `http://${this.gConfig.prodId.value}-dg-${value.replace(/\_/g, "-")}.tcsdg.${matchHref[0].split(".")[0]}.cmbchina.cn/exec`.toLowerCase()
                }
            },

            // 页面切换
            handleCurrentChange(val) {
                this.pageNum = val;
                this.currentPage = val;
                this.refreshPage();
            },

            handleSizeChange(val) {
                this.pageNum = 1;
                this.pageSize = val;
                this.currentPage = 1;
                this.refreshPage();
            },

            getMatchHref() {
                return window.location.href.match(/[a-zA-z]+\.cmbchina\.cn/g);
            },


            toHelperHome() {

            },

            addBefore() {
                let that = this;
                const validateDecsGroupId = (rule, value, callback) => {
                    const decsGroupId = `${that.gConfig.prodId.value}_dg_${value}`;
                    const prodId = that.gConfig.prodId.value;
                    getDecsGroupById({prodId: prodId, decsGroupId: decsGroupId}).then(res => {
                        if (res.data.data !== null) {
                            callback(new Error('id重复'))
                        } else {
                            callback();
                        }
                    });

                };
                this.rules.decsGroupId = [
                    {required: true, message: '请输入决策组ID', trigger: 'blur'},
                    {validator: validateSpChar, trigger: 'blur'},
                    {validator: validateChinese, trigger: 'blur'},
                    {validator: validateUpperChar, trigger: 'blur'},
                    {validator: validateDecsGroupId, trigger: 'blur'},
                ];



                this.addOrEdit.dialog = true;
                this.$nextTick(()=>{
                    this.$refs['decsGroupFrom'].clearValidate();
                    this.addOrEdit.type = 'add';
                    this.addOrEdit.decsGroup.prodId = this.gConfig.prodId.value;
                    this.addOrEdit.decsGroup = new DecsGroup();
                });
            },

            addAfter(){
                let that = this;
                that.$refs.decsGroupFrom.validate((valid) => {
                        if (valid) {
                            let decsGroup = new DecsGroup();
                            Object.assign(decsGroup, that.addOrEdit.decsGroup);
                            decsGroup.decsGroupId = `${that.gConfig.prodId.value}_dg_${decsGroup.decsGroupId}`;
                            that.addOrEdit.loading = true;
                            addDecsGroup({prodId: that.gConfig.prodId.value, decsGroup: decsGroup}).then(res => {
                                that.addOrEdit.dialog = false;
                                that.addOrEdit.loading = false;
                                that.$message({type: 'success', message: "添加成功"});
                                that.refreshPage();
                            }).finally(() => {
                                that.addOrEdit.loading = false;
                            })
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    }
                )
            },

            editBefore(row){
                this.rules.decsGroupId = [{required: true, message: '请输入决策组ID', trigger: 'blur'}];
                this.addOrEdit.dialog = true;
                this.$nextTick(()=>{
                    let decsGroup = new DecsGroup();
                    this.$refs['decsGroupFrom'].clearValidate();
                    this.addOrEdit.type = 'edit';
                    this.addOrEdit.decsGroup = Object.assign(decsGroup, row);
                });

            },

            editAfter(){
                let that = this;
                that.$refs.decsGroupFrom.validate((valid) => {
                    if (valid){
                        let decsGroup = new DecsGroup();
                        Object.assign(decsGroup, that.addOrEdit.decsGroup);
                        that.addOrEdit.loading = true;
                        updateDecsGroup({prodId: that.gConfig.prodId.value, decsGroup : decsGroup}).then(res=>{
                            that.addOrEdit.dialog = false;
                            that.$message({type: 'success', message: "修改成功"});
                            that.refreshPage();
                        }).finally(()=>{
                            that.addOrEdit.loading = false;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })


            },

            refreshPage() {
                let that = this;
                let params = {
                    prodId: that.gConfig.prodId.value,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    decsGroupFilter: {searchCon: that.searchCon}
                };
                that.loading = true;
                queryDecsGroup(params).then(res=>{
                    that.total = res.data.data['total'];
                    that.decsGroupList = res.data.data['objectList'];
                    if (that.total > 0 && that.decsGroupList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(()=>{
                    that.loading = false;
                })

            },

            deleteClick(row){
                let that = this;

                that.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    deleteDecsGroup({decsGroup: row}).then(res=>{
                        that.$message({type: "success", message: "删除成功"});
                        that.refreshPage();
                    })
                }).catch(() => {});
            },

            decsGroupClick(decsGroup){
                console.log(this.childrenPath);
                const query = {};
                query[rQueryEnums.PROD_ID.code] = decsGroup.prodId;
                query[rQueryEnums.DECS_GROUP_ID.code] = decsGroup.decsGroupId;
                this.$router.push({path: this.childrenPath, query: query});
            }
        }
    }
</script>

<style scoped>
    #decsGroupTables{
        height: 100%;
        padding: 0 10px 0 10px;
        background-image: url('~@/assets/bg4.png');
        background-size: 100% 100%;
    }
</style>
