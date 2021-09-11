<template>
    <div id="modelInterfaceDebug">
        <el-card>
            <div class="modelCmpt">
                <el-form @submit.native.prevent :inline="true" size="small">
                    <el-form-item label="组件ID">
                        <el-input v-model="modelInterfaceDto.cmptIdWithoutPrefix" placeholder="请输入组件ID"
                                  :readonly="act !== actType.modelAdd"
                                  maxlength="20"
                                  show-word-limit>
                            <template slot="prepend">{{prefixOfCmpt}}</template>
                        </el-input>
                        <div class="sub-title" v-if="act !== 'model-add'">
                            模型文件：<el-link :underline="false" icon="el-icon-link" @click="downloadPmml()">
                                {{rawModelFile = modelInterfaceDto.rawModelFile}}
                                </el-link>                        
                        </div>
                    </el-form-item>
                    <el-form-item label="组件名">
                        <el-input v-model="modelInterfaceDto.cmptName" placeholder="请输入组件名"
                                  maxlength="50"
                                  :readonly="act !== actType.modelAdd && act !== actType.modelEdit"
                                  show-word-limit></el-input>
                    </el-form-item>                 
                    <el-form-item>
                        <el-upload
                            :on-change="handleChange"
                            :file-list="fileList"
                            ref="upload"
                            :headers="headers"
                            :data="modelInterfaceDto"
                            :before-upload="beforeUpload"
                            :on-remove="onRemove"
                            :auto-upload="false"
                            :limit="2"
                            accept=".pmml, .xml"
                            :disabled="act === 'model-version'"
                            action="">
                            <el-button  style="margin-right: 10px;" type="primary" slot="trigger" icon="el-icon-upload" v-if="act !== 'model-version'">选取模型文件</el-button>
                            <el-button type="primary" @click="sendClick" :loading="sendBtnLoading" v-if="act !== actType.modelAdd">测试</el-button>
                            <el-button type="primary" @click="saveClick" v-if="act !== actType.modelVersion">保存</el-button>
                            <div slot="tip" class="el-upload__tip" v-if="act !== actType.modelVersion" >只能上传pmml/xml模型文件，且不超过10mb</div>                                                   
                        </el-upload>                     
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <el-row style="margin: 10px 0">
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="padding-right: 20px">
                        <div name="requestBody" >
                                <div class="code-body-header">
                                    <span>RequestBody</span>
                                    <i class="header-icon el-icon-info"></i>
                                </div>
                            <json-editor v-model="modelInterfaceDto.requestBody" @changed="jsonEditorChange" ref="configJsonEditorForRequestBody"></json-editor>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div name="requestBody">
                            <div>
                                <div class="code-body-header">
                                    <span>RequestBody</span>
                                    <i class="header-icon el-icon-info"></i>
                                </div>
                            </div>
                            <json-editor v-model="modelInterfaceDto.requestBodyWithValue" ref="debugJsonEditor"></json-editor>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="padding-right: 20px">
                        <div>
                            <div class="code-body-header">
                                <div title="响应报文解析">
                                    <span>ResponseAnalysis</span>
                                    <i class="header-icon el-icon-info"></i>
                                </div>
                            </div>
                            <json-editor v-model="modelInterfaceDto.responseAnalysisForDisplay" ref="debugJsonEditorForResponseAnalysis"></json-editor>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                        <div name="responseAnalysis">
                            <div class="code-body-header">
                                <div title="响应报文">
                                    <span>Response</span>
                                    <i class="header-icon el-icon-info"></i>
                                </div>
                            </div>
                            <el-form v-if="haveResponse">
                                <el-form-item>
                                    <json-editor v-model="jsonData" :read-only="readOnlyForResponse"></json-editor>
                                </el-form-item>
                            </el-form>
                            <el-form v-else>
                                <el-form-item>
                                    <span>点击测试按钮获取Response</span>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>

            </div>
        </el-card>
    </div>
</template>

<script>
    import {tabType, actType, prefixOfCmpt, paramType, required, routePath,
        getInputExample, getAnalysisJson, checkInterfaceDto, getChangeType, checkModelDto} from "../common/common";
    import {statusTypeConstants} from "../../constants/status-type";
    import {changeTypeConstants} from "../../constants/change-type";
    import {exceptionCodeConstants} from "../../constants/exception-code";
    import {Prod} from "../../entity/prod";
    import {requestTypeList, checkURIVariablesValue} from "./model-interface";
    import JsonEditor from "../../components/json-util/json-util";
    import {errorTip, successTip, warningTip, isEmpty, isEmptyArray, isNotEmpty, extractValueInBrace} from "../../utils/tools";
    import {saveCmptBase, saveCmptModelBase, testModelInterafce, downloadCmptModelFile} from "../../api/cmpt-interface";
    import FileSaver from "file-saver";
    import "./model-interface.less";

    import "codemirror/lib/codemirror.css";
    import "codemirror/addon/hint/show-hint.css";
    import "codemirror/theme/idea.css"

    import "codemirror/mode/javascript/javascript"
    import "codemirror/addon/edit/matchbrackets"
    import "codemirror/addon/selection/active-line"
    import "codemirror/addon/hint/show-hint"
    import "codemirror/addon/hint/javascript-hint"

    import "codemirror/addon/lint/lint";
    import "codemirror/addon/lint/lint.css";
    import "codemirror/addon/lint/json-lint";

    require("script-loader!jsonlint");

    // lib
    import _CodeMirror from 'codemirror'

    const CodeMirror = window.CodeMirror || _CodeMirror

    export default {
        name: "ModelInterfaceDebug",
        props: ['modelInterfaceDto'],
        components: {JsonEditor},
        data () {
            return {
                fileList: [],
                headers: {
						'Content-Type': 'multipart/form-data'
				},
                // =====接口内容=====
                requestTypeList: requestTypeList,
                paramType: paramType,
                required: required,
                prod: new Prod(),
                // =====标题=====
                title: '',
                //=====response=====
                jsonData: '',
                // =====面包屑=====
                tabType: tabType,
                // =====发送按钮加载=====
                sendBtnLoading: false,
                // =====是否有Response=====
                haveResponse: false,
                readOnlyForResponse: true,
                // =====操作=====
                actType: actType,
                act: '',
                // =====状态=====
                statusTypeConstants: statusTypeConstants,
                // =====操作类型=====
                changeTypeConstants: changeTypeConstants,
                // =====组件名固定前缀=====
                prefixOfCmpt: '',
                //异常码
                exceptionCodeConstants: exceptionCodeConstants,
                // =====折叠面板打开的面板=====
                activeName: ['pathVariable', 'requestParam', 'requestBody'],
                isEmpty: isEmpty,
                // =====路由路径=====
                routePath: routePath,
                // 错误提示信息
                //pathVariableErrorMsg: '',
                //requestParamErrorMsg: '',
                rawModelFile: '',
                codeCmOptions: {
                    //使用的语言
                    mode: "text/javascript",
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
                    readOnly: false,
                    // 代码提示
                    // hint: CodeMirror.,
                    extraKeys: {"Tab": "autocomplete"},
                    autocomplete: true,
                    hintOptions: {
                        completeSingle: false
                    }
                },
            };
        },

        computed: {
        },

        methods: {
            onRemove(file, fileList) {
                this.fileList = fileList;
            },

            handleChange(file, fileList) {
                this.fileList = [fileList[fileList.length - 1]];
                this.modelInterfaceDto.uploadModelFile =  this.fileList[0].name;
            },

            beforeUpload(file) {
                let isLt10M = file.size / 1024 / 1024 < 10;

                if (!isLt10M) {
                    errorTip( '上传模型文件不能超过10MB!');
                }

                return isLt10M;

            },

            downloadPmml() {
                downloadCmptModelFile(this.prod.prodId, this.modelInterfaceDto.cmptId).then(res => {
                    if(isNotEmpty(res.data)) {
                        let blob = new Blob([res.data], {
                            type: "application/xml"
                        });
                        if(isNotEmpty(this.modelInterfaceDto.inteConf.rawModelFile))
                            FileSaver.saveAs(blob, this.modelInterfaceDto.inteConf.rawModelFile);
                        else
                            FileSaver.saveAs(blob, this.modelInterfaceDto.inteConf.modelFile);
                    }
                });
            },

            changeHint() {
                const hintWords = ("break case catch let continue default else false finally for function " +
                    "if in null return switch true try typeof while nil").split(" ");

                function filterKeyWords(keywords, token) {
                    return keywords.filter(item => (item.includes(token.string) && token.string.trim() !== ''))
                }

                function scriptHint(editor, keywords, getToken, options) {
                    let cur = editor.getCursor(), token = getToken(editor, cur);

                    return {
                        list: filterKeyWords(keywords, token),
                        from: CodeMirror.Pos(cur.line, token.start),
                        to: CodeMirror.Pos(cur.line, token.end)
                    };
                }

                function aviatorScriptHint(editor, options) {
                    return scriptHint(editor, hintWords, function (e, cur) {
                        return e.getTokenAt(cur);
                    }, options);
                }

                CodeMirror.registerHelper("hint", "javascript", aviatorScriptHint);
            },

            initData () {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
                this.prefixOfCmpt = this.prod.prodId + '_' + prefixOfCmpt;
                this.act = this.$route.query['act'] === undefined ? '' : this.$route.query['act'];
                this.codeCmOptions.readOnly = (this.act !== actType.modelAdd && this.act !== actType.modelEdit);
                
            },

            saveClick (fromParent) {
                let that = this;
                that.modelInterfaceDto['cmptId'] = that.prefixOfCmpt + that.modelInterfaceDto['cmptIdWithoutPrefix'];
                let conf = {modelFile:'', rawModelFile:''};
                conf.modelFile = that.modelInterfaceDto['cmptId'];
                conf.rawModelFile = that.rawModelFile;
                that.modelInterfaceDto['status'] = that.statusTypeConstants.DRAFT.value;
                that.modelInterfaceDto['changeType'] = getChangeType(that.act);               
                if(that.fileList.length > 0) {
                    if(checkModelDto(that.modelInterfaceDto)) { // 有文件的话只检查 ID、名字、文件
                        let isLt10M = that.fileList[0].size / 1024 / 1024 < 10;
                        if (!isLt10M) {
                            errorTip( '上传模型文件不能超过10MB!');
                            return;
                        }                        
                        conf.rawModelFile = that.fileList[0].name;
                        that.modelInterfaceDto['inteConf'] = JSON.stringify(conf);
                        that.modelInterfaceDto['analysisJson'] = "{}";
                        that.modelInterfaceDto['inputExample'] = "{}";                    
                        that.modelInterfaceDto['responseAnalysis'] = "{}";                         
                        let param = new FormData();
					    that.fileList.forEach(
						    (val, index) => {
                                param.append("file", val.raw);
						    }
                        );
                        param.append("cmptBase", JSON.stringify(that.modelInterfaceDto));
                        saveCmptModelBase(that.prod.prodId, that.act, param).then(() => {
                            let msg = that.act === that.actType.modelAdd ? '新增组件成功' : '配置组件成功';
                            successTip(msg);
                            that.$emit('save', false);
                            if(fromParent === true) { //如果是回退触发的保存，什么也做
                                that.$router.push({path: that.routePath.modelBasePath});
                            } else {
                                if (that.act === actType.modelAdd) {
                                    //this.$router.push({path: this.routePath.modelBasePath}); 
                                    that.$router.push({
                                        path: that.routePath.modelActionPath,
                                        query: {cmptId: that.modelInterfaceDto.cmptId, act: that.actType.modelEdit, title: '模型组件'}
                                    });
                                }

                                setTimeout(() => {
                                    that.$router.go(0);
                                }, 500);
                            }
                        }).catch((res) => {
                            // errorTip('配置组件失败，' + res.message);
                        });                                                                       
                    }
                } else {
                    if(that.act === actType.modelAdd) {
                        warningTip('请选取模型文件！');
                        return;                            
                    }

                    if(checkInterfaceDto(this.modelInterfaceDto)) { //无文件则检查全部输入
                        that.modelInterfaceDto['inteConf'] = JSON.stringify(conf);
                        that.modelInterfaceDto['analysisJson'] = JSON.stringify(JSON.parse(this.modelInterfaceDto['requestBody']));;
                        that.modelInterfaceDto['inputExample'] = JSON.stringify(JSON.parse(this.modelInterfaceDto['requestBodyWithValue']));;                    
                        that.modelInterfaceDto['responseAnalysis'] = JSON.stringify(JSON.parse(this.modelInterfaceDto['responseAnalysisForDisplay']));                        
                        saveCmptBase(that.prod.prodId, that.act, that.modelInterfaceDto).then(() => {
                            that.$emit('save', false);
                            successTip('配置组件成功');
                        }).catch((res) => {
                            // errorTip('配置组件失败，' + res.message);
                        }).finally(() => {
                        });                        
                    }
                }

                /*
                if ((this.fileList.length > 0 && checkModelDto(this.modelInterfaceDto)) || (this.fileList.length === 0 && checkInterfaceDto(this.modelInterfaceDto))) {
                    this.modelInterfaceDto['cmptId'] = this.prefixOfCmpt + this.modelInterfaceDto['cmptIdWithoutPrefix'];
                    this.modelInterfaceDto['analysisJson'] = JSON.stringify(JSON.parse(this.modelInterfaceDto['requestBody']));;
                    this.modelInterfaceDto['inputExample'] = JSON.stringify(JSON.parse(this.modelInterfaceDto['requestBodyWithValue']));;                    
                    this.modelInterfaceDto['responseAnalysis'] = JSON.stringify(JSON.parse(this.modelInterfaceDto['responseAnalysisForDisplay']));
                    let conf = {modelFile:'', rawModelFile:''};
                    conf.modelFile = this.modelInterfaceDto['cmptId'];
                    conf.rawModelFile = this.rawModelFile;
                    
                    this.modelInterfaceDto['status'] = this.statusTypeConstants.DRAFT.value;
                    this.modelInterfaceDto['changeType'] = getChangeType(this.act);
                    let that = this;

                    if(that.fileList.length > 0) {
                        let isLt10M = that.fileList[0].size / 1024 / 1024 < 10;
                        conf.rawModelFile = that.fileList[0].name;
                        that.modelInterfaceDto['inteConf'] = JSON.stringify(conf);
                        if (!isLt10M) {
                            errorTip( '上传模型文件不能超过10MB!');
                            return;
                        }
                        let param = new FormData();
					    that.fileList.forEach(
						    (val, index) => {
                                param.append("file", val.raw);
						    }
                        );
                        param.append("cmptBase", JSON.stringify(this.modelInterfaceDto));
                        saveCmptModelBase(this.prod.prodId, this.act, param).then(() => {
                            let msg = that.act === that.actType.modelAdd ? '新增组件成功' : '配置组件成功';
                            successTip(msg);
                            that.$emit('save', false);
                            if (this.act === actType.modelAdd) {
                                //this.$router.push({path: this.routePath.modelBasePath}); 
                                this.$router.push({
                                    path: that.routePath.modelActionPath,
                                    query: {cmptId: that.modelInterfaceDto.cmptId, act: that.actType.modelEdit, title: '模型组件'}
                                });
                            }
                            setTimeout(() => {
                                that.$router.go(0);
                                }, 500);                          
                        }).catch((res) => {
                            // errorTip('配置组件失败，' + res.message);
                        }); 
                    } else {
                        if(that.act === actType.modelAdd) {
                            warningTip('请选取模型文件！');
                            return;                            
                        } else { //编辑
                            that.modelInterfaceDto['inteConf'] = JSON.stringify(conf);
                            saveCmptBase(this.prod.prodId, this.act, this.modelInterfaceDto).then(() => {
                                that.$emit('save', false);
                                successTip('配置组件成功');
                            }).catch((res) => {
                                // errorTip('配置组件失败，' + res.message);
                            }).finally(() => {
                                //that.modelInterfaceDto['inteConf'] = conf;
                            });
           
                        }
                    }
                } */
            },
            readTimeOutChange(readTimeOut){
                this.$emit("readTimeOutChange", readTimeOut);
            },

            jsonEditorChange (value) {
                this.setRequestBodyWithValue(value)
            },
            setRequestBodyWithValue (value) {
                if (!isEmpty(value)) {
                    try {
                        let requestBodyWithValue = JSON.parse(value);
                        this.joinValue(requestBodyWithValue);
                        this.$set(this.modelInterfaceDto, 'requestBodyWithValue', requestBodyWithValue);
                    } catch (e) {
                        this.$set(this.modelInterfaceDto, 'requestBodyWithValue', '');
                    }
                }
            },
            /**
             * 设置调试参数值模板（递归）
             * */
            joinValue (requestBodyWithValue) {
                for (let key in requestBodyWithValue) {
                    if (!requestBodyWithValue.hasOwnProperty(key)) continue;
                    let cmptVar = requestBodyWithValue[key];
                    if (cmptVar instanceof Object) {
                        this.joinValue(cmptVar);
                    } else if (cmptVar instanceof Array) {
                        for (let i in cmptVar) {
                            if (!cmptVar.hasOwnProperty(i)) continue;
                            this.joinValue(cmptVar[i]);
                        }
                    } else {
                        requestBodyWithValue[key] = "";
                    }
                }
            },

            sendClick () {
                try {
                    this.sendBtnLoading = true;
                    this.readOnlyForResponse = false;
                    this.modelInterfaceDto['inputExample'] = JSON.stringify(JSON.parse(this.modelInterfaceDto['requestBodyWithValue']));
                    let conf = {modelFile:''};
                    if(isNotEmpty(this.modelInterfaceDto['cmptVersion'])) {
                        conf.modelFile = this.modelInterfaceDto['cmptVersion'];
                        //this.modelInterfaceDto['inteConf'] = this.modelInterfaceDto['cmptVersion'];
                    }
                    else {
                        //this.modelInterfaceDto['inteConf'] = this.modelInterfaceDto['cmptId'];
                        conf.modelFile = this.modelInterfaceDto['cmptId'];
                    }
                    this.modelInterfaceDto['inteConf'] = JSON.stringify(conf);
                    let that = this;
                    testModelInterafce(that.prod.prodId, that.modelInterfaceDto).then((res) => {
                        let _data = res.data.data;
                        if (_data.code === exceptionCodeConstants.E701.code) {
                            that.jsonData = JSON.stringify(JSON.parse(_data), null, 4);
                        }
                        else {
                            that.jsonData = _data
                        }
                    }).catch((res) => {
                        let jsonDataTmp = '无法获取任何Response：' + '执行模型时发生错误！';
                        that.jsonData = JSON.stringify(jsonDataTmp, null, 4);
                        // errorTip('调试接口失败，' + res.message)
                    }).finally(() => {
                        //that.modelInterfaceDto['inteConf'] = conf;
                        setTimeout(() => {
                            this.readOnlyForResponse = true;
                            this.haveResponse = true;
                            this.sendBtnLoading = false;
                        }, 50);
                    });                                        
                } catch (err) {
                    errorTip("调试组件异常，" + err.toString());
                } finally {
                    setTimeout(() => {
                        this.sendBtnLoading = false;
                    }, 500);
                }
            },

            /**
             * 刷新编辑器
             * */
            refresh () {
                this.$refs.debugJsonEditor.refresh();
                this.$refs.debugJsonEditorForResponseAnalysis.refresh();
            }
        },
        mounted () {
            let that = this;
            that.initData();
            that.changeHint()
        },
        watch: {
            'modelInterfaceDto' : {
                handler (newVal) {
                },
                deep: true
            }
        }
    }
</script>
<style>

    #modelInterfaceDebug .el-card__body{
        min-height: 760px;
    }


</style>
