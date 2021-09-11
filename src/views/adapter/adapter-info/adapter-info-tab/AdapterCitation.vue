<template>
    <div id="decsCitation">
        <el-scrollbar>
            <el-card class="his-ver-title">
                <el-table
                        ref="multipleTable"
                        :data="decsVersionCitaion"
                        v-loading="loading"
                        tooltip-effect="dark"
                        stripe
                        highlight-current-row
                        style="width: 100%; "
                        size="mini">
                    <el-table-column label="决策ID" align="center" width="450px"  prop="decsId"></el-table-column>
                    <el-table-column label="决策版本" align="center"   prop="decsVersion"></el-table-column>
                    <el-table-column prop="status" align="center" width="90px" label="决策状态">
                        <template slot-scope="props">
                            <el-tag :type="tagType[props.row.status]">{{statusEnums[props.row.status].name}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="引用规则次数" align="center" width="150px"  prop="ruleCount"></el-table-column>
                    <el-table-column label="引用函数次数" align="center" width="150px"  prop="funcCount"></el-table-column>
                    <el-table-column label="引用组件次数" align="center" width="150px"  prop="cmptCount"></el-table-column>
                    <el-table-column label="引用变量次数" align="center" width="150px"  prop="varsCount"></el-table-column>
                    <el-table-column label="操作" width="100px" align="center" ><!-- fixed="right" width="200px"-->
                        <template slot-scope="scope">
                            <el-button  size="mini" type="primary" @click="showCitation(scope['row'])">
                                显示详情
                            </el-button>
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
                    <div style="margin-bottom: 5px">
                        决策版本为<span style="color: #92b2ef">{{currentVersion==='0'?"无版本":currentVersion}}</span>的引用关系展示
                    </div>
                </div>
                <el-collapse v-model="activeName">
                    <el-collapse-item name="rule">
                        <template slot="title" >
                            <div title="引用规则展示" style="width: 100%">
                                <span>引用规则展示</span>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>

                                <el-button  size="mini"  class="right-button">
                                    展开或关闭
                                </el-button>
                            </div>
                        </template>
                        <el-card>
                            <div> 决策引用关系图：</div>
                        <div>
                            <citation-tooltip :c-node="tooltip.node" :c-point="tooltip.point" v-show="tooltip.isShow"></citation-tooltip>
                            <decs-rule-citation :citePageId="citePageId" ref="decsRuleCitation"  @G6EditorChange="g6EditorChange"></decs-rule-citation>
                        </div>
                        </el-card>
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
                    <!--组件-->
                    <el-collapse-item name="cmpt">
                        <template slot="title">
                            <div title="引用组件展示" style="width: 100%">
                                <span>引用组件展示</span>
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
                                    :data="cmptCitation"
                                    style="cursor: pointer"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="cmptId" label="组件Id" width="350">
                                </el-table-column>
                                <el-table-column prop="cmptName" label="组件名" width="350"></el-table-column>
                                <el-table-column prop="cmptVersion" label="组件版本"></el-table-column>
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
                                    style="cursor: pointer"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="datasourceId" label="数据源Id">
                                </el-table-column>
                                <el-table-column prop="varsId" label="变量Id"></el-table-column>
                                <el-table-column prop="desc" label="变量描述"></el-table-column>
                                <el-table-column prop="isTq" label="是否天擎变量">
                                    <template slot-scope="props">
                                        <el-tag :type="tagType[props.row.isTq]" v-if="props.row.isTq=='Y'">是</el-tag>
                                        <el-tag :type="tagType[props.row.isTq]" v-if="props.row.isTq=='N'">否</el-tag>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>
    </div>
</template>

<script>
    import {DecsBase} from "../../../../entity/decs";
    import {DecsFilter} from "../../index";
    import {queryDecsAllVersionCitation, queryDecsCitation, queryDecsVersionCitation} from "../../../../api/Decs";
    import DecsRuleCitation from "../../../../components/citation/DecsRuleCitation";
    import CitationTooltip from "../../../../components/citation/citationTooltip";
    import {g6Enum} from "../../../../components/g6-editor/entity/entity";
    import {statusEnums, tagType} from "../../../../entity/enumns";

    export default {
        name: "DecsCitation",
        components:{CitationTooltip, DecsRuleCitation},
        props: {
            pDecs: DecsBase
        },
        data(){
            return{
                decsFilter: new DecsFilter(),
                citePageId:"citePageId",
                ruleDto:[],
                ruleList:[],
                ruleCitation:[],
                funcCitation:[],
                cmptCitation:[],
                graph:null,
                varsCitation:[],
                decsCitation:null,
                activeName:[],
                tooltip: {isShow: false, node: {},point:{}},
                pageNum: 1,
                pageSize: 10,
                total: 0,
                loading: false,
                currentVersion:'',
                defaultVersion:'0',
                decsVersionCitaion:[],
                statusEnums: statusEnums,
                tagType: tagType,
            }
        },
        mounted() {
            this.bindEvents();
        },
        methods:{
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
            getGraph(data){
                this.graph=data;
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
                    if (item!=null) {
                        that.graph.setItemState(item, "hover", false);
                    }
                    that.tooltip.isShow = false;
                });


            },
            init(){
                this.refreshPage();
                this.activeName=['rule','func','cmpt','vars'];
            },
            refreshPage() {
                let that=this;
                that.decsVersionCitaion=[];
                let params={
                    prodId:that.gConfig.prodId.value,
                    decsId: that.pDecs.decsId,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize};
                that.loading = true;
                queryDecsAllVersionCitation(params).then(res =>{
                    that.decsVersionCitaion=res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.decsVersionCitaion.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage();
                    }
                    if (that.pageNum===1 && that.total>0){
                        that.defaultVersion=that.decsVersionCitaion[0]["decsVersion"];
                    }
                    that.currentVersion=that.defaultVersion;
                    that.showCitationChange(that.currentVersion);
                }).finally(() => {
                    that.loading = false;
                })
            },
            showCitation(row){
                let that=this;
                that.currentVersion=row.decsVersion;
                that.showCitationChange(that.currentVersion);
            },
            showCitationChange(dv){
                let that = this;
                that.ruleList=[];
                that.ruleCitation=[];
                that.funcCitation=[];
                that.cmptCitation=[];
                that.ruleDto=[];
                that.varsCitation=[];
                let params={
                    prodId:that.gConfig.prodId.value,
                    decsId: that.pDecs.decsId,
                    decsVersion:dv
                };
                // that.loading = true;
                queryDecsVersionCitation(params).then(res =>{
                    that.ruleCitation=[];
                    if (res.data!=null && res.data.length==6){
                        let rules=res.data[0].data;
                        let ruleChildren=res.data[1].data;
                        for (let i=0;i<rules.length;i++){
                            rules[i].children=ruleChildren[i+1];
                            that.ruleCitation.push(rules[i]);
                        }
                        that.ruleList.push(...res.data[1].data[0]);
                        that.ruleDto=res.data[2].data;
                        that.funcCitation=res.data[3].data;
                        that.cmptCitation=res.data[4].data;
                        that.varsCitation=res.data[5].data;
                    }
                    that.$refs.decsRuleCitation.init(that.pDecs, that.ruleCitation,that.ruleList);
                }).finally(() => {
                    that.loading = false;
                })
            },
        },
    }
</script>

<style scoped>

</style>
