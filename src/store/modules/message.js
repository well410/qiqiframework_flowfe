// 后端api接口
import {
  getMessage,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/message'
import { clearTrash } from '../../api/message'


// store仓库
const message = {

  state: {
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    // messageContentStore: {},
  },

  mutations: {
    // 未读数据量
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list;
      state.unreadCount = list.length;
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    // updateMessageContentStore (state, { msg_id, content }) {
    //   state.messageContentStore[msg_id] = content
    // },
    moveMsg (state, {from, to, annId}) {
      const index = state[from].findIndex(_ =>
        _.messId === annId);
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false;
      state[to].unshift(msgItem)
    }
  },

/*
  getter: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
*/

  actions: {
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount().then(res => {
        const data = res.data;
        commit('setMessageCount', data)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageInfList({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const { unReadMessages, readMessages, trashMessages } = res.data;
          // 未读
          commit('setMessageUnreadList', unReadMessages.sort((a, b) => new Date(b.createTime) - new Date(a.createTime)));
          commit('setMessageCount', unReadMessages.length);
          // 已读和垃圾箱
          commit('setMessageReadedList', readMessages.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)));
          commit('setMessageTrashList', trashMessages.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)));

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    // getContentByMessId ({ state, commit },  annId) {
    //   return new Promise((resolve, reject) => {
    //     let contentItem = state.messageContentStore[annId];
    //     if (contentItem) {
    //       resolve(contentItem)
    //     } else {
    //       getContentByMsgId(annId).then(res => {
    //         const content = res.data.data['announce'].annContent;
    //         commit('updateMessageContentStore', { annId, content });
    //         resolve(res.data.data)
    //       })
    //     }
    //   })
    // },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, annId) {
      return new Promise((resolve, reject) => {
        // 后端接口
        hasRead(annId).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            annId: annId
          });
          commit('setMessageCount', state.unreadCount - 1);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, msg_id) {
      return new Promise((resolve, reject) => {
        // 后端接口
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            annId: msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, msg_id) {
      return new Promise((resolve, reject) => {
        // 后端接口
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            annId: msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 清空回收站
    clearTrash({state, commit}) {
      debugger
      clearTrash().then(() => {
        // commit('getMessageInfList');
        // this.getMessageInfList();
        getMessage().then(res => {
          const { unReadMessages, readMessages, trashMessages } = res.data;
          // 未读
          commit('setMessageUnreadList', unReadMessages.sort((a, b) => new Date(b.createTime) - new Date(a.createTime)));
          commit('setMessageCount', unReadMessages.length);
          // 已读和垃圾箱
          commit('setMessageReadedList', readMessages.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)));
          commit('setMessageTrashList', trashMessages.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)));

          resolve()
        }).catch(error => {
          reject(error)
        })
      }).finally(() => {});
    }
  }
}

export default message



