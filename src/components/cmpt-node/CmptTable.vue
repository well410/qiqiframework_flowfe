<template>
    <div id="cmptTable">
        <div class="tools">
            <el-form @submit.native.prevent :inline="true">
                <div class="node-search-block">
                    <el-form-item style="margin: 0">
                        <el-row>
                            <el-col :xs="24" :sm="12" :md="5" :lg="5" :xl="5" style="padding-right:10px ">
                                <el-select v-model="cmptQueryDto.inteType" clearable placeholder="接入类型">
                                    <el-option label="http" value="H"></el-option>
                                    <el-option label="kafka" value="K"></el-option>
                                    <el-option label="model" value="M"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="9" :lg="9" :xl="9" style="padding-right:10px ">
                                <el-input placeholder="组件ID"
                                          maxlength="64" show-word-limit
                                          v-model="cmptQueryDto.cmptId" @keydown.enter.native="refreshPage" class="radius-input"></el-input>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" style="padding-right:10px ">
                                <el-input placeholder="组件名"
                                          maxlength="64" show-word-limit
                                          v-model="cmptQueryDto.cmptName" @keydown.enter.native="refreshPage" class="radius-input"></el-input>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="2" :lg="2" :xl="2" style="padding-right:10px ">
                                <el-button type="primary" @click="refreshPage"> 查询</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>

                </div>






            </el-form>
        </div>

        <el-table
                ref="multipleTable"
                :data="cmptList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                border
                size="mini">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <cmpt-show :p-cmpt="props.row"></cmpt-show>
                </template>
            </el-table-column>
            <el-table-column prop="prodId"  label="产品id"></el-table-column>
            <el-table-column prop="cmptId"  label="组件id"></el-table-column>
            <el-table-column prop="cmptName" label="组件名"></el-table-column>
            <el-table-column prop="inteType"  label="接入类型">
                <template slot-scope="props">
                    <el-tag v-if="isNotEmpty(inteTypeEnums[props.row.inteType])" :type="tagType[props.row.inteType]">
                        {{inteTypeEnums[props.row.inteType].name}}
                    </el-tag>
                    <template v-else>
                        {{props.row.inteType}}
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="status"  label="组件状态">
                <template slot-scope="props">
                    <el-tag v-if="isNotEmpty(statusEnums[props.row.status])"
                            :type="tagType[props.row.status]">{{statusEnums[props.row.status].name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
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
                           :page-size="cmptQueryDto.pageSize"
                           :total="total"></el-pagination>

        </div>

        <!--版本选择-->
        <el-dialog
                :visible.sync="isShow"
                :modal="false"
                :close-on-click-modal="false">
            <div slot="title">
                <div class="clearfix" style="width: 97%;">
                    <div class="dialog-title">选择版本</div>
                </div>
            </div>
            <el-table
                    ref="multipleTable"
                    :data="cmptVersionList"
                    tooltip-effect="dark"
                    stripe
                    border
                    size="mini">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <cmpt-show :p-cmpt="props.row"></cmpt-show>
                    </template>
                </el-table-column>
                <el-table-column prop="prodId"  label="产品id"></el-table-column>
                <el-table-column prop="cmptId"  label="组件id"></el-table-column>
                <el-table-column prop="cmptName" label="组件名"></el-table-column>
                <el-table-column prop="cmptVersion"  label="组件版本"></el-table-column>
                <el-table-column prop="status"  label="组件状态">
                    <template slot-scope="props">
                        <el-tag v-if="isNotEmpty(statusEnums[props.row.status])"
                                :type="tagType[props.row.status]">{{statusEnums[props.row.status].name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="props">
                        <el-button class="icon-button" @click="versionSelAfter(props.row)" :disabled="props.row.disabled" size="mini"
                                   title="选择"> <svg-icon icon-class="choose_ver" style="width: 1.6em;height: 1.6em;color: #68BF7B"></svg-icon>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import {Cmpt} from "../../entity/cmpt";
    import CmptShow from "./CmptShow";
    import {getCmptList, getCmptVersionList} from "../../api/Cmpt";
    import {isNotEmpty} from "../../utils";
    import {inteTypeEnums, statusEnums, tagType} from "../../entity/enumns";
    import {G6Model} from "../../entity/g6Model";

    export default {
        name: "CmptTable",
        components: {CmptShow},
        props: {
            pDecisionTree: Object
        },
        data() {
            return {
                cmptQueryDto: {
                    cmptId: "",
                    cmptName: "",
                    inteType: "",
                    pageNum: 1,
                    pageSize: 10,
                },
                total: 0,
                loading: false,
                isShow: false,
                cmptVersionList: [],
                cmptList: [],
                tagType: tagType,
                statusEnums: statusEnums,
                inteTypeEnums:inteTypeEnums,
                isNotEmpty:isNotEmpty

            }
        },

        methods: {
            versionSelAfter(cmpt) {
                this.isShow = false;
                this.$emit("cmptSelClick", cmpt)
            },

            refreshPage() {
                let that = this;
                that.loading = true;
                getCmptList({prodId: this.gConfig.prodId.value, cmptQueryDto: that.cmptQueryDto}).then(res => {
                    that.cmptList = res.data.data['objectList'].map(cmpt=>new Cmpt(cmpt));
                    that.total = res.data.data['total'];

                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.cmptList.length === 0) {
                        that.cmptQueryDto.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },

            handleCurrentChange(val) {
                this.cmptQueryDto.pageNum = val;
                this.refreshPage();
            },

            versionSelBefore(row) {
                let that = this;
                that.isShow = true;
                let cmptQueryDto = {cmptId: row.cmptId};

                // 判读当前组件是否能够选择
                function isDisabled(cmpt) {
                    let cmptList = G6Model.getCmptList(that.pDecisionTree);
                    let filterList = cmptList.filter(cmpt => cmpt.cmptId === row.cmptId);
                    if (filterList.length > 0) { // 如果该组件被使用，那么只能勾选相同的版本
                        return !(filterList[0].cmptVersion === cmpt.cmptVersion);
                    } else {
                        return false;
                    }
                }

                getCmptVersionList({prodId: this.gConfig.prodId.value, cmptQueryDto}).then(res => {
                    let arr = [];
                    if (isNotEmpty(res.data.data)) {
                        arr = res.data.data['objectList'].map(cmpt=>new Cmpt(cmpt));
                        arr = arr.filter(cmpt=>cmpt.status === 'Y');
                    }
                    let cmptVersionList = [row, ...arr];
                    cmptVersionList.forEach(cmpt => {
                        this.$set(cmpt, "disabled", isDisabled(cmpt))
                    });

                    that.cmptVersionList = cmptVersionList;
                })
            },
        }
    }
</script>

<style scoped>
    #cmptTable {
        width: 100%;
        height: 100%;
    }

    .pagination {
        margin-top: 15px
    }


    .tools {
        padding: 15px 0;
        background: #f7f7f7;
        border: 1px solid #e4e7ed;
    }
</style>
