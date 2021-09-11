<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
      <breadcrumb/>
      <div class="right-menu">
        <Helper />
      </div>

      <div class="right-menu">
        <!--    预留出产品切换的插槽-->
        <template>
          <prod-select id="prod-select" class="right-menu-item" :all-prod="curAllProd"></prod-select>
        </template>

        <template>
          <a @click="versionReport" class="right-menu-item-color">版本公告</a>
        </template>

        <!--    个人下拉框-->
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <el-badge :value="curMessageUnreadCount" class="item">
            <div class="avatar-wrapper">
              <img src="../../../assets/401_images/401.gif" class="user-avatar">
              <i class="el-icon-caret-bottom"/>
            </div>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/profile/index">
              <el-dropdown-item>
                {{ '个人中心' }}
              </el-dropdown-item>
            </router-link>
            <router-link to="/">
              <el-dropdown-item>
                {{ '首页' }}
              </el-dropdown-item>
            </router-link>
            <!--          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">-->
            <!--            <el-dropdown-item>-->
            <!--              {{ $t('navbar.github') }}-->
            <!--            </el-dropdown-item>-->
            <!--          </a>-->
            <!--          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">-->
            <!--            <el-dropdown-item>Docs</el-dropdown-item>-->
            <!--          </a>-->
            <!--          <el-dropdown-item divided @click.native="logout">-->
            <!--            <span style="display:block;">{{ '退出登录' }}</span>-->
            <!--          </el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <el-dialog :visible.sync="versionReportDialog.dialog" :close-on-click-modal="false" class="text-font-family new-dialog">
      <div slot="title">
        <div class="clearfix" style="width: 97%;">
          <div class="dialog-title">{{versionReportDialog.title}}
          </div>
        </div>
      </div>
      <VersionReport
        ref="versionReportForm"
        :dialogTitle="versionReportDialog.title"
        :dialogFormVisible="versionReportDialog.dialog">
        <!--          v-on:visibleChange="onVisibleChangeEdit($event)">-->
      </VersionReport>
    </el-dialog>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ProdSelect from './ProdManager/ProdSelect'
  import { getAllProdId } from '../../../api/prod-manager'
  import Helper from '@/components/Helper'
  import VersionReport from './versionReport/VersionReport'

  export default {
    data() {
      return {
        curAllProd: [],
        updateLog: '',
        versionReportDialog: {dialog: false, title: "版本公告"},
        // avatar: '@/assets/404_images/404.png',
      }
    },
    components: {
      VersionReport,
      ProdSelect,
      Breadcrumb,
      Hamburger,
      Helper
      // ProdSelect,
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'curMessageUnreadCount',
      ]),
    },
    methods: {
      ...mapActions([
        'getUnreadMessageCount'
      ]),
      // getUnreadMessageCount() {
      //   this.$store.dispatch('message/getUnreadMessageCount')
      // },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },
      // 获取所有产品
      getAllProd() {
        let that = this;
        that.curAllProd = [];
        // TODO: 后端接口
        getAllProdId().then(res => {
          that.curAllProd = res.data;
        })
      },
      refreshNum() {
        setInterval(() => {
          this.getUnreadMessageCount();
        }, 1000 * 60)
      },

      //版本公告弹窗
      versionReport() {
        let that = this;
        that.versionReportDialog.dialog = true;
        that.$nextTick(() => {
          that.$refs['versionReportForm'].init();
        });


      },
    },
    mounted() {
      // 获取未读消息条数
      // this.$store.dispatch('message/getUnreadMessageCount')
      this.getUnreadMessageCount();
      this.getAllProd();
      this.refreshNum();
    }
  }
</script>


<style lang="scss" scoped>

  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .right-menu-item-color {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        /*font-size: 18px;*/
        /*color: #5a5e66;*/
        vertical-align: text-bottom;

        color: lightseagreen;
        font-weight: bold;
        font-size: 15px;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .item {
          margin-top: 10px;
          margin-right: 0px;
        }

        .avatar-wrapper {
          margin-top: 0px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>

<!--<style rel="stylesheet/scss" lang="scss" scoped>-->
<!--.navbar {-->
<!--  height: 50px;-->
<!--  line-height: 50px;-->
<!--  border-radius: 0px !important;-->
<!--  .hamburger-container {-->
<!--    line-height: 58px;-->
<!--    height: 50px;-->
<!--    float: left;-->
<!--    padding: 0 10px;-->
<!--  }-->
<!--  .screenfull {-->
<!--    position: absolute;-->
<!--    right: 90px;-->
<!--    top: 16px;-->
<!--    color: red;-->
<!--  }-->
<!--  .avatar-container {-->
<!--    height: 50px;-->
<!--    display: inline-block;-->
<!--    position: absolute;-->
<!--    right: 35px;-->
<!--    .avatar-wrapper {-->
<!--      cursor: pointer;-->
<!--      margin-top: 5px;-->
<!--      position: relative;-->
<!--      line-height: initial;-->
<!--      .user-avatar {-->
<!--        width: 40px;-->
<!--        height: 40px;-->
<!--        border-radius: 10px;-->
<!--      }-->
<!--      .el-icon-caret-bottom {-->
<!--        position: absolute;-->
<!--        right: -20px;-->
<!--        top: 25px;-->
<!--        font-size: 12px;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .right-menu {-->
<!--    float: right;-->
<!--    height: 100%;-->
<!--    line-height: 50px;-->

<!--    &:focus {-->
<!--      outline: none;-->
<!--    }-->

<!--    .right-menu-item {-->
<!--      display: inline-block;-->
<!--      padding: 0 8px;-->
<!--      height: 100%;-->
<!--      font-size: 18px;-->
<!--      color: #5a5e66;-->
<!--      vertical-align: text-bottom;-->

<!--      &.hover-effect {-->
<!--        cursor: pointer;-->
<!--        transition: background .3s;-->

<!--        &:hover {-->
<!--          background: rgba(0, 0, 0, .025)-->
<!--        }-->
<!--      }-->
<!--    }-->

<!--    .avatar-container {-->
<!--      margin-right: 30px;-->

<!--      .avatar-wrapper {-->
<!--        margin-top: 5px;-->
<!--        position: relative;-->

<!--        .user-avatar {-->
<!--          cursor: pointer;-->
<!--          width: 40px;-->
<!--          height: 40px;-->
<!--          border-radius: 10px;-->
<!--        }-->

<!--        .el-icon-caret-bottom {-->
<!--          cursor: pointer;-->
<!--          position: absolute;-->
<!--          right: -20px;-->
<!--          top: 25px;-->
<!--          font-size: 12px;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->

