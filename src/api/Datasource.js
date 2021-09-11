import axios from "../libs/api.request";

// 分页查询数据源
export const getDsListEv = ({prodId, pageNum, pageSize, dsFilter})=>{
    let str = `/vars/${prodId.value}/queryDatasource/${pageNum}/${pageSize}`;
    return axios.request({url:str, method:'post', data:dsFilter})
};

// 查询数据库事件变量字段
export const getEvColumn = ({datasourceType, dataSourceEntity})=>{
    let str = `/vars/table/columns/${datasourceType}`;
    return axios.request({url:str, method:'post',data: dataSourceEntity})
};

// 查询ES数据库事件变量字段
export const getEsColumn = ({esProperties})=>{
    let str = `/vars/table/columns/elasticsearch`;
    return axios.request({url:str, method:'post',data: esProperties})
};

export const getDatabaseVarsByTpye = ({prodId, pageNum, pageSize, varsBaseFilter}) => {
    let str = `/vars/${prodId}/query/${pageNum}/${pageSize}`;
    return axios.request({url:str, method:'post',data: varsBaseFilter})
}