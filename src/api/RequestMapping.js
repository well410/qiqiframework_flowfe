import axios from "../libs/api.request";

export const deleteRequestMappingBase = ({requestMappingBase}) => {
    return axios.request({
        url: `/decs/${requestMappingBase.prodId}/decsGroup/requestMappingBase`,
        method: 'delete',
        data: requestMappingBase
    })
};


export const deleteRequestMappingVersion = ({requestMappingVersion}) => {
    return axios.request({
        url: `/decs/${requestMappingVersion.prodId}/decsGroup/requestMappingVersion`,
        method: 'delete',
        data: requestMappingVersion
    })
}

export const onlineRequestMappingVersion = ({requestMappingVersion})=>{
    return axios.request({
        url: `/decs/${requestMappingVersion.prodId}/decsGroup/requestMappingVersion/online`,
        method: 'post',
        data: requestMappingVersion
    })
}

export const offlineRequestMappingVersion = ({requestMappingVersion})=>{
    return axios.request({
        url: `/decs/${requestMappingVersion.prodId}/decsGroup/requestMappingVersion/offline`,
        method: 'post',
        data: requestMappingVersion
    })
}

export const queryRequestMappingVersion = ({prodId, requestMappingBase, pageNum, pageSize})=>{
    return axios.request({
        url: `/decs/${prodId}/decsGroup/requestMappingVersion/${pageNum}/${pageSize}`,
        method: 'post',
        data: requestMappingBase
    })
}

export const queryRequestMappingHistory = ({prodId, requestMappingBase, pageNum, pageSize})=>{
    return axios.request({
        url: `/decs/${prodId}/decsGroup/requestMappingHistory/${pageNum}/${pageSize}`,
        method: 'post',
        data: requestMappingBase
    })
}

export const addRequestMappingBase = ({prodId, requestMappingBase})=>{
    return axios.request({
        url: `/decs/${prodId}/decsGroup/requestMappingBase`,
        method: 'post',
        data: requestMappingBase
    })
}

export const updateRequestMappingBase = ({prodId, requestMappingBase})=>{
    return axios.request({
        url: `/decs/${prodId}/decsGroup/requestMappingBase`,
        method: 'put',
        data: requestMappingBase
    })
}

export const publicRequestMappingBase = ({prodId, decsGroupId, requestMappingId}) => {
    return axios.request({
        url: `/decs/${prodId}/decsGroup/${decsGroupId}/requestMappingBase/public/${requestMappingId}`,
        method: 'post',
    })
};




export const queryRequestMappingBase = ({requestMappingFilter, prodId, pageNum, pageSize}) => {
    return axios.request({
        url: `/decs/${prodId}/decsGroup/requestMappingBase/${pageNum}/${pageSize}`,
        method: 'post',
        data: requestMappingFilter
    })
};


export const getRequestMappingBaseById = ({prodId, decsGroupId, requestMappingBaseId}) => {
    return axios.request({
        url: `/decs/${prodId}/decsGroup/${decsGroupId}/requestMappingBase/${requestMappingBaseId}`,
        method: 'get',
    })
};








