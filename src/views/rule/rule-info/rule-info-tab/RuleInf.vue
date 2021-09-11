<template>
    <div>
        <el-button type="primary" size="mini" style="margin-left: 25px;margin-bottom: 15px" @click="ruleEditBefore">编辑</el-button>
        <rule-show :p-rule="rule" :p-type="tabType.ruleInf" ref="ruleShow"></rule-show>


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
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="产品ID:" prop="prodId">
                            <el-input v-model="edit.rule.prodId" disabled style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="规则ID:" prop="ruleId">
                            <el-input disabled v-model.trim="edit.rule.ruleId" placeholder="规则Id（英文并不包括特殊字符）" style="width: 100%"
                                      maxlength="32" show-word-limit></el-input>
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
                <el-row class="clearfix">
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">解析报文格式</div>
                        <el-form-item prop="analysisJson"  class="line-label-item" >
                            <codemirror v-model="edit.rule.analysisJson" :options="cmOptions"
                                        :key="ajKey"
                                        style="line-height:20px;z-index: 10000"></codemirror>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">输入报文示例</div>
                        <el-form-item prop="inputExample"  class="line-label-item" >
                            <codemirror v-model="edit.rule.inputExample" :options="cmOptions"
                                        :key="ieKey"
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
                        <el-table-column prop="varValue" label="字段值">
                            <template slot-scope="scope">
                                {{JSON.stringify(scope['row'].varValue)}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>

            <template slot="footer">
                <el-button size="mini" @click="edit.dialog = false">取消</el-button>
                <el-button size="mini" type="success"
                           @click="parseClick('editFrom', edit.rule.analysisJson, edit.rule.inputExample)">解析
                </el-button>
                <el-button type="primary" size="mini" @click="ruleEditAfter">确定</el-button>
            </template>
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

    require("script-loader!jsonlint");

    import RuleShow from "../../rule-components/RuleShow";
    import {RuleBase} from "../../../../entity/rule";
    import {tabType} from "../../../../entity/enumns";
    import {getRuleById, updateRuleBase} from "../../../../api/Rule";
    import {RuleUpdateDto} from "../../index";
    import {getUUID} from "../../../../components";
    import {validateAJ, validateNullChar, validateVarSpChar} from "../../../common";
    import {RIVar} from "../../../../entity/vars";
    import {evVarParse} from "../../../../api/Utils";


    export default {
        name: "RuleInf",
        components: {RuleShow},
        props: {rule: RuleBase},
        data() {
            return {
                tabType : tabType,
                edit: {dialog: false, rule: new RuleBase()},
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
                    ],
                    analysisJson: [
                        {required: true, message: '请输入解析报文格式', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                        {validator: validateAJ, trigger: 'blur'},
                    ],
                    inputExample: [
                        {required: true, message: '请输入输入报文示例', trigger: 'blur'},
                        {validator: validateVarSpChar, trigger: 'blur'},
                    ]
                },
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
                riVarList: [],
            }
        },
        mounted() {
        },
        methods:{
            init(){
                this.$refs.ruleShow.init();
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
                        that.edit.rule.inputExample = JSON.stringify(JSON.parse(ie), null, 4);
                        that.edit.rule.analysisJson = JSON.stringify(JSON.parse(aj), null, 4);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 去帮助页面
            tohelperAdd(){
                window.open(this.helper.helpUri.uri+'/modules/decision/2.html#新增',"_blank")
            },

            // 规则编辑之前（弹出弹框）
            ruleEditBefore() {
                let that = this;
                that.edit.dialog = true;
                getRuleById({ruleId: that.rule.ruleId, prodId: that.rule.prodId}).then((res) => {
                    that.$nextTick(()=>{
                        that.$refs['editFrom'].resetFields();
                        that.edit.rule =  new RuleBase(res.data.data);
                        that.riVarList = [];
                        that.ajKey = getUUID();
                        that.ieKey = getUUID();
                    });
                })

            },

            // 规则编辑之后（弹出弹框）
            ruleEditAfter() {
                let that = this;
                that.$refs['editFrom'].validate((valid) => {
                    if (valid) {
                        let ruleUpdateDto = new RuleUpdateDto({ruleBase: that.edit.rule});
                        updateRuleBase({
                            prodId:this.gConfig.prodId.value,
                            ruleUpdateDto: ruleUpdateDto,
                            ruleId: that.edit.rule.ruleId
                        }).then(res => {
                            that.$message({message: '成功', type: 'success'});
                            that.edit.dialog = false;
                            Object.assign(that.rule, res.data.data)
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },


        }
    }
</script>

<style scoped>

</style>
