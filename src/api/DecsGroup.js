import axios from "../libs/api.request";



export const getDecsGroupById = ({prodId, decsGroupId}) => {
    return axios.request({
        url: `/decs/${prodId}/decsGroup/${decsGroupId}`,
        method: 'get',
    })
};

export const queryDecsGroup = ({decsGroupFilter, prodId, pageNum, pageSize}) => {
    return axios.request({
        url: `/decs/${prodId}/decsGroup/${pageNum}/${pageSize}`,
        method: 'post',
        data: decsGroupFilter
    })
};


export const deleteDecsGroup = ({decsGroup}) => {
    return axios.request({
        url: `/decs/${decsGroup.prodId}/decsGroup`,
        method: 'delete',
        data: decsGroup
    })
};


export const updateDecsGroup = ({prodId, decsGroup}) => {
    return axios.request({
        url: `/decs/${prodId}/decsGroup`,
        method: 'put',
        data: decsGroup
    })
};


export const addDecsGroup = ({prodId, decsGroup}) => {
    return axios.request({
        url: `/decs/${prodId}/decsGroup`,
        method: 'post',
        data: decsGroup
    })
};
