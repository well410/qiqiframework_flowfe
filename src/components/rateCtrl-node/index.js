import {DataTypeEnumsClass, varFromEnums, dataTypeEnums} from "../../entity/enumns";
import {isContainEmpty, isEmpty, isNotEmpty} from "../../utils";
import {G6Node} from "../../entity/model";
/**
 * 条件
 */
export class RateCtrlCondition {
    constructor(data) {
        if (data === undefined) data = {};
        // 逻辑id
        this.cdId = data['cdId'];
        // 逻辑描述
        this.cdDesc = data['cdDesc'];
        // 逻辑操作变量的类型
        this.cdVarType = data['cdVarType'];
        // 逻辑操作
        this.cdOpt = data['cdOpt'];

        // 操作符左边值
        // 变量名（leftVarFrom为rel时有值）
        this.leftVarName = data['tmpRateCtrlVar'];

        // 操作符右边值
        this.rightVarValue = data['rightVarValue'];
        // 变量平台对象(rightVarFrom为 varPlatform 时有值)
    }

    static obj2Condition(obj){
        if ( typeof obj === 'object'){
            return new Condition(obj);
        } else {
            return obj;
        }
    }

    getLeftCode() {
        return `$droolsDto.getVars().getOrDefault("${this.leftVarName}", null)`;
    }

    getRightCode() {
        if (isEmpty(this.rightVarValue)) {
            return "null";
        }
        // return ` "${this.rightVarValue}"`;
        return JSON.stringify(this.rightVarValue);
    }

    getVarType(){
        if (isNotEmpty(this.cdVarType)) return this.cdVarType;
        return "";
    }


    getDrlCode(obj, node, cdPre) {
        cdPre = isEmpty(arguments[2]) ? "condition" : cdPre;
        return `  
  boolean ${cdPre}${this.cdId} = false;
  try{
    ${cdPre}${this.cdId} = ${DataTypeEnumsClass.getOptCName(this.getVarType())}.${this.cdOpt}(${this.getLeftCode()}, ${this.getRightCode()});
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj: obj})}
  }`;
    }


}




export function getConditionRes() {
    return [
        {
            name:"Yes",
            value:true,
        },
        {
            name:"No",
            value:false,
        }
    ];

}
