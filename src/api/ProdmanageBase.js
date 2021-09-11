import axios from "../libs/api.request";


// 产品管理分页查询
export const getProdmanageList = ({pageNum, pageSize, filter}) => {
    let str = `/prod/query/${pageNum}/${pageSize}`;
    return axios.request({url:str, method:'post', data:filter})
}

// 产品管理分页查询--模糊查询
export const getFuzzyProdmanageList = ({pageNum, pageSize, filter}) => {
    let str = `/prod/queryFuzzy/${pageNum}/${pageSize}`;
    return axios.request({url:str, method:'post', data:filter})
}


// 添加产品管理
export const addProdmanageBase = ({prodmanageBase}) => {
    let str = `/prod/prodmanage`;
    return axios.request({url:str, method:'post', data:prodmanageBase})
}

// 更新产品管理
export const updateProdmanageBase = ({prodmanageBase, id})=>{
    let str = `/prod/${id}`;
    return axios.request({url:str, method:'put', data:prodmanageBase})
}

// 根据自增id获取产品管理
export const getProdmanageById = ({id})=>{
    let str = `/prod/query/${id}`;
    return axios.request({url:str, method:'get'})
};

// 删除产品管理
export const deleteProdmanage = ({id}) => {
    let str = `/prod/${id}`;
    return axios.request({url:str, method:'delete'})
}

// 根据ystId获取产品管理信息（用于新增的时候保证一个人只能配置一个产品）
export const getProdmanageByYstId = ({ystId})=>{
    let str = `/prod/queryByYstId/${ystId}`;
    return axios.request({url:str, method:'get'})
};

