<template>
  <div class="frame-div">
    <my-iframe subAppName="TcsVarsFrontApp" subAppUrl="/vars"></my-iframe>
  </div>
</template>

<script>
  import MyIframe from '@/components/MyIframe'

  export default {
    name: 'variables-manage',
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
