import {axios} from "../libs/api.request";

/**
 * 获取组件列表（分页）
 * */
export const getCmptVersionPaged = (prodId, cmptQueryDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/version`,
        data: cmptQueryDto,
        method: 'post',
    })
};

/**
 * 删除组件
 * */
export const deleteCmptVersion = (cmpt)=>{
    return axios.request({
        url: `/cmpt/${cmpt.prodId}/version/online/cmptId/${cmpt.cmptId}/cmptVersion/${cmpt.cmptVersion}`,
        method: 'delete',
    })
};

/**
 * 获取组件列表
 * */
export const getCmptVersion = (prodId, cmptId, cmptVersion)=>{
    return axios.request({
        url: `/cmpt/${prodId}/version/cmptId/${cmptId}/cmptVersion/${cmptVersion}`,
        method: 'get',
    })
};

/**
 * 上线组件
 * */
export const onlineCmptVersion = (prodId, cmptIds, cmptVersions)=>{
    return axios.request({
        url: `/cmpt/${prodId}/version/online/cmptId/${cmptIds}/cmptVersion/${cmptVersions}`,
        method: 'post',
    })
};

/**
 * 下线组件
 * */
export const offlineCmptVersion = (prodId, cmptIds, cmptVersions)=>{
    return axios.request({
        url: `/cmpt/${prodId}/version/offline/cmptId/${cmptIds}/cmptVersion/${cmptVersions}`,
        method: 'post',
    })
};

