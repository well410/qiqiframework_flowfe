<template>
    <!--决策版本-->
    <div id="decsHis">
        <div class="tools" v-if="false">
            <el-form @submit.native.prevent :inline="true" size="mini">
                <el-form-item label="决策名">
                    <el-input placeholder="决策名" maxlength="64" show-word-limit v-model="decsFilter.decsName"></el-input>
                </el-form-item>
                <el-form-item label="版本">
                    <el-input placeholder="版本" maxlength="64" show-word-limit
                              v-model="decsFilter.decsVersion"></el-input>
                </el-form-item>
                <el-form-item label="决策状态">
                    <el-select placeholder="决策状态" v-model="decsFilter.decsStatus" clearable>
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
                :data="decsList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                size="mini"
                style="width: 100%;min-height: 746px;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <adapter-show :p-decs="props.row" :p-type="tabType.decsVersion"></adapter-show>
                </template>
            </el-table-column>
            <el-table-column prop="decsId" align="center"  label="决策ID"></el-table-column>
            <el-table-column prop="decsName" align="center"  label="决策名"></el-table-column>
            <el-table-column prop="decsVersion" align="center"  label="决策版本"></el-table-column>
            <el-table-column prop="createUser" align="center"  label="创建人"></el-table-column>
            <el-table-column prop="updateUser" align="center"  label="修改人"></el-table-column>
            <el-table-column prop="createTime" align="center"  label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" align="center"  label="修改时间"></el-table-column>
            <el-table-column prop="status" align="center"  label="决策状态">
                <template slot-scope="props">
                    <el-tag :type="tagType[props.row.status]">{{statusEnums[props.row.status].name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="操作" width="200px">
                <template slot-scope="props">
                    <el-button class="icon-button" icon="el-icon-video-play" type="primary" @click="debugBefore(props.row)" size="mini" title="测试"></el-button>
                    <!--<el-button class="icon-button" icon="el-icon-video-play" type="primary" @click="updateResultBefore(props.row)" size="mini" title="返回报文格式"></el-button>-->
                    <el-button class="icon-button" type="primary" size="mini" @click="copyBefore(props.row)" title="复制"><svg-icon icon-class="copy" style=" width: 1.9em;height: 1.9em; color: #409eff;"/></el-button>
                    <el-button class="icon-button" type="primary" size="mini" @click="exportDecs(props.row)" title="导出"><svg-icon icon-class="export" style=" width: 1.9em;height: 1.9em; color: #67c23a;"/></el-button>
                    <el-button class="icon-button" type="success" v-if="props.row.status !== 'Y'" size="mini"
                               @click="onlineDecsVersion(props['row'])" title="启用"><svg-icon icon-class="start" style=" width: 1.9em;height: 1.9em; color: #67c23a;"/>
                    </el-button>
                    <el-button class="icon-button" type="success" v-if="props.row.status === 'Y'" size="mini"
                               @click="onlineDecsVersion(props['row'])" disabled title="启用"><svg-icon icon-class="end" style=" width: 1.8em;height: 1.8em; color: #e6a23c;"/>
                    </el-button>
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


        <!--决策返回报文格式-->
        <el-dialog
                title="决策返回结果"
                width="800px"
                :close-on-click-modal="false"
                :visible.sync="resultConfigDialog.isShow">
           <decs-result-config></decs-result-config>
            <template slot="footer" class="dialog-footer">
                <el-button @click="resultConfigDialog.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="updateResultAfter" size="mini">确 定</el-button>
            </template>
        </el-dialog>

        <!--决策测试窗口-->
        <el-dialog
                title="决策测试"
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

        <!--复制决策窗口-->
        <el-dialog
                :visible.sync="copyDialog.isShow"
                :title="copyDialog.title"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                width="600px">
            <el-form label-width="100px" size="mini" ref="copyDialog" :model="copyDialog" :rules="rules">
                <el-form-item label="决策ID:" prop="decsId">
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
        checkRel,
        copyDecs,
        getDecsById,
        getDecsVersionList,
        onlineDecsVersion,
        testDecsVersion,
        queryDecsCitation,
        exportDecsVersion
    } from "../../../../api/Decs";
    import {queryRuleAllVersionCitation, queryRuleVersionCitation} from "../../../../api/Rule";
    import {DecsBase} from "../../../../entity/decs";
    import AdapterShow from "../../adapter-components/AdapterShow";
    import {isEmpty,isNotEmpty} from "../../../../utils";
    import {getSdkVersion} from "../../../../api/Utils";
    import CodemirrorShow from "../../../../components/codemirror/CodemirrorShow";
    import {DecsFilter} from "../..";
    import {statusEnums, tabType, tagType} from "../../../../entity/enumns";
    import {
        validateChinese,
        validateNullChar,
        validateSpChar,
        validateUpperChar,
        validateVarSpChar
    } from "../../../common";
    import {EVar} from "../../../../entity/vars";
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
    import DecsResultConfig from "../../adapter-components/AdapterResultConfig";
    import FileSaver from 'file-saver';

    require("script-loader!jsonlint");

    export default {
        name: "DecsVersion",
        components: {DecsResultConfig, CodemirrorShow, AdapterShow},
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
                decsList: [],
                decsFilter: new DecsFilter(),
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
                    title: '复制决策',
                    prodId: this.gConfig.prodId.value,
                    decsId: "",
                    decsVersion: {}
                },
                rules: {
                    decsId: [
                        {required: true, message: '请输入决策id', trigger: 'blur'},
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

                //导出决策保存的数据结构
                saveDecsToFile:{
                },

            }
        },
        methods: {
            init() {
                let that = this;
                that.refreshPage();
            },

            async exportDecs(row) {
                let that = this;
                let params={
                    prodId: that.gConfig.prodId.value,
                    decsId: row.decsId,
                    decsFilter: that.decsFilter
                };
                let res = await exportDecsVersion({prodId: that.gConfig.prodId.value,
                    decsId: row.decsId, versionId: row.decsVersion});
                if(isNotEmpty(res.data.status) && res.data.status === 200) {
                    that.saveDecsToFile = res.data.data;
                    let data = JSON.stringify(that.saveDecsToFile);
                    let blob = new Blob([data], { type: 'application/json' });
                    FileSaver.saveAs(blob, row.decsVersion + '.json');
                } else {
                    if(isNotEmpty(res.data.message))
                        that.$message({message: res.data.message, type: "warn"});
                    else
                        that.$message({message: '导出接口异常', type: "warn"});
                }
            },

            // 复制决策之前
            copyBefore(row) {
                let that = this;
                that.copyDialog.decsId = "";
                that.copyDialog.isShow = true;
                that.copyDialog.decsVersion = row;
            },

            // 复制决策之后
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
                                    message = `决策${newDecsId}已存在，并且非当前操作决策，不能进行操作`;
                                    this.$message({message: message, type: 'warning'})
                                } else {
                                    message = `决策${newDecsId}已存在，并且是当前操作决策，确定要覆盖决策${newDecsId}?`;
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
                                            that.$message({message: "成功覆盖决策", type: "success"});
                                        });
                                    }).catch(() => {
                                    });
                                }
                            } else {
                                message = `决策${newDecsId}不存在，确定要新增决策${newDecsId}?`;
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
                                        that.$message({message: "成功新增决策", type: "success"});
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
                // 初始化决策事件变量（与规则映射的变量）
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
                this.pageNum = 1
                this.refreshPage();
            },

            // 刷新页面
            refreshPage() {
                let that = this;
                let params = {
                    prodId: that.pDecs.prodId,
                    decsId: that.pDecs.decsId,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    decsFilter: that.decsFilter
                };
                that.loading = true;
                getDecsVersionList(params).then(res => {
                    that.decsList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.decsList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },

            // 上线决策
            onlineDecsVersion(row) {
                let that = this;
                let param = {prodId: row.prodId, decsId: row.decsId, versionId: row.decsVersion};
                function tmpOnline() {
                    that.loading = true;
                    onlineDecsVersion(param).then(res => {
                        that.$message({type: 'success', message: res.data.data});
                        that.refreshPage();
                    }).finally(() => {
                        that.loading = false;
                    });
                }

                function checkRel_fun(param){
                    checkRel(param).then(res => {
                        if (isEmpty(res.data.data)) {
                            tmpOnline()
                        } else {
                            that.$confirm(res.data.data, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(({value}) => {
                                tmpOnline()
                            }).catch(() => {
                            });
                        }
                    });
                }
                getSdkVersion({artifactId: "TcsDecsExecCommon"}).then(res=>{
                    if(row.sdkVersion == null || row.sdkVersion === res.data.data){
                        checkRel_fun(param);
                    }else{
                        that.$message({type: 'warning', message: '当前决策版本与执行应用版本不一致，无法启用该决策，请核验~~'});
                    }
                }).finally(() => {
                    that.loading = false;
                });


            }
        }
    }
</script>

<style scoped>

</style>
