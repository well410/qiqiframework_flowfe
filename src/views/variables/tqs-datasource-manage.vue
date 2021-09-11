<template>
  <div class="frame-div">
    <my-iframe subAppName="TqsDatasourceFrontApp" subAppUrl="/tqsDatasource"></my-iframe>
  </div>
</template>

<script>
    import MyIframe from '@/components/MyIframe'
    export default {
        name: 'tqs-datasource-manage',
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
