<template>
    <div id="evEdit2" ref="evEdit2" style="min-height: 100%">
        <node-inf :node="node">
            <template slot="right">
                <el-divider direction="vertical"></el-divider>
                <el-dropdown trigger="click"  @command="handleCommand">
                    <el-button type="primary" size="mini">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  command="datasourceShow">选择数据源</el-dropdown-item>
                        <el-dropdown-item  command="deleteDatasource">删除数据源</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </node-inf>

        <el-scrollbar>
            <el-card>
                <el-collapse v-model="activeNames" style="padding-bottom: 20px">
                    <el-collapse-item name="baseInfo">
                        <template slot="title">
                            <div title="数据源基本信息">
                                <span>数据源基本信息</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                        </template>
                        <el-form size="mini" label-width="100px" :inline="true" style="padding-top: 18px">
                            <el-form-item v-if="isNotEmpty(datasource.datasourceId)" label="数据源ID" >
                                <el-input style="width: 193px" :readonly="true" v-model="datasource.datasourceId"></el-input>
                            </el-form-item>

                            <el-form-item v-if="isNotEmpty(datasource.datasourceName)" label="数据源名">
                                <el-input style="width: 193px" :readonly="true" v-model="datasource.datasourceName"></el-input>
                            </el-form-item>

                            <el-form-item v-if="isNotEmpty(datasource.dataLand)
                            && datasource.dataLand.land_mode === datasourceTypeEnums.jdbc.code">
                                <div slot="label">
                                    <span style="color: red;margin-right: 5px">*</span>
                                    <span class="">写入逻辑</span>
                                </div>
                                <el-select placeholder="存量写入或者增量写入" v-model="addOrUpdate" :disabled="disabled" style="width:193px">
                                    <el-option label="存量写入" value="U" key="U"></el-option>
                                    <el-option label="增量写入" value="I" key="I"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item v-if="isNotEmpty(datasource.dataLand)
                            && datasource.dataLand.land_mode === datasourceTypeEnums.jdbc.code">
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

                        <el-form size="mini" label-width="100px" :inline="true" v-if="isNotEmpty(datasource.dataLand) && isNotEmpty(datasource.dataLand.land_mode)">
                            <template v-if="datasource.dataLand.land_mode === datasourceTypeEnums.jdbc.code">
                                <el-divider content-position="left" style="margin-bottom: 20px">JDBC配置</el-divider>
                                <el-form-item label="url">
                                    <el-input style="width: 193px" :readonly="true"
                                              v-model="datasource.dataLand.jdbc_url"></el-input>
                                </el-form-item>
        <!--                        <el-form-item label="user">-->
        <!--                            <el-input style="width: 193px" :readonly="true" type="password"-->
        <!--                                      v-model="datasource.dataLand.jdbc_user"></el-input>-->
        <!--                        </el-form-item>-->
        <!--                        <el-form-item label="password">-->
        <!--                            <el-input style="width: 193px" :readonly="true" type="password"-->
        <!--                                      v-model="datasource.dataLand.jdbc_password"></el-input>-->
        <!--                        </el-form-item>-->
                                <el-form-item label="driver-class">
                                    <!--<el-input style="width: 193px" :readonly="true"
                                              v-model="datasource.dataLand.jdbc_driver"></el-input>-->
                                    <el-input style="width: 193px" :readonly="true"
                                              v-if="datasource.dataLand.jdbc_driver=== JdbcDriver.mysql.code" value="com.mysql.cj.jdbc.Driver"></el-input>
                                    <el-input style="width: 193px" :readonly="true"
                                              v-if="datasource.dataLand.jdbc_driver=== JdbcDriver.gaussdb.code" value="com.huawei.gauss.jdbc.ZenithDriver"></el-input>
                                </el-form-item>
                                <el-form-item label="table">
                                    <el-input style="width: 193px" :readonly="true"
                                              v-model="datasource.dataLand.jdbc_table"></el-input>
                                </el-form-item>
                            </template>


                        </el-form>
                    </el-collapse-item>

<!--                <el-collapse v-model="activeNames" style="padding-bottom: 20px">-->
                    <!--事件变量字段映射-->
                    <el-collapse-item name="mapField">
                        <template slot="title">
                            <div title="入库组件字段映射">
                                <span>入库组件字段映射</span>
                                <i class="header-icon el-icon-info"></i>
                            </div>
                            <div style="margin-left: 10px">
                                <span style="margin-left: 20px;color: red">{{errorMsg}}</span>
                            </div>
                        </template>
                        <ev-field-table :p-field-list="evMapFieldList" :p-ref-field-list="evSRelVarList"
                                        :disabled="disabled"></ev-field-table>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>

    <el-dialog :visible.sync="dialog.isShow"
               :modal="false"
               :close-on-click-modal="false"
               class="node-new-dialog">
        <div slot="title">
            <div class="clearfix" style="width: 97%;">
                <div class="dialog-title">{{dialog.title}}</div>
            </div>
        </div>

        <datasource-table ref="datasourceTable" :p-decision-tree="decisionTree" :p-node="node" @evCmptSelClick="evCmptSelClick"></datasource-table>
    </el-dialog>

    </div>
</template>

<script>
    import NodeInf from "../common/node-inf";
    import DatasourceTable from '../datasource/DatasourceTable'
    import {Datasource} from "../../entity/datasource";
    import {isNotEmpty,isEmpty} from "../../utils";
    import {G6Model} from "../../entity/g6Model";
    import {inteTypeEnums, varFromEnums} from "../../entity/enumns";
    import {DatasourceTypeEnums,MapFields,autoMappingByName,JdbcDriver} from './index'
    import {getEvColumn} from '../../api/Datasource'
    import EvFieldTable from "./children/EvFieldTable";
    import {humpConversion} from "../../views/common";
    import resizeForDrawer from "../mixins/resizeForDrawer";

    export default {
        name: "EvEdit2",
        components:{NodeInf,DatasourceTable,EvFieldTable},
        mixins: [resizeForDrawer],
        data(){
            return{
                datasource: new Datasource(),
                dialog:{isShow:false,title:'数据源选择'},
                evSRelVar: {
                    totalVarList:[],
                    evSEditInputVarList: [],
                },
                datasourceTypeEnums:DatasourceTypeEnums,

                // 父节点变量
                pTVarList: [],
                errorMsg: '',
                addOrUpdate: "U",
                synchronOrAsynchron: "S",
                isNotEmpty: isNotEmpty,
                isEmpty: isEmpty,
                evMapFieldList: [],
                inteTypeEnums: inteTypeEnums,
                varFromEnums: varFromEnums,
                refFieldList:[],
                activeNames: ["baseInfo","mapField"],
                JdbcDriver:JdbcDriver,
               // evSRelVarList:[]//why not shown here===>show in computed part

            }
        },
        props:{
            decisionTree: Object,
            node: {
                default: () => {}, type: Object
            },
            disabled: {default: false, type: Boolean},
            evSEditInputVarList: {default: () => [], type: Array},
        },
        computed:{
            evSRelVarList(){
                let result=[];
                result.push(...this.evSRelVar.totalVarList);
                result.push(...this.evSRelVar.evSEditInputVarList);
                return result;
            }
        },
        watch: {
            evMapFieldList: {
                handler(value) {
                    this.validateMapFieldList(value);
                    this.node.nData.evMapFieldList = value;
                },
                deep: true
            },
            addOrUpdate: {
                handler(value) {
                    this.node.nData.addOrUpdate = value;
                },
                deep: true
            },

            synchronOrAsynchron: {
                handler(value) {
                    this.node.nData.synchronOrAsynchron = value;
                },
                deep: true
            },


            // 组件
            datasource: {
                handler(value) {
                    this.node.nData.datasource = value;
                },
                deep: true
            },
        },
        methods:{
            handleCommand(command){
                switch (command) {
                    case 'deleteDatasource':
                        this.deleteDatasource();
                        break;
                    case 'datasourceShow':
                        this.datasourceShow();
                        break;
                }
            },
            deleteDatasource(){
                this.datasource = {};
                this.evMapFieldList = [];
            },
            //验证组件字段映射是否填写完整
            // 验证是否填全
            validateMapFieldList(value) {
                let isError = value.filter(mapField => {
                    if (mapField.fieldFrom === this.varFromEnums.edit.code) {
                        return isEmpty(mapField.fieldResult);
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
            evCmptSelClick(datasource){
                let that=this;
                that.datasource = new Datasource(datasource);
                let dataland = that.datasource.dataLand;
                if (that.datasource.dataLand.land_mode === DatasourceTypeEnums.jdbc.code){
                    let dataSourceEntity = {
                        driverClassName: dataland.jdbc_driver === JdbcDriver.mysql.code?"com.mysql.cj.jdbc.Driver":"com.huawei.gauss.jdbc.ZenithDriver",
                        jdbcUrl: dataland.jdbc_url,
                        username:dataland.jdbc_user,
                        password:dataland.jdbc_password,
                        schema: dataland.jdbc_table.split(".")[0],
                        tableName:dataland.jdbc_table.split(".")[1]
                    };
                    let datasourceType = "";
                    if(dataland.jdbc_driver === JdbcDriver.mysql.code){
                        datasourceType = "mysql";
                    }else if(dataland.jdbc_driver === JdbcDriver.gaussdb.code){
                        datasourceType = "gaussdb";
                    }else{
                        that.$message({message: "请检查数据源是否配置JDBC配置,或者数据库配置不是MySQL或者GaussDB，", type: 'warning'});
                        this.dialog.isShow = false;
                        return ;
                    }
                    let param = {datasourceType: datasourceType, dataSourceEntity: dataSourceEntity}
                    that.evMapFieldList = [];
                    getEvColumn(param).then(res => {
                        let index = 0;
                        that.evMapFieldList = res.data.data.map(item => {
                            let name = /*that.datasource.datasourceId +"_"+*/item['columnName'];
                            let index_temp = index;
                            index = index + 1;
                            return new MapFields({
                                id: index_temp,
                                fieldName: name,
                                fieldDesc: item['columnComment'],
                                fieldType: item['columnDataType'],
                                mapField: autoMappingByName(humpConversion(name), that.evSRelVarList),
                            })
                        });
                    }).finally(() => {
                        this.dialog.isShow = false;
                    })
                    this.dialog.isShow = false;
                }else{
                    that.$message({message: "数据源落地方式不是jdbc，请重新选择", type: 'warning'});
                }
            },
            datasourceShow() {
                let that = this;
                that.dialog.isShow = true;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.datasourceTable)) {
                        that.$refs.datasourceTable.refreshPage();
                    }
                });
            },
            init(){
                let that = this;
                that.refFieldList=[];
                that.isEmpty(that.node.nData.addOrUpdate) ? that.addOrUpdate = "U" : that.addOrUpdate = that.node.nData.addOrUpdate;
                that.isEmpty(that.node.nData.synchronOrAsynchron) ? that.synchronOrAsynchron = "S" : that.synchronOrAsynchron = that.node.nData.synchronOrAsynchron;

                that.evSRelVar.totalVarList = G6Model.getTotalVarsOfParents(this.node, this.decisionTree);
                that.evSRelVar.evSEditInputVarList = that.evSEditInputVarList;

                // 2 节点如果有值组件和字段映射，则通过节点的值赋值给组件
                 that.isEmpty(that.node.nData.datasource) ? that.datasource = new Datasource() : that.datasource = that.node.nData.datasource;
                 that.isEmpty(that.node.nData.evMapFieldList) ? that.evMapFieldList = [] : that.evMapFieldList = that.node.nData.evMapFieldList.map(item=>new MapFields(item));
            //     that.isEmpty(that.node.nData.pathFieldList) ? that.pathFieldList = [] : that.pathFieldList = that.node.nData.pathFieldList.map(item=>new MapFields(item));
            //     that.isEmpty(that.node.nData.paramsFieldList) ? that.paramsFieldList = [] : that.paramsFieldList = that.node.nData.paramsFieldList.map(item=>new MapFields(item));
            //     that.isEmpty(that.node.nData.covFieldList) ? that.covFieldList = [] : that.covFieldList = that.node.nData.covFieldList.map(item => new COVar(item));
            //
            //     // 初始化页面
            //     that.setCovFieldList();
            //     that.$nextTick(() => {
            //         that.$refs.cmptShow.init();
            //     })
            }
        },
    }
</script>

<style scoped>
    #evEdit2 .el-divider.el-divider--horizontal {
        margin: 0px 0 20px 0;
    }

</style>
