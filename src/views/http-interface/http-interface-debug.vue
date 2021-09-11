<template>
    <div id="httpInterfaceDebug">
        <el-card>
            <div class="httpCmpt">
                <el-form @submit.native.prevent :inline="true" size="small">
                    <el-form-item label="组件ID">
                        <el-input v-model="httpInterfaceDto.cmptIdWithoutPrefix" placeholder="请输入组件ID"
                                  :readonly="act !== actType.httpAdd"
                                  maxlength="20"
                                  show-word-limit>
                            <template slot="prepend">{{prefixOfCmpt}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="组件名">
                        <el-input v-model="httpInterfaceDto.cmptName" placeholder="请输入组件名"
                                  maxlength="50"
                                  :readonly="act !== actType.httpAdd && act !== actType.httpEdit"
                                  show-word-limit></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-divider></el-divider>
            <div>
                <el-form :inline="true" size="small">
                    <el-form-item>
                        <el-input style="width: 800px" v-model="httpInterfaceDto.configuration.uri"
                                  placeholder="请输入请求的URL"
                                  maxlength="200"
                                  @input="inputURL"
                                  :readonly="act !== actType.httpAdd && act !== actType.httpEdit"
                                  show-word-limit>
                            <el-select style="width: 100px" v-model="httpInterfaceDto.configuration.requestType"
                                       :disabled="act !== actType.httpAdd && act !== actType.httpEdit" slot="prepend">
                                <el-option v-for="item in requestTypeList"
                                           :value="item.value"
                                           :label="item.label"
                                           :key="item.value"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="超时时间">
                        <el-tooltip class="item" effect="dark" :content="computeReadTimeOut" placement="top">
                            <el-input v-model="httpInterfaceDto.configuration.readTimeOut"
                                      @input="readTimeOutChange"
                                      type="number"
                                      style="width: 250px"
                                      :readonly="act !== actType.httpAdd && act !== actType.httpEdit"
                                      controls-position="right" :min="1">
                                <template slot="append">/毫秒</template>
                            </el-input>
                        </el-tooltip>
                    </el-form-item>

                    <el-form-item>
                        <el-checkbox :disabled="act !== actType.httpAdd && act !== actType.httpEdit"
                                     v-model="httpInterfaceDto.configuration.isRetry" size="mini" label="接口重试"
                                     border></el-checkbox>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="sendClick" :loading="sendBtnLoading">发送</el-button>
                        <el-button type="primary" @click="saveClick" v-if="act !== 'http-version'">保存</el-button>
                    </el-form-item>
                </el-form>

                <div v-if="httpInterfaceDto.configuration.isRetry">
                    <el-form size="mini">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="重试次数">
                                    <el-input-number :disabled="act !== actType.httpAdd && act !== actType.httpEdit"
                                                     v-model="httpInterfaceDto.configuration.retryNum" :max="5"
                                                     :min="1"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="重试间隔">
                                    <el-tooltip class="item" effect="dark" :content="computeRetryInterval"
                                                placement="top">
                                        <el-input v-model="httpInterfaceDto.configuration.retryInterval"
                                                  type="number"
                                                  style="width: 250px"
                                                  :disabled="act !== actType.httpAdd && act !== actType.httpEdit"
                                                  controls-position="right" :min="1">
                                            <template slot="append">/毫秒</template>
                                        </el-input>
                                    </el-tooltip>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-form-item label="重试代码">
                                <codemirror ref="codeCm" v-model="httpInterfaceDto.configuration.retryCode"
                                            :options="codeCmOptions"
                                            style="line-height:20px;z-index: 500;"></codemirror>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>

                <el-collapse v-model="activeName">
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="padding-right: 20px">
                            <el-collapse-item name="pathVariable">
                                <template slot="title">
                                    <div title="URL变量" style="padding-left: 15px;">
                                        <span>PathVariable</span>
                                        <i class="header-icon el-icon-info"></i>
                                    </div>
                                    <div>
                                        <span style="margin-left: 20px;color: red">{{pathVariableErrorMsg}}</span>
                                    </div>
                                </template>
                                <el-table
                                        class="paramsTable"
                                        :data="httpInterfaceDto.pathVariable"
                                        style="width: 100%"
                                        max-height="350"
                                        size="mini"
                                        border
                                        default-expand-all>
                                    <el-table-column
                                            prop="cmptVarName"
                                            label="参数名"
                                            style="width: 33%"
                                            size="mini"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope['row'].cmptVarName" size="mini"
                                                      readonly></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="cmptVarDesc"
                                            label="参数描述"
                                            style="width: 33%"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope['row'].cmptVarDesc" size="mini"
                                                      placeholder="请输入参数描述"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="cmptVarValue"
                                            label="参数值"
                                            style="width: 34%"
                                            size="mini"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope['row'].cmptVarValue" size="mini"
                                                      placeholder="请输入参数值"></el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="padding-right: 20px">
                            <el-collapse-item name="requestParam">
                                <template slot="title">
                                    <div title="请求参数" style="padding-left: 15px;">
                                        <span>RequestParam</span>
                                        <i class="header-icon el-icon-info"></i>
                                    </div>
                                    <div>
                                        <span style="margin-left: 20px;color: red">{{requestParamErrorMsg}}</span>
                                    </div>
                                </template>
                                <el-table
                                        class="paramsTable"
                                        :data="httpInterfaceDto.requestParam"
                                        style="width: 100%"
                                        max-height="350"
                                        size="mini"
                                        border
                                        default-expand-all>
                                    <el-table-column
                                            prop="cmptVarName"
                                            label="参数名"
                                            style="width: 33%"
                                            size="mini"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope['row'].cmptVarName" size="mini"
                                                      readonly></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="cmptVarDesc"
                                            label="参数描述"
                                            style="width: 33%"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope['row'].cmptVarDesc" size="mini"
                                                      placeholder="请输入域参数描述"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="cmptVarValue"
                                            label="参数值"
                                            style="width: 34%"
                                            size="mini"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope['row'].cmptVarValue" size="mini"
                                                      placeholder="请输入参数值"></el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                        </el-col>
                    </el-row>
                </el-collapse>
                <div name="header-config">
                    <el-collapse v-model="activeName">
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="padding-right: 20px">
                                <el-collapse-item name="http-headers1">
                                    <template slot="title">
                                        <div title="配置请求头" style="padding-left: 15px;">
                                            <span>Headers</span>
                                            <i class="header-icon el-icon-info"></i>
                                        </div>
                                    </template>
                                    <div name="headersConfig">
                                        <json-editor v-model="httpInterfaceDto.headerConfig"
                                                     @changed="headerEditorChange"/>
                                    </div>
                                </el-collapse-item>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="padding-right: 20px">
                                <el-collapse-item name="http-headers1">
                                    <template slot="title">
                                        <div title="测试请求头" style="padding-left: 15px;">
                                            <span>Headers</span>
                                            <i class="header-icon el-icon-info"></i>
                                        </div>
                                    </template>
                                    <div name="headersExample">
                                        <json-editor v-model="httpInterfaceDto.headerConfigExample"/>
                                    </div>
                                </el-collapse-item>
                            </el-col>
                        </el-row>
                    </el-collapse>
                </div>
                <div v-if="httpInterfaceDto.configuration.requestType !== '1'">
                    <el-row style="margin: 10px 0">
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="padding-right: 20px">
                            <div name="requestBody">
                                <div class="code-body-header">
                                    <span>RequestBody</span>
                                    <i class="header-icon el-icon-info"></i>
                                </div>
                                <json-editor v-model="httpInterfaceDto.requestBody" @changed="jsonEditorChange"
                                             ref="configJsonEditorForRequestBody"></json-editor>
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
                                <json-editor v-model="httpInterfaceDto.requestBodyWithValue"
                                             ref="debugJsonEditor"></json-editor>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="padding-right: 20px">
                            <div>
                                <div class="code-body-header">
                                    <div title="响应报文解析">
                                        <span>ResponseAnalysis</span>
                                        <i class="header-icon el-icon-info"></i>
                                    </div>
                                </div>
                                <json-editor v-model="httpInterfaceDto.responseAnalysisForDisplay"
                                             ref="debugJsonEditorForResponseAnalysis"></json-editor>
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
                                        <span>点击发送按钮获取Response</span>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {
        tabType, actType, prefixOfCmpt, paramType, required, routePath,
        getInputExample, getAnalysisJson, checkInterfaceDto, getChangeType
    } from "../common/common";
    import {statusTypeConstants} from "../../constants/status-type";
    import {changeTypeConstants} from "../../constants/change-type";
    import {exceptionCodeConstants} from "../../constants/exception-code";
    import {Prod} from "../../entity/prod";
    import {requestTypeList, checkURIVariablesValue} from "./http-interface";
    import JsonEditor from "../../components/json-util/json-util";
    import {errorTip, successTip, isEmpty, isEmptyArray, extractValueInBrace} from "../../utils/tools";
    import {saveCmptBase, testHttpInterafce} from "../../api/cmpt-interface";
    import "./http-interface.less";

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
        name: "HttpInterfaceDebug",
        props: ['httpInterfaceDto'],
        components: {JsonEditor},
        data() {
            return {
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
                activeName: ['pathVariable', 'requestParam', 'httpHeaders', 'requestBody'],
                isEmpty: isEmpty,
                // =====路由路径=====
                routePath: routePath,
                // 错误提示信息
                pathVariableErrorMsg: '',
                requestParamErrorMsg: '',

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
            computeReadTimeOut() {
                let readTimeOut = this.httpInterfaceDto.configuration.readTimeOut;
                if (!isEmpty(readTimeOut)) {
                    if (readTimeOut < 1000 * 60) {
                        return `${(readTimeOut / 1000).toFixed(2)}/秒`
                    } else {
                        return `${(readTimeOut / (60 * 1000)).toFixed(2)}/分`
                    }
                }
                return "";
            },

            computeRetryInterval() {
                let readTimeOut = this.httpInterfaceDto.configuration.retryInterval;
                if (!isEmpty(readTimeOut)) {
                    if (readTimeOut < 1000 * 60) {
                        return `${(readTimeOut / 1000).toFixed(2)}/秒`
                    } else {
                        return `${(readTimeOut / (60 * 1000)).toFixed(2)}/分`
                    }
                }
                return "";
            }
        },

        methods: {

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

            initData() {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
                this.prefixOfCmpt = this.prod.prodId + '_' + prefixOfCmpt;
                this.act = this.$route.query['act'] === undefined ? '' : this.$route.query['act'];

                this.codeCmOptions.readOnly = (this.act !== actType.httpAdd && this.act !== actType.httpEdit);

            },

            saveClick() {
                if (checkInterfaceDto(this.httpInterfaceDto)) {
                    this.httpInterfaceDto['cmptId'] = this.prefixOfCmpt + this.httpInterfaceDto['cmptIdWithoutPrefix'];
                    this.httpInterfaceDto['analysisJson'] = getAnalysisJson(this.httpInterfaceDto);
                    this.httpInterfaceDto['inputExample'] = getInputExample(this.httpInterfaceDto);
                    this.httpInterfaceDto['responseAnalysis'] = JSON.stringify(JSON.parse(this.httpInterfaceDto['responseAnalysisForDisplay']));
                    this.httpInterfaceDto['inteConf'] = JSON.stringify(this.httpInterfaceDto['configuration']);
                    this.httpInterfaceDto['status'] = this.statusTypeConstants.DRAFT.value;
                    this.httpInterfaceDto['changeType'] = getChangeType(this.act);
                    let that = this;
                    saveCmptBase(this.prod.prodId, this.act, this.httpInterfaceDto).then(() => {
                        let msg = that.act === that.actType.httpAdd ? '新增组件成功' : '配置组件成功';
                        successTip('配置组件成功');
                        that.$emit('save', false);
                        if (this.act === actType.httpAdd) {
                            this.$router.push({path: this.routePath.httpBasePath});
                        }
                    }).catch((res) => {
                        // errorTip('配置组件失败，' + res.message);
                    });
                }
            },

            inputURL(value) {
                this.setPathVariable(value);
                this.setRequestParam(value);
            },
            /**
             * 根据URL设置pathVariable
             * */
            setPathVariable(url) {
                let pathVariableList = JSON.parse(JSON.stringify(this.httpInterfaceDto.pathVariable));
                this.$set(this.httpInterfaceDto, 'pathVariable', []);
                // 这里的正则表达式需要加上\/的原因是：因为requestParams也是用的{}，不加也会被匹配到
                let pathVariableArray = url.match(/\/{[^}]+}/g);
                if (!isEmptyArray(pathVariableArray)) {
                    for (let i in pathVariableArray) {
                        if (!pathVariableArray.hasOwnProperty(i)) continue;
                        let pathVariableTmp = {
                            'cmptVarName': '',
                            'cmptVarValue': '',
                            'cmptVarDesc': ''
                        };
                        pathVariableTmp.cmptVarName = extractValueInBrace(pathVariableArray[i]);
                        this.setCmptVarDesc(pathVariableList, pathVariableTmp);
                        this.httpInterfaceDto.pathVariable.push(pathVariableTmp);
                    }
                }
            },

            /**
             * 根据URL设置requestParam
             * */
            setRequestParam(url) {
                let requestParamList = JSON.parse(JSON.stringify(this.httpInterfaceDto.requestParam));
                this.$set(this.httpInterfaceDto, 'requestParam', []);
                if (url.indexOf('?') !== -1) {
                    let strings = url.split('?');
                    let requestParam = strings[strings.length - 1];
                    let requestParamArray = requestParam.split('&');
                    for (let i in requestParamArray) {
                        if (!requestParamArray.hasOwnProperty(i)) continue;
                        let requestParam = requestParamArray[i];
                        let keyValuePair = requestParam.split('=');
                        if (keyValuePair.length > 1 && keyValuePair[1].length > 2
                            && keyValuePair[1].startsWith("{") && keyValuePair[1].endsWith("}")) {
                            let requestParamTmp = {
                                'cmptVarName': '',
                                'cmptVarValue': '',
                                'cmptVarDesc': ''
                            };
                            requestParamTmp.cmptVarName = extractValueInBrace(keyValuePair[1]);
                            this.setCmptVarDesc(requestParamList, requestParamTmp);
                            this.httpInterfaceDto.requestParam.push(requestParamTmp);
                        }
                    }
                }
            },
            /**
             * 判断url中的变量是否有相同的，若有则保留参数描述
             */
            setCmptVarDesc(variableList, variable) {
                for (let i in variableList) {
                    if (!variableList.hasOwnProperty(i)) continue;
                    let variableTmp = variableList[i];
                    if (variableTmp.cmptVarName === variable.cmptVarName) {
                        variable.cmptVarDesc = variableTmp.cmptVarDesc;
                        break;
                    }
                }
            },
            readTimeOutChange(readTimeOut) {
                this.$emit("readTimeOutChange", readTimeOut);
            },
            /**
             * 判断URL变量的参数是否有重复
             */
            validateRequestParam(requestParam) {
                this.requestParamErrorMsg = '';
                //校验请求参数
                for (let i = 0; i < requestParam.length; i++) {
                    let param = requestParam[i];
                    if (!isEmpty(param.cmptVarName) && isEmpty(param.cmptVarDesc)) {
                        this.requestParamErrorMsg = '参数' + param.cmptVarName + '的参数描述不得为空！';
                        return;
                    }
                }
                // 校验请求参数是否有重复的变量
                let hasRequestParam = {};
                for (let i in requestParam) {
                    if (!requestParam.hasOwnProperty(i)) continue;
                    if (hasRequestParam[requestParam[i].cmptVarName]) {
                        this.requestParamErrorMsg = '参数' + requestParam[i].cmptVarName + '重复！';
                        return;
                    }
                    hasRequestParam[requestParam[i].cmptVarName] = true;
                }
            },
            validatePathVariable(pathVariable) {
                this.pathVariableErrorMsg = '';
                //校验PathVariable
                for (let i = 0; i < pathVariable.length; i++) {
                    let param = pathVariable[i];
                    if (!isEmpty(param.cmptVarName) && isEmpty(param.cmptVarDesc)) {
                        this.pathVariableErrorMsg = '参数' + param.cmptVarName + '的参数描述不得为空！';
                        return;
                    }
                }
                // 校验PathVariable是否有重复的变量
                let hasPathVariable = {};
                for (let i in pathVariable) {
                    if (!pathVariable.hasOwnProperty(i)) continue;
                    if (hasPathVariable[pathVariable[i].cmptVarName]) {
                        this.pathVariableErrorMsg = '参数' + pathVariable[i].cmptVarName + '重复！';
                        return;
                    }
                    hasPathVariable[pathVariable[i].cmptVarName] = true;
                }
            },
            jsonEditorChange(value) {
                this.setRequestBodyWithValue(value)
            },
            setRequestBodyWithValue(value) {
                if (!isEmpty(value)) {
                    try {
                        let requestBodyWithValue = JSON.parse(value);
                        this.joinValue(requestBodyWithValue);
                        this.$set(this.httpInterfaceDto, 'requestBodyWithValue', requestBodyWithValue);
                    } catch (e) {
                        this.$set(this.httpInterfaceDto, 'requestBodyWithValue', '');
                    }
                }
            },
            headerEditorChange(value) {
                if(!isEmpty(value)){
                    try {
                        let headerConfigExampleValue = JSON.parse(value);
                        this.joinValue(headerConfigExampleValue);
                        this.$set(this.httpInterfaceDto, 'headerConfigExample', headerConfigExampleValue);
                    } catch (e) {
                        this.$set(this.httpInterfaceDto, 'headerConfigExample', '');
                    }
                }
            },
            /**
             * 设置调试参数值模板（递归）
             * */
            joinValue(requestBodyWithValue) {
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

            sendClick() {
                try {
                    if (checkURIVariablesValue(this.httpInterfaceDto.requestParam, this.httpInterfaceDto.pathVariable)) {
                        this.sendBtnLoading = true;
                        this.readOnlyForResponse = false;
                        this.httpInterfaceDto['inputExample'] = getInputExample(this.httpInterfaceDto);
                        this.httpInterfaceDto['inteConf'] = JSON.stringify(this.httpInterfaceDto['configuration']);
                        let that = this;
                        testHttpInterafce(that.prod.prodId, that.httpInterfaceDto).then((res) => {
                            successTip();
                            let _data = res.data.data;
                            if (_data.code === exceptionCodeConstants.E701.code) {
                                that.jsonData = JSON.stringify(JSON.parse(_data), null, 4);
                            } else {
                                that.jsonData = _data
                            }
                        }).catch((res) => {
                            let jsonDataTmp = '无法获取任何Response：' + '连接' + JSON.stringify(that.httpInterfaceDto.configuration.uri) + '时发生错误！';
                            that.jsonData = JSON.stringify(jsonDataTmp, null, 4);
                            // errorTip('调试接口失败，' + res.message)
                        }).finally(() => {
                            this.sendBtnLoading = false;
                            setTimeout(() => {
                                this.readOnlyForResponse = true;
                                this.haveResponse = true;
                            }, 50);
                        });
                    } else {
                        this.haveResponse = false;
                    }
                } catch (err) {
                    errorTip("调试组件异常，" + err.toString());
                    this.sendBtnLoading = false;
                }
            },

            /**
             * 刷新编辑器
             * */
            refresh() {
                this.$refs.debugJsonEditor.refresh();
                this.$refs.debugJsonEditorForResponseAnalysis.refresh();
            }
        },
        mounted() {
            let that = this;
            that.initData();
            that.changeHint()
        },
        watch: {
            'httpInterfaceDto': {
                handler(newVal) {
                    this.validatePathVariable(newVal.pathVariable);
                    this.validateRequestParam(newVal.requestParam);
                },
                deep: true
            }
        }
    }
</script>
<style>

    #httpInterfaceDebug .el-card__body {
        min-height: 760px;
    }


</style>
