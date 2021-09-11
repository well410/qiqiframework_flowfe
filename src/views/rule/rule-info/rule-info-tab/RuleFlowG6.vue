<template>
    <div>
        <g6-editor ref="flow"
                   @drawerOpened="drawerOpenedRuleFlowClick"
                   @handleDebugBefore="handleDebugBefore"
                   @handleDebugAfter="handleDebugAfter"
                   @handleCheck="handleCheck"
                   @handlePublish="handlePublish"
                   @handleSave="handleSave"
                   @handleCopyDT="handleCopyDTBefore"
                   @doDebugOfMenu="doDebugOfMenuBefore"
                   :comp-list="componentList">
            <!--节点或者连线抽屉-->
            <template slot="drawer" slot-scope="data">
                <!--节点抽屉-->
                <template v-if="data.drawer.type === g6Enum.NODE.code">
                    <filter-edit
                            v-if="data.drawer.currItem.nData.compType === compEnums.FILTER.code"
                            :ref="data.drawer.currItem.nData.compType"
                            :decisionTree="data.decisionTree"
                            :node="data.drawer.currItem"
                            :p-rule="rule"
                            :filter-input-var-list="defaultInputVarList"
                    ></filter-edit>
                    <!--规则循环节点-->
                    <e-r-v-loop-edit v-if="data.drawer.currItem.nData.compType === compEnums.ER_LOOP.code"
                                     :ref="data.drawer.currItem.nData.compType"
                                     :decisionTree="data.decisionTree"
                                     :node="data.drawer.currItem"
                                     :p-rule="rule"
                                     :er-loop-input-var-list="defaultInputVarList"
                    ></e-r-v-loop-edit>
                    <!--外部规则节点-->
                    <ext-rule-v2-edit v-if="data.drawer.currItem.nData.compType === compEnums.ERV2.code"
                                      :ref="data.drawer.currItem.nData.compType"
                                      :decisionTree="data.decisionTree"
                                      :node="data.drawer.currItem"
                                      :p-rule="rule"
                                      :ext-rule-input-var-list="defaultInputVarList"></ext-rule-v2-edit>
                    <data-process-edit v-if="data.drawer.currItem.nData.compType === compEnums.DATA_PROCESS.code"
                                       :ref="data.drawer.currItem.nData.compType"
                                       :node="data.drawer.currItem"
                                       :decisionTree="data.decisionTree"
                                       :data-process-input-var-list="defaultInputVarList"></data-process-edit>
                    <aviator-script-edit v-if="data.drawer.currItem.nData.compType === compEnums.AVIATOR_SCRIPT.code"
                                         :ref="data.drawer.currItem.nData.compType"
                                         :node="data.drawer.currItem"
                                         :decisionTree="data.decisionTree"
                                         :aviator-script-input-var-list="defaultInputVarList"></aviator-script-edit>
                    <unit-rule v-if="data.drawer.currItem.nData.compType === compEnums.UR.code"
                               :ref="data.drawer.currItem.nData.compType"
                               :node="data.drawer.currItem"
                               :decisionTree="data.decisionTree"
                               :p-rule="rule"
                               :unit-rule-input-var-list="defaultInputVarList"></unit-rule>
                    <unit-rule-v2 v-if="data.drawer.currItem.nData.compType === compEnums.URV2.code"
                                  :ref="data.drawer.currItem.nData.compType"
                                  :node="data.drawer.currItem"
                                  :decisionTree="data.decisionTree"
                                  :p-decs="rule"
                                  :unit-rule-input-var-list="defaultInputVarList"></unit-rule-v2>
                    <!--todo 2021/5/21 这里去掉了变量平台节点，为了保证以前的也能展示，因此这里先不删除，后面如果规则中没有使用这个节点，自己按需删除-->
                    <var-edit-v2 v-if="data.drawer.currItem.nData.compType === compEnums.VarsV2.code"
                                 :ref="data.drawer.currItem.nData.compType"
                                 :node="data.drawer.currItem"
                                 :decisionTree="data.decisionTree"
                                 :var-edit-input-var-list="defaultInputVarList"></var-edit-v2>
                    <object-edit v-if="data.drawer.currItem.nData.compType === compEnums.Obj.code"
                                 :ref="data.drawer.currItem.nData.compType"
                                 :node="data.drawer.currItem"
                                 :decisionTree="data.decisionTree"
                                 :obj-input-var-list="defaultInputVarList"></object-edit>
                    <array-edit v-if="data.drawer.currItem.nData.compType === compEnums.Arr.code"
                                :ref="data.drawer.currItem.nData.compType"
                                :node="data.drawer.currItem"
                                :decisionTree="data.decisionTree"
                                :arr-input-var-list="defaultInputVarList"></array-edit>
                    <const-edie v-if="data.drawer.currItem.nData.compType === compEnums.Const.code"
                                :ref="data.drawer.currItem.nData.compType"
                                :decisionTree="data.decisionTree"
                                :node="data.drawer.currItem"></const-edie>
                    <!-- 规则结果节点 074389-->
                    <rule-result v-if="data.drawer.currItem.nData.compType === compEnums.RR.code"
                                 :ref="data.drawer.currItem.nData.compType"
                                 :node="data.drawer.currItem"
                                 :decisionTree="data.decisionTree"
                                 :rr-input-var-list="defaultInputVarList"
                                 :p-rule="rule"></rule-result>
                </template>
                <!--连线抽屉-->
                <template v-else-if="data.drawer.type === g6Enum.EDGE.code">
                    <edit-line
                            ref="edge"
                            :item="data.drawer.currItem"
                            :g6Editor="data.drawer.g6Editor"
                            :decisionTree="data.decisionTree"></edit-line>
                </template>
                <!--组合抽屉-->
                <template v-else-if="data.drawer.type === g6Enum.COMBO.code">
                    <edit-combo :ref="g6Enum.COMBO.code"
                                :item="data.drawer.currItem"
                                :g6Editor="data.drawer.g6Editor"
                                :decisionTree="data.decisionTree"></edit-combo>
                </template>
            </template>

            <!--测试时字段输入的弹框-->
            <template slot="debugDialog">
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
            </template>
        </g6-editor>

        <el-dialog
                :visible.sync="copyRuleJson.isShow"
                title="拷贝版本表流程图"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                :modal="false"
                :fullscreen="true">
            <div style="margin: 15px">
                <el-button @click="copyRuleJson.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="handleCopyDTAfter" size="mini">确 定</el-button>
            </div>

            <el-form size="mini" label-width="80px">
                <el-form-item label="版本信息">
                    <el-select
                            style="width: 100%"
                            v-model="copyRuleJson.selectVersion"
                            @change="onSelectVersionChange(copyRuleJson.selectVersion)"
                            filterable>
                        <el-option
                                v-for="item in copyRuleJson.versionList"
                                :key="item.ruleVersion"
                                :label="item.ruleVersion"
                                :value="item.ruleVersion">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <rule-show ref="decsShow" v-if="isNotEmpty(copyRuleJson.selectVersion)" :p-rule="copyRuleJson.selectRule" :p-type="tabType.ruleCitation"></rule-show>
        </el-dialog>

        <el-dialog
                :visible.sync="debugOneNode.isShow"
                title="单节点测试"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                :modal="false"
                width="800px">
            <el-form>
                <el-form-item label="输入报文" prop="req">
                    <codemirror v-model="debugOneNode.req" :options="cmOptions"
                                style="line-height:20px;z-index: 5000"></codemirror>

                </el-form-item>
                <el-form-item label="测试结果" v-if="debugOneNode.result !== ''">
                    <codemirror-show :p-code="debugOneNode.result"></codemirror-show>
                </el-form-item>
            </el-form>
            <template slot="footer" class="dialog-footer">
                <el-button @click="debugOneNode.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="doDebugOfMenuAfter" :loading="debugOneNode.loading" size="mini">确 定</el-button>
            </template>
        </el-dialog>

        <el-form v-if="debug.debugResult !== ''">
            <el-form-item label="测试结果:">
                <codemirror-show :p-code="debug.debugResult"></codemirror-show>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {Component} from "../../../../entity/model";
    import UnitRule from "../../../../components/rule-node/UnitRule";
    import {RuleBase} from "../../../../entity/rule";
    import EditLine from "../../../../components/line/editLine";
    import {
        checkRule,
        getRuleById,
        getTotalRuleVersionList,
        publishRule,
        testRule,
        testRuleOneNode,
        updateRuleBase
    } from "../../../../api/Rule";
    import {isEmpty, isNotEmpty, lsGet, lsSet} from "../../../../utils";
    import {RuleUpdateDto} from "../..";
    import CodemirrorShow from "../../../../components/codemirror/CodemirrorShow";
    import {RIVar} from "../../../../entity/vars";
    import {compEnums, tabType} from "../../../../entity/enumns";
    import VarEdit from "../../../../components/vars-node/v1/VarEdit";
    import ObjectEdit from "../../../../components/object-node/ObjectEdit";
    import {evVarParse} from "../../../../api/Utils";
    import ArrayEdit from "../../../../components/array-node/ArrayEdit";
    import ConstEdie from "../../../../components/const-node/ConstEdie";
    import {G6Model, GetRel, TestFun} from "../../../../entity/g6Model";
    import G6Editor from "../../../../components/g6-editor/g6-editor";
    import {g6Enum} from "../../../../components/g6-editor/entity/entity";
    import RuleResult from "../../../../components/result-node/RuleResult"
    import VarEditV2 from "../../../../components/vars-node/v2/VarEditV2";
    import AviatorScriptEdit from "../../../../components/aviator-script-node/AviatorScriptEdit";
    import Editor from "../../../../components/g6-editor/Base/Editor";
    import command from "../../../../components/g6-editor/command";
    import DataProcessEdit from "../../../../components/data-process-node/DataProcessEdit";
    import UnitRuleV2 from "../../../../components/rule-node-v2/UnitRuleV2";
    import {MyMessage, validateVarSpChar} from "../../../common";
    import ExtRuleV2Edit from "../../../../components/ext-rule-node/v2/ExtRuleV2Edit";
    import ERVLoopEdit from "../../../../components/er-loop-node/ERLoopEdit";
    import RuleShow from "../../rule-components/RuleShow";
    import FilterEdit from "../../../../components/filter-node/FilterEdit";
    import EditCombo from "../../../../components/combo/editCombo";

    export default {
        name: "RuleFlowG6",
        components: {
            EditCombo,
            FilterEdit,
            RuleShow,
            ERVLoopEdit,
            ExtRuleV2Edit,
            DataProcessEdit,
            AviatorScriptEdit,
            VarEditV2,
            G6Editor, ConstEdie, ArrayEdit, ObjectEdit, VarEdit, CodemirrorShow, EditLine, UnitRule, RuleResult,UnitRuleV2},
        props: {rule: RuleBase},

        data() {
            return {
                // 拷贝版本表 ruleJson
                copyRuleJson: {isShow: false, versionList: [], selectVersion: {}, selectRule: {}},

                // ===============规则调试=========================
                debugOneNode: {isShow: false, req: "{}", result: "", node: {}, loading : false},
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

                //==================组件================================
                componentList: [
                    compEnums.DATA_PROCESS,
                    compEnums.AVIATOR_SCRIPT,
                    compEnums.ERV2,
                    compEnums.UR,
                    compEnums.URV2,
                    compEnums.Obj,
                    compEnums.Arr,
                    compEnums.FILTER,
                    compEnums.Const,
                    compEnums.RR,
                    compEnums.ER_LOOP
                ],
                tabType: tabType,
                compEnums: compEnums,
                g6Enum: g6Enum,
                relVar: {riVarList: []},
                editor: {},
                command: null,
                isDecsFlow: true,

            }
        },
        created() {
            this.initData();
        },

        watch: {
            // 监听测试结果，修改节点状态
            'debug.debugResult': {
                handler(value) {
                    try {
                        let json = JSON.parse(value);
                        let success = [];
                        let error = [];
                        let that = this;

                        Object.keys(json['nLog']).forEach(item=>{
                            if (json['nLog'][item]['errorCodeList'].length > 0){
                                error.push(item);
                            } else {
                                success.push(item);
                            }
                        });

                        that.$refs['flow'].getGraph().getNodes().forEach(item=>{
                            // 初始化下，都设置为false
                            that.$refs['flow'].getGraph().setItemState(item, g6Enum.SUCCESS_TYPE.code, false);
                            that.$refs['flow'].getGraph().setItemState(item, g6Enum.ERROR_TYPE.code, false);

                            // 根据返回结果，设置状态
                            success.includes(item.getModel()['nData']['uniqueName']) && true && that.$refs['flow'].getGraph().setItemState(item, g6Enum.SUCCESS_TYPE.code, true);
                            error.includes(item.getModel()['nData']['uniqueName']) && true && that.$refs['flow'].getGraph().setItemState(item, g6Enum.ERROR_TYPE.code, true);
                        })
                    } catch (e) {
                        console.error("测试结果中修改节点状态失败")
                    }
                },
                deep: true
            }
        },

        computed: {
            /**
             * 现在定义一个默认的输入变量，仅包含规则的输入
             * @returns {Array}
             */
            defaultInputVarList(){
                let result = [];
                result.push(...this.relVar.riVarList);
                return result;
            },

        },

        methods: {
            // 从版本表中拷贝ruleJson
            handleCopyDTBefore(){
                let that = this;
                that.copyRuleJson.isShow = false;
                that.copyRuleJson.versionList = [];
                that.copyRuleJson.selectRule = {};
                that.copyRuleJson.selectVersion = '';

                let param = {prodId: that.rule.prodId, ruleId: that.rule.ruleId};
                getTotalRuleVersionList(param).then(res => {
                    that.copyRuleJson.versionList = res.data.data;
                    that.copyRuleJson.isShow = true;
                })
            },

            // 从版本表中拷贝ruleJson
            handleCopyDTAfter(){
                isNotEmpty(this.copyRuleJson.selectVersion) && this.$refs.flow.setDecisionTree(JSON.parse(this.copyRuleJson.selectRule.ruleJson));
                this.copyRuleJson.isShow = false;
            },

            // 版本选择改变的时候
            onSelectVersionChange(version){
                if (isEmpty(version)){
                    this.copyRuleJson.selectRule = {};
                } else {
                    this.copyRuleJson.selectRule = this.copyRuleJson.versionList.filter(item=>item.ruleVersion === version)[0];
                    this.$nextTick(()=>{
                        this.$refs['decsShow'].init();
                    })

                }
            },

            initData() {
                this.editor = new Editor();
                this.command = new command(this.editor);
                this.isDecsFlow =  true;
            },

            doDebugOfMenuBefore(item){
                let that = this;
                this.$confirm('单节点测试前先保存规则', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    that.handleSave().then(()=>{
                        that.debugOneNode.isShow = true;
                        that.debugOneNode.node = item.getModel();
                        const varList = TestFun.getUseVarOneNode(that.getDecisionTree(), that.rule, that.debugOneNode.node, that.defaultInputVarList);
                        that.debugOneNode.req = JSON.stringify(TestFun.varListToMap(varList), null, 4);
                    });
                }).catch(() => {});
            },

            doDebugOfMenuAfter(){
                let that = this;
                const drlCode = TestFun.getDrlCodeOneNode(that.getDecisionTree(), that.rule, that.debugOneNode.node);
                const req = JSON.parse(that.debugOneNode.req);
                const prodId = that.gConfig.prodId.value;
                const ruleId = that.rule.ruleId;
                let params = {req, prodId, ruleId, drlCode};
                that.debugOneNode.loading = true;
                testRuleOneNode(params).then(res=>{
                    if (res.data.data.success) {
                        that.debugOneNode.result = JSON.stringify(res.data.data.data, null, 4);
                        that.$message({type: 'info', message: '测试结果返回'});
                    } else {
                        that.$message({type: 'warning', message: '测试异常'});
                        that.debugOneNode.result = res.data.data.message;
                    }
                }).finally(()=>{
                    that.debugOneNode.loading = false;
                })
            },

            getDecisionTree() {
                return this.$refs.flow.getDecisionTree();
            },

            // 抽屉打开完成初始化抽屉中的数据
            drawerOpenedRuleFlowClick(drawer) {
                let ele = null;
                switch (drawer.type) {
                    case g6Enum.NODE.code:
                        ele = this.$refs[drawer.currItem.nData.compType];
                        if (isEmpty(ele) || isEmpty(ele.init)) {
                            console.error(`flow-edit draw ${drawer.currItem.nData.compType}插槽节点未找到`);
                            return
                        }
                        ele.init();
                        break;
                    case g6Enum.EDGE.code:
                        ele = this.$refs[g6Enum.EDGE.code];
                        if (isEmpty(ele) || isEmpty(ele.init)) {
                            console.error(`flow-edit draw ${drawer.currItem.type}插槽节点未找到`);
                            return
                        }
                        ele.init();
                        break;
                    case g6Enum.COMBO.code:
                        ele = this.$refs[g6Enum.COMBO.code];
                        if (isEmpty(ele) || isEmpty(ele.init)) {
                            console.error(`combo插槽节点未找到`);
                            return
                        }
                        ele.init();
                        break;
                }
            },


            // 发布规则
            handlePublish() {
                let that = this;
                this.$confirm('确定要发布版本吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    let params = {prodId: this.gConfig.prodId.value, ruleId: that.rule.ruleId};
                    publishRule(params).then(res => {
                        that.$message({message: res.data.data, type: "success"});
                        getRuleById(params).then(res => {
                            that.rule.status = res.data.data.status
                        })
                    });
                }).catch(() => {
                });
            },

            // 校验规则
            handleCheck() {
                let that = this;
                let checkFun = () => {
                    let params = {prodId: this.gConfig.prodId.value, ruleId: this.rule.ruleId};
                    checkRule(params).then(res => {
                        if (res.data.data['success']) {
                            that.$message({message: "验证成功", type: "success"});
                            getRuleById(params).then(res => {
                                that.rule.status = res.data.data.status
                            })
                        } else {
                            this.$alert(res.data.data['result'], '验证结果', {
                                confirmButtonText: '确定',
                                callback: action => {}
                            });
                        }
                    })
                };

                that.$confirm('验证前会先保存规则', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    that.handleSave(checkFun);
                }).catch(() => {});
                console.log("checkRule")
            },




            // 测试之前
            handleDebugBefore(debugDialog) {
                let that = this;
                this.$confirm('测试前会先保存规则', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    that.handleSave();
                    that.debugResult = '';
                    debugDialog.isShow = true;
                    that.setReq();
                }).catch(() => {
                });
                console.log("debugClick")
            },

            // 测试规则
            handleDebugAfter(debugDialog) {
                let that = this;
                // 前端缓存测试的字段
                lsSet(that.rule.ruleId, that.debug.req);
                that.$refs['debugForm'].validate((valid) => {
                    if (valid) {
                        debugDialog.isLoading = true;
                        testRule({
                            prodId: this.gConfig.prodId.value,
                            req: JSON.parse(that.debug.req),
                            ruleId: this.rule.ruleId
                        }).then(res => {
                            if (res.data.data.success) {
                                that.debug.debugResult = JSON.stringify(res.data.data.data, null, 4);
                                that.$message({type: 'info', message: '测试结果返回'});
                            } else {
                                that.$message({type: 'warning', message: '测试异常'});
                                that.debug.debugResult = res.data.data.message;
                            }
                        }).finally(() => {
                            debugDialog.isLoading = false;
                        })
                    }
                })
            },

            // 保存规则
            async handleSave(callBack) {
                let that = this;
                MyMessage.versionMessage(that.getDecisionTree());
                let rule = new RuleBase(JSON.parse(JSON.stringify(that.rule)));
                // 将json对象转换为字符串
                rule.ruleJson = JSON.stringify(that.getDecisionTree());
                rule.ruleDrl = G6Model.getDrlCode(that.getDecisionTree(), that.rule);
                let funRelList = GetRel.getFuncRelList(rule, that.getDecisionTree());
                let varsRelList = GetRel.getVarsRelList(rule, that.getDecisionTree());
                let dsRelList = GetRel.getDSRelList(rule, that.getDecisionTree());
                let pRuleCRuleRelList = GetRel.getPRuleCRuleRelList(rule, that.getDecisionTree());
                let ruleUpdateDto = new RuleUpdateDto({
                    ruleBase: rule,
                    funcRelList: funRelList,
                    varsRelList: varsRelList,
                    dsRelList: dsRelList,
                    pRuleCRuleRelList: pRuleCRuleRelList,
                });
                let params = {ruleUpdateDto: ruleUpdateDto, prodId: that.gConfig.prodId.value, ruleId: rule.ruleId};
                updateRuleBase(params).then(res => {
                    that.$message({message: "保存成功", type: "success"});
                    Object.assign(that.rule, res.data.data);
                    that.initVarList();
                    if (isNotEmpty(callBack)) callBack();
                });
            },


            /**
             * 初始化规则流程图
             */
            init() {
                try {
                    let that = this;
                    // 1. 初始化规则图
                    if (isNotEmpty(that.rule.ruleJson)) that.$refs.flow.setDecisionTree(JSON.parse(that.rule.ruleJson));
                    // 2 初始化变量
                    if (isNotEmpty(that.rule.analysisJson)) that.initVarList();

                    that.debug.req = JSON.parse(JSON.stringify(this.rule)).inputExample;
                } catch (e) {
                    console.error("RuleFlow初始化失败", e)
                }
            },

            // 测试前从前端读取缓存
            setReq(){
                const cacheReq = lsGet(this.rule.ruleId);
                if (isNotEmpty(cacheReq)) {
                    if (!(typeof cacheReq === 'object')) {
                        this.debug.req = lsGet(this.rule.ruleId)
                    }


                }
            },

            initVarList() {
                let that = this;
                let aj = that.rule.analysisJson;
                let ie = that.rule.inputExample;


                // 初始化事件变量（String，Double，Date，Integer，object，array类型）
                function setEVarList(res) {
                    let rivVarList = res[0].data.data
                        .map(item => new RIVar({
                            varName: item.path,
                            varDesc: item.desc,
                            varType: item.type,
                            ruleId: that.rule.ruleId
                        }));
                    that.relVar.riVarList = rivVarList;
                }

                Promise.all(
                    [
                        evVarParse({analysisJson: aj, inputExample: ie}),
                    ]
                ).then(res => {
                    setEVarList(res);
                })
            }

        }
    }
</script>

<style scoped>

</style>
