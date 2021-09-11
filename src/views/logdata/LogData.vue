<template>
    <div id="LogData">
        <router-view></router-view>
        <template v-if="isShowComp">
            <log-data-table></log-data-table>
        </template>
    </div>
</template>

<script>
    import LogDataTable from "../../components/logdata/LogDataTable";

    export default {
        name: 'LogData',
        components: {LogDataTable},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '数据管理首页';
            },
        }


    }
</script>

<style scoped>
    @import "index.css";
    @import '../common/index.css';
</style>
