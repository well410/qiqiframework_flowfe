<template>
  <div class="router_view_container" id="router_view_container">
    <!-- Vue的router-view -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <!-- iframe页 -->
    <component v-for="item in hasOpenComponentsArr" :key="item.name" :is="item.name" :id="item.name"
               v-show="$route.path.substring($route.path.lastIndexOf('/') + 1) === item.path">
    </component>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'iframeRouterView',
    created() {
      // 根据路由配置以及属性信息，初始化含有iframe的路由数组对象
      let componentsArr = this.getComponentsArr();
      componentsArr.forEach((item) => {
        Vue.component(item.name, item.component);
      });
      this.componentsArr = componentsArr;
      // 判断当前路由是否含有iframe，且如果是第一次进入该路由，还要设置标志位isOpen为true
      this.setIsOpenTrueOfIframePage();
      // this.$root.eventHub.$on('closeAllTags', this.closeAllTags);
      this.$root.eventHub.$on('closeSelectedTag', this.closeOneTag)
      // this.$root.eventHub.$on('closeOtherTags', this.closeOtherTags)
    },
    data() {
      return {
        componentsArr: [],  //含有iframe的页面
        oldTagNavList: []
      }
    },
    watch: {
      '$route'() {
        // 判断当前路由是否iframe页
        if(this.oldTagNavList.includes(this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1))){
          console.log("当前路由在缓存列表当中：" + this.oldTagNavList)
          this.setIsOpenFalseOfIframePage(this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1));
          setTimeout(()=>{
            this.setIsOpenTrueOfIframePage();
            this.deleteFromOldTagNavList(this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1));
            console.log("更新后的缓存列表：" + this.oldTagNavList)
          },1000);
        }else{
          this.setIsOpenTrueOfIframePage();
        }
        //this.setIsOpenTrueOfIframePage();
      }
    },
    computed: {
      // 实现懒加载，已经打开过（hasOpen:true）的iframe页后续使用v-show
      hasOpenComponentsArr() {
        return this.componentsArr.filter(item => item.hasOpen);
      }
    },
    methods: {
      /**
       *判断一个对象是否为空
       */
      isEmpty (obj) {
        if (obj === undefined || obj === null || obj === ''){
          return true
        }
        return false
      },
      deleteFromOldTagNavList(name){
        for (let i in this.oldTagNavList) {
          if(this.oldTagNavList[i] === name){
            this.oldTagNavList.splice(i,1);
          }
        }
      },
      /*关闭所有的导航页签*/
      closeAllTags() {
        this.componentsArr.splice(0);
        this.componentsArr = JSON.parse(JSON.stringify(this.getComponentsArr()));
      },
      /*关闭某一个导航页签：route为要关闭的路由*/
      closeOneTag(route) {
        this.setIsOpenFalseOfIframePage(route.name)
      },
      /*关闭其他导航页签：route为仅保留的路由*/
      closeOtherTags(route) {
        //缓存那些被点击关闭其他这个按钮所关闭的页签的名字
        for (let i in this.hasOpenComponentsArr) {
          if(this.hasOpenComponentsArr[i].name !== route.name && !this.oldTagNavList.includes(this.hasOpenComponentsArr[i].name)){
            this.oldTagNavList.push(this.hasOpenComponentsArr[i].name);
          }
        }
        /*搞不懂为啥这样写不行，抑郁了，感觉可能跟渲染机制有关，崩溃*/
        /*
        this.componentsArr.splice(0);
        this.componentsArr = JSON.parse(JSON.stringify(this.getComponentsArr()));
        this.setIsOpenTrueOfIframePage(route.name);*/
      },
      /*根据入参的路由信息设置hasOpen为false*/
      setIsOpenFalseOfIframePage(name) {
        let target = this.componentsArr.find(item => {
          return item.path === name
        });
        if (target && target.hasOpen) {
          target.hasOpen = false;
        }
      },
      /*根据当前路由设置hasOpen为true*/
      setIsOpenTrueOfIframePage(name) {
        let target = this.componentsArr.find(item => {
          return item.path === (this.isEmpty(name) ? this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1) : name);
        });
        if (target && !target.hasOpen) {
          target.hasOpen = true;
        }
      },
      /*遍历路由的所有页面，把含有iframeComponent标识的收集起来，并初始化所有的isOpen为false*/
      getComponentsArr() {
        let routes = this.$router.options.routes;
        //获取所有的叶子节点菜单
        let leafRoutes = this.getAllLeaf(routes);
        //过滤出所有有iframe的菜单路由
        let iframeArr = leafRoutes.filter(item => item.iframeComponent);
        return iframeArr.map((item) => {
          const name = item.name || item.path.replace('/', '');
          return {
            name: name,
            path: item.path,
            hasOpen: false,                  // 是否打开过，默认false
            component: item.iframeComponent  // 组件文件的引用
          };
        });
      },
      /*JS递归树结构查找所有叶子节点*/
      getAllLeaf: function (data) {
        let result = []
        function getLeaf(data) {
          data.forEach(item => {
            if (!item.children) {
              result.push(item)
            } else {
              getLeaf(item.children)
            }
          })
        }
        getLeaf(data)
        return result
      }
    }
  }
</script>

<style type="less">
  .router_view_container {
    height: 100%;
  }
</style>
