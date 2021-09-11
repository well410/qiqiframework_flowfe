import {isContainEmpty, isEmpty, isNotContainEmpty, isNotEmpty} from "../utils";
import {warningTip} from "./index";
import {DataTypeEnumsClass} from "../entity/enumns";


// json schema验证，暂时不用
export const jsonSchemaValidate = (json, schema) => {
    let Validator = require('jsonschema').Validator;
    let v = new Validator();
    let instance = "4";
    schema = {"type": "number"};
    console.log(v.validate(instance, schema));
};

export const analysisJsonParse = (objectParam, result, path="")=>{
    if (result === null) throw new Error("初始化analysisJsonParse result值，例如空对象");
    for (let key in objectParam) {
        if (!objectParam.hasOwnProperty(key)) continue;
        let param = objectParam[key];
        //String类型的数据不用instanceof进行判断的原因：param只是一个以string为数据类型的值，但并不属于String对象的实例
        if (typeof(param) == 'string') {
            result[key] = objectParam[key];
        } else if (param instanceof Object) {
            if (!analysisJsonParse(param, result, key + "." + path)) {
                return false;
            }
        } else if (param instanceof Array) {
            for (let i in param) {
                if (!param.hasOwnProperty(i)) continue;
                if (!analysisJsonParse(param[i], result, key + "." + path)) {
                    return false;
                }
            }
        }
    }
};


/**
 * 校验Json格式参数
 * */
export const checkJsonParam = function (jsonParam) {
    try {
        let types = DataTypeEnumsClass.getDataTypeList();
        let objectParam = JSON.parse(jsonParam);
        return checkJsonParamRecursion(objectParam, types);
    } catch (err) {
        warningTip('解析JSON参数失败，失败原因：' + err.toString());
        return false;
    }
};

/**
 * 校验RequestBody的递归方法
 * */
export const checkJsonParamRecursion = function (objectParam, types) {
    for (let key in objectParam) {
        if (!objectParam.hasOwnProperty(key)) continue;
        let param = objectParam[key];
        //String类型的数据不用instanceof进行判断的原因：param只是一个以string为数据类型的值，但并不属于String对象的实例
        if (typeof(param) == 'string') {
            let value = param.split('-');
            if (value.length !== 2 || !types.includes(value[1])) {
                let msg = '参数' + key + `的格式不正确（正确格式，e.g. 参数名: 参数描述-参数类型, 参数类型：${DataTypeEnumsClass.getDataTypeList()}）`;
                warningTip(msg);
                return false;
            }
        } else if (param instanceof Object) {
            if (!checkJsonParamRecursion(param, types)) {
                return false;
            }
        } else if (param instanceof Array) {
            for (let i in param) {
                if (!param.hasOwnProperty(i)) continue;
                if (!checkJsonParamRecursion(param[i], types)) {
                    return false;
                }
            }
        }
    }
    return true;
};
