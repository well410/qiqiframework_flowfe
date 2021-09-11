<template>
    <div id="rateCtrl" ref="rateCtrl" style="min-height: 100%">
        <el-scrollbar style="height: 100%">
            <node-inf :node="node" :disabled="disabled"></node-inf>
            <el-card class="node-content-card">
                <!--元规则结果-->
                <div title="对流程中的流量进行控制，必须保证所有结果之和为100%。" style="width: 110px">
                    <span>流量控制</span>
                    <i class="header-icon el-icon-info"></i>
                </div>
                <div class="tools" style="width: 100%">
                    <el-button  icon="el-icon-plus" size="mini" @click="addRateCtrl" class="node-set-button" :disabled="disabled">添加</el-button>
                </div>
                <span style="color: red">{{errMessage}}</span>
                <el-table
                        id="rateCtrlTable"
                        :data="uResultList"
                        tooltip-effect="dark"
                        stripe
                        border
                        max-height="700px"
                        size="mini"
                        row-key="logicId"
                        style="width: 100%">
                    <el-table-column align="center" label="逻辑序号" prop="logicId"></el-table-column>
                    <el-table-column align="rate" label="流量占比" prop="rate"  @cell-dblclick="tableDbEdit" >
                        <template slot-scope="scope">
                            <el-form :model="scope.row">
                                <el-form-item  prop="rate">
                                    <el-input-number  v-model="scope.row.rate"  :step="1" :max="100" :min="0" v-if="scope.row.logicId !== '999'" :disabled="disabled"></el-input-number>
                                    <el-input-number  v-model="scope.row.rate"  :step="1" :max="100" :min="0" v-if="scope.row.logicId === '999'" disabled></el-input-number>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="80x">
                        <template slot-scope="scope">
                            <el-form :model="scope.row">
                                <el-form-item>
                                    <el-button type="danger" class="node-set-button" icon="el-icon-delete" size="mini" @click="deleteClick(scope.row)" title="删除" :disabled="disabled"></el-button>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-scrollbar>
    </div>
</template>

<script>
    import NodeInf from "../common/node-inf";
    import {ls} from "../index";
    import {isContainEmpty, isEmpty, isNotEmpty} from "../../utils";
    import {RateCtrlVar} from "../../entity/vars";
    export default {
        name: "RateCtrlRule",
        components:{NodeInf},
        props: {
            decisionTree: Object,
            node: {default: () => {}, type: Object},
            disabled: {default: false, type: Boolean}
        },
        data() {
            return{
                uResultList: []
            }
        },

        computed: {
            errMessage: function () {
                if (isEmpty(this.uResultList)) {
                    return
                }
                let rateTotal = this.uResultList.reduce((total, currentValue) => {
                    return total += parseInt(currentValue.rate)
                }, 0);
                let rateTotalLast = rateTotal - parseInt(this.uResultList[this.uResultList.length - 1].rate);
                if (rateTotalLast > 100) {
                    return "总和大于100.请重新输入。";
                } else if (rateTotal === 100) {
                    return "";
                } else {
                    this.uResultList[this.uResultList.length - 1].rate = 100 - rateTotalLast;
                }
            }
        },

        watch: {
            uResultList: {
                handler(value) {
                    let that = this;
                    that.node.nData.uResultList = value;
                },
                deep: true
            },
        },
        mounted() {
        },

        methods: {
            addRateCtrl(){
                this.uResultList.splice(this.uResultList.length-1, 0 , this.buildRateCtrl());
            },
            buildRateCtrl(){
                let cdNum = 999;
                let urIdList = ls(cdNum);
                // 新增没有出现的id
                let uResultListLoginId = this.uResultList.map(ur => ur.logicId);
                let noInUResultListId = urIdList.filter(urId => uResultListLoginId.indexOf(urId) === -1);
                return new RateCtrlVar({logicId: noInUResultListId[0], rate:0});
            },
            tableDbEdit(row, column, cell, event) {
                this.uResultList.add( new RateCtrlVar({logicId:"999",rate:100}));
            },
            init() {
                let that = this;
                that.isEmpty(that.node.nData.uResultList) ? that.uResultList = [ new RateCtrlVar({logicId:"999",rate:100}) ] : that.uResultList = that.node.nData.uResultList.map(item=>new RateCtrlVar(item));
            },
            // 删除数据
            deleteClick(row) {
                let that = this;
                that.uResultList = that.uResultList.filter(ur => ur.logicId !== row.logicId);
            },
        }
    }
</script>

<style scoped>
    @import "../../views/common/index.css";
</style>
