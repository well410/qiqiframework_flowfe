<template>
    <div id="modelComponentsHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <el-card :body-style="{padding: '0'}">
                <model-interface></model-interface>
            </el-card>
        </template>
    </div>
</template>

<script>
    import ModelInterface from "../model-interface/model-interface.vue";
    export default {
        name: "ModelComponentsHome",
        components: {ModelInterface},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '模型组件首页';
            },
        },
    }
</script>

<style scoped>
    @import "index.css";
    @import '../common/index.css';
</style>