import axios from '@/utils/request'


export const getAllUpdatelog = () => {
  let str = `/api/prod/updatelog/getAllUpdatelog`;
  return axios.request({url:str, method:'get'})
};

export const addUpdateLog = (updatelog) => {
  let str = `/api/prod/updatelog/add`;
  return axios.request({url: str, method: 'post', data: updatelog})
}

export const delelteUpdateLog = ({id}) => {
  let str = `/api/prod/updatelog/delete/${id}`;
  return axios.request({
    url: str,
    method: 'delete'
  })
}

export const updateUpdateLog = (updatelog) => {
  debugger
  let str = `/api/prod/updatelog/update`;
  return axios.request({url: str, method: 'put', data: updatelog})
}
