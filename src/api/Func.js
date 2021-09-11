import axios from "../libs/api.request";

// 根据产品id和函数id获取所有的版本信息
export const getFuncVersionList1 = ({prodId,funcId})=>{
    let str =  `/func/${prodId}/func/${funcId}/version`;
    return axios.request({url: str, method: 'get'})
};

/**
 * 关于func的异步请求都写在这里
 */

// 函数分页查询
export const getFuncList = ({prodId, pageNum, pageSize, funcFilter}) => {
    let str = `/func/${prodId}/query/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: funcFilter})
};

// 函数分页查询--模糊匹配
export const getFuzzyFuncList = ({prodId, pageNum, pageSize, funcFilter}) => {
    let str = `/func/${prodId}/queryFuzzy/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: funcFilter})
};
// 函数分页查询--模糊匹配-引用数量
export const getFuzzyFuncListAndCiteCount = ({prodId,actualProdId, pageNum, pageSize, funcFilter}) => {
    let str = `/func/${prodId}/${actualProdId}/queryFuzzyFuncAndCiteCount/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post', data: funcFilter})
};

export const getCiteCount = ({prodId,funcList}) => {
    let str = `/func/${prodId}/queryCiteCount`;
    return axios.request({url: str, method: 'post', data: funcList})
};


// 根据id获取函数
export const getFuncById = ({prodId, funcId}) => {
    let str = `/func/${prodId}/func/${funcId}`;
    return axios.request({url: str, method: 'get'})
};

// 根据funcName获取函数
export const getFuncByFuncName = ({prodId, funcName}) => {
    let str = `/func/${prodId}/func/name/${funcName}`;
    return axios.request({url: str, method: 'get'})
}

// 添加函数
export const addFuncBase = ({funcBase, prodId}) => {
    let str = `/func/${prodId}/func`;
    return axios.request({url: str, method: 'post', data: funcBase})
};

// 修改函数
export const updateFuncBase = ({funcBase, prodId}) => {
    let str = `/func/${prodId}/func/${funcBase.funcId}`;
    return axios.request({url: str, method: 'put', data: funcBase})
};

// 删除函数
export const deleteFuncVersion = ({prodId, funcId, versionId}) => {
    let str = `/func/${prodId}/func/${funcId}/version/${versionId}`;
    return axios.request({url: str, method: 'delete'})
};

// 删除函数
export const deleteFunc = ({prodId, funcId}) => {
    let str = `func/${prodId}/func/${funcId}`;
    return axios.request({url: str, method: 'delete'})
};


/**
 * 获取一条函数的所有修改记录
 */
export const getFuncEditHisRoll = ({prodId, funcId, pageNum, pageSize}) => {
    let str = `func/${prodId}/func/${funcId}/history/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'get'})
};

// 函数测试
export const testFunc = ({funcTestDto, prodId, funcId}) => {
    let str = `func/${prodId}/func/${funcId}/test`;
    return axios.request({url: str, method: 'post', data: funcTestDto})
};

// -----------------------------------------------------------------------------

/**
 * 获取一条函数的所有版本
 */
export const getFuncVersionRoll = ({prodId, funcId}) => {
    let str = `func/${prodId}/func/${funcId}/version`;
    return axios.request({url: str, method: 'get'})
};

// 获得某个产品，某个函数的函数版本分页查询功能
export const getFuncVersionList = ({prodId, funcId, pageNum, pageSize, funcVersionFilter}) => {
    let str = `func/${prodId}/func/${funcId}/query/${pageNum}/${pageSize}/version`;
    return axios.request({url: str, method: 'post', data: funcVersionFilter})
};

// 获得某个产品，某个函数的函数版本引用关系数量分页查询功能
export const queryFuncVersionCiteCount = ({prodId, funcId, pageNum, pageSize}) => {
    let str = `func/${prodId}/${funcId}/queryFuncVersionCiteCount/${pageNum}/${pageSize}`;
    return axios.request({url: str, method: 'post'})
};
// 获得某个产品，某个函数的 某个函数版本 引用关系列表展示
export const getFuncVersionCitationList=({prodId,actualProdId, funcId,funcVersion}) =>{
    let str=`func/${prodId}/${actualProdId}/func/${funcId}/${funcVersion}/queryCitationList`;
    return axios.request({url: str, method: 'post'})
};

// 验证函数
export const checkFunc = ({prodId, funcId}) => {
    let str = `func/${prodId}/func/${funcId}/check`
    return axios.request({url: str, method: 'get'})
}

// 发布函数
export const publishFunc = ({prodId, funcId}) => {
    let str = `func/${prodId}/publishFunc/${funcId}`;
    return axios.request({url: str, method: 'post'})
}

// 批量发布函数
export const multiPublishFunc = ({prodId, funcBaseList}) => {
    let str = `/func/${prodId}/multiPublishFunc`;
    return axios.request({url: str, method: 'post', data: funcBaseList})
}

/**
 * 上线某个产品下某个函数的某个版本
 */
export const onlineFuncVersion = ({prodId, funcId, funcVersion}) => {
    let str = `func/${prodId}/func/${funcId}/version/${funcVersion}/online`;
    return axios.request({url: str, method: 'get'})
}

/**
 * 下线某个产品下某个函数的某个版本
 */
export const offlineFuncVersion = ({prodId, funcId, funcVersion}) => {
    let str = `func/${prodId}/func/${funcId}/version/${funcVersion}/offline`;
    return axios.request({url: str, method: 'get'})
}



