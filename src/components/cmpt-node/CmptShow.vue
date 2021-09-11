<template>
    <div id="cmptShow" v-if="isNotEmpty(pCmpt.cmptId)">
        <el-form ref="form1" size="mini" label-width="80px">
            <el-row>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="padding-right:10px ">
                    <el-form-item label="组件id">
                        <el-input :readonly="true"
                                  v-model="pCmpt.cmptId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="padding-right:10px ">
                    <el-form-item label="组件名">
                        <el-input :readonly="true" v-model="pCmpt.cmptName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="padding-right:10px ">
                    <el-form-item label="组件状态">
                        <el-input :readonly="true"
                                  v-model="isNotEmpty(statusEnums[pCmpt.status]) ? statusEnums[pCmpt.status].name : pCmpt.status"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="padding-right:10px ">
                    <el-form-item label="组件版本" v-if="isNotEmpty(pCmpt.cmptVersion) || !disableOfVersion">
                        <!--<el-input :readonly="true" v-model="pCmpt.cmptVersion"></el-input>-->
                        <el-select
                                v-model="pCmpt.cmptVersion"
                                :title="pCmpt.cmptVersion"
                                :disabled="disableOfVersion"
                                :loading="versionLoading"
                                filterable
                                clearable
                                placeholder="请选择版本"
                                style="width: 100%"
                                @visible-change="visibleChange($event, pCmpt)">
                            <el-option
                                    v-for="item in cmptVersionList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="padding-right:10px ">
                    <el-form-item label="接入类型" prop="inteType">
                        <el-input :readonly="true" v-model="isNotEmpty(inteTypeEnums[pCmpt.inteType]) ? inteTypeEnums[pCmpt.inteType].name : pCmpt.inteType"></el-input>
                    </el-form-item>
                </el-col>

            <template v-if="pCmpt.inteType === 'H'">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="padding-right:10px ">
                    <el-form-item label="超时时间">
                        <el-input :readonly="true" v-model="pCmpt.inteConf['readTimeOut']"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="padding-right:10px ">
                    <el-form-item label="http地址" >
                        <el-input :readonly="true" v-model="pCmpt.inteConf.uri"></el-input>
                    </el-form-item>
                </el-col>

                <!--有重试的话，显示重试代码-->
                <template v-if="pCmpt.inteConf['isRetry']">
                    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="padding-right:10px ">
                        <el-form-item label="重试次数">
                            <el-input :readonly="true" v-model="pCmpt.inteConf['retryNum']"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="padding-right:10px ">
                        <el-form-item label="重试间隔">
                            <el-input :readonly="true" v-model="pCmpt.inteConf['retryInterval']"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="padding-right:10px ">
                        <el-form-item label="重试代码">
                            <codemirror-show :p-code="computeFormatJson(pCmpt.inteConf['retryCode'])"></codemirror-show>
                        </el-form-item>
                    </el-col>
                </template>
            </template>

            <template v-if="pCmpt.inteType === 'K'">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="padding-right:10px ">
                <el-form-item label="集群地址">
                    <el-input class="input-show-width" :readonly="true"
                              v-model="pCmpt.inteConf.bootstrapServer"></el-input>
                </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="padding-right:10px ">
                <el-form-item label="topic">
                    <el-input class="input-show-width" :readonly="true" v-model="pCmpt.inteConf.topic"></el-input>
                </el-form-item>
                </el-col>
<!--                <el-form-item label="userName">-->
<!--                    <el-input class="input-show-width" :readonly="true"-->
<!--                              v-model="pCmpt.inteConf.userName"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="password">-->
<!--                    <el-input class="input-show-width" :readonly="true"-->
<!--                              v-model="pCmpt.inteConf.password" show-password></el-input>-->
<!--                </el-form-item>-->
            </template>
            </el-row>
        </el-form>

        <el-form ref="form2" size="mini" label-width="100px">
            <el-form-item label="解析报文格式">
                <codemirror-show :p-code="computeFormatJson(pCmpt.analysisJson)"></codemirror-show>
            </el-form-item>

            <el-form-item label="输入报文示例">
                <codemirror-show :p-code="computeFormatJson(pCmpt.inputExample)"></codemirror-show>
            </el-form-item>

            <el-form-item label="响应报文示例">
                <codemirror-show :p-code="computeFormatJson(pCmpt.responseAnalysis)"></codemirror-show>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import {isEmpty, isNotEmpty} from "../../utils";
    import CodemirrorShow from "../codemirror/CodemirrorShow";
    import {inteTypeEnums, statusEnums} from "../../entity/enumns";
    import {getCmptVersionList} from "../../api/Cmpt";

    export default {
        name: "CmptShow",
        components: {CodemirrorShow},
        props: {
            pCmpt: Object,
            pType: {default: "", type: String},
            disableOfVersion: {default: true, type: Boolean},
        },
        data() {
            return {
                statusEnums: statusEnums,
                inteTypeEnums: inteTypeEnums,
                isNotEmpty: isNotEmpty,
                cmptVersionList: [],
                versionLoading: false
            }
        },

        computed:{
            computeFormatJson() {
                return (data) => {
                    if (isEmpty(data)) return "" ;
                    let result = "";
                    if (typeof (data) === "string") {
                        try {
                            result = JSON.stringify(JSON.parse(data), null, 4);
                        } catch (e) {
                            console.warn("cmptShow中json解析异常");
                            result = data;
                        }
                    } else {
                        result = JSON.stringify(data, null, 4);
                    }
                    return result;
                }
            }
        },

        mounted() {
            let that = this;
            that.$nextTick(()=>{
                if (isNotEmpty(that.pCmpt.cmptId)) {
                    that.init();
                }
            });
        },
        methods: {
            /**
             * 下拉框出现时触发
             *
             */
            visibleChange(query, cmpt) {
                let that = this;
                that.cmptVersionList = [];
                if (query) {
                    let cmptQueryDto = {cmptId: cmpt.cmptId, prodId: that.gConfig.prodId.value};
                    this.versionLoading = true;
                    getCmptVersionList({
                        prodId: that.gConfig.prodId.value,
                        cmptQueryDto: cmptQueryDto
                    }).then(item => {
                        let cmptVersionList = item.data.data['objectList'];
                        that.cmptVersionList = cmptVersionList.map(item => {return {value: item.cmptVersion, label: item.cmptVersion};});
                        that.versionLoading = false;
                    })
                }
            },


            init() {
                try {
                    let that = this;
                    if (isEmpty(that.pCmpt.cmptId)){
                        return;
                    }

                    let formItemList = [];
                    let noShowItem = {};
                    // 设置不显示的字段
                    noShowItem["cmptEdit"] = ['解析报文格式', '输入报文示例', '响应报文示例'];
                    formItemList.push(...that.$refs.form1.$children);
                    formItemList.push(...that.$refs.form2.$children);

                    // 不显示的字段
                    let noShowList = noShowItem[that.pType];
                    if (isNotEmpty(noShowList)) {
                        formItemList.forEach(formItem => {
                            if (isNotEmpty(noShowList)) {
                                if (noShowList.indexOf(formItem.label) > -1) {
                                    formItem.$el.style.display = "none";
                                }
                            }
                        })
                    }
                } catch (e) {
                    console.error("CmptShow初始化失败", e)
                }
            },
        }
    }
</script>

<style scoped>
</style>
