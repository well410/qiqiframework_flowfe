<template>
    <div id="requestMapping">
        <el-card class="info-title">
            <el-page-header @back="$router.push('/ui/decsGroupManage')">
                <template slot="content">
                    <span>决策组ID：<el-tag class="middle-tag title-tag">{{decsGroup.decsGroupId}}</el-tag></span>
                    <el-divider direction="vertical"></el-divider>
                    <span>决策组名：<el-tag type="primary" class="middle-tag">{{decsGroup.decsGroupName}}</el-tag></span>
                </template>
            </el-page-header>
        </el-card>

        <div style="margin-left: 10px">
            <!--操作工具栏-->
            <div>
                <el-row style="margin-top: 10px;margin-bottom: 10px">
                    <el-col :span="22">
                        <el-input placeholder="请输入查询关键字" v-model="searchCon"
                                  style="width: 70%"
                                  maxlength="64" show-word-limit
                                  @keydown.enter.native="refreshPage">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" @click="refreshPage" ></el-button>
                    </el-col>
                    <el-col :span="2">
                        <div class="tools-button" >
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addBefore">新增</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>


            <!--基础信息表格-->
            <request-mapping-comm-table :p-request-mapping-list="requestMappingList" :p-loading="loading" :p-table-max-height="'1000px'">
                <el-table-column label="操作" width="350px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editBefore(scope['row'])">编辑</el-button>
                        <el-button type="success" size="mini" @click="publicVersion(scope['row'])">发布</el-button>
                        <el-button type="primary" size="mini" @click="displayHistory(scope['row'])">历史</el-button>
                        <el-button type="primary" size="mini" @click="displayVersion(scope['row'])">版本</el-button>
                        <el-button type="danger" size="mini" @click="deleteReq(scope['row'])">删除</el-button>
                    </template>
                </el-table-column>
            </request-mapping-comm-table>

            <!--翻页组件-->
            <div class="page-block clearfix" style="margin-top: 10px">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page=currentPage
                        :page-sizes="[10, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>

            <!--新增或编辑-->
            <el-dialog :visible.sync="addOrUpdateDialog.isShow"
                       :modal="false"
                       :close-on-click-modal="false"
                       :append-to-body="true"
                       class="new-dialog">
                <div slot="title">
                    <div class="clearfix" style="width: 97%;">
                        <div class="dialog-title">请求编辑</div>
                    </div>
                </div>
                <el-form label-width="80px" size="mini" :rules="rules" :model="addOrUpdateDialog.requestMapping" ref="reqMapForm">
                    <el-form-item label="产品ID" prop="prodId">
                        <el-input v-model="addOrUpdateDialog.requestMapping.prodId" disabled></el-input>
                    </el-form-item>

                    <el-form-item :label="messageEnums.DECS_GROUP_ID.name" prop="decsGroupId">
                        <el-input v-model="addOrUpdateDialog.requestMapping.decsGroupId" disabled></el-input>
                    </el-form-item>


                    <el-form-item :label="messageEnums.REQUEST_MAPPING_ID.name" prop="requestMappingId">
                        <el-input v-model="addOrUpdateDialog.requestMapping.requestMappingId"
                                  :disabled="addOrUpdateDialog.type === 'edit'"
                                  maxlength="32"
                                  show-word-limit
                                  placeholder="英文非特殊字符"></el-input>
                    </el-form-item>

                    <el-form-item :label="messageEnums.REQUEST_MAPPING_DESC.name" prop="requestMappingDesc">
                        <el-input v-model="addOrUpdateDialog.requestMapping.requestMappingDesc"  maxlength="128" show-word-limit></el-input>
                    </el-form-item>

                    <el-form-item :label="messageEnums.DECS_ID.name" prop="decsId">
                        <el-select
                                style="width: 100%"
                                v-model="addOrUpdateDialog.requestMapping.decsId"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                @change="addOrUpdateDialog.requestMapping.decsVersion = ''"
                                :loading="addOrUpdateDialog.selectLoading"
                                :remote-method="getDecsListByFilter">
                            <el-option
                                    v-for="item in addOrUpdateDialog.decsList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="messageEnums.DECS_VERSION.name" prop="decsVersion">
                        <el-select
                                style="width: 100%"
                                v-model="addOrUpdateDialog.requestMapping.decsVersion"
                                @focus="searchDecsVersionList"
                                filterable>
                            <el-option
                                    v-for="item in addOrUpdateDialog.decsVersionList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>

                <template slot="footer">
                    <el-button type="" size="mini" @click="addOrUpdateDialog.isShow = false">取消</el-button>
                    <el-button type="primary" v-if="addOrUpdateDialog.type === 'edit'" :loading="addOrUpdateDialog.loading"  size="mini" @click="editAfter">保存</el-button>
                    <el-button type="primary" v-if="addOrUpdateDialog.type === 'add'"  :loading="addOrUpdateDialog.loading"  size="mini" @click="addAfter">添加</el-button>
                </template>
            </el-dialog>


            <!--请求历史-->
            <el-dialog :visible.sync="historyDialog.isShow"
                       :modal="false"
                       :close-on-click-modal="false"
                       :append-to-body="true"
                       class="new-dialog">
                <div slot="title">
                    <div class="clearfix" style="width: 97%;">
                        <div class="dialog-title">请求历史</div>
                    </div>
                </div>
                <request-mapping-history :p-history-dialog="historyDialog" ref="reqHistory"></request-mapping-history>
            </el-dialog>


            <!--请求版本-->
            <el-dialog :visible.sync="versionDialog.isShow"
                       :modal="false"
                       :close-on-click-modal="false"
                       :append-to-body="true">
                <div slot="title">
                    <div  style="width: 97%;">
                        <div >请求版本</div>
                    </div>
                </div>

                <request-mapping-version :p-version-dialog="versionDialog" ref="reqVersion"></request-mapping-version>

            </el-dialog>

        </div>
    </div>
</template>

<script>
    import {RequestMapping} from "../../entity/decsgroup";
    import RequestMappingCommTable from "./RequestMappingCommTable";
    import {isEmpty, isNotEmpty} from "../../utils";
    import {messageEnums, rQueryEnums} from "../../entity/enumns";
    import {getDecsGroupById} from "../../api/DecsGroup";
    import {
        addRequestMappingBase, deleteRequestMappingBase,
        getRequestMappingBaseById,
        publicRequestMappingBase,
        queryRequestMappingBase,
        queryRequestMappingHistory,
        updateRequestMappingBase
    } from "../../api/RequestMapping";
    import {getTotalDecsVersionList, queryDecsTotal} from "../../api/Decs";
    import {validateChinese, validateSpChar} from "../common";
    import RequestMappingHistory from "./RequestMappingHistory";
    import RequestMappingVersion from "./RequestMappingVersion";

    export default {
        name: "RequestMappingInf",
        components: {RequestMappingVersion, RequestMappingHistory, RequestMappingCommTable},
        props:{

        },

        data() {
            return {
                historyDialog: {
                    isShow: false,
                    reqHistoryList: [],
                    loading: false,
                    pageNum: 1,
                    currentPage: 1,
                    pageSize: 10,
                    total: 0,
                },
                versionDialog: {
                    isShow: false,
                    reqVersionList: [],
                    loading: false,
                    pageNum: 1,
                    currentPage: 1,
                    pageSize: 10,
                    total: 0,
                },
                addOrUpdateDialog: {isShow: false, requestMapping: new RequestMapping(), loading: false, selectLoading: false, decsList: [], decsVersionList:[]},
                decsGroup: {},
                messageEnums: messageEnums,
                rules: {
                    prodId: [
                        {required: true, message: '请输入产品id', trigger: 'blur'},
                    ],
                    requestMappingId: [
                        {required: true, message: '请输入请求ID', trigger: 'blur'},
                    ],
                    requestMappingDesc: [
                        {required: true, message: '请输入请求描述', trigger: 'blur'},
                    ],
                    decsId: [
                        {required: true, message: '请选择决策ID', trigger: 'change'},
                    ],
                    decsVersion: [
                        {required: true, message: '请选择决策版本', trigger: 'change'},
                    ],
                },

                // 搜索相关
                pageNum: 1,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                searchCon: "",
                requestMappingList:[new RequestMapping()],
                loading: false,
            }
        },

        mounted(){
            const query = this.$route.query;
            const prodId = query[rQueryEnums.PROD_ID.code];
            const decsGroupId = query[rQueryEnums.DECS_GROUP_ID.code];
            if (isEmpty(query[rQueryEnums.PROD_ID.code]) || isEmpty(query[rQueryEnums.DECS_GROUP_ID.code])) {
                this.$message({message: "URL参数异常", type: "error"});
                return
            }

            getDecsGroupById({prodId, decsGroupId}).then(res => {
                this.decsGroup = res.data.data;
                this.refreshPage();
            })
        },

        watch:{
        },

        methods: {
            searchDecsVersionList(){
                let that = this;
                that.addOrUpdateDialog.decsVersionList = [];
                if (isEmpty(this.addOrUpdateDialog.requestMapping.decsId)){
                    this.$message("请选择决策Id");
                    return
                }

                let param = {prodId: this.gConfig.prodId.value, decsId: this.addOrUpdateDialog.requestMapping.decsId};
                getTotalDecsVersionList(param).then(res=>{
                    if (isNotEmpty(res)) {
                        that.addOrUpdateDialog.decsVersionList = res.data.data.map(item => {
                            return {
                                key: item.decsVersion,
                                value: item.decsVersion,
                                label: `${item.decsVersion}[${item.decsName}]`,
                            }
                        })
                    } else {
                        that.addOrUpdateDialog.decsVersionList = [];
                    }
                })
            },

            getDecsListByFilter(query) {
                let that = this;
                let param = {prodId: this.gConfig.prodId.value, decsFilter: {decsId: query}};
                that.addOrUpdateDialog.selectLoading = true;
                queryDecsTotal(param).then(res => {
                    if (isNotEmpty(res)) {
                        that.addOrUpdateDialog.decsList = res.data.data.map(item => {
                            return {
                                key: item.decsId,
                                value: item.decsId,
                                label: `${item.decsId}[${item.decsName}]`,
                            }
                        })
                    } else {
                        that.addOrUpdateDialog.decsList = [];
                    }
                }).finally(()=>{
                    that.addOrUpdateDialog.selectLoading = false;
                })
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

            refreshPage() {
                let that = this;
                let params = {
                    prodId: that.gConfig.prodId.value,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    requestMappingFilter: {searchCon: that.searchCon, decsGroupId: that.decsGroup.decsGroupId}
                };
                that.loading = true;
                queryRequestMappingBase(params).then(res => {
                    that.total = res.data.data['total'];
                    that.requestMappingList = res.data.data['objectList'];
                    if (that.total > 0 && that.requestMappingList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },

            addBefore() {
                let that = this;
                const validateRequestMappingBaseId = (rule, value, callback) => {
                    const decsGroupId = that.decsGroup.decsGroupId;
                    const prodId = that.gConfig.prodId.value;
                    getRequestMappingBaseById({prodId: prodId, decsGroupId: decsGroupId, requestMappingBaseId: value}).then(res => {
                        if (res.data.data !== null) {
                            callback(new Error('id重复'))
                        } else {
                            callback();
                        }
                    });
                };
                this.rules.requestMappingId = [
                    {required: true, message: '请输入请求id', trigger: 'blur'},
                    {validator: validateSpChar, trigger: 'blur'},
                    {validator: validateChinese, trigger: 'blur'},
                    {validator: validateRequestMappingBaseId, trigger: 'blur'},
                ];
                this.addOrUpdateDialog.isShow = true;
                this.addOrUpdateDialog.type = 'add';
                this.$nextTick(() => {
                    this.addOrUpdateDialog.requestMapping = new RequestMapping({decsGroupId: this.decsGroup.decsGroupId})
                    this.$refs['reqMapForm'].clearValidate();
                });
            },

            addAfter(){
                let that = this;
                that.$refs.reqMapForm.validate((valid) => {
                    if (valid){
                        that.addOrUpdateDialog.loading = true;
                        addRequestMappingBase({prodId: that.gConfig.prodId.value, requestMappingBase : that.addOrUpdateDialog.requestMapping}).then(res=>{
                            that.addOrUpdateDialog.isShow = false;
                            that.$message({type: 'success', message: "保存成功"});
                            that.refreshPage();
                        }).finally(()=>{
                            that.addOrUpdateDialog.loading = false;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },

            editBefore(row){
                this.rules.requestMappingId = [
                    {required: true, message: '请输入请求id', trigger: 'blur'},
                    {validator: validateSpChar, trigger: 'blur'},
                    {validator: validateChinese, trigger: 'blur'},
                ];

                this.addOrUpdateDialog.isShow = true;
                this.addOrUpdateDialog.type = 'edit';
                this.$nextTick(() => {
                    Object.assign(this.addOrUpdateDialog.requestMapping, row);
                    this.$refs['reqMapForm'].clearValidate();
                });
            },

            editAfter(){
                let that = this;
                that.$refs.reqMapForm.validate((valid) => {
                    if (valid){
                        that.addOrUpdateDialog.loading = true;
                        updateRequestMappingBase({prodId: that.gConfig.prodId.value, requestMappingBase : that.addOrUpdateDialog.requestMapping}).then(res=>{
                            that.addOrUpdateDialog.isShow = false;
                            that.$message({type: 'success', message: "修改成功"});
                            that.refreshPage();
                        }).finally(()=>{
                            that.addOrUpdateDialog.loading = false;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },

            displayHistory(row){
                this.historyDialog.isShow = true;
                this.$nextTick(()=>{
                    this.$refs.reqHistory.setRequestMapping(row);
                    this.$refs.reqHistory.refreshPage();
                });
            },

            displayVersion(row){
                this.versionDialog.isShow = true;
                this.$nextTick(()=>{
                    this.$refs.reqVersion.setRequestMapping(row);
                    this.$refs.reqVersion.refreshPage();
                });
            },

            publicVersion(row) {
                let that = this;
                that.$confirm('确定要发布吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    const prodId = row.prodId;
                    const decsGroupId = row.decsGroupId;
                    const requestMappingId = row.requestMappingId;
                    publicRequestMappingBase({prodId, decsGroupId, requestMappingId}).then(res => {
                        this.$message({type: "success", message: "发布成功"});
                        that.refreshPage();
                    })
                }).catch(() => {});
            },

            deleteReq(row){
                let that = this;
                that.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    deleteRequestMappingBase({requestMappingBase: row}).then(res=>{
                        that.$message({type: "success", message: "删除成功"});
                        that.refreshPage();
                    })
                }).catch(() => {});
            },


            onlineReqVersion(row){

            }

        }
    }
</script>

<style scoped>
    #requestMapping{
        height: 100%;
        padding: 0 10px 0 10px;
        background-image: url('~@/assets/bg4.png');
        background-size: 100% 100%;
    }

</style>
