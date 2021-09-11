<template>
    <!--组件节点（实际上就是设置发送接口了~）-->
    <div id="cmptEdit" ref="cmptEdit">
        <node-inf :node="node" :disabled="disabled">
            <template slot="right">
<!--                <el-form-item label="操作">-->
<!--                    <el-button size="mini" :disabled="disabled" type="success" @click="cmptTableShow">选择</el-button>-->
<!--                    <el-button size="mini" :disabled="disabled" type="danger" @click="deleteCmpt">删除</el-button>-->
<!--                </el-form-item>-->
                <el-divider direction="vertical"></el-divider>
                <el-dropdown trigger="click"  @command="handleCommand">
                    <el-button type="primary" size="mini">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  command="cmptTableShow">选择组件</el-dropdown-item>
                        <el-dropdown-item  command="deleteCmpt">删除组件</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </node-inf>
        <div v-if="isEmpty(cmpt.inteType)">
            <el-form style="margin:5px;">
                <el-form-item class="no-data">
                    <svg-icon icon-class="cmpt"></svg-icon>
                    <br/>
                    <span>暂无组件信息，点击【操作】-【选择组件】吧~</span>
                </el-form-item>
            </el-form>
        </div>

        <el-card>
            <el-collapse v-model="activeNames" >
                <el-collapse-item name="cmptInfo" v-if="isNotEmpty(cmpt.inteType)">
                    <template slot="title">
                        <div title="组件详情">
                            <span>组件详情</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                    </template>
                    <cmpt-show ref="cmptShow" p-type="cmptEdit" :p-cmpt="cmpt" :disable-of-version="false"></cmpt-show>
                    <el-form size="mini" label-width="100px" :inline="true" style="padding-top: 18px">
                        <el-form-item v-if="isNotEmpty(cmpt)&& cmpt.inteType === 'H'">
                            <div slot="label">
                                <span style="color: red;margin-right: 5px">*</span>
                                <span class="">异步或同步</span>
                            </div>
                            <el-select placeholder="同步执行或者异步执行" v-model="synchronOrAsynchron" :disabled="disabled" style="width:193px">
                                <el-option label="异步执行" value="A" key="A"></el-option>
                                <el-option label="同步执行" value="S" key="S"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>

                </el-collapse-item>

                <!--URL变量映射-->
                <el-collapse-item name="pathVariable" v-if="cmpt.inteType === 'H'">
                    <template slot="title">
                        <div title="链接中URL的映射">
                            <span>URL变量映射</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                        <div style="margin-left: 10px">
                            <span style="margin-left: 20px;color: red">{{pathErrorMsg}}</span>
                        </div>
                    </template>
                    <field-table :p-field-list="pathFieldList" :p-ref-field-list="cmptRelVarList" :disabled="disabled"></field-table>
                </el-collapse-item>

                <!--请求参数映射-->
                <el-collapse-item name="requestParam" v-if="cmpt.inteType === 'H'">
                    <template slot="title">
                        <div title="链接中请求参数的映射">
                            <span>请求参数映射</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                        <div class="tools">
                            <span style="margin-left: 20px;color: red">{{paramErrorMsg}}</span>
                        </div>
                    </template>
                    <field-table :p-field-list="paramsFieldList" :p-ref-field-list="cmptRelVarList"
                                 :disabled="disabled"></field-table>
                </el-collapse-item>

                <!--请求头映射-->
                <el-collapse-item name="requestHeader" v-if="cmpt.inteType === 'H'">
                    <template slot="title">
                        <div title="HTTP请求头映射">
                            <span>请求头映射</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                        <div class="tools">
                            <span style="margin-left: 20px;color: red">{{headerErrorMsg}}</span>
                        </div>
                    </template>
                    <field-table :p-field-list="headerFieldList" :p-ref-field-list="cmptRelVarList"
                                 :disabled="disabled"/>
                </el-collapse-item>

                <!--请求体映射-->
                <el-collapse-item v-if="isNotEmpty(cmpt.cmptId)" name="requestBody">
                    <template slot="title">
                        <div title="请求中请求体的映射">
                            <span>请求体映射</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                        <div class="tools">
                            <span style="margin-left: 20px;color: red">{{bodyErrorMsg}}</span>
                        </div>
                    </template>
                    <field-table :p-field-list="mapFieldList" :p-ref-field-list="cmptRelVarList" :disabled="disabled"></field-table>
                </el-collapse-item>

                <!--返回结果映射-->
                <el-collapse-item name="cmptOut" v-if="cmpt.inteType === 'H' || cmpt.inteType === 'M'"> <!--074389-->
                    <template slot="title">
                        <div title="将组件的返回结果整合到Fact对象中，并传给子节点">
                            <span>返回结果映射</span>
                            <i class="header-icon el-icon-info"></i>
                        </div>
                    </template>

                <pl-table
                        ref="multipleTable"
                        :data="covFieldList"
                        size="mini"
                        :border="true"
                        :highlight-current-row="true"
                        :stripe="true"
                        :use-virtual="true"
                        :row-height="40"
                        :excess-rows="3"
                        :height-change="false"
                        auto-resize>
                    <pl-table-column prop="varName" label="字段名" width="266">
                        <template slot-scope="props">
                            {{props.row.getPrefixVarName()}}
                        </template>
                    </pl-table-column>
                    <pl-table-column prop="varType" label="字段类型"></pl-table-column>
                    <pl-table-column prop="varDesc" label="字段描述"></pl-table-column>
                    <pl-table-column prop="mapField" label="字段路径"></pl-table-column>
                </pl-table>
            </el-collapse-item>
        </el-collapse>
        </el-card>

        <!--组件选择-->
        <el-dialog :visible.sync="dialog.isShow"
                   :modal="false"
                   :close-on-click-modal="false"
                   class="node-new-dialog">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">{{dialog.title}}</div>
                </div>
            </div>
            <cmpt-table
                    ref="cmptTable"
                    :p-decision-tree="decisionTree"
                    @cmptSelClick="cmptSelClick"></cmpt-table>
        </el-dialog>


    </div>
</template>

<script>
    import {Cmpt} from "../../entity/cmpt";
    import CmptTable from "./CmptTable";
    import {MapFields} from "./index";
    import {isEmpty, isNotEmpty} from "../../utils";
    import CodemirrorShow from "../codemirror/CodemirrorShow";
    import CmptShow from "./CmptShow";
    import {inteTypeEnums, varFromEnums} from "../../entity/enumns";
    import {pathParse} from "../../api/Utils";
    import FieldTable from "./children/FieldTable";
    import {COVar} from "../../entity/vars";
    import {getMatchingWeight, humpConversion} from "../../views/common";
    import resizeForDrawer from "../mixins/resizeForDrawer"
    import {CmptNode} from "../../entity/model";
    import {
        G6Model
    } from "../../entity/g6Model";
    import NodeInf from "../common/node-inf";

    export default {
        name: "CmptEdit",
        // 混入对象，合并生命周期的方法
        mixins: [resizeForDrawer],
        components: {NodeInf, FieldTable, CmptShow, CodemirrorShow, CmptTable},
        props: {
            decisionTree: Object,
            node: Object,
            disabled: {default: false, type: Boolean},
            pDecs: {default: () => {}, type: Object},
            // 组件编辑的输入（可以使用的变量：1 决策事件变量 2 规则的输出变量 3 临时变量）
            cmptEditInputVarList: {default: () => [], type: Array},
        },
        data() {
            return {
                dialog: {isShow: false, title: '组件选择'},
                cmpt: new Cmpt(),
                // 组件的requestBody字段映射
                mapFieldList: [],
                // 组件的path字段映射
                pathFieldList: [],
                //组件的header字段映射
                headerFieldList: [],
                // 组件的params字段映射
                paramsFieldList: [],
                // 组件输出结果映射
                covFieldList: [],

                // 字段映射的引用
                cmptRelVar: {
                    totalVarList: [],
                    cmptEditInputVarList: [],
                },

                // 父节点变量
                pTVarList: [],

                synchronOrAsynchron: "S",
                errorMsg: '',
                isNotEmpty: isNotEmpty,
                isEmpty: isEmpty,
                inteTypeEnums: inteTypeEnums,
                varFromEnums: varFromEnums,

                pathErrorMsg: "",
                paramErrorMsg: "",
                headerErrorMsg: "",
                bodyErrorMsg: "",
                cmptOutErrorMsg: "",
                activeNames: ["pathVariable", "requestParam", "requestHeader", "requestBody", "cmptOut","cmptInfo"]
            }
        },

        mounted() {

        },

        computed:{
          cmptRelVarList(){
              let result = [];
              result.push(...this.cmptRelVar.totalVarList);
              result.push(...this.cmptRelVar.cmptEditInputVarList);
              return result
          }
        },

        watch: {
            covFieldList: {
                handler(value) {
                    let that = this;
                    that.node.nData.covFieldList = value;
                },
                deep: true
            },

            mapFieldList: {
                handler(value) {
                    let that = this;
                    that.validateMapFieldList(value);
                    that.node.nData.mapFieldList = value;
                },
                deep: true
            },

            pathFieldList: {
                handler(value) {
                    let that = this;
                    that.validateMapFieldList(value);
                    that.node.nData.pathFieldList = value;
                },
                deep: true
            },

            headerFieldList: {
                handler(value) {
                    let that = this;
                    that.validateMapFieldList(value);
                    that.node.nData.headerFieldList = value;
                },
                deep: true
            },

            paramsFieldList: {
                handler(value) {
                    let that = this;
                    that.validateMapFieldList(value);
                    that.node.nData.paramsFieldList = value;
                },
                deep: true
            },

            // 组件
            cmpt: {
                handler(value) {
                    let that = this;
                    that.node.nData.cmpt = value;
                },
                deep: true
            },
            synchronOrAsynchron: {
                handler(value) {
                    this.node.nData.synchronOrAsynchron = value;
                },
                deep: true
            },

        },
        methods: {
            handleCommand(command){
                switch (command) {
                    case 'cmptTableShow':
                        this.cmptTableShow();
                        break;
                    case 'deleteCmpt':
                        this.deleteCmpt();
                        break;
                }
            },

            // 验证是否填全
            validateMapFieldList(value) {
                let isError = value.filter(mapField => {
                    if (mapField.fieldFrom === this.varFromEnums.edit.code) {
                        return isEmpty(mapField.fieldResult)
                    } else {
                        return isEmpty(mapField.mapField);
                    }
                }).length > 0;
                if (isError) {
                    this.errorMsg = "映射字段未填写完整";
                } else {
                    this.errorMsg = '';
                }
            },

            cmptTableShow() {
                let that = this;
                that.dialog.isShow = true;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.cmptTable)) {
                        that.$refs.cmptTable.refreshPage();
                    }
                });
            },

            // 根据路径的最后个名字自动映射
            autoMappingByName(varName, varList, splitChar="_") {
                if (isEmpty(varName)) return "";
                let result = '';
                let varNameList  = varName.split(splitChar);
                let weightList = varList.map(evVar => {
                    let pathList = evVar.getPrefixVarName().split("_");
                    return getMatchingWeight(pathList[pathList.length - 1], humpConversion(varNameList[varNameList.length -1]));
                });
                let maxWight = Math.max(...weightList).toFixed(2);
                if (parseFloat(maxWight) < 0.5) {
                    return result;
                }
                result = varList[weightList.indexOf(maxWight)].getPrefixVarName();
                return result;
            },

            cmptSelClick(cmpt) {
                let that = this;
                that.cmpt = new Cmpt(cmpt);
                let ajJson = JSON.parse(cmpt.analysisJson);

                function initFieldList() {
                    that.pathFieldList = [];
                    that.headerFieldList = [];
                    that.paramsFieldList = [];
                    that.mapFieldList = [];
                    that.covFieldList = [];
                }

                function modelParse() {
                    if (isNotEmpty(ajJson)) {
                        pathParse({analysisJson: ajJson}).then(res => {
                            that.mapFieldList = res.data.data.map(item => {
                                return new MapFields({
                                    fieldName: item['path'],
                                    fieldDesc: item['description'].split("-")[0],
                                    fieldType: item['description'].split("-")[1],
                                    fieldFrom: varFromEnums.rel.code,
                                    mapField: that.autoMappingByName(item['path'], that.cmptRelVarList, "."),
                                })
                            });
                            that.dialog.isShow = false;
                        });
                    }

                    that.setCovFieldList();
                }

                function httpParse() {
                    if (isNotEmpty(ajJson['pathVariable'])) {
                        that.pathFieldList = ajJson['pathVariable'].map(item => {
                            return new MapFields({
                                fieldName: item['cmptVarName'],
                                fieldDesc: item['cmptVarDesc'],
                                fieldType: "String",
                                fieldFrom: varFromEnums.rel.code,
                                mapField: that.autoMappingByName(item['cmptVarName'], that.cmptRelVarList),
                            })
                        });
                    }

                    if (isNotEmpty(ajJson['headerConfig'])) {
                        for(let headerKey in ajJson['headerConfig']) {
                            that.headerFieldList.push(new MapFields({
                                fieldName: headerKey,
                                fieldDesc: ajJson['headerConfig'][headerKey],
                                fieldType: "String",
                                fieldFrom: varFromEnums.rel.code,
                                mapField: that.autoMappingByName(headerKey, that.cmptRelVarList),
                            }));
                        }
                    }

                    if (isNotEmpty(ajJson['requestParam'])) {
                        that.paramsFieldList = ajJson['requestParam'].map(item => {
                            return new MapFields({
                                fieldName: item['cmptVarName'],
                                fieldDesc: item['cmptVarDesc'],
                                fieldType: "String",
                                fieldFrom: varFromEnums.rel.code,
                                mapField: that.autoMappingByName(item['cmptVarName'], that.cmptRelVarList),
                            })
                        });
                    }

                    if (isNotEmpty(ajJson['requestBody'])) {
                        pathParse({analysisJson: ajJson['requestBody']}).then(res => {
                            that.mapFieldList = res.data.data.map(item => {
                                return new MapFields({
                                    fieldName: item['path'],
                                    fieldDesc: item['description'].split("-")[0],
                                    fieldType: item['description'].split("-")[1],
                                    fieldFrom: varFromEnums.rel.code,
                                    mapField: that.autoMappingByName(item['path'], that.cmptRelVarList, "."),
                                })
                            });
                            that.dialog.isShow = false;
                        });
                    }

                    that.setCovFieldList();
                }

                function kafkaParse() {
                    if (isNotEmpty(ajJson)) {
                        pathParse({analysisJson: ajJson}).then(res => {
                            that.mapFieldList = res.data.data.map(item => {
                                return new MapFields({
                                    fieldName: item['path'],
                                    fieldDesc: item['description'].split("-")[0],
                                    fieldType: item['description'].split("-")[1],
                                    fieldFrom: varFromEnums.rel.code,
                                    mapField: that.autoMappingByName(item['path'], that.cmptRelVarList, "."),
                                })
                            });
                            that.dialog.isShow = false;
                        });
                    }
                }


                initFieldList();
                switch (that.cmpt.inteType) {
                    case inteTypeEnums.H.code:
                        httpParse();
                        break;
                    case inteTypeEnums.K.code:
                        kafkaParse();
                        break;
                    case inteTypeEnums.M.code:
                        modelParse();
                        break
                }

                that.$nextTick(() => {
                    that.$refs.cmptShow.init();
                })
            },

            setCovFieldList() {
                let that = this;
                if (isEmpty(that.cmpt.responseAnalysis)) return;
                let responseAjJson = JSON.parse(that.cmpt.responseAnalysis);

                pathParse({analysisJson: responseAjJson}).then(res => {
                    that.covFieldList = res.data.data.map(item => {
                        return new COVar({
                            mapField: item['path'],
                            varName: item['path'],
                            varDesc: item['description'].split("-")[0],
                            varType: item['description'].split("-")[1],
                            decsId: that.pDecs.decsId,
                            nodeId: that.node.nData.uniqueName,
                        })
                    });
                    that.dialog.isShow = false;
                });

            },

            // 删除选择的组件
            deleteCmpt() {
                this.cmpt = {};
                this.mapFieldList = [];
            },

            init() {
                let that = this;

                that.cmptRelVar.totalVarList = G6Model.getTotalVarsOfParents(this.node, this.decisionTree);
                that.cmptRelVar.cmptEditInputVarList = that.cmptEditInputVarList;
                that.isEmpty(that.node.nData.synchronOrAsynchron) ? that.synchronOrAsynchron = "S" : that.synchronOrAsynchron = that.node.nData.synchronOrAsynchron;



                // 2 节点如果有值组件和字段映射，则通过节点的值赋值给组件
                that.isEmpty(that.node.nData.cmpt) ? that.cmpt = new Cmpt() : that.cmpt = that.node.nData.cmpt;
                that.isEmpty(that.node.nData.mapFieldList) ? that.mapFieldList = [] : that.mapFieldList = that.node.nData.mapFieldList.map(item=>new MapFields(item));
                that.isEmpty(that.node.nData.pathFieldList) ? that.pathFieldList = [] : that.pathFieldList = that.node.nData.pathFieldList.map(item=>new MapFields(item));
                that.isEmpty(that.node.nData.headerFieldList) ? that.headerFieldList = [] : that.headerFieldList = that.node.nData.headerFieldList.map(item=>new MapFields(item));
                that.isEmpty(that.node.nData.paramsFieldList) ? that.paramsFieldList = [] : that.paramsFieldList = that.node.nData.paramsFieldList.map(item=>new MapFields(item));
                that.isEmpty(that.node.nData.covFieldList) ? that.covFieldList = [] : that.covFieldList = that.node.nData.covFieldList.map(item => new COVar(item));

                // 初始化页面
                that.setCovFieldList();
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.cmptShow)){
                        that.$refs.cmptShow.init();
                    }
                })
            },

        }
    }
</script>

<style scoped>
    @import "../../views/common/index.css";



    .tools {
        margin-left: 15px;
    }
</style>
