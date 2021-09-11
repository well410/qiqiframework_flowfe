<template>
    <div id="ruleVersion">
        <!--操作工具栏-->
        <div class="tools" v-if="false">
            <el-form @submit.native.prevent :inline="true" size="mini">
                <el-form-item label="规则名">
                    <el-input placeholder="规则名" maxlength="64" show-word-limit v-model="ruleFilter.ruleName"></el-input>
                </el-form-item>
                <el-form-item label="规则版本">
                    <el-input placeholder="规则版本" maxlength="64" show-word-limit
                              v-model="ruleFilter.ruleVersion"></el-input>
                </el-form-item>
                <el-form-item label="规则状态">
                    <el-select placeholder="规则状态" v-model="ruleFilter.ruleStatus" clearable>
                        <el-option :label="statusEnums['Y'].name" :key="statusEnums['Y'].code"
                                   :value="statusEnums['Y'].code"></el-option>
                        <el-option :label="statusEnums['N'].name" :key="statusEnums['N'].code"
                                   :value="statusEnums['N'].code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="refreshPage"> 查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!--规则版本表格-->
        <el-table
                ref="multipleTable"
                :data="ruleVersionList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                size="mini" style="min-height: 746px;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <rule-show :p-rule="props.row" :p-type="tabType.ruleVersion"></rule-show>
                </template>
            </el-table-column>
            <el-table-column prop="ruleId" align="center"  label="规则id"></el-table-column>
            <el-table-column prop="ruleName" align="center"  label="规则名"></el-table-column>
            <el-table-column prop="ruleVersion" align="center"  label="规则版本"></el-table-column>
            <el-table-column prop="createUser" align="center"  label="创建人"></el-table-column>
            <el-table-column prop="updateUser" align="center"  label="修改人"></el-table-column>
            <el-table-column prop="createTime" align="center"  label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" align="center"  label="修改时间"></el-table-column>
            <el-table-column prop="status" align="center"  label="规则状态">
                <template slot-scope="props">
                    <el-tag :type="tagType[props.row.status]" style="width: 60px">{{statusEnums[props.row.status].name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="160px">
                <template slot-scope="props">
                    <el-button class="icon-button" icon="el-icon-video-play" type="primary" @click="debugBefore(props.row)" size="mini" title="测试"></el-button>
                    <el-button class="icon-button" icon="el-icon-upload2" type="primary" @click="updateBefore(props.row)" size="mini" title="更新"></el-button>
                    <el-button class="icon-button" type="success" v-if="props.row.status === 'N'" size="mini" @click="onlineRuleVersion(props['row'])" title="启用">
                        <svg-icon icon-class="start" style=" width: 1.9em;height: 1.9em; color: #67c23a;"/>
                    </el-button>
                    <el-button class="icon-button" type="warning" v-if="props.row.status === 'Y'" size="mini"
                               @click="offlineRuleVersion(props['row'])" title="停用">
                        <svg-icon icon-class="end" style=" width: 1.8em;height: 1.8em; color: #e6a23c;"/>
                    </el-button>
                    <el-button type="danger" class="icon-button" icon="el-icon-delete"
                               size="mini"
                               @click="deleteRuleVersionClick(props['row'])"
                               v-cmb-auth-remove="res.ruleDelete.code"
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

        <el-dialog
                title="规则更新"
                width="800px"
                :close-on-click-modal="false"
                :visible.sync="updateDialog.isShow">
            <span style="color: red">注：以下为引用该规则的决策</span>
            <el-table
                    :data="computeRootDecs"
                    tooltip-effect="dark"
                    stripe
                    border
                    max-height="266px"
                    size="mini"
                    v-loading="updateDialog.isLoading"
                    style="width: 100%">
                <el-table-column  align="center" label="决策ID" prop="decsId"></el-table-column>
                <el-table-column  align="center" label="决策版本" prop="decsVersion"></el-table-column>
                <el-table-column  align="center" label="规则源版本" prop="sourceVersion"></el-table-column>
                <el-table-column  align="center" label="规则目标版本" prop="targetVersion"></el-table-column>
            </el-table>

            <div v-if="isNotEmpty(updateDialog.result['successMessageList'])">
                <span style="color: red">注：以下为版本更新的详细内容</span>
                <div v-for="item in updateDialog.result['successMessageList']">
                    <h6>{{item.decsVersion.decsId}}</h6>
                    <div v-for="item2 in computeUpdateInf(item)">
                        <el-row>
                            <el-col :span="11">{{item2.source}}</el-col>
                            <el-col :span="2">===></el-col>
                            <el-col :span="11">{{item2.target}}</el-col>
                        </el-row>
                    </div>
                </div>
            </div>



            <template slot="footer" class="dialog-footer">
                <el-button @click="updateDialog.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="updateAfter" :loading="updateDialog.updateAfterLoading"  size="mini">全部更新</el-button>
            </template>
        </el-dialog>


        <el-dialog
                title="规则测试"
                width="800px"
                :close-on-click-modal="false"
                :visible.sync="dialog">
            <el-form ref="debugForm" :model="debug" :rules="rules">
                <el-form-item label="输入报文" prop="req">
                    <codemirror v-model="debug.req"
                                :options="cmOptions"
                                style="line-height:20px;z-index: 10000;"></codemirror>

                </el-form-item>
                <el-form-item label="测试结果" v-if="debug.debugResult !== ''">
                    <codemirror-show :p-code="debug.debugResult"></codemirror-show>
                </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="dialog = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="debugAfter" :loading="debugAfterLoading" size="mini">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    import {RuleBase} from "../../../../entity/rule";
    import RuleShow from "../../rule-components/RuleShow";
    import {
        deleteRuleVersion, getDroolsGroupList,
        getRuleVersionList,
        offlineRuleVersion,
        onlineRuleVersion,
        testRuleVersion, updateDroolsGroupList
    } from "../../../../api/Rule";
    import CodemirrorShow from "../../../../components/codemirror/CodemirrorShow";
    import {RuleFilter} from "../..";
    import {entityEnums, statusEnums, tabType, tagType, varTypeEnums} from "../../../../entity/enumns";
    import {RIVar} from "../../../../entity/vars";
    import {evVarParse} from "../../../../api/Utils";
    import {validateVarSpChar} from "../../../common";
    import {isEmpty, isNotEmpty} from "../../../../utils";

    export default {
        name: "RuleVersion",
        components: {CodemirrorShow, RuleShow},
        props: {     //props属性用于获取父组件传给子组件的数据
            pRule: RuleBase,
            required: true
        },
        data() {
            return {
                // ===============规则更新=========================
                updateDialog :{isShow: false, droolsGroupList:[], isLoading : false, updateAfterLoading: false, rule : {}, result:{}},

                // ===============规则调试=========================
                rules: {
                    req: [
                        {required: true, message: '请输入输入报文示例', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                    ]
                },
                debug:{req:'', debugResult:'',},
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

                dialog: false,
                debugAfterLoading: false,
                ruleFilter: new RuleFilter(),
                pageNum: 1,
                pageSize: 15,
                total: 0,
                ruleVersionList: [],
                ruleDetail: {},
                loading: false,
                statusEnums: statusEnums,
                tabType: tabType,
                tagType: tagType,
                debugRule: {},
            };
        },


        computed:{
            // 获取更新版本后的信息（原始版本和升级后的版本信息）
            computeUpdateInf(){
                // item 为 successMessageList 里的值
                return (item) => {
                    let result = [];

                    function getResultObj(_source, _target) {
                        let source = isNotEmpty(_source.decsVersion) ? `${_source.decsVersion.decsId}/${_source.decsVersion.decsVersion}` : `${_source.ruleVersion.ruleId}/${_source.ruleVersion.ruleVersion}`;
                        let target = isNotEmpty(_target.decsVersion) ? `${_target.decsVersion.decsId}/${_target.decsVersion.decsVersion}` : `${_target.ruleVersion.ruleId}/${_target.ruleVersion.ruleVersion}`;
                        return {source, target};
                    }

                    for (let i = 0; i < item['sourceList'].length; i++) {
                        result.push(getResultObj(item['sourceList'][i], item['targetList'][i]));
                    }
                    return result;
                }
            },


            computeRootDecs(){
                let that = this;
                let result = [];
                that.updateDialog.droolsGroupList.forEach(item => {
                    const decs = item['droolsNodeList'].filter(node => node['relTypeEnums'] === entityEnums.DECS.code)[0];
                    let params = {};
                    params.decsId = decs.id;
                    params.decsVersion = decs.version;
                    params.sourceVersion = item['droolsNodeList'].filter(node => {
                        let b1 = node['relTypeEnums'] === entityEnums.RULE.code;
                        let b2 = (node.id === that.updateDialog.rule.ruleId);
                        return b1 && b2;
                    }).map(node => node.version).join(",");
                    params.targetVersion = that.updateDialog.rule.ruleVersion;
                    result.push(params);
                });
                return result;
            }
        },

        methods: {

            init() {
                this.refreshPage();
            },

            /**
             * 更新规则之前，
             **/
            updateBefore(row) {
                this.updateDialog.isShow = true;
                this.updateDialog.isLoading = true;
                getDroolsGroupList({prodId: row.prodId, ruleId: row.ruleId, versionId: row.ruleVersion}).then(res => {
                    this.updateDialog.droolsGroupList = res.data.data;
                    this.updateDialog.rule = row;
                }).finally(()=>{
                    this.updateDialog.isLoading = false;
                })
            },

            /**
             * 更新规则之后
             **/
            updateAfter(){
                let params = {
                    prodId: this.updateDialog.rule.prodId,
                    ruleId: this.updateDialog.rule.ruleId,
                    versionId: this.updateDialog.rule.ruleVersion,
                    droolsGroupList: this.updateDialog.droolsGroupList
                };
                this.updateDialog.updateAfterLoading = true;
                updateDroolsGroupList(params).then(res=>{
                    if (res.data.data.success) {
                        this.updateDialog.result = res.data.data;
                    }
                }).finally(()=>{
                    this.updateBefore(this.updateDialog.rule);
                    this.updateDialog.updateAfterLoading = false;
                })
            },

            // 测试规则
            debugAfter() {
                let that = this;
                that.debugAfterLoading = true;
                testRuleVersion({
                    prodId: this.gConfig.prodId.value,
                    req: JSON.parse(that.debug.req),
                    ruleId: that.debugRule.ruleId,
                    versionId: that.debugRule.ruleVersion
                }).then(res => {
                    if (res.data.data.success) {
                        that.debug.debugResult = JSON.stringify(res.data.data.data, null, 4);
                        that.$message({type: 'info', message: '测试结果返回'});
                    } else {
                        that.$message({type: 'warning', message: '测试异常'});
                        that.debug.debugResult = res.data.data.message;
                    }
                }).finally(() => {
                    that.debugAfterLoading = false;
                })
            },

            // 测试规则之前
            debugBefore(row) {
                let that = this;
                that.debugRule = JSON.parse(JSON.stringify(row));
                that.debug.req = that.debugRule.inputExample;
                that.dialog = true;
            },

            // 页面切换
            handleCurrentChange(val) {
                this.pageNum = val;
                this.refreshPage();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNum =1;
                this.refreshPage();
            },

            // 分页查询页面
            refreshPage() {
                let that = this;
                let params = {
                    prodId: that.pRule.prodId,
                    ruleId: that.pRule.ruleId,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    ruleFilter: that.ruleFilter
                };
                that.loading = true;
                getRuleVersionList(params).then(res => {
                    that.ruleVersionList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.ruleVersionList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },

            /**
             * 上线某个规则
             * @param activity
             */
            onlineRuleVersion: function (activity) {
                let prodId = activity.prodId;
                let ruleId = activity.ruleId;
                let ruleVersion = activity.ruleVersion;
                this.loading = true;
                onlineRuleVersion(prodId, ruleId, ruleVersion).then(res => {
                    this.$message({type: 'success', message: res.data.data});
                    this.refreshPage();
                }).finally(() => {
                    this.loading = false;
                });

            },

            deleteRuleVersionClick(row){
                let that = this;
                this.$confirm('确定要删除决策嘛？（不可恢复）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    let param = {prodId: row.prodId, ruleId: row.ruleId, versionId: row.ruleVersion};
                    deleteRuleVersion(param).then(res=>{
                        that.$message({type: 'success', message: "删除成功"});
                        that.refreshPage();
                    })
                }).catch(() => {});
            },

            /**
             * 下线某个规则
             * @param activity
             */
            offlineRuleVersion: function (activity) {
                let prodId = activity.prodId;
                let ruleId = activity.ruleId;
                let ruleVersion = activity.ruleVersion;
                this.loading = true;
                offlineRuleVersion(prodId, ruleId, ruleVersion).then(res => {
                    this.$message({type: 'success', message: res.data.data});
                    this.refreshPage();
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    }
</script>

<style scoped>
    #ruleVersion {
        width: 100%;
        height: 100%;
    }
</style>
