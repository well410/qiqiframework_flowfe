<template>
    <!--展示基础组件的详细信息-->
    <div id="cmptDetailShow">
        <el-form label-width="100px" size="mini" class="table-expand">
            <el-row :gutter="20" v-show="false">
                <el-col :span="6">
                    <el-form-item label="组件ID: ">
                        <span>{{cmptEntity.cmptId}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="组件名: ">
                        <span>{{cmptEntity.cmptName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="组件版本: " v-if="pageType !== httpBasePage && pageType !== kafkaBasePage && pageType !== modelBasePage">
                        <span>{{cmptEntity.cmptVersion}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-show="false">
                <el-col :span="6">
                    <el-form-item label="接入类型: ">
                        <span>{{inteType[cmptEntity.inteType]}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态: ">
                        <span>{{statusFormatterCommon(cmptEntity)}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="操作类型: " v-if="pageType === historyPage">
                        <span>{{changeTypeFormatterCommon(cmptEntity)}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-show="false">
                <el-col :span="6">
                    <el-form-item label="修改时间: " v-if="pageType !== historyPage">
                        <span>{{cmptEntity.updateTime}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="修改人: " v-if="pageType !== historyPage">
                        <span>{{cmptEntity.updateUser}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="创建时间: ">
                        <span>{{cmptEntity.createTime}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="创建人: ">
                        <span>{{cmptEntity.createUser}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <el-form-item label="接入类型: ">
                        <span>{{inteType[cmptEntity.inteType]}}</span>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <el-form-item label="创建时间: ">
                        <span>{{cmptEntity.createTime}}</span>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <el-form-item label="创建人: ">
                        <span>{{cmptEntity.createUser}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="接入配置: ">
                        <json-editor :value="changTypeToString(cmptEntity.inteConf)" :read-only="true" class="mini-code-area"></json-editor>
                    </el-form-item>
                    <el-form-item label="输入报文格式: ">
                        <json-editor :value="changTypeToString(cmptEntity.analysisJson)" :read-only="true"></json-editor>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item label="响应报文解析: ">
                        <json-editor :value="changTypeToString(cmptEntity.responseAnalysis)" :read-only="true" class="mini-code-area"></json-editor>
                    </el-form-item>
                    <el-form-item label="调试样例: ">
                        <json-editor :value="changTypeToString(cmptEntity.inputExample)" :read-only="true"></json-editor>
                    </el-form-item>


                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>

   import JsonEditor from "../../components/json-util/json-util";
   import {inteType, statusFormatterCommon, changeTypeFormatterCommon} from "../common/common";
   import "./cmpt-detail-show.less";

    export default {
        name: "CmptDetailShow",
        components: {JsonEditor},
        props: {'cmptEntity': Object, 'pageType': String},
        data() {
            return {
                decs: {},
                inteType: inteType,
                historyPage: 'historyPage',
                versionPage: 'versionPage',
                httpBasePage: 'httpBasePage',
                kafkaBasePage: 'kafkaBasePage',
                modelBasePage: 'modelasePage',
                statusFormatterCommon: statusFormatterCommon,
                changeTypeFormatterCommon: changeTypeFormatterCommon
            }
        },
        methods: {

            /**
             * 转换字符串成Json格式
             * */
            changTypeToString (str) {
                return JSON.parse(str)
            }

        },
        mounted() {

        },
    }
</script>