<template>
    <div id="template">
        <el-card class="info-title">
            <el-page-header @back="$router.push('/ui/templateManage')" >
                <template slot="content">
                    <span>模板ID：<el-tag class="middle-tag title-tag">{{template.templateId}}</el-tag></span>
                    <el-divider direction="vertical"></el-divider>
                    <span>模板状态：<el-tag :type="tagType[decs.status]" class="middle-tag">{{isNotEmpty(statusEnums[decs.status]) ? statusEnums[decs.status].name : ""}}</el-tag></span>
                </template>
            </el-page-header>
        </el-card>
        <el-card class="info-content">

            <div id="templateCodeTab" v-cmb-auth-remove="res.decsCode.code"></div>
            <div id="templateFlowTab" v-cmb-auth-remove="res.decsFlow.code"></div>
            <div id="templateHisTab" v-cmb-auth-remove="res.decsHis.code"></div>
            <div id="templateVersionTab" v-cmb-auth-remove="res.decsVersion.code"></div>

            <el-tabs :active-name="activeName" @tab-click="handleClick" tabPosition="left" style="margin-top: 15px">

                <el-tab-pane :name="tabType.templateFlowG6" :key="tabType.templateFlowG6" v-if="templateFlowIsShow">
                    <div slot="label">
                        <span class="">模板图</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperMap"></i>
                    </div>
                    <template-flow-g6 :ref="tabType.templateFlowG6" :pDecs="decs"></template-flow-g6>
                </el-tab-pane>

                <el-tab-pane :name="tabType.templateInf" :key="tabType.templateInf">
                    <div slot="label">
                        <span class="">模板详情</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperDetail"></i>
                    </div>
                    <template-inf :ref="tabType.templateInf" :pDecs="decs"></template-inf>
                </el-tab-pane>

                <!--模板源码-->
                <el-tab-pane label="模板源码" :name="tabType.templateCode" :key="tabType.templateCode" v-if="false">
                    <template-code :ref="tabType.templateCode" :pDecs="decs"></template-code>
                </el-tab-pane>


                <!--模板历史-->
                <el-tab-pane :name="tabType.templateHis" :key="tabType.templateHis" v-if="templateHisIsShow">
                    <div slot="label">
                        <span class="">模板历史</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperHis"></i>
                    </div>
                    <template-his :ref="tabType.templateHis" :pDecs="decs"></template-his>
                </el-tab-pane>

                <!--模板版本-->
                <el-tab-pane :name="tabType.templateVersion" :key="tabType.templateVersion" v-if="templateVersionIsShow">
                    <div slot="label">
                        <span class="">模板版本</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperVer"></i>
                    </div>
                    <template-version :ref="tabType.templateVersion" :pDecs="decs"></template-version>
                </el-tab-pane>

            </el-tabs>
        </el-card >

    </div>
</template>

<script>
    import TemplateCode from "./template-info-tab/TemplateCode";
    import TemplateHis from "./template-info-tab/TemplateHis";
    import TemplateVersion from "./template-info-tab/TemplateVersion";
    import {TemplateBase} from "../../../entity/template";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import {statusEnums, tabType, tagType} from "../../../entity/enumns";
    import G6Editor from "../../../components/g6-editor/g6-editor";
    import TemplateFlowG6 from "./template-info-tab/TemplateFlowG6";
    import TemplateInf from "./template-info-tab/TemplateInf";
    import {DecsBase} from "../../../entity/decs";
    import {getTemplateById} from "../../../api/Template";



    export default {
        name: "TemplateInfoHome2",
        components: {
            TemplateInf,
            TemplateFlowG6, G6Editor, TemplateVersion, TemplateHis, TemplateCode},
        data() {
            return {
                tabType: tabType,
                activeName: tabType.templateFlowG6,
                statusEnums: statusEnums,
                isEmpty: isEmpty,
                template: new TemplateBase(),
                decs: new DecsBase(),
                templateCodeIsShow: true,
                templateFlowIsShow: true,
                templateHisIsShow: true,
                templateVersionIsShow: true,
                templateCitaIsShow:true,
                tagType: tagType,
            }
        },

        computed: {},

        mounted() {
            this.parseRouter();
            this.$nextTick(()=>{
                // this.templateCodeIsShow = isNotEmpty(document.getElementById("templateCodeTab"));
                // this.templateFlowIsShow = isNotEmpty(document.getElementById("templateFlowTab"));
                // this.templateHisIsShow = isNotEmpty(document.getElementById("templateHisTab"));
                // this.templateVersionIsShow = isNotEmpty(document.getElementById("templateVersionTab"));
                // this.templateCitaIsShow =isNotEmpty(document.getElementById("templateCitationTab"));
            })
        },

        methods: {

            tohelperRule(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html#模板规则',"_blank")
            },
            tohelperMap(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html#模板图',"_blank")
            },
            tohelperVer(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html#版本',"_blank")
            },
            tohelperHis(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html#历史',"_blank")
            },
            tohelperDetail(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html',"_blank")
            },
            tohelperPre(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html#预处理',"_blank")
            },

            // 点击tab时发生改变
            handleClick(tab, event) {
                let that = this;
                // 除了流程图，其他页面都需在进入时初始化
                if (tab.name !== tabType.templateFlowG6){
                    isNotEmpty(that.$refs[tab.name]) && that.$refs[tab.name].init();
                }
            },

            // 从链接进来时进行相应的处理
            parseRouter() {
                let that = this;
                that.activeName = that.$route.query['tab'] === undefined ? tabType.templateFlowG6 : that.$route.query['tab'];
                let templateId = that.$route.query['templateId'];
                let prodId = isNotEmpty(that.$route.query['prodId']) ? that.$route.query['prodId'] : this.gConfig.prodId.value;
                if (templateId !== undefined) {
                    getTemplateById({templateId:templateId, prodId : prodId}).then(res => {
                        that.template = new TemplateBase(res.data.data);
                        Object.assign(that.decs, that.template);
                        that.decs.decsId=that.template.templateId;
                        that.decs.decsName=that.template.templateName;
                        that.$nextTick(() => {
                            isNotEmpty(that.$refs[tabType.templateFlowG6]) && that.$refs[tabType.templateFlowG6].init();
                            isNotEmpty(that.$refs[tabType.templateInf]) && that.$refs[tabType.templateInf].init();
                            isNotEmpty(that.$refs[tabType.templateCode]) && that.$refs[tabType.templateCode].init();
                            isNotEmpty(that.$refs[tabType.templateHis]) && that.$refs[tabType.templateHis].init();
                            isNotEmpty(that.$refs[tabType.templateVersion]) && that.$refs[tabType.templateVersion].init();
                        });
                    });

                }
            },
        }


    }
</script>

<style scoped>
    @import "../index.css";
    @import '../../common/index.css';
</style>
