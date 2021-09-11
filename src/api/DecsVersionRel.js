import axios from "../libs/api.request";

export const getAllDecsVersionRel = () => {
    let str = `/decs/decsversion/getAllDecsVersionRel`;
    return axios.request({url:str, method:'get'})
};
