<template>
    <!--
        外部规则节点
    -->
    <div id="extraRule" ref="extraRule">
        <el-scrollbar>
            <node-inf :node="node" :disabled="disabled">
            <template slot="right">
<!--                <el-form-item label="操作">-->
<!--                    <el-button size="mini" :disabled="disabled" type="success" @click="extRuleSelBefore">添加</el-button>-->
<!--                </el-form-item>-->
                <el-divider direction="vertical"></el-divider>
                <el-dropdown trigger="click"  @command="handleCommand">
                    <el-button type="primary" size="mini">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  command="extRuleSelBefore">添加</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </node-inf>
        <!--
        <el-form size="mini" label-width="80px" :inline="true">
            <el-form-item label="节点Id">
                <el-input style="width: 100px" disabled v-model="node.id"></el-input>
            </el-form-item>

            <el-form-item label="节点名">
                <el-input style="width: 193px" :disabled="disabled" v-model="node.name"></el-input>
            </el-form-item>

            <el-form-item label="连线类型">
                <el-select :disabled="disabled" v-model="node.connType" style="width: 100px">
                    <el-option label="或" key="or" value="or"></el-option>
                    <el-option label="且" key="and" value="and"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="操作">
                <el-button size="mini" :disabled="disabled" type="success" @click="extRuleSelBefore">添加</el-button>
            </el-form-item>
        </el-form> -->
            <el-card>
            <el-collapse v-model="activeNames">
            <!--版本选择-->
            <el-collapse-item name="selRule">
                <template slot="title">
                    <div title="规则版本选择" style="width: 200px">
                        <span>规则版本选择</span>
                        <i class="header-icon el-icon-info"></i>
                    </div>
                </template>
                <el-table
                        :data="ruleListRelByDecs"
                        tooltip-effect="dark"
                        stripe
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column prop="decsId" label="决策id">
                        <template slot-scope="props">
                            {{pDecs.decsId}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="ruleId" label="规则id"></el-table-column>
                    <el-table-column prop="ruleName" label="规则名"></el-table-column>
                    <el-table-column prop="ruleVersion" label="规则版本" :formatter="versionFormatter">
                    <!--    <template slot-scope="props">
                            <el-select v-model="props.row.ruleVersion" filterable :disabled="disabled">
                                <el-option label="线下" value=""></el-option>
                                <el-option v-for="item in ruleVersionList(props.row.ruleId)"
                                           :label="`线上${item['ruleVersion']}`"
                                           :key="item['ruleVersion']"
                                           :value="item['ruleVersion']">
                                    <span :title="item['ruleVersion']" class="option-left">{{item['ruleVersion']}}</span>
                                    <span title="线上" class="option-right">线上</span>
                                </el-option>
                            </el-select>
                        </template> -->
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template slot-scope="scope">
                            <el-button :disabled="disabled" type="danger" size="mini" @click="ruleRelDeleteClick(scope['row'])">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
            <!--变量映射-->
            <el-collapse-item name="selVar">
                <template slot="title">
                    <div title="决策规则变量映射" style="width: 200px">
                        <span>决策规则变量映射</span>
                        <i class="header-icon el-icon-info"></i>
                    </div>
                </template>
                <el-table
                        :data="evMappingList"
                        tooltip-effect="dark"
                        stripe
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column prop="ruleId"  label="规则id"></el-table-column>
                    <el-table-column prop="ruleVersion" :formatter="versionFormatter"
                                     label="规则版本"></el-table-column>
                    <el-table-column prop="ruleVarName"  label="规则变量名"></el-table-column>
                    <el-table-column prop="ruleVarDesc"  label="规则变量描述"></el-table-column>
                    <el-table-column prop="version"  label="引用决策变量">
                        <template slot-scope="props">
                            <el-select v-model="props.row.decsVarName" filterable size="mini" :disabled="disabled">
                                <el-option v-for="decsEvVar in RuleRelVarList"
                                           :key="decsEvVar.getPrefixVarName()"
                                           :label="`${decsEvVar.varDesc}[${decsEvVar.getPrefixVarName()}]`"
                                           :value="decsEvVar.getPrefixVarName()">
                                    <span :title="decsEvVar.getPrefixVarName()" class="option-left">{{decsEvVar.getPrefixVarName()}}</span>
                                    <span :title="decsEvVar.getSimpleDesc()" class="option-right">{{decsEvVar.getSimpleDesc()}}</span>
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
        </el-card>
        </el-scrollbar>
        <!--规则列表-->
        <el-dialog :visible.sync="extRuleTable.dialog"
                   :modal="false"
                   :close-on-click-modal="false"
                   :title="extRuleTable.title">
            <ext-rule-table
                    ref="extRuleTable"
                    :p-sel-ext-rule-list="ruleListRelByDecs"
                    :p-decision-tree="decisionTree"
                    @extRuleSelClick="extRuleSelAfter"></ext-rule-table>
        </el-dialog>
    </div>
</template>
<script>
    import resizeForDrawer from "../../mixins/resizeForDrawer"
    import {DecsRuleRel, EvMapping} from "../../../entity/rel";
    import {isEmpty, isNotEmpty} from "../../../utils";
    import ExtRuleTable from "./ExtRuleTable";
    // import ExtRuleResultTable from "./children/ExtRuleResultTable";
    import {getRuleListByDecsId, getRuleListVersionList, updateDecs} from "../../../api/Decs";
    import {getRuleBaseTotal} from "../../../api/Rule";
    import {evVarParse} from "../../../api/Utils";
    import {RuleVersion} from "../../../entity/rule";
    import {EVar,ROVar} from "../../../entity/vars";
    import {getMatchingWeight} from "../../../views/common";
    import {inteTypeEnums, tabType, varTypeEnums, compEnums} from "../../../entity/enumns";
    import {analysisJsonParse} from "../../../utils/JsonValidate";
    import {
        G6Model
    } from "../../../entity/g6Model";
    import NodeInf from "../../common/node-inf";


    export default {
        name: "ExtRule",
        mixins:[resizeForDrawer],
        components: {NodeInf,ExtRuleTable},
        props: {
            decisionTree: Object,
            node: {default: () => {}, type: Object},
            pRule: {default: ()=>{}, type: Object},
            pDecs: {default: ()=>{}, type: Object},
            // 上游传入的变量
            extRuleInputVarList: {default: ()=>[], type: Array},
            disabled: {default: false, type: Boolean},
            // 控制是否可以选择变量类型（String，Integer，Float）
        },
        data() {
            return {
                extRuleTable: {dialog: false, title: '规则选择'},
                //已选择的规则列表
                //selExtRuleList: [],
                //节点中的规则
                //extRuleRelList: [],
                // 当前产品下的，所有的基础规则
                ruleBaseTotal: [],
                activeNames: ['selRule', 'selVar'],
                // 与当前节点关联的所有规则（基础表和版本表）
                ruleListRelByDecs: [],
                // 节点关联规则的所有版本信息
                ruleVersionListRelByDecs: [],
                // 决策中的事件变量
                eVarList: [],
                // 对当前决策和规则的事件变量映射
                evMappingList: [],

                // 规则能够映射的变量（pTVarList：父节点临时变量, pUResultVarList：父节点输出，pVarPlatformVarList：变量平台变量, unitRuleInputVarList：父组件传入的变量, objVarList对象解析后的变量）
                ruleRelVar: {
                    totalVarList: [],
                },

            }
        },
        computed: {
            // 根据规则id获取该规则目前上线的版本
            ruleVersionList() {
                return function (ruleId) {
                    return this.ruleVersionListRelByDecs.filter(rule => rule.ruleId === ruleId);
                }
            },

            /**
             *  规则能够映射的变量
             *
             */
            RuleRelVarList() {
                let result = [];
                result.push(...this.extRuleInputVarList);
                result.push(...this.ruleRelVar.totalVarList);
                return result.filter(item=>!["object"].includes(item.varType));
            },

        },
        watch: {
            //监控变量映射
            evMappingList: {
                handler(newValue) {
                    let that = this;
                    that.evMappingList = newValue;
                    let evMapping = {};
                    that.evMappingList.forEach(item => evMapping[`${item.getPrefixVarName()}`] = item.decsVarName);
                    //that.pDecs.evMapping = JSON.stringify(evMapping);
                    that.node.nData.evMappingList = JSON.stringify(evMapping);
                },
                deep: true
            },

            // 监控决策与规则的关联，生成规则入参和决策事件变量的映射表
            ruleListRelByDecs: {
                handler(newValue) {
                    let that = this;
                    // 同步引入表和节点数据
                    function setExtRuleReElList(newValue) {
                        that.node.nData.extRuleRelList = newValue.map(rule => {
                            let decsRuleRel = new DecsRuleRel(rule);
                            let nodes = JSON.parse(rule.ruleJson).nodes;
                            if (!that.isEmpty(nodes)) {
                                nodes.forEach(node => {
                                if (compEnums.RR.code === node.nData.compType) {
                                    decsRuleRel.ruleResultList = node.nData.ruleResultList ? node.nData.ruleResultList : [];
                                }
                            });
                            }
                            return decsRuleRel;
                        });
                    }

                    // 根据路径的最后个名字自动映射
                    function autoMappingByName(ruleVarName, eVarList) {
                        let result = '';
                        let weightList = eVarList.map(evVar => {
                            let pathList = evVar.getPrefixVarName().split("_");
                            return getMatchingWeight(pathList[pathList.length - 1], ruleVarName);
                        });
                        let maxWight = Math.max(...weightList).toFixed(2);
                        if (parseFloat(maxWight) < 0.5) {
                            return result;
                        }
                        result = eVarList[weightList.indexOf(maxWight)].getPrefixVarName();
                        return result;
                    }

                    // 同步引入表和节点数据
                    setExtRuleReElList(newValue);
                    //1 根据版本和规则id生成唯一id
                    let evMappingIdList = that.evMappingList.map(evMapping => [evMapping.ruleId, evMapping.ruleVersion].join("_"));
                    let tmpEvMappingList = [];
                    newValue.forEach(rule => {
                        // 2. 判断新建的规则是否在映射表中是否存在
                        // 2.1 如果不存在，则说明是新增，需向 evMappingList 添加新的映射
                        let ruleVersionId = [rule.ruleId, rule.ruleVersion].join("_");
                        if (evMappingIdList.indexOf(ruleVersionId) === -1) {
                            // 2.1.1 获取规则的事件变量
                            let result = {};
                            analysisJsonParse(JSON.parse(rule.analysisJson), result);
                            for (let key in result){
                                if (!result.hasOwnProperty(key)) continue;
                                let ruleVarName = key;
                                let ruleVarDesc = result[key].split("-")[0];
                                tmpEvMappingList.push(new EvMapping({
                                    ruleId: rule.ruleId,
                                    ruleVersion: rule.ruleVersion,
                                    ruleVarName: ruleVarName,
                                    ruleVarDesc: ruleVarDesc,
                                    decsVarName: autoMappingByName(ruleVarName, that.eVarList),
                                }))
                            }

                        } else {
                            // 2.2 如果存在，则说明需继续引用 evMappingList 的映射
                            let filter = that.evMappingList.filter(evMapping => [evMapping.ruleId, evMapping.ruleVersion].join("_") === ruleVersionId);
                            tmpEvMappingList.push(...filter)
                        }

                    });
                    that.evMappingList = tmpEvMappingList;

                    let evMapping = {};
                    that.evMappingList.forEach(item => evMapping[`${item.getPrefixVarName()}`] = item.decsVarName);
                    that.node.nData.evMappingList = JSON.stringify(evMapping);

                    // 获取决策关联规则的所有版本
                    let ruleIdList = that.ruleListRelByDecs.map(rule => rule.ruleId);
                    getRuleListVersionList({prodId: this.gConfig.prodId.value, ruleIdList: ruleIdList}).then(res2 => {
                        that.ruleVersionListRelByDecs = res2.data.data;
                    });
                },
                deep: true
            },
        },
        mounted() {
        },
        methods: {
            // 初始化外部规则
            handleCommand(command){
                switch (command) {
                    case 'extRuleSelBefore':
                        this.extRuleSelBefore();
                        break;
                }
            },
            init() {
                let that = this;

                let totalVarList = G6Model.getTotalVarsOfParents(that.node, this.decisionTree);

                // 设置判断条件能够引用的变量
                that.ruleRelVar.totalVarList = totalVarList;

                // 获取所有的规则
                let param1 = {prodId: this.gConfig.prodId.value};

                // 获取与当前决策关联的规则信息
                let param2 = {decsId: that.pDecs.decsId, prodId: this.gConfig.prodId.value};
                // 获取事件变量
                let param3 = {analysisJson: that.pDecs.analysisJson};
                // 初始化事件变量（String，Double，Date，Integer，object，array类型）
                function setEVarList(res){
                    let eVarList = res.data.data
                        .map(item => new EVar({varName: item.path, varDesc: item.desc, varType: item.type, varValue: item.value}));
                    that.eVarList = eVarList;
                }

                if (!that.isEmpty(that.node.nData.extRuleRelList) ) {
                    let ruleIdList = that.node.nData.extRuleRelList.map(rule => rule.ruleId);
                    getRuleListVersionList({prodId: this.gConfig.prodId.value, ruleIdList: ruleIdList}).then(res2 => {
                        that.ruleVersionListRelByDecs = res2.data.data;
                    });
                }



                Promise.all([getRuleBaseTotal(param1), /*getRuleListVersionList(param2),*/ evVarParse(param3)]).then(res => {
                    that.ruleBaseTotal = res[0].data.data.map(rule => new RuleVersion(rule));
                    // that.ruleListRelByDecs = res[1].data.data.map(rule => new RuleVersion(rule));
                    setEVarList(res[1]);

                    let ruleTotal = [];
                    ruleTotal.push(...that.ruleBaseTotal);
                    ruleTotal.push(...that.ruleVersionListRelByDecs);


                    that.isEmpty(that.node.nData.extRuleRelList) ? that.ruleListRelByDecs = [] : that.ruleListRelByDecs = ruleTotal.filter(rule => {
                        if (that.node.nData.extRuleRelList.filter(rule1 => (rule1.ruleId === rule.ruleId && rule1.ruleVersion === rule.ruleVersion)).length > 0){
                            return true;
                        } else {
                            return false;
                        }
                    });


                    //如果引入的规则在外面已经删除了，则节点中也去掉。
                    that.ruleListRelByDecs = that.ruleListRelByDecs.filter(rule => {
                        if (that.ruleBaseTotal.filter(rule1 => rule1.ruleId === rule.ruleId).length === 0) {
                            return false;
                        } else {
                            return true;
                        }
                    });

                    // 决策规则变量映射
                    //if (isNotEmpty(that.pDecs.evMapping)) {
                    if (isNotEmpty(that.node.nData.evMappingList)) {
                        //let evMapping = JSON.parse(that.pDecs.evMapping);
                        let evMapping = JSON.parse(that.node.nData.evMappingList);
                        let tmpEvMappingList = [];
                        Object.keys(evMapping).forEach(key => {
                            // lu88_rule_znpos1_example1
                            let ruleId = "";
                            // 获取规则id
                            let rule = that.ruleListRelByDecs.filter(rule => {
                                if (key.startsWith(varTypeEnums.riv.code + "_" + rule.ruleId)) {
                                    ruleId = rule.ruleId;
                                    return true;
                                }
                                return false
                            })[0];
                            if (isEmpty(rule)) return;
                            // 事件变量映射
                            let result = {};
                            analysisJsonParse(JSON.parse(rule.analysisJson), result);
                            for (let resultKey in result) {
                                if (!result.hasOwnProperty(resultKey)) continue;
                                let ruleVarName = resultKey;
                                let ruleVarDesc = result[resultKey].split("-")[0];
                                if (key.endsWith("_" + ruleVarName)) {
                                    tmpEvMappingList.push(
                                        new EvMapping({
                                            ruleId: ruleId,
                                            ruleVersion: rule.ruleVersion,
                                            ruleVarName: ruleVarName,
                                            ruleVarDesc: ruleVarDesc,
                                            decsVarName: evMapping[key],
                                        }));
                                }
                            }
                        });
                        that.evMappingList = tmpEvMappingList;
                        that.evMappingList.forEach(item => evMapping[`${item.getPrefixVarName()}`] = item.decsVarName);
                        that.node.nData.evMappingList = JSON.stringify(evMapping);
                    }
                });
            },

            // 当没有版本时显示没有版本
            versionFormatter(row, column) {
                if (row.ruleVersion === '' || row.ruleVersion === undefined || row.ruleVersion === null) {
                    return "线下";
                } else {
                    return row.ruleVersion;
                }
            },

            // 删除当前引用
            ruleRelDeleteClick(row) {
                let that = this;
                that.ruleListRelByDecs = that.ruleListRelByDecs.filter(rule => rule.ruleId !== row.ruleId);
            },

            extRuleSelBefore() {
                let that = this;
                that.extRuleTable.dialog = true;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.extRuleTable)) {
                        that.$refs.extRuleTable.init();
                    }
                });
            },

            extRuleSelAfter(extRuleBase) {
                let isHas = this.ruleListRelByDecs.filter(item=>item.ruleId === extRuleBase.ruleId).length > 0;
                if (isHas){
                    this.$message({type: 'warning', message: `${extRuleBase.ruleId}字段已存在，请勿重复添加`});
                } else {
                    this.ruleListRelByDecs.push(extRuleBase);
                }
            },
        },
    }
</script>
<style scoped>
    @import "../../../views/common/index.css";

    #extraRule {
        width: 100%;
        height: 100%;
        overflow: auto;
        min-height: 100%;
    }

    .tools {
        margin-left: 15px;
    }
</style>
