<template>
    <div class="table">
        <div class="tools" >
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
                        <span class="search-icon-container" @click="refreshPage" v-cmb-auth-remove="res.decsSearch.code">
                            <svg-icon icon-class="search"/>
                        </span>
                    </div>
                    <div class="tools-bar" style="margin-bottom: 8px;width: 80px;" >
                        <!--<div class="clearfix">
                            <a class="helpHome" @click="tohelperHome">帮助文档</a>
                        </div>-->
                        <div class="tools-button">
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="templateAddBefore"  v-cmb-auth-remove="res.decsAdd.code">
                                新增
                            </el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <div v-loading="loading" element-loading-background="#fff0">
            <div v-if="templateList.length!=0" v-show="templateList.length!=0" v-loading="loading">
                <div style="display: flex;flex-wrap: wrap; justify-content: space-between;min-height: 719px;">
                    <div  class="card-block" v-for="(o,index) in templateList" >
                        <el-card :body-style="{ padding: '0px' }">
                                <div slot="header" class="clearfix" >
                                    <div @click="templateFlowClick(o)" v-cmb-auth-remove="res.decsEdit.code">
                                        <div class="header-title">
                                            <div class="clearfix" style="width: 100%">
                                                <span style="width: 20%"> <svg-icon icon-class="ID" class="gray-bule-icon"></svg-icon></span>
                                                <el-tooltip class="item" effect="dark" :content="o.templateId" placement="bottom-end" popper-class="card-header-tooltips">
                                                    <span>{{o.templateId}}</span>
                                                </el-tooltip>
                                            </div>
                                            <div class="clearfix" style="width: 100%"><span style="width: 20%"> <svg-icon icon-class="name"  class="gray-bule-icon"></svg-icon></span>
                                                <el-tooltip class="item" effect="dark" :content="o.templateName" placement="bottom-end" popper-class="card-header-tooltips">
                                                    <span>{{o.templateName}}</span>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bottom ">
                                    <div>
                                        <el-button class="icon-button"  icon="el-icon-edit" size="mini" @click="templateEditBefore(o)" v-cmb-auth-remove="res.decsEdit.code" title="编辑"></el-button>
                                        <el-button class="icon-button" icon="el-icon-setting" size="mini" @click="templateFlowClick(o)" v-cmb-auth-remove="res.decsFlow.code" title="模板图" ></el-button>
                                        <el-button class="icon-button"  icon="el-icon-files" size="mini" @click="templateVersionClick(o)" v-cmb-auth-remove="res.decsVersion.code" title="版本"></el-button>
                                        <el-button class="icon-button"  icon="el-icon-document" size="mini" @click="templateHisClick(o)" v-cmb-auth-remove="res.decsHis.code" title="历史"></el-button>
                                        <el-button class="icon-button"  icon="el-icon-delete" size="mini" @click="templateDeleteClick(o)" v-cmb-auth-remove="res.decsDelete.code" title="删除"></el-button>
                                    </div>
<!--                                    <div>-->
<!--                                        <el-button class="icon-button"  icon="el-icon-files" size="mini" @click="templateVersionClick(o)" v-cmb-auth-remove="res.decsVersion.code" title="版本"></el-button>-->
<!--                                        <el-button class="icon-button"  icon="el-icon-document" size="mini" @click="templateHisClick(o)" v-cmb-auth-remove="res.decsHis.code" title="历史"></el-button>-->
<!--                                        <el-button class="icon-button"  icon="el-icon-delete" size="mini" @click="templateDeleteClick(o)" v-cmb-auth-remove="res.decsDelete.code" title="删除"></el-button>-->
<!--                                    </div>-->
                                </div>
                            </el-card>
                    </div>

                    <div  class="empty-card-block"> </div>
                    <div  class="empty-card-block"> </div>
                    <div  class="empty-card-block"> </div>
                    <div  class="empty-card-block"> </div>
                    <!--            </div>-->
                </div>
            </div>
            <div v-else class="no-data">
                <svg-icon icon-class="tree"/>
                <br/>
                <span>未查询到模板数据</span>
            </div>
        </div>

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


        <!--添加模板-->
        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="add.dialog" class="new-dialog">

            <el-form ref="addFrom" :model="add.template" :rules="addRules" label-width="100px" size="mini" class="dialog-elform">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="产品ID:" prop="prodId">
                            <el-input v-model="add.template.prodId" disabled style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="模板名称:" prop="templateName">
                            <el-input v-model.trim="add.template.templateName" placeholder="模板名称" style="width: 100%" maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="模板ID:" prop="templateId">
                            <el-input v-model.trim="add.template.templateId" placeholder="模板ID（由小写字母、数字、下划线组成）" style="width: 100%" :maxlength="computeMaxLength" show-word-limit>
                                <template slot="prepend">{{gConfig.prodId.value}}_template_</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>


            <template slot="footer">
                <el-button size="mini" @click="add.dialog = false">取消</el-button>
                <!--<el-button size="mini" type="success"
                           @click="parseClick('addFrom', add.template.analysisJson, add.template.inputExample)">解析
                </el-button>-->
                <el-button type="primary" size="mini" @click="templateAddAfter">确定</el-button>
            </template>
        </el-dialog>

        <!--编辑规则-->
        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="edit.dialog" class="new-dialog">
            <el-form ref="editFrom" :model="edit.template" :rules="editRules" label-width="100px" size="mini" class="dialog-elform">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="产品ID:" prop="prodId">
                            <el-input v-model="edit.template.prodId" disabled style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="模板ID:" prop="templateId">
                            <el-input disabled v-model.trim="edit.template.templateId" placeholder="模板Id（由小写字母、数字、下划线组成）" style="width: 100%"
                                      :maxlength="computeMaxLength" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="模板名称:" prop="templateName">
                            <el-input v-model.trim="edit.template.templateName" placeholder="模板名称" style="width: 100%" maxlength="50"
                                      show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>


            <template slot="footer">
                <el-button size="mini" @click="edit.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="templateEditAfter">确定</el-button>
            </template>
        </el-dialog>


    </div>
</template>

<script>
    //codemirror导入
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"
    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"
    import "codemirror/addon/lint/lint";
    import "codemirror/addon/lint/lint.css";
    import "codemirror/addon/lint/json-lint";
    import "../common/indexL.less"

    require("script-loader!jsonlint");


    import {TemplateBase} from "../../entity/template";
    import {
        validateChinese, validateNullChar,
        validateSpChar,
        validateUpperChar
    } from "../common";
    import {
        addTemplate,
        deleteTemplate,
        getTemplateById,
        updateTemplate, getTemplateList
    } from "../../api/Template";
    import {evVarParse} from "../../api/Utils";
    import TemplateShow from "./template-components/TemplateShow";
    import {isEmpty, isNotEmpty} from "../../utils";
    import {TemplateFilter, TemplateFuzzyFilter} from "./index";
    import {getUUID} from "../../components";
    import {inteTypeEnums, statusEnums, tabType, tagType} from "../../entity/enumns";
    import {EVar} from "../../entity/vars";
    import AviatorScriptCodemirror from "../../components/aviator-script-codemirror/aviator-script-codemirror";

    export default {
        name: "TemplateTables",
        components: {AviatorScriptCodemirror, TemplateShow},
        data() {
            const validateTemplateId = (rule, value, callback) => {
                getTemplateById({templateId: `${this.gConfig.prodId.value}_template_${value}`, prodId: this.gConfig.prodId.value}).then(res => {
                    if (res.data.data !== null) {
                        callback(new Error('id重复'))
                    } else {
                        callback();
                    }
                });
            };

            return {
                // 监控页面基础地址
                dmsBaseUrl:'',
                loading: false,
                pageNum: 1,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                templateFilter: new TemplateFilter(),
                isEmpty: isEmpty,
                isNotEmpty: isNotEmpty,
                varDialog: false,
                searchCon:"",
                // 字段映射的引用
                refFieldList: [],
                templateList: [],
                multiTemplateRuleList:[],
                evVarList: [],
                tabType: tabType,
                tagType: tagType,
                add: {dialog: false, template: new TemplateBase()},
                edit: {dialog: false, template: new TemplateBase()},
                addRules: {
                    prodId: [
                        {required: true, message: '请输入产品id', trigger: 'blur'},
                    ],
                    templateId: [
                        {required: true, message: '请输入模板id', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                        {validator: validateTemplateId, trigger: 'blur'},
                        {validator: validateSpChar, trigger: 'blur'},
                        {validator: validateChinese, trigger: 'blur'},
                        {validator: validateUpperChar, trigger: 'blur'}
                    ],

                    templateName: [
                        {required: true, message: '请输入模板名', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                    ]

                },
                editRules: {
                    prodId: [
                        {required: true, message: '请输入模板id', trigger: 'blur'},
                    ],
                    templateId: [
                        {required: true, message: '请输入模板id', trigger: 'blur'},
                    ],

                    templateName: [
                        {required: true, message: '请输入模板名', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                    ]

                },
                statusEnums: statusEnums,
                inteTypeEnums: inteTypeEnums,
                //codemirror配置
                ajKey: "default",
                ieKey: "default",
                cmOptions: {
                    //使用的语言
                    mode: 'application/json',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    // gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
                    showCursorWhenSelecting: true,
                    autofocus: false,
                    line: true,
                    indentWithTabs: true,
                    smartIndent: true,
                    //显示行号
                    lineNumbers: true,
                    //括号匹配
                    matchBrackets: true,
                },
            };
        },

        watch: {

        },

        computed: {
            childrenPath() {
                let router = this.$router.options.routes.filter(r => r.path === this.$route.path)[0];
                return this.$route.path + "/" + router.children[0].path;
            },


            computeMaxLength(){
                return 32 - `${this.gConfig.prodId.value}_template_`.length
            }
        },


        mounted() {
            this.refreshPage();
        },

        methods: {
            init() {

            },





            /*tohelperHome(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html',"_blank")
            },
            tohelperAdd(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html#新增',"_blank")
            },*/

            getMatchHref(){
                return window.location.href.match(/[a-zA-z]+\.cmbchina\.cn/g);
            },

            // 页面切换
            handleCurrentChange(val) {
                this.pageNum = val;
                this.currentPage = val;
                this.refreshPage();
            },

            handleSizeChange(val) {
                this.pageNum =1;
                this.pageSize = val;
                this.currentPage = 1;
                this.refreshPage();
            },

            //点击查看更多
            toggle(showStatus){
                return !showStatus
            },

            // 刷新页面
            refreshPage() {
                let that = this;
                that.templateList = []
                that.multiTemplateRuleList =[]
                let filterParams = {
                    searchCon: that.searchCon
                }
                let params = {
                    prodId: that.gConfig.prodId.value,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    templateBase: new TemplateFuzzyFilter(filterParams)
                };
                that.loading = true;
                getTemplateList(params).then(res => {
                    let resData = res.data;
                    let curTemplateList = resData.data['objectList'];
                    that.total = resData.data['total'];
                    that.templateList = curTemplateList;
                    console.log(that.templateList);
                    if (that.total > 0 && that.templateList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(res => {
                    that.loading = false;
                    console.log(that.templateList.length===0);
                });

            },

            //点击解析
            parseClick(fromType, aj, ie) {
                let that = this;
                function setEVarList(res){
                    let evVarList = res.data.data
                        .map(item => new EVar({varName: item.path, varDesc: item.desc, varType: item.type, varValue : item.value}));
                    that.evVarList = evVarList;
                }

                // 验证from表单
                that.$refs[fromType].validate((valid) => {
                    if (valid) {
                        evVarParse({analysisJson: aj, inputExample: ie}).then(res => {
                            if (res.data.code === "E501") {
                                that.$message({message: res.data.message, type: 'error'});
                            } else {
                                that.$message({message: "成功", type: 'success'});
                                setEVarList(res)
                            }
                        });
                        that.formatJson(fromType, JSON.parse(aj), JSON.parse(ie));
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 格式化json
            formatJson(fromType, analysisJson, inputExample) {
                let that = this;
                if (fromType === 'editFrom') {
                    that.edit.template.inputExample = JSON.stringify(inputExample, null, 4);
                    that.edit.template.analysisJson = JSON.stringify(analysisJson, null, 4);
                } else if (fromType === 'addFrom') {
                    that.add.template.inputExample = JSON.stringify(inputExample, null, 4);
                    that.add.template.analysisJson = JSON.stringify(analysisJson, null, 4);
                }
            },


            // 删除模板
            templateDeleteClick(template) {
                let that = this;
                this.$confirm('确定要删除该模板吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    deleteTemplate({templateId: template.templateId, prodId: this.gConfig.prodId.value}).then(res => {
                        if (that.templateList.length - 1 === 0) {
                            if (that.pageNum > 1) {
                                that.pageNum = that.pageNum - 1
                            }
                        }
                        //删除完后刷新页面
                        that.refreshPage();
                        let msg = "删除成功";
                        if (typeof(res.data.data ) !== "boolean") msg = res.data.data;
                        that.$message({message: msg, type: "success"})
                    });
                }).catch((e) => {
                    if (e!=="cancel") {
                        that.$message({type: 'info', message: `处理失败：${e}`});
                    }

                });
            },

            // 添加按钮点击，显示对话框
            templateAddBefore() {
                let that = this;
                that.add.dialog = true;
                that.$nextTick(()=>{
                    that.$refs['addFrom'].resetFields();
                    that.add.template = new TemplateBase();
                });

            },

            // 点击添加，添加模板
            templateAddAfter() {
                let that = this;
                this.$refs['addFrom'].validate((valid) => {
                    if (valid) {
                        let template = new TemplateBase(that.add.template);
                        template.templateId = `${this.gConfig.prodId.value}_template_${template.templateId}`;
                        addTemplate({template: template, prodId: this.gConfig.prodId.value}).then(res => {
                            that.add = {dialog: false, template: new TemplateBase()};
                            that.refreshPage();

                            let msg = "添加成功";
                            if (typeof(res.data.data ) !== "boolean") msg = res.data.data;
                            that.$message({message: msg, type: "success"})
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 编辑编辑，修改模板
            templateEditAfter() {
                let that = this;
                this.$refs['editFrom'].validate((valid) => {
                    if (valid) {
                        updateTemplate({
                            prodId: that.gConfig.prodId.value,
                            templateId: that.edit.template.templateId,
                            templateUpdateDto: {templateBase: that.edit.template}
                        }).then(res => {
                            that.$message({message: '成功', type: 'success'});
                            that.edit = {dialog: false, template: new TemplateBase()};
                            that.refreshPage();
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 编辑模板按钮点击
            templateEditBefore(template) {
                let that = this;
                that.edit.dialog = true;
                getTemplateById({templateId: template.templateId, prodId: template.prodId}).then((res) => {
                    that.$nextTick(()=>{
                        that.$refs['editFrom'].resetFields();
                        that.edit.template = new TemplateBase(res.data.data);
                        let matchHref = that.getMatchHref();
                        if (isEmpty(matchHref)) {
                            console.warn("当前网址不是*.cmbchina.cn类型");
                            that.edit.template.inteConf.uri = `http://${that.edit.template.templateId.replace(/\_/g, "-")}.tcstemplate.paas.cmbchina.cn/exec`.toLowerCase()
                        } else {
                            that.edit.template.inteConf.uri = `http://${that.edit.template.templateId.replace(/\_/g, "-")}.tcstemplate.${matchHref[0].split(".")[0]}.cmbchina.cn/exec`.toLowerCase()
                            console.log(that.edit)
                        }

                        that.evVarList = [];
                        that.ajKey = getUUID();
                        that.ieKey = getUUID();
                    });
                });
            },

            templateRuleSettingEditClick(template) {
                this.$router.push({
                    path: this.childrenPath,
                    // query: {templateId: template.templateId, tab: tabType.templateRuleSetting}
                    query: {templateId: template.templateId, tab: tabType.templateFlowG6} // 074389 模板设置页面不显示，跳转到G6流程图页面
                });
            },
            templateFlowClick(template) {
                this.$router.push({path: this.childrenPath, query: {templateId: template.templateId, tab: tabType.templateFlowG6, prodId: this.gConfig.prodId.value}});
            },
            templateCodeClick(template) {
                if(template.inteType === 'S'){
                    let myWindow = window.open(`${template.inteConf.mountUrl}/ui/templateManage/templateInf?templateId=${template.templateId}&tab=templateFlowG6`,"_blank")
                }else {
                    this.$router.push({path: this.childrenPath, query: {templateId: template.templateId, tab: tabType.templateCode, prodId: this.gConfig.prodId.value}});
                }
            },
            templateHisClick(template) {
                if(template.inteType === 'S'){
                    let myWindow = window.open(`${template.inteConf.mountUrl}/ui/templateManage/templateInf?templateId=${template.templateId}&tab=templateFlowG6`,"_blank")
                }else{
                    this.$router.push({path: this.childrenPath, query: {templateId: template.templateId, tab: tabType.templateHis, prodId: this.gConfig.prodId.value}});
                }

            },

            templateVersionClick(template) {
                if(template.inteType === 'S'){
                    let myWindow = window.open(`${template.inteConf.mountUrl}/ui/templateManage/templateInf?templateId=${template.templateId}&tab=templateFlowG6`,"_blank")
                }else{
                    this.$router.push({path: this.childrenPath, query: {templateId: template.templateId, tab: tabType.templateVersion, prodId: this.gConfig.prodId.value}});
                }

            },

            connectRuleClick(rule){
                this.$router.push({path: "/ui/ruleManage/ruleInf", query: {ruleId: rule.ruleId, tab: tabType.ruleFlowG6, routerPath:'/ui/templateManage' , prodId: this.gConfig.prodId.value}});
            },



        },
    }
</script>

<style scoped>
    .table{
        height: 100%;
        padding: 0 10px 0 10px;
        background-image: url('~@/assets/bg4.png');
        background-size: 100% 100%;
    }

</style>
