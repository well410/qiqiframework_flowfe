<template>
    <el-card v-if="clickNodeEntity.isShow">
        <div slot="header" class="clearfix">
            <span v-if="clickNodeEntity.type === entityEnums.DECS.code">
                <span style="margin-right: 5px">决策id:{{clickNodeEntity.decs.decsId}}</span>
                <el-divider direction="vertical"></el-divider>
                <span style="margin-left: 5px" v-if="clickNodeEntity.decs.decsVersion">决策版本:{{clickNodeEntity.decs.decsVersion}}</span>
            </span>
            <span v-if="clickNodeEntity.type === entityEnums.RULE.code">
                <span style="margin-right: 5px">规则id:{{clickNodeEntity.rule.ruleId}}</span>
                <el-divider direction="vertical"></el-divider>
                <span style="margin-left: 5px" v-if="clickNodeEntity.rule.ruleVersion">规则版本:{{clickNodeEntity.rule.ruleVersion}}</span>
            </span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="clickNodeEntity.isShow = false">关闭</el-button>
        </div>
        <div>
            <decs-show ref="decsShow" v-if="clickNodeEntity.type === entityEnums.DECS.code" :p-decs="clickNodeEntity.decs" :p-type="tabType.decsCitation"></decs-show>
            <rule-show ref="ruleShow" v-if="clickNodeEntity.type === entityEnums.RULE.code" :p-rule="clickNodeEntity.rule" :p-type="tabType.ruleCitation"></rule-show>
        </div>
    </el-card>
</template>

<script>
    import RuleShow from "../rule/rule-components/RuleShow";
    import DecsShow from "../decs/decs-components/DecsShow";
    import {entityEnums, tabType} from "../../entity/enumns";
    export default {
        name: "CitationGraphShow",
        components: {RuleShow, DecsShow},
        data() {
            return {
                clickNodeEntity: {type : null, decs : null, rule : null, isShow : false},
                entityEnums: entityEnums,
                tabType: tabType,
            }
        },
        methods:{
            init(input){
                Object.assign(this.clickNodeEntity, input);
                this.$nextTick(()=>{
                    this.$refs.decsShow && this.$refs.decsShow.init();
                    this.$refs.ruleShow && this.$refs.ruleShow.init();
                })
            }
        }
    }
</script>

<style scoped>

</style>
