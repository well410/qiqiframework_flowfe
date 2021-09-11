<template>
    <div id="decsGropHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <decs-group-tables></decs-group-tables>
        </template>
    </div>
</template>

<script>
    import DecsGroupTables from "../decsgroup/DecsGroupTables";
    export default {
        name: "DecsGroupHome",
        components: {DecsGroupTables},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '决策组首页';
            },
        },
    }
</script>

<style scoped>

</style>
