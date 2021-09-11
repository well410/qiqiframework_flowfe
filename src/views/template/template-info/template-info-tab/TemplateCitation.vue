<template>
    <div id="decsCitation">
        <el-scrollbar>
            <el-card class="node-content-card">
                <el-collapse>
                    <!--  规则-->
                    <el-collapse-item >
                        <template slot="title">
                            <div title="引用规则展示" style="width: 100%">
                                <span>引用规则展示</span>
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
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="ruleId" label="规则Id">
                                    <!--<template slot-scope="prop"></template>-->
                                </el-table-column>
                                <el-table-column prop="ruleName" label="规则名"></el-table-column>
                                <el-table-column prop="ruleVersion" label="规则版本"></el-table-column>
                            </el-table>
                        </el-card>
                    </el-collapse-item>
                    <!--函数-->
                    <el-collapse-item>
                        <template slot="title">
                            <div title="引用函数展示" style="width: 100%">
                                <span>引用函数展示</span>
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
                                    :data="funcCitation"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="funcId" label="函数Id">

                                </el-table-column>
                                <el-table-column prop="funcName" label="函数名"></el-table-column>
                                <el-table-column prop="funcVersion" label="函数版本"></el-table-column>
                                <el-table-column label="操作" width="540">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="mini" @click="funcClick(scope['row'])">前往</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </el-collapse-item>
                    <!--组件-->
                    <el-collapse-item>
                        <template slot="title">
                            <div title="引用组件展示" style="width: 100%">
                                <span>引用组件展示</span>
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
                                    :data="cmptCitation"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="cmptId" label="组件Id">
                                </el-table-column>
                                <el-table-column prop="cmptName" label="组件名"></el-table-column>
                                <el-table-column prop="cmptVersion" label="组件版本"></el-table-column>
                            </el-table>
                        </el-card>
                    </el-collapse-item>
                    <!--变量-->
                    <el-collapse-item>
                        <template slot="title">
                            <div title="引用变量展示" style="width: 100%">
                                <span>引用变量展示</span>
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
                                    :data="varsCitation"
                                    stripe
                                    border
                                    size="mini">
                                <el-table-column type="index" width="50"></el-table-column>
                                <el-table-column prop="datasourceId" label="数据源Id">
                                </el-table-column>
                                <el-table-column prop="varsId" label="变量Id"></el-table-column>
                                <el-table-column prop="desc" label="变量描述"></el-table-column>
                            </el-table>
                        </el-card>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-scrollbar>
    </div>
</template>

<script>
    import {DecsBase} from "../../../../entity/decs";
    import {DecsFilter} from "../../index";
    import {queryDecsCitation} from "../../../../api/Decs";

    export default {
        name: "DecsCitation",
        components:{},
        props: {
            pDecs: DecsBase
        },
        data(){
            return{
                decsFilter: new DecsFilter(),
                ruleMap:[],
                ruleCitation:[],
                funcCitation:[],
                cmptCitation:[],
                varsCitation:[]
            }
        },
        methods:{
            init(){
                this.refreshPage();
            },
            funcClick(data){},
            refreshPage() {
                let that=this;
                let params={
                    prodId:that.pDecs.prodId,
                    decsId: that.pDecs.decsId,
                    decsFilter: that.decsFilter
                };
                that.loading = true;
                queryDecsCitation(params).then(res =>{
                    console.log(res);
                    if (res.data!=null && res.data.length==5){
                        let ruleList=res.data[0].data;
                        let ruleChildren=res.data[1].data;
                        for (let i=0;i<ruleList.length;i++){
                            ruleList[i].children=ruleChildren[i];
                            that.ruleCitation.push(ruleList[i]);
                        }
                        that.funcCitation=res.data[2].data;
                        that.cmptCitation=res.data[3].data;
                        that.varsCitation=res.data[4].data;
                    }


                }).finally(() => {
                    that.loading = false;
                })
            }
        },
    }
</script>

<style scoped>

</style>
