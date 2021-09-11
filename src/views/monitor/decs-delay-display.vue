<template>
  <div class="frame-div">
    <my-iframe subAppName="TcsMonitorFrontApp" subAppUrl="/tcsmonitor/delay_display/decs_delay_display"></my-iframe>
  </div>
</template>

<script>
  import MyIframe from '@/components/MyIframe'
  export default {
    name: 'decs-delay-display',
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
