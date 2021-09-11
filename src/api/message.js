import axios from '@/utils/request'
import { messageStatusEnums } from './Common'

// 获取用户未读信息
export const getUnreadCount = () => {
  let str = `/portal/message/unreadCount`;
  return axios.request({url:str, method:'post', data:{status: messageStatusEnums.unread.code}})
};


// 获取用户的所有信息
export const getMessage = () => {
  let str = `/portal/message/all`;
  return axios.request({url:str, method:'get'})
};

// 更改用户的通知信息为已读
export const hasRead = (messId) => {
  let str = `/portal/message/messageStatus`;
  return axios.request({url:str, method:'put', data: {messId: messId, status: messageStatusEnums.readed.code}});
};

// 将用户的通知信息由已读变更为已删除
export const removeReaded = (messId) => {
  let str = `/portal/message/messageStatus`;
  return axios.request({url:str, method:'put', data: {messId: messId, status: messageStatusEnums.trash.code}});
};

// 将用户的通知信息由已删除变更为已阅读
export const restoreTrash = (messId) => {
  let str = `/portal/message/messageStatus`;
  return axios.request({url:str, method:'put', data: {messId: messId, status: messageStatusEnums.readed.code}});
};

// 清空回收站信息
export const clearTrash = () => {
  let str = `/portal/message/clearTrash`;
  return axios.request({url:str, method:'delete'})
}


















