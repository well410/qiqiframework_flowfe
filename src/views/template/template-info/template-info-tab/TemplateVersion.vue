<template>
    <!--模板版本-->
    <div id="decsHis">
        <div class="tools" v-if="false">
            <el-form @submit.native.prevent :inline="true" size="mini">
                <el-form-item label="模板名">
                    <el-input placeholder="模板名" maxlength="64" show-word-limit v-model="decsFilter.decsName"></el-input>
                </el-form-item>
                <el-form-item label="版本">
                    <el-input placeholder="版本" maxlength="64" show-word-limit
                              v-model="decsFilter.decsVersion"></el-input>
                </el-form-item>
                <el-form-item label="模板状态">
                    <el-select placeholder="模板状态" v-model="decsFilter.decsStatus" clearable>
                        <el-option :label="statusEnums['Y'].name" :key="statusEnums['Y'].code" :value="statusEnums['Y'].code"></el-option>
                        <el-option :label="statusEnums['N'].name" :key="statusEnums['N'].code" :value="statusEnums['N'].code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="refreshPage">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
                ref="multipleTable"
                :data="templateList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                size="mini"
                style="width: 100%;min-height: 746px;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <decs-show :p-decs="props.row" :p-type="tabType.decsVersion"></decs-show>
                </template>
            </el-table-column>
            <el-table-column prop="templateId" align="center"  label="模板ID"></el-table-column>
            <el-table-column prop="templateName" align="center"  label="模板名"></el-table-column>
            <el-table-column prop="templateVersion" align="center"  label="模板版本"></el-table-column>
            <el-table-column prop="createUser" align="center"  label="创建人"></el-table-column>
            <el-table-column prop="updateUser" align="center"  label="修改人"></el-table-column>
            <el-table-column prop="createTime" align="center"  label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" align="center"  label="修改时间"></el-table-column>
            <el-table-column prop="status" align="center"  label="模板状态">
                <template slot-scope="props">
                    <el-tag :type="tagType[props.row.status]">{{statusEnums[props.row.status].name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="操作" >
                <template slot-scope="props">
                    <!--<el-button class="icon-button" icon="el-icon-video-play" type="primary" @click="debugBefore(props.row)" size="mini" title="测试"></el-button>
                    <el-button class="icon-button" icon="el-icon-video-play" type="primary" @click="updateResultBefore(props.row)" size="mini" title="返回报文格式"></el-button>
                    <el-button class="icon-button" type="primary" size="mini" @click="copyBefore(props.row)" title="复制"><svg-icon icon-class="copy" style=" width: 1.9em;height: 1.9em; color: #409eff;"/></el-button>-->
                    <el-button class="icon-button" type="success" v-if="props.row.status !== 'Y'" size="mini"
                               @click="onlineTemplateVersion(props['row'])" title="启用"><svg-icon icon-class="start" style=" width: 1.9em;height: 1.9em; color: #67c23a;"/>
                    </el-button>
                    <el-button class="icon-button" type="success" v-if="props.row.status === 'Y'" size="mini"
                               @click="onlineTemplateVersion(props['row'])" disabled title="启用"><svg-icon icon-class="end" style=" width: 1.8em;height: 1.8em; color: #e6a23c;"/>
                    </el-button>
                    <el-button type="danger"class="icon-button" icon="el-icon-delete"
                               size="mini" @click="deleteTemplateVersionClick(props['row'])"
                               style=" width: 1.9em;height: 1.9em; color: #f56c6c;" title="删除"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                class="pagination-bar"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[15, 30, 60, 100]"
                :page-size="pageSize"
                :current-page.sync="pageNum"
                :total="total">
        </el-pagination>


        <!--模板返回报文格式-->
        <el-dialog
                title="模板返回结果"
                width="800px"
                :close-on-click-modal="false"
                :visible.sync="resultConfigDialog.isShow">
           <decs-result-config></decs-result-config>
            <template slot="footer" class="dialog-footer">
                <el-button @click="resultConfigDialog.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="updateResultAfter" size="mini">确 定</el-button>
            </template>
        </el-dialog>

        <!--模板测试窗口-->
        <el-dialog
                title="模板测试"
                width="800px"
                :close-on-click-modal="false"
                :visible.sync="dialog">
            <el-form ref="debugForm" :model="debugDecs" :rules="debugRules">
                <el-form-item label="输入报文" prop="req">
                    <codemirror v-model="debugDecs.inputExample"
                                :options="cmOptions"
                                style="line-height:20px;z-index: 10000;"></codemirror>

                </el-form-item>
                <el-form-item label="测试结果" v-if="debugResult !== ''">
                    <codemirror-show :p-code="debugResult"></codemirror-show>
                </el-form-item>
            </el-form>

            <template slot="footer" class="dialog-footer">
                <el-button @click="dialog = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="debugAfter" :loading="debugAfterLoading" size="mini">确 定</el-button>
            </template>
        </el-dialog>

        <!--复制模板窗口-->
        <el-dialog
                :visible.sync="copyDialog.isShow"
                :title="copyDialog.title"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                width="600px">
            <el-form label-width="100px" size="mini" ref="copyDialog" :model="copyDialog" :rules="rules">
                <el-form-item label="模板ID:" prop="decsId">
                    <el-input v-model="copyDialog.decsId" placeholder="由小写字母、数字、下划线组成" style="width: 300px" maxlength="22" show-word-limit>
                        <template slot="prepend">{{copyDialog.prodId}}{{`_decs_`}}</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="copyDialog.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="copyAfter" size="mini">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {
        copyDecs,
        getDecsById,
        testDecsVersion
    } from "../../../../api/Decs";
    import {DecsBase} from "../../../../entity/decs";
    import DecsShow from "../../template-components/TemplateShow";
    import {isEmpty} from "../../../../utils";
    import {getSdkVersion} from "../../../../api/Utils";
    import CodemirrorShow from "../../../../components/codemirror/CodemirrorShow";
    import {statusEnums, tabType, tagType} from "../../../../entity/enumns";
    import {
        validateChinese,
        validateNullChar,
        validateSpChar,
        validateUpperChar,
        validateVarSpChar
    } from "../../../common";
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
    import "../../../common/indexL.less"
    import DecsResultConfig from "../../template-components/TemplateResultConfig";
    import {deleteTemplateVersion, getTemplateVersionList, onlineTemplateVersion} from "../../../../api/Template";
    import {DecsFilter} from "../../../decs";
    import {TemplateVersion} from "../../../../entity/template";

    require("script-loader!jsonlint");

    export default {
        name: "TemplateVersion",
        components: {DecsResultConfig, CodemirrorShow, DecsShow},
        props: {
            pDecs: DecsBase
        },
        data() {
            return {
                debugRules: {
                    req: [
                        {required: true, message: '请输入输入报文示例', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                    ]
                },
                templateList: [],
                templateVersion: new TemplateVersion(),
                pageNum: 1,
                pageSize: 15,
                total: 0,
                loading: false,
                statusEnums: statusEnums,
                tabType: tabType,
                tagType: tagType,
                dialog: false,
                debugAfterLoading: false,
                debugResult: "",
                debugDecs: {},
                copyDialog: {
                    isShow: false,
                    title: '复制模板',
                    prodId: this.gConfig.prodId.value,
                    decsId: "",
                    decsVersion: {}
                },
                rules: {
                    decsId: [
                        {required: true, message: '请输入模板id', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
                        {validator: validateSpChar, trigger: 'blur'},
                        {validator: validateChinese, trigger: 'blur'},
                        {validator: validateUpperChar, trigger: 'blur'}
                    ],
                },
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
                resultConfigDialog:{
                    isShow : false
                },

            }
        },
        methods: {
            deleteTemplateVersionClick(row){
                let that = this;
                this.$confirm('确定要删除模板嘛？（不可恢复）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    deleteTemplateVersion(row).then(res=>{
                        that.$message({type: 'success', message: "删除成功"});
                        that.refreshPage();
                    })
                }).catch(() => {});
            },

            init() {
                let that = this;
                that.refreshPage();
            },

            // 复制模板之前
            copyBefore(row) {
                let that = this;
                that.copyDialog.decsId = "";
                that.copyDialog.isShow = true;
                that.copyDialog.decsVersion = row;
            },

            // 复制模板之后
            copyAfter() {
                let that = this;
                let message = "";
                let newDecsId = `${that.copyDialog.prodId}_decs_${that.copyDialog.decsId}`;
                // 验证from表单
                that.$refs['copyDialog'].validate((valid) => {
                    if (valid) {
                        getDecsById({decsId: newDecsId, prodId: this.gConfig.prodId.value}).then(res => {
                            if (res.data.data !== null) {
                                if (newDecsId !== that.copyDialog.decsVersion.decsId) {
                                    message = `模板${newDecsId}已存在，并且非当前操作模板，不能进行操作`;
                                    this.$message({message: message, type: 'warning'})
                                } else {
                                    message = `模板${newDecsId}已存在，并且是当前操作模板，确定要覆盖模板${newDecsId}?`;
                                    this.$confirm(message, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(({value}) => {
                                        copyDecs({
                                            prodId: this.gConfig.prodId.value,
                                            decsId: newDecsId,
                                            decsVersion: that.copyDialog.decsVersion
                                        }).then(res => {
                                            that.$message({message: "成功覆盖模板", type: "success"});
                                        });
                                    }).catch(() => {
                                    });
                                }
                            } else {
                                message = `模板${newDecsId}不存在，确定要新增模板${newDecsId}?`;
                                this.$confirm(message, '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'success'
                                }).then(({value}) => {
                                    copyDecs({
                                        prodId: this.gConfig.prodId.value,
                                        decsId: newDecsId,
                                        decsVersion: that.copyDialog.decsVersion
                                    }).then(res => {
                                        that.$message({message: "成功新增模板", type: "success"});
                                    });
                                }).catch(() => {
                                });
                            }
                        });
                        that.copyDialog.isShow = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            // 测试之后
            debugAfter() {
                let that = this;
                that.debugAfterLoading = true;
                testDecsVersion({
                    req: JSON.parse(that.debugDecs.inputExample),
                    prodId: that.debugDecs.prodId,
                    decsId: that.debugDecs.decsId,
                    versionId: that.debugDecs.decsVersion
                }).then(res => {
                    if (res.data.data.success) {
                        that.debugResult = JSON.stringify(JSON.parse(res.data.data.result), null, 4);
                        that.$message({type: 'info', message: '测试结果返回'});
                    } else {
                        that.$message({type: 'warning', message: '测试异常'});
                        that.debugResult = res.data.data.result;
                    }
                }).finally(() => {
                    that.debugAfterLoading = false;
                })
            },

            // 测试之前
            debugBefore(row) {
                // 初始化模板事件变量（与规则映射的变量）
                let that = this;
                that.debugDecs = JSON.parse(JSON.stringify(row));
                that.dialog = true;
            },

            // 修改返回报文格式之前
            updateResultBefore(){
                this.resultConfigDialog.isShow = true;
            },

            // 修改返回报文格式之后
            updateResultAfter(){

            },

            // 当前页面切换
            handleCurrentChange(val) {
                this.pageNum = val;
                this.refreshPage();
            },

            // 当前页面个数修改
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNum =1
                this.refreshPage();
            },

            // 刷新页面
            refreshPage() {
                let that = this;
                that.templateVersion.templateId=that.pDecs.decsId;
                let params = {
                    prodId: that.pDecs.prodId,
                    templateId: that.pDecs.decsId,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    templateFilter: that.templateVersion
                };
                that.loading = true;
                getTemplateVersionList(params).then(res => {
                    that.templateList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.templateList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },

            // 上线模板
            onlineTemplateVersion(row) {
                let that = this;
                let param = {prodId: row.prodId, templateId: row.templateId, versionId: row.templateVersion};
                that.loading = true;
                onlineTemplateVersion(param).then(res => {
                    that.$message({type: 'success', message: res.data.data});
                    that.refreshPage();
                }).finally(() => {
                    that.loading = false;
                });

            }
        }
    }
</script>

<style scoped>

</style>
