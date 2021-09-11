<template>
    <div id="funcTable">
        <div class="tools">
            <el-form @submit.native.prevent>
                <el-form-item style="margin: 0">
                    <div class="node-search-block">
                        <el-row>
                            <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-right:15px ">
                            <el-form-item>
                                <el-select placeholder="函数类型" v-model="funcFilter.prodId" style="border-radius: 50px" @change="refreshPage">
                                    <el-option label="公有函数" key="pub" value="pub"></el-option>
                                    <el-option label="私有函数" :key="gConfig.prodId.value" :value="gConfig.prodId.value"></el-option>
                                </el-select>
                            </el-form-item>
                            </el-col>
                            <el-col :xs="15" :sm="15" :md="15" :lg="15" :xl="16">

                                <el-input class='node-search-input' prefix-icon="el-icon-search" placeholder="请输入查询关键字" v-model="searchCon"
                                          maxlength="64" show-word-limit
                                          @keydown.enter.native="refreshPage">
                                </el-input>
                            </el-col>
                            <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="2">
<!--                                <div class="button-block">-->
                                    <el-button size="mini" @click="cancel">取消</el-button>
<!--                                </div>-->
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <!--基础表查询-->
        <el-table
                ref="multipleTable"
                :data="funcList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                size="mini"
                style="border-top: 1px solid #e4e7ed;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <func-show :p-func="props.row"></func-show>
                </template>
            </el-table-column>
            <el-table-column label="序号" align="center"  type="index" width="60"></el-table-column>
            <el-table-column label="函数ID" align="center"  prop="funcId"></el-table-column>
            <el-table-column label="函数名字" align="center"  prop="funcName"></el-table-column>
            <el-table-column label="函数类型" align="center"  prop="funcType">
                <template slot-scope="props">
                    <el-tag :type="tagType[props.row.funcType]"  style="width: 40px">{{funTypeEnums[props.row.funcType].name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="函数状态" align="center"  prop="status">
                <template slot-scope="props">
                    <el-tag :type="tagType[props.row.status]"  style="width: 60px">{{statusEnums[props.row.status].name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="操作">
                <template slot-scope="props">
                    <el-button class="icon-button" @click="versionSelBefore(props.row)" size="mini" title="选择版本">
                        <svg-icon icon-class="choose" style="width: 1.6em;height: 1.6em;color: #409eff"></svg-icon>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="clearfix">
            <el-pagination background layout="total,prev,pager,next" class="pagination"
                           @current-change="handleCurrentChange"
                           :page-size="pageSize"
                           :total="total"></el-pagination>

        </div>

        <!--版本选择-->
        <el-dialog
                :visible.sync="isShow"
                :close-on-click-modal="false"
                :modal="false"
                title="选择版本">
            <el-table
                    ref="multipleTable"
                    :data="funcVersionList"
                    tooltip-effect="dark"
                    stripe
                    border
                    size="mini"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <func-show :p-func="props.row"></func-show>
                    </template>
                </el-table-column>
                <el-table-column label="序号" align="center"  type="index" width="60"></el-table-column>
                <el-table-column label="函数ID" align="center"  prop="funcId"></el-table-column>
                <el-table-column label="函数名字" align="center"  prop="funcName"></el-table-column>
                <el-table-column label="函数版本" align="center"  prop="funcVersion"></el-table-column>
                <el-table-column label="函数类型" align="center"  prop="funcType">
                    <template slot-scope="props">
                        <el-tag :type="tagType[props.row.funcType]" style="width: 60px">{{funTypeEnums[props.row.funcType].name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="函数状态" align="center"  prop="status">
                    <template slot-scope="props">
                        <el-tag :type="tagType[props.row.status]" style="width: 60px">{{statusEnums[props.row.status].name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作"align="center"  >
                    <template slot-scope="props">
                        <el-button :disabled="computeDisable(props.row)" class="icon-button" @click="versionSelAfter(props.row)" size="mini" title="选择">
                            <svg-icon icon-class="choose_ver" style="width: 1.6em;height: 1.6em;color: #68BF7B"></svg-icon>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>


<script>
    import FuncShow from "./FuncShow";
    import {getFuncList, getFuncVersionList1, getFuzzyFuncList} from "../../api/Func";
    import {isNotEmpty} from "../../utils";
    import {funTypeEnums, statusEnums, tagType} from "../../entity/enumns";
    import {G6Model} from "../../entity/g6Model";
    import {FuzzyFuncFilter} from "../../api";

    export default {
        name: "FuncTable",
        components: {FuncShow},
        props: {
            pDecisionTree: Object
        },
        data() {
            return {
                funcFilter: {
                    funcName: "",
                    funcStatus: "",
                    funcId: "",
                    // 如果是公有函数是'pub'，如果是私有函数是产品id
                    prodId: this.gConfig.prodId.value
                },
                isShow: false,
                funcVersionList: [],
                statusEnums: statusEnums,
                funTypeEnums: funTypeEnums,
                tagType: tagType,
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0,
                funcList: [],
                searchCon:"",
                gConfig:this.gConfig

            }
        },

        computed:{
            // 一个规则或者决策仅能使用一个版本的函数 todo 11/16 不限制函数版本，投产后没有问题可以删除
            computeDisable() {
                return (row) => {
                    return false;
                    // let funcList = G6Model.getFunList(this.pDecisionTree);
                    // let filterList = funcList.filter(item => item.funcId === row.funcId);
                    // // 如果该函数被引用过，那么只能引用相同的版本
                    // if (isNotEmpty(filterList)) {
                    //     let sameVersionList = filterList.filter(item => item.funcVersion === row.funcVersion);
                    //     // 如果有相同的版本，那么可以选择，不是相同的版本，不能选择
                    //     return !isNotEmpty(sameVersionList);
                    // }
                    //
                    //
                    // return false
                };
            }
        },

        methods: {
            versionSelAfter(func) {
                this.isShow = false;
                this.$emit("funSelClick", func);
            },

            refreshPage() {
                let that = this;
                let searchStatus = ''
                if(this.searchCon!=''&&(this.searchCon.includes('草')||this.searchCon.includes('稿')||this.searchCon.includes('草稿'))){
                    searchStatus = '0'
                    this.searchCon =''
                }else if(this.searchCon!=''&&(this.searchCon.includes('验')||this.searchCon.includes('证')||this.searchCon.includes('验证'))){
                    searchStatus = '1'
                    this.searchCon =''
                }else if(this.searchCon!=''&&(this.searchCon.includes('发')||this.searchCon.includes('布')||this.searchCon.includes('发布'))){
                    searchStatus = '2'
                    this.searchCon =''
                }
                let filterParams = {
                    status:searchStatus,
                    searchCon: that.searchCon,
                    prodId: this.gConfig.prodId.value,
                }

                let params = {
                    prodId: this.funcFilter.prodId,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    funcFilter: new FuzzyFuncFilter(filterParams)
                };
                that.loading = true;
                getFuzzyFuncList(params).then(res=>{
                // getFuncList({
                //     prodId: this.funcFilter.prodId,
                //     pageNum: that.pageNum,
                //     pageSize: that.pageSize,
                //     funcFilter: that.funcFilter
                // }).then(res => {
                    that.funcList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.funcList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },

            handleCurrentChange(val) {
                this.pageNum = val;
                this.refreshPage()
            },

            versionSelBefore(row) {
                let that = this;
                that.isShow = true;

                getFuncVersionList1({prodId: this.funcFilter.prodId, funcId: row.funcId}).then(res => {
                    let arr = [];
                    if (isNotEmpty(res.data.data)) {
                        arr = res.data.data;
                        // 启用的才能选择
                        arr = arr.filter(func=>func.status === 'Y');
                    }
                    that.funcVersionList = [row, ...arr];
                })
            },
            cancel(){
                this.searchCon="";
            }

        },
        watch:{

        }
    }
</script>

<style scoped>

    .pagination {
        margin-top: 15px
    }

    .tools {
        padding: 15px 0;
        background: #f7f7f7;
        border: 1px solid #e4e7ed;
    }
</style>
