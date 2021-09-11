import axios from "../libs/api.request";

// 分页查询决策
export const getLogDataList = ({prodId,singleRequest}) => {
    let str = `/data/${prodId}/logdata/query`;
    return axios.request({url: str, method: 'post', data: singleRequest})
};
