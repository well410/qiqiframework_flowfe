import {statusTypeConstants} from "../../constants/status-type";
import {changeTypeConstants} from "../../constants/change-type";
import {warningTip, isEmpty, isNull, isRepeat, isEmptyArray} from "../../utils/tools";

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

/**
 * 验证网址
 * @param rule
 * @param value
 * @param callback
 */
export const  validateChinese = (rule, value, callback) => {
    let reg  = new RegExp(/[\u4e00-\u9fa5]/g);
    if(reg.test(value)){
        callback(new Error('有中文字符'))
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
    if (reg.test(value)) {
        callback(new Error('不是网址'))
    } else {
        callback();
    }
};

/**
 * tab类型
 */
export const tabType = {
    'httpInterface': 'httpInterface',
    'kafkaInterface': 'kafkaInterface',
    'modelInterface': 'modelInterface',
    'httpInterfaceConfig': 'httpInterfaceConfig',
    'httpInterfaceDebug': 'httpInterfaceDebug',
    'kafkaInterfaceConfig': 'kafkaInterfaceConfig',
    'kafkaInterfaceDebug': 'kafkaInterfaceDebug',
    'modelInterfaceConfig': 'modelInterfaceConfig',
    'modelInterfaceDebug': 'modelInterfaceDebug',
};

/**
 * 操作类型
 */
export const actType = {
    'httpAdd': 'http-add',
    'httpEdit': 'http-edit',
    'httpDebug': 'http-debug',
    'httpHistory': 'http-history',
    'httpVersion': 'http-version',
    'kafkaAdd': 'kafka-add',
    'kafkaEdit': 'kafka-edit',
    'kafkaDebug': 'kafka-debug',
    'kafkaHistory': 'kafka-history',
    'kafkaVersion': 'kafka-version',
    'modelAdd': 'model-add',
    'modelEdit': 'model-edit',
    'modelDebug': 'model-debug',
    'modelHistory': 'model-history',
    'modelVersion': 'model-version',
};

/**
 * 接口类型
 */
export const inteType = {
    'H': 'Http',
    'K': 'Kafka',
    'M': 'Model',
};

/**
 * 路由路径
 */
export const routePath = {
    'httpBasePath': '/http-components-manage',
    'kafkaBasePath': '/kafka-components-manage',
    'modelBasePath': '/model-components-manage',
    'httpActionPath': '/http-components-manage/http-interface-action',
    'kafkaActionPath': '/kafka-components-manage/kafka-interface-action',
    'modelActionPath': '/model-components-manage/model-interface-action',
    'httpVersionPath': '/http-components-manage/cmpt-version',
    'httpCitationPath': '/http-components-manage/cmpt-citation',
    'httpHistoryPath': '/http-components-manage/cmpt-history',
    'kafkaVersionPath': '/kafka-components-manage/cmpt-version',
    'kafkaCitationPath': '/kafka-components-manage/cmpt-citation',
    'kafkaHistoryPath': '/kafka-components-manage/cmpt-history',
    'modelVersionPath': '/model-components-manage/cmpt-version',
    'modelCitationPath': '/model-components-manage/cmpt-citation',
    'modelHistoryPath': '/model-components-manage/cmpt-history'
};

/**
 * 共享状态
 * */
export var store = {
    state: {
        tab: ''
    },
    setTabAction (newValue) {
        console.log('setTabAction triggered with', newValue);
        this.state.tab = newValue
    },
};

/**
 * 表格数据转换
 * */
export const statusFormatterCommon = (row) => {
    let text = '';
    switch (row.status) {
        case statusTypeConstants.DRAFT.value:
            text = statusTypeConstants.DRAFT.label;
            break;
        case statusTypeConstants.VERIFY.value:
            text =statusTypeConstants.VERIFY.label;
            break;
        case statusTypeConstants.PUBLISH.value:
            text = statusTypeConstants.PUBLISH.label;
            break;
        case statusTypeConstants.ACTIVATE.value:
            text = statusTypeConstants.ACTIVATE.label;
            break;
        case statusTypeConstants.DEACTIVATE.value:
            text = statusTypeConstants.DEACTIVATE.label;
            break;
        default:
    }
    return text;
};

export const changeTypeFormatterCommon = (row) => {
    let text = '';
    switch (row.changeType) {
        case changeTypeConstants.CREATE.value:
            text = changeTypeConstants.CREATE.label;
            break;
        case changeTypeConstants.MODIFY.value:
            text =changeTypeConstants.MODIFY.label;
            break;
        case changeTypeConstants.CHECK.value:
            text = changeTypeConstants.CHECK.label;
            break;
        case changeTypeConstants.DELETE.value:
            text = changeTypeConstants.DELETE.label;
            break;
        case changeTypeConstants.OFFLINE.value:
            text = changeTypeConstants.OFFLINE.label;
            break;
        case changeTypeConstants.ONLINE.value:
            text = changeTypeConstants.ONLINE.label;
            break;
        case changeTypeConstants.PUBLIC.value:
            text = changeTypeConstants.PUBLIC.label;
            break;
        case changeTypeConstants.SAVE.value:
            text = changeTypeConstants.SAVE.label;
            break;
        default:
    }
    return text;
};

/**
 * 校验勾选的发布组件
 * */
export const checkPublishSelectedCmptVersionList = function (selectedCmptBaseList) {
    if (isEmpty(selectedCmptBaseList) || selectedCmptBaseList.length === 0) {
        warningTip('没有勾选中任何对象！');
        return false;
    }
    let failList = [];
    for (let i = 0; i < selectedCmptBaseList.length; i++) {
        let cmptBase = selectedCmptBaseList[i];
        if (statusTypeConstants.VERIFY.value !== cmptBase.status) {
            failList.push(cmptBase.cmptId);
        }
    }
    if (failList.length > 0) {
        warningTip('组件' + failList.join(',') + '的当前状态不允许发布!');
        return false;
    }
    return true;
};

/**
 * 从配置的参数信息中获取InputExample
 * */
export const getInputExample = function(interfaceDto) {
    let inputExample = {
        "requestParam" : {},
        "pathVariable": {},
        "headerConfig": isEmpty(interfaceDto.headerConfigExample) ? {} : JSON.parse(JSON.stringify(interfaceDto.headerConfigExample)),
        "requestBody": interfaceDto.configuration.requestType == '2' ? JSON.parse(interfaceDto.requestBodyWithValue) : {}
    };
    for (let i in interfaceDto.requestParam) {
        if (!interfaceDto.requestParam.hasOwnProperty(i)) continue;
        let requestParamTmp = JSON.parse(JSON.stringify(interfaceDto.requestParam[i]));
        let tmp = {};
        tmp[requestParamTmp.cmptVarName] = requestParamTmp.cmptVarValue;
        Object.assign(inputExample.requestParam, tmp);
    }
    for (let i in interfaceDto.pathVariable) {
        if (!interfaceDto.pathVariable.hasOwnProperty(i)) continue;
        let pathVariableTmp = JSON.parse(JSON.stringify(interfaceDto.pathVariable[i]));
        let tmp = {};
        tmp[pathVariableTmp.cmptVarName] = pathVariableTmp.cmptVarValue;
        Object.assign(inputExample.pathVariable, tmp);
    }
    return JSON.stringify(inputExample);
};

/**
 * 从配置的参数信息中获取annlysisJson
 * 1.获取requestParams
 * 2.获取pathVariable
 * 3.获取requestBody
 * */
export const getAnalysisJson = function(interfaceDto) {
    let analysisJson = {
        "requestParam" : [],
        "pathVariable": [],
        "headerConfig": isEmpty(interfaceDto.headerConfig) ? {} : JSON.parse(JSON.stringify(interfaceDto.headerConfig)),
        "requestBody": interfaceDto.configuration.requestType == '2' ? JSON.parse(interfaceDto.requestBody) : {}
    };
    for (let i in interfaceDto.requestParam) {
        if (!interfaceDto.requestParam.hasOwnProperty(i)) continue;
        let requestParamTmp = JSON.parse(JSON.stringify(interfaceDto.requestParam[i]));
        delete requestParamTmp.cmptVarValue;
        analysisJson.requestParam.push(requestParamTmp);
    }
    for (let i in interfaceDto.pathVariable) {
        if (!interfaceDto.pathVariable.hasOwnProperty(i)) continue;
        let pathVariableTmp = JSON.parse(JSON.stringify(interfaceDto.pathVariable[i]));
        delete pathVariableTmp.cmptVarValue;
        analysisJson.pathVariable.push(pathVariableTmp);
    }
    return JSON.stringify(analysisJson)
};

/**
 * 组件名固定前缀
 */
export const prefixOfCmpt = 'cmpt_';

/**
 * 标签类型
 */
export const tagType = {
    '0': 'warning',
    '1': 'primary',
    '2': 'success',
    'Y': 'success',
    'N': 'warning',
    'H': 'primary',
    'K': 'success',
};

/**
 * 组件状态
 * */
export const statusType = {
    'base': [
        {'value': '0', 'label': '草稿'},
        {'value': '1', 'label': '已验证'},
        {'value': '2', 'label': '已发布'}
    ],
    'version': [
        {'value': 'Y', 'label': '启用'},
        {'value': 'N', 'label': '停用'}
    ]
};

/**
 * 参数类型
 * */
export const paramType = [
    {'value':'string', 'label': 'String'},
    {'value':'int', 'label': 'Integer'},
    {'value':'double', 'label': 'Double'},
    {'value':'timestamp', 'label': 'Timestamp'},
    {'value':'object', 'label': 'Object'},
    {
        'value':'list',
        'label': 'List',
        'children': [{
            'value':'string',
            'label': 'String'
        }, {
            'value':'int',
            'label': 'Integer'
        }, {
            'value':'double',
            'label': 'Double'
        }, {
            'value':'timestamp',
            'label': 'Timestamp'
        }, {
            'value':'object',
            'label': 'Object'
        }]
    }
];

/**
 * 参数是否必须
 * */
export const required = [
    {'value':'true', 'label': '必需'},
    {'value':'false', 'label': '非必需'},
];
/**
 * 校验模型组件
 *
 */
export const checkModelDto = function (interfaceDto) {
    if (isEmpty(interfaceDto)) {
        warningTip('保存对象为空！！');
        return false;
    }
    if(isEmpty(interfaceDto.cmptName)){
        warningTip('组件名不得为空！');
        return false;
    }
    if(isEmpty(interfaceDto.cmptIdWithoutPrefix)){
        warningTip('组件ID不得为空！');
        return false;
    }
    let reg = new RegExp(/[`~!@#$%^&*()+=<>?:"{}|,.\/;'\\[\]·！￥…（）《》？：“”【】、；‘’，。\s]/g);
    if (reg.test(interfaceDto.cmptIdWithoutPrefix)) {
        warningTip('组件ID不能包含特殊字符！');
        return false;
    }
    return true;
}
/**
 * 校验需要保存的组件
 * */
export const checkInterfaceDto = function (interfaceDto) {
    if (isEmpty(interfaceDto)) {
        warningTip('保存对象为空！！');
        return false;
    }
    if(isEmpty(interfaceDto.cmptName)){
        warningTip('组件名不得为空！');
        return false;
    }
    if(isEmpty(interfaceDto.cmptIdWithoutPrefix)){
        warningTip('组件ID不得为空！');
        return false;
    }
    let reg = new RegExp(/[`~!@#$%^&*()+=<>?:"{}|,.\/;'\\[\]·！￥…（）《》？：“”【】、；‘’，。\s]/g);
    if (reg.test(interfaceDto.cmptIdWithoutPrefix)) {
        warningTip('组件ID不能包含特殊字符！');
        return false;
    }
    if (interfaceDto.inteType === 'H') {
        if (!checkHttpConfig(interfaceDto.configuration)) {
            return false;
        }
        if (!checkHttpURIVariables(interfaceDto.requestParam, interfaceDto.pathVariable)) {
            return false;
        }
        //校验RequestBody
        if (interfaceDto.configuration.requestType == '2' && !checkJsonParam(interfaceDto.requestBody)) {
            return false;
        }
        //校验responseAnalysisForDisplay
        if (!checkJsonParam(interfaceDto.responseAnalysisForDisplay)) {
            return false;
        }
    } else if (interfaceDto.inteType === 'K') {
        if (!checkKafkaConfig(interfaceDto.configuration)) {
            return false;
        }
        //校验Parameter
        if (!checkJsonParam(interfaceDto.parameter)) {
            return false;
        }
    } else if (interfaceDto.inteType === 'M') {
        //if (!checkModelConfig(interfaceDto.configuration)) {
        //    return false;
        //}
        //校验RequestBody
        if (!checkJsonParam(interfaceDto.requestBody)) {
            return false;
        }
        //校验responseAnalysisForDisplay
        if (!checkJsonParam(interfaceDto.responseAnalysisForDisplay)) {
            return false;
        }
    }


    return true;
};

/**
 * 校验http组件的配置信息
 * */
export const checkHttpConfig = function (configuration) {
    if(isEmpty(configuration.uri)){
        warningTip('URL不得为空！');
        return false;
    }
    return true;
};

/**
 * 校验kafka组件的配置信息
 * */
export const checkKafkaConfig = function (configuration) {
    if(isEmpty(configuration.bootstrapServer)){
        warningTip('BootstrapServer不得为空！');
        return false;
    }
    if(isEmpty(configuration.topic)){
        warningTip('Topic不得为空！');
        return false;
    }
    if(configuration.topic.includes(',')){
        warningTip('Topic的个数不能超过一个！');
        return false;
    }
    // if(isEmpty(configuration.userName)){
    //     warningTip('UserName不得为空！');
    //     return false;
    // }
    // if(isEmpty(configuration.password)){
    //     warningTip('Password不得为空！');
    //     return false;
    // }
    return true;
};

/**
 * 校验URI中的参数
 * */
export const checkHttpURIVariables = function (requestParam, pathVariable) {
    //校验请求参数
    for (let i = 0; i < requestParam.length; i++) {
        let param = requestParam[i];
        if (!isEmpty(param.cmptVarName) && isEmpty(param.cmptVarDesc)) {
            warningTip('RequestParam中参数' + param.cmptVarName + '的参数描述不得为空！');
            return false;
        }
    }
    // 校验请求参数是否有重复的变量
    let hasRequestParam = {};
    for(let i in requestParam) {
        if (!requestParam.hasOwnProperty(i)) continue;
        if (hasRequestParam[requestParam[i].cmptVarName]) {
            warningTip('RequestParam中参数' + requestParam[i].cmptVarName + '重复！');
            return false;
        }
        hasRequestParam[requestParam[i].cmptVarName] = true;
    }
    //校验URL变量
    for (let i = 0; i < pathVariable.length; i++) {
        let param = pathVariable[i];
        if (!isEmpty(param.cmptVarName) && isEmpty(param.cmptVarDesc)) {
            warningTip('PathVariable中参数' + param.cmptVarName + '的参数描述不得为空！');
            return false;
        }
    }
    // 校验URL变量是否有重复的变量
    let hasPathVariable = {};
    for(let i in pathVariable) {
        if (!pathVariable.hasOwnProperty(i)) continue;
        if (hasPathVariable[pathVariable[i].cmptVarName]) {
            warningTip('PathVariable中参数' + pathVariable[i].cmptVarName + '重复！');
            return false;
        }
        hasPathVariable[pathVariable[i].cmptVarName] = true;
    }
    return true;
};


const types = ['String', 'Integer', 'Double', 'Timestamp', 'object' , 'array', 'boolean'];

/**
 * 校验Json格式参数
 * */
export const checkJsonParam = function (jsonParam) {
    try {
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
export const checkJsonParamRecursion = function (_objectParam, _types) {
    for (let key in _objectParam) {
        if (!_objectParam.hasOwnProperty(key)) continue;
        let param = _objectParam[key];
        //String类型的数据不用instanceof进行判断的原因：param只是一个以string为数据类型的值，但并不属于String对象的实例
        console.log(typeof(param));
        if (typeof(param) == 'string') {
            let value = param.split('-');
            if (value.length !== 2 || !_types.includes(value[1])) {
                let msg = `参数${key}的格式不正确（正确格式，e.g. 参数名: 参数描述-参数类型, 参数类型：${_types.join(",")}）`;
                warningTip(msg);
                return false;
            }
        } else if (param instanceof Object) {
            if (!checkJsonParamRecursion(param, _types)) {
                return false;
            }
        } else if (param instanceof Array) {
            for (let i in param) {
                if (!param.hasOwnProperty(i)) continue;
                if (!checkJsonParamRecursion(param[i], _types)) {
                    return false;
                }
            }
        }else if (typeof(param) == 'number') {
            let msg = '参数' + key + '的格式不正确（正确格式，e.g. 参数名: 参数描述-参数类型, 参数类型：String,Integer,Double,Timestamp,object,array,boolean）';
            warningTip(msg);
            return false;
        }
    }
    return true;
};

/**
 * 校验发送参数
 * */
export const checkInputExample = function (params) {
    for (let i = 0; i < params.length; i++) {
        let param = params[i];
        // 若参数为必需但确没有值则返回false
        if ('0' === param.key.required && isEmpty(param.value)) {
            let msg = param.key.cmptVarName + '的值不得为空！';
            warningTip(msg);
            return false;
        }
    }
    return true;
};

/**
 * 获取变换类型，用于操作历史
 */
export const getChangeType = function (act) {
    let changeType = '';
    switch (act) {
        case actType.modelAdd:
        case actType.httpAdd:
        case actType.kafkaAdd:
            changeType = changeTypeConstants.CREATE.value;
            break;
        case actType.modelEdit:
        case actType.modelDebug:
        case actType.httpEdit:
        case actType.httpDebug:
        case actType.kafkaEdit:
        case actType.kafkaDebug:
            changeType = changeTypeConstants.MODIFY.value;
            break;
        default:
    }
    return changeType;
};
