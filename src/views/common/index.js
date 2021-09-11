import {isContainEmpty, isEmpty} from "../../utils";
import {checkJsonParam} from "../../utils/JsonValidate";
import {G6Model} from "../../entity/g6Model";
import ElementUI from 'element-ui';
import {getProdmanageByYstId} from "../../api/ProdmanageBase";

export class MyMessage{
    /**
     * 版本不一致的提示
     * @param dt
     */
    static versionMessage(dt){
        let result = new Set();

        function getUniqueName(_id, _version) {
            _version = isEmpty(_version) ? "" : _version;
            return _id + _version
        }

        let funcList = G6Model.getFunList(dt);
        let ruleList = G6Model.getRuleList(dt);

        funcList.forEach(item => {
            const set = new Set();
            funcList
                .filter(func => func.funcId === item.funcId)
                .forEach(func => set.add(getUniqueName(func.funcId, func.funcVersion)));
            if (set.size > 1){
                result.add(item.funcId)
            }
        });

        ruleList.forEach(item => {
            const set = new Set();
            ruleList
                .filter(rule => rule.ruleId === item.ruleId)
                .forEach(rule => set.add(getUniqueName(rule.ruleId, rule.ruleVersion)));
            if (set.size > 1){
                result.add(item.ruleId)
            }
        });

        if (result.size > 0){
            ElementUI.Message({message: `${Array.from(result).join(",")}有多个版本存在，建议保持相同的版本`, type: 'warning'})
        }
    }
}


export class AutoMapping {
    /**
     * 通过名字自动匹配
     * @param varName：变量名
     * @param drlVarList：drl变量的List
     * @see DrlVar
     */
    static autoMappingByName(varName, drlVarList){
        let result = '';
        const weightList = drlVarList.map(drlVar => {
            return getMatchingWeight(drlVar.varName, varName)
        });
        const maxWight = Math.max(...weightList).toFixed(2);
        if (parseFloat(maxWight) < 0.5) {
            return result;
        }
        result = drlVarList[weightList.indexOf(maxWight)].getPrefixVarName();
        return result;
    }
}

// 获取两个单词的相似度
export const getMatchingWeight = (source, target) => {
    if (isContainEmpty([source, target])) return 0;
    let result = 0;
    result = result + getCharListDistance(getNgramChar(source, 2), getNgramChar(target, 2));
    return result.toFixed(2)
};

// 获取json中包含特殊字符的key
export function keySpCharList(jsObj, keyInSpCharList) {
    if (isEmpty(jsObj)) return;
    let keyList = Object.keys(jsObj);
    keyList.forEach(key => {
        let reg = new RegExp(/[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）\-+={}|《》？：“”【】、；‘’，。、\s]/g);
        if (reg.test(key)) {
            keyInSpCharList.push(key);
        }

        if (isEmpty(key)) {
            throw new Error("key不能为空");
        }

        if (typeof jsObj[key] === 'object') {
            keySpCharList(jsObj[key], keyInSpCharList);
        }
    });
}


// 验证输入解析报文数据格式
export const validateAJ = (rule, value, callback)=>{
    if (checkJsonParam(value)){
        callback();
    } else {
        callback(new Error(`格式不正确`));
    }
};

// 验证是否是json对象
export const validateJsonObj = (rule, value, callback) => {
    try {
        JSON.parse(value);
        callback();
    } catch (e) {
        callback(new Error('json格式异常'))
    }
};


// 验证中文字符
export const validateChinese = (rule, value, callback) => {
    let reg = new RegExp(/[\u4e00-\u9fa5]/g);
    if (reg.test(value)) {
        callback(new Error('有中文字符'))
    } else {
        callback();
    }
};

/**
 * 验证函数命名规范
 * @param rule
 * @param value
 * @param callback
 */
export const validateFuncName = (rule, value, callback) => {
    let reg = new RegExp('^[a-zA-Z].*');
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error('函数Id请以字母开头'))
    }
}

/**
 * 验证crontab表达式
 * @param rule
 * @param value
 * @param callback
 */
export const validateCrontab = (rule, value, callback) => {
    // let reg = new RegExp('(((^([0-9]|[0-5][0-9])(\\\\,|\\\\-|\\\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\\\* ))((([0-9]|[0-5][0-9])(\\\\,|\\\\-|\\\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\\\* ))((([0-9]|[01][0-9]|2[0-3])(\\\\,|\\\\-|\\\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\\\* ))((([0-9]|[0-2][0-9]|3[01])(\\\\,|\\\\-|\\\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\\\? )|(\\\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\\\,|\\\\-|\\\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\\\* ))(([1-7](\\\\,|\\\\-|\\\\/){1}[1-7])|([1-7])|(\\\\?)|(\\\\*)|(([1-7]L)|([1-7]\\\\#[1-4]))))|(((^([0-9]|[0-5][0-9])(\\\\,|\\\\-|\\\\/){1}([0-9]|[0-5][0-9]) )|^([0-9]|[0-5][0-9]) |^(\\\\* ))((([0-9]|[0-5][0-9])(\\\\,|\\\\-|\\\\/){1}([0-9]|[0-5][0-9]) )|([0-9]|[0-5][0-9]) |(\\\\* ))((([0-9]|[01][0-9]|2[0-3])(\\\\,|\\\\-|\\\\/){1}([0-9]|[01][0-9]|2[0-3]) )|([0-9]|[01][0-9]|2[0-3]) |(\\\\* ))((([0-9]|[0-2][0-9]|3[01])(\\\\,|\\\\-|\\\\/){1}([0-9]|[0-2][0-9]|3[01]) )|(([0-9]|[0-2][0-9]|3[01]) )|(\\\\? )|(\\\\* )|(([1-9]|[0-2][0-9]|3[01])L )|([1-7]W )|(LW )|([1-7]\\\\#[1-4] ))((([1-9]|0[1-9]|1[0-2])(\\\\,|\\\\-|\\\\/){1}([1-9]|0[1-9]|1[0-2]) )|([1-9]|0[1-9]|1[0-2]) |(\\\\* ))(([1-7](\\\\,|\\\\-|\\\\/){1}[1-7] )|([1-7] )|(\\\\? )|(\\\\* )|(([1-7]L )|([1-7]\\\\#[1-4]) ))((19[789][0-9]|20[0-9][0-9])\\\\-(19[789][0-9]|20[0-9][0-9])))');
    let reg = new RegExp('^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*))$');
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error('不符合crontab表达式'))
    }
}

//驼峰转换
export const humpConversion = (str) => {
    if (typeof str !== 'string') return str;
    let str1 = str.toLowerCase().replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
    return str1;
};

//与或映射关系
export const andOrEnums = {
    '0': {code: '0', name: "或"},
    '1': {code: '1', name: "与"},
};
/**
 * 操作枚举
 * @type {{}}
 */
export const changeTypeEnums = {
   /* "create": "新建",
    "modify": "修改",
    "online": "启用",
    "offline": "停用",
    "check": "验证",
    public: "发布",*/
    create: {code: "create", name: "新建"},
    modify: {code: "modify", name: "修改"},
    save: {code: "save", name: "保存"},
    check: {code: "check", name: "验证"},
    public: {code: "public", name: "发布"},
    online: {code: "online", name: "启用"},
    offline: {code: "offline", name: "停用"},
    delete: {code: "delete", name: "删除"},
};

// 标签类型
export const tagType = {
    '0': 'warning',
    '1': 'primary',
    '2': 'success',
    'Y': 'success',
    'N': 'warning',
    "create":'primary',
    "modify":'warning',
    "save":'primary',
    "check":'primary',
    "public": 'success',
    "online": 'success',
    "delete": 'danger',
    "offline":'warning'
};

//状态枚举
export const statusEnums = {
    '0': {code: '0', name: "草稿"},
    '1': {code: '1', name: "已验证"},
    '2': {code: '2', name: "已发布"},
    'Y': {code: "Y", name: "启用"},
    'N': {code: "N", name: "停用"}
};

//状态枚举
export const funcTypeEnums = {
    '0': {code: '0', name: "drools"},
    '1': {code: '1', name: "java"},
};

//接入类型
export const inteTypeEnums = {
    'H': {code: 'H', name: "HTTP"},
    'K': {code: 'K', name: "KAFKA"},
};

// 编码类型
export const codingTypeEnums = {
    'GB2312': {code: 'GB2312', name: 'GB2312'},
    'GBK': {code: 'GBK', name: 'GBK'},
    'UTF-8': {code: 'UTF-8', name: 'UTF-8'},
};

// 文件类型
export const fileTypeEnums = {
    'd': {code: 'd', name: '.dat文件'},
    't': {code: 't', name: '文本'},
};

//字符串判空
export const validateNullChar = (rule, value, callback) => {
    if (isEmpty(value.replace(/\s+/g, ""))) {
        callback(new Error('输入为空字符'))
    } else {
        callback();
    }
};
/**
 * 验证特殊字符
 * @param rule
 * @param value
 * @param callback
 */
export const  validateSpChar = (rule, value, callback) => {
    let reg  = new RegExp(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、\s]/g);
    if(reg.test(value)){
        callback(new Error('有特殊字符'))
    } else {
        callback();
    }
};

// 特殊字符不包含下划线
export const  validateSpCharExcludeXHX = (rule, value, callback) => {
    let reg  = new RegExp(/[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、\s]/g);
    // let reg  = new RegExp(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、\s]/g);
    if(reg.test(value)){
        callback(new Error('有特殊字符'))
    } else {
        callback();
    }
};

/**
 * 验证是否是 jsonObject 类型数据
 * @param rule
 * @param value
 * @param callback
 */
export const  validateJSONObject = (rule, value, callback) => {
    try {
        debugger
        let json = JSON.parse(value);
        if (Object.prototype.toString.call(json)  !== '[object Object]'){
            callback(new Error('不是对象类型的json格式'))
        }
    } catch (e) {
        callback(new Error('不是json格式'))
    }
    callback();
};

/**
 * 验证是否是 jsonArray 类型数据
 * @param rule
 * @param value
 * @param callback
 */
export const  validateJSONArray = (rule, value, callback) => {
    try {
        debugger
        let json = JSON.parse(value);
        if (Object.prototype.toString.call(json)  !== '[object Array]'){
            callback(new Error('不是数组类型的json格式'))
        }
    } catch (e) {
        callback(new Error('不是json格式'))
    }
    callback();
};

export const validateVarSpChar = (rule, value, callback) => {
    try {
        let jsObj = JSON.parse(value);
        let keyList = [];
        keySpCharList(jsObj, keyList);
        if (keyList.length === 0){
            callback();
        } else {
            callback(new Error(`${keyList.join(",")}中有特殊字符`));
        }
    } catch (e) {
        console.warn(e);
        callback(new Error(e.message))
    }
};

// 验证大写
export const validateUpperChar = (rule, value, callback) => {
    let reg = new RegExp(/[A-Z].*/g);
    if (reg.test(value)) {
        callback(new Error('不能有大写'))
    } else {
        callback();
    }
};


/**
 * 验证网址
 * @param rule
 * @param value
 * @param callback
 */
export const  validateURL = (rule, value, callback) => {
    let reg  = new RegExp(/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/g);
    if(reg.test(value)){
        callback(new Error('不是网址'))
    } else {
        callback();
    }
};

/**
 * 验证只包含数字
 * @param rule
 * @param value
 * @param callback
 */
export const validateDigtalNum = (rule, value, callback) => {
    let reg = new RegExp('^[0-9]+$');
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error('ystId只能是数字'))
    }
};

/**
 * 验证ystId只能配置一个产品
 * @param rule
 * @param value
 * @param callback
 */
export const validateYstId = (rule, value, callback) => {
    let params = {ystId: value};
    getProdmanageByYstId(params).then(res => {
        if (res.data.data !== null){
            callback(new Error('该人员已经配置了产品信息'))
        } else {
            callback();
        }
    })
};

/**
 * tab类型
 */
export const tabType = {
    decsRuleSetting: 'decsRuleSetting',
    decsEdit: 'DecsEdit',
    decsVersion: 'DecsVersion',
    decsHis: 'DecsHis',
    decsCode: 'DecsCode',
    decsFlow: 'DecsFlow',
    decsTable: 'DecsTable',

    eventsourceTable:'EventsourceTable',
    ruleFlow: 'RuleFlow',
    ruleCode: 'RuleCode',
    eventsourceHis: 'EventsourceHis',
    eventsourceVersion: 'EventsourceVersion',
    funcHome: 'FuncHome',
    funcHis: 'FuncHis',
    funcVersion: 'FuncVersion',
};

/*
* 校验勾选的发布组件
* */
export const checkPublishSelectedFuncVersionList = function (selectedFuncBaseList,that) {
    if (isEmpty(selectedFuncBaseList) || selectedFuncBaseList.length === 0) {
        that.$alert('请选择需发布的函数', '警告', {
            confirmButtonText: '确定',
            type: 'error'
        });
        return;
    }
    let failList = [];
    failList = selectedFuncBaseList.filter(item=>item.status !== '1');
    if (failList.length > 0) {
        warningTip('函数' + failList.join(',') + '的当前状态不允许发布!');
        return false;
    }
    return true;
};



// 根据路径的最后个名字自动映射
export function autoMappingByName(ruleVarName, refVarList) {
    let result = '';
    let ruleVarNameOfSuffix = ruleVarName.split("_");
    let weightList = refVarList.map(evVar => {
        let evVarOfSuffix = evVar.getVarName().split("_");
        return getMatchingWeight(evVarOfSuffix[evVarOfSuffix.length - 1], ruleVarNameOfSuffix[ruleVarNameOfSuffix.length - 1]);
    });
    let maxWight = Math.max(...weightList).toFixed(2);
    if (parseFloat(maxWight) < 0.5) {
        return result;
    }
    result = refVarList[weightList.indexOf(maxWight)].getPrefixVarName();
    return result;
}


// 获取两个字符数组的相似度
export const getCharListDistance = (charList1, charList2) => {
    let matchLeftNum = 0;
    let matchRightNum = 0;
    charList1.forEach(char => {
        if (charList2.indexOf(char) !== -1) {
            matchLeftNum = matchLeftNum + 1;
        }
    });

    charList2.forEach(char => {
        if (charList1.indexOf(char) !== -1) {
            matchRightNum = matchRightNum + 1;
        }
    });
    return (matchLeftNum + matchRightNum) / (charList1.length + charList2.length);
};


// 对单词进行滑动窗口
export const getNgramChar = (word, ngram) => {
    if (isEmpty(word)) return [];
    let result = [];
    let charList = word.split('');
    for (let index = 0; index < word.length - ngram + 1; index++) {
        result.push(charList.slice(index, ngram + index).join("").toLowerCase())
    }
    return result;
};
