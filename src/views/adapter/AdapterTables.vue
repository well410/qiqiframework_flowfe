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

                </el-form-item>
            </el-form>
        </div>

        <div v-loading="loading" element-loading-background="#fff0">
            <div v-if="decsList.length!=0" v-show="decsList.length!=0" v-loading="loading">
                <div style="display: flex;flex-wrap: wrap; justify-content: space-between;min-height: 719px;">
                    <div  class="card-block" v-for="(o,index) in decsList" >
                        <el-card :body-style="{ padding: '0px' }">
                                <div slot="header" class="clearfix" >
                                    <div @click="decsFlowClick(o)" v-cmb-auth-remove="res.decsEdit.code">
                                        <div class="header-title">
                                            <div class="clearfix" style="width: 100%">
                                                <span style="width: 20%"> <svg-icon icon-class="ID" class="gray-bule-icon"></svg-icon></span>
                                                <el-tooltip class="item" effect="dark" :content="o.decsId" placement="bottom-end" popper-class="card-header-tooltips">
                                                    <span>{{o.decsId}}</span>
                                                </el-tooltip>
                                            </div>
                                            <div class="clearfix" style="width: 100%"><span style="width: 20%"> <svg-icon icon-class="name"  class="gray-bule-icon"></svg-icon></span>
                                                <el-tooltip class="item" effect="dark" :content="o.decsName" placement="bottom-end" popper-class="card-header-tooltips">
                                                    <span>{{o.decsName}}</span>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </div>



                                    <el-button type="text" @click="toDmsPage(o)">仪表盘</el-button>
                                </div>
                                <div class="showCite" @click="decsCitationClick(o)">
                                    <div v-cmb-auth-remove="res.decsCitation.code"></div>
                                    <div class="showCite-topHalf" style="display: flex;flex-wrap: wrap">
                                        <div class="showCite-space"></div>
                                        <div class="showCite-content" >
                                            <div class="citeShowFont">引用规则数：</div>
                                            <div class="citeShowCount" v-if="isCiteShow" >{{o.ruleCount}}</div>
                                            <div class="citeShowCount" style="color: #5a89b9" v-if="!isCiteShow">加载中...</div>
                                        </div>
                                        <div class="showCite-space"></div>
                                        <div class="showCite-content">
                                            <div class="citeShowFont">引用函数数：</div>
                                            <div class="citeShowCount" v-if="isCiteShow">{{o.funcCount}}</div>
                                            <div class="citeShowCount" style="color: #5a89b9" v-if="!isCiteShow">加载中...</div>
                                        </div>
                                        <div class="showCite-space"></div>
                                    </div>
                                    <div class="showCite-bottomHalf" style="display: flex;flex-wrap: wrap">
                                        <div class="showCite-space"></div>
                                        <div class="showCite-content">
                                            <div class="citeShowFont">引用组件数：</div>
                                            <div class="citeShowCount" v-if="isCiteShow">{{o.cmptCount}}</div>
                                            <div class="citeShowCount" style="color: #5a89b9" v-if="!isCiteShow">加载中...</div>
                                        </div>
                                        <div class="showCite-space"></div>
                                        <div class="showCite-content" >
                                            <div class="citeShowFont">引用变量数：</div>
                                            <div class="citeShowCount" v-if="isCiteShow">{{o.varCount}}</div>
                                            <div class="citeShowCount" style="color: #5a89b9" v-if="!isCiteShow">加载中...</div>
                                        </div>
                                        <div class="showCite-space"></div>
                                    </div>
                                </div>
                                <div class="bottom ">
                                    <div>
                                        <el-button class="icon-button" icon="el-icon-setting" size="mini" @click="decsFlowClick(o)" v-cmb-auth-remove="res.decsFlow.code" title="决策图" ></el-button>
                                        <el-button class="icon-button"  icon="el-icon-files" size="mini" @click="decsVersionClick(o)" v-cmb-auth-remove="res.decsVersion.code" title="版本"></el-button>
                                        <el-button class="icon-button"  icon="el-icon-document" size="mini" @click="decsHisClick(o)" v-cmb-auth-remove="res.decsHis.code" title="历史"></el-button>
                                    </div>
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
                <span>未查询到决策数据</span>
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


    import {DecsBase, DecsVersion} from "../../entity/decs";
    import {RuleBase} from "../../entity/rule";
    import {
        validateAJ,
        validateChinese, validateNullChar,
        validateSpChar,
        validateUpperChar, validateVarSpChar
    } from "../common";
    import {
        addDecs,
        deleteDecs,
        getDecsById,
        getDecsList,
        getDmsBaseUrl,
        queryDecsAndRuleList,
        queryDecsAndCiteCount,
        updateDecs, queryDecsCiteCount,
        importDecsVersion, addDecsByTemplate, getTemplateIdList
    } from "../../api/Decs";
    import {evVarParse} from "../../api/Utils";
    import DecsShow from "./adapter-components/AdapterShow";
    import {isEmpty, isNotEmpty, isContainEmpty} from "../../utils";
    import {DecsFilter, DecsFuzzyFilter} from "./index";
    import {getUUID} from "../../components";
    import {inteTypeEnums, statusEnums, tabType, tagType} from "../../entity/enumns";
    import {EVar} from "../../entity/vars";
    import * as ElementUI from "element-ui";
    import AviatorScriptCodemirror from "../../components/aviator-script-codemirror/aviator-script-codemirror";
    import {DecsImportDto, DecsUpdateDto} from "../../views/decs";
    import {RuleUpdateDto} from "../../views/rule"
    import {G6Model, GetRel, GetExistConfig} from "../../entity/g6Model";
    import {modifyTqsDs} from "../../api/TqsDatasource";
    import {queryDecsWithTemplate} from "../../api/Adapter";

    export default {
        name: "AdapterTables",
        components: {AviatorScriptCodemirror, DecsShow},
        data() {


            return {
                // 监控页面基础地址
                isNeedTemplate:'N',
                templateId:'',
                templateIdList:'',
                dmsBaseUrl:'',
                loading: false,
                isCiteShow:false,
                pageNum: 1,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                decsFilter: new DecsFilter(),
                isEmpty: isEmpty,
                isNotEmpty: isNotEmpty,
                varDialog: false,
                searchCon:"",
                // 字段映射的引用
                refFieldList: [],
                decsList: [],
                multiDecsRuleList:[],
                evVarList: [],
                tabType: tabType,
                tagType: tagType,
                add: {dialog: false, type: '', repeatId: false, decs: new DecsBase()},
                edit: {dialog: false, decs: new DecsBase()},

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
                decsImportDto: new DecsImportDto(),
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
                return 32 - `${this.gConfig.prodId.value}_decs_`.length
            }
        },


        mounted() {
            this.refreshPage();
            this.initDmsBaseUrl();
        },

        methods: {
            init() {

            },

            initDmsBaseUrl() {
                getDmsBaseUrl().then(res => {
                    this.dmsBaseUrl = res.data.data;
                })
            },
            //处理决策文件读取
            handleChange(res, file) {
                let that = this
                let reader = new FileReader();
                reader.onload  = function(event){
                     that.$refs.upload.abort();
                     that.$refs.upload.clearFiles();
                     that.decsImportBefore(event.target.result);
                }
                reader.readAsText(res.raw);
            },

            toDmsPage(decs){
                const dmsBaseUrl = this.dmsBaseUrl;
                const prodId = `${this.gConfig.prodId.value.toUpperCase()}.33`;
                const appId = `${prodId}_${decs.decsId.split("_").slice(2).join("")}`;
                if (dmsBaseUrl.lastIndexOf("/")){
                    window.open(`${dmsBaseUrl}${prodId}/${appId}`,"_blank")
                } else {
                    window.open(`${dmsBaseUrl}/${prodId}/${appId}`,"_blank")
                }
            },

            tohelperHome(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html',"_blank")
            },
            tohelperAdd(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html#新增',"_blank")
            },

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
                that.decsList = []
                that.multiDecsRuleList =[]
                let filterParams = {
                    searchCon: that.searchCon
                }
                let params = {
                    prodId: that.gConfig.prodId.value,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    decsFilter: new DecsFuzzyFilter(filterParams)
                };
                that.isCiteShow=false;
                that.loading = true;
                queryDecsWithTemplate(params).then(res => {
                    that.total = res.data.data['total'];
                    that.decsList=res.data.data['objectList'];
                    that.showCiteCount(that.decsList);
                    if (that.total > 0 && that.decsList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(res => {
                    that.loading = false;
                });
            },
            showCiteCount(decsList){
                let that=this;
                let decsListNew = decsList.map(item => {
                    return {decsId: item.decsId, prodId:item.prodId}
                });

                let prodId=that.gConfig.prodId.value;
                queryDecsCiteCount({prodId: prodId, decsList: decsListNew}).then(res => {
                    let citeCount = res.data.data;
                    for (let i = 0; i < that.decsList.length; i++) {
                        that.decsList[i].ruleCount = citeCount[0][i];
                        that.decsList[i].funcCount = citeCount[1][i];
                        that.decsList[i].cmptCount = citeCount[2][i];
                        that.decsList[i].varCount = citeCount[3][i];
                    }
                    that.isCiteShow = true;
                })

            },


            decsFlowClick(decs) {
                if(decs.inteType === 'S'){
                    let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/adapterManage/adapterInf?decsId=${decs.decsId}&tab=decsFlowG6`,"_blank")
                }else{
                    this.$router.push({path: this.childrenPath, query: {decsId: decs.decsId, tab: tabType.decsFlowG6, prodId: this.gConfig.prodId.value}});
                }
            },
            decsCodeClick(decs) {
                if(decs.inteType === 'S'){
                    let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/adapterManage/adapterInf?decsId=${decs.decsId}&tab=decsFlowG6`,"_blank")
                }else {
                    this.$router.push({path: this.childrenPath, query: {decsId: decs.decsId, tab: tabType.decsCode, prodId: this.gConfig.prodId.value}});
                }
            },
            decsHisClick(decs) {
                if(decs.inteType === 'S'){
                    let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/adapterManage/adapterInf?decsId=${decs.decsId}&tab=decsFlowG6`,"_blank")
                }else{
                    this.$router.push({path: this.childrenPath, query: {decsId: decs.decsId, tab: tabType.decsHis, prodId: this.gConfig.prodId.value}});
                }

            },
            decsCitationClick(decs) {
                if(decs.inteType === 'S'){
                    let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/adapterManage/adapterInf?decsId=${decs.decsId}&tab=DecsCitation`,"_blank")
                }else{
                    this.$router.push({path: this.childrenPath, query: {decsId: decs.decsId, tab: tabType.decsCitation, prodId: this.gConfig.prodId.value}});
                }

            },
            decsVersionClick(decs) {
                if(decs.inteType === 'S'){
                    let myWindow = window.open(`${decs.inteConf.mountUrl}/ui/adapterManage/adapterInf?decsId=${decs.decsId}&tab=decsFlowG6`,"_blank")
                }else{
                    this.$router.push({path: this.childrenPath, query: {decsId: decs.decsId, tab: tabType.decsVersion, prodId: this.gConfig.prodId.value}});
                }

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
