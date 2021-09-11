import axios from "../libs/api.request";

// 变量分页查询
export const getVarList = ({prodId, pageNum, pageSize, varBaseFilter}) => {
    let str = `/vars/${prodId}/query/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: varBaseFilter})
};

// 分页查询变量(模糊搜素)
export const getFuzzyVarBaseList = ({prodId, pageNum, pageSize, varsBaseFilter})=>{
    let str = `/vars/${prodId}/queryFuzzy/${pageNum}/${pageSize}`;
    return axios.request({url:str, method:'post', data:varsBaseFilter})
};

export const getDSList = ({prodId}) => {
    let str = `/vars/${prodId}/datasource`;
    return axios.request({url: str, method: 'get'})
};
