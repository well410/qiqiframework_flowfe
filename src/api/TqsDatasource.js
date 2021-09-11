import axios from "../libs/api.request";


// 获取天擎数据源
export const getTqsDsById = ({prodId, datasourceId}) => {
    let str = `/tqsvars/datasource/${prodId}/datasource/${datasourceId}`;
    return axios.request({url: str, method: 'get'})
};

//新增或更新天擎数据源
export const modifyTqsDs = ({prodId, tqsDatasource})=>{
    let str = `/tqsvars/datasource/${prodId}/modifyTqsDatasource`;
    return axios.request({url:str, method:'post', data:tqsDatasource})
};
