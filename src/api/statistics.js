import axios from '@/utils/request'


/**
 * 获取各个模块的个数
 * @param prodId
 * @returns {*}
 */
export const getNum = (prodId) => {
  let str = `/portal/${prodId}/num`;
  return axios.request({url: str, method: 'get'})
};

export const getLine = (platformType, prodId) => {
  let str = `/portal/${prodId}/line/${platformType}`;
  return axios.request({url: str, method: 'get'})
};

export const getPie = (platformType, prodId)=>{
  let str = `/portal/${prodId}/pie/${platformType}`;
  return axios.request({url: str, method: 'get'})
};
