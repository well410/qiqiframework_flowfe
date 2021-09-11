<template>
  <div class="frame-div">
    <my-iframe subAppName="TcsTimerFrontApp" subAppUrl="/"></my-iframe>
  </div>
</template>

<script>
  import MyIframe from '@/components/MyIframe'

  export default {
    name: "timer-manage",
    components: {
      MyIframe
    }
  }
</script>

<style scoped>
  .my-container {
    margin: 20px
  }
  .frame-div {
    width: 100%;
    height: calc(100vh - 85px);
  }
</style>
