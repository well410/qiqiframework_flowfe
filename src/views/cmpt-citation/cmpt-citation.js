import {axios} from "../../libs/api.request";

/**
 * 路由
 * */
export const historyPathStore = {
    historyPath: '',
    setHistoryPath (newValue) {
        this.historyPath = newValue
    },
    getHistoryPath () {
        return this.historyPath
    }
};

export const queryCmptVersionCiteCount = (prodId, cmptQueryDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/queryCmptVersionCiteCount`,
        data: cmptQueryDto,
        method: 'post',
    })
};

export const queryCmptVersionCitation = (prodId, cmptId,cmptVersion)=>{
    return axios.request({
        url: `/cmpt/${prodId}/${cmptId}/${cmptVersion}/queryCitation`,
        method: 'post',
    })
};