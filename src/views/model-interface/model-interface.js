import {warningTip, isEmpty} from "../../utils/tools";

export const requestTypeList = [
    {'value':'1', 'label': 'GET'},
    {'value':'2', 'label': 'POST'},
    {'value':'3', 'label': 'DELETE'},
    {'value':'4', 'label': 'PUT'}
];

/**
 * 校验URI中的参数的值
 */
export const checkURIVariablesValue = function (requestParam, pathVariable) {
    //校验URL变量
    for (let i = 0; i < pathVariable.length; i++) {
        let param = pathVariable[i];
        if (!isEmpty(param.cmptVarName) && isEmpty(param.cmptVarValue)) {
            warningTip('PathVariable中参数' + param.cmptVarName + '的参数值不得为空！');
            return false;
        }
    }
    //校验请求参数
    for (let i = 0; i < requestParam.length; i++) {
        let param = requestParam[i];
        if (!isEmpty(param.cmptVarName) && isEmpty(param.cmptVarValue)) {
            warningTip('RequestParam中参数' + param.cmptVarName + '的参数值不得为空！');
            return false;
        }
    }
    return true;
};