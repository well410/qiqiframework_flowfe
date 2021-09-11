<template>
    <div id="adapterHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <adapter-tables></adapter-tables>
        </template>
    </div>
</template>

<script>
    import AdapterTables from "../adapter/AdapterTables";
    export default {
        name: "AdapterHome",
        components: {AdapterTables},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '业务适配首页';
            },
        },
    }
</script>

<style scoped>
    @import "index.css";
    @import '../common/index.css';
</style>
