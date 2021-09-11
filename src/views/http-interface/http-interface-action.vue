<template>
    <div id="httpInterfaceAct">
        <el-card>
            <el-page-header @back="goBackClick">
                <div slot="content" v-if="act === actType.httpAdd||act===actType.httpEdit">{{title}}
                    <i class="el-icon-question icon-Add-style" @click="tohelperAdd"/>
                </div>
                <div slot="content" v-if="act === actType.httpDebug||act===actType.httpVersion">{{title}}
                    <i class="el-icon-question icon-Add-style" @click="tohelperTest"/>
                </div>
            </el-page-header>
        </el-card>

        <div id="httpCmptConfTab" v-cmb-auth-remove="'FrontHttpCmptEditCode'"></div>
        <div id="httpCmptDebugTab" v-cmb-auth-remove="'FrontHttpCmptDebugCode'"></div>
        <div id="httpCmptAddTab" v-cmb-auth-remove="'FrontHttpCmptAddCode'"></div>
        <http-interface-debug :ref="tabType.httpInterfaceDebug"
                              :httpInterfaceDto="httpInterfaceDto"
                              @save="saveHandler"></http-interface-debug>

<!--        <el-tabs :active-name="activeName" @tab-click="handleClick" type="border-card" :before-leave="beforeLeaveTab">-->
            <!--配置http接口-->
            <!--            <el-tab-pane :label="labelName" :name="tabType.httpInterfaceConfig"-->
            <!--                         v-if="(labelName === '配置' && httpConfIsShow) || (labelName === '新增' && httpAddIsShow)">-->
<!--            <el-tab-pane :name="tabType.httpInterfaceConfig">-->
<!--                <div slot="label">-->
<!--                    <span>{{labelName}}</span>-->
<!--                    <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i>-->
<!--                </div>-->
<!--                <http-interface-config :ref="tabType.httpInterfaceConfig"-->
<!--                                       :httpInterfaceDto="httpInterfaceDto"-->
<!--                                       @readTimeOutChange="readTimeOutChange"-->
<!--                                       @save="saveHandler"></http-interface-config>-->
<!--            </el-tab-pane>-->
            <!--调试运行http接口-->
<!--            <el-tab-pane :name="tabType.httpInterfaceDebug">-->
<!--                <div slot="label">-->
<!--                    <span>运行</span>-->
<!--                    <i class="el-icon-question icon-Add-style" @click="tohelperTest"></i>-->
<!--                </div>-->
<!--                <http-interface-debug :ref="tabType.httpInterfaceDebug"-->
<!--                                      :httpInterfaceDto="httpInterfaceDto"-->
<!--                                      @save="saveHandler"></http-interface-debug>-->
<!--            </el-tab-pane>-->
<!--        </el-tabs>-->
    </div>
</template>

<script>
    import {tabType, actType, prefixOfCmpt, routePath} from "../common/common";
    import {isEmpty, errorTip, isNotEmpty} from "../../utils/tools";
    import {metaTitleConstants} from "../../constants/meta-title";
    import {Prod} from "../../entity/prod";
    //import HttpInterfaceConfig from "./http-interface-config";
    import HttpInterfaceDebug from "./http-interface-debug";
    import {getCmptBase} from "../../api/cmpt-interface";
    import {getCmptVersion} from "../../api/cmpt-version";

    export default {
        name: "HttpInterfaceAct",
        components: {HttpInterfaceDebug},
        data() {
            return {
                // =====接口内容=====
                httpInterfaceDto: {
                    'cmptName': '',
                    'cmptId': '',
                    'cmptIdWithoutPrefix': '',
                    'inteType': 'H',
                    'requestParam': [],
                    'pathVariable': [],
                    'headerConfig': {},
                    'requestBody': {},
                    'configuration': {
                        'requestType': '2',
                        'uri': '',
                        'readTimeOut': 0,
                        'isRetry': false,
                        'retryCode': '',
                        'retryNum': 0,
                        'retryInterval': 1,
                    },
                    'responseAnalysisForDisplay': {},
                    'requestBodyWithValue': '',
                    'analysisJson': '',
                    'responseAnalysis': '',
                    'inteConf': '',
                    'headerConfigExample':'',
                    'inputExample': '',
                    'changeType': '',
                },
                prod: new Prod(),
                // =====标题=====
                title: 'HTTP接口',
                // =====面包屑=====
                tabType: tabType,
                // =====操作======
                actType: actType,
                act: '',
                activeName: tabType.httpInterfaceDebug,
                labelName: '',
                // =====用于判断离开页面时是否需要提示保存=====
                status: false,
                // =====记录跳转的路由=====
                historyPath: '',
                // =====组件名固定前缀=====
                prefixOfCmpt: '',
                // =====路由路径=====
                routePath: routePath,

                httpConfIsShow: true,
                httpDebugIsShow: true,
                httpAddIsShow: true,
            };
        },

        methods: {

            readTimeOutChange(readTimeOut) {
                if (!isEmpty(readTimeOut)) this.httpInterfaceDto.configuration.readTimeOut = Math.abs(parseInt(readTimeOut));
            },

            parseRouter() {
                // this.activeName = this.$route.query['tab'] === undefined ? tabType.httpInterfaceConfig : this.$route.query['tab'];
                this.act = this.$route.query['act'] === undefined ? '' : this.$route.query['act'];
                console.log(this.act)
            },
            tohelperAdd(){
                window.open(this.helper.helpUri.uri+'/modules/component/4.html#新增http组件',"_blank")
            },
            tohelperTest(){
                window.open(this.helper.helpUri.uri+'/modules/component/4.html#调试http组件',"_blank")
            },

            initData() {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
                this.prefixOfCmpt = this.prod.prodId + '_' + prefixOfCmpt;
                this.title = this.$route.query['title'] === undefined ? '' : this.$route.query['title'];
                let cmptId = this.$route.query['cmptId'] === undefined ? '' : this.$route.query['cmptId'];
                let cmptVersion = this.$route.query['cmptVersion'] === undefined ? '' : this.$route.query['cmptVersion'];
                debugger
                if (!isEmpty(cmptId)) {
                    if (!isEmpty(cmptVersion)) {
                        this.initWithVersion(cmptId, cmptVersion);
                    } else {
                        this.init(cmptId);
                    }
                } else {
                    this.httpInterfaceDto['requestBody'] = JSON.parse(JSON.stringify(this.httpInterfaceDto['requestBody']));
                    this.httpInterfaceDto['responseAnalysisForDisplay'] = JSON.parse(JSON.stringify(this.httpInterfaceDto['responseAnalysisForDisplay']));
                    setTimeout(() => {
                        this.$watch(
                            'httpInterfaceDto',
                            function (val) {
                                if (val) {
                                    this.status = true;
                                }
                            },
                            {deep: true}
                        );
                    }, 50);
                }
                this.labelName = this.act === this.actType.httpAdd ? '新增' : '配置';
                console.log(this.act)
            },
            // 基础表数据
            init(cmptId) {
                let record;
                let that = this;
                getCmptBase(this.prod.prodId, cmptId).then(res => {
                    if (res.data.data != null) {
                        record = res.data.data;
                    }
                    that.initHttpInterfaceDto(record);
                }).catch((res) => {
                    // errorTip("获取组件失败，"+res.message);
                }).finally(() => {
                    setTimeout(() => {
                        this.$watch(
                            'httpInterfaceDto',
                            function (val) {
                                if (val) {
                                    this.status = true;
                                }
                            },
                            {deep: true}
                        );
                    }, 50);
                });
            },

            // 版本表数据
            initWithVersion(cmptId, cmptVersion) {
                let record;
                let that = this;
                getCmptVersion(this.prod.prodId, cmptId, cmptVersion).then(res => {
                    if (res.data.data != null) {
                        record = res.data.data;
                    }
                    that.initHttpInterfaceDto(record);
                }).catch((res) => {
                    // errorTip("获取组件失败，"+res.message);
                }).finally(() => {
                    setTimeout(() => {
                        this.$watch(
                            'httpInterfaceDto',
                            function (val) {
                                if (val) {
                                    this.status = true;
                                }
                            },
                            {deep: true}
                        );
                    }, 50);
                });
            },

            initHttpInterfaceDto(record) {
                this.httpInterfaceDto = JSON.parse(JSON.stringify(record));
                let analysisJson = JSON.parse(this.httpInterfaceDto.analysisJson);
                let inputExample = JSON.parse(this.httpInterfaceDto.inputExample);
                let requestParam = analysisJson.requestParam;
                let requestParamValue = inputExample.requestParam;
                let pathVariable = analysisJson.pathVariable;
                let pathVariableValue = inputExample.pathVariable;
                let headerConfig = isEmpty(analysisJson.headerConfig) ? {} : analysisJson.headerConfig;
                let headerConfigExample = isEmpty(inputExample.headerConfig) ? {} : inputExample.headerConfig;
                for (let i in requestParam) {
                    if (!requestParam.hasOwnProperty(i)) continue;
                    requestParam[i].cmptVarValue = requestParamValue[requestParam[i].cmptVarName];
                }
                for (let i in pathVariable) {
                    if (!pathVariable.hasOwnProperty(i)) continue;
                    pathVariable[i].cmptVarValue = pathVariableValue[pathVariable[i].cmptVarName];
                }
                this.$set(this.httpInterfaceDto, 'configuration', JSON.parse(this.httpInterfaceDto.inteConf));
                this.$set(this.httpInterfaceDto, 'cmptIdWithoutPrefix', JSON.parse(JSON.stringify(this.httpInterfaceDto.cmptId.replace(this.prefixOfCmpt, ''))));
                this.$set(this.httpInterfaceDto, 'requestBody', JSON.parse(JSON.stringify(analysisJson.requestBody)));
                this.$set(this.httpInterfaceDto, 'requestParam', JSON.parse(JSON.stringify(analysisJson.requestParam)));
                this.$set(this.httpInterfaceDto, 'pathVariable', JSON.parse(JSON.stringify(analysisJson.pathVariable)));
                this.$set(this.httpInterfaceDto, 'headerConfig', JSON.parse(JSON.stringify(headerConfig)));
                this.$set(this.httpInterfaceDto, 'headerConfigExample', JSON.parse(JSON.stringify(headerConfigExample)));
                this.$set(this.httpInterfaceDto, 'requestBodyWithValue', JSON.parse(JSON.stringify(inputExample.requestBody)));
                this.$set(this.httpInterfaceDto, 'responseAnalysisForDisplay', JSON.parse(this.httpInterfaceDto.responseAnalysis));
            },

            handleClick(tab, event) {
                //this.$refs[tab.name].init()
            },

            beforeLeaveTab(activeName) {
                if (activeName === this.tabType.httpInterfaceDebug) {
                    if (!this.$refs.httpInterfaceConfig.checkHttpJsonData()) {
                        return false
                    } else {
                        //this.$refs.httpInterfaceConfig.setInputExample();
                    }
                }
                setTimeout(() => {
                    // this.$refs.httpInterfaceConfig.refresh();
                    this.$refs.httpInterfaceDebug.refresh();
                }, 1);
            },

            goBackClick() {
                if (this.historyPath === this.routePath.httpBasePath) {
                    this.$router.push({path: this.historyPath});
                } else if (this.historyPath === this.routePath.httpVersionPath) {
                    this.$router.push({
                        path: this.historyPath,
                        query: {cmptId: this.httpInterfaceDto.cmptId}
                    });
                }
            },

            saveHandler(unsaved) {
                this.status = unsaved;
            }
        },
        mounted() {
            this.parseRouter();
            this.initData();
            this.$nextTick(() => {
                this.httpConfIsShow = isNotEmpty(document.getElementById("httpCmptConfTab"));
                this.httpDebugIsShow = isNotEmpty(document.getElementById("httpCmptDebugTab"));
                this.httpAddIsShow = isNotEmpty(document.getElementById("httpCmptAddTab"));
            })
        },
        beforeRouteLeave(to, from, next) {
            if (this.status && this.act !== this.actType.httpVersion) { // 判断数据是否变化，以及保存后不进行此保存提示
                setTimeout(() => { // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
                    let msg = '是否保存对组件' + this.httpInterfaceDto.cmptId + '的修改？';
                    this.$confirm(msg, '提示', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'warning'
                    }).then(() => {
                        //if (false !== this.$refs.httpInterfaceConfig.saveClick()) {
                        if (false !== this.$refs.httpInterfaceDebug.saveClick()) {
                            next()
                        }
                    }).catch(action => {
                        if (action === 'cancel') {
                            next()
                        } else {
                            next(false)
                        }
                    })
                }, 200)
            } else {
                next()
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                if (from.meta.title === metaTitleConstants.HttpComponentsManage
                    || from.meta.title === metaTitleConstants.CmptVersion) {
                    vm.historyPath = from.path
                }
            })
        }
    }
</script>
