import {axios} from "../libs/api.request";

/**
 * 获取组件列表（分页）
 * */
export const getCmptBasePaged = (prodId, cmptQueryDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/query`,
        data: cmptQueryDto,
        method: 'post',
    })
};



/**
 * 获取组件列表（分页）(模糊匹配)
 * */
export const getFuzzyCmptBasePaged = (prodId, cmptQueryDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/queryFuzzy`,
        data: cmptQueryDto,
        method: 'post',
    })
};
/**
 * 获取组件列表（分页）(模糊匹配-引用展示)
 * */
export const getFuzzyCmptBasePagedAndDecs = (prodId, cmptQueryDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/queryFuzzyAndDecs`,
        data: cmptQueryDto,
        method: 'post',
    })
};

export const queryFuzzyCmptBasePagedAndCiteCount = (prodId, cmptQueryDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/queryFuzzyAndCiteCount`,
        data: cmptQueryDto,
        method: 'post',
    })
};
export const queryCiteCount=(prodId,interfaceList)=>{
    return axios.request({
        url: `/cmpt/${prodId}/queryCiteCount`,
        data: interfaceList,
        method: 'post',
    })
};

/*/!**
 * 访问决策详情页面
 *!/
export const getDecsDetail=(prodId,decsId)=>{

    return axios.request({
        url:`/decs/${prodId}/decs/${decsId}`,
        method: 'get',
    })
};*/

/**
 * 获取组件
 * */
export const getCmptBase = (prodId, cmptId)=>{
    return axios.request({
        url: `/cmpt/${prodId}/cmptId/${cmptId}`,
        method: 'get',
    })
};

/**
 * 保存并上传模型组件
 * */
export const saveCmptModelBase = (prodId, act, param)=>{
    return axios.request({
        url: `/cmpt/model/${prodId}/save/${act}`,
        data: param,
        method: 'post',
    })
};

//下载模型文件
export const downloadCmptModelFile = (prodId, fileName) => {
    return axios.request({
        url: `/cmpt/model/${prodId}/download/${fileName}`,
        method: 'get',
        responseType: 'blob',
    })
};

/**
 * 保存组件
 * */
export const saveCmptBase = (prodId, act, httpInterfaceDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/save/${act}`,
        data: httpInterfaceDto,
        method: 'post',
    })
};

/**
 * 删除组件
 * */
export const deleteCmptBase = (prodId, cmptId)=>{
    return axios.request({
        url: `/cmpt/${prodId}/cmptId/${cmptId}`,
        method: 'delete',
    })
};

/**
 * 发布组件
 * */
export const publishCmptBase = (prodId, selectedCmptBaseList)=>{
    return axios.request({
        url: `/cmpt/${prodId}/publishCmpt`,
        data: selectedCmptBaseList,
        method: 'post',
    })
};

/**
 * 调试Http接口
 * */
export const testHttpInterafce = (prodId, httpInterfaceDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/test/http`,
        data: httpInterfaceDto,
        method: 'post',
    })
};

/**
 * 调试Kafka接口
 * */
export const testKafkaInterafce = (prodId, kafkaInterfaceDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/test/kafka`,
        data: kafkaInterfaceDto,
        method: 'post',
    })
};

/**
 * 调试模型
 * */
export const testModelInterafce = (prodId, modelInterfaceDto)=>{
    return axios.request({
        url: `/cmpt/${prodId}/test/model`,
        data: modelInterfaceDto,
        method: 'post',
    })
};
