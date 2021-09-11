<template>
    <div id="decsHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <decs-tables></decs-tables>
        </template>
    </div>
</template>

<script>
    import DecsTables from "../decs/DecsTables";
    export default {
        name: "DecsHome",
        components: {DecsTables},
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
