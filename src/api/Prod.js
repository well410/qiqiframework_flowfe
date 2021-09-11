import axios from "../libs/api.request";


export const getProdList = ({pageNum, pageSize, prodFilter})=>{
    let str = `/prod/prodList/${pageNum}/${pageSize}`;
    return axios.request({url:str, method:'post', data:prodFilter})
};

export const getProdId = ()=>{
    let str = `/prod/getProdId`;
    return axios.request({url:str, method:'get'})
};
