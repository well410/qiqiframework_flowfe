<template>
    <div id="kafkaComponentsHome">
        <router-view></router-view>

        <template v-if="isShowComp">
            <el-card :body-style="{padding: '0'}">
                <kafka-interface></kafka-interface>
            </el-card>
        </template>
    </div>
</template>

<script>
    import KafkaInterface from "../kafka-interface/kafka-interface.vue";
    export default {
        name: "KafkaComponentsHome",
        components: {KafkaInterface},
        computed: {
            isShowComp() {
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === 'KAFKA组件首页';
            },
        },
    }
</script>

<style scoped>
    @import "index.css";
    @import '../common/index.css';
</style>
