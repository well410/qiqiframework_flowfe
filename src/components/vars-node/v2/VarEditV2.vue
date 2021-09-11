<template>
    <!--变量平台2.0-->
    <div id="varEdit" ref="varEdit" style="min-height: 100%">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled">
                <template slot="right">
                    <el-divider direction="vertical"></el-divider>
                    <el-dropdown trigger="click"  @command="handleCommand">
                        <el-button type="primary" size="mini">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  command="varSelBefore">添加变量</el-dropdown-item>
                            <el-dropdown-item  command="openTotal">展开全部</el-dropdown-item>
                            <el-dropdown-item  command="closeTotal">关闭全部</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </node-inf>
            <div class="node-search-block">
                <el-row style="line-height: 40px;margin: 10px 0">
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-right:15px ">
                        <el-select placeholder="搜索类型" v-model="searchType" style="border-radius: 50px" @change="refreshVarsListPage">
                            <el-option label="标题栏" key="just_title"  value="just_title"></el-option>
                            <el-option label="返回结果" key="just_result" value="just_result"></el-option>
                            <el-option label="标题栏和返回结果" key="result_title"  value="result_title"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :xs="15" :sm="15" :md="15" :lg="15" :xl="16">

                        <el-input class='node-search-input' prefix-icon="el-icon-search" placeholder="请输入查询关键字" v-model="searchCon"
                                  maxlength="64" show-word-limit
                                  @keydown.enter.native="refreshVarsListPage">
                        </el-input>
                    </el-col>
                    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="2">
                        <el-button size="mini" @click="cancel">取消</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-divider class="search-block-divider"></el-divider>
            <div v-if="isEmpty(varConfigshowList)">
                <el-form style="margin:5px;">
                    <el-form-item class="no-data">
                        <svg-icon icon-class="vars"></svg-icon>
                        <br/>
                        <span>暂无变量信息，点击【操作】-【添加变量】吧~</span>
                    </el-form-item>
                </el-form>
            </div>
            <el-card class="node-content-card" :body-style="{padding:0}" v-else>
                <el-collapse v-model="activeNames">
                    <!--URL变量映射-->
                    <el-collapse-item :name="item.getUniqueId()" v-for="item in varConfigshowList" :key="item.getUniqueId()">
                        <template slot="title">
                            <div :title="item.getVarBaseDesc()+'   ||  '+item.getDsDesc()" style="width: 100%">
                                <div style="float: left">
                                    <div style="line-height: 33px;height: 33px;"><div style="float: left;width: 60px;text-align-last: justify;">变量：</div>{{item.getVarBaseDesc()}}</div>
                                    <div style="line-height: 15px;height: 15px;"><div style="float: left;width: 60px;text-align-last: justify;">数据源：</div>{{item.getDsDesc()}}</div>
                                </div>
                                <i class="header-icon el-icon-info" style="margin-left: 10px"></i>

                                <el-button :disabled="disabled" type="danger" icon="el-icon-delete" size="mini" @click.stop="varConfigDelete(item)" class="right-button">
                                    删除
                                </el-button>
                            </div>
                        </template>
                        <el-card :body-style="{padding:0}" >
                            <div slot="header">
                                <span>查询参数配置--占位符映射</span>
                            </div>
                            <el-form>
<!--                                <el-form-item label="查询维度">{{item.varBase.queryDimensionKey}}</el-form-item>-->
                                <el-form-item v-if="item.qdMapList.length > 0" style="margin-bottom:0px">
                                    <el-table
                                            ref="multipleTable"
                                            :data="item.qdMapList"
                                            tooltip-effect="dark"
                                            stripe
                                            border
                                            size="mini">
                                        <el-table-column :label="getQueryDimensionKeyDesc(item.varBase.queryDimensionKey)">
                                            <el-table-column prop="qKey" label="占位符"></el-table-column>
                                            <el-table-column prop="mapField" label="映射字段">
                                                <template slot-scope="props">
                                                    <el-select :disabled="disabled" v-model="props.row.mapField"
                                                               placeholder="请配置映射参数"
                                                               clearable
                                                               filterable
                                                               collapse-tags
                                                               style="width: 300px"
                                                               size="mini">
                                                        <el-option v-for="item in varsRelList"
                                                                   :key="item.getPrefixVarName()"
                                                                   :label="item.getDescVarName()"
                                                                   :value="item.getPrefixVarName()">
                                                            <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-table-column>
                                        </el-table-column>

                                    </el-table>
                                </el-form-item>
                            </el-form>
                        </el-card>
                        <el-card style="margin: 10px 0" :body-style="{padding:0}">
                            <div slot="header">
                                <span>返回结果</span>
                                <el-button style="float: right;"
                                           type="primary"
                                           size="mini"
                                           v-if="isCanFilterRdvList(item)"
                                           @click.stop="filterRdvListBefore(item)">筛选</el-button>
                            </div>
                            <el-table
                                    ref="multipleTable"
                                    :data="item.rdvList"
                                    tooltip-effect="dark"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="varName" label="字段名">
                                    <template slot-scope="prop">{{prop.row.getPrefixVarName()}}</template>
                                </el-table-column>
                                <el-table-column prop="varType" label="字段类型"></el-table-column>
                                <el-table-column prop="varDesc" label="字段描述"></el-table-column>
                            </el-table>
                        </el-card>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>


        <!--变量平台中获取redis的配置-->
        <el-dialog :visible.sync="varTable.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   class="node-new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{varTable.title}}</div>
                </div>
            </div>
            <var-table-v2
                    ref="varTable"
                    :p-var-config-list="varConfigshowList"
                    @varSelAfter="varSelAfter"></var-table-v2>
        </el-dialog>


        <!--返回结果筛选-->
        <el-dialog :visible.sync="varRdvFilter.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   class="node-new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{varRdvFilter.title}}</div>
                </div>
            </div>
            <var-rdv-filter-v2
                    ref="varRdvFilter"
                    :p-var-config="varRdvFilter.varConfig"></var-rdv-filter-v2>
            <template slot="footer">
                <el-button type="" size="mini" @click="varRdvFilter.dialog = false">取消</el-button>
                <el-button type="primary" size="mini" @click="filterRdvListAfter">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {isEmpty, isNotEmpty} from "../../../utils";
    import VarTable from "../v1/VarTable";
    import VarResultTable from "../v1/children/VarResultTable";
    import resizeForDrawer from "../../mixins/resizeForDrawer"
    import {G6Model} from "../../../entity/g6Model";
    import NodeInf from "../../common/node-inf";
    import VarTableV2 from "./VarTableV2";
    import {VarConfig} from "./index";
    import VarRdvFilterV2 from "./VarRdvFilterV2";

    export default {
        name: "VarEditV2",
        mixins: [resizeForDrawer],
        components: {VarRdvFilterV2, VarTableV2, NodeInf, VarResultTable, VarTable},
        props: {
            decisionTree: Object,
            node: Object,
            disabled: {default: false, type: Boolean},
            // 变量节点编辑的输入（见varEditInputVarList ）
            varEditInputVarList: {default: () => [], type: Array},
        },

        data() {
            return {
                varTable: {dialog: false, title: '变量选择'},
                varRdvFilter: {dialog: false, title: '返回结果筛选', varConfig : null},
                activeNames: [],
                // 节点中的配置
                varConfigList: [],
                varConfigshowList:[],
                // 可以引用的变量
                varsRel: {totalVarList: [],},
                searchCon:"",
                searchType:"just_title"
            }
        },

        computed: {
            // 上游节点的输入
            varsRelList() {
                let result = [];
                result.push(...this.varEditInputVarList);
                result.push(...this.varsRel.totalVarList);
                return result.filter(item => !['object', 'array'].includes(item.varType))
            },

            // 是否能够过滤 redis 返回结果，如果返回是object类型，可以进行更新
            isCanFilterRdvList() {
                return (item) => {
                    return item['varBase'].dataType === 'object';
                }
            }
        },


        watch: {
            varConfigList: {
                handler(value) {
                    let that = this;
                    that.node.nData.varConfigList = value;
                    that.varConfigshowList = that.varConfigList
                },
                deep: true
            },
        },
        mounted() {

        },

        methods: {
            refreshVarsListPage(){
                let that = this;
                let  type = that.searchType
                switch (type) {
                    case 'result_title':
                        that.varConfigshowList=that.varConfigList.filter(
                            item=>(item.getVarBaseDesc().toLowerCase().includes(that.searchCon.toLowerCase())||
                                item.getDsDesc().toLowerCase().includes(that.searchCon.toLowerCase())||
                                item.getRdvListStr().toLowerCase().includes(that.searchCon.toLowerCase())
                            ));
                        break;
                    case "just_result":
                        that.varConfigshowList=that.varConfigList.filter(
                            item=>(item.getRdvListStr().toLowerCase().includes(that.searchCon.toLowerCase())
                            ));
                        break
                    case "just_title":
                        that.varConfigshowList=that.varConfigList.filter(
                            item=>(item.getVarBaseDesc().toLowerCase().includes(that.searchCon.toLowerCase())||
                                item.getDsDesc().toLowerCase().includes(that.searchCon.toLowerCase())
                            ));
                        break
                    default:
                        that.varConfigshowList=that.varConfigList.filter(
                            item=>(item.getVarBaseDesc().toLowerCase().includes(that.searchCon.toLowerCase())||
                                item.getDsDesc().toLowerCase().includes(that.searchCon.toLowerCase())
                            ));
                        break
                }

            },
            // 过滤rdv之前
            filterRdvListBefore(item){
                this.varRdvFilter.dialog = true;
                this.varRdvFilter.varConfig = VarConfig.obj2VarConfig(JSON.parse(JSON.stringify(item)));
                this.$nextTick(()=>{
                    this.$refs.varRdvFilter.init();
                })
            },

            // 过滤rdv后
            filterRdvListAfter(){
                const that = this;
                const resultOfFilter = that.$refs.varRdvFilter.resultOfFilter();
                that.varConfigList.forEach(item => {
                    if (that.varRdvFilter.varConfig.getUniqueId() === item.getUniqueId()){
                        Object.assign(item, {rdvList : resultOfFilter})
                    }
                });
                that.varRdvFilter.dialog = false;
            },


            // 下拉框命令操作
            handleCommand(command){
                switch (command) {
                    case 'openTotal':
                        this.openTotal();
                        break;
                    case 'closeTotal':
                        this.closeTotal();
                        break;
                    case 'varSelBefore':
                        this.varSelBefore();
                        break;
                }
            },

            openTotal(){
                this.activeNames = this.varConfigList.map(item => item.getUniqueId());
            },

            closeTotal(){
                this.activeNames = [];
            },

            // 变量选择前，弹出变量弹框
            varSelBefore() {
                let that = this;
                that.varTable.dialog = true;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.varTable)) {
                        that.$refs.varTable.init();
                    }
                });
            },

            init() {
                let that = this;
                // 初始化整个页面的数据结构
                that.varConfigList = [];
                if (!isEmpty(that.node.nData.varConfigList)) {
                    that.varConfigList = that.node.nData.varConfigList.map(item => VarConfig.obj2VarConfig(item));
                }


                that.activeNames = that.varConfigList.map(item => item.getUniqueId());

                // 初始化父节点的变量
                this.varsRel.totalVarList = G6Model.getTotalVarsOfParents(that.node, that.decisionTree);
            },

            // 删除变量
            varConfigDelete(row) {
                this.varConfigList = this.varConfigList.filter(item => item.getUniqueId() !== row.getUniqueId());
            },

            // 变量选择后添加变量的config
            varSelAfter(varConfig) {
                let isHas = this.varConfigList.filter(item => item.getUniqueId() === varConfig.getUniqueId()).length > 0;
                if (isHas) {
                    this.$message({type: 'warning', message: `${VarConfig.obj2VarConfig(varConfig).getDecs()} 字段已存在，请勿重复添加`});
                } else {
                    this.varConfigList.push(varConfig);
                }

            },
            cancel(){
                this.searchCon = "";
            },
            getQueryDimensionKeyDesc(value){
                return "查询维度: "+value;
            },
        }
    }
</script>

<style scoped>
    @import "../../../views/common/index.css";

    #varEdit {
        /*margin-top: 15px;*/
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    .tools {
        margin-left: 15px;
    }
    .search-block-divider.el-divider{
        margin: 0;
    }
</style>
