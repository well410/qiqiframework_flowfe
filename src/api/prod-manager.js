import axios from '@/utils/request'

// 获取用户未读信息
export const getAllProdId = () => {
  let str = `/api/prod/queryAllProdId`;
  return axios.request({url:str, method:'get'})
};

export const changeUserProdId = (prodId) => {
  let str = `/api/prod/change/${prodId}`;
  return axios.request({url:str, method:'put'})
}

export const getUserProdId = () => {
  let str = `/api/prod/getProdId`;
  return axios.request({url:str, method:'get'})
}

export const setFirstInUserProdId = () => {
  let str = `/api/prod/autoSet/firstInUserProdId`;
  return axios.request({url:str, method:'get'})
}
