<template>
    <div id="decsHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <decs-tables-new></decs-tables-new>
        </template>
    </div>
</template>

<script>
    import DecsTablesNew from "../decs/DecsTablesNew";
    export default {
        name: "DecsHomeNew",
        components: {DecsTablesNew},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '决策首页';
            },
        },
    }
</script>

<style scoped>
    @import "index.css";
    @import '../common/index.css';
</style>
