<template>
    <div id="rule">
        <el-card class="info-title">
        <el-page-header @back="backClick" >
            <template slot="content">
                <span>规则ID：<el-tag class="middle-tag title-tag">{{rule.ruleId}}</el-tag></span>
                <el-divider direction="vertical"></el-divider>
                <span>规则状态：<el-tag :tagType="tagType[rule.status]" class="middle-tag">{{isNotEmpty(statusEnums[rule.status]) ? statusEnums[rule.status].name : ""}}</el-tag></span>
            </template>
        </el-page-header>
        </el-card>


        <el-card class="info-content">
            <div id="ruleCodeTab" v-cmb-auth-remove="res.ruleCode.code"></div>
            <div id="ruleFlowTab" v-cmb-auth-remove="res.ruleFlow.code"></div>
            <div id="ruleHisTab" v-cmb-auth-remove="res.ruleHis.code"></div>
            <div id="ruleVersionTab" v-cmb-auth-remove="res.ruleVersion.code"></div>
            <div id="ruleCitationTab" v-cmb-auth-remove="res.ruleCitation.code"></div>

            <el-tabs :active-name="activeName" @tab-click="handleClick" tabPosition="left" style="margin-top: 15px">

                <el-tab-pane :name="tabType.ruleFlowG6" :key="tabType.ruleFlowG6" >
                    <div slot="label">
                        <span class="">规则图</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperMap"></i>
                    </div>
                    <rule-flow-g6 :ref="tabType.ruleFlowG6" :rule="rule"></rule-flow-g6>
                </el-tab-pane>

                <el-tab-pane :name="tabType.ruleInf" :key="tabType.ruleInf">
                    <div slot="label">
                        <span class="">规则详情</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperDetail"></i>
                    </div>
                    <rule-inf :ref="tabType.ruleInf" :rule="rule"></rule-inf>
                </el-tab-pane>

                <!--规则源码-->
                <el-tab-pane label="规则源码" :name="tabType.ruleCode" :key="tabType.ruleCode" v-if="false" >
                    <rule-code :ref="tabType.ruleCode" :rule="rule"></rule-code>
                </el-tab-pane>


                <!--规则历史-->
                <el-tab-pane  :name="tabType.ruleHis" :key="tabType.ruleHis" v-if="ruleHisIsShow">
                    <div slot="label">
                        <span class="">规则历史</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperHis"></i>
                    </div>
                    <rule-his :p-rule="rule" :ref="tabType.ruleHis"></rule-his>
                </el-tab-pane>

                <!--规则版本-->
                <el-tab-pane  :name="tabType.ruleVersion" :key="tabType.ruleVersion" v-if="ruleVersionIsShow">
                    <div slot="label">
                        <span class="">规则版本</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperVer"></i>
                    </div>
                    <rule-version :p-rule="rule" :ref="tabType.ruleVersion"></rule-version>
                </el-tab-pane>

                <el-tab-pane :name="tabType.ruleCitation" :key="tabType.ruleCitation" v-if="true">
                    <div slot="label">
                        <span class="">引用关系</span>
                        <!-- 帮助文档-->
                        <i class="el-icon-question icon-style" @click="tohelperVer"></i>
                    </div>
                    <rule-citation :ref="tabType.ruleCitation" :p-rule="rule"></rule-citation>
                </el-tab-pane>

            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import RuleHis from "./rule-info-tab/RuleHis";
    import RuleVersion from "./rule-info-tab/RuleVersion";
    import RuleCode from "./rule-info-tab/RuleCode";
    import {RuleBase} from "../../../entity/rule";
    import {getRuleById} from "../../../api/Rule";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import {compEnums, rQueryEnums, statusEnums, tabType, tagType} from "../../../entity/enumns";
    import RuleFlowG6 from "./rule-info-tab/RuleFlowG6";
    import RuleInf from "./rule-info-tab/RuleInf";
    import RuleCitation from "./rule-info-tab/RuleCitation";

    export default {
        name: "RuleInfoHome2",
        components: {RuleCitation, RuleInf, RuleFlowG6, RuleCode, RuleVersion, RuleHis},
        data() {
            return {
                compEnums: compEnums,
                tabType: tabType,
                activeName: '',
                rule: new RuleBase(),
                isEmpty: isEmpty,
                statusEnums: statusEnums,
                ruleCodeIsShow: true,
                ruleFlowIsShow: true,
                ruleHisIsShow: true,
                ruleVersionIsShow: true,
                ruleCitaIsShow:true,
                tagType: tagType
            }
        },

        computed:{
            // 获取返回的地址
            computeGoBack() {
                const goBack = this.$route.query[rQueryEnums.ROUTER_PATH.code];
                if (isEmpty(goBack)) {
                    return "/ui/ruleManage"
                } else {
                    return goBack;
                }
            }
        },

        mounted() {
            this.parseRouter();
            this.$nextTick(()=>{
                this.ruleCodeIsShow = isNotEmpty(document.getElementById("ruleCodeTab"));
                this.ruleFlowIsShow = isNotEmpty(document.getElementById("ruleFlowTab"));
                this.ruleHisIsShow = isNotEmpty(document.getElementById("ruleHisTab"));
                this.ruleVersionIsShow = isNotEmpty(document.getElementById("ruleVersionTab"));
                this.ruleCodeIsShow=isNotEmpty(document.getElementById("ruleCitationTab"));
            })
        },

        methods: {
            backClick(){
                // 如果是从外部规则节点过来，则关闭窗口
                if (this.$route.query[rQueryEnums.FROM_PAGE.code] === compEnums.ERV2.code){
                    window.close()
                } else {
                    this.$router.push(this.computeGoBack)
                }
            },


            /**
             * 点击 tabs 初始化组件
             */
            handleClick(tab, event) {
                let that = this;
                // 除了流程图，其他页面在点击时都需要初始化
                if (tab.name !== tabType.ruleFlowG6) {
                    that.$refs[tab.name].init();
                }
            },
            tohelperMap(){
                window.open(this.helper.helpUri.uri+'/modules/decision/2.html#规则图',"_blank")
            },
            tohelperVer(){
                window.open(this.helper.helpUri.uri+'/modules/decision/2.html#版本',"_blank")
            },
            tohelperHis(){
                window.open(this.helper.helpUri.uri+'/modules/decision/2.html#历史',"_blank")
            },
            tohelperDetail(){
                window.open(this.helper.helpUri.uri+'/modules/decision/2.html',"_blank")
            },

            /**
             * 解析路由初始化 tabs 的组件
             */
            parseRouter() {
                let that = this;
                let ruleId = that.$route.query['ruleId'];
                let tab = that.$route.query['tab'];
                let prodId = isNotEmpty(that.$route.query['prodId']) ? that.$route.query['prodId'] : this.gConfig.prodId.value;
                that.activeName = (tab === undefined ? tabType.ruleFlow : tab);
                if (ruleId !== undefined) {
                    getRuleById({ruleId: ruleId, prodId: prodId}).then(res => {
                        that.rule = new RuleBase(res.data.data);
                        that.$nextTick(() => {
                            // 进入当前页面时，全部需要初始化
                            isNotEmpty(that.$refs[tabType.ruleInf]) && that.$refs[tabType.ruleInf].init();
                            isNotEmpty(that.$refs[tabType.ruleFlowG6]) && that.$refs[tabType.ruleFlowG6].init();
                            isNotEmpty(that.$refs[tabType.ruleCode]) && that.$refs[tabType.ruleCode].init();
                            isNotEmpty(that.$refs[tabType.ruleHis]) && that.$refs[tabType.ruleHis].init();
                            isNotEmpty(that.$refs[tabType.ruleVersion]) && that.$refs[tabType.ruleVersion].init();
                            isNotEmpty(that.$refs[tabType.ruleCitation]) && that.$refs[tabType.ruleCitation].init();
                        });
                    })
                }

                console.log(that.routerPath);
            },

        }
    }
</script>

<style scoped>
    @import "../index.css";
    @import '../../common/index.css';
</style>
