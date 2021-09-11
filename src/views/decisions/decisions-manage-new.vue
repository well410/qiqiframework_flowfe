<template>
  <div class="frame-div">
    <my-iframe subAppName="TcsDecsFrontApp" subAppUrl="/ui/decsManageNew" :routeName="routeName"></my-iframe>
  </div>
</template>

<script>
  import MyIframe from '@/components/MyIframe'
  export default {
    name: 'decisions-manage-new',
    components: {
      MyIframe
    },
    data() {
      return {
        routeName: "",
      }
    },
    mounted() {
      this.routeName = this.$route.name;
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
