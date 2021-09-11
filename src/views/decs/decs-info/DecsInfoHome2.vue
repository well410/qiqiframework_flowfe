<template>
    <div id="decs">
        <el-card class="info-title">
<!--            <el-page-header @back="$router.push('/ui/decsManage')" >-->
            <el-page-header @back="backHomePage" >
                <template slot="content">
                    <span>决策ID：<el-tag class="middle-tag title-tag">{{decs.decsId}}</el-tag></span>
                    <el-divider direction="vertical"></el-divider>
                    <span>决策状态：<el-tag :type="tagType[decs.status]" class="middle-tag">{{isNotEmpty(statusEnums[decs.status]) ? statusEnums[decs.status].name : ""}}</el-tag></span>
                    <el-divider direction="vertical"></el-divider><span>配置版本：<el-tag type='success'  class="middle-tag">{{isNotEmpty(releaseTypeEnums[decs.releaseType]) ? releaseTypeEnums[decs.releaseType].name : ""}}</el-tag></span>
                </template>
            </el-page-header>
        </el-card>
        <el-card class="info-content">

            <div id="decsCodeTab" v-cmb-auth-remove="res.decsCode.code"></div>
            <div id="decsFlowTab" v-cmb-auth-remove="res.decsFlow.code"></div>
            <div id="decsHisTab" v-cmb-auth-remove="res.decsHis.code"></div>
            <div id="decsVersionTab" v-cmb-auth-remove="res.decsVersion.code"></div>
            <div id="decsCitationTab" v-cmb-auth-remove="res.decsCitation.code"></div>

            <el-tabs :active-name="activeName" @tab-click="handleClick" tabPosition="left" style="margin-top: 15px">

                <el-tab-pane :name="tabType.decsFlowG6" :key="tabType.decsFlowG6" v-if="decsFlowIsShow">
                    <div slot="label">
                        <span class="">决策图</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperMap"></i>
                    </div>
                    <decs-flow-g6 :ref="tabType.decsFlowG6" :pDecs="decs"></decs-flow-g6>
                </el-tab-pane>

                <el-tab-pane :name="tabType.decsPreHandleJava" :key="tabType.decsPreHandleJava" v-if="decs.preHandle=== 'Y'">
                    <div slot="label">
                        <span class="">预处理</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperPre"></i>
                    </div>
                    <decs-pre-handle-java :ref="tabType.decsPreHandleJava" :p-decs="decs"></decs-pre-handle-java>
                </el-tab-pane>


                <el-tab-pane :name="tabType.decsInf" :key="tabType.decsInf">
                    <div slot="label">
                        <span class="">决策详情</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperDetail"></i>
                    </div>
                    <decs-inf :ref="tabType.decsInf" :pDecs="decs"></decs-inf>
                </el-tab-pane>

                <!--决策源码-->
                <el-tab-pane label="决策源码" :name="tabType.decsCode" :key="tabType.decsCode" v-if="false">
                    <decs-code :ref="tabType.decsCode" :pDecs="decs"></decs-code>
                </el-tab-pane>


                <!--决策历史-->
                <el-tab-pane :name="tabType.decsHis" :key="tabType.decsHis" v-if="decsHisIsShow">
                    <div slot="label">
                        <span class="">决策历史</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperHis"></i>
                    </div>
                    <decs-his :ref="tabType.decsHis" :pDecs="decs"></decs-his>
                </el-tab-pane>

                <!--决策版本-->
                <el-tab-pane :name="tabType.decsVersion" :key="tabType.decsVersion" v-if="decsVersionIsShow">
                    <div slot="label">
                        <span class="">决策版本</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperVer"></i>
                    </div>
                    <decs-version :ref="tabType.decsVersion" :pDecs="decs"></decs-version>
                </el-tab-pane>

                <!--引用关系-->
                <el-tab-pane :name="tabType.decsCitation" :key="tabType.decsCitation"  v-if="decsCitaIsShow">
                    <div slot="label">
                        <span class="">引用关系</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperVer"></i>
                    </div>
                    <decs-citation :ref="tabType.decsCitation" :pDecs="decs"></decs-citation>
                </el-tab-pane>
            </el-tabs>
        </el-card >

    </div>
</template>

<script>
    import DecsCode from "./decs-info-tab/DecsCode";
    import DecsHis from "./decs-info-tab/DecsHis";
    import DecsVersion from "./decs-info-tab/DecsVersion";
    import DecsCitation from "./decs-info-tab/DecsCitation";
    import {DecsBase} from "../../../entity/decs";
    import {getDecsById} from "../../../api/Decs";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import {releaseTypeEnums, statusEnums, tabType, tagType} from "../../../entity/enumns";
    import DecsPreHandleJava from "./decs-info-tab/DecsPreHandleJava";
    import G6Editor from "../../../components/g6-editor/g6-editor";
    import DecsFlowG6 from "./decs-info-tab/DecsFlowG6";
    import DecsInf from "./decs-info-tab/DecsInf";
    // import Test from "../../../components/slider-dialog/test";



    export default {
        name: "DecsInfoHome2",
        components: {
            DecsInf,
            DecsFlowG6, G6Editor, DecsPreHandleJava, DecsVersion, DecsHis, DecsCode,DecsCitation},
        data() {
            return {
                tabType: tabType,
                activeName: tabType.decsFlowG6,
                statusEnums: statusEnums,
                releaseTypeEnums: releaseTypeEnums,
                isEmpty: isEmpty,
                decs: new DecsBase(),
                decsCodeIsShow: true,
                decsFlowIsShow: true,
                decsHisIsShow: true,
                decsVersionIsShow: true,
                decsCitaIsShow: true,
                tagType: tagType,
            }
        },

        computed: {},

        mounted() {
            this.parseRouter();
            this.$nextTick(()=>{
                this.decsCodeIsShow = isNotEmpty(document.getElementById("decsCodeTab"));
                this.decsFlowIsShow = isNotEmpty(document.getElementById("decsFlowTab"));
                this.decsHisIsShow = isNotEmpty(document.getElementById("decsHisTab"));
                this.decsVersionIsShow = isNotEmpty(document.getElementById("decsVersionTab"));
                this.decsCitaIsShow =isNotEmpty(document.getElementById("decsCitationTab"));
            })
        },

        methods: {

            tohelperRule(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html#决策规则',"_blank")
            },
            tohelperMap(){
                window.open(this.helper.helpUri.uri+'/modules/decision/1.html#决策图',"_blank")
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
                if (tab.name !== tabType.decsFlowG6){
                    isNotEmpty(that.$refs[tab.name]) && that.$refs[tab.name].init();
                }
            },
            // 点击返回时发生改变
            backHomePage() {
                let that = this;
                if(window.location.href.indexOf('decsManageNew') != -1){
                    if(!isEmpty(decs.decsVersionRelProperty) && !isEmpty(decs.decsVersionRelProperty.decsFrontVersion) && decs.decsVersionRelProperty.decsFrontVersion === 'N'){
                        this.$router.push('/ui/decsManageNew')
                    }else{
                        const targetHostName = this.getTargetHostName()
                        console.log("当前获取到的targetHostName：" + targetHostName);
                        let event = {flag: "tcsdecsfrontappnew"};
                        window.parent.postMessage(event, targetHostName);
                    }
                }else if(!isEmpty(that.decs.releaseType) && that.decs.releaseType === 'S'){
                    const targetHostName = this.getTargetHostName()
                    console.log("当前获取到的targetHostName：" + targetHostName);
                    let event = {flag: "tcsdecsfrontapp"};
                    window.parent.postMessage(event, targetHostName);
                }else{
                    this.$router.push('/ui/decsManage')
                }
            },
            getTargetHostName() {
                //本地
                if (window.location.href.indexOf('local') !== -1) {
                    return 'http://tcs.local.cmbchina.cn:9000';
                }else{
                    //return window.location.origin;
                    let matchHref = this.getMatchHref();
                    if (isEmpty(matchHref)) {
                        console.warn("当前网址不是*.cmbchina.cn类型");
                        return 'http://tcs.paas.cmbchina.cn';
                    } else {
                        return `http://tcs.${matchHref[0].split(".")[0]}.cmbchina.cn`;
                    }
                }
            },
            getMatchHref() {
                return window.location.href.match(/[a-zA-z]+\.cmbchina\.cn/g);
            },

            // 从链接进来时进行相应的处理
            parseRouter() {
                let that = this;
                that.activeName = that.$route.query['tab'] === undefined ? tabType.decsFlowG6 : that.$route.query['tab'];
                let decsId = that.$route.query['decsId'];
                let prodId = isNotEmpty(that.$route.query['prodId']) ? that.$route.query['prodId'] : this.gConfig.prodId.value;
                if (decsId !== undefined) {
                    getDecsById({decsId:decsId, prodId : prodId}).then(res => {
                        that.decs = new DecsBase(res.data.data);
                        that.$nextTick(() => {
                            isNotEmpty(that.$refs[tabType.decsFlowG6]) && that.$refs[tabType.decsFlowG6].init();
                            isNotEmpty(that.$refs[tabType.decsInf]) && that.$refs[tabType.decsInf].init();
                            isNotEmpty(that.$refs[tabType.decsInf]) && that.$refs[tabType.decsInf].init();
                            isNotEmpty(that.$refs[tabType.decsCode]) && that.$refs[tabType.decsCode].init();
                            isNotEmpty(that.$refs[tabType.decsHis]) && that.$refs[tabType.decsHis].init();
                            isNotEmpty(that.$refs[tabType.decsVersion]) && that.$refs[tabType.decsVersion].init();
                            isNotEmpty(that.$refs[tabType.decsCitation]) && that.$refs[tabType.decsCitation].init();
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
