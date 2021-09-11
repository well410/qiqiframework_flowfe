<template>
  <div class="frame-div">
    <my-iframe subAppName="TcsMonitorFrontApp" subAppUrl="/tcsmonitor/code_display/decs_node_error_code_display"></my-iframe>
  </div>
</template>

<script>
  import MyIframe from '@/components/MyIframe'
  export default {
    name: 'decs-node-error-code-display',
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
