<template>
  <div class="frame-div">
    <my-iframe subAppName="TcsFuncFrontApp" subAppUrl="/priFuncHome"></my-iframe>
  </div>
</template>

<script>
import MyIframe from '@/components/MyIframe'
export default {
  name: 'functions',
  components: {
    MyIframe
  }
}
</script>

<style lang="scss">
  .frame-div {
    width: 100%;
    height: calc(100vh - 85px);
  }
</style>
