<template>
  <div class="frame-div">
    <my-iframe subAppName="TcsVarsFrontApp" subAppUrl="/datasource"></my-iframe>
  </div>
</template>

<script>
  import MyIframe from '@/components/MyIframe'
  export default {
    name: 'data-source-manage',
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
