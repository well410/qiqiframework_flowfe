/**
 * 跟函数页面相关的变量和函数定义在这里
 */

import {getFuncByFuncName, getFuncById} from "../../api/Func";
import Vue from 'vue'

export const funcStatusEnums = {
    // '0':"草稿",
    // '1':"已验证",
    // '2':"已发布",
    // 'Y':"启用",
    // 'N':"停用",
    '0': {code: '0', name: "草稿"},
    '1': {code: '1', name: "已验证"},
    '2': {code: '2', name: "已发布"},
    'Y': {code: "Y", name: "启用"},
    'N': {code: "N", name: "停用"}

}

export const funcTypeEnums = {
    '0':"drl类型",
    '1':"java类型",
}


export const  validateFuncId = (rule, value, callback) => {
    let params = {prodId: "pub", funcId: `pub` + value};
    getFuncById(params).then(res=>{
        if (res.data.data !== null){
            callback(new Error('id重复'))
        } else {
            callback();
        }
    });
};


export const validateSameFuncName = (rule, value, callback) => {
    let params = {prodId: "pub", funcName: value};
    getFuncByFuncName(params).then(res=>{
        if (res.data.data !== null){
            callback(new Error('函数命名重复'))
        } else {
            callback();
        }
    })
}
