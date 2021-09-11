import {axios} from "../libs/api.request";

/**
 * 获取组件列表（分页）
 * */
export const getCmptHistoryPaged = (prodId, cmptQueryDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/history`,
        data: cmptQueryDto,
        method: 'post',
    })
};

