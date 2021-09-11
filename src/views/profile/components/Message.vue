<template>
  <div class="message-page">
    <el-card shadow="true" style="margin-bottom:10px; margin-top:10px;">
      <div>

        <div class="message-page-con message-category-con">
          <el-menu :default-active="activeIndex" class="el-menu-demo" @select="handleSelect">
            <el-menu-item index="unread">
              <!--              <span class="category-title">未读消息</span><Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
              <span class="category-title">未读消息</span><el-badge style="margin-left: 10px" :value="messageUnreadCount"></el-badge>
            </el-menu-item>
            <el-menu-item index="readed">
              <!--              <span class="category-title">已读消息</span><Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
              <span class="category-title">已读消息</span><el-badge style="margin-left: 10px" :value="messageReadedCount"></el-badge>
            </el-menu-item>
            <el-menu-item index="trash">
              <!--              <span class="category-title">回收站</span><Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
              <span class="category-title">回收站</span><el-badge style="margin-left: 10px" :value="messageTrashCount"></el-badge>
              <el-button
                style="margin-left: 8px;"
                size="mini"
                round
                :loading="clearLoading"
                v-show="messageTrashCount > 0"
                @click="cleanTrash">清空</el-button>
            </el-menu-item>
          </el-menu>
        </div>

        <div class="message-page-con message-list-con2">
<!--          <Spin fix v-if="listLoading" size="large"></Spin>-->
          <!--          <div v-for="item in messageList" :name="item.annSeqId" :key="`msg_${item.annSeqId}`">-->
          <!--            <div>{{ item.annTitle }}</div>-->
          <!--            <div>{{ item.pubTim }}</div>-->
          <!--          </div>-->
          <el-menu
            width="auto"
            active-name=""
            class="titleClass"
            @select="handleView"
          >
            <el-menu-item v-for="item in messageList" :index="item.messId" :key="`msg_${item.messId}`">
              <div>
                <div>{{ item.messTitle }}</div>
                <div>
                  {{ item.createTime }}
                  <el-button
                    style="float: right;margin-right: 10px;"
                    size="mini"
                    round
                    :loading="item.loading"
                    v-show="currentMessageType !== 'unread'"
                    @click="removeMsg(item)">{{currentMessageType === 'readed' ? '删除' : '还原'}}</el-button>
                </div>
              </div>
            </el-menu-item>
          </el-menu>
        </div>

<!--        通知详情-->
        <div class="message-page-con message-view-con">
<!--          <Spin fix v-if="contentLoading" size="large"></Spin>-->
          <div class="message-view-header">
            <h2 class="message-view-title">{{ showingMsgItem.messTitle }}</h2>
            <div class="message-view-time">{{ showingMsgItem.createTime }}</div>
          </div>
          <div style="white-space: pre-wrap;word-wrap: break-word;" v-html="messageContent"></div>
<!--          <div>-->
<!--            <ol>-->
<!--              <li v-for="file in docDownloadList">-->
<!--                <a @click="download(file.name, file.annSeqId)" >-->
<!--                  <span>{{file.name}}</span>-->
<!--                </a>-->
<!--              </li>-->
<!--            </ol>-->
<!--          </div>-->

        </div>




      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

  const listDic = {
    unread: 'messageUnreadList',
    readed: 'messageReadedList',
    trash: 'messageTrashList'
  };

  export default {
    name: 'Message',
    data () {
      return {
        activeIndex: 'unread',
        listLoading: true,
        contentLoading: false,
        currentMessageType: 'unread',
        messageContent: '',
        showingMsgItem: {},

        clearLoading: false,
        // test
        // messageList: [
        //   {"empId":"280535","annSeqId":90,"annTitle":"测试公告","pubTim":"2020-08-12 11:35:44","status":1},
        //   {"empId":"280535","annSeqId":91,"annTitle":"tsetea","pubTim":"2020-08-12 11:35:44","status":2},
        // ],
      }
    },
    computed: {
      ...mapState({
        messageUnreadList: state => state.message.messageUnreadList,
        messageReadedList: state => state.message.messageReadedList,
        messageTrashList: state => state.message.messageTrashList,
        // 当前的信息类型
        messageList () {
          return this[listDic[this.currentMessageType]]
        },
      }),
      ...mapGetters([
        'messageUnreadCount',
        'messageReadedCount',
        'messageTrashCount'
      ])
    },
    methods: {
      ...mapMutations([
        //
      ]),
      ...mapActions([
        'getContentByMessId',
        'getMessageInfList',
        'hasRead',
        'removeReaded',
        'restoreTrash',
        'clearTrash'
      ]),
      stopLoading (name) {
        this[name] = false
      },
      handleSelect (name) {
        this.currentMessageType = name
      },
      handleView (annId) {
        let that = this;
        this.contentLoading = true;
        // 内容设置
        let messIndex = this.messageList.findIndex(item => item.messId === annId);
        that.showingMsgItem = this.messageList[messIndex];
        that.messageContent = that.showingMsgItem.messContent;
        // 未读点击后转入已读
        if (that.currentMessageType === 'unread') that.hasRead(annId);
        this.stopLoading('contentLoading');
        this.contentLoading = false;
      },

      // 点击删除或者还原后进行message的信息变更
      removeMsg (item) {
        item.loading = true;
        const annId = item.messId;
        if (this.currentMessageType === 'readed') this.removeReaded( annId );
        else this.restoreTrash( annId );
      },

      // 清空回收站
      cleanTrash () {
        let that = this;
        this.$confirm('确定要清空回收站吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.clearLoading = true;
          this.clearTrash();
          that.clearLoading = false;
        })

      }
    },

    activated() {
      this.getMessageInfList().then(() => this.stopLoading('listLoading')).catch(() => this.stopLoading('listLoading'))
    },

    mounted() {
      this.listLoading = true;
      // 请求通知信息
      this.getMessageInfList().then(() => this.stopLoading('listLoading')).catch(() => this.stopLoading('listLoading'))
    }
  }
</script>

<style scoped>
  .titleClass >>> .el-menu-item {
    height: 70px;
    line-height: 25px;
    /*column-width: 100px;*/

  }
</style>

<style lang="scss" scoped>

  .message-page{
    &-con{
      /*height: ~"calc(100vh - 176px)";*/
      display: inline-block;
      vertical-align: top;
      position: relative;
      &.message-category-con{
        border-right: 1px solid #e6e6e6;
        width: 200px;
      }
      &.message-list-con{
        border-right: 1px solid #e6e6e6;
        width: 200px;
      }
      &.message-list-con2{
        border-right: 1px solid #e6e6e6;
        width: 250px;
      }
      &.message-view-con{
        position: absolute;
        left: 470px;
        top: 16px;
        right: 16px;
        bottom: 16px;
        overflow: auto;
        padding: 12px 20px 0;
        .message-view-header{
          margin-bottom: 20px;
          .message-view-title{
            display: inline-block;
          }
          .message-view-time{
            margin-left: 0px;
          }
        }
      }
      .category-title{
        display: inline-block;
        width: 65px;
      }
      .gray-dadge{
        background: gainsboro;
      }
      .not-unread-list{
        .msg-title{
          color: rgb(170, 169, 169)
        }
        .msg-time {
          height: 5px;
        }
        .ivu-menu-item{
          .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
            display: none;
          }
          &:hover{
            .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>
