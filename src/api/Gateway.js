import {axios2} from "../libs/api.request";

export const updateExecApp = ({prodId, decsId})=>{
    let str = `/update?prodId=${prodId}&serviceId=${decsId}&type=decs`;
    return axios2.request({url: str, method: 'get'})
};
