<template>
    <div id="decs">
        <el-card class="info-title">
            <el-page-header @back="$router.push('/ui/adapterManage')" >
                <template slot="content">
                    <span>决策ID：<el-tag class="middle-tag title-tag">{{decs.decsId}}</el-tag></span>
                    <!--<el-divider direction="vertical"></el-divider>
                    <span>决策状态：<el-tag :type="tagType[decs.status]" class="middle-tag">{{isNotEmpty(statusEnums[decs.status]) ? statusEnums[decs.status].name : ""}}</el-tag></span>-->
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
                    <adapter-flow-g6 :ref="tabType.decsFlowG6" :pDecs="decs"></adapter-flow-g6>
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
                <!--事件源规则-->
                <template v-for="item in hasAuthNodeWithVarListErv2">
                    <el-tab-pane :name="item.node.nData.uniqueName" :key="item.node.nData.uniqueName" v-if="hasAuthNodeWithVarListErv2.length!==0">
                        <div slot="label">
                            <span class="">外部规则-{{item.node.nData.uniqueName}}</span>
                            <!-- 帮助文档-->
                            <i class="el-icon-question icon-style" @click="tohelperVer"></i>
                        </div>
                        <adapter-rule-tables :ref="item.node.nData.uniqueName"
                                             :p-decs="decs"
                                             :node-with-var="item">
                        </adapter-rule-tables>
                    </el-tab-pane>
                </template>

                <!--评分卡-->
                <template v-for="item in hasAuthNodeWithVarListSc">
                    <el-tab-pane :name="item.node.nData.uniqueName" :key="item.node.nData.uniqueName"  v-if="hasAuthNodeWithVarListSc.length!==0">
                        <div slot="label">
                            <span class="">评分卡-{{item.node.nData.uniqueName}}</span>
                            <!-- 帮助文档-->
                            <i class="el-icon-question icon-style" @click="tohelperVer"></i>
                        </div>
                        <el-button type="primary" size="mini" @click="descUpdate(item.node)">确定</el-button>
                        <el-button type="primary" size="mini" @click="saveDecs(item.node)">保存</el-button>
                        <score-card :ref="item.node.nData.uniqueName"
                                    :node="item.node"
                                    :decisionTree="decisionTree"
                                    :p-decs="decs"
                                    :g6Editor="null"
                                    :score-card-input-var-list="scoreCardInputVarList"></score-card>
                    </el-tab-pane>
                </template>

            </el-tabs>
        </el-card >
<!--&lt;!&ndash;        测试部分&ndash;&gt;-->
<!--        <test></test>-->

    </div>
</template>

<script>
    import DecsHis from "./adapter-info-tab/AdapterHis";
    import DecsVersion from "./adapter-info-tab/AdapterVersion";
    import {DecsBase} from "../../../entity/decs";
    import {getDecsById, getDecsRuleList, getRuleListByDecsId, updateDecs} from "../../../api/Decs";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import {compEnums, statusEnums, tabType, tagType} from "../../../entity/enumns";
    import G6Editor from "../../../components/g6-editor/g6-editor";
    import AdapterFlowG6 from "./adapter-info-tab/AdapterFlowG6";
    import AdapterRuleTables from "../adapter-components/AdapterRuleTables";
    import {getTemplateByDecsId, savePublishDecsByAdapter, savePublishDecsByTemplate} from "../../../api/Template";
    import { NodeWithVars, TemplateVersion} from "../../../entity/template";
    import {G6Model,GetRel,GetExistConfig} from "../../../entity/g6Model";
    import {evVarParse} from "../../../api/Utils";
    import {EVar, PreVar, ROVar} from "../../../entity/vars";
    import ScoreCard from "../../../components/score-card/ScoreCard";
    import G6 from "@antv/g6";
    import {canvasSideWith, canvasTopheight} from "../../../components/common/common";
    import {DecsUpdateDto} from "../../decs";

    export default {
        name: "AdapterInfoHome2",
        components: {
            AdapterRuleTables,
            AdapterFlowG6, G6Editor,  DecsVersion, DecsHis, ScoreCard},
        data() {
            return {
                tabType: tabType,
                activeName: tabType.decsFlowG6,
                statusEnums: statusEnums,
                isEmpty: isEmpty,
                decs: new DecsBase(),
                templateVersion: new TemplateVersion(),
                decsCodeIsShow: true,
                decsFlowIsShow: true,
                decsHisIsShow: true,
                decsVersionIsShow: true,
                decsCitaIsShow: true,
                tagType: tagType,
                decisionTree: Object,
                templateDecisionTree: Object,
                relVar: {eVarList: [], preVarList: [], roVarList: [], tVarList: []},
                ruleTableIsShow: false,
                compVarsTableIsShow: false,
                hasAuthNodeWithVarListErv2: [],
                hasAuthNodeWithVarListSc: [],
                graph:null,
                pageIdForG6Graph: {
                    type: String,
                    default: "graph-container"
                },
                g6Editor:G6Editor,
                height: {
                    type: Number,
                    default: 0
                },
                width: {
                    type: Number,
                    default: 0
                },
            }
        },

        computed: {
            scoreCardInputVarList(){
                let result = [];
                result.push(...this.relVar.eVarList);
                result.push(...this.relVar.preVarList);
                return result;
            },
        },

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
                if (tab.name.indexOf('ER')==0||tab.name.indexOf('SC')==0) {
                    isNotEmpty(that.$refs[tab.name]) && that.$refs[tab.name][0].init();
                    return;
                }
                isNotEmpty(that.$refs[tab.name]) && that.$refs[tab.name].init();
            },

            // 从链接进来时进行相应的处理
            parseRouter() {
                let that = this;
                that.activeName = that.$route.query['returnTab'] === undefined?
                    (that.$route.query['tab'] === undefined ? tabType.decsFlowG6 : that.$route.query['tab'])
                        :that.$route.query['returnTab'];
                let decsId = that.$route.query['decsId'];
                let prodId = isNotEmpty(that.$route.query['prodId']) ? that.$route.query['prodId'] : this.gConfig.prodId.value;
                if (decsId !== undefined) {
                    getDecsById({decsId:decsId, prodId : prodId}).then(res => {
                        that.decs = new DecsBase(res.data.data);
                        that.$nextTick(() => {
                            isNotEmpty(that.$refs[tabType.decsFlowG6]) && that.$refs[tabType.decsFlowG6].init();
                            isNotEmpty(that.$refs[tabType.decsInf]) && that.$refs[tabType.decsInf].init();
                            isNotEmpty(that.$refs[tabType.decsCode]) && that.$refs[tabType.decsCode].init();
                            isNotEmpty(that.$refs[tabType.decsHis]) && that.$refs[tabType.decsHis].init();
                            isNotEmpty(that.$refs[tabType.decsRuleTable]) && that.$refs[tabType.decsRuleTable].init();
                            isNotEmpty(that.$refs[tabType.decsVersion]) && that.$refs[tabType.decsVersion].init();
                            isNotEmpty(that.$refs[tabType.decsCitation]) && that.$refs[tabType.decsCitation].init();
                            isNotEmpty(that.$refs[that.activeName]) && that.$refs[that.activeName].init();
                        });
                        that.decisionTree=JSON.parse(that.decs.ruleJson);
                        getTemplateByDecsId({decsId:that.decs.decsId, prodId : prodId}).then(respon => {
                            that.templateVersion = new TemplateVersion(respon.data.data);
                            that.templateDecisionTree=JSON.parse(that.templateVersion.ruleJson);
                            let nodes=that.templateDecisionTree.nodes;
                            nodes.forEach(tmp=>{
                                let prodIdList=tmp.nData.prodIdList;
                                if (prodIdList!==undefined&&prodIdList!==null){
                                    prodIdList.forEach(tmpProId=>{
                                        if (prodId===tmpProId.prodId){
                                            let nodeWithVars=new NodeWithVars();
                                            let totalVarList = G6Model.getTotalVarsOfParents(tmp, that.decisionTree);
                                            nodeWithVars.node=that.replaceNodeByDecs(tmp.nData.uniqueName,prodIdList);
                                            nodeWithVars.totalVar=totalVarList;
                                            if (tmp.nData.compType===compEnums.ERV2.code) {
                                                that.hasAuthNodeWithVarListErv2.push(nodeWithVars);
                                            }else if (tmp.nData.compType===compEnums.SC.code) {
                                                that.hasAuthNodeWithVarListSc.push(nodeWithVars);
                                            }

                                        }
                                    })
                                }

                            })
                        });
                        that.initVarList()
                        // that.setG6Editor()
                    });


                }

            },


            replaceNodeByDecs(uniqueName,prodIdList){
                let that = this;
                let result={};
                let nodes=that.decisionTree.nodes;
                nodes.forEach(tmp=>{
                    if (tmp.nData.uniqueName===uniqueName) {
                        Object.assign(result,tmp);
                        result.nData.prodIdList=prodIdList;
                    }
                });
                return result;
            },


            descUpdate(value){
                let that = this;
                that.decs.ruleJson = JSON.parse(that.decs.ruleJson);
                let nodes = that.decs.ruleJson.nodes.map(node => {
                    if (node.nData.compType === "ERV2") {
                        node.nData.extRuleList=node.nData.extRuleList.filter(ext=>ext.ruleVersion!==undefined&&ext.ruleVersion!==null&&ext.ruleVersion!=="");
                    }
                    if (node.nData.uniqueName===value.nData.uniqueName) {
                        Object.assign(node,value)
                    }
                    return node;
                });
                that.decs.ruleJson.nodes = nodes;
                that.decs.ruleDrl = G6Model.getDrlCode(that.decs.ruleJson, that.decs);

                let funRelList = GetRel.getFuncRelList(that.decs, that.decs.ruleJson);
                let cmptRelList = GetRel.getCmptRelList(that.decs, that.decs.ruleJson);
                let tqsRelInfo = GetRel.getTqsDSRelList(that.decs, that.decs.ruleJson);
                let dsRelList = GetRel.getDSRelList(that.decs, that.decs.ruleJson);
                let varsRelList = GetRel.getVarsRelList(that.decs, that.decs.ruleJson);
                let ruleRelList = GetRel.getRuleRelList(that.decs, that.decs.ruleJson); //074389

                that.decs.ruleJson = JSON.stringify(that.decs.ruleJson);
                let decsUpdateDto = new DecsUpdateDto({
                    decsBase: that.decs,
                    funcRelList: funRelList,
                    cmptRelList: cmptRelList,
                    tqsRelInfo: tqsRelInfo,
                    dsRelList: dsRelList,
                    varsRelList: varsRelList,
                    decsRuleRelList: ruleRelList,
                });
                savePublishDecsByAdapter({
                    prodId: that.gConfig.prodId.value,
                    decsId: that.decs.decsId,
                    decsUpdateDto: decsUpdateDto
                }).then(res => {
                    that.$message({message: "决策启用成功", type: "success"});
                    Object.assign(that.decs, res.data.data);
                    that.initVarList();
                });

            },


            setG6Editor(){
                let that=this;
                const height = this.height - canvasTopheight;
                const width = this.width-canvasSideWith;
                // that.pageIdForG6Graph=getUUID();
                that.graph = new G6.Graph({
                    container: this.pageIdForG6Graph,
                    height: height,
                    width: width,
                    nodeStateStyles: {
                        hover: {
                            fill: '#c5e6cf',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        },

                        itemSelect: {
                            fill: '#c5e6cf',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        }
                    },

                    edgeStateStyles: {
                        hover: {
                            stroke: '#1890FF',
                        },

                        itemSelect: {
                            stroke: '#1890FF',
                        },
                    },

                    modes: {
                        // 支持的 behavior
                        default: ["drag-canvas", "drag-node", "zoom-canvas", "dblclick", "iclick","tooltipEvent"],
                        show: ["drag-canvas", "zoom-canvas", "dblclick", "iclick","tooltipEvent"],
                        linkEdge: ["click-add-edge", "drag-node", "drag-canvas", "zoom-canvas"],
                    }
                });
                that.graph.read(that.decisionTree);
                that.g6Editor=new G6Editor(that.graph);
            },

            // 初始化可以引用的变量
            initVarList() {
                let that = this;
                // 2. 初始化决策事件变量（与规则映射的变量）
                let aj = that.decs.analysisJson;
                let ie = that.decs.inputExample;

                // 初始化事件变量（String，Double，Date，Integer，object，array类型）
                function setEVarList(res) {
                    let eVarList = res[0].data.data
                        .map(item => new EVar({
                            varName: item.path,
                            varDesc: item.desc,
                            varType: item.type,
                            varValue: item.value
                        }));
                    that.relVar.eVarList = eVarList;
                }

                // 初始化规则输出变量
                function setROVarList(res) {
                    let roVarList = res[1].data.data.map(item => new ROVar({
                        varName: item.ruleId,
                        varDesc: item.ruleName,
                        varType: '',
                    }));
                    that.relVar.roVarList = roVarList;

                }
                function setPreVarList() {
                    that.relVar.preVarList = that.decs.preHandleReturnList.map(item => new PreVar(item));
                }
                Promise.all(
                    [
                        evVarParse({analysisJson: aj, inputExample: ie}),
                        getDecsRuleList({decsId: that.decs.decsId, prodId: this.gConfig.prodId.value}),
                        getRuleListByDecsId({decsId: that.decs.decsId, prodId: this.gConfig.prodId.value}),
                    ]
                ).then(res => {
                    if (that.decs.preHandle === 'Y') {
                        setPreVarList();
                    }
                    setEVarList(res);
                    setROVarList(res);
                })
            },


            // 规则编辑，修改规则信息
            saveDecs(value) {
                let that = this;
                let decsT = new DecsBase(JSON.parse(JSON.stringify(that.decs)));
                decsT.ruleJson=JSON.stringify(that.decisionTree);
                decsT.ruleDrl = G6Model.getDrlCode(that.decisionTree, decsT);
                let decsUpdateDto = new DecsUpdateDto({
                    decsBase: decsT,
                });
                updateDecs({
                    prodId: that.gConfig.prodId.value,
                    decsId: decsT.decsId,
                    decsUpdateDto: decsUpdateDto
                }).then(res => {
                    that.$message({message: '成功', type: 'success'});
                    Object.assign(that.decs, res.data.data);
                    that.initVarList();
                });
            },


            init(){
            }
        }


    }
</script>

<style scoped>
    @import "../index.css";
    @import '../../common/index.css';
</style>
