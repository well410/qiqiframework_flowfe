<template>
  <div class="frame-div">
    <my-iframe subAppName="TcsMonitorFrontApp" subAppUrl="/tcsmonitor/tps_display/decs_cnt_display"></my-iframe>
  </div>
</template>

<script>
  import MyIframe from '@/components/MyIframe'
  export default {
    name: 'decs-cnt-display',
    components: {
      MyIframe
    }
  }
</script>

<style scoped lang="scss">
  .my-container {
    margin: 20px
  }
</style>
