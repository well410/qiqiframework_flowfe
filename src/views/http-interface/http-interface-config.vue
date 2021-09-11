<template>
    <!--不需要了，和 http-interface-debug.vue 结合在一起了，但是我不敢乱删除，就放在这里了-->
    <div class="httpInterfaceConfig">
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
                                  show-word-limit></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-divider></el-divider>
            <div>
                <el-form :inline="true" size="small">
                    <el-row>
                        <el-col>
                            <el-form-item>
                                <el-input style="width: 800px" v-model="httpInterfaceDto.configuration.uri" placeholder="请输入请求的URL"
                                          maxlength="200"
                                          @input="inputURL"
                                          show-word-limit>
                                    <el-select style="width: 100px" v-model="httpInterfaceDto.configuration.requestType" slot="prepend" disabled>
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
                                              controls-position="right" :min="1">
                                        <template slot="append">/毫秒</template>
                                    </el-input>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="saveClick" v-if="act !== 'http-version'">保存</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-collapse v-model="activeName">
                    <!--PathVariable-->
                    <el-collapse-item name="pathVariable" v-if="httpInterfaceDto.pathVariable.length > 0">
                        <template slot="title">
                            <div title="URL变量">
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
                                    style="width: 50%"
                                    size="mini"
                                    show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-input v-model="scope['row'].cmptVarName" size="mini" readonly></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="cmptVarDesc"
                                    label="参数描述"
                                    style="width: 50%"
                                    show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-input v-model="scope['row'].cmptVarDesc" size="mini" placeholder="请输入参数描述"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>

                    <!--RequestParam-->
                    <el-collapse-item name="requestParam" v-if="httpInterfaceDto.requestParam.length > 0">
                        <template slot="title">
                            <div title="请求参数">
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
                                    style="width: 50%"
                                    size="mini"
                                    show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-input v-model="scope['row'].cmptVarName" size="mini" readonly></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="cmptVarDesc"
                                    label="参数描述"
                                    style="width: 50%"
                                    show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-input v-model="scope['row'].cmptVarDesc" size="mini" placeholder="请输入域参数描述"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                    <!--RequestBody-->
                    <el-collapse-item name="requestBody">
                        <template slot="title">
                            <div title="请求体">
                                <span>RequestBody</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                        </template>
                        <json-editor v-model="httpInterfaceDto.requestBody" @changed="jsonEditorChange" ref="configJsonEditorForRequestBody"></json-editor>
                    </el-collapse-item>
                    <!--ResponseAnalysis-->
                    <el-collapse-item name="responseAnalysis">
                        <template slot="title">
                            <div title="响应报文解析">
                                <span>ResponseAnalysis</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                        </template>
                        <json-editor v-model="httpInterfaceDto.responseAnalysisForDisplay" ref="configJsonEditorForResponseAnalysis"></json-editor>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {tabType, actType, prefixOfCmpt, paramType, required, routePath,
        getAnalysisJson, getInputExample, checkJsonParam, checkInterfaceDto, getChangeType} from "../common/common";
    import {statusTypeConstants} from "../../constants/status-type";
    import {changeTypeConstants} from "../../constants/change-type";
    import {Prod} from "../../entity/prod";
    import {requestTypeList} from "./http-interface";
    import JsonEditor from "../../components/json-util/json-util";
    import {errorTip, successTip, isEmpty, extractValueInBrace, isEmptyArray} from "../../utils/tools";
    import {saveCmptBase} from "../../api/cmpt-interface";
    import "./http-interface.less";

    export default {
        name: "HttpInterfaceConfig",
        components: {JsonEditor},
        data() {
            return {
                // =====接口内容=====
                requestTypeList: requestTypeList,
                prod: new Prod(),
                paramType: paramType,
                required: required,
                // =====标题=====
                title: '',
                // =====面包屑=====
                tabType: tabType,
                // =====操作=====
                actType: actType,
                act: '',
                // =====状态=====
                statusTypeConstants: statusTypeConstants,
                // =====操作类型=====
                changeTypeConstants: changeTypeConstants,
                // =====组件名固定前缀=====
                prefixOfCmpt: '',
                // =====折叠面板打开的面板=====
                activeName: ['pathVariable', 'requestParam', 'requestBody', 'responseAnalysis'],
                // =====路由路径=====
                routePath: routePath,
                // 错误提示信息
                pathVariableErrorMsg: '',
                requestParamErrorMsg: '',
            };
        },
        props: ['httpInterfaceDto'],

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
            }
        },

        methods: {

            readTimeOutChange(readTimeOut){
                this.$emit("readTimeOutChange", readTimeOut);
            },

            initData () {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
                this.prefixOfCmpt = this.prod.prodId + '_' + prefixOfCmpt;
                this.act = this.$route.query['act'] === undefined ? '' : this.$route.query['act'];
            },

            saveClick () {
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
                        successTip(msg);
                        that.$emit('save', false);
                        if (this.act === actType.httpAdd) {
                            this.$router.push({
                                path: this.routePath.httpBasePath
                            });
                        }
                    }).catch((res) => {
                        // errorTip('配置组件失败，' + res.message);
                    });
                } else {
                    return false;
                }
            },

            checkHttpJsonData () {
                return checkJsonParam(this.httpInterfaceDto.requestBody);
            },

            jsonEditorChange (value) {
                this.setRequestBodyWithValue(value)
            },

            setRequestBodyWithValue (value) {
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

            /**
             * URL输入框值改变时触发的方法
             * */
            inputURL (value) {
                this.setPathVariable(value);
                this.setRequestParam(value);
            },

            /**
             * 根据URL设置pathVariable
             * */
            setPathVariable (url) {
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
            setRequestParam (url) {
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
                        if (keyValuePair.length > 1) {
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
            setCmptVarDesc (variableList, variable) {
                for (let i in variableList) {
                    if (!variableList.hasOwnProperty(i)) continue;
                    let variableTmp = variableList[i];
                    if (variableTmp.cmptVarName === variable.cmptVarName) {
                        variable.cmptVarDesc = variableTmp.cmptVarDesc;
                        break;
                    }
                }
            },

            /**
             * 判断URL变量的参数是否有重复
             */
            validateRequestParam (requestParam) {
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
                for(let i in requestParam) {
                    if (!requestParam.hasOwnProperty(i)) continue;
                    if (hasRequestParam[requestParam[i].cmptVarName]) {
                        this.requestParamErrorMsg = '参数' + requestParam[i].cmptVarName + '重复！';
                        return;
                    }
                    hasRequestParam[requestParam[i].cmptVarName] = true;
                }
            },
            validatePathVariable (pathVariable) {
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
                for(let i in pathVariable) {
                    if (!pathVariable.hasOwnProperty(i)) continue;
                    if (hasPathVariable[pathVariable[i].cmptVarName]) {
                        this.pathVariableErrorMsg = '参数' + pathVariable[i].cmptVarName + '重复！';
                        return;
                    }
                    hasPathVariable[pathVariable[i].cmptVarName] = true;
                }
            },

            /**
             * 刷新编辑器
             * */
            refresh () {
                this.$refs.configJsonEditorForRequestBody.refresh();
                this.$refs.configJsonEditorForResponseAnalysis.refresh();
            }
        },
        mounted() {
            this.initData();
        },
        watch: {
            'httpInterfaceDto' : {
                handler (newVal) {
                    this.validatePathVariable(newVal.pathVariable);
                    this.validateRequestParam(newVal.requestParam);
                },
                deep: true
            }
        }
    }
</script>
