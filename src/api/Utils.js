import axios from "../libs/api.request";

export const evVarParse = (data)=>{
    let str = `/decs/utils/analysisJson/evVarParse`;
    return axios.request({url:str, method:'post', data:data})
};


export const pathParse = (data)=>{
    let str = `/decs/utils/analysisJson/pathParse`;
    return axios.request({url:str, method:'post', data:data})
};

export const getSdkVersion = ({artifactId})=>{
    let str = `/decs/utils/sdk/version/${artifactId}`;
    return axios.request({url:str, method:'get'})
};
