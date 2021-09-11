<template>
    <div>
        <el-button type="primary" size="mini" style="margin-left: 25px;margin-bottom: 15px" @click="decsEditBefore">编辑</el-button>
        <adapter-show :p-decs="pDecs" :p-type="tabType.decsInf" ref="adapterShow"></adapter-show>

        <!--编辑规则-->
        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="edit.dialog" class="new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">编辑决策
                        <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i></div>
                </div>
            </div>
            <el-form ref="editFrom" :model="edit.decs" :rules="editRules" label-width="100px" size="mini"
                     class="dialog-elform">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="产品ID:" prop="prodId">
                            <el-input v-model="edit.decs.prodId" disabled style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="决策ID:" prop="decsId">
                            <el-input disabled v-model="edit.decs.decsId" placeholder="决策Id（由小写字母、数字、下划线组成）"
                                      style="width: 100%"
                                      maxlength.trim="32" show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="决策名称:" prop="decsName">
                            <el-input v-model.trim="edit.decs.decsName" placeholder="决策名称" style="width: 100%"
                                      maxlength="50"
                                      show-word-limit></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="是否预处理:" prop="preHandle">
                            <el-select v-model="edit.decs.preHandle" style="width: 100%">
                                <el-option label="是" value="Y"></el-option>
                                <el-option label="否" value="N"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="接入类型:" prop="inteType">
                            <el-select v-model="edit.decs.inteType" clearable style="width: 100%">
                                <el-option label="http" value="H"></el-option>
                                <el-option label="kafka" value="K"></el-option>
                                <el-option label="sdk" value="S"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <el-form-item label="主键seqNo:">
                            <el-select v-model="edit.decs.seqNo" size="mini" multiple placeholder="请设置主键"
                                       style="width: 100%">
                                <el-option v-for="item in refFieldList"
                                           :key="item.getPrefixVarName()"
                                           filterable
                                           :label="`[${item.getPrefixVarName()}][${item.getDescVarName()}]`"
                                           :value="item.getPrefixVarName()">
                                    <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                    <span :title="item.getDescVarName()"
                                          class="option-right">{{item.getDescVarName()}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <template v-if="edit.decs.inteType === 'H'">
                    <el-form-item label="http地址:" class="mini-bottom-item">
                        <el-input style="width: 100%" disabled v-model="edit.decs.inteConf.uri"></el-input>
                    </el-form-item>
                </template>

                <template v-if="edit.decs.inteType === 'K'">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="集群地址:">
                                <el-input style="width: 100%" v-model="edit.decs.inteConf.bootstrapServer"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="topic:">
                                <el-input style="width: 100%" v-model="edit.decs.inteConf.topic"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="groupId:">
                                <el-input style="width: 100%" v-model="edit.decs.inteConf.groupId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="userName:">
                                <el-input style="width: 100%" v-model="edit.decs.inteConf.userName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                            <el-form-item label="password:" class="mini-bottom-item">
                                <el-input style="width: 100%" v-model="edit.decs.inteConf.password"
                                          show-password></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <template v-if="edit.decs.inteType === 'S'">
                    <el-form-item label="域名">
                        <el-input style="width: 50%" v-model="edit.decs.inteConf.mountUrl"></el-input>
                    </el-form-item>
                </template>

                <el-row class="clearfix">
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">解析报文格式</div>
                        <el-form-item prop="analysisJson" class="line-label-item">
                            <codemirror v-model="edit.decs.analysisJson" :options="cmOptions"
                                        :key="ajKey"
                                        style="line-height:20px;z-index: 5000"></codemirror>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div class="line-label">输入报文示例</div>
                        <el-form-item prop="inputExample" class="line-label-item">
                            <codemirror v-model="edit.decs.inputExample" :options="cmOptions"
                                        :key="ieKey"
                                        style="line-height:20px;z-index: 5000"></codemirror>
                        </el-form-item>
                    </el-col>
                </el-row>

                <template v-if="isNotEmpty(evVarList)">
                    <el-table
                            ref="multipleTable"
                            :data="evVarList"
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
                </template>
            </el-form>


            <template slot="footer">
                <el-button size="mini" @click="edit.dialog = false">取消</el-button>
                <el-button size="mini" type="success" @click="parseClick('editFrom', edit.decs.analysisJson, edit.decs.inputExample)">解析</el-button>
                <el-button type="primary" size="mini" @click="decsEditAfter">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import AdapterShow from "../../adapter-components/AdapterShow";
    import {tabType} from "../../../../entity/enumns";
    import {DecsBase} from "../../../../entity/decs";
    import {validateAJ, validateNullChar, validateVarSpChar} from "../../../common";
    import {getDecsById, updateDecs} from "../../../../api/Decs";
    import {isEmpty} from "../../../../utils";
    import {getUUID} from "../../../../components";
    import {evVarParse} from "../../../../api/Utils";
    import {EVar} from "../../../../entity/vars";

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
    export default {
        name: "AdapterInf",
        components: {AdapterShow},
        props: {pDecs: Object},
        data() {
            return {
                tabType: tabType,
                edit: {dialog: false, decs: new DecsBase()},
                evVarList: [],
                // 字段映射的引用
                refFieldList: [],
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
                editRules: {
                    prodId: [
                        {required: true, message: '请输入决策id', trigger: 'blur'},
                    ],
                    decsId: [
                        {required: true, message: '请输入决策id', trigger: 'blur'},
                    ],
                    preHandle: [
                        {required: true, message: '请选择是否需要预处理', trigger: 'change'},
                    ],
                    inteType: [
                        {required: true, message: '请选择接入类型', trigger: 'change'},
                    ],
                    decsName: [
                        {required: true, message: '请输入决策名', trigger: 'blur'},
                        {validator: validateNullChar, trigger: 'blur'},
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
            }
        },
        mounted() {
        },


        watch: {
            'edit.decs.analysisJson': {
                handler(value) {
                    //需要的引用字段列表
                    this.refFieldList = [];
                    evVarParse({analysisJson: value, inputExample: ""}).then(res => {
                        if (res.data.code === "E501") {
                            console.log(res.data.message)
                        } else {
                            let evVarList = res.data.data
                                .map(item => new EVar({varName: item.path, varDesc: item.desc, varType: item.type, varValue: item.value}));
                            //事件变量以及父节点的全局变量
                            this.refFieldList.push(...evVarList);
                        }
                    });
                },
                deep: true
            }
        },

        methods: {
            init() {
                this.$refs.adapterShow.init();
            },

            //点击解析
            parseClick(fromType, aj, ie) {
                let that = this;

                function setEVarList(res) {
                    let evVarList = res.data.data
                        .map(item => new EVar({
                            varName: item.path,
                            varDesc: item.desc,
                            varType: item.type,
                            varValue: item.value
                        }));
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
                        that.edit.decs.inputExample = JSON.stringify(JSON.parse(ie), null, 4);
                        that.edit.decs.analysisJson = JSON.stringify(JSON.parse(aj), null, 4);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 去帮助页面
            tohelperAdd() {
                window.open(this.helper.helpUri.uri + '/modules/decision/1.html#新增', "_blank")
            },

            getMatchHref(){
                return window.location.href.match(/[a-zA-z]+\.cmbchina\.cn/g);
            },

            // 编辑之前
            decsEditBefore() {
                let that = this;
                that.edit.dialog = true;
                getDecsById({decsId: that.pDecs.decsId, prodId: that.pDecs.prodId}).then((res) => {
                    that.$nextTick(() => {
                        that.$refs['editFrom'].resetFields();
                        that.edit.decs = new DecsBase(res.data.data);
                        let matchHref = that.getMatchHref();
                        if (isEmpty(matchHref)) {
                            console.warn("当前网址不是*.cmbchina.cn类型");
                            that.edit.decs.inteConf.uri = `http://${that.edit.decs.decsId.replace(/\_/g, "-")}.tcsdecs.paas.cmbchina.cn/exec`.toLowerCase()
                        } else {
                            that.edit.decs.inteConf.uri = `http://${that.edit.decs.decsId.replace(/\_/g, "-")}.tcsdecs.${matchHref[0].split(".")[0]}.cmbchina.cn/exec`.toLowerCase()
                            console.log(that.edit)
                        }

                        that.evVarList = [];
                        that.ajKey = getUUID();
                        that.ieKey = getUUID();
                    });
                });
            },

            // 编辑之后
            decsEditAfter() {
                let that = this;
                this.$refs['editFrom'].validate((valid) => {
                    if (valid) {
                        updateDecs({
                            prodId: that.gConfig.prodId.value,
                            decsId: that.edit.decs.decsId,
                            decsUpdateDto: {decsBase: that.edit.decs}
                        }).then(res => {
                            that.$message({message: '成功', type: 'success'});
                            that.edit = {dialog: false, decs: new DecsBase()};
                            Object.assign(that.pDecs, res.data.data)
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
