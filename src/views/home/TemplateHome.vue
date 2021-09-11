<template>
    <div id="templateHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <template-tables></template-tables>
        </template>
    </div>
</template>

<script>
    import TemplateTables from "../template/TemplateTables";
    export default {
        name: "TemplateHome",
        components: {TemplateTables},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '模板首页';
            },
        },
    }
</script>

<style scoped>
    @import "index.css";
    @import '../common/index.css';
</style>
