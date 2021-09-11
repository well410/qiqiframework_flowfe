import {isEmpty, isNotEmpty} from "../../utils";
import {varFromEnums} from "../../entity/enumns";
import {UnitResult} from "../../entity/vars";

/**
 * 元规则-流程图结果
 */
export class UgvResult{
    constructor(data) {
        if (data === undefined) data = {};
        this.logicId = data['logicId'];
        this.logic = data['logic'];
        this.resultDesc = data['resultDesc'] === undefined ? "" : data['resultDesc'];
        this.resultValue = data['resultValue'];
        // 添加变量来源方式，元规则结果可以编辑表达式语言
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
    static json2Arr(ugvResultList){
        var ugvListStr="";
        if(isNotEmpty(ugvResultList)){
            ugvListStr = JSON.stringify(ugvResultList);
            ugvListStr = ugvListStr.substring(1,ugvListStr.length-1);
            var ugvListArr=ugvListStr.split(",");
        }

       return ugvListArr;
    }

}
