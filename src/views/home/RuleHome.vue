<template>
    <div id="RuleHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <rule-tables></rule-tables>
        </template>
    </div>
</template>

<script>
    import RuleTables from "../rule/RuleTables";
    export default {
        name: "RuleHome",
        components: {RuleTables},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '规则首页';
            },
        },
    }
</script>

<style scoped>
    @import "index.css";
    @import '../common/index.css';
</style>
