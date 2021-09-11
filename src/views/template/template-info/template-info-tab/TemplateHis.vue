<template>
    <!--模板历史-->
    <div id="templateHis">
        <div class="tools" v-if="false">
            <el-form @submit.native.prevent :inline="true" size="mini">
                <el-form-item label="模板名">
                    <el-input placeholder="模板名" maxlength="64" show-word-limit  v-model="decsFilter.decsName"></el-input>
                </el-form-item>
                <el-form-item label="版本">
                    <el-input placeholder="版本" maxlength="64" show-word-limit v-model="decsFilter.decsVersion"></el-input>
                </el-form-item>
                <el-form-item label="模板状态">
                    <el-select placeholder="模板状态" v-model="decsFilter.decsStatus" clearable>
                        <el-option :label="statusEnums['0'].name" :key="statusEnums['0'].code" :value="statusEnums['0'].code"></el-option>
                        <el-option :label="statusEnums['1'].name" :key="statusEnums['1'].code" :value="statusEnums['1'].code"></el-option>
                        <el-option :label="statusEnums['Y'].name" :key="statusEnums['Y'].code" :value="statusEnums['Y'].code"></el-option>
                        <el-option :label="statusEnums['N'].name" :key="statusEnums['N'].code" :value="statusEnums['N'].code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="refreshPage">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table
                ref="multipleTable"
                :data="templateList"
                v-loading="loading"
                tooltip-effect="dark"
                stripe
                size="mini"
                style="width: 100%; min-height: 746px;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <template-show :p-decs="props.row" :p-type="tabType.decsHis"></template-show>
                </template>
            </el-table-column>
            <el-table-column prop="templateId" align="center"  label="模板ID"></el-table-column>
            <el-table-column prop="templateName" align="center"  label="模板名"></el-table-column>
            <el-table-column prop="templateVersion" align="center"  label="模板版本"></el-table-column>
            <el-table-column prop="createUser" align="center"  label="创建人"></el-table-column>
            <el-table-column prop="createTime" align="center"  label="创建时间"></el-table-column>
            <el-table-column prop="status" align="center"  label="模板状态">
                <template slot-scope="props">
                    <el-tag :type="tagType[props.row.status]" style="width: 60px">{{statusEnums[props.row.status].name}}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                class="pagination-bar"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[15, 30, 60, 100]"
                :page-size="pageSize"
                :current-page.sync="pageNum"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import {DecsBase} from "../../../../entity/decs";
    import TemplateShow from "../../template-components/TemplateShow";
    import {isEmpty} from "../../../../utils";
    import {changeTypeEnums, statusEnums, tabType, tagType} from "../../../../entity/enumns";
    import {getTemplateHistoryList} from "../../../../api/Template";
    import {TemplateHistory} from "../../../../entity/template";

    export default {
        name: "TemplateHis",
        components: {TemplateShow},
        props: {
            pDecs: DecsBase
        },
        data() {
            return {
                templateList: [],
                templateHistory: new TemplateHistory(),
                loading : false,
                pageNum: 1,
                pageSize: 15,
                total: 0,
                statusEnums :statusEnums,
                tabType: tabType,
                tagType:tagType,
                changeTypeEnums: changeTypeEnums,
                isEmpty:isEmpty
            }
        },
        methods: {
            init() {
               this.refreshPage()
            },


            handleCurrentChange(val) {
                this.pageNum = val;
                this.refreshPage();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNum = 1;
                this.refreshPage();
            },

            refreshPage() {
                let that = this;
                that.templateHistory.templateId=that.pDecs.decsId;
                let params = {
                    prodId: that.pDecs.prodId,
                    templateId: that.pDecs.decsId,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    templateHistory: that.templateHistory
                };
                that.loading = true;
                getTemplateHistoryList(params).then(res => {

                    that.templateList = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.templateList.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage()
                    }
                }).finally(() => {
                    that.loading = false;
                })
            },
        }
    }
</script>

<style scoped>
</style>
