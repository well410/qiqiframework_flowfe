<template>
  <div class="frame-div">
      <my-iframe subAppName="TcsCmptFrontApp" subAppUrl="/http-components-manage"></my-iframe>
  </div>
</template>

<script>
import MyIframe from '../../components/MyIframe';
export default {
  name: 'HttpComponentsManage',
  components: {MyIframe}
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
