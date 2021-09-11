<template>
    <div>
<!--      <el-button class="help" @click="tohelper" >help</el-button>-->
      <a @click="tohelper" class="help2">帮助文档</a>
    </div>
</template>

<script>
    export default {
        name: "index",
      methods:{
        tohelper(){
          window.open(this.helper.helpUri.uri,"_blank")
        }
      }
    }
</script>

<style scoped>
  .help{
    background-color: #8b8b8b;
    height: 50px;

  }
  .help2{
    margin-right: 15px;
    height: 50px;
    color: lightseagreen;
    font-weight: bold;
    font-size: 15px;
  }


</style>
