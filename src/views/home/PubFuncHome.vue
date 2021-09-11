<template>
    <div id="priFuncHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <pub-func-list></pub-func-list>
        </template>
    </div>
</template>

<script>
    import PubFuncList from "../funclist/PubFuncList";
    export default {
        name: "PriFuncHome",
        components: {PubFuncList},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '公有函数首页';
            },
        },
    }
</script>

<style scoped>
</style>
