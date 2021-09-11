<template>
    <el-scrollbar>
        <el-card class="his-ver-title">
            <div style="display: flex;justify-content: space-between">
                <el-page-header @back="$router.push('/pubFuncHome')">
                    <div slot="content">
                        <span class="is-bold">{{title}}</span>
                    </div>
                </el-page-header>
                <div>
                    <i class="el-icon-question icon-Add-style" @click="tohelperCite"></i>
                </div>
            </div>
        </el-card>
<!--        min-height:443px-->
        <el-card class="his-ver-title">
            <el-table
                    ref="multipleTable"
                    :data="funcVersionCitaion"
                    v-loading="loading"
                    tooltip-effect="dark"
                    stripe
                    highlight-current-row
                    style="width: 100%;"
                    size="mini">
                <el-table-column label="函数ID" align="center" show-overflow-tooltip prop="funcId"></el-table-column>
                <el-table-column label="函数版本" align="center" show-overflow-tooltip prop="funcVersion"></el-table-column>
                <el-table-column label="被决策引用次数" align="center" show-overflow-tooltip prop="decsCount"></el-table-column>
                <el-table-column label="被规则引用次数" align="center" show-overflow-tooltip prop="ruleCount"></el-table-column>
                <el-table-column label="操作" align="center" ><!-- fixed="right" width="200px"-->
                    <template slot-scope="scope">
                        <el-button class="icon-button" type="primary" size="mini" @click="showCitation(scope['row'])">显示详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div >
                <el-pagination
                        background
                        class="paginationColor"
                        layout="total, sizes, prev, pager, next, jumper"
                        style="margin-top: 10px;margin-bottom: 10px"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10,20, 30, 40]"
                        :page-size="pageSize"
                        :current-page.sync="pageNum"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>
        <el-card class="his-ver-title">
            <div style="display: flex;justify-content: space-between">
                <div style="margin: 15px 0">
                    引用关系
                    <el-divider direction="vertical" style="margin: 0 15px"></el-divider>
                    函数版本:<div class="cite-version">{{currentVersion==='0'?"无版本":currentVersion}}</div>
                </div>
            </div>
            <el-collapse v-model="activeName">
                <el-collapse-item name="decs">
                    <template slot="title" >
                        <div title="被决策引用展示" style="width: 100%">
                            <span>被决策引用展示</span>
                            <i class="header-icon el-icon-info" style="margin-left: 10px"></i>

                            <el-button  size="mini"  class="right-button">
                                展开或关闭
                            </el-button>
                        </div>
                    </template>
                    <el-card style="margin: 20px 0">
                        <el-table
                                ref="multipleTable"
                                tooltip-effect="dark"
                                :data="decsCitation"
                                style="cursor: pointer"
                                @row-click="decsClick"
                                stripe
                                border
                                size="mini">
                            <el-table-column type="index" width="50"></el-table-column>
                            <el-table-column prop="decsId" label="决策Id" width="400">
                            </el-table-column>
                            <el-table-column prop="decsName" label="决策名" width="400"></el-table-column>
                            <el-table-column prop="decsVersion" label="决策版本"></el-table-column>
                            <el-table-column prop="count" label="版本数量" width="70"></el-table-column>
                        </el-table>
                    </el-card>
                </el-collapse-item>

                <el-collapse-item name="rule">
                    <template slot="title" >
                        <div title="被规则引用展示" style="width: 100%">
                            <span>被规则引用展示</span>
                            <i class="header-icon el-icon-info" style="margin-left: 10px"></i>

                            <el-button  size="mini"  class="right-button">
                                展开或关闭
                            </el-button>
                        </div>
                    </template>
                    <el-card style="margin: 20px 0">
                        <el-table
                                ref="multipleTable"
                                tooltip-effect="dark"
                                :data="ruleCitation"
                                style="cursor: pointer"
                                @row-click="ruleClick"
                                stripe
                                border
                                size="mini">
                            <el-table-column type="index" width="50"></el-table-column>
                            <el-table-column prop="ruleId" label="规则Id" width="400">
                            </el-table-column>
                            <el-table-column prop="ruleName" label="规则名" width="400"></el-table-column>
                            <el-table-column prop="ruleVersion" label="规则版本"></el-table-column>
                            <el-table-column prop="count" label="版本数量" width="70"></el-table-column>
                        </el-table>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </el-card>
    </el-scrollbar>
</template>

<script>
    import {getFuncVersionCitationList, queryFuncVersionCiteCount} from "../../api/Func";
    import {FuncBase} from "../../entity/func";

    export default {
        name: "pubFuncCitation",
        data() {
            return {
                title:"公有函数引用关系",
                decsUri:'',
                funcVersionCitaion:[],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                loading: false,
                decsCitation:[],
                ruleCitation:[],
                activeName:[],
                prod:"",
                func: new FuncBase(),
                currentVersion:'',
                defaultVersion:'0',
                acProdId:'',
            }
        },mounted() {
            this.initData();
            this.init();
        },
        methods:{
            decsClick(row){
                if (row){
                    window.open(this.decsUri+`/ui/decsManage/decsInf?prodId=${this.acProdId}&decsId=${row.decsId}&tab=decsFlowG6`,"_blank");
                }
            },
            ruleClick(row){
                if (row){
                    window.open(this.decsUri+`/ui/ruleManage/ruleInf?prodId=${this.acProdId}&ruleId=${row.ruleId}&tab=RuleFlowG6`,"_blank");
                }
            },
            // 改变页面size
            handleSizeChange(val) {
                let that = this;
                that.pageSize = val
                that.refreshPage()
            },

            // 跳页
            handleCurrentChange(val) {
                let that = this;
                that.pageNum = val
                that.refreshPage()
            },
            initData () {
                this.acProdId=this.gConfig.prodId.value;
                this.prod = this.$route.query['prod'] === undefined ? '' : this.$route.query['prod'];
                this.func = this.$route.query['func'] === undefined ? '' : this.$route.query['func'];
            },
            init(){
                this.refreshPage();
                this.activeName=['decs','rule'];
            },
            refreshPage() {
                let that = this;
                let params = {prodId: "pub",
                    funcId: that.func.funcId, pageNum: that.pageNum,
                    pageSize: that.pageSize};
                that.loading = true;
                that.funcVersionCitaion=[];
                queryFuncVersionCiteCount(params).then(res=>{
                    that.funcVersionCitaion = res.data.data['objectList'];
                    that.total = res.data.data['total'];
                    //如果实际有数据，并且当前页面没数据时
                    if (that.total > 0 && that.funcVersionCitaion.length === 0) {
                        that.pageNum = 1;
                        that.refreshPage();
                    }
                    if (that.pageNum===1 && that.total>0){
                        that.defaultVersion=that.funcVersionCitaion[0]["funcVersion"];
                    }
                    that.currentVersion=that.defaultVersion;
                    that.showCitationChange(that.currentVersion);
                }).finally(res => {
                    that.loading = false;
                })
            },
            showCitation(row){
                let that=this;
                that.currentVersion=row.funcVersion;
                that.showCitationChange(that.currentVersion);

            },
            showCitationChange(fv){
                let that = this;
                let params={prodId: 'pub',
                    actualProdId:this.gConfig.prodId.value,
                    funcId: that.func.funcId,funcVersion:fv};
                that.loading = true;
                that.decsCitation=[];
                that.ruleCitation=[];
                that.decsUri='';
                getFuncVersionCitationList(params).then(res=>{
                    let resData=res.data;
                    that.decsCitation=resData[0].data;
                    that.ruleCitation=resData[1].data;
                    that.decsUri=resData[2].data;

                }).finally(res => {
                    that.loading = false;
                })
            },
            tohelperCite(){
                window.open(this.helper.helpUri.uri+this.helper.priVer.uri,"_blank")
            },
        },
    }
</script>

<style scoped>
    /deep/ .paginationColor.el-pagination.is-background.el-pagination span{
        color: #333333;
    }
    /deep/ .paginationColor.el-pagination .el-input__inner{
        color: #333333;
    }
    /deep/ .paginationColor.el-pagination.is-background .el-pager li:not(.disabled).active{
        background-color: #409EFF;
        color: #FFF;
    }
    /deep/ .paginationColor.el-pagination .el-select .el-input .el-input__inner{
        color: #333333;
    }
</style>