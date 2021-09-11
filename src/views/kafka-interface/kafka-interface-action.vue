<template>
    <div id="kafkaInterfaceAct">
        <el-card>
            <el-page-header @back="goBackClick">
                <div slot="content">{{title}}
                    <i class="el-icon-question icon-Add-style" @click="tohelperAdd"  v-if="act === actType.kafkaAdd||act===actType.kafkaEdit"/>
                    <i class="el-icon-question icon-Add-style" @click="tohelperTest" v-if="act === actType.kafkaDebug||act===actType.kafkaVersion"/>
                </div>
            </el-page-header>
        </el-card>

        <div id="kafkaCmptConfTab" v-cmb-auth-remove="'FrontKafkaCmptEditCode'"></div>
        <div id="kafkaCmptDebugTab" v-cmb-auth-remove="'FrontKafkaCmptDebugCode'"></div>
        <div id="kafkaCmptAddTab" v-cmb-auth-remove="'FrontKafkaCmptAddCode'"></div>

        <kafka-interface-debug :ref="tabType.kafkaInterfaceDebug"
                               :kafkaInterfaceDto="kafkaInterfaceDto"
                               @save="saveHandler"></kafka-interface-debug>
<!--                        <kafka-interface-config :ref="tabType.kafkaInterfaceConfig"-->
<!--                                                :kafkaInterfaceDto="kafkaInterfaceDto"-->
<!--                                                @save="saveHandler"></kafka-interface-config>-->

<!--        <el-tabs :active-name="activeName" @tab-click="handleClick" type="border-card" :before-leave="beforeLeaveTab">-->
            <!--配置kafka接口-->
            <!--            <el-tab-pane :label="labelName" :name="tabType.kafkaInterfaceConfig"-->
            <!--                         v-if="(labelName === '新增' && kafkaAddIsShow) || (labelName === '配置' && kafkaConfIsShow)">-->
<!--            <el-tab-pane :name="tabType.kafkaInterfaceConfig">-->
<!--                <div slot="label">-->
<!--                    <span>{{labelName}}</span>-->
<!--                    <i class="el-icon-question icon-Add-style" @click="tohelperAdd"></i>-->
<!--                </div>-->
<!--                <kafka-interface-config :ref="tabType.kafkaInterfaceConfig"-->
<!--                                        :kafkaInterfaceDto="kafkaInterfaceDto"-->
<!--                                        @save="saveHandler"></kafka-interface-config>-->
<!--            </el-tab-pane>-->
            <!--调试运行kafka接口-->
<!--            <el-tab-pane :name="tabType.kafkaInterfaceDebug">-->
<!--                <div slot="label">-->
<!--                    <span>运行</span>-->
<!--                    <i class="el-icon-question icon-Add-style" @click="tohelperTest"></i>-->
<!--                </div>-->
<!--                <kafka-interface-debug :ref="tabType.kafkaInterfaceDebug"-->
<!--                                       :kafkaInterfaceDto="kafkaInterfaceDto"-->
<!--                                       @save="saveHandler"></kafka-interface-debug>-->
<!--            </el-tab-pane>-->
<!--        </el-tabs>-->
    </div>
</template>

<script>
    import {tabType, actType, prefixOfCmpt, routePath} from "../common/common";
    import {isEmpty, errorTip, isNotEmpty} from "../../utils/tools";
    import {metaTitleConstants} from "../../constants/meta-title";
    import {Prod} from "../../entity/prod";
    // import KafkaInterfaceConfig from "./kafka-interface-config";
    import KafkaInterfaceDebug from "./kafka-interface-debug";
    import {getCmptBase} from "../../api/cmpt-interface";
    import {getCmptVersion} from "../../api/cmpt-version";

    export default {
        name: "KafkaInterfaceAct",
        components: {KafkaInterfaceDebug},
        data() {
            return {
                // =====接口内容=====
                kafkaInterfaceDto: {
                    'cmptName': '',
                    'cmptId': '',
                    'cmptIdWithoutPrefix': '',
                    'inteType': 'K',
                    'parameter': {},
                    'configuration': {
                        'bootstrapServer': '',
                        'topic': '',
                        'userName': '',
                        'password': ''
                    },
                    'parameterWithValue': '',
                    'analysisJson': '',
                    'inteConf': '',
                    'inputExample': '',
                    'changeType': ''
                },
                prod: new Prod(),
                // =====标题=====
                title: 'KAFKA接口',
                // =====面包屑=====
                tabType: tabType,
                // =====操作======
                actType: actType,
                act: '',
                activeName: tabType.kafkaInterfaceDebug,
                labelName: '',
                // =====用于判断离开页面时是否需要提示保存=====
                status: false,
                // =====记录跳转的路由=====
                historyPath: '',
                // =====组件名固定前缀=====
                prefixOfCmpt: '',
                // =====路由路径=====
                routePath: routePath,

                kafkaConfIsShow: true,
                kafkaDebugIsShow: true,
                kafkaAddIsShow: true,
            };
        },

        methods: {

            parseRouter() {
                //this.activeName = this.$route.query['tab'] === undefined ? tabType.kafkaInterfaceConfig : this.$route.query['tab'];
                this.act = this.$route.query['act'] === undefined ? '' : this.$route.query['act'];
            },
            tohelperAdd(){
                window.open(this.helper.helpUri.uri+'/modules/component/4.html#新增kafka组件',"_blank")
            },
            tohelperTest(){
                window.open(this.helper.helpUri.uri+'/modules/component/4.html#调试kafka组件',"_blank")
            },

            initData() {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
                this.prefixOfCmpt = this.prod.prodId + '_' + prefixOfCmpt;
                let cmptId = this.$route.query['cmptId'] === undefined ? '' : this.$route.query['cmptId'];
                let cmptVersion = this.$route.query['cmptVersion'] === undefined ? '' : this.$route.query['cmptVersion'];
                if (!isEmpty(cmptId)) {
                    if (!isEmpty(cmptVersion)) {
                        this.initWithVersion(cmptId, cmptVersion);
                    } else {
                        this.init(cmptId);
                    }
                } else {
                    this.kafkaInterfaceDto['parameter'] = JSON.parse(JSON.stringify(this.kafkaInterfaceDto['parameter']));
                    setTimeout(() => {
                        this.$watch(
                            'kafkaInterfaceDto',
                            function (val) {
                                if (val) {
                                    this.status = true;
                                }
                            },
                            {deep: true}
                        );
                    }, 50);
                }
                this.labelName = this.act === this.actType.kafkaAdd ? '新增' : '配置';
            },
            // 基础表数据
            init(cmptId) {
                let record;
                let that = this;
                getCmptBase(this.prod.prodId, cmptId).then(res => {
                    if (res.data.data != null) {
                        record = res.data.data;
                    }
                    that.initKafkaInterfaceDto(record);
                }).catch((res) => {
                    // errorTip("获取组件失败，"+res.message);
                }).finally(() => {
                    setTimeout(() => {
                        this.$watch(
                            'kafkaInterfaceDto',
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
                    that.initKafkaInterfaceDto(record);
                }).catch((res) => {
                    // errorTip("获取组件失败，"+res.message);
                }).finally(() => {
                    setTimeout(() => {
                        this.$watch(
                            'kafkaInterfaceDto',
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

            initKafkaInterfaceDto(record) {
                this.kafkaInterfaceDto = JSON.parse(JSON.stringify(record));
                let analysisJson = JSON.parse(this.kafkaInterfaceDto.analysisJson);
                let inputExample = JSON.parse(this.kafkaInterfaceDto.inputExample);
                this.$set(this.kafkaInterfaceDto, 'configuration', JSON.parse(this.kafkaInterfaceDto.inteConf));
                this.$set(this.kafkaInterfaceDto, 'cmptIdWithoutPrefix', JSON.parse(JSON.stringify(this.kafkaInterfaceDto.cmptId.replace(this.prefixOfCmpt, ''))));
                this.$set(this.kafkaInterfaceDto, 'parameter', JSON.parse(JSON.stringify(analysisJson)));
                this.$set(this.kafkaInterfaceDto, 'parameterWithValue', JSON.parse(JSON.stringify(inputExample)));
            },

            handleClick(tab, event) {
                //this.$refs[tab.name].init()
            },

            beforeLeaveTab(activeName) {
                if (activeName === this.tabType.kafkaInterfaceDebug && !this.$refs.kafkaInterfaceConfig.checkKafkaJsonData()) {
                    return false
                }
                setTimeout(() => {
                    //this.$refs.kafkaInterfaceConfig.refresh();
                    this.$refs.kafkaInterfaceDebug.refresh();
                }, 1);
            },

            goBackClick() {
                if (this.historyPath === this.routePath.kafkaBasePath) {
                    this.$router.push({path: this.historyPath});
                } else if (this.historyPath === this.routePath.kafkaVersionPath) {
                    this.$router.push({
                        path: this.historyPath,
                        query: {cmptId: this.kafkaInterfaceDto.cmptId}
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
                this.kafkaConfIsShow = isNotEmpty(document.getElementById("kafkaCmptConfTab"));
                this.kafkaDebugIsShow = isNotEmpty(document.getElementById("kafkaCmptDebugTab"));
                this.kafkaAddIsShow = isNotEmpty(document.getElementById("kafkaCmptAddTab"));
            })
        },
        beforeRouteLeave(to, from, next) {
            if (this.status && this.act !== this.actType.kafkaVersion) { // 判断数据是否变化，以及保存后不进行此保存提示
                setTimeout(() => { // 此处必须要加延迟执行，主要解决浏览器前进后退带来的闪现
                    let msg = '是否保存对组件' + this.kafkaInterfaceDto.cmptId + '的修改？';
                    this.$confirm(msg, '提示', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'warning'
                    }).then(() => {
                        //if (false !== this.$refs.kafkaInterfaceConfig.saveClick()) {
                        if (false !== this.$refs.kafkaInterfaceDebug.saveClick()) {                            
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
                if (from.meta.title === metaTitleConstants.KafkaComponentsManage
                    || from.meta.title === metaTitleConstants.CmptVersion) {
                    vm.historyPath = from.path
                }
            })
        }
    }
</script>
