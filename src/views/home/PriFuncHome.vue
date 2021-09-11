<template>
    <div id="priFuncHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <pri-func-list></pri-func-list>
        </template>
    </div>
</template>

<script>
    import PriFuncList from "../funclist/PriFuncList";
    export default {
        name: "PriFuncHome",
        components: {PriFuncList},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '私有函数首页';
            },
        },
    }
</script>

<style scoped>
</style>
