import {isEmpty} from "../utils/index";
import {dataTypeEnums, messageEnums, varNameTypeEnums, varTypeEnums} from "../entity/enumns";

// drl文件中使用的操作类型，所有的节点操作都会使用该类或者继承该类
export class DrlOperate {
    constructor(data) {
        if (data === undefined) data = {};
        this.uuid = isEmpty(data['uuid']) ? getUUID() : data['uuid'];
        // 字段描述
        this.varDesc = isEmpty(data['varDesc']) ? "" : data['varDesc'];
        // 字段来源
        this.varFrom = data['varFrom'];
    }

}


// drl文件中使用的变量，所有的变量会使用该类或者继承该类
export class DrlVar {
    constructor(data) {
        if (data === undefined) data = {};
        this.uuid = isEmpty(data['uuid']) ? getUUID() : data['uuid'];
        // 字段名
        this.varName = data['varName'];
        // 字段描述
        this.varDesc = isEmpty(data['varDesc']) ? "" : data['varDesc'];
        // 字段类型
        this.varType = data['varType'];
        // 字段来源
        this.varFrom = data['varFrom'];

        // 别名
        this.varAlias = data['varAlias'];
        // 名称类型
        /**
         * @see varNameTypeEnums
         */
        this.varNameType = data['varNameType'];
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        return  this.varName;
    }

    // 获取别名
    getAliasName() {
        return [varTypeEnums.av.code, this.varAlias].join("_");
    }

    // 判断是否要用别名
    enableAlias(){
        // 默认是常规名
        if (isEmpty(this.varNameType) || this.varNameType === varNameTypeEnums.S.code){
            return false;
        } else if (this.varNameType === varNameTypeEnums.A.code) {
            return true;
        } else {
            console.error("目前仅支持常规名和别名")
        }
    }

    /**
     * 验证数据，有异常信息直接返回
     * @returns {Array}
     */
    errorList(){
        let result = [];
        if (this.enableAlias()){
            isEmpty(this.varAlias) && result.push(`${messageEnums.VAR_NAME_ALIAS.name}为空`);
        } else {
            isEmpty(this.varName) && result.push(`${messageEnums.VAR_NAME_DEFAULT.name}为空`)
        }

        return result
    }


    // 得到带有描述的变量名
    getDescVarName() {
        return `[${this.getPrefixVarName()}]${this.varDesc}`
    }

    // 获取简单的描述信息
    getSimpleDesc() {
        if (isEmpty(this.varType)) {
            return `[${this.varDesc}]`;
        } else {
            return `[${this.varDesc}][${this.varType}]`
        }
    }

    // 验证
    validate(){
        return "";
    }
}

// 评分卡结果变量 074389
export class SCVar extends DrlVar{
    constructor(data){
        super(data)
    }
    //得到带有前缀的变量名
    getPrefixVarName() {
        return this.varName;
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }

    static obj2SCVar(obj) {
        if (obj === undefined) {
            return new SCVar({varType: dataTypeEnums.STRING.code, varNameType: varNameTypeEnums.S.code});
        }

        if (typeof obj === 'object') {
            return new SCVar(obj);
        } else {
            return obj;
        }
    }
}

// 元规则结果变量
export class URVar extends DrlVar{
    constructor(data){
        super(data)
    }
    //得到带有前缀的变量名
    getPrefixVarName() {
        if (super.enableAlias()){
            return super.getAliasName();
        } else {
            return this.varName;
        }
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }

    static obj2UrVar(obj){
        if (obj === undefined) {
            return new URVar({varType: dataTypeEnums.STRING.code, varNameType: varNameTypeEnums.S.code});
        }

        if (typeof obj === 'object') {
            return new URVar(obj);
        } else {
            return obj;
        }
    }
}


// 生成唯一id
export function ls(count) {
    let result = [], index = 1;
    for (; index <= count; index++)
        if (index.toString().length === 1) {
            result.push("00" + index);
        } else if ((index.toString().length === 2)) {
            result.push("0" + index);
        } else {
            result.push(index.toString());
        }
    return result;
}

//获取uuid
export function getUUID() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
}

export class RuleUpdateDto {
    constructor(data) {
        if (data === undefined) data = {};
        // 规则基本信息
        this.ruleBase = data["ruleBase"];
        // 函数关联信息（1. 为null时不做处理 2.空数组时删除所有关联信息 3.数组有值时先删除关联信息，然后添加信息）
        this.funcRelList = data["funcRelList"];
        this.varsRelList = data["varsRelList"];
        this.dsRelList = data["dsRelList"];
    }
}

export class ProdmanageBase {
    constructor(data){
        if (data === undefined) data = {};
        this.id = data['id'];                           // 自增id
        this.ystId = data['ystId'];                     // 一事通Id
        this.prodId = data['prodId'];                   // 产品Id
        this.prodList = isEmpty(data["prodList"]) ? [] : data['prodList']; // 产品Id List
        this.ystName = data['ystName'];                 // 一事通名字
        this.createUser = data['createUser'];               //  创建者
        this.createTime = data['createTime'];               //  创建时间
        this.updateUser = data['updateUser'];               //  修改者
        this.updateTime = data['updateTime'];               //  修改时间
        this.userRole = data['userRole'];               // 用户角色
    }
}

/**
 * 组件类型【流程图左侧的节点类型】
 * @type {{cmpt: string, start: string, rule: string, end: string, fun: string}}
 */
export const compType = {
    start:"start",
    end:"end",
    fun:"fun",
    rule:"rule",
    unitRule:"UnitRule",
    cmpt:"cmpt",
};

export function formatDate(time, format){
    let t = new Date(time);
    let tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    });
}


