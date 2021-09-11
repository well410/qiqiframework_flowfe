<template>
    <!--组件字段映射-->
    <div>
        <el-button type="primary" size="mini" @click="saveEvVarBefore" style="margin-bottom: 5px" :disabled="disabled">新增事件变量</el-button>
        <pl-table
                ref="multipleTable"
                :data="evEditFieldList"
                :max-height="260"
                size="mini"
                :border="true"
                :highlight-current-row="true"
                :stripe="true"
                :use-virtual="true"
                :row-height="40"
                    :excess-rows="3"
                    :height-change="false"
                    auto-resize>
            <el-table-column type="index" width="50"></el-table-column>
            <pl-table-column label="变量名称" width="210px">
                <template slot-scope="props">
                    <template class="flex-between-center">
                        <el-input size="mini" style="width: 98%" v-model="props.row.fieldName" maxlength="32" :readonly="disabled"
                                  onmouseover="this.title=this.value" show-word-limit/>
                    </template>
                </template>
            </pl-table-column>
            <pl-table-column label="变量类型" width="165px">
                <template slot-scope="props">
                    <template class="flex-between-center">
                        <el-select v-model="props.row.fieldType"
                                   placeholder="变量类型选择"
                                   style="width: 99%"
                                   size="mini"
                                   :disabled="disabled"
                                   clearable>
                            <el-option :label="'['+tqsVarsTypeEnums.String.code+']'+tqsVarsTypeEnums.String.name"
                                       :key="tqsVarsTypeEnums.String.name" :value="tqsVarsTypeEnums.String.name"/>
                            <el-option :label="'['+tqsVarsTypeEnums.Double.code+']'+tqsVarsTypeEnums.Double.name"
                                       :key="tqsVarsTypeEnums.Double.name" :value="tqsVarsTypeEnums.Double.name"/>
                            <el-option :label="'['+tqsVarsTypeEnums.Integer.code+']'+tqsVarsTypeEnums.Integer.name"
                                       :key="tqsVarsTypeEnums.Integer.name" :value="tqsVarsTypeEnums.Integer.name"/>
                            <el-option :label="'['+tqsVarsTypeEnums.Timestamp.code+']'+tqsVarsTypeEnums.Timestamp.name"
                                       :key="tqsVarsTypeEnums.Timestamp.name" :value="tqsVarsTypeEnums.Timestamp.name"/>
                        </el-select>
                    </template>
                </template>
            </pl-table-column>
            <pl-table-column label="变量长度" width="100px">
                <template slot-scope="props">
                    <template class="flex-between-center">
                        <el-input size="mini" style="width: 98%" v-model="props.row.length" maxlength="4"
                                  @input="props.row.length = props.row.length.replace(/[^\d]/g, '')"
                                  onmouseover="this.title=this.value" show-word-limit :readonly="disabled"/>
                    </template>
                </template>
            </pl-table-column>
            <pl-table-column prop="fieldDesc" label="变量描述" width="150px" />
            <pl-table-column prop="mapField" label="字段映射" />
        </pl-table>

        <el-dialog
                title="事件变量选择"
                width="700px"
                height="300px"
                :modal="false"
                :close-on-click-modal="false"
                :visible.sync="evSelectConfig.isShow">
            <tqs-ev-vars-config :formate-map="pRefFieldMap" :selected-list="evSelectConfig.selectedList" ref="evConfig"
                                @evEditVisible="evEditVisible"/>
        </el-dialog>
    </div>
</template>

<script>
    import {tqsVarsTypeEnums, varFromEnums} from "../../../entity/enumns";
    import {TqsDatasource} from "../../../entity/datasource";
    import TqsEvVarsConfig from "./TqsEvVarsConfig";
    import {tqsMapFields} from "../index";
    import {TqsEvVar} from "../../../entity/vars";
    import {isNotEmpty,isEmpty} from "../../../utils";
    import * as ElementUI from "element-ui";

    export default {
        name: "FieldTable",
        components: {TqsEvVarsConfig},
        props: {
            tqsDatasource: {default: () => new TqsDatasource(), type: Object},
            node: Object,
            pRefFieldMap: {default: () => {}, type: Object},
            errorMessage: {default: () => '', type: String},
            disabled: {default: false, type: Boolean},
        },
        data() {
            return {
                varFromEnums: varFromEnums,
                tqsVarsTypeEnums: tqsVarsTypeEnums,
                evSelectConfig: {isShow: false, selectedList: [],},//筛选的key汇总
                evEditFieldList: [],
                evIdSet: new Set(),
                evVarsList: [],
                checkFlg: false,
            }
        },
        computed: {
        },
        watch: {
            evEditFieldList: {
                handler(value) {
                    let that = this;
                    that.node.nData.mapFieldList = value;
                    if (that.isEmpty(that.evEditFieldList)) {
                        that.evVarsList = [];
                        that.tqsDatasource.evVars = JSON.parse(JSON.stringify(that.evVarsList));
                    } else {
                        if (!that.evVarsCheck()) {
                        } else {
                            that.tqsDatasource.evVars = that.evVarsConstruct(value);
                        }
                    }
                },
                deep: true
            }
        },
        methods: {
            //init
            init(){
                let that = this;
                that.isEmpty(that.node.nData.mapFieldList) ? that.evEditFieldList = [] : that.evEditFieldList = that.node.nData.mapFieldList.map(item => new tqsMapFields(item));
                that.evEditFieldList.forEach(item => {
                   that.evIdSet.add(item.oriPathName);
                });
            },
            //clean
            cleanAndReset(){
                let that = this;
                that.evEditFieldList = [];
                that.evIdSet = new Set();
            },
            //新增事件变量
            saveEvVarBefore() {
                let that = this;
                if(isEmpty(that.tqsDatasource.datasourceId)){
                    ElementUI.Message({message: "请先确定数据源id", type: 'error'});
                    return;
                }
                that.evSelectConfig.selectedList=[];
                that.evEditFieldList.forEach(item => {
                    that.evSelectConfig.selectedList.push(item.oriPathName);
                });
                that.evSelectConfig.isShow = true;
                that.$nextTick(() => {
                    if (isNotEmpty(that.$refs.evConfig)) {
                        that.$refs.evConfig.init();
                    }
                });
            },
            //事件变量源编辑返回
            evEditVisible(data) {
                //判断是否含有已有内容
                function contains(arr, obj) {
                    let i = arr.length;
                    while (i--) {
                        if (arr[i] === obj) {
                            return true;
                        }
                    }
                    return false;
                }

                let that = this;
                if (data.isValidate) {
                    that.evSelectConfig.selectedList = data.selectedList;
                    let keyArray = that.evSelectConfig.selectedList.filter(item => item.length > 1);
                    if (keyArray.length >= 1) {
                        //删除变量
                        let deleteItem = [];
                        that.evIdSet.forEach(item => {
                            if (!contains(keyArray, item)) {
                                let mapName = item.substring(1);
                                let index = mapName.indexOf("[");
                                let mapFieldName = mapName.substring(index + 1, mapName.length - 1);
                                deleteItem.push(mapFieldName);
                            }
                        });
                        that.evEditFieldList = that.evEditFieldList.filter(item => !contains(deleteItem, item.mapField));

                        //新增变量
                        keyArray.forEach(item => {
                            let mapName = item.substring(1);//simName[preFixName]
                            let index = mapName.indexOf("[");
                            let pFieldMap = {
                                soleId: that.$md5(that.gConfig.prodId.value + that.tqsDatasource.datasourceId + mapName.substring(index + 1, mapName.length - 1)),
                                oriPathName: item,
                                fieldName: mapName.substring(0, index),//simpleName
                                fieldDesc: this.pRefFieldMap[mapName].split("-")[0],
                                fieldType: this.pRefFieldMap[mapName].split("-")[1],
                                fieldFrom: 'rel',
                                fieldResult: '',
                                length: 0,
                                mapField: mapName.substring(index + 1, mapName.length - 1),//preFixName
                            };
                            if (!that.evIdSet.has(item)) {
                                that.evIdSet.add(item);
                                that.evEditFieldList.push(new tqsMapFields(pFieldMap));
                            }
                        });
                    } else {
                        that.evEditFieldList = [];
                        that.evIdSet = new Set();
                    }
                }
                that.evSelectConfig.isShow = false;
            },

            /**
             * 事件变量校验
             * */
            evVarsCheck: function () {
                return true;
            },
            /**
             * 事件变量构造
             * */
            evVarsConstruct(value) {
                let that = this;
                let curEvVarsList = value.map(function (item) {
                    let tqsVarItem = {
                        eventVarId: item.soleId,
                        eventVarName: item.fieldName,
                        eventVarType: that.tqsVarsTypeEnums[item.fieldType].code,
                        length: item.length,
                        eventVarDesc: item.fieldDesc,
                    };
                    return new TqsEvVar(tqsVarItem);
                });
                return curEvVarsList;
            },
        }
    }
</script>

<style scoped>
</style>
