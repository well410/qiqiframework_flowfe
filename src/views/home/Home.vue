<template>
    <div id="home">
        <router-view></router-view>
        <template v-if="isShowComp">
            <!--<el-card>-->
                <!--<div style="display: flex;justify-content: space-between">-->
                    <!--<span>组件平台</span>-->
                <!--</div>-->
            <!--</el-card>-->
            <el-tabs :active-name="activeName" @tab-click="handleClick" type="border-card">
                <el-tab-pane label="HTTP接口" :name="tabType.httpInterface"><http-interface :ref="tabType.httpInterface"></http-interface></el-tab-pane>
                <el-tab-pane label="KAFKA接口" :name="tabType.kafkaInterface"><kafka-interface :ref="tabType.kafkaInterface"></kafka-interface></el-tab-pane>
                <el-tab-pane label="模型接口" :name="tabType.modelInterface"><model-interface :ref="tabType.modelInterface"></model-interface></el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
    import {Prod} from "../../entity/prod";
    import HttpInterface from "../http-interface/http-interface.vue";
    import KafkaInterface from "../kafka-interface/kafka-interface.vue";
    import ModelInterface from "../model-interface/model-interface.vue";
    import {tabType, store} from "../common/common.js";
    import {isEmpty} from "../../utils/tools";

    export default {
        name: 'Home',
        components: {HttpInterface, KafkaInterface, ModelInterface},
        data () {
            return {
                activeName: tabType.httpInterface,
                prod: new Prod(),
                tabType: tabType,
                sharedState: store.state
            };
        },

        computed: {
            isShowComp () {
                //数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。(路由相关内容为在router.js文件中配置的内容)
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '组件平台';
            },
        },

        mounted () {
            this.initData();
            this.parseRouter();
        },

        methods: {
            handleClick (tab, event) {
                store.setTabAction(tab.name);
            },

            parseRouter (){
                if (!this.isShowComp) return;
                // this.activeName = this.$route.query['tab'] === undefined ? tabType.httpInterface : this.$route.query['tab'];
                this.activeName = isEmpty(this.sharedState.tab) ? tabType.httpInterface : this.sharedState.tab;
            },

            initData () {
                // this.prod.prodId = this.$route.query['prodId'] === undefined ? '' : this.$route.query['prodId'];
                // 临时方案，一个用户只能有一个产品
                this.prod.prodId = this.gConfig.prodId.value;
            },

        },
        watch: {
            '$route' () {
                if (this.$route['name'] === 'Home') {
                    this.activeName = isEmpty(this.sharedState.tab) ? tabType.httpInterface : this.sharedState.tab;
                    // this.$refs[this.activeName].init;
                }
            }
        }
    }
</script>

<style scoped>
    @import "index.css";
    @import '../common/index.css';
</style>
