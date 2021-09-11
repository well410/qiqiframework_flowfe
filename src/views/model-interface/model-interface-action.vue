<template>
    <div id="modelInterfaceAct">
        <el-card>
            <el-page-header @back="goBackClick">
                <div slot="content" v-if="act === actType.modelAdd||act===actType.modelEdit">{{title}}
                    <i class="el-icon-question icon-Add-style" @click="tohelperAdd"/>
                </div>
                <div slot="content" v-if="act === actType.modelDebug||act===actType.modelVersion">{{title}}
                    <i class="el-icon-question icon-Add-style" @click="tohelperTest"/>
                </div>
            </el-page-header>
        </el-card>

        <div id="modelCmptConfTab" v-cmb-auth-remove="'FrontModelCmptEditCode'"></div>
        <div id="modelCmptDebugTab" v-cmb-auth-remove="'FrontModelCmptDebugCode'"></div>
        <div id="modelCmptAddTab" v-cmb-auth-remove="'FrontModelCmptAddCode'"></div>
        <model-interface-debug :ref="tabType.modelInterfaceDebug"
                              :modelInterfaceDto="modelInterfaceDto"
                              @save="saveHandler"></model-interface-debug>
    </div>
</template>

<script>
    import {tabType, actType, prefixOfCmpt, routePath} from "../common/common";
    import {isEmpty, errorTip, isNotEmpty} from "../../utils/tools";
    import {metaTitleConstants} from "../../constants/meta-title";
    import {Prod} from "../../entity/prod";
    // import ModelInterfaceConfig from "./model-interface-config";
    import ModelInterfaceDebug from "./model-interface-debug";
    import {getCmptBase} from "../../api/cmpt-interface";
    import {getCmptVersion} from "../../api/cmpt-version";

    export default {
        name: "ModelInterfaceAct",
        components: {/*ModelInterfaceConfig,*/ ModelInterfaceDebug},
        data() {
            return {
                // =====接口内容=====
                modelInterfaceDto: {
                    'cmptName': '',
                    'cmptId': '',
                    'cmptIdWithoutPrefix': '',
                    'inteType': 'M',
                    'requestParam': [],
                    'pathVariable': [],
                    'requestBody': {},
                    'configuration': '',
                    'responseAnalysisForDisplay': {},
                    'requestBodyWithValue': '',
                    'analysisJson': '',
                    'responseAnalysis': '',
                    'inteConf': '',
                    'inputExample': '',
                    'changeType': '',
                },
                prod: new Prod(),
                // =====标题=====
                title: '模型接口',
                // =====面包屑=====
                tabType: tabType,
                // =====操作======
                actType: actType,
                act: '',
                activeName: tabType.modelInterfaceDebug,
                labelName: '',
                // =====用于判断离开页面时是否需要提示保存=====
                status: false,
                // =====记录跳转的路由=====
                historyPath: '',
                // =====组件名固定前缀=====
                prefixOfCmpt: '',
                // =====路由路径=====
                routePath: routePath,

                modelConfIsShow: true,
                modelDebugIsShow: true,
                modelAddIsShow: true,
            };
        },

        methods: {
            /*
            readTimeOutChange(readTimeOut) {
                if (!isEmpty(readTimeOut)) this.modelInterfaceDto.configuration.readTimeOut = Math.abs(parseInt(readTimeOut));
            },
            */
            parseRouter() {
                this.act = this.$route.query['act'] === undefined ? '' : this.$route.query['act'];
                console.log(this.act)
            },
            tohelperAdd(){
                window.open(this.helper.helpUri.uri+'/modules/component/4.html#新增模型组件',"_blank")
            },
            tohelperTest(){
                window.open(this.helper.helpUri.uri+'/modules/component/4.html#调试模型组件',"_blank")
            },

            initData() {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
                this.prefixOfCmpt = this.prod.prodId + '_' + prefixOfCmpt;
                this.title = this.$route.query['title'] === undefined ? '' : this.$route.query['title'];
                let cmptId = this.$route.query['cmptId'] === undefined ? '' : this.$route.query['cmptId'];
                let cmptVersion = this.$route.query['cmptVersion'] === undefined ? '' : this.$route.query['cmptVersion'];

                if (!isEmpty(cmptId)) {
                    if (!isEmpty(cmptVersion)) {
                        this.initWithVersion(cmptId, cmptVersion);
                    } else {
                        this.init(cmptId);
                    }
                } else {
                    this.modelInterfaceDto['requestBody'] = JSON.parse(JSON.stringify(this.modelInterfaceDto['requestBody']));
                    this.modelInterfaceDto['responseAnalysisForDisplay'] = JSON.parse(JSON.stringify(this.modelInterfaceDto['responseAnalysisForDisplay']));
                    setTimeout(() => {
                        this.$watch(
                            'modelInterfaceDto',
                            function (val) {
                                if (val) {
                                    this.status = true;
                                }
                            },
                            {deep: true}
                        );
                    }, 50);
                }
                this.labelName = this.act === this.actType.modelAdd ? '新增' : '配置';
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
                    that.initModelInterfaceDto(record);
                }).catch((res) => {
                    // errorTip("获取组件失败，"+res.message);
                }).finally(() => {
                    setTimeout(() => {
                        this.$watch(
                            'modelInterfaceDto',
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
                    that.initModelInterfaceDto(record);
                }).catch((res) => {
                    // errorTip("获取组件失败，"+res.message);
                }).finally(() => {
                    setTimeout(() => {
                        this.$watch(
                            'modelInterfaceDto',
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

            initModelInterfaceDto(record) {
                this.modelInterfaceDto = JSON.parse(JSON.stringify(record));
                let analysisJson = JSON.parse(this.modelInterfaceDto.analysisJson);
                let inputExample = JSON.parse(this.modelInterfaceDto.inputExample);
                this.$set(this.modelInterfaceDto, 'cmptIdWithoutPrefix', JSON.parse(JSON.stringify(this.modelInterfaceDto.cmptId.replace(this.prefixOfCmpt, ''))));
                this.$set(this.modelInterfaceDto, 'requestBody', JSON.parse(JSON.stringify(analysisJson)));
                this.$set(this.modelInterfaceDto, 'requestBodyWithValue', JSON.parse(JSON.stringify(inputExample)));
                this.$set(this.modelInterfaceDto, 'responseAnalysisForDisplay', JSON.parse(this.modelInterfaceDto.responseAnalysis));
                let conf = JSON.parse(this.modelInterfaceDto.inteConf);
                let rawModelFile = isNotEmpty(conf.rawModelFile) ? conf.rawModelFile : conf.modelFile;
                this.$set(this.modelInterfaceDto, 'rawModelFile', rawModelFile);
                this.$set(this.modelInterfaceDto, 'uploadModelFile', '');

            
                this.$set(this.modelInterfaceDto, 'inteConf', JSON.parse(this.modelInterfaceDto.inteConf));
            },

            handleClick(tab, event) {
                //this.$refs[tab.name].init()
            },

            beforeLeaveTab(activeName) {
                if (activeName === this.tabType.modelInterfaceDebug) {
                    if (!this.$refs.modelInterfaceDebug.checkModelJsonData()) {
                        return false
                    } else {
                    }
                }
                setTimeout(() => {
                    this.$refs.modelInterfaceDebug.refresh();
                }, 1);
            },

            goBackClick() {
                if (this.historyPath === this.routePath.modelBasePath || isEmpty(this.historyPath)) {
                    this.$router.push({path: this.routePath.modelBasePath});
                } else if (this.historyPath === this.routePath.modelVersionPath) {
                    this.$router.push({
                        path: this.historyPath,
                        query: {cmptId: this.modelInterfaceDto.cmptId}
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
                this.modelConfIsShow = isNotEmpty(document.getElementById("modelCmptConfTab"));
                this.modelDebugIsShow = isNotEmpty(document.getElementById("modelCmptDebugTab"));
                this.modelAddIsShow = isNotEmpty(document.getElementById("modelCmptAddTab"));
            })
        },
        beforeRouteLeave(to, from, next) {
            if (this.status && this.act !== this.actType.modelVersion) { // 判断数据是否变化，以及保存后不进行此保存提示
                setTimeout(() => { // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
                    let msg = '是否保存对组件' + this.modelInterfaceDto.cmptId + '的修改？';
                    this.$confirm(msg, '提示', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'warning'
                    }).then(() => {
                        //if (false !== this.$refs.modelInterfaceConfig.saveClick()) {
                        if (false !== this.$refs.modelInterfaceDebug.saveClick(true)) {
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
                if (from.meta.title === metaTitleConstants.ModelComponentsManage
                    || from.meta.title === metaTitleConstants.CmptVersion) {
                    vm.historyPath = from.path
                }
            })
        }
    }
</script>
