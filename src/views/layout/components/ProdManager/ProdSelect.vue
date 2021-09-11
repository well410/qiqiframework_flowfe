<template>
  <el-select placeholder="产品切换" v-model="selectProd" style="width: 120px;" @change="prodChange" :loading="allProd.length < 1" size="small">
    <el-option v-for="prod in allProd" :label="prod" :key="prod" :value="prod"></el-option>
  </el-select>
</template>

<script>
  import { changeUserProdId, getUserProdId } from '../../../../api/prod-manager'

  export default {
    name: 'ProdSelect',
    data() {
      return {
        selectProd: '',
        // prodTest: ['lu88', 'll53']
      }
    },
    props: {
      allProd: { type: Array, default: () => [] }    // 所有可供选择的产品id
    },

    methods: {
      prodChange() {
        let that = this
        console.info('更改当前用户产品Id')
        changeUserProdId(that.selectProd).then(res => {
          if (res.data) {
            that.$message({message: '产品切换成功', type: 'success'});
          } else {
            that.$message({message: '产品切换失败,请刷新页面重试，或者检查是否拥有该产品权限', type: 'error'});
          }
        })
      },

      getUserProdId() {
        let that = this
        console.info('查询当前用户的所属产品Id')
        getUserProdId().then(res => {
          that.selectProd = res.data;
        })
      }
    },

    mounted() {
      this.getUserProdId();
    }

  }
</script>

<style scoped>

</style>
