<template>
    <div id="httpComponentsHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <el-card :body-style="{padding: '0'}">
                <http-interface></http-interface>
            </el-card>
        </template>
    </div>
</template>

<script>
    import HttpInterface from "../http-interface/http-interface.vue";
    export default {
        name: "HttpComponentsHome",
        components: {HttpInterface},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === 'HTTP组件首页';
            },
        },
    }
</script>

<style scoped>
    @import "index.css";
    @import '../common/index.css';
</style>
