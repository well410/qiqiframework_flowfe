<template>
    <!--
        数组遍历（这代码我已经不知道怎么开发或者维护了，吐血。。。），分为以下情况
        层级1：
            1：无过滤，无循环
            2：有过滤，无循环
            3：无过滤，有循环
            4：有过滤，有循环

        层级2：
            1：有条件
            2：无条件

        根据排列组合分为 8 种情况。。。。
    -->
    <div>
        <div class="logic-box">
            <div class="iteration-contain">
                <span>for(Object item1 : </span>
                <el-select placeholder="请配置映射参数"
                           filterable
                           v-model="pArrIteration.iterationCode.refVar"
                           style="width: 200px"
                           size="mini">
                    <el-option v-for="item in iterationRelLevel1"
                               :key="item.getPrefixVarName()"
                               :label="item.getDescVarName()"
                               :value="item.getPrefixVarName()">
                            <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                            <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                    </el-option>
                </el-select>
                <span> ): {</span>

                <check-box-code class="check-box-code-contain"
                                ref="checkBoxLevel1"
                                :disabled="disabled"
                                @handleCheckedCodeChange="handleCheckedCodeChangeLevel1"></check-box-code>

                <div class="varHandle-contain" v-show="codeIsShow('varHandle')">
                    <var-handle-code-edit :p-var-handle-code="pArrIteration.iterationCode.varHandleCode"
                                          :p-decision-tree="pDecisionTree"
                                          :disabled="disabled"
                                          p-level="level1"
                                          :p-rel-var-list="varHandleCodeRelLevel1"></var-handle-code-edit>
                </div>

                <!--有过滤的函数-->
                <div class="filter-contain" v-show="codeIsShow('filter')">
                    <!--层级1-->
                    <filter-code-edit :p-filter-code="pArrIteration.iterationCode.filterCode"
                                      :disabled="disabled"
                                      :p-rel-var-list="filterCodeRelLevel1"></filter-code-edit>
                    <div>
                        <div class="iteration-contain" v-show="codeIsShow('filter-iteration')">
                            <span>for(Object item2 : </span>
                            <el-select placeholder="请配置映射参数"
                                       filterable
                                       v-model="pArrIteration.iterationCode.iterationCode.refVar"
                                       style="width: 200px"
                                       size="mini">
                                <el-option v-for="item in iterationRelLevel2"
                                           :key="item.getPrefixVarName()"
                                           :label="item.getDescVarName()"
                                           :value="item.getPrefixVarName()">
                                    <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                    <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                                </el-option>
                            </el-select>
                            <span> ): {</span>
                            <check-box-code class="check-box-code-contain"
                                            :disabled="disabled"
                                            :p-remove-list="['循环', '统计']"
                                            ref="checkBoxLevel21"
                                            @handleCheckedCodeChange="handleCheckedCodeChangeLevel2"></check-box-code>

                            <div class="varHandle-contain" v-show="codeIsShow('filter-iteration-varHandle')">
                                <var-handle-code-edit :p-var-handle-code="pArrIteration.iterationCode.iterationCode.varHandleCode"
                                                      p-level="level2"
                                                      :disabled="disabled"
                                                      :p-rel-var-list="varHandleCodeRelLevel2"></var-handle-code-edit>
                            </div>


                            <div class="filter-contain" v-show="codeIsShow('filter-iteration-filter')">
                                <!--层级二-->
                                <filter-code-edit :p-filter-code="pArrIteration.iterationCode.iterationCode.filterCode"
                                                  :disabled="disabled"
                                                  :p-rel-var-list="filterCodeRelLevel2"></filter-code-edit>
                                <div class="groupBy-contain" v-show="codeIsShow('filter-iteration-filter-groupBy')">
                                    <!--层级2-->
                                    <group-by-code-edit :p-group-by-code="pArrIteration.iterationCode.iterationCode.groupByCode"
                                                        :p-decision-tree="pDecisionTree"
                                                        :disabled="disabled"
                                                        p-level="level2"
                                                        key="group-level2"
                                                        :p-rel-var-list="groupByCodeRelLevel2"></group-by-code-edit>
                                </div>
                                <span>}</span>
                            </div>


                            <div class="groupBy-contain" v-show="codeIsShow('filter-iteration-groupBy')">
                                <!--层级2-->
                                <group-by-code-edit :p-group-by-code="pArrIteration.iterationCode.iterationCode.groupByCode"
                                                    :p-decision-tree="pDecisionTree"
                                                    p-level="level2"
                                                    :disabled="disabled"
                                                    key="group-level2"
                                                    :p-rel-var-list="groupByCodeRelLevel2"></group-by-code-edit>
                            </div>
                            <span>}</span>
                        </div>
                    </div>

                    <div class="groupBy-contain" v-show="codeIsShow('filter-groupBy')">
                        <!--层级1-->
                        <group-by-code-edit :p-group-by-code="pArrIteration.iterationCode.groupByCode"
                                            :p-decision-tree="pDecisionTree"
                                            :disabled="disabled"
                                            :p-rel-var-list="groupByCodeRelLevel1"></group-by-code-edit>
                    </div>

                    <span>}</span>
                </div>

                <!--没有过滤的函数-->
                <div v-show="codeIsShow('noFilter')">
                    <div class="iteration-contain" v-show="codeIsShow('noFilter-iteration')">
                        <span>for(Object item2 : </span>
                        <el-select placeholder="请配置映射参数"
                                   v-model="pArrIteration.iterationCode.iterationCode.refVar"
                                   filterable
                                   style="width: 200px"
                                   size="mini">
                            <el-option v-for="item in iterationRelLevel2"
                                       :key="item.getPrefixVarName()"
                                       :label="item.getDescVarName()"
                                       :value="item.getPrefixVarName()">
                                <span :title="item.getPrefixVarName()" class="option-left">{{item.getPrefixVarName()}}</span>
                                <span :title="item.getSimpleDesc()" class="option-right">{{item.getSimpleDesc()}}</span>
                            </el-option>
                        </el-select>
                        <span> ): {</span>
                        <check-box-code class="check-box-code-contain"
                                        :disabled="disabled"
                                        :p-remove-list="['循环', '统计']"
                                        ref="checkBoxLevel22"
                                        @handleCheckedCodeChange="handleCheckedCodeChangeLevel2"></check-box-code>

                        <div class="varHandle-contain" v-show="codeIsShow('noFilter-iteration-varHandle')">
                            <var-handle-code-edit :p-var-handle-code="pArrIteration.iterationCode.iterationCode.varHandleCode"
                                                  p-level="level2"
                                                  :disabled="disabled"
                                                  :p-rel-var-list="varHandleCodeRelLevel2"></var-handle-code-edit>
                        </div>


                        <div class="filter-contain" v-show="codeIsShow('noFilter-iteration-filter')">
                            <!--层级2-->
                            <filter-code-edit :p-filter-code="pArrIteration.iterationCode.iterationCode.filterCode"
                                              :disabled="disabled"
                                              :p-rel-var-list="filterCodeRelLevel2"></filter-code-edit>
                            <div class="groupBy-contain" v-show="codeIsShow('noFilter-iteration-filter-groupBy')">
                                <!--层级2-->
                                <group-by-code-edit :p-group-by-code="pArrIteration.iterationCode.iterationCode.groupByCode"
                                                    :p-decision-tree="pDecisionTree"
                                                    :disabled="disabled"
                                                    p-level="level2"
                                                    :p-rel-var-list="groupByCodeRelLevel2"></group-by-code-edit>
                            </div>
                            <span>}</span>
                        </div>


                        <div class="groupBy-contain" v-show="codeIsShow('noFilter-iteration-groupBy')">
                            <!--层级2-->
                            <group-by-code-edit :p-group-by-code="pArrIteration.iterationCode.iterationCode.groupByCode"
                                                :p-decision-tree="pDecisionTree"
                                                :disabled="disabled"
                                                p-level="level2"
                                                :p-rel-var-list="groupByCodeRelLevel2"></group-by-code-edit>
                        </div>

                        <span>}</span>
                    </div>
                </div>

                <div class="groupBy-contain" v-show="codeIsShow('groupBy')">
                    <!--层级1-->
                    <group-by-code-edit :p-group-by-code="pArrIteration.iterationCode.groupByCode"
                                        :p-decision-tree="pDecisionTree"
                                        :disabled="disabled"
                                        :p-rel-var-list="groupByCodeRelLevel1"></group-by-code-edit>
                </div>
                <span> } </span>
            </div>

            <div class="statistics-contain" v-show="codeIsShow('statistics')">
                   <statistics-code-edit :p-statistics-code="pArrIteration.iterationCode.statisticsCode"
                                         :p-decision-tree="pDecisionTree"
                                         :disabled="disabled"
                                         :p-rel-var-list="statisticsCodeRel"></statistics-code-edit>
            </div>
        </div>


        <div class="resultList-contain">
            <result-list-edit :p-arr-iteration="pArrIteration"
                              :disabled="disabled"
                              :p-rel-var-list="resultListRelLevel"></result-list-edit>
        </div>
    </div>


</template>

<script>
    import {GroupBy, VarHandle} from "../index";
    import CheckBoxCode from "../components/CheckBoxCode";
    import FilterCodeEdit from "../components/FilterCodeEdit";
    import VarHandleCodeEdit from "../components/VarHandleCodeEdit";
    import GroupByCodeEdit from "../components/GroupByCodeEdit";
    import StatisticsCodeEdit from "../components/StatisticsCodeEdit";
    import ResultListEdit from "../components/ResultListEdit";
    import {DrlVar} from "../../index";
    import {isEmpty} from "../../../utils";

    export default {
        name: "ArrayIteration",
        components: {
            ResultListEdit,
            StatisticsCodeEdit, GroupByCodeEdit, VarHandleCodeEdit, FilterCodeEdit, CheckBoxCode},
        props: {
            pArrRelVarList: {type: Array, default: () => []},
            pDecisionTree: {type: Object, default:()=>{}},
            pArrIterationRelVarList: {type: Array, default: () => []},
            pArrIteration : {type:Object, default:() => {} , require: true},
            disabled: {default: false, type: Boolean},
        },

        data() {
            return {}
        },

        computed: {
            // 第一级for循环可以引用的变量
            iterationRelLevel1(){
                return this.pArrIterationRelVarList.filter(item => item.varType === 'array');
            },

            // 第二级for循环可以引用的变量
            iterationRelLevel2(){
                let result = [];
                let varHandleList = this.pArrIteration.getVarHandleListLevel1().filter(item=> item.varType === 'array').map(item=>new VarHandle(item));
                result.push(...varHandleList);
                result.push(...this.pArrIterationRelVarList.filter(item => item.varType === 'array'));
                return this.duplicateByVarName(result);
            },

            // 第一级过滤可以引用的变量
            filterCodeRelLevel1(){
                let result = [];
                result.push(...this.pArrIteration.getVarHandleListLevel1());
                result.push(...this.pArrIterationRelVarList.filter(item => !["array", "object"].includes(item.varType)));
                return this.duplicateByVarName(result);
            },

            // 第二级过滤可以引用的变量
            filterCodeRelLevel2(){
                let result = [];
                result.push(...this.pArrIteration.getVarHandleListLevel1());
                result.push(...this.pArrIteration.getVarHandleListLevel2());
                result.push(...this.pArrIterationRelVarList.filter(item => !["array", "object"].includes(item.varType)));
                return this.duplicateByVarName(result);
            },

            // 第一级聚合可以引用的变量
            groupByCodeRelLevel1(){
                let result = [];
                result.push(new DrlVar({varName: "item1"}));
                result.push(...this.pArrIteration.getVarHandleListLevel1());
                result.push(...this.pArrIterationRelVarList);
                return this.duplicateByVarName(result);
            },

            // 第二级聚合可以引用的变量
            groupByCodeRelLevel2(){
                let result = [];
                result.push(new DrlVar({varName: "item1"}));
                result.push(new DrlVar({varName: "item2"}));
                result.push(...this.pArrIteration.getVarHandleListLevel1());
                result.push(...this.pArrIteration.getVarHandleListLevel2());
                result.push(...this.pArrIterationRelVarList);
                return this.duplicateByVarName(result);
            },

            // 统计可以引用的变量
            statisticsCodeRel(){
                let result = [];
                result.push(...this.pArrIteration.getGroupByListLevel1());
                result.push(...this.pArrIteration.getGroupByListLevel2());
                result.push(...this.pArrIterationRelVarList);
                return this.duplicateByVarName(result);
            },

            // 变量处理一级可以引用的变量
            varHandleCodeRelLevel1(){
                let result = [];
                result.push(new DrlVar({varName: "item1"}));
                result.push(...this.pArrIterationRelVarList);
                return this.duplicateByVarName(result);
            },

            // 变量处理二级可以引用的变量
            varHandleCodeRelLevel2(){
                let result = [];
                result.push(new DrlVar({varName: "item1"}));
                result.push(new DrlVar({varName: "item2"}));
                result.push(...this.pArrIteration.getVarHandleListLevel1());
                result.push(...this.pArrIterationRelVarList);
                return this.duplicateByVarName(result);
            },

            // 结果返回可以引用的变量
            resultListRelLevel() {
                let result = [];
                result.push(...this.pArrIteration.getVarHandleListLevel1());
                result.push(...this.pArrIteration.getVarHandleListLevel2());
                result.push(...this.pArrIteration.getGroupByListLevel1());
                result.push(...this.pArrIteration.getGroupByListLevel2());
                result.push(...this.pArrIteration.getStatisticsList());
                // 去重
                return this.duplicateByVarName(result);
            }

        },

        methods: {

            // 根据字段名去重
            duplicateByVarName(arr){
                let result = [];
                let varNameList = new Set();
                result = arr.filter(item => {
                    if (isEmpty(item.getPrefixVarName()) || isEmpty(item.varName)) return false;
                    if (varNameList.has(item.getPrefixVarName())) {
                        return false;
                    } else {
                        varNameList.add(item.getPrefixVarName());
                        return true;
                    }
                });
                return result;
            },


            init(){
                let that = this;
                that.$nextTick(()=>{
                    let level1Arr = [];
                    if (that.pArrIteration.iterationCode.varHandleCode.isHave) level1Arr.push("变量处理");
                    if (that.pArrIteration.iterationCode.filterCode.isHave) level1Arr.push("过滤");
                    if (that.pArrIteration.iterationCode.groupByCode.isHave) level1Arr.push("聚合");
                    if (that.pArrIteration.iterationCode.statisticsCode.isHave) level1Arr.push("统计");
                    if (that.pArrIteration.iterationCode.iterationCode.isHave) level1Arr.push("循环");

                    if (that.$refs.checkBoxLevel1 !== undefined){
                        that.$refs.checkBoxLevel1.setCheckedCodeNo(level1Arr);
                    }

                    that.$nextTick(()=>{
                        let level2Arr = [];
                        if (that.pArrIteration.iterationCode.iterationCode.varHandleCode.isHave) level2Arr.push("变量处理");
                        if (that.pArrIteration.iterationCode.iterationCode.filterCode.isHave) level2Arr.push("过滤");
                        if (that.pArrIteration.iterationCode.iterationCode.groupByCode.isHave) level2Arr.push("聚合");


                        if (that.$refs.checkBoxLevel21 !== undefined){
                            that.$refs.checkBoxLevel21.setCheckedCodeNo(level2Arr);
                        }

                        if (that.$refs.checkBoxLevel22 !== undefined){
                            that.$refs.checkBoxLevel22.setCheckedCodeNo(level2Arr);
                        }
                    });
                });
            },

            codeIsShow(name) {
                let that = this;
                switch (name) {
                    case 'varHandle':
                        return that.pArrIteration.iterationCode.varHandleCode.isHave;

                    case 'filter':
                        return that.pArrIteration.iterationCode.filterCode.isHave;
                    case 'filter-groupBy':
                        return that.pArrIteration.iterationCode.groupByCode.isHave;
                    case 'filter-iteration':
                        return that.pArrIteration.iterationCode.iterationCode.isHave;
                    case 'filter-iteration-varHandle':
                        return that.pArrIteration.iterationCode.iterationCode.varHandleCode.isHave;
                    case 'filter-iteration-filter':
                        return that.pArrIteration.iterationCode.iterationCode.filterCode.isHave;
                    case 'filter-iteration-filter-groupBy':
                        return that.pArrIteration.iterationCode.iterationCode.filterCode.isHave && that.pArrIteration.iterationCode.iterationCode.groupByCode.isHave;
                    case 'filter-iteration-groupBy':
                        return !that.pArrIteration.iterationCode.iterationCode.filterCode.isHave && that.pArrIteration.iterationCode.iterationCode.groupByCode.isHave;

                    case 'noFilter':
                        return !that.pArrIteration.iterationCode.filterCode.isHave;
                    case 'noFilter-iteration':
                        return that.pArrIteration.iterationCode.iterationCode.isHave;
                    case 'noFilter-iteration-varHandle':
                        return that.pArrIteration.iterationCode.iterationCode.varHandleCode.isHave;
                    case 'noFilter-iteration-groupBy':
                        return !that.pArrIteration.iterationCode.iterationCode.filterCode.isHave && that.pArrIteration.iterationCode.iterationCode.groupByCode.isHave;
                    case 'noFilter-iteration-filter':
                        return that.pArrIteration.iterationCode.iterationCode.filterCode.isHave;
                    case 'noFilter-iteration-filter-groupBy':
                        return that.pArrIteration.iterationCode.iterationCode.filterCode.isHave && that.pArrIteration.iterationCode.iterationCode.groupByCode.isHave;

                    case 'groupBy':
                        return !that.pArrIteration.iterationCode.filterCode.isHave && that.pArrIteration.iterationCode.groupByCode.isHave;
                    case 'statistics':
                        return that.pArrIteration.iterationCode.statisticsCode.isHave;
                    default:
                        throw new Error("未知类型")

                }
            },

            handleCheckedCodeChangeLevel2(value) {
                this.pArrIteration.iterationCode.iterationCode.varHandleCode.isHave = false;
                this.pArrIteration.iterationCode.iterationCode.filterCode.isHave = false;
                this.pArrIteration.iterationCode.iterationCode.groupByCode.isHave = false;
                if (value.includes("变量处理")) this.pArrIteration.iterationCode.iterationCode.varHandleCode.isHave = true;
                if (value.includes("过滤")) this.pArrIteration.iterationCode.iterationCode.filterCode.isHave = true;
                if (value.includes("聚合")) this.pArrIteration.iterationCode.iterationCode.groupByCode.isHave = true;
            },


            handleCheckedCodeChangeLevel1(value) {
                this.pArrIteration.iterationCode.varHandleCode.isHave = false;
                this.pArrIteration.iterationCode.filterCode.isHave = false;
                this.pArrIteration.iterationCode.groupByCode.isHave = false;
                this.pArrIteration.iterationCode.statisticsCode.isHave = false;
                this.pArrIteration.iterationCode.iterationCode.isHave = false;
                if (value.includes("变量处理")) this.pArrIteration.iterationCode.varHandleCode.isHave = true;
                if (value.includes("过滤")) this.pArrIteration.iterationCode.filterCode.isHave = true;
                if (value.includes("聚合")) this.pArrIteration.iterationCode.groupByCode.isHave = true;
                if (value.includes("统计")) this.pArrIteration.iterationCode.statisticsCode.isHave = true;
                if (value.includes("循环")) this.pArrIteration.iterationCode.iterationCode.isHave = true;
            }
        }
    }
</script>

<style scoped>
    .logic-box {
        /*height: 500px;*/
        border-radius: 4px;
        border: 2px solid #a9a9a9;
        font-size: 16px;
        /*line-height: 30px;*/
        /*font-family: "Helvetica Neue", serif;*/
    }

    .iteration-contain {
        padding-left: 40px;
    }

    .varHandle-contain {
        padding-left: 40px;
    }

    .filter-contain {
        padding-left: 40px;
    }

    .groupBy-contain {
        padding-left: 40px;
    }

    .statistics-contain {
        padding-left: 40px;
    }

    .check-box-code-contain {
        padding-left: 40px;
    }

    .resultList-contain {
        margin-top: 10px;
    }


</style>
