<template>
    <!--规则表格，所有产品下规则的信息-->
    <div id="ruleTables">
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
                        <span class="search-icon-container" @click="refreshPage" v-cmb-auth-remove="res.ruleSearch.code">
                            <svg-icon icon-class="search"/>
                        </span>
                    </div>
                    <div class="tools-bar" style="margin-bottom: 8px ;width: 240px;">
                        <div class="clearfix">
                            <a class="helpHome" @click="tohelperHome">帮助文档</a>
                        </div>
                        <div class="tools-button">
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="ruleAddBefore"
                                       v-cmb-auth-remove="res.ruleAdd.code">
                                新增
                            </el-button>
                            <el-button type="success" size="mini" @click="multiPublicClick"
                                       v-cmb-auth-remove="res.ruleAdd.code">
                                <svg-icon icon-class="puton"/>
                                启用
                            </el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>



        <!--规则列表-->
        <div v-loading="loading" element-loading-background="#fff0">
            <div v-if="ruleList.length!=0"  v-show="ruleList.length!=0" v-loading="loading">
                <el-checkbox-group v-model="checkList">
                    <div style="display: flex;flex-wrap: wrap; justify-content: space-between;; min-height: 719px">
                        <div  class="card-block" v-for="(o,index) in ruleList" >
                            <el-checkbox :label="o">
                                <el-card :body-style="{ padding: '0px' }">
                                    <div slot="header" class="clearfix">
                                        <div @click="ruleFlowClick(o)">
                                            <div class="header-title">
                                                <div class="clearfix" style="width: 100%">
                                                    <span style="width: 20%"> <svg-icon icon-class="ID" class="gray-bule-icon"></svg-icon></span>
                                                    <el-tooltip class="item" effect="dark" :content="o.ruleId" placement="bottom-end" popper-class="card-header-tooltips">
                                                        <span>{{o.ruleId}}</span>
                                                    </el-tooltip>
                                                </div>
                                                <div class="clearfix" style="width: 100%"><span style="width: 20%"> <svg-icon icon-class="name"  class="gray-bule-icon"></svg-icon></span>
                                                    <el-tooltip class="item" effect="dark" :content="o.ruleName" placement="bottom-end" popper-class="card-header-tooltips">
                                                        <span>{{o.ruleName}}</span>
                                                    </el-tooltip>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <el-tag class="card-status" v-if="isNotEmpty(statusEnums[isRulePublishInDecsBase(o.ruleId)])"
                                                    :type="tagType[isRulePublishInDecsBase(o.ruleId)]">
                                                {{statusEnums[isRulePublishInDecsBase(o.ruleId)].name}}
                                            </el-tag>
                                        </div>
                                        <!--<el-button class="icon-button" type="danger" icon="el-icon-delete" size="mini"
                                                   @click="ruleDeleteClick(o)" v-cmb-auth-remove="res.ruleDelete.code">
                                        </el-button>-->
                                    </div>
                                    <div class="tag-content">
                                        <el-tag type="success">{{returnActiveRuleVersion(o.ruleId)}}</el-tag>
                                    </div>
                                    <div class="showCite" @click="ruleCitationClick(o)">
                                        <div v-cmb-auth-remove="res.ruleCitation.code"></div>
                                        <div class="showCite-topHalf" style="display: flex;flex-wrap: wrap">
                                            <div class="showCite-space"></div>
                                            <div class="showCite-content" >
                                                <div class="citeShowFont">引用规则数：</div>
                                                <div class="citeShowCount" v-if="isCiteShow">{{o.ruleCount}}</div>
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
                                                <div class="citeShowFont">被决策引用数：</div>
                                                <div class="citeShowCount" v-if="isCiteShow">{{o.decsCount}}</div>
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
                                        <el-button class="icon-button" type="primary" icon="el-icon-edit" size="mini"
                                                   @click="ruleEditBefore(o)" v-cmb-auth-remove="res.ruleEdit.code" title="编辑" style="padding: 15px 6.3%;"></el-button>

                                        <el-button class="icon-button" type="success" icon="el-icon-setting" size="mini"
                                                   @click="ruleFlowClick(o)" v-cmb-auth-remove="res.ruleFlow.code" title="规则图" style="padding: 15px 6.3%;"></el-button>

                                        <el-button class="icon-button" type="danger" icon="el-icon-files" size="mini"
                                                   @click="ruleVersionClick(o)" v-cmb-auth-remove="res.ruleVersion.code" title="版本" style="padding: 15px 6.3%;"></el-button>

                                        <el-button class="icon-button" type="danger" icon="el-icon-delete" size="mini"
                                                   @click="ruleDeleteClick(o)" v-cmb-auth-remove="res.ruleDelete.code" title="删除" style="padding: 15px 6.3%;">
                                        </el-button>
                                    </div>

                                </el-card>
                            </el-checkbox>
                        </div>

                        <div  class="empty-card-block"> </div>
                        <div  class="empty-card-block"> </div>
                        <div  class="empty-card-block"> </div>
                        <div  class="empty-card-block"> </div>
                        <!--            </div>-->
                    </div>
                </el-checkbox-group>
            </div>
            <div v-else class="no-data">
                <svg-icon icon-class="tree_role"/>
                <br/>
                <span>未查询到规则数据</span>
            </div>
        </div>

        <div class="page-block clearfix">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 30, 60, 100]"
                    :current-page=currentPage
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>


        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="isExtTableShow" class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">启用规则
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i>
                    </div>
                </div>
            </div>
            <el-form ref="online"  label-width="80px" size="mini" class="dialog-elform">
                <el-row>
                    <template>
                        <ext-rule-v2-edit :decisionTree="getDecisionTree"
                                          :node="nodeWithVar.node"
                                          :p-decs="pDecs"
                                          ref="extRule"
                                          :ext-rule-input-var-list="extRuleInputVarList"></ext-rule-v2-edit>
                    </template>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button size="mini" @click="descUpdate">启用</el-button>
            </template>
        </el-dialog>


        <!--新增规则-->
        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="add.dialog" class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">添加规则
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i>
                    </div>
                </div>
            </div>
            <el-form ref="addFrom" :model="add.rule" :rules="addRules" label-width="80px" size="mini" class="dialog-elform">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="8">
                        <el-form-item label="产品ID:" prop="prodId">
                            <el-input v-model="add.rule.prodId" disabled style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="17" :xl="16">
                        <el-form-item label="规则ID:" prop="ruleId">
                            <el-input v-model.trim="add.rule.ruleId" placeholder="规则ID（英文并不包括特殊字符）" style="width: 100%" :maxlength="computeMaxLength"
                                      show-word-limit>
                                <template slot="prepend">{{gConfig.prodId.value}}_rule_</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="规则名称:" prop="ruleName">
                            <el-input v-model.trim="add.rule.ruleName" placeholder="规则名称" style="width: 100%" maxlength="50"
                                      show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="clearfix"  v-show='false'>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">解析报文格式</div>
                        <el-form-item prop="analysisJson" class="line-label-item">
                            <codemirror v-model="add.rule.analysisJson" :options="cmOptions"
                                        style="line-height:20px;z-index: 10000"></codemirror>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">输入报文示例</div>
                        <el-form-item prop="inputExample" class="line-label-item">
                            <codemirror v-model="add.rule.inputExample" :options="cmOptions"
                                        style="line-height:20px;z-index: 10000"></codemirror>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item v-if="isNotEmpty(riVarList)">
                    <el-table
                            ref="multipleTable"
                            :data="riVarList"
                            tooltip-effect="dark"
                            stripe
                            border
                            size="mini"
                            max-height="500px"
                            style="width: 100%">
                        <el-table-column prop="varName" label="变量名"></el-table-column>
                        <el-table-column prop="varType" label="变量类型"></el-table-column>
                        <el-table-column prop="varDesc" label="变量描述"></el-table-column>
                        <el-table-column prop="varValue" label="字段值"></el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>

            <template slot="footer">
                <el-button size="mini" @click="add.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="ruleAddAfter">确定</el-button>
            </template>
        </el-dialog>



        <!--编辑规则-->
        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="edit.dialog" class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">编辑规则
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i></div>
                </div>
            </div>
            <el-form ref="editFrom" :model="edit.rule" :rules="editRules" label-width="100px" size="mini" class="dialog-elform">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                        <el-form-item label="产品ID:" prop="prodId">
                            <el-input v-model="edit.rule.prodId" disabled style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
                        <el-form-item label="规则ID:" prop="ruleId">
                            <el-input disabled v-model.trim="edit.rule.ruleId" placeholder="规则Id（英文并不包括特殊字符）" style="width: 100%"
                                      :maxlength="computeMaxLength" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="规则名称:" prop="ruleName" class="mini-bottom-item">
                            <el-input v-model.trim="edit.rule.ruleName" placeholder="规则名称" style="width: 100%" maxlength="50"
                                      show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <template>
                        <ext-rule-v2-edit :decisionTree="getDecisionTree"
                                          :node="nodeWithVar.node"
                                          :adapter-rule-id="edit.rule.ruleId"
                                          :p-decs="pDecs"
                                          ref="extRuleEdit"
                                          :ext-rule-input-var-list="extRuleInputVarList"></ext-rule-v2-edit>
                    </template>
                </el-row>
                <el-form-item v-if="isNotEmpty(riVarList)">
                    <el-table
                            ref="multipleTable"
                            :data="riVarList"
                            tooltip-effect="dark"
                            stripe
                            border
                            size="mini"
                            max-height="500px"
                            style="width: 100%">
                        <el-table-column prop="varName" label="变量名"></el-table-column>
                        <el-table-column prop="varType" label="变量类型"></el-table-column>
                        <el-table-column prop="varDesc" label="变量描述"></el-table-column>
                        <el-table-column prop="varValue" label="字段值"></el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>

            <template slot="footer">
                <el-button size="mini" @click="edit.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="ruleEditAfter">确定</el-button>
            </template>
        </el-dialog>

        <!--        查看变量-->
        <el-dialog width="50%" heigh="95%" :visible.sync="varEditFlag"
                   :close-on-click-modal="false" class="text-font-family new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{dialogTitle}}
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i></div>
                </div>
            </div>
            <var-show
                    :dialogTitle="dialogTitle"
                    :dialogFormVisible="varEditFlag"
                    :varData="addAndEditVarData"
                    ref="editRef"
            >
            </var-show>
        </el-dialog>


    </div>
</template>

<script>
    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"
    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"
    import "codemirror/addon/lint/lint";
    import "codemirror/addon/lint/lint.css";
    import "codemirror/addon/lint/json-lint";
    import "../../common/indexL.less"
    import VarShow from "../../../components/vars/var-show.vue";

    require("script-loader!jsonlint");

    import {RuleBase, RuleWithAdapter} from "../../../entity/rule";
    import {
        validateChinese, validateNullChar,
        validateSpChar,
    } from "../../common";
    import {
        deleteRule, getDatasourceById,
        getRuleById,
        updateRuleBase, queryRuleCiteCount, addRuleBaseWithAdapter, updateRuleBaseWithAdapter
    } from "../../../api/Rule";
    import RuleShow from "../../rule/rule-components/RuleShow";
    import {isNotEmpty,isEmpty} from "../../../utils";
    import {getUUID} from "../../../components";
    import {compEnums, rQueryEnums, statusEnums, tabType, tagType} from "../../../entity/enumns";
    import {EVar, PreVar, RIVar, ROVar, VarBase} from "../../../entity/vars";
    import {evVarParse} from "../../../api/Utils";
    import {
        isDate,
        isFloat,
        isInt,
        isString,
        RuleFilter,
        RuleFuzzyFilter,
        RuleUpdateDto} from "../../rule/index";
    import {deleteRuleWithAdapter, queryRuleAndCiteCountWithDecs} from "../../../api/Adapter";
    import {AdapterDecsBaseDto, DecsBase, DecsVersion, DecsWithExtRuleBaseList} from "../../../entity/decs";
    import {NodeWithVars} from "../../../entity/template";
    import ExtRuleV2Edit from "../../../components/ext-rule-node/v2/ExtRuleV2Edit";
    import {getDecsRuleList, getDecsVersionActive, getRuleListByDecsId, updateDecs} from "../../../api/Decs";
    import {G6Model, GetRel,GetExistConfig} from "../../../entity/g6Model";
    import {DecsUpdateDto} from "../../decs";
    import {savePublishDecsByAdapter, savePublishDecsByTemplate} from "../../../api/Template";
    import {
        AdapterRuleUpdateDto,
        checkOfflineSelectedAdapterRuleList,
        checkPublishSelectedAdapterRuleList
    } from "../index";
    import {modifyTqsDs} from "../../../api/TqsDatasource";

    export default {
        name: "AdapterRuleTables",
        props: {
            pDecs: DecsBase,
            nodeWithVar: {default: () => {}, type: NodeWithVars}
        },
        components: {RuleShow,VarShow,ExtRuleV2Edit},
        data() {
            // 验证规则id是否重复
            const validateRuleId = (rule, value, callback) => {
                getRuleById({ruleId: `${this.gConfig.prodId.value}_rule_${value}`, prodId: this.gConfig.prodId.value}).then(res => {
                    if (res.data.data !== null) {
                        callback(new Error('id重复'))
                    } else {
                        callback();
                    }
                });
            };

            function varsTypeIsError(aj, ie) {
                let ruleVarList = [];
                let inputExample = {};
                try {
                    ruleVarList = JSON.parse(aj);
                    inputExample = JSON.parse(ie);
                } catch (e) {
                    console.warn("解析json或输入示例解析失败")
                }

                function isCallBack(ruleVar, str) {
                    let result = "";
                    switch (ruleVar.ruleVarType) {
                        case "Double":
                            if (!isFloat(str)) result = `输入示例${ruleVar.ruleVarName}不是${ruleVar.ruleVarType}类型，例子：6.66`;
                            break;
                        case "Timestamp":
                            if (!isDate(str)) result = `输入示例${ruleVar.ruleVarName}不是${ruleVar.ruleVarType}类型，例子：2020-02-02 12:12:12.000000`;
                            break;
                        case "Integer":
                            if (!isInt(str)) result = `输入示例${ruleVar.ruleVarName}不是${ruleVar.ruleVarType}类型，例子：66`;
                            break;
                        case "String":
                            if (!isString(str)) result = `输入示例${ruleVar.ruleVarName}不是${ruleVar.ruleVarType}类型，例子："example"`;
                            break;
                    }
                    return result;
                }

                for (let index = 0; index < ruleVarList.length; index++) {
                    let str = inputExample[ruleVarList[index].ruleVarName];
                    if (isNotEmpty(str)) {
                        let result = isCallBack(ruleVarList[index], str);
                        if (isNotEmpty(result)) {
                            return result;
                        }
                    }
                }
                return "";
            }

            const validateVarsTypeE = (rule, value, callback) => {
                let vResult = varsTypeIsError(this.edit.rule.analysisJson, value);
                if (isNotEmpty(vResult)) {
                    callback(vResult);
                } else {
                    callback();
                }
            };

            const validateVarsTypeA = (rule, value, callback) => {
                let vResult = varsTypeIsError(this.add.rule.analysisJson, value);
                if (isNotEmpty(vResult)) {
                    callback(vResult);
                } else {
                    callback();
                }
            };

            return {
                // 引用的函数或配置
                pDecsLocal:new DecsBase,
                decsVersionActive: new DecsVersion(),
                isNotEmpty: isNotEmpty,
                isEmpty: isEmpty,
                isCiteShow:false,
                isExtTableShow:false,
                tabType: tabType,
                tagType: tagType,
                statusEnums: statusEnums,
                loading: false,
                pageNum: 1,
                pageSize: 10,
                currentPage:1,
                total: 0,
                ruleFilter: new RuleFilter(),
                riVarList: [],
                ruleConVarList:[],
                checkList: [],
                searchCon:"",
                dialogTitle: '',
                datasoueceSelectNameShow: '',
                addAndEditVarData: new VarBase(),
                varEditFlag: false,
                add: {dialog: false, rule: new RuleBase()},
                edit: {dialog: false, rule: new RuleBase()},
                compEnums: compEnums,
                relVar: {eVarList: [], preVarList: [], roVarList: [], tVarList: []},
                addRules: {
                    prodId: [
                        {required: true, message: '请输入产品id', trigger: 'blur'},
                    ],
                    ruleId: [
                        {required: true, message: '请输入规则id', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                        {validator: validateRuleId, trigger: 'blur'},
                        {validator: validateSpChar, trigger: 'blur'},
                        {validator: validateChinese, trigger: 'blur'},

                    ],
                    ruleName: [
                        {required: true, message: '请输入规则名', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                        // {validator: validateSpChar, trigger: 'blur'},
                    ]
                },
                editRules: {
                    prodId: [
                        {required: true, message: '请输入产品id', trigger: 'blur'},
                    ],
                    ruleId: [
                        {required: true, message: '请输入规则id', trigger: 'blur'},
                    ],
                    ruleName: [
                        {required: true, message: '请输入规则名', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                        // {validator: validateSpChar, trigger: 'blur'},
                    ]
                },
                ruleList: [],
                // 设置codemirror的key值，修改key值可以使得元素强制刷新
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
            }
        },
        created() {
            this.$nextTick(()=>{

                // this.refreshPage();
            })
        },

        mounted(){
            let that = this;
            that.refreshPage();
        },

        computed: {
            childrenPath() {
                let router = this.$router.options.routes.filter(r => r.path === this.$route.path)[0];
                return this.$route.path + "/" + router.children[0].path;
            },
            computeMaxLength(){
                return 32 - `${this.gConfig.prodId.value}_rule_`.length
            },
            // 规则节点输入（可以映射的变量）
            extRuleInputVarList(){
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },

            getDecisionTree(){
                let that=this;
                let result={
                    default: () => {
                    }, type: Object
                };
                if (that.pDecs!==undefined&&that.pDecs.ruleJson!==undefined) {
                    result=JSON.parse(that.pDecs.ruleJson);}
                return result;
            },

        },

        methods: {
            init() {
                try {
                    let that = this;
                    let paramsVersion = {prodId: this.gConfig.prodId.value, decsId: that.pDecs.decsId};
                    getDecsVersionActive(paramsVersion).then(res=>{
                        that.decsVersionActive = res.data.data
                    });
                    // 1 初始化变量
                    that.initVarList();
                } catch (e) {
                    console.error("AdapterRuleTables初始化失败", e)
                }
            },
            tohelperHome(){
                window.open(this.helper.helpUri.uri+'/modules/decision/2.html',"_blank")
            },
            tohelperAdd(){
                window.open(this.helper.helpUri.uri+'/modules/decision/2.html#新增',"_blank")
            },

            returnActiveRuleVersion(ruleId){
                let that = this;
                let result='无版本运行';
                if (that.decsVersionActive===undefined||that.decsVersionActive===null||that.decsVersionActive.ruleJson===undefined) {
                    return result
                }
                that.decsDecisionTree=JSON.parse(that.decsVersionActive.ruleJson);
                let nodes=that.decsDecisionTree.nodes;
                nodes.forEach(node=>{
                    if (node.nData.uniqueName===that.nodeWithVar.node.nData.uniqueName) {
                        let extRuleList=node.nData.extRuleList.filter(item => item.ruleId === ruleId);
                        result=isNotEmpty(extRuleList)?extRuleList[0].ruleVersion:'无版本运行';
                    }
                });
                return result;
            },


            isRulePublishInDecsBase(ruleId){
                let that = this;
                if (that.nodeWithVar.node.nData.extRuleList===undefined){that.nodeWithVar.node.nData.extRuleList=[]};
                if (isNotEmpty(that.nodeWithVar.node.nData.extRuleList.filter(item => item.ruleId === ruleId && item.ruleVersion!==""  && item.ruleVersion!==null&& item.ruleVersion!==undefined))
                    &&(that.nodeWithVar.node.nData.rivVarListMap!==undefined)&&
                        isNotEmpty(Object.keys(that.nodeWithVar.node.nData.rivVarListMap).filter(id => {//获取入参映射所有的key列表
                            if (id===ruleId){//判断是否是当前这个需要被判断状态的规则
                                let rivVarMapList=that.nodeWithVar.node.nData.rivVarListMap[id];//拿到这个规则的入参映射关系
                                return isNotEmpty(rivVarMapList.filter(rivVarMap=>(rivVarMap['mapField']!==''&&rivVarMap['mapField']!==undefined)))//判断返回这个规则的rivVarMap中是不是存在不为空的mapField值，只要有就说明用户操作过映射关系
                            }
                            return false;
                        }))
                ){
                    return "YY"
                }else {
                    return "WY"
                }
            },

            replaceNodeByDecs(){
                let that = this;
                let decs={};
                let prodIdList={};
                Object.assign(decs,that.pDecs);
                Object.assign(prodIdList,that.nodeWithVar.node.nData.prodIdList);

                that.decsDecisionTree=JSON.parse(decs.ruleJson);
                let nodes=that.decsDecisionTree.nodes;
                nodes.forEach(tmp=>{
                    if (tmp.nData.uniqueName===that.nodeWithVar.node.nData.uniqueName) {
                        Object.assign(that.nodeWithVar.node,tmp);
                        that.nodeWithVar.node.nData.prodIdList=prodIdList;
                    }
                });
            },

            parseClick(fromType, aj, ie) {
                let that = this;
                function setRIVarList(res){
                    let riVarList = res.data.data
                        .map(item => new RIVar({
                            varName: item.path,
                            varDesc: item.desc,
                            varType: item.type,
                            varValue: item.value
                        }));
                    that.riVarList = riVarList;
                }

                that.$refs[fromType].validate((valid) => {
                    if (valid) {
                        evVarParse({analysisJson: aj, inputExample: ie}).then(res => {
                            if (res.data.code === "E501") {
                                that.$message({message: res.data.message, type: 'error'});
                            } else {
                                that.$message({message: "成功", type: 'success'});
                                setRIVarList(res)
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
                    that.edit.rule.inputExample = JSON.stringify(inputExample, null, 4);
                    that.edit.rule.analysisJson = JSON.stringify(analysisJson, null, 4);
                } else if (fromType === 'addFrom') {
                    that.add.rule.inputExample = JSON.stringify(inputExample, null, 4);
                    that.add.rule.analysisJson = JSON.stringify(analysisJson, null, 4);
                }
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

            // 分页查询页面
            refreshPage() {
                let that = this;
                
                let paramsVersion = {prodId: this.gConfig.prodId.value, decsId: that.pDecs.decsId};
                getDecsVersionActive(paramsVersion).then(res=>{
                    that.decsVersionActive = res.data.data
                });
                let filterParams = {
                    searchCon: that.searchCon
                };
                console.log(that.pageSize)
                let params = {
                    prodId: that.gConfig.prodId.value,
                    decsId: that.pDecs.decsId,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    nodeId: that.nodeWithVar.node.nData.uniqueName,
                    ruleFilter: new RuleFuzzyFilter(filterParams)
                };
                that.isCiteShow=false;
                that.loading = true;

                queryRuleAndCiteCountWithDecs(params).then(res =>{
                    that.total =  res.data.data['total'];
                    that.ruleList=res.data.data['objectList'];
                    that.showCiteCount(that.ruleList);
                    if (that.total > 0 && that.ruleList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },
            showCiteCount(ruleList){
                let that=this;
                let prodId=that.gConfig.prodId.value;
                let ruleListNew=ruleList.map(item=>{
                    return {prodId: item.prodId,ruleId:item.ruleId};
                });
                queryRuleCiteCount({prodId:prodId,ruleList:ruleListNew}).then(res => {
                    let citeCount=res.data.data;
                    for (let i=0;i<that.ruleList.length;i++){
                        that.ruleList[i].ruleCount=citeCount[0][i];
                        that.ruleList[i].funcCount=citeCount[1][i];
                        that.ruleList[i].decsCount=citeCount[2][i];
                        that.ruleList[i].varCount=citeCount[3][i];
                    }
                    that.isCiteShow=true;
                })
            },
            // 规则编辑准备
            ruleEditBefore(rule) {
                let that = this;
                that.edit.dialog = true;
                getRuleById({ruleId: rule.ruleId, prodId: rule.prodId}).then((res) => {
                    that.$nextTick(()=>{
                        that.$refs['editFrom'].resetFields();
                        that.edit.rule =  new RuleBase(res.data.data);
                        that.riVarList = [];
                        that.ajKey = getUUID();
                        that.ieKey = getUUID();
                        if (isNotEmpty(that.$refs.extRuleEdit)) {
                            that.$refs.extRuleEdit.init();
                            if (isEmpty(that.nodeWithVar.node.nData.extRuleList.filter(item => item.ruleId === that.edit.rule.ruleId))){
                                that.$refs.extRuleEdit.extRuleSelAfter(that.edit.rule);
                            }
                        };
                    });
                })

            },

            // 规则编辑，修改规则信息
            ruleEditAfter() {
                let that = this;
                let decs = new DecsBase(JSON.parse(JSON.stringify(that.pDecs)));
                decs.ruleJson=that.replaceNodesInRuleJson(decs.ruleJson,that.nodeWithVar.node);
                decs.ruleDrl = G6Model.getDrlCode(decs.ruleJson, decs);
                // 将json对象转换为字符串
                decs.ruleJson=JSON.stringify(decs.ruleJson);
                that.$refs['editFrom'].validate((valid) => {
                    if (valid) {
                        let adapterRuleUpdateDto = new AdapterRuleUpdateDto({
                            ruleBase: that.edit.rule,
                            decsBase: decs
                        });
                        updateRuleBaseWithAdapter({
                            prodId:this.gConfig.prodId.value,
                            adapterRuleUpdateDto: adapterRuleUpdateDto,
                            ruleId: that.edit.rule.ruleId
                        }).then(res => {
                            that.$message({message: '成功', type: 'success'});
                            that.edit.dialog = false;
                            that.refreshPage();
                            Object.assign(that.pDecs, res.data.data);
                            that.nodeWithVar.node=that.updateNodeWithVars(that.pDecs.ruleJson,that.nodeWithVar.node.nData.uniqueName);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                that.checkList = [];
            },


            // 规则新增准备
            ruleAddBefore() {
                let that = this;
                that.add.dialog = true;
                that.$nextTick(()=>{
                    that.$refs['addFrom'].resetFields();
                    that.add.rule = new RuleBase();
                    that.riVarList = [];
                });
            },

            // 规则新增准备
            rulePublishBefore() {
                let that = this;
                that.isExtTableShow = true;
                that.$nextTick(()=>{
                    this.$refs.extRule.init();
                });
            },

            // 规则新增，发送请求，新增规则
            ruleAddAfter() {
                let that = this;
                that.$refs['addFrom'].validate((valid) => {
                    if (valid) {
                        let ruleWithAdapter = new RuleWithAdapter(that.add.rule);
                        ruleWithAdapter.ruleId = `${this.gConfig.prodId.value}_rule_${ruleWithAdapter.ruleId}`;
                        ruleWithAdapter.totalVar=JSON.stringify(that.nodeWithVar.totalVar);
                        ruleWithAdapter.decsId=that.pDecs.decsId;
                        addRuleBaseWithAdapter({ruleBaseWithVars: ruleWithAdapter, prodId: this.gConfig.prodId.value,
                            nodeId: that.nodeWithVar.node.nData.uniqueName}).then(res => {

                            that.add.dialog = false;
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

            /**
             * 批量发布
             */ async multiPublicClick() {
                let selectData = this.checkList
                let that = this;
                if (checkPublishSelectedAdapterRuleList(selectData, that)) {
                    let decs = new DecsBase(JSON.parse(JSON.stringify(that.pDecs)));
                    let ruleIds = selectData.map(ruleBase => {
                        return ruleBase.ruleId
                    });
                    let extRuleList = that.nodeWithVar.node.nData.extRuleList.filter(ext => ruleIds.indexOf(ext.ruleId) >= 0);

                    decs.ruleJson = JSON.parse(decs.ruleJson);
                    let nodes = decs.ruleJson.nodes.map(node => {
                        if (node.nData.uniqueName === that.nodeWithVar.node.nData.uniqueName) {
                            node.nData.extRuleList = extRuleList;
                        }
                        return node;
                    });

                    decs.ruleJson.nodes = nodes;
                    decs.ruleDrl = G6Model.getDrlCode(decs.ruleJson, decs);
                    let funRelList = GetRel.getFuncRelList(decs, decs.ruleJson);
                    let cmptRelList = GetRel.getCmptRelList(decs, decs.ruleJson);
                    let tqsRelInfo = GetRel.getTqsDSRelList(decs, decs.ruleJson);
                    let dsRelList = GetRel.getDSRelList(decs, decs.ruleJson);
                    let varsRelList = GetRel.getVarsRelList(decs, decs.ruleJson);
                    let ruleRelList = GetRel.getRuleRelList(decs, decs.ruleJson); //074389

                    //判断是否存在天擎数据源，并确定是否新增/编辑改事件源
                    let tqsVarsNodeList = GetExistConfig.getTqsDSConfig(decs, decs.ruleJson);
                    decs.ruleJson = JSON.stringify(decs.ruleJson);
                    let updateTqsDsFlg = false;
                    if (isNotEmpty(tqsVarsNodeList)) {
                        if (await this.$confirm('存在天擎数据源，是否进行同步新增/更新？', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '保存',
                            cancelButtonText: '取消'
                        }).then(() => {
                            updateTqsDsFlg = true;
                        }).catch(() => {
                        }) !== 'confirm') {
                        }
                    }
                    if (updateTqsDsFlg) {
                        that.tqsRelatedUpdate(tqsVarsNodeList[0].nData.tqsVarConfig.tqsDatasource);
                    }
                    let decsUpdateDto = new DecsUpdateDto({
                        decsBase: decs,
                        funcRelList: funRelList,
                        cmptRelList: cmptRelList,
                        tqsRelInfo: tqsRelInfo,
                        dsRelList: dsRelList,
                        varsRelList: varsRelList,
                        decsRuleRelList: ruleRelList,
                    });
                    savePublishDecsByAdapter({
                        prodId: that.gConfig.prodId.value,
                        decsId: decs.decsId,
                        decsUpdateDto: decsUpdateDto
                    }).then(res => {
                        if (res.data.code === "200") {
                            that.refreshPage();
                            Object.assign(that.pDecs, res.data.data);
                            that.nodeWithVar.node = that.updateNodeWithVars(that.pDecs.ruleJson, that.nodeWithVar.node.nData.uniqueName);
                            that.$message({message: "启用成功", type: "success"});
                        } else {
                            that.$message({message: res.data.message, type: "warning"});
                        }
                        this.checkList = [];
                    });
                    /*let adapterDecsBaseDto = new AdapterDecsBaseDto(JSON.parse(JSON.stringify(decs)));
                    adapterDecsBaseDto.ruleBases = selectData;
                    savePublishDecsByAdapter({
                        prodId: that.gConfig.prodId.value,
                        decsId: that.pDecs.decsId,
                        adapterDecsBaseDto: adapterDecsBaseDto,
                        nodeUniqueName: that.nodeWithVar.node.nData.uniqueName
                    }).then(res => {
                        if (res.data.code === "200") {
                            that.refreshPage();
                            Object.assign(that.pDecs, res.data.data);
                            that.nodeWithVar.node = that.updateNodeWithVars(that.pDecs.ruleJson, that.nodeWithVar.node.nData.uniqueName);
                            that.$message({message: "启用成功", type: "success"});
                        } else {
                            that.$message({message: res.data.message, type: "warning"});
                        }
                        this.checkList = [];
                    });*/

                }

            },

            //天擎数据源更新（无则新增，有则更新）
            tqsRelatedUpdate(tqsDatasource){
                let that= this;
                let upTqsDs = JSON.parse(JSON.stringify(tqsDatasource));
                if(typeof upTqsDs.evVars == 'object'){
                    upTqsDs.evVars = JSON.stringify(upTqsDs.evVars);
                }
                modifyTqsDs({
                    prodId: that.gConfig.prodId.value,
                    tqsDatasource: upTqsDs,
                }).then(res => {
                    if (res.data.data.success) {
                        that.$message({message: res.data.data.message, type: "success"});
                    }else{
                        that.$message({message: res.data.data.message, type: "error"});
                    }
                });
            },

            // 规则下线    ----暂无需下线操作
            multiRuleOffline() {

                let that = this;
                let selectData = this.checkList;

                if (checkOfflineSelectedAdapterRuleList(selectData, that)) {
                    let decs = new DecsBase(JSON.parse(JSON.stringify(that.pDecs)));
                    let ruleIds=selectData.map(ruleBase=>{return ruleBase.ruleId});
                    let extRuleList=[];
                    Object.assign(extRuleList,that.nodeWithVar.node.nData.extRuleList);
                    extRuleList=extRuleList.filter(ext=>{
                        return  isEmpty(ruleIds.filter(ruleId=>ruleId===ext.ruleId))
                    });
                    decs.ruleJson=JSON.parse(decs.ruleJson);
                    let nodes=decs.ruleJson.nodes.map(node=>{
                        if (node.nData.uniqueName===that.nodeWithVar.node.nData.uniqueName){
                            node.nData.extRuleList=extRuleList;
                        }
                        return node;
                    });
                    decs.ruleJson.nodes=nodes;
                    decs.ruleDrl = G6Model.getDrlCode(decs.ruleJson, decs);
                    decs.ruleJson=JSON.stringify(decs.ruleJson);
                    let decsUpdateDto = new DecsUpdateDto({
                        decsBase: decs,
                    });
                    updateDecs({
                        prodId: that.gConfig.prodId.value,
                        decsId: decs.decsId,
                        decsUpdateDto: decsUpdateDto
                    }).then(res => {
                        that.$message({message: '成功', type: 'success'});
                        that.refreshPage();
                        Object.assign(that.pDecs, res.data.data);
                        that.nodeWithVar.node=that.updateNodeWithVars(that.pDecs.ruleJson,that.nodeWithVar.node.nData.uniqueName);
                    });
                }
                that.checkList = [];
            },

            descUpdate(){
                let that = this;
                that.isExtTableShow = false;
                let decs = new DecsBase(JSON.parse(JSON.stringify(that.pDecs)));
                decs.ruleJson=that.replaceNodesInRuleJson(decs.ruleJson,that.nodeWithVar.node);
                decs.ruleDrl = G6Model.getDrlCode(decs.ruleJson, decs);
                let ruleRelList = GetRel.getRuleRelList(decs, decs.ruleJson);
                // 将json对象转换为字符串
                decs.ruleJson=JSON.stringify(decs.ruleJson);
                let decsUpdateDto = new DecsUpdateDto({
                    decsBase: decs,
                    decsRuleRelList: ruleRelList,
                });
                savePublishDecsByTemplate({
                    prodId: that.gConfig.prodId.value,
                    decsId: decs.decsId,
                    decsUpdateDto: decsUpdateDto
                }).then(res => {
                    that.$message({message: "保存成功", type: "success"});
                    Object.assign(that.pDecs, res.data.data);
                    that.nodeWithVar.node=that.updateNodeWithVars(that.pDecs.ruleJson,that.nodeWithVar.node.nData.uniqueName);

                    that.initVarList();
                });
            },

            replaceNodesInRuleJson(ruleJson,replaceNode){
                 
                let result=JSON.parse(ruleJson);
                let resultNodeMap=result.nodes.map(temp=>{
                    let uniqueName=temp.nData.uniqueName;
                    if (uniqueName===replaceNode.nData.uniqueName) {
                        return replaceNode;
                    }else {
                        return temp;
                    }
                });
                Object.assign(result.nodes,resultNodeMap);
                return result;
            },

            updateNodeWithVars(ruleJson,uniqueName){

                let result=JSON.parse(ruleJson);
                let resultNodeMap=result.nodes.filter(temp=>{
                    let uniqueNameRuleJson=temp.nData.uniqueName;
                    return uniqueNameRuleJson===uniqueName;
                });
                return resultNodeMap[0];
            },

            // 初始化可以引用的变量
            initVarList() {
                let that = this;
                // 2. 初始化决策事件变量（与规则映射的变量）
                let aj = that.pDecs.analysisJson;
                let ie = that.pDecs.inputExample;

                // 初始化事件变量（String，Double，Date，Integer，object，array类型）
                function setEVarList(res) {
                    let eVarList = res[0].data.data
                        .map(item => new EVar({
                            varName: item.path,
                            varDesc: item.desc,
                            varType: item.type,
                            varValue: item.value
                        }));
                    that.relVar.eVarList = eVarList;
                }

                // 初始化规则输出变量
                function setROVarList(res) {
                    let roVarList = res[1].data.data.map(item => new ROVar({
                        varName: item.ruleId,
                        varDesc: item.ruleName,
                        varType: '',
                    }));
                    that.relVar.roVarList = roVarList;

                }
                function setPreVarList() {
                    that.relVar.preVarList = that.pDecs.preHandleReturnList.map(item => new PreVar(item));
                }
                Promise.all(
                    [
                        evVarParse({analysisJson: aj, inputExample: ie}),
                        getDecsRuleList({decsId: that.pDecs.decsId, prodId: this.gConfig.prodId.value}),
                        getRuleListByDecsId({decsId: that.pDecs.decsId, prodId: this.gConfig.prodId.value}),
                    ]
                ).then(res => {
                    if (that.pDecs.preHandle === 'Y') {
                        setPreVarList();
                    }
                    setEVarList(res);
                    setROVarList(res);
                })
            },
            ruleDeleteClick(rule) {
                let that = this;
                this.$confirm('确定要删除该规则吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    let decs = new DecsBase(JSON.parse(JSON.stringify(that.pDecs)));
                    let extRuleList=that.nodeWithVar.node.nData.extRuleList.filter(ext=>{
                        return ext.ruleId!==rule.ruleId
                    });
                    decs.ruleJson=JSON.parse(decs.ruleJson);
                    let nodes=decs.ruleJson.nodes.map(node=>{
                        if (node.nData.uniqueName===that.nodeWithVar.node.nData.uniqueName){
                            node.nData.extRuleList=extRuleList;
                        }
                        return node;
                    });
                    decs.ruleJson.nodes=nodes;
                    decs.ruleDrl = G6Model.getDrlCode(decs.ruleJson, decs);
                    decs.ruleJson=JSON.stringify(decs.ruleJson);
                    let adapterDecsBaseDto=new AdapterDecsBaseDto(JSON.parse(JSON.stringify(decs)));
                    deleteRuleWithAdapter({prodId: this.gConfig.prodId.value,
                                           ruleId: rule.ruleId,
                                           decsId:that.pDecs.decsId,
                                           adapterDecsBaseDto: adapterDecsBaseDto}).then(res => {
                        if (that.ruleList.length - 1 === 0) {
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
                }).catch(() => {
                });
            },
            ruleCitationClick(rule){
                const query={};
                const returnTab=this.nodeWithVar.node.nData.uniqueName;
                const decsId = this.$route.query[rQueryEnums.DECS_ID.code];
                const prodId = this.$route.query[rQueryEnums.PROD_ID.code];
                query[rQueryEnums.PROD_ID.code] = this.gConfig.prodId.value;
                query[rQueryEnums.RULE_ID.code] = rule.ruleId;
                query[rQueryEnums.TAB.code] =tabType.ruleCitation;
                query[rQueryEnums.ROUTER_PATH.code] = `/ui/adapterManage/adapterInf?decsId=${decsId}&tab=decsFlowG6&prodId=${prodId}&returnTab=${returnTab}`;

                this.$router.push({path:  '/ui/ruleManage/ruleInf', query: query});
            },

            ruleFlowClick(rule) {
                const decsId = this.$route.query[rQueryEnums.DECS_ID.code];
                const prodId = this.$route.query[rQueryEnums.PROD_ID.code];
                const returnTab=this.nodeWithVar.node.nData.uniqueName;
                const query = {};
                query[rQueryEnums.PROD_ID.code] = this.gConfig.prodId.value;
                query[rQueryEnums.RULE_ID.code] = rule.ruleId;
                query[rQueryEnums.TAB.code] = tabType.ruleFlowG6;
                query[rQueryEnums.ROUTER_PATH.code] = `/ui/adapterManage/adapterInf?decsId=${decsId}&tab=decsFlowG6&prodId=${prodId}&returnTab=${returnTab}`;
                this.$router.push({path:  '/ui/ruleManage/ruleInf', query: query});
            },
            ruleCodeClick(rule) {
                const query = {};
                const returnTab=this.nodeWithVar.node.nData.uniqueName;
                const decsId = this.$route.query[rQueryEnums.DECS_ID.code];
                const prodId = this.$route.query[rQueryEnums.PROD_ID.code];
                query[rQueryEnums.PROD_ID.code] = this.gConfig.prodId.value;
                query[rQueryEnums.RULE_ID.code] = rule.ruleId;
                query[rQueryEnums.TAB.code] = tabType.ruleCode;
                query[rQueryEnums.ROUTER_PATH.code] = `/ui/adapterManage/adapterInf?decsId=${decsId}&tab=decsFlowG6&prodId=${prodId}&returnTab=${returnTab}`;
                this.$router.push({path:  '/ui/ruleManage/ruleInf', query: query});
            },
            ruleHisClick(rule) {
                const query = {};
                const returnTab=this.nodeWithVar.node.nData.uniqueName;
                const decsId = this.$route.query[rQueryEnums.DECS_ID.code];
                const prodId = this.$route.query[rQueryEnums.PROD_ID.code];
                query[rQueryEnums.PROD_ID.code] = this.gConfig.prodId.value;
                query[rQueryEnums.RULE_ID.code] = rule.ruleId;
                query[rQueryEnums.TAB.code] = tabType.ruleHis;
                query[rQueryEnums.ROUTER_PATH.code] =`/ui/adapterManage/adapterInf?decsId=${decsId}&tab=decsFlowG6&prodId=${prodId}&returnTab=${returnTab}`;
                this.$router.push({path: '/ui/ruleManage/ruleInf', query: query});
            },
            ruleVersionClick(rule) {
                const query = {};
                const returnTab=this.nodeWithVar.node.nData.uniqueName;
                const decsId = this.$route.query[rQueryEnums.DECS_ID.code];
                const prodId = this.$route.query[rQueryEnums.PROD_ID.code];
                query[rQueryEnums.PROD_ID.code] = this.gConfig.prodId.value;
                query[rQueryEnums.RULE_ID.code] = rule.ruleId;
                query[rQueryEnums.TAB.code] = tabType.ruleVersion;
                query[rQueryEnums.ROUTER_PATH.code] = `/ui/adapterManage/adapterInf?decsId=${decsId}&tab=decsFlowG6&prodId=${prodId}&returnTab=${returnTab}`;
                this.$router.push({path:  '/ui/ruleManage/ruleInf', query: query});
            },
            connectVarsClick(rule){
                const query = {};
                query[rQueryEnums.PROD_ID.code] = this.gConfig.prodId.value;
                query[rQueryEnums.RULE_ID.code] = rule.ruleId;
                query[rQueryEnums.TAB.code] = tabType.ruleFlowG6;
                query[rQueryEnums.ROUTER_PATH.code] = '/ui/adapterManage';
                this.$router.push({path: "/ui/ruleManage/ruleInf", query: query});
            },

            /**
             * 变量编辑
             * */
            handleVarEdit(varBase) {

                this.addAndEditVarData = JSON.parse(JSON.stringify(varBase));
                this.dialogTitle = '变量详情';
                this.varEditFlag = true;
                setTimeout(() =>{
                    this.$refs['editRef'].clearValidate();
                    this.$refs['editRef'].datasourceMount(this.addAndEditVarData);
                }, 50);
            },
            /**
             * 数据源详细查询留存
             * */
            datasourceMount(varsBase){
                let prodId = varsBase.prodId;
                let datasourceId = varsBase.datasourceId;
                getDatasourceById({
                    prodId: prodId,
                    datasourceId: datasourceId
                }).then(res => {
                    if (res.data.data) {
                        let datasourceCur = res.data.data;
                        this.datasoueceSelectNameShow = datasourceCur.datasourceId + '[' + datasourceCur.datasourceName + ']';
                    }else{
                        this.datasoueceSelectNameShow = varsBase.datasourceId;
                    }
                });
            },
        }
    }
</script>


<style scoped>
    #ruleTables{
        height: 100%;
        padding: 0 10px 0 10px;
        background-image: url('~@/assets/bg4.png');
        background-size: 100% 100%;
    }
</style>
