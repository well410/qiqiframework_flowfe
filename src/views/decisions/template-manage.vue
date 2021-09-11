<template>
  <div class="frame-div">
    <my-iframe subAppName="TcsDecsFrontApp" subAppUrl="/ui/templateManage"></my-iframe>
  </div>
</template>

<script>
import MyIframe from '@/components/MyIframe'
export default {
  name: 'template-manage',
  components: {
    MyIframe
  }
}
</script>

<style scoped lang="scss">
  .my-container {
    margin: 20px
  }
  .frame-div {
    width: 100%;
    height: calc(100vh - 85px);
  }
</style>
