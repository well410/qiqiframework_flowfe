<template>
    <div class="kafkaInterfaceConfig">
        <el-card>
            <div class="kafkaCmpt">
                <el-form @submit.native.prevent :inline="true" size="small">
                    <el-form-item label="组件ID">
                        <el-input v-model="kafkaInterfaceDto.cmptIdWithoutPrefix" placeholder="请输入组件ID"
                                  :readonly="act !== actType.kafkaAdd"
                                  maxlength="20"
                                  show-word-limit>
                            <template slot="prepend">{{prefixOfCmpt}}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="组件名">
                        <el-input v-model="kafkaInterfaceDto.cmptName" placeholder="请输入组件名"
                                  maxlength="50"
                                  show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveClick" v-if="act !== 'kafka-version'">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-divider></el-divider>
            <el-collapse v-model="activeName">
                <!--Parameter-->
                <el-collapse-item name="parameter">
                    <template slot="title">
                        <div title="发送参数">
                            <span>Parameter</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                    </template>
                    <json-editor v-model="kafkaInterfaceDto.parameter" @changed="jsonEditorChange" ref="configJsonEditor"></json-editor>
                </el-collapse-item>
            </el-collapse>
            <el-divider></el-divider>
            <div>
                <fieldset>
                    <legend>
                        <span>接口配置</span>
                    </legend>
                    <el-form :inline="true" label-width="140px">
                        <el-row>
                            <el-col>
                                <el-form-item label="BootstrapServer:">
                                    <el-input style="width: 1200px" v-model="kafkaInterfaceDto.configuration.bootstrapServer"
                                              placeholder="请输入kafka集群地址"
                                              size="small"
                                              maxlength="300"
                                              show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item label="Topic:">
                                    <el-input style="width: 1200px" v-model="kafkaInterfaceDto.configuration.topic"
                                              placeholder="请输入topic名称（仅限一个）"
                                              size="small"
                                              maxlength="100"
                                              show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item label="UserName:">
                                    <el-input style="width: 1200px" v-model="kafkaInterfaceDto.configuration.userName"
                                              placeholder="请输入kafka用户"
                                              size="small"
                                              maxlength="100"
                                              show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item label="Password:">
                                    <el-input style="width: 1200px" v-model="kafkaInterfaceDto.configuration.password"
                                              placeholder="请输入kafka密码"
                                              size="small"
                                              maxlength="100"
                                              show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </fieldset>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {tabType, actType, prefixOfCmpt, paramType, required, routePath,
        checkJsonParam, checkInterfaceDto, getChangeType} from "../common/common";
    import {statusTypeConstants} from "../../constants/status-type";
    import {changeTypeConstants} from "../../constants/change-type";
    import {errorTip, successTip, isEmpty} from "../../utils/tools";
    import {Prod} from "../../entity/prod";
    import JsonEditor from "../../components/json-util/json-util";
    import {saveCmptBase} from "../../api/cmpt-interface";
    import "./kafka-interface.less";

    export default {
        name: "KafkaInterfaceConfig",
        components: {JsonEditor},
        data() {
            return {
                prod: new Prod(),
                paramType: paramType,
                required: required,
                // =====标题=====
                title: 'KAFKA接口',
                // =====面包屑=====
                tabType: tabType,
                // =====组件名固定前缀=====
                prefixOfCmpt: '',
                // =====状态=====
                statusTypeConstants: statusTypeConstants,
                // =====操作类型=====
                changeTypeConstants: changeTypeConstants,
                // =====操作=====
                actType: actType,
                act: '',
                // =====参数是否批量配置=====
                jsonData: '',
                // =====折叠面板打开的面板=====
                activeName: ['parameter'],
                // =====路由路径=====
                routePath: routePath
            };
        },
        props: ['kafkaInterfaceDto'],

        methods: {
            /**
             * 数据初始化
             * */
            initData() {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? 'lu88' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
                this.prefixOfCmpt = this.prod.prodId + '_' + prefixOfCmpt;
                this.act = this.$route.query['act'] === undefined ? '' : this.$route.query['act'];
            },

            saveClick() {
                if (checkInterfaceDto(this.kafkaInterfaceDto)) {
                    this.kafkaInterfaceDto['cmptId'] = this.prefixOfCmpt + this.kafkaInterfaceDto['cmptIdWithoutPrefix'];
                    this.kafkaInterfaceDto['analysisJson'] = JSON.stringify(JSON.parse(this.kafkaInterfaceDto['parameter']));
                    this.kafkaInterfaceDto['inputExample'] = JSON.stringify(JSON.parse(this.kafkaInterfaceDto['parameterWithValue']));
                    this.kafkaInterfaceDto['inteConf'] = JSON.stringify(this.kafkaInterfaceDto['configuration']);
                    this.kafkaInterfaceDto['status'] = this.statusTypeConstants.DRAFT.value;
                    this.kafkaInterfaceDto['changeType'] = getChangeType(this.act);
                    let that = this;
                    saveCmptBase(this.prod.prodId, this.act, this.kafkaInterfaceDto).then(() => {
                        let msg = that.act === that.actType.kafkaAdd ? '新增组件成功' : '配置组件成功';
                        successTip(msg);
                        that.$emit('save', false);
                        if (this.act === actType.kafkaAdd) {
                            this.$router.push({path: this.routePath.kafkaBasePath});
                        }
                    }).catch((res) => {
                        // errorTip('配置组件失败，' + res.message);
                    });
                } else {
                    return false;
                }
            },

            checkKafkaJsonData () {
                return checkJsonParam(this.kafkaInterfaceDto.parameter);
            },

            jsonEditorChange (value) {
                this.setParameterWithValue(value)
            },

            setParameterWithValue (value) {
                if (!isEmpty(value)) {
                    try {
                        let parameterWithValue = JSON.parse(value);
                        this.joinValue(parameterWithValue);
                        this.$set(this.kafkaInterfaceDto, 'parameterWithValue', parameterWithValue);
                    } catch (e) {
                        this.$set(this.kafkaInterfaceDto, 'parameterWithValue', '');
                    }
                }
            },

            /**
             * 设置调试参数值模板（递归）
             * */
            joinValue (parameterWithValue) {
                for (let key in parameterWithValue) {
                    if (!parameterWithValue.hasOwnProperty(key)) continue;
                    let cmptVar = parameterWithValue[key];
                    if (cmptVar instanceof Object) {
                        this.joinValue(cmptVar);
                    } else if (cmptVar instanceof Array) {
                        for (let i in cmptVar) {
                            if (!cmptVar.hasOwnProperty(i)) continue;
                            this.joinValue(cmptVar[i]);
                        }
                    } else {
                        parameterWithValue[key] = "";
                    }
                }
            },

            /**
             * 刷新编辑器
             * */
            refresh () {
                this.$refs.configJsonEditor.refresh();
            }
        },
        mounted() {
            this.initData();
        },
    }
</script>
