<template>
    <div id="tqsVarEdit" ref="tqsVarEdit" style="min-height: 100%">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled">
                <template slot="right">
                    <el-divider direction="vertical"/>
                    <el-button type="primary" size="mini" @click="cleanAndReSet" :disabled="disabled">
                        重置
                    </el-button>
                </template>
            </node-inf>
            <el-card class="node-content-card" style="padding-top: 12px;padding-bottom: 12px">
                <el-card v-model="tqsVarConfig.tqsDatasource">
                    <div slot="header">
                        <span>天擎数据源基础配置</span>
                    </div>
                    <el-form label-width="90px" style="padding-top: 18px" size="small">
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="12">
                                <el-form-item label="数据源ID" style="margin-bottom: 6px">
                                    <el-input v-model="tqsVarConfig.tqsDatasource.datasourceId" maxlength="16"
                                              :disabled="datasourceIdDisabled"
                                              show-word-limit/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="12">
                                <el-form-item label="数据源名称" style="margin-bottom: 6px">
                                    <el-input v-model="tqsVarConfig.tqsDatasource.datasourceName" maxlength="24"
                                              show-word-limit :readonly="disabled"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="12">
                                <el-form-item label="关联组件" style="margin-bottom: 6px">
                                    <el-input
                                            v-model="isEmpty(tqsVarConfig.cmpt.cmptId) ? '' :
                                            tqsVarConfig.cmpt.cmptId+'['+tqsVarConfig.cmpt.cmptName+']'+'['+tqsVarConfig.cmpt.cmptVersion+']'"
                                            onmouseover="this.title=this.value" readonly/>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="12" style="padding-left: 6px">
                                <el-button type="primary" size="small" @click="cmptSelBefore" :disabled="disabled">组件选择</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-card>
            </el-card>
            <el-card class="node-content-card" style="padding-top: 12px;padding-bottom: 12px">
                <el-collapse v-model="activeNames">
                    <!--请求体映射-->
                    <el-collapse-item name="evVarsEdit">
                        <template slot="title">
                            <div title="天擎事件变量">
                                <span>数据源事件变量映射</span>
                                <i class="header-icon el-icon-info"/>
                            </div>
                            <div class="tools">
                                <span style="margin-left: 20px;color: red">{{bodyErrorMsg}}</span>
                            </div>
                        </template>
                        <field-table :node="node" :p-ref-field-map="varsRelMap" ref="evRefTable"
                                     :tqs-datasource="tqsVarConfig.tqsDatasource" :error-message="bodyErrorMsg"
                                     :disabled="disabled"/>
                    </el-collapse-item>
                    <el-collapse-item name="memVarsEdit">
                        <template slot="title">
                            <div title="将天擎变量计算结果整合到Fact对象中，并传给子节点">
                                <span>内存统计变量映射与筛选</span>
                                <i class="header-icon el-icon-info"/>
                            </div>
                        </template>
                        <div>
                            <el-button style="margin-bottom: 5px" type="primary" size="mini" :disabled="disabled"
                                       @click.stop="filterMemVarListBefore">统计变量筛选
                            </el-button>
                        </div>
                        <pl-table
                                ref="multipleTable"
                                :data="covFieldList"
                                tooltip-effect="dark"
                                :max-height="160"
                                stripe
                                border
                                size="mini">
                            <el-table-column type="index" width="50"></el-table-column>
                            <el-table-column prop="varName" label="字段输出名">
                                <template slot-scope="prop">{{prop.row.getPrefixVarName()}}</template>
                            </el-table-column>
                            <el-table-column prop="varType" label="字段类型"></el-table-column>
                            <el-table-column prop="varDesc" label="字段描述"></el-table-column>
                        </pl-table>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>

        <!--组件筛选-->
        <el-dialog :visible.sync="cmptTable.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   class="node-new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{cmptTable.title}}</div>
                </div>
            </div>
            <cmpt-table :p-decision-tree="decisionTree"
                    @cmptSelAfter="cmptSelAfter"
                    ref="cmptTable"/>
        </el-dialog>

        <!--内存统计变量筛选-->
        <el-dialog :visible.sync="memVarFilterDialog.isShow"
                   :modal="false"
                   :close-on-click-modal="false"
                   class="node-new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{memVarFilterDialog.title}}</div>
                </div>
            </div>
            <mem-var-filter
                    ref="memVarFilter"
                    :node="node"
                    :s-decs="pDecs"
                    :p-tqs-datasource="tqsVarConfig.tqsDatasource"
            />
            <template slot="footer">
                <el-button type="" size="mini" @click="memVarFilterDialog.isShow = false">取消</el-button>
                <el-button type="primary" size="mini" @click="filterMemVarListAfter">确定</el-button>
            </template>
        </el-dialog>

    </div>
</template>

<script>

    import resizeForDrawer from "../mixins/resizeForDrawer";
    import NodeInf from "../common/node-inf";
    import CmptTable from "./cmptTable";
    import {isNotEmpty, isEmpty} from "../../utils";
    import {G6Model} from "../../entity/g6Model";
    import {Cmpt} from "../../entity/cmpt";
    import {TqsDatasource} from "../../entity/datasource";
    import {COVar} from "../../entity/vars";
    import FieldTable from "./children/FieldTable";
    import MemVarFilter from "./children/MemVarFilter";
    import {varFromEnums, varTypeEnums} from "../../entity/enumns";
    import {TqsMemVal} from "../../entity/vars";

    export default {
        name: "TqsVarEdit",
        mixins: [resizeForDrawer],
        components: {MemVarFilter, NodeInf, CmptTable, FieldTable},
        props: {
            decisionTree: Object,
            node: Object,
            pDecs: {
                default: () => {
                }, type: Object
            },
            disabled: {default: false, type: Boolean},
            // 变量节点编辑的输入（见tqsVarEditInputVarList）
            tqsVarEditInputVarList: {default: () => [], type: Array},
        },
        data() {
            return {
                datasourceIdDisabled: false,
                cmptTable: {dialog: false, title: '组件选择'},
                tqsDsIdDisabled: false,
                activeNames: ["evVarsEdit", "memVarsEdit"],
                // 节点中的配置
                tqsVarConfig: {tqsDatasource: new TqsDatasource(), cmpt: new Cmpt(), memVarList: [],},
                // 内存统计变量筛选窗口
                memVarFilterDialog: {isShow: false, title: '内存统计变量筛选'},
                bodyErrorMsg: '',
                mapFieldList: [],
                covFieldList: [],
                // 可以引用的变量
                tqsVarsRel: {totalVarList: []},
                varFromEnums: varFromEnums,
                varTypeEnums: varTypeEnums,
                // 内存变量
                memVarList: [],
            }
        },
        mounted() {
        },
        computed: {
            // 上游节点的输入
            varsRelMap() {
                let result = [];
                result.push(...this.tqsVarEditInputVarList);
                result.push(...this.tqsVarsRel.totalVarList);
                result = result.filter(item => !['object', 'array'].includes(item.varType));
                let refMap = {};
                result.forEach(item => {
                    let desc = item.varDesc.replace(new RegExp("_", "gm"), "-");
                    refMap[item.varName + '[' + item.getPrefixVarName() + ']'] = desc + '-' + item.varType;
                });
                return refMap;
            },
        },
        watch: {
            tqsVarConfig: {
                handler(value) {
                    let that = this;
                    that.node.nData.tqsVarConfig = value;
                },
                deep: true
            },
            covFieldList: {
                handler(value) {
                    let that = this;
                    that.node.nData.covFieldList = value;
                },
                deep: true
            },
        },
        methods: {
            //初始化
            init() {
                let that = this;
                // 初始化父节点的变量
                that.tqsVarsRel.totalVarList = G6Model.getTotalVarsOfParents(that.node, that.decisionTree);
                // 初始化节点数据
                that.isEmpty(that.node.nData.tqsVarConfig) ? that.tqsVarConfig = {
                    tqsDatasource: new TqsDatasource(),
                    cmpt: new Cmpt(),
                    memVarList: [],
                } : that.node.nData.tqsVarConfig;
                that.isEmpty(that.node.nData.tqsVarConfig) || that.isEmpty(that.node.nData.tqsVarConfig.cmpt) ? that.tqsVarConfig.cmpt = new Cmpt() : that.tqsVarConfig.cmpt = that.node.nData.tqsVarConfig.cmpt;
                that.isEmpty(that.node.nData.tqsVarConfig) || that.isEmpty(that.node.nData.tqsVarConfig.tqsDatasource) ? that.tqsVarConfig.tqsDatasource = new TqsDatasource() : that.tqsVarConfig.tqsDatasource = that.node.nData.tqsVarConfig.tqsDatasource;
                // that.isEmpty(that.node.nData.mapFieldList) ? that.mapFieldList = [] : that.mapFieldList = that.node.nData.mapFieldList.map(item => new tqsMapFields(item));
                that.isEmpty(that.node.nData.tqsVarConfig) || that.isEmpty(that.node.nData.covFieldList) ? that.covFieldList = [] : that.covFieldList = that.node.nData.covFieldList.map(item => new COVar(item));
                that.isEmpty(that.node.nData.tqsVarConfig) || that.isEmpty(that.node.nData.tqsVarConfig.memVarList) ? that.tqsVarConfig.memVarList = [] : that.tqsVarConfig.memVarList = that.node.nData.tqsVarConfig.memVarList;

                // 内存统计变量采用实时获取，不存入node-json
                // that.isEmpty(that.tqsVarConfig.tqsDatasource.memVars) ? that.memVarList = [] : that.memVarList = that.map2ListOfMemVar(JSON.parse(that.tqsVarConfig.tqsDatasource.memVars));
                that.datasourceIdDisabled = that.tqsVarConfig.tqsDatasource.datasourceId == undefined || that.tqsVarConfig.tqsDatasource.datasourceId.length < 1 ? false : true;
                // 初始化页面
                that.$refs.evRefTable.init();
            },

            //筛选内存变量
            filterMemVarListBefore() {
                this.memVarFilterDialog.isShow = true;
                this.$nextTick(() => {
                    this.$refs.memVarFilter.init();
                })
            },
            //筛选内存变量
            filterMemVarListAfter() {
                let that = this;
                let resultOfFilter = that.$refs.memVarFilter.resultOfFilter();
                that.tqsVarConfig.memVarList = resultOfFilter;
                that.setCovFieldList(resultOfFilter);
                that.memVarFilterDialog.isShow = false;
            },
            // 关联组件选择前
            cmptSelBefore() {
                let that = this;
                that.cmptTable.dialog = true;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.cmptTable)) {
                        that.$refs.cmptTable.init();
                    }
                });
            },
            // 关联组件选择后
            cmptSelAfter(cmpt) {
                //展示相关变量
                let that = this;
                cmpt.cmptVersion = isNotEmpty(cmpt.cmptVersion) ? cmpt.cmptVersion : '';
                that.tqsVarConfig.cmpt = cmpt;
                that.tqsVarConfig.tqsDatasource.cmptId = cmpt.cmptId;
                that.tqsVarConfig.tqsDatasource.cmptVersion = cmpt.cmptVersion;
                that.$nextTick(() => {
                    that.cmptTable.dialog = false;
                })
            },
            //结果输出节点映射
            setCovFieldList(selectedList) {
                let that = this;
                that.covFieldList = [];
                selectedList.forEach(item => {
                    that.covFieldList.push(new COVar({
                        mapField: 'data.vars.' + item.varName,//专属特定路径
                        varName: item.varName,
                        varDesc: item.varDesc,
                        varType: item.varType,
                        decsId: that.pDecs.decsId,
                        varFrom: that.varTypeEnums.tqsMv.code,
                        nodeId: that.node.nData.uniqueName,
                    }));
                });
            },
            //重置
            cleanAndReSet() {
                let that = this;
                that.covFieldList = [];
                that.mapFieldList = [];
                that.tqsVarConfig = {tqsDatasource: new TqsDatasource(), cmpt: new Cmpt(), memVarList: [],};
                that.$refs.evRefTable.cleanAndReset();
                that.datasourceIdDisabled = false;
            },
        },
    }
</script>

<style scoped>
    @import "../../views/common/index.css";

    #tqsVarEdit {
        /*margin-top: 15px;*/
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    .tools {
        margin-left: 15px;
    }
</style>
