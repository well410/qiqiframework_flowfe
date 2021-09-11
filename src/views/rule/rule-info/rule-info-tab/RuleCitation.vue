<template>
    <div id="ruleCitation">
        <el-scrollbar>

            <el-card class="his-ver-title">
                <el-table
                        ref="multipleTable"
                        :data="ruleVersionCitaion"
                        v-loading="loading"
                        tooltip-effect="dark"
                        stripe
                        highlight-current-row
                        style="width: 100%; "
                        size="mini">
                    <el-table-column label="规则ID" align="center" width="450px"  prop="ruleId"></el-table-column>
                    <el-table-column label="规则版本" align="center"   prop="ruleVersion"></el-table-column>
                    <el-table-column label="引用规则次数" align="center" width="150px"  prop="ruleCount"></el-table-column>
                    <el-table-column label="被决策引用次数" align="center" width="150px"  prop="decsCount"></el-table-column>
                    <el-table-column label="引用函数次数" align="center" width="150px"  prop="funcCount"></el-table-column>
                    <el-table-column label="引用变量次数" align="center" width="150px"  prop="varsCount"></el-table-column>
                    <el-table-column label="操作" width="100px" align="center" ><!-- fixed="right" width="200px"-->
                        <template slot-scope="scope">
                            <el-button  size="mini" type="primary" @click="showCitation(scope['row'])">
                                显示详情
                            </el-button>
<!--                            <el-button class="icon-button" type="primary" size="mini" @click="showCitation(scope['row'])">显示详情</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>

                <div >
                    <el-pagination
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            style="margin-top: 10px;margin-bottom: 10px"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[10,20, 30, 40]"
                            :page-size="pageSize"
                            :current-page.sync="pageNum"
                            :total="total">
                    </el-pagination>
                </div>
            </el-card>
            <el-card class="node-content-card">
                <div style="display: flex;justify-content: space-between">
                    <div style="margin: 15px 10px">
                        引用关系
                        <el-divider direction="vertical" style="margin: 0 15px"></el-divider>
                        规则版本<div class="cite-version">{{currentVersion==='0'?"无版本":currentVersion}}</div>
                    </div>
                </div>
                <el-collapse v-model="activeName">
                    <!--  规则-->
                    <el-collapse-item name="rule">
                        <template slot="title">
                            <div title="引用规则展示" style="width: 100%">
                                <span>引用规则展示</span>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>

                                <el-button  size="mini"  class="right-button">
                                    展开或关闭
                                </el-button>
                            </div>
                        </template>
                        <el-card>
                            <div>
                                <div> 规则引用关系图：</div>
                                <citation-tooltip :c-node="tooltip.node" :c-point="tooltip.point" v-show="tooltip.isShow"></citation-tooltip>
                                <rule-rule-citation :citePageId="citePageId" ref="ruleRuleCitation" @G6EditorChange="g6EditorChange" @IClick="nodeClick"></rule-rule-citation>
                            </div>
                        </el-card>
                        <citation-graph-show ref="citationGraphShow"></citation-graph-show>
                        <el-card style="margin: 20px 0">
                            <el-table
                                    ref="multipleTable"
                                    tooltip-effect="dark"
                                    :data="ruleDto"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="ruleId" label="规则Id" width="350">
                                </el-table-column>
                                <el-table-column prop="ruleName" label="规则名" width="350"></el-table-column>
                                <el-table-column prop="ruleVersion" label="规则版本"></el-table-column>
                                <el-table-column prop="count" label="版本数量" width="70"></el-table-column>

                            </el-table>
                        </el-card>
                    </el-collapse-item>
                    <!--决策-->
                    <el-collapse-item name="decs">
                        <template slot="title">
                            <div title="被决策引用展示" style="width: 100%">
                                <span>被决策引用展示</span>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>

                                <el-button  size="mini"  class="right-button">
                                    展开或关闭
                                </el-button>
                            </div>
                        </template>
                        <!--@row-click="decsClick"-->
                        <el-card style="margin: 20px 0">
                            <el-table
                                    ref="multipleTable"
                                    tooltip-effect="dark"
                                    :data="decsCitation"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="decsId" label="决策Id" width="350">
                                </el-table-column>
                                <el-table-column prop="decsName" label="决策名" width="350"></el-table-column>
                                <el-table-column prop="decsVersion" label="决策版本"></el-table-column>
                                <el-table-column prop="count" label="版本数量" width="70"></el-table-column>


                            </el-table>
                        </el-card>
                    </el-collapse-item>
                    <!--函数-->
                    <el-collapse-item name="func">
                        <template slot="title">
                            <div title="引用函数展示" style="width: 100%">
                                <span>引用函数展示</span>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>

                                <el-button  size="mini"  class="right-button">
                                    展开或关闭
                                </el-button>
                            </div>
                        </template>

                        <el-card style="margin: 20px 0">
                            <el-table
                                    ref="multipleTable"
                                    tooltip-effect="dark"
                                    :data="funcCitation"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="funcId" label="函数Id" width="350">
                                </el-table-column>
                                <el-table-column prop="funcName" label="函数名" width="350"></el-table-column>
                                <el-table-column prop="funcVersion" label="函数版本"></el-table-column>
                                <el-table-column prop="count" label="版本数量" width="70"></el-table-column>


                            </el-table>
                        </el-card>
                    </el-collapse-item>

                    <!--变量-->
                    <el-collapse-item name="vars">
                        <template slot="title">
                            <div title="引用变量展示" style="width: 100%">
                                <span>引用变量展示</span>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                                <!--不一致是因为之前删库了= =-->
                                <span style="font-size: 5px;margin-left: 10px"> 不保证与引用次数一致</span>
                                <el-button  size="mini"  class="right-button">
                                    展开或关闭
                                </el-button>
                            </div>
                        </template>

                        <el-card style="margin: 20px 0">
                            <el-table
                                    ref="multipleTable"
                                    tooltip-effect="dark"
                                    :data="varsCitation"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="datasourceId" label="数据源Id">
                                </el-table-column>
                                <el-table-column prop="varsId" label="变量Id"></el-table-column>
                                <el-table-column prop="desc" label="变量描述"></el-table-column>
                            </el-table>
                        </el-card>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>
    </div>
</template>

<script>
    import {RuleBase} from "../../../../entity/rule";
    import {RuleFilter} from "../../index";
    import {getRuleDetail, queryRuleAllVersionCitation, queryRuleVersionCitation} from "../../../../api/Rule";
    import RuleRuleCitation from "../../../../components/citation/RuleRuleCitation";
    import {g6Enum} from "../../../../components/g6-editor/entity/entity";
    import CitationTooltip from "../../../../components/citation/citationTooltip";
    import {entityEnums, tabType} from "../../../../entity/enumns";
    import {globalConfig} from "../../../../entity/config";
    import {isEmpty} from "../../../../utils";
    import CitationGraphShow from "../../../common/CitationGraphShow";

    export default {
        name: "RuleCitation",
        components:{CitationGraphShow, CitationTooltip, RuleRuleCitation},
        props: {
            pRule: RuleBase
        },
        data(){
            return{
                citePageId:"citePageId",
                ruleFilter:new RuleFilter(),
                ruleCitation:[],
                funcCitation:[],
                decsCitation:[],
                ruleDto:[],
                varsCitation:[],
                tabType: tabType,
                graph:null,
                activeName:[],
                tooltip: {isShow: false, node: {},point:{}},
                pageNum: 1,
                pageSize: 10,
                total: 0,
                loading: false,
                currentVersion:'',
                defaultVersion:'0',
                ruleVersionCitaion:[],
                clickNodeEntity: {type : null, decs : null, rule : null, isShow : false},
            }

        },
        mounted() {
            this.bindEvents();
        },
        methods:{
            nodeClick(item){
                const model = item.getModel();
                const that = this;
                if(isEmpty(model)) return;

                if (model.ruleOrDecs === entityEnums.RULE.code){
                    let versionId = model.hasVersion ? model.ruleOrDecsDescription : undefined;
                    getRuleDetail({
                        prodId: this.gConfig.prodId.value,
                        ruleId: model.decsOrRuleId,
                        versionId: versionId
                    }).then(res=>{
                        that.clickNodeEntity.rule = res.data.data;
                        that.clickNodeEntity.type = entityEnums.RULE.code;
                        that.clickNodeEntity.isShow = true;
                        that.$nextTick(()=>{
                            that.$refs.citationGraphShow.init(that.clickNodeEntity);
                        });
                    })
                }

            },

            decsClick(row){
                this.$router.push({path: "/ui/decsManage/decsInf", query: {decsId: row.decsId, tab: tabType.decsFlowG6, prodId: this.gConfig.prodId.value}});
            },

            // 改变页面size
            handleSizeChange(val) {
                let that = this;
                that.pageSize = val
                that.refreshPage()
            },

            // 跳页
            handleCurrentChange(val) {
                let that = this;
                that.pageNum = val
                that.refreshPage()
            },
            g6EditorChange(data){
                this.graph=data;
            },
            init(){
                this.refreshPage();
                this.activeName=['rule','decs','func','vars'];
            },
            bindEvents() {
                let that=this;
                //鼠标进入
                that.$bus.$on(g6Enum.ON_MOUSE_ENTER.code+ this.citePageId,evt=>{

                    const {item}=evt;
                    that.graph.setItemState(item,"hover",true);
                    that.tooltip.node=evt.item.getModel();
                    that.tooltip.point=that.graph.getClientByPoint(evt.x, evt.y);
                    that.tooltip.isShow=true;
                });

                that.$bus.$on(g6Enum.ON_MOUSE_LEAVE.code+this.citePageId,evt=>{
                    const {item}=evt;
                    if (item!=null){
                        that.graph.setItemState(item,"hover",false);
                    }
                    that.tooltip.isShow=false;
                });
            },
            refreshPage(){
                let that=this;
                that.ruleVersionCitaion=[];
                let params={
                    prodId:globalConfig.prodId.value,
                    ruleId:that.pRule.ruleId,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize};
                JSON.stringify(params);
                that.loading = true;

                queryRuleAllVersionCitation(params).then(res =>{
                    that.ruleVersionCitaion=res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.ruleVersionCitaion.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage();
                    }
                    if (that.pageNum===1 && that.total>0 && that.ruleVersionCitaion[0]["ruleVersion"]=="0"){
                        // that.defaultVersion=that.ruleVersionCitaion[0]["ruleVersion"];
                        that.ruleVersionCitaion[0]["ruleVersion"]="无版本";
                    }
                    that.defaultVersion=that.ruleVersionCitaion[0]["ruleVersion"];
                    that.currentVersion=that.defaultVersion;
                    that.showCitationChange(that.currentVersion);
                }).finally(() => {
                    that.loading = false;
                })
            },
            showCitation(row){
                let that=this;
                that.currentVersion=row.ruleVersion;
                that.showCitationChange(that.currentVersion);
            },
            showCitationChange(rv){
                let that = this;
                if (rv=="无版本"){
                    rv="0";
                }
                that.ruleCitation=[];
                that.funcCitation=[];
                that.decsCitation=[];
                that.ruleDto=[];
                that.varsCitation=[];
                let params={
                    prodId:globalConfig.prodId.value,
                    ruleId:that.pRule.ruleId,
                    ruleVersion:rv
                };
                that.loading = true;
                queryRuleVersionCitation(params).then(res =>{
                    if (res.data!=null && res.data.length==6){
                        let rules=res.data[0].data;
                        let ruleChildren=res.data[1].data;
                        for (let i=0;i<rules.length;i++){
                            rules[i].children=ruleChildren[i];
                        }
                        that.ruleCitation=rules;
                        that.ruleDto=res.data[2].data;
                        that.funcCitation=res.data[3].data;
                        that.decsCitation=res.data[4].data;
                        that.varsCitation=res.data[5].data;
                    }
                    that.$refs.ruleRuleCitation.init(that.ruleCitation);
                }).finally(() => {
                    that.loading = false;
                })
            },
        },

    }
</script>

<style scoped>
    #ruleCitation .el-divider.el-divider--vertical{
        margin: 0 15px;
    }

</style>
