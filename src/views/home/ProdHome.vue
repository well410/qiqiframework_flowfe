<template>
    <div id="home">
        <router-view/>
        <template v-if="isShowComp">
            <prod-manage :ref="tabType.prodmanageBase"></prod-manage>
<!--            <timer-base :ref="tabType.timerBase"></timer-base>-->
        </template>
    </div>
</template>

<script>
    import {tabType} from "../common";
    import ProdManage from "../prod-manage/ProdManage";

    export default {
        name: "ProdHome",

        components: {
            ProdManage,
        },

        data() {
            return {
                activeName: tabType.prodmanageBase,
                tabType: tabType,
            }
        },

        computed: {
            isShowComp () {
                //数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。(路由相关内容为在router.js文件中配置的内容)
                let matched = this.$route.matched;
                return matched[matched.length - 1].meta.title === '首页';
            },
        },

        mounted() {
          this.parseRouter();
        },

        methods: {
            handleClick(tab, event) {
                // tab.name点击的标签
                this.activeName = tab.name;
                // 初始化标签对应的页面（组件）数据
                // this.$refs[tab.name].init()
                console.log(tab, event);
            },

            parseRouter(){
                let that = this;
                if(!that.isShowComp) return;
                that.activeName = that.$route.query['tab'] === undefined ? tabType.timerBase : that.$route.query['tab'];
                // 初始化标签对应的页面
                // that.$refs[that.activeName].init()
            },


        },
    }
</script>

<style scoped>

</style>
