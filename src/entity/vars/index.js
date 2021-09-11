import {DrlVar, getUUID} from "../../components";
import {dataTypeEnums, funBodyEnums, varFromEnums, varNameTypeEnums, varTypeEnums} from "../enumns";
import {isEmpty} from "../../utils";
import {Condition} from "../../components/rule-node";

/**
 * 数组过滤变量
 * @see FilterNode
 */
export class FilterVar extends DrlVar {
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
        this.varFrom = varTypeEnums.fv.code;
        this.varType = dataTypeEnums.ARRAY.code;

        this.varNameType = isEmpty(data['varNameType']) ? varNameTypeEnums.S.code : data['varNameType'];
        // 过滤数组名
        this.filterArrName = data['filterArrName'];
        this.funBodyType = funBodyEnums.LOGIC.code;
        // funBodyType 等于 LOGIC 时有值
        this.funBodyCdList = isEmpty(data['funBodyCdList']) ? [] : data['funBodyCdList'].map(item=>new Condition(item));
        this.funBodyCdResult = data['funBodyCdResult'];

        // funBodyType 等于 AS 时有值 (todo 暂时未开发，后面扩展)
        this.funBodyAs = data['funBodyAs'];
    }

    static obj2ERLVar(obj){
        if (typeof obj === 'object'){
            return new FilterVar(obj)
        } else {
            return obj;
        }
    }

    validate() {
        if (this.getPrefixVarName() === "fv_" || this.getPrefixVarName() === "av_"){
            return "【过滤结果】未填写"
        }

        if (isEmpty(this.filterArrName)){
            return "【数组引用】未填写";
        }

        if (isEmpty(this.funBodyCdResult)) {
            return "【结果配置】未填写";
        }

    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        let that = this;
        if (super.enableAlias()){
            return super.getAliasName();
        } else {
            return [that.varFrom, that.varName].join("_");
        }
    }
}

/**
 * 循环规则生成的配置信息
 * @see ERVLoopNode
 * @see com.cmbchina.ns.tcs.common.extruleloop.entity.ErLoopConfig（后端）
 */
export class ErLoopConfigVar extends DrlVar {
    constructor(data) {
        super(data);
        this.varFrom = varTypeEnums.erl.code;
        this.varType = dataTypeEnums.ARRAY.code;

        this.ruleId = data['ruleId'];
        this.ruleName = data['ruleName'];
        this.ruleVersion = data['ruleVersion'];
        this.refListName = data['refListName'];
        this.rivVarList = data['rivVarList'];
        this.rovVarList = data['rovVarList'];
    }

    static obj2ERLVar(obj){
        if (typeof obj === 'object'){
            return new ErLoopConfigVar(obj)
        } else {
            return obj;
        }
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        let that = this;
        if (super.enableAlias()){
            return super.getAliasName();
        } else {
            return [that.varFrom, that.varName].join("_");
        }
    }
}

/**
 * 默认变量，这个变量的目的是定义一些默认的值，一旦生成，不可修改。
 * 可以用来定义节点的默认输出，
 * 也可以定义一些流程图中的都存在的变量，例如系统时间，当前决策或者规则id（这些可以以后慢慢修改的）
 *
 * @see G6Node.getDefaultVarList
 */
export class DefaultVar extends DrlVar{
    getPrefixVarName() {
        return [varTypeEnums.df.code, this.varName].join("_");
    }
}

// 流量控制变量
export class RateCtrlVar extends DrlVar{
    constructor(data) {
        super(data);
        this.varFrom='';
        if (isEmpty(data)) data = {};
        this.logicId = data['logicId'];
        this.rate = data['rate'];
        this.logic="logic";
        this.resultValue = data['resultValue'];
    }
    //得到带有前缀的变量名
    getPrefixVarName(uniqueName) {
        return uniqueName;
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }

    static obj2UrgVar(obj) {
        if (obj === undefined) {
            return new RateCtrlVar({varType: dataTypeEnums.STRING.code, varNameType: varNameTypeEnums.S.code});
        }

        if (typeof obj === 'object') {
            return new RateCtrlVar(obj);
        } else {
            return obj;
        }
    }
}

// 元规则-流程式结果变量
export class URGVar extends DrlVar{
    //得到带有前缀的变量名
    getPrefixVarName() {
        return this.varName;
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }

    static obj2UrgVar(obj) {
        if (obj === undefined) {
            return new URGVar({varType: dataTypeEnums.STRING.code, varNameType: varNameTypeEnums.S.code});
        }

        if (typeof obj === 'object') {
            return new URGVar(obj);
        } else {
            return obj;
        }
    }
}


/**
 * redis变量（从变量平台获取）
 */
export class RedisVal extends DrlVar {
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
        this.varFrom = varTypeEnums.rdv.code;
        // 变量id，如果有则加前缀，如果没有，则不加
        this.varsId = data['varsId']
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        let that = this;
        if (isEmpty(that.varsId)) {
            return [that.varFrom, that.varName].join("_");
        } else {
            return [that.varFrom, that.varsId, that.varName].join("_");
        }
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }

    static obj2RedisVal(obj) {
        if (typeof obj === 'object') {
            return new RedisVal(obj)
        } else {
            return obj;
        }
    }
}

/**
 * 预处理结果
 */
export class PreVar extends DrlVar {
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
        this.varFrom = varTypeEnums.pre.code;
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        let that = this;
        return [that.varFrom, that.varName].join("_");
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }
}

/**
 * 常量
 */
export class ConstVar extends DrlVar {
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
        this.varFrom = varTypeEnums.const.code;
        // 常量值
        this.varValue = isEmpty(data['varValue']) ? "" : data['varValue'];
    }

    static obj2ConstVar(obj){
        if (typeof obj === 'object'){
            return new ConstVar(obj)
        } else {
            return obj
        }
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        let that = this;
        if (super.enableAlias()){
            return super.getAliasName();
        } else {
            return [that.varFrom, that.varName].join("_");
        }
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }
}

/**
 * 元规则结果
 */
export class UnitResult extends DrlVar{
    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        this.logicId = data['logicId'];
        this.logic = data['logic'];
        this.resultDesc = data['resultDesc'] === undefined ? "" : data['resultDesc'];
        this.resultValue = data['resultValue'];
        /**
         * 添加变量来源方式，元规则结果可以编辑表达式语言
         *
         * 注：varFrom 字段名与其他的不同
         * DrlVar 里面 varFrom 指的是哪种变量类型（varTypeEnums），用来给变量前缀的，例如 ev_xx
         * 这里的 varFrom 指的是元规则返回结果是输入，还是表达式
         */
        this.varFrom = isEmpty(data['varFrom']) ? varFromEnums.edit.code : data['varFrom'];
    }

    static getName(_node, _ur){
        return [_node.getRuleName(), _ur.logicId].join("_");
    }

    static obj2UnitResult(obj){
        if (typeof obj === 'object'){
            return new UnitResult(obj)
        }
        return obj;
    }

}

/**
 * 数组迭代结果变量
 */
export class ArrIterationVar extends DrlVar {
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
        this.varFrom = varTypeEnums.arr.code;
        // 映射字段
        this.mapField = isEmpty(data['mapField']) ? "" : data['mapField'];
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        let that = this;
        return [that.varFrom, that.varName].join("_");
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }
}


// 决策表结果变量
export class DTVar extends DrlVar{
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
        this.varFrom = varTypeEnums.dtv.code;
        this.varValue = isEmpty(data['varValue']) ? "" : data['varValue'];
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        let that = this;
        if (super.enableAlias()){
            return super.getAliasName();
        } else {
            return  that.varName;
        }
    }

    static obj2DTVar(obj) {
        if (obj === undefined) {
            return new DTVar({varType: dataTypeEnums.STRING.code, varNameType: varNameTypeEnums.S.code});
        }

        if (obj instanceof Object){
            return new DTVar(obj)
        } else {
            return obj;
        }
    }


}


/**
 * 数组函数解析变量
 */
export class ArrVar extends DrlVar {
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
        this.varFrom = varTypeEnums.arr.code;
        // 逻辑操作
        this.arrOpt = isEmpty(data['arrOpt']) ? "" : data['arrOpt'];
        // 操作字段
        this.arrOptPath = isEmpty(data['arrOptPath']) ? "" : data['arrOptPath'];
        // IN操作中的值
        this.relOfInOpt = isEmpty(data['relOfInOpt']) ? "" : data['relOfInOpt'];
        // 映射字段
        this.mapField = isEmpty(data['mapField']) ? "" : data['mapField'];
    }

    static obj2ArrVar(obj){
        if (obj instanceof Object){
            return new ArrVar(obj)
        } else {
            return obj;
        }
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        let that = this;
        if (super.enableAlias()){
            return super.getAliasName();
        } else {
            return [that.varFrom, that.arrOpt, that.varName].join("_");
        }
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }
}



/**
 * 对象解析后的变量
 */
export class OBJVar extends DrlVar {
    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        // 映射对象的路径 规则（riv_lu88_rule_dd_data_trandMoney），决策（ev_data_trandMoney）
        this.mapField = data['mapField'];
        // 映射对象中获取值的路径
        this.valuePath = isEmpty(data['valuePath']) ? "" : data['valuePath'];
        // 字段值
        this.value = isEmpty(data['value']) ? "" : data['value'];
        this.varFrom = varTypeEnums.obj.code;
    }

    static obj2OBJVar(obj){
        if (typeof obj === 'object'){
            return new OBJVar(obj)
        } else {
            return obj;
        }
    }


    //得到带有前缀的变量名
    getPrefixVarName() {
        if (super.enableAlias()){
            return super.getAliasName();
        } else {
            return [this.varFrom, this.varName].join("_");
        }
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }
}

/**
 * 变量平台的变量
 */
export class VarBase {
    constructor(data) {
        if (data === undefined) data = {};
        // 变量id
        this.varsId = data['varsId'];
        // 变量源id（弃用）
        this.varsOriId = data['varsOriId'];
        // 数据源id
        this.datasourceId = data['datasourceId'];
        // 变量类型
        this.type = data['type'];
        // 变量描述
        this.desc = data['desc'];
        // 变量数据类型
        this.dataType = data['dataType'];
        // 查询url
        this.url = data['url'];
        // 查询维度
        this.queryDimension = data['queryDimension'];
        // 查询key
        this.queryDimensionKey = data['queryDimensionKey'];
        // 查询返回值
        this.queryDimensionVal = data['queryDimensionVal'];
        // 变量状态
        this.status = data['status'];
        this.createUser = data['createUser'];
        this.createTime = data['createTime'];
        this.updateUser = data['updateUser'];
        this.updateTime = data['updateTime'];
    }

}

/**
 * 规则输入变量
 */
export class RIVar extends DrlVar {
    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        this.ruleId = data['ruleId'];
        this.varFrom = varTypeEnums.riv.code;
        this.varValue = isEmpty(data['varValue']) ? "" : data['varValue'];




        // 外部规则进行字段映射
        this.mapField = data['mapField'];
        // 循环规则中的jsonPath
        this.jPath = data['jPath'];
        // 字段来源，如果是引用，则 mapField 字段生效。如果是jsonPath解析，则jPath字段生效
        this.fieldFrom = isEmpty(data['fieldFrom']) ? varFromEnums.rel.code : data['fieldFrom'];

    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        return [this.varFrom, this.ruleId, this.varName].join("_").replace(/\./g, "_");
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return `[${this.getPrefixVarName()}]${this.varDesc}`
    }
}

/**
 * 规则输出变量
 */
export class ROVar extends DrlVar {
    constructor(data) {
        super(data);
        this.varFrom = varTypeEnums.rov.code;
        //增加映射字段 074389
        // 规则结果输出的字段
        this.mapField = data['mapField'];
        // 字段来源（输入，映射，见 varFromEnums）
        this.fieldFrom = isEmpty(data['fieldFrom']) ? "" : data['fieldFrom'];
        // 字段值（fieldFrom 为 输入时）
        this.fieldResult = isEmpty(data['fieldResult']) ? "" : data['fieldResult'];
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        // 将点转为下划线，为兼容 AS 节点
        return [this.varFrom, this.varName].join("_").replace(/\./g, "_");
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return `[${this.getPrefixVarName()}]${this.varDesc}`
    }
}


/**
 * 组件输出变量
 */
export class COVar extends DrlVar {
    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        this.uuid = "";
        this.nodeId = data['nodeId'];
        this.decsId = data['decsId'];
        // 映射名
        this.mapField = isEmpty(data['mapField']) ? "" : data['mapField'];
        // 字段来源（见 varFromEnums）
        this.fieldFrom = isEmpty(data['fieldFrom']) ? "" : data['fieldFrom'];
        // 字段值
        this.fieldResult = isEmpty(data['fieldResult']) ? "" : data['fieldResult'];
        this.varFrom = varTypeEnums.cov.code;
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        return [this.varFrom, this.decsId, this.nodeId, this.varName].join("_").replace(/\./g, "_");
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return `[${this.getPrefixVarName()}]${this.varDesc}`
    }
}

/**
 * 数据处理节点变量（实质上是临时变量和脚本语言的结合）
 * @see DataProcessNode
 * @see TVars
 * @see ASVar
 */
export class DataProcessVar extends DrlVar{
    static getEnums(){
        return {
            FUNC: {code : "FUNC", name:"函数"},
            AVIATOR_SCRIPT: {code : "AVIATOR_SCRIPT", name:"表达式"},
        }
    }

    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        this.varFrom = varTypeEnums.dpv.code;
        // 是函数的字段
        this.func = isEmpty(data['func']) ? {} : data['func'];
        this.inputParams = isEmpty(data['inputParams']) ? [] : data['inputParams'];

        // 是脚本语言的字段
        this.code = isEmpty(data['code']) ? "" : data['code'];
        this.asInput = isEmpty(data['asInput']) ? "" : data['asInput'];

        // 处理类型
        this.processType = data['processType'];
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        if (super.enableAlias()) {
            return super.getAliasName();
        } else {
            return [this.varFrom, this.varName].join("_");
        }
    }

    getProcessType(){
        let type = DataProcessVar.getEnums()[this.processType];
        if (isEmpty(type)){
            return ""
        } else {
            return type.name;
        }
    }

    // 函数类型下，获取执行 Func 的名称
    getFuncExecName() {
        if (isEmpty(this.func.funcVersion) || this.func.funcType === "0") {
            return this.func.funcId;
        } else {
            return this.func.funcVersion;
        }
    }

    // 脚本语言节点下，获取代码
    getASCode(){
        return JSON.stringify(this.code);
    }

    static obj2DataProcessVar(obj){
        if (typeof obj === 'object'){
            return new DataProcessVar(obj);
        } else {
            return obj;
        }
    }
}

/**
 * 脚本语言变量
 */
export class ASVar extends DrlVar{
    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        this.varFrom = varTypeEnums.asv.code;
        this.varValue = data["varValue"];
        this.code = isEmpty(data['code']) ? "" : data['code'];
        this.asInput = isEmpty(data['asInput']) ? "" : data['asInput'];
    }

    static obj2ASVar(obj){
        if (typeof obj === 'object'){
            return new ASVar(obj);
        } else {
            return obj;
        }
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        // 有别名，以别名为主
        if (super.enableAlias()){
            return super.getAliasName();
        } else {
            return [this.varFrom, this.varName].join("_");
        }
    }

    getASCode(){
        return JSON.stringify(this.code);
    }

}


/**
 * 事件变量
 */
export class EVar extends DrlVar {
    constructor(data) {
        super(data);
        this.varFrom = varTypeEnums.ev.code;
        this.varValue = data["varValue"]
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        return [this.varFrom, this.varName].join("_");
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return `[${this.getPrefixVarName()}]${this.varDesc}`
    }
}


/**
 * 临时变量
 */
export class TVars extends DrlVar {
    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        this.func = data['func'];
        this.inputParams = data['inputParams'];
        this.nodeId = data['nodeId'];
        this.ruleId = data['ruleId'];
        this.decsId = data['decsId'];
        this.varFrom = varTypeEnums.tv.code;
    }

    errorList() {
        let result = [];
        result.push(...super.errorList());
        if (isEmpty(this.getFuncExecName())) {
            isEmpty(this.varName) && result.push(`函数为空`)
        }
        return result;
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        if (super.enableAlias()){
            return super.getAliasName();
        } else {
            let id = isEmpty(this.ruleId) ? this.decsId : this.ruleId;
            return [this.varFrom, id, this.nodeId, this.varName].join("_").replace(/\./g, "_");
        }
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return `[${this.getPrefixVarName()}]${this.varDesc}`;
    }

    // 获取执行 Func 的名称
    getFuncExecName() {
        if (isEmpty(this.func.funcVersion) || this.func.funcType === "0") {
            return this.func.funcId;
        } else {
            return this.func.funcVersion;
        }
    }

    static obj2TVars(obj) {
        if (typeof obj === 'object') {
            return new TVars(obj)
        } else {
            return obj;
        }
    }
}
/**
 * 模板权限节点变量
 */
export class TempLateProdVars  {
    constructor(data) {
        if (data === undefined) data = {};
        this.prodId = data['prodId'];
        this.uuid = getUUID();
    }

}


/**
 * 决策输出节点
 */
export class DOVar extends DrlVar {
    constructor(data) {
        super(data);
        // 决策结果输出的字段
        this.mapField = data['mapField'];
        // 字段来源（输入，映射，见 varFromEnums）
        this.fieldFrom = isEmpty(data['fieldFrom']) ? "" : data['fieldFrom'];
        // 字段值（fieldFrom 为 输入时）
        this.fieldResult = isEmpty(data['fieldResult']) ? "" : data['fieldResult'];
        this.varFrom = varTypeEnums.dov.code;
    }

    static obj2DOVar(obj){
        if (typeof obj === 'object'){
            return new DOVar(obj)
        } else {
            return obj
        }
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        return [this.varFrom, this.varName].join("_");
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }
}

/**
 * 天擎事件源变量
 */
export class TqsEvVar {
    constructor(data){
        if (data === undefined) data = {};
        this.eventVarId = data['eventVarId'];
        this.eventVarName = data['eventVarName'];
        this.eventVarType = data['eventVarType'];
        this.length = data['length'];
        this.eventVarDesc = data['eventVarDesc'];
    }
}

/**
 * 天擎内存变量
 */
export class TqsMemVal extends DrlVar {
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
        this.varFrom = varTypeEnums.tqsMv.code;
        // 变量id，如果有则加前缀，如果没有，则不加
        this.memVarId = data['memVarId']
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        let that = this;
        if (isEmpty(that.memVarId)) {
            return [that.varFrom, that.varName].join("_");
        } else {
            return [that.varFrom, that.memVarId, that.varName].join("_");
        }
    }

    // 得到带有描述的变量名
    getDescVarName() {
        return this.getPrefixVarName() + this.varDesc;
    }

    static obj2TqsMemVal(obj) {
        if (typeof obj === 'object') {
            return new TqsMemVal(obj)
        } else {
            return obj;
        }
    }
}
