import {isEmpty} from "../../utils";

function varNameFilter(item) {
    return item.replace(/[\u4e00-\u9fa5]/g, "").replace(/[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+=｛｝|《》？：“”【】、；‘’，。、\s]/g, "");
}

function uResultLogicFilter(item) {
    return item.replace(/[\u4e00-\u9fa5]/g, "").replace(/[a-zA-Z]/g, "").replace(/[`~@#$%^*\-+=<>?:"{},.\/;'\\[\]·~！@#￥%……*（）——\-+={}《》？｛｝：“”【】、；‘’，。、]/g, "");
}

export const testEnums = {
    DEFAULT: {code: "DEFAULT", name: "默认测试（全部测试）"},
    ONE_NODE: {code: "ONE_NODE", name: "单节点测试"},
};

/**
 * 文案
 * @type {{}}
 */
export const messageEnums = {
    CD_REL_PLACEHOLDER :{
        name : "引用",
    },

    CD_J_PATH_PLACEHOLDER :{
      name : "jPath语法",
    },

    CD_EDIT_PLACEHOLDER :{
        name : "输入",
    },

    REQUEST_MAPPING_ID: {
        name: "请求ID"
    },

    REQUEST_MAPPING_URL: {
        name: "请求路径"
    },

    REQUEST_MAPPING_DESC: {
        name: "请求描述"
    },


    DECS_GROUP_ID: {
        name: "决策组ID"
    },

    DECS_ID: {
        name: "决策ID"
    },

    DECS_VERSION: {
        name: "决策版本"
    },

    CREATE_TIME: {
        name: "创建时间"
    },

    CREATE_USER: {
        name: "创建人"
    },

    UPDATE_TIME: {
        name: "修改时间"
    },

    UPDATE_USER: {
        name: "修改人"
    },

    VAR_NAME_ALIAS: {
        name: "名称(别名)"
    },

    VAR_NAME_REAL: {
        name: "名称(真实)"
    },

    VAR_NAME_DEFAULT: {
        name: "名称(常规)"
    },

    VAR_NAME_TYPE: {
        name: "名称类型"
    },

    VAR_TYPE: {
        name: "类型"
    },

    VAR_DESC: {
        name: "变量描述"
    },

    VAR_VALUE: {
        name: "变量值",
    },

    PARSE_PATH: {
        name: "解析路径"
    },

    PARSE_OBJECT: {
        name: "解析对象"
    },

    PARSE_OBJECT_TYPE: {
        name: "解析对象类型"
    },

    CONFIG_OF_FIELD: {
        name: "字段配置",
    },

    CONFIG_OF_CODE: {
        name: "代码配置"
    },

    CONFIG_OF_PARSE: {
        name: "解析配置"
    },

    CONFIG_OF_FUNC:{
      name :"函数配置"
    },

    CONFIG_OF_ARR_OPT:{
        name:"数组操作配置"
    }


};

/**
 * 实体类型
 * @type {{RULE: {code: string, name: string}, DECS: {code: string, name: string}}}
 */
export const entityEnums = {
    DECS: {
        code: "DECS",
        name: "决策"
    },
    RULE: {
        code: "RULE",
        name: "规则"
    }
};

/**
 * 路由的查询参数
 * @type {{DECS_ID: {code: string, name: string}, TAB: {code: string, name: string}, RULE_ID: {code: string, name: string}, PROD_ID: {code: string, name: string}}}
 */
export const rQueryEnums = {
    PROD_ID: {
        code: "prodId",
        name: "产品id",
    },

    DECS_ID: {
        code: "decsId",
        name: "决策id",
    },

    TAB: {
        code: "tab",
        name: "切换的标签页",
    },

    DECS_GROUP_ID:{
        code: "decsGroupId",
        name: "决策组id",
    },

    RULE_ID: {
        code: "ruleId",
        name: "规则id",
    },

    ROUTER_PATH: {
        code: "routerPath",
        name: "路由地址",
    },

    FROM_PAGE: {
        code: "fromPage",
        name: "来自页面",
    }
};

/**
 * 与后台中的类一致，查看后台下面的类
 * @see com.cmbchina.ns.tcs.common.enums.DroolsBeanEnums
 * @type {{EXT_RULE_SERVICE: {EXEC: string, code: string, name: string}, REDIS_SERVICE: {code: string, name: string, GET_VAR_LIST_VALUE: string}, COMP_VARS_SERVICE: {code: string, DEFAULT_FUNC_NAME: string, name: string}, CMPT_SEND_BATCH: {SEND_BATCH: string, code: string, name: string, INSERT_JDBC: string, ADD_OR_UPDATE_JDBC: string}, REDIS_SERVICE_V2: {GET_RDV_BY_CONFIG: string, code: string, name: string}}}
 */
export const beanEnums = {
    ER_LOOP_SERVICE: {
        code: "erLoopService",
        name: "循环规则服务",
        // 该 bean 中使用的函数
        EXEC_V2: "execV2",
    },

    REDIS_SERVICE: {
        code: "redisService",
        name: "redis服务",
        // 该 bean 中使用的函数
        GET_VAR_LIST_VALUE: "getVarListValue",
    },

    REDIS_SERVICE_V2: {
        code: "redisServiceV2",
        name: "redis服务第二个版本",
        // 该 bean 中使用的函数
        GET_RDV_BY_CONFIG: "getRDVByConfig",
    },

    EXT_RULE_SERVICE: {
        code: "extRuleService",
        name: "外部规则服务",
        // 该 bean 中使用的函数
        EXEC: "exec",
        EXEC_V2: "execV2",
    },

    CMPT_SEND_BATCH: {
        code: "cmptSendBatch",
        name: "redis服务",
        // 该 bean 中使用的函数
        INSERT_JDBC: "insertJdbc",
        ADD_OR_UPDATE_JDBC: "addOrUpdateJdbc",
        SEND_BATCH: "sendBatch",
    },

    COMP_VARS_SERVICE: {
        code: "compVarsService",
        name: "组合变量服务",
        // 该 bean 中使用的函数
        EXEC: "exec",
    },

    AVIATOR_SCRIPT_SERVICE: {
        code: "aviatorScriptService",
        name: "表达式语言函数",
        // 该 bean 中使用的函数
        BUILD_AND_EXEC_FOR_UR: "buildAndExecForUR",
    },

    UNIT_RULE_V2_SERVICE: {
        code: "unitRuleV2Service",
        name: "元规则-流程式服务",
        // 该 bean 中使用的函数
        EXEC: "exec",
    },

    MY_DROOLS_LISTENERS: {
        code: "myDroolsListeners",
        name: "自定义的事件监听",
        // 该 bean 中使用的函数
        EXEC_EXCEPTION_LISTENER: "execExceptionListener",
    },


};


export const dataTypeEnums = {
    STRING: {
        name: "字符串类型",
        code: "String",
        optClassName: 'StringOperation',
        optList: [
            {label: "等于", value: "eq"}, {label: "不等于", value: "notEq"},
            {label: "属于", value: "in"}, {label: "不属于", value: "notIn"},
            {label: "正则匹配", value: "match"}, {label: "正则匹配取反", value: "notMatch"}
        ],
    },
    TIMESTAMP: {
        name: "日期类型",
        code: "Timestamp",
        optClassName: 'DateOperation',
        optList: [
            {label: "等于", value: "eq"}, {label: "大于", value: "gt"},
            {label: "大于等于", value: "ge"}, {label: "小于", value: "lt"},
            {label: "小于等于", value: "le"}, {label: "n秒之前", value: "beforeSecond"},
            {label: "n秒以内", value: "recentSecond"}, {label: "n分之前", value: "beforeMinute"},
            {label: "n分以内", value: "recentMinute"}, {label: "n时之前", value: "beforeHour"},
            {label: "n时以内", value: "recentHour"},
        ],
    },
    INTEGER: {
        name: "整型",
        code: "Integer",
        optClassName: 'IntOperation',
        optList: [
            {label: "等于", value: "eq"}, {label: "不等于", value: "notEq"},
            {label: "大于", value: "gt"}, {label: "大于等于", value: "ge"},
            {label: "小于", value: "lt"}, {label: "小于等于", value: "le"},
            {label: "属于", value: "in"}, {label: "不属于", value: "notIn"}
        ]
    },
    DOUBLE: {
        name: "浮点型",
        code: "Double",
        optClassName: 'FloatOperation',
        optList: [
            {label: "大于", value: "gt"},
            {label: "小于", value: "lt"},
            {label: "等于", value: "eq"},
            {label: "大于等于", value: "ge"},
            {label: "小于等于", value: "le"},
        ]
    },
    OBJECT: {
        name: "对象",
        code: "object",
        optClassName: 'ObjectOperation',
        optList: [
            {label: "空", value: "isNull"},
            {label: "非空", value: "isNotNull"}
        ]
    },
    ARRAY: {
        name: "数组类型",
        code: "array",
        optClassName: 'ArrayOperation',
        optList: [
            {label: "包含", value: "contains"}, {label: "不包含", value: "notContains"},
            {label: "属于", value: "memberOf"}, {label: "不属于", value: "notMemberOf"},
            {label: "有交集", value: "haveIntersection"}, {label: "无交集", value: "noIntersection"},
            {label: "长度等于", value: "lenEQ"}, {label: "长度大于", value: "lenGT"}, {label: "长度小于", value: "lenLT"},
        ]
    },
    BOOLEAN :{
        name : "boolean类型",
        code : "boolean",
        optClassName : 'ObjectOperation',
        optList: [
            {label: "是否是True", value: "obj2Boolean"},
            {label: "是否是False", value: "isFalse"},
        ]
    }

};

/**
 * 对整个项目的数据类型的操作
 * @see dataTypeEnums
 */
export class DataTypeEnumsClass {
    /**
     * 获取本项目中能用到的所有数据类型
     * @returns {(string)[]}
     */
    static getDataTypeList() {
        return Object.values(dataTypeEnums).map((item) => item.code)
    }

    /**
     * 获取操作列表
     * @param key
     */
    static getOptListByKey(key) {
        if (!DataTypeEnumsClass.validateKey(key)) {
            return [];
        }
        return dataTypeEnums[key.toUpperCase()].optList;
    }

    /**
     * 获取操作类名
     * @param key
     */
    static getOptCName(key) {
        if (!DataTypeEnumsClass.validateKey(key)) {
            return "";
        }
        return dataTypeEnums[key.toUpperCase()].optClassName;
    }

    /**
     * 获取操作方法名称
     * @param key
     * @param opt
     */
    static getOptFuncName(key, opt) {
        if (!DataTypeEnumsClass.validateKey(key)) {
            return "";
        }
        const filterOptList = DataTypeEnumsClass.getOptListByKey(key).filter(item => item.value === opt);

        if (isEmpty(filterOptList)) {
            return "";
        } else {
            return filterOptList[0].label
        }
    }


    //=================本类中使用============================
    static validateKey(key) {
        if (!Object.keys(dataTypeEnums).includes(key.toUpperCase())) {
            console.warn(`${key}不存在`);
            return false;
        }
        return true;
    }
}


export const patternEnums = {
    VarName: {name: "变量名", decs: "数字，字母", varNameFilter: varNameFilter},
    UResultLogic: {name: "元规则条件组合逻辑", decs: "数字，括号，逻辑操作", uResultLogicFilter: uResultLogicFilter}
};

// 变量处理操作类型
export const optTypeEnums = {
    fun: {name: '函数', code: 'fun'},
    jsonPath: {name: 'json解析', code: 'jsonPath'},
};

// 数组操作
export const arrOptEnums = {
    MAX: {
        name: "最大值",
        code: "max",
        title: `求数组中的最大值，输入参数为(操作字段，数组对象)\n  操作字段：表示数组操作对象的路径，不填说明数组是如下格式[1,2,3]\n  数组对象：表示操作的数组`
    },
    MIN: {
        name: "最小值",
        code: "min",
        title: "求数组中的最小值，输入参数为(操作字段，数组对象)\n  操作字段：表示数组操作对象的路径，不填说明数组是如下格式[1,2,3]\n  数组对象：表示操作的数组"
    },
    MEAN: {
        name: "平均值",
        code: "mean",
        title: "求数组中的平均值，输入参数为(操作字段，数组对象)\n  操作字段：表示数组操作对象的路径，不填说明数组是如下格式[1,2,3]\n  数组对象：表示操作的数组"
    },
    IN: {
        name: "属于",
        code: "in",
        title: "求输入的值是否在数组，是返回true，否返回false，输入参数为(属于方法的值，操作字段，数组对象)\n  属于方法的值：A属于B，B为数组对象，A为属于方法的值\n  操作字段：表示数组操作对象的路径，不填说明数组是如下格式[1,2,3]\n  数组对象：表示操作的数组"
    },
};

// 评分卡计算方式
export const scTypeEnums = {
    SUM: {
        name: "求和",
        code: "sum",
        title: "计算所有的变量得分的和",
    },
    MAX: {
        name: "最大值",
        code: "max",
        title: "所有分数的最小值",
    },
    MIN: {
        name: "最小值",
        code: "min",
        title: "所有分数的最小值",
    },
    WSUM: {
        name: "加权求和",
        code: "wsum",
        title: "计算所有的变量加权得分的和",
    },
    AVG: {
        name: "平均",
        code: "avg",
        title: "计算所有的变量得分的平均值",
    },
    WAVG: {
        name: "加权平均",
        code: "wavg",
        title: "计算所有的变量加权得分的平均值",
    },
};

import arrSvg from "@/assets/icons/node/arr.svg";
import constantSvg from "@/assets/icons/node/constant.svg";
import httpSvg from "@/assets/icons/node/http.svg";
import jsonSvg from "@/assets/icons/node/json.svg";
import resultSvg from "@/assets/icons/node/result.svg";
import uRuleSvg from "@/assets/icons/node/urule.svg";
import codeSvg from "@/assets/icons/node/code.svg";
import varsSvg from "@/assets/icons/node/vars.svg";
import tqsVarsSvg from "@/assets/icons/node/tqs_vars.svg";
import dataPase from "@/assets/icons/node/data_pase.svg";
import extRuleSvg from "@/assets/icons/node/tree_rule.svg"; //074389
import data from "@/assets/icons/node/data.svg"
import compSvg from "@/assets/icons/node/comp.svg";
import scSvg from "@/assets/icons/node/scorecard.svg";
import rateCtrl from "@/assets/icons/node/rate_ctrl.svg";
import filterSvg from "@/assets/icons/node/filter.svg";
import dtSvg from "@/assets/icons/node/decs_table.svg";

// 侧边栏类别
export const compClazzEnums = {
    FLOW  :{name:"流程", code:"FLOW"},
    DATA_TRANSFORM :{name:"数据转换", code:"DATA_TRANSFORM"},
    DATA_BASE :{name:"数据库", code:"DATA_BASE"},
    NETWORK_SERVICE :{name:"网络服务", code:"NETWORK_SERVICE"},
    RESULT :{name:"结果", code:"RESULT"},
};

// 节点类型
export const compEnums = {

    /**
     * 外部规则节点循环节点
     * @see DataProcessNode
     */
    FILTER: {
        name: "数组过滤",
        code: "FILTER",
        type: "FILTER",
        icon: filterSvg,
        clazzList: [compClazzEnums.DATA_TRANSFORM.code]
    },

    /**
     * 外部规则节点循环节点
     * @see DataProcessNode
     */
    ER_LOOP: {
        name: "循环规则",
        code: "ER_LOOP",
        type: "ER_LOOP",
        icon: arrSvg,
        clazzList: [compClazzEnums.DATA_TRANSFORM.code]
    },

    /**
     * 流量控制节点
     * @see DataProcessNode
     */
    RATE_CTRL: {
        name: "流量控制",
        code: "RT_CTRL",
        type: "RT_CTRL",
        icon: rateCtrl,
        clazzList: [compClazzEnums.FLOW.code]
    },

    /**
     * 数据处理节点
     * @see DataProcessNode
     */
    DATA_PROCESS: {
        name: "数据处理(函数)",
        code: "DP",
        type: "DP",
        icon: dataPase,
        clazzList: [compClazzEnums.DATA_TRANSFORM.code]
    },

    /**
     * 表达式语言节点
     * @see AviatorScriptNode
     */
    AVIATOR_SCRIPT: {
        name: "AS(代码)",
        code: "AS",
        type: "AS",
        color: "#409EFF",
        icon: codeSvg,
        clazzList: [compClazzEnums.DATA_TRANSFORM.code]
    },

    /**
     * 元规则节点
     * @see UnitRuleNode
     */
    UR: {
        name: "元规则",
        code: "UR",
        type: "UR",
        color: "#409EFF",
        icon: uRuleSvg,
        clazzList: [compClazzEnums.FLOW.code]
    },

    URV2: {
        name: "元规则-流程式",
        code: "URV2",
        type: "URV2",
        color: "#409EFF",
        icon: uRuleSvg,
        clazzList: [compClazzEnums.FLOW.code]
    },

    /**
     * 元规则-流程式节点内部节点
     */
    UR_RN: {
        name: "元规则-流程式-结果节点",
        code: "UR_RN",
        type: "UR_RN",
        clazzList: [compClazzEnums.FLOW.code]
    },
    UR_CN: {
        name: "元规则-流程式-条件节点",
        code: "UR_CN",
        type: "UR_CN",
        clazzList: [compClazzEnums.FLOW.code]
    },

    UNIT_ROOT: {
        name: "元规则-流程式-根节点",
        code: "root-rect",
        type: "root-rect",
        clazzList: [compClazzEnums.FLOW.code]
    },
    UNIT_CON: {
        name: "元规则-流程式-条件节点",
        code: "condition-rect",
        type: "condition-rect",
        clazzList: [compClazzEnums.FLOW.code]
    },
    UNIT_RES: {
        name: "元规则-流程式-结果节点",
        code: "result-rect",
        type: "result-rect",
        clazzList: [compClazzEnums.FLOW.code]
    },
    UNIT_EDGE: {
        name: "元规则-流程式-边",
        code: "flowline",
        type: "flowline",
        clazzList: [compClazzEnums.FLOW.code]
    },


    /**
     * 组件节点
     * @see CmptNode
     */
    Cmpt: {
        name: "组件",
        code: "Cmpt",
        type: "Cmpt",
        color: "#E6A23C",
        icon: httpSvg,
        clazzList: [compClazzEnums.NETWORK_SERVICE.code]
    },


    /**
     * 变量节点v2
     * @see VarsNodeV2
     */
    VarsV2: {
        name: "变量平台",
        code: "VarsV2",
        type: "VarsV2",
        color: "#64894a",
        icon: varsSvg,
        clazzList: [compClazzEnums.DATA_BASE.code]
    },

    /**
     * 天擎变量节点
     * @see TqsVarsNodes
     */
    TqsVars: {
        name: "天擎变量",
        code: "TqsVars",
        type: "TqsVars",
        color: "#64894a",
        icon: tqsVarsSvg,
        clazzList: [compClazzEnums.NETWORK_SERVICE.code]
    },

    /**
     * 组合变量节点
     * @see CompVarsNode
     * 废弃
     */
    CompVars: {
        name: "组合变量",
        code: "CompVars",
        type: "CompVars",
        color: "#64894a",
        icon: compSvg,
        clazzList: [compClazzEnums.DATA_TRANSFORM.code]
    },

    /**
     * 决策结果节点
     * @see DecsResultNode
     */
    DR: {
        name: "决策结果",
        code: "DR",
        type: "DR",
        color: "#e6a2c8",
        icon: resultSvg,
        clazzList: [compClazzEnums.RESULT.code]
    },

    /**
     * JSON解析节点
     * @see ObjNode
     */
    Obj: {
        name: "JSON解析",
        code: "Obj",
        type: "Obj",
        color: "#35b6e6",
        icon: jsonSvg,
        clazzList: [compClazzEnums.DATA_TRANSFORM.code]
    },

    /**
     * 数组节点
     * @see ArrNode
     */
    Arr: {
        name: "数组函数",
        code: "Arr",
        type: "Arr",
        color: "#95b0e6",
        icon: arrSvg,
        clazzList: [compClazzEnums.DATA_TRANSFORM.code]
    },

    /**
     * 常量节点
     * @see ConstNode
     */
    Const: {
        name: "常量",
        code: "Const",
        type: "Const",
        color: "#9f8fe6",
        icon: constantSvg,
        clazzList: [compClazzEnums.DATA_TRANSFORM.code]
    },


    /**
     * 外部规则节点第二个版本
     * @see ExtRuleNodeV2
     */
    ERV2: {
        name: "外部规则",
        code: "ERV2",
        type: "ERV2",
        color: "#912b4d",
        icon: extRuleSvg,
        clazzList: [compClazzEnums.DATA_TRANSFORM.code]
    },

    /**
     * 规则结果节点
     * @see RuleResultNode
     */
    RR: {
        name: "规则结果",
        code: "RR",
        type: "RR",
        color: "#e6a2c8",
        icon: resultSvg,
        clazzList: [compClazzEnums.RESULT.code]
    }, //074389 规则结果节点

    /**
     * 入库组件
     * @see EvStoreNode
     */
    EVStore: {
        name: "入库组件",
        code: "EVS",
        type: "EVS",
        color: "#409EFF",
        icon: data,
        clazzList: [compClazzEnums.DATA_BASE.code]
    },

    /**
     * 评分卡节点
     * @see ScoreCardNode
     */
    SC: {
        name: "评分卡",
        code: "SC",
        type: "SC",
        color: "#60AEC2",
        icon: scSvg,
        clazzList: [compClazzEnums.FLOW.code]
    },

    /**
     * 决策表节点
     * @see DecsTableNode
     */
    DT: {
        name: "决策表",
        code: "DT",
        type: "DT",
        color: "#60AEC2",
        icon: dtSvg,
        clazzList: [compClazzEnums.FLOW.code]
    }
};


// 变量类
export const varNameTypeEnums = {
    S :{code:'S', name:"常规"},
    A :{code:'A', name:"别名"},
};

// 变量来源枚举
export const varFromEnums = {
    'edit': {code: 'edit', name: "输入"},
    'aviatorScript': {code: 'aviatorScript', name: '表达式'},
    'rel': {code: 'rel', name: "引用"},
    'jPath': {code: 'jPath', name: "jPath"},
    //未使用
    'varPlatform': {code: 'varPlatform', name: "变量平台"},
};

/**
 * 函数体类型，目前仅 FilterVar 使用，其目标是所有的回调定义的枚举可以用这个
 *
 * @see FilterVar
 */
export const funBodyEnums = {
    // 这里和元规则一致
    'LOGIC': {code: 'logic', name: "逻辑输入回调"},
    'AS': {code: 'as', name: "表达式语言回调"},
};


/**
 * 决策或规则中产生的变量各个节点产生的变量
 */
export const varTypeEnums = {
    /**
     * @see FilterVar
     *
     * 节点默认变量：df_{节点名}_{索引号}
     * 流程图默认变量(暂无，可扩展)：df_{变量名}
     *
     */
    'fv' : {code : 'fv' , name : "数组过滤变量"},

    /**
     * @see ErLoopConfigVar
     *
     * 节点默认变量：df_{节点名}_{索引号}
     * 流程图默认变量(暂无，可扩展)：df_{变量名}
     *
     */
    'erl' : {code : 'erl' , name : "循环规则输出变量"},

    /**
     * @see DefaultVar
     *
     * 节点默认变量：df_{节点名}_{索引号}
     * 流程图默认变量(暂无，可扩展)：df_{变量名}
     *
     */
    'df' : {code : 'df' , name : "默认输出"},

    /**
     * @see DrlVar.varAliasName
     *
     * av_{varAliasName}
     */
    'av' :{code: 'av', name :"别名"},

    /**
     * @see COVar
     */
    'cov': {code: 'cov', name: "组件输出变量"},  // cov_组件id_节点id_变量名

    /**
     * @see TVars
     */
    'tv': {code: 'tv', name: "临时变量"},       // tv_规则id或决策id_节点id_变量名

    /**
     * @see RIVar
     */
    'riv': {code: 'riv', name: "规则输入变量"}, // riv_规则id_变量名

    /**
     * @see ROVar
     */
    'rov': {code: 'rov', name: "规则输出变量"}, // rov_规则id

    /**
     * @see DOVar
     */
    'dov': {code: 'dov', name: "决策输出变量"}, // dov_变量名

    /**
     * @see URVar
     */
    'urv': {code: 'UR', name: "元规则输出变量"}, // UR001，和其他标准变量不同，该变量仅是元规则节点的输出

    /**
     * @see URGVar
     */
    'ugv': {code: 'ugv', name: "元规则-流程式输出变量"}, // UR001，和其他标准变量不同，该变量仅是元规则节点的输出

    /**
     * @see OBJVar
     */
    'obj': {code: 'obj', name: "对象解析出的变量"}, // obj_变量名

    /**
     * @see ArrVar
     */
    'arr': {code: 'arr', name: "数组解析出的变量"}, // arr_变量名

    /**
     * @see DtVar
     */
    'dtv': {code: 'DT', name: "决策表输出变量"}, // DT_变量名

    /**
     * @see ConstVar
     */
    'const': {code: 'const', name: "常量"}, // const_变量名

    /**
     * @see PreVar
     */
    'pre': {code: 'pre', name: "预处理结果"}, // pre_变量名

    /**
     * @see RedisVal
     */
    'rdv': {code: 'rdv', name: "redis变量平台的返回"}, //rdv_变量名
    'scv': {code: 'SC', name: "评分卡输出变量"}, //// SC001，和其他标准变量不同，该变量仅是评分卡节点的输出
    /**
     * @see TqsMemVar
     */
    'tqsMv': {code: 'tqsMv', name: "天擎平台返回变量"}, //tqsMv_变量名

    /**
     * @see EVar
     */
    'ev': {code: 'ev', name: "事件变量"},

    /**
     * @see ASVar
     */
    'asv': {code: 'asv', name: "AviatorScript脚本语言"},

    /**
     * @see DataProcessVar
     */
    'dpv' :{code:'dpv', name:"数据处理节点输出"},
    /**
     * @see RateCtrlVar
     */
    'rcv' :{code:'rcv', name:"流量控制节点数据输出"}

};

//天擎事件变量类型
export const tqsVarsTypeEnums = {
    'Double': {code: "3", name: "Double"},
    'Integer': {code: "1", name: "Integer"},
    'String': {code: "2", name: "String"},
    'Timestamp': {code: "4", name: "Timestamp"}
};


// 接入类型枚举
export const inteTypeEnums = {
    'H': {code: "H", name: "Http"},
    'K': {code: "K", name: "Kafka"},
    'M': {code: "M", name: "Model"},
    'J': {code: "J", name: "jar包引用"}
};

// 决策页面版本枚举
//N:native
//S:sdk
export const releaseTypeEnums = {
    'N': {code: "N", name: "测试版本"},
    'S': {code: "S", name: "运行版本"},
};

// 函数类型枚举
export const funTypeEnums = {
    '0': {code: "0", name: "drl"},
    '1': {code: "1", name: "java"},
};

// 决策和规则状态枚举
export const statusEnums = {
    '0': {code: '0', name: "草稿"},
    '1': {code: '1', name: "已验证"},
    '2': {code: '2', name: "已发布"},
    'Y': {code: "Y", name: "启用(Y)"},
    'YB': {code: "YB", name: "启用(YB)"},
    'D': {code: "D", name: "待启用"},
    'N': {code: "N", name: "停用"},
    'YY': {code: "YY", name: "引用"},
    'WY': {code: "WY", name: "未引用"}
};


// 变量状态枚举
export const varStatusEnums = {
    '0': {code: '0', name: "待发布", tagType: 'warning'},
    '1': {code: '1', name: "已发布", tagType: 'success'},
};


// 标签类型
export const tagType = {
    '0': 'warning',
    '1': 'primary',
    '2': 'success',
    'Y': 'success',
    'YY': 'success',
    'WY': 'primary',
    'N': 'warning',
    'H': 'primary',
    'K': 'success',
    'create': 'primary',
    'modify': 'warning',
    'check': 'primary',
    'public': 'success',
    'online': 'success',
    'offline': 'warning',
};

// 操作枚举
export const changeTypeEnums = {
    create: {code: "create", name: "新建"},
    modify: {code: "modify", name: "修改"},
    check: {code: "check", name: "验证"},
    public: {code: "public", name: "发布"},
    online: {code: "online", name: "启用"},
    offline: {code: "offline", name: "停用"},
};

// tab类型
export const tabType = {
    decsRuleSetting: 'DecsRuleSetting',
    decsEdit: 'DecsEdit',
    decsVersion: 'DecsVersion',
    decsHis: 'DecsHis',
    decsCode: 'DecsCode',
    decsPreHandleJava: 'DecsPreHandleJava',
    decsFlow: 'DecsFlow',
    decsFlowG6: 'decsFlowG6',
    decsInf: 'decsInfo',
    decsTable: 'DecsTable',
    decsCitation:'DecsCitation',

    ruleTable: 'RuleTable',
    ruleFlow: 'RuleFlow',
    ruleFlowG6: 'RuleFlowG6',
    compVarFlowG6: 'CompVarFlowG6',
    ruleCode: 'RuleCode',
    ruleHis: 'RuleHis',
    ruleInf: 'RuleInf',
    ruleVersion: 'RuleVersion',
    ruleCitation:'RuleCitation',


    templateCode: 'TemplateCode',
    templateFlow: 'TemplateFlow',
    templateFlowG6: 'TemplateFlowG6',
    templateHis: 'TemplateHis',
    templateInf: 'TemplateInfo',
    templateVersion: 'TemplateVersion',

    decsRuleTable: 'DecsRuleTable',
    scoreCardTable: 'ScoreCardTable',
};

export const varsSearchTypeEnums = {
    pageShow: {code: "pageShow", label: "分页展示"},
    allShow: {code: "allShow", label: "全部展示"},
}

//统计方式(时间颗粒度) echarts 监控
export const statisticalPatternsEnums = {
    'ONEMINUTE': {code: '0', name: '按分钟'},
    'FIVEMINUTE': {code: '1', name: '按五分钟'},
    'THIRTYMINUTE': {code: '2', name: '按三十分钟'},
    'ONEHOUR': {code: '3', name: '按小时'},
    'ONEDAY': {code: '4', name: '按每天'},
};
