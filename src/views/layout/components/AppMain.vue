<template>
  <section class="app-main">
    <!--<transition name="fade-transform" mode="out-in">
      &lt;!&ndash; or name="fade" &ndash;&gt;
      &lt;!&ndash; <router-view :key="key"></router-view> &ndash;&gt;
      <router-view/>
    </transition>-->
    <keep-alive>
      <iframe-router-view/>
    </keep-alive>
  </section>
</template>

<script>
import IframeRouterView from '@/components/MyIframe/iframe-router-view.vue'
export default {
  name: 'AppMain',
  components: {
    IframeRouterView
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 84px);
  position: relative;
  overflow: hidden;
  background-image: url('~@/assets/bg-img.png');
  /*background-image: url('~@/assets/blur-bg.jpg');*/
  background-color: rgba(225, 225, 225, 0.8);
}
</style>
