import {Condition} from "../rule-node/index";
import {isContainEmpty, isEmpty, isNotContainEmpty, isNotEmpty} from "../../utils";
import {varFromEnums, DataTypeEnumsClass} from "../../entity/enumns";

export class CompCondition {
    constructor(data) {
        if (data === undefined) data = {};
        // 逻辑id
        this.cdId = data['cdId'];
        // 逻辑描述
        this.cdDesc = data['cdDesc'];
        //变量类型
        this.cdVarType = data['cdVarType'];
        this.cdVarDecs = data['cdVarDecs'];
        //分数
        this.cdScore = data['cdScore'];
        // 条件组合方式： and、or
        this.cdCompType = data['cdCompType'];
        // 变量名
        this.cdVarName = data['cdVarName'];
        //权重
        this.cdWeight = data["cdWeight"];
        this.conditions = data['conditions'];
        if(isNotEmpty(this.conditions))
            this.conditions = this.conditions.map(item => new Condition(item));       
    }

    getVarWeight(){
        if (isNotEmpty(this.cdWeight)) return this.cdWeight;
        return "1";
    }

    getVarType(){
        if (isNotEmpty(this.cdVarType)) return this.cdVarType;
        return "";
    }

    getVarName(){
        if (isNotEmpty(this.cdVarName)) return this.cdVarName;
        return "";        
    }

    static obj2Condition(obj){
        if ( typeof obj === 'object'){
            return new CompCondition(obj);
        } else {
            return obj;
        }
    }    
    
    // 获取展示信息
    getSimpleInf() {
        let that = this;
        function getNameByVarFrom(cond, varFrom, type) {
            switch (varFrom) {
                case varFromEnums.rel.code:
                    return '[' + cond[`${type}VarName`] +']';
                case varFromEnums.edit.code:
                    return cond[`${type}VarValue`];
                default:
                    console.warn(`获取展示信息不支持${varFrom}类型`)
            }
            return "";
        }

        function getOptName(cond, cdOpt) {
            // 操作符或变量类型为空，返回空串
            if (isContainEmpty([cdOpt, cond.getVarType(), DataTypeEnumsClass.getOptListByKey(cond.getVarType())]) ) return "";
            if (isEmpty(DataTypeEnumsClass.getOptListByKey(cond.getVarType()).filter(item => item.value === cdOpt))) return "";
            return DataTypeEnumsClass.getOptListByKey(cond.getVarType()).filter(item => item.value === cdOpt)[0].label;
        }

        function getCompTypeName(cdCompType) {
            switch (cdCompType) {
                case 'or':
                    return '或';
                default:
                    return '且'; 
            }
        }
        let infs = [];
        //let inf = '';
        if(isNotEmpty(this.conditions)) {
            this.conditions.forEach(cond=>{
                //inf = inf + getOptName(cond, cond.cdOpt) + getNameByVarFrom(cond, cond.rightVarFrom, 'right') + that.cdCompType;
                let right = getNameByVarFrom(cond, cond.rightVarFrom, 'right');
                if(isEmpty(right)) {
                    right = "";
                }
                infs.push(getOptName(cond, cond.cdOpt) + right);
            });
        }

        if(isEmpty(infs)){
            return '';
        } else {
            //return inf.substring(0, inf.length-this.cdCompType.length);
            return infs.join(' ' + getCompTypeName(that.cdCompType) + ' ');
        }
    }

    getErrorMsg(){
        let that = this;
        // 左边变量是否选择
        function hasErrorLeft(){
            if(isNotEmpty(that.cdVarName))
                return that.cdVarName;
            else
                return ``;
        }
        // 右边变量是否选择
        
        function hasErrorRight(){
            if(isEmpty(that.conditions)) {
                return ``;
            }

            for(let j = 0,len = that.conditions.length; j < len; j++ ){
                if(isNotEmpty(that.conditions[j].getErrorMsg())) {
                    console.log(that.conditions[j].getErrorMsg());
                    return ``;
                }               
            }

            return `1`;
        }

        if (isContainEmpty([that.getVarType(), that.getVarName(), that.cdScore, that.cdCompType, hasErrorLeft(), hasErrorRight() ])){
            return `评分条件${this.cdId}填写不完整`;
        }
        return "";
    }

    getDrlCode(obj, node, cdPre) {

        function getIfElse(_logic,_var,_score) {
            return `
  if(!b_${_var}&&(${_logic})){
    d_${_var} = ${_score};
    b_${_var} = true;
  }`;
          }        
        
        let that = this;
        cdPre = isEmpty(arguments[2]) ? "condition" : cdPre;
        let errorMsg = [obj.getId(), `节点id:${node.getRuleName()}`, `条件:${this.cdId}`].join(",");        
        if (isEmpty(that.conditions)) return "";
        let result = [];    
        that.conditions.forEach(cd=>{
            result.push(cd.getDrlCode(obj, node, cdPre+that.cdId+'_logic'));
        });
        let cdList = that.conditions.map(cd=>cdPre+that.cdId+'_logic'+cd.cdId);
        let comp = that.cdCompType === 'and'? '&&' :'||';
        result.push(getIfElse(cdList.join(comp), that.cdVarName, that.cdScore));
        return result.join("\n");
    }

}

/**
 * 评分结果
 */
export class ScoreCardResult {
    constructor(data) {
        if (data === undefined) data = {};
        this.logicId = data['logicId'];
        this.start = data['start'];
        this.end = data['end'];
        this.resultDesc = data['resultDesc'] === undefined ? "" : data['resultDesc'];
        this.resultValue = data['resultValue'];
        this.logic = 'logic';
    }

    static getName(_node, _sc){
        return [_node.getRuleName(), _sc.logicId].join("_");
    }

    static obj2ScoreCardResult(obj){
        if (typeof obj === 'object'){
            return new ScoreCardResult(obj)
        }
        return obj;
    }

}
