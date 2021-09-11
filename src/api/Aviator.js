import axios from "../libs/api.request";

// 分页查询组件
export const testAviator = (aviatorTestDto) => {
    let str = `/decs/aviator/test`;
    return axios.request({url: str, method: 'post', data: aviatorTestDto})
};
