<template>
    <div :style="`position: fixed;left: ${computeX};top: ${computeY};z-index:100;`">
        <el-card>
            <el-form class="itemClass" ref="form1" size="mini" label-width="80px" v-if="isNotEmpty(cNode.id)">
                <el-form-item label="决策Id" v-show="cNode.ruleOrDecs=='DECS' && !cNode.hasVersion">{{cNode.decsOrRuleId}}</el-form-item>
                <el-form-item label="决策名" v-show="cNode.ruleOrDecs=='DECS' && !cNode.hasVersion">{{cNode.ruleOrDecsName}}</el-form-item>
                <el-form-item label="决策Id" v-show="cNode.ruleOrDecs=='DECS' && cNode.hasVersion">{{cNode.decsOrRuleId}}</el-form-item>
                <el-form-item label="决策名" v-show="cNode.ruleOrDecs=='DECS' && cNode.hasVersion">{{cNode.ruleOrDecsName}}</el-form-item>
                <el-form-item label="决策版本" v-show="cNode.ruleOrDecs=='DECS' && cNode.hasVersion">{{cNode.ruleOrDecsDescription}}</el-form-item>

                <el-form-item label="规则Id" v-show="cNode.ruleOrDecs=='RULE' && cNode.hasVersion">{{cNode.decsOrRuleId}}</el-form-item>
                <el-form-item label="规则名" v-show="cNode.ruleOrDecs=='RULE' && cNode.hasVersion">{{cNode.ruleOrDecsName}}</el-form-item>
                <el-form-item label="规则版本" v-show="cNode.ruleOrDecs=='RULE' && cNode.hasVersion">{{cNode.ruleOrDecsDescription}}</el-form-item>
                <el-form-item label="规则Id" v-show="cNode.ruleOrDecs=='RULE' && !cNode.hasVersion">{{cNode.decsOrRuleId}}</el-form-item>
                <el-form-item label="规则名" v-show="cNode.ruleOrDecs=='RULE' && !cNode.hasVersion">{{cNode.ruleOrDecsName}}</el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import {isEmpty, isNotEmpty} from "../../utils";

    export default {
        name: "citationTooltip",
        props: {
            // 传入的节点
            cNode: {
                type: Object, default: () => {}
            },
            // 传入的位置
            cPoint: {
                type: Object, default: () => {},
            }

        },
        computed: {
            computeX() {
                if (isEmpty(this.cPoint)) {
                    return 0;
                } else {
                    return this.cPoint.x +  "px";
                }
            },

            computeY() {
                if (isEmpty(this.cPoint)) {
                    return 0;
                } else {
                    return this.cPoint.y + 50 + "px";
                }
            }
        },
        methods: {
        },
    }
</script>

<style scoped>
.itemClass .el-form-item--mini.el-form-item{
    margin-bottom: 0px;
}
.itemClass .el-form-item__label{
    text-align: left;
}
</style>
