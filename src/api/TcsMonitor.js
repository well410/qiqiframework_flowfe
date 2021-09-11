import axios from "../libs/api.request";


// 决策数据量echarts图表信息
export const getTcsDecsTpsEchartsList = (chartsQueryDtoOfID) => {
    let str = `/monitor/tps/getTcsDecsTpsEchartsList`;
    return axios.request({url:str, method:'post', data:chartsQueryDtoOfID});
};


// 小卡片上的数据
export const queryDecsWarmCount = ({searchDto}) => {
    let str = `/monitor/tps/getDecsWarmCount`;
    return axios.request({url:str, method:'post', data:searchDto});
};
