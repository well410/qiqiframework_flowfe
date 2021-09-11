import {DrlVar} from "../index";
import {optTypeEnums} from "../../entity/enumns";
import {ArrIterationVar} from "../../entity/vars";
import {isEmpty, isNotContainEmpty, isNotEmpty} from "../../utils";
import {Condition} from "../rule-node";



export class GroupBy extends DrlVar{
    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        // 操作字段
        this.optValName = (data['optValName'] === undefined) ? [] : data['optValName'];
    }

    getPrefixVarName() {
        return "g_" + this.varName;
    }
}

/**
 * 分组求和
 */
export class GroupByCode {
    constructor(data) {
        if (data === undefined) data = {};
        this.groupByList = data['groupByList'] === undefined ? [] : data['groupByList'];
        this.isHave = data['isHave'] === undefined ? false : data['isHave'];
    }
}

/**
 * 变量处理类
 */
export class VarHandle extends DrlVar{
    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        // 见 optTypeEnums, fun jsonPath
        // 操作类型
        this.optType = data['optType'];
        // 操作类型的函数
        this.func = (data['func'] === undefined) ? {}: data['func'] ;
        // 操作的路径
        this.jsonPath = data['jsonPath'];
        // 操作字段
        this.optValNameList = (data['optValNameList'] === undefined) ? [] : data['optValNameList'];
    }

    getPrefixVarName() {
        return this.varFrom + this.varName;
    }

    // 获取执行 Func 的名称
    getFuncExecName() {
        if (isEmpty(this.func.funcVersion) || this.func.funcType === "0") {
            return this.func.funcId;
        } else {
            return this.func.funcVersion;
        }
    }
}

/**
 * 变量处理
 */
export class VarHandleCode {
    constructor(data) {
        if (data === undefined) data = {};
        this.varHandleList = data['varHandleList'] === undefined ? [] : data['varHandleList'];
        this.isHave = data['isHave'] === undefined ? false : data['isHave'];
    }
}

/**
 * 过滤类
 */
export class FilterCode {
    constructor(data) {
        if (data === undefined) data = {};
        // 条件列表
        this.cdList = data['cdList'] === undefined ? [] : data['cdList'];
        // 判断逻辑（由条件列表组成）
        this.logic = data['logic'] === undefined ? '' : data['logic'];
        this.isHave = data['isHave'] === undefined ? false : data['isHave'];
    }
}


/**
 * 迭代数组操作，固定步骤如下
 * 1 变量处理：通过函数或JSONPath处理变量
 * 2 过滤：判断是否执行当前 item
 * 3 添加循环：1-5继续包含
 * 4 聚合：聚合变量为数组
 * 5 统计：统计数组中的结果
 */
export class ArrIteration {
    constructor(data) {
        if (data === undefined) data = {};
        this.resultList = data['resultList'] === undefined ? [] : data['resultList'];
        if (data['iterationCode'] === undefined) {
            this.iterationCode = {
                refVar:'',
                varHandleCode: new VarHandleCode(),
                filterCode: new FilterCode(),
                iterationCode: {
                    varHandleCode: new VarHandleCode(),
                    filterCode: new FilterCode(),
                    groupByCode: new GroupByCode(),
                    isHave: false,
                    refVar:'',
                },
                groupByCode: new GroupByCode(),
                statisticsCode: new VarHandleCode(),
            };
        } else {
            this.iterationCode = data['iterationCode'];
        }
    }

    // 获取一级的变量处理的变量
    getVarHandleListLevel1(){
        let result = [];
        if (
            isNotEmpty(this.iterationCode.varHandleCode.varHandleList) &&
            this.iterationCode.varHandleCode.isHave
        )
            result.push(...this.iterationCode.varHandleCode.varHandleList.map(item => ArrIteration.obj2VarHandle(item)));
        return result;
    }

    // 获取二级的变量处理的变量
    getVarHandleListLevel2(){
        let result = [];
        if (
            isNotEmpty(this.iterationCode.iterationCode.varHandleCode.varHandleList) &&
            this.iterationCode.iterationCode.varHandleCode.isHave
        )
            result.push(...this.iterationCode.iterationCode.varHandleCode.varHandleList.map(item => ArrIteration.obj2VarHandle(item)));
        return result;
    }

    // 获取一级聚合返回结果的变量
    getGroupByListLevel1(){
        let result = [];
        if (
            isNotEmpty(this.iterationCode.groupByCode.groupByList) &&
            this.iterationCode.groupByCode.isHave
        )
            result.push(...this.iterationCode.groupByCode.groupByList.map(item => ArrIteration.obj2GroupBy(item)));
        return result;
    }

    // 获取二级聚合返回结果的变量
    getGroupByListLevel2(){
        let result = [];
        if (
            this.iterationCode.iterationCode.groupByCode.isHave &&
            isNotEmpty(this.iterationCode.iterationCode.groupByCode.groupByList)
        )
            result.push(...this.iterationCode.iterationCode.groupByCode.groupByList.map(item => ArrIteration.obj2GroupBy(item)));
        return result;
    }

    // 获取统计返回结果的变量
    getStatisticsList(){
        let result = [];
        if (this.iterationCode.statisticsCode.varHandleList !== undefined) result.push(...this.iterationCode.statisticsCode.varHandleList.map(item => ArrIteration.obj2VarHandle(item)));
        return result;
    }

    // obj类型转换为VarHandle
    static obj2VarHandle(item) {
        if (typeof item === 'object') {
            return new VarHandle(item);
        } else {
            return item;
        }
    }

    static obj2GroupBy(item) {
        if (typeof item === 'object') {
            return new GroupBy(item);
        } else {
            return item;
        }
    }

    // 获取函数
    getFuncList() {
        let varHandleList = [];
        varHandleList.push(...this.getGroupByListLevel1());
        varHandleList.push(...this.getGroupByListLevel2());
        varHandleList.push(...this.getVarHandleListLevel1());
        varHandleList.push(...this.getVarHandleListLevel2());
        varHandleList.push(...this.getStatisticsList());
        return varHandleList.filter(item => (item.optType === optTypeEnums.fun.code)).map(item => item.func);
    }


    /**
     * 生成源码（看到这个代码是不是吐血了，吐血就对了，我写的也吐血了。。。）
     * 根据配置生成源码，结构同 ArrayIteration.vue
     * @returns {string}
     */
    getDrlCode(obj, node){
        let that = this;

        function varHandleList2DrlCode(varHandleList, split) {
            if (isEmpty(varHandleList)) return "";
            split = isEmpty(arguments[1]) ? "\n" : split;
            return varHandleList.map(item => ArrIteration.obj2VarHandle(item)).map(item => {
                if (item.optType === optTypeEnums.jsonPath.code) {
                    let optVarName = isEmpty(item.optValNameList) ? "" : item.optValNameList[0];
                    return `arrMap.put("${item.getPrefixVarName()}", JSONOperation.getValueByJSONPath(arrMap.getOrDefault("${optVarName}", null), "${item.jsonPath}"));`
                } else {
                    let paras = isEmpty(item.optValNameList) ? [] : item.optValNameList.map(item2 => `arrMap.getOrDefault("${item2}", null)`);
                    // return `arrMap.put("${item.getPrefixVarName()}", $droolsDto.getFuncMap().get("${item.getFuncExecName()}").exec(${paras.join(",")}));`;
                    return `arrMap.put("${item.getPrefixVarName()}", AppFacade.getFuncService("${item.getFuncExecName()}").exec(${paras.join(",")}));`;
                }
            }).join(split);
        }

        function groupByList2DrlCode(groupByList, split) {
            if (isEmpty(groupByList)) return "";
            split = isEmpty(arguments[1]) ? "\n" : split;
            return groupByList.map(item => ArrIteration.obj2GroupBy(item)).map(item => {
                return `
                ${item.getPrefixVarName()}.add(arrMap.getOrDefault("${item.optValName}", null));
                arrMap.put("${item.getPrefixVarName()}", JSON.toJSONString(${item.getPrefixVarName()}));`
            }).join(split);
        }

        function cdList2DrlCode(filterCode, cdPre, split) {
            let cdList = filterCode.cdList;
            if (isEmpty(cdList)) return "";
            cdPre = isEmpty(arguments[1]) ? "cd" : cdPre;
            split = isEmpty(arguments[2]) ? "\n" : split;
            return cdList.map(item => {
                if (typeof item === 'object') {
                    return new Condition(item);
                } else {
                    return item;
                }})
                .filter(item => isNotContainEmpty([item.getLeftCode(), item.getRightCode(), item.getVarType()]))
                .map(item => item.getDrlCode(obj, node, cdPre).replace("$droolsDto.getVars()", "arrMap")).join(split);
        }

        function filterCode2Logic(filterCode, replace) {
            let cdIdList = filterCode.cdList.map(item=>item.cdId);
            let logic = filterCode.logic;
            cdIdList.forEach(cdId => {
                logic = logic.replace(new RegExp(cdId, 'g'), `${replace}${cdId}`)
            });
            return logic;
        }

        function varHandle(level) {
            if (that.codeIsShow(level)) {
                let varHandleList = null;
                switch (level) {
                    case "filter-iteration-varHandle":
                    case "noFilter-iteration-varHandle":
                        varHandleList = that.iterationCode.iterationCode.varHandleCode.varHandleList;
                        return varHandleList2DrlCode(varHandleList, "\n\t\t\t");
                    case "varHandle":
                        varHandleList = that.iterationCode.varHandleCode.varHandleList;
                        return varHandleList2DrlCode(varHandleList, "\n\t\t\t");
                    default:
                        throw new Error("不支持的类型");
                }
            } else {
                return "";
            }
        }

        function filterIterationFilter(level) {
            if (that.codeIsShow(level)) {
                return `
                ${cdList2DrlCode(that.iterationCode.iterationCode.filterCode, "cdTwo")}
                if(${filterCode2Logic(that.iterationCode.iterationCode.filterCode, "cdTwo")}){
                    ${groupBy('filter-iteration-filter-groupBy')}
                }`;
            } else {
                return "";
            }
        }

        function filterIteration(level) {
            if (that.codeIsShow(level)) {
                return `for (Object object2 : Convert.obj2Array(arrMap.get("${that.iterationCode.iterationCode.refVar}"))) {
                            arrMap.put("item2", JSONOperation.obj2JSONString(object2));
                            ${varHandle("filter-iteration-varHandle")}
                            ${filterIterationFilter("filter-iteration-filter")}
                            ${groupBy("filter-iteration-groupBy")}
                        }`;
            } else {
                return "";
            }
        }

        function filter(level) {
            if (that.codeIsShow(level)) {
                return `
                ${cdList2DrlCode(that.iterationCode.filterCode, "cdOne")}
                if(${filterCode2Logic(that.iterationCode.filterCode, "cdOne")}){
                    ${filterIteration("filter-iteration")}
                    ${groupBy('filter-groupBy')}
                }`;
            } else {
                return "";
            }
        }

        function noFilterIterationFilter(level) {
            if (that.codeIsShow(level)) {
                return `
                ${cdList2DrlCode(that.iterationCode.iterationCode.filterCode, "cdTwo")}
                if(${filterCode2Logic(that.iterationCode.iterationCode.filterCode, "cdTwo")}){
                    ${groupBy('noFilter-iteration-filter-groupBy')}
                }`;
            } else {
                return "";
            }
        }

        function noFilterIteration(level) {
            if (that.codeIsShow(level)) {
                return `for (Object object2 : Convert.obj2Array(arrMap.get("${that.iterationCode.iterationCode.refVar}"))) {
                            arrMap.put("item2", JSONOperation.obj2JSONString(object2));
                            ${varHandle("noFilter-iteration-varHandle")}
                            ${noFilterIterationFilter("noFilter-iteration-filter")}
                            ${groupBy("noFilter-iteration-groupBy")}
                        }`;
            } else {
                return "";
            }
        }

        function noFilter(level) {
            if (that.codeIsShow(level)) {
                return noFilterIteration('noFilter-iteration');
            } else {
                return "";
            }
        }



        function groupBy(level) {
            if (that.codeIsShow(level)) {
                let groupByList = null;
                switch (level) {
                    case 'filter-groupBy':
                    case 'groupBy':
                        groupByList = that.iterationCode.groupByCode.groupByList;
                        return groupByList2DrlCode(groupByList, "\n\t\t\t");
                    case 'filter-iteration-filter-groupBy':
                    case 'filter-iteration-groupBy':
                    case 'noFilter-iteration-groupBy':
                    case 'noFilter-iteration-filter-groupBy':
                        groupByList = that.iterationCode.iterationCode.groupByCode.groupByList;
                        return groupByList2DrlCode(groupByList, "\n\t\t\t");
                    default:
                        throw new Error("不支持的类型");
                }
            } else {
                return "";
            }
        }

        function statistics(level) {
            if (that.codeIsShow(level)) {
                return varHandleList2DrlCode(that.iterationCode.statisticsCode.varHandleList)
            } else {
                return "";
            }
        }

        function resultCode() {
            return that.resultList.map(item => {
                if (typeof item === 'object'){
                    let tmp = new ArrIterationVar(item);
                    return `$droolsDto.getVars().put("${tmp.getPrefixVarName()}" , arrMap.getOrDefault("${tmp.mapField}", null));`
                } else {
                    return `$droolsDto.getVars().put("${item.getPrefixVarName()}" , arrMap.getOrDefault("${item.mapField}", null));`
                }
            }).join("\n\t\t");
        }

        function initGroupByCode() {
            let result = [];
            if (that.iterationCode.groupByCode.isHave){
                result.push(...that.iterationCode.groupByCode.groupByList
                    .map(item => ArrIteration.obj2GroupBy(item))
                    .map(item => `List<Object> ${item.getPrefixVarName()} = new ArrayList<>();`))
            }

            if (
                that.iterationCode.iterationCode
                && that.iterationCode.iterationCode.groupByCode.isHave){
                result.push(...that.iterationCode.iterationCode.groupByCode.groupByList
                    .map(item => ArrIteration.obj2GroupBy(item))
                    .map(item=>`List<Object> ${item.getPrefixVarName()} = new ArrayList<>();`))
            }

            return result.join("\n\t\t")
        }

        if (
            !that.iterationCode.varHandleCode.isHave &&
            !that.iterationCode.filterCode.isHave &&
            !that.iterationCode.isHave &&
            !that.iterationCode.groupByCode.isHave &&
            !that.iterationCode.statisticsCode.isHave
        ) {
            return '';
        }


        return `
        Map<String, Object> arrMap = new HashMap<>();
        arrMap.putAll($droolsDto.getVars());
        ${initGroupByCode()}
        for (Object object1 : Convert.obj2Array(arrMap.get("${that.iterationCode.refVar}"))) {
            arrMap.put("item1", JSONOperation.obj2JSONString(object1));
            ${varHandle('varHandle')}
            ${filter('filter')}
            ${noFilter('noFilter')}
            ${groupBy('groupBy')}
        }
        ${statistics("statistics")}
        ${resultCode()}
        `;
    }


    codeIsShow(name) {
        switch (name) {
            case 'varHandle':
                return this.iterationCode.varHandleCode.isHave;

            case 'filter':
                return this.iterationCode.filterCode.isHave;
            case 'filter-groupBy':
                return this.iterationCode.groupByCode.isHave;
            case 'filter-iteration':
                return this.iterationCode.iterationCode.isHave;
            case 'filter-iteration-varHandle':
                return this.iterationCode.iterationCode.varHandleCode.isHave;
            case 'filter-iteration-filter':
                return this.iterationCode.iterationCode.filterCode.isHave;
            case 'filter-iteration-filter-groupBy':
                return this.iterationCode.iterationCode.filterCode.isHave && this.iterationCode.iterationCode.groupByCode.isHave;
            case 'filter-iteration-groupBy':
                return !this.iterationCode.iterationCode.filterCode.isHave && this.iterationCode.iterationCode.groupByCode.isHave;

            case 'noFilter':
                return !this.iterationCode.filterCode.isHave;
            case 'noFilter-iteration':
                return this.iterationCode.iterationCode.isHave;
            case 'noFilter-iteration-varHandle':
                return this.iterationCode.iterationCode.varHandleCode.isHave;
            case 'noFilter-iteration-groupBy':
                return !this.iterationCode.iterationCode.filterCode.isHave && this.iterationCode.iterationCode.groupByCode.isHave;
            case 'noFilter-iteration-filter':
                return this.iterationCode.iterationCode.filterCode.isHave;
            case 'noFilter-iteration-filter-groupBy':
                return this.iterationCode.iterationCode.filterCode.isHave && this.iterationCode.iterationCode.groupByCode.isHave;

            case 'groupBy':
                return !this.iterationCode.filterCode.isHave && this.iterationCode.groupByCode.isHave;
            case 'statistics':
                return this.iterationCode.statisticsCode.isHave;
            default:
                throw new Error("未知类型")
        }
    }



}
