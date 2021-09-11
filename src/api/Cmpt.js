import axios from "../libs/api.request";

//分页模糊查询组件基础版本
export const getCmptBaseList = ({prodId, cmptQueryDto}) => {
    let str = `/cmpt/${prodId}/queryFuzzy`;
    return axios.request({url: str, method: 'post', data: cmptQueryDto})
};

// 分页查询组件
export const getCmptList = ({prodId, cmptQueryDto}) => {
    let str = `/cmpt/${prodId}/query`;
    return axios.request({url: str, method: 'post', data: cmptQueryDto})
};

// 查询产品下组件对应的版本
export const getCmptVersionList = ({prodId, cmptQueryDto}) => {
    let str = `/cmpt/${prodId}/version`;
    return axios.request({url: str, method: 'post', data: cmptQueryDto})
};

