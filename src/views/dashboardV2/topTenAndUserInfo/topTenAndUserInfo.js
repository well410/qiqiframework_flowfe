import axios from '@/utils/request'

export const getUserInfo = (prodId) => {
  let str = `/portal/userInfo/${prodId}/ApprovalAndAlarms`;
  return axios.request({url: str, method: 'get'})
};

export const getApprDetail = (prodId) => {
  let str = `/portal/userInfo/${prodId}/ApprDetail`;
  return axios.request({url: str, method: 'get'})
};

export const getTopTen=(prodId)=>{
  let str = `/portal/${prodId}/getTopTen`;
  return axios.request({url: str, method: 'get'})
};

export const getDecsUrl=()=>{
  let str=`/portal/getDecsUrl`;
  return axios.request({url: str, method: 'get'})
};

export const getApprUrl=()=>{
  let str=`/portal/getApprUrl`;
  return axios.request({url: str, method: 'get'})
};
