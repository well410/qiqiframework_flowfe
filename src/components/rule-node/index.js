import {DataTypeEnumsClass, varFromEnums, dataTypeEnums} from "../../entity/enumns";
import {isContainEmpty, isEmpty, isNotEmpty} from "../../utils";
import {G6Node} from "../../entity/model";
import {DrlVar} from "../index";

/**
 * 条件
 */
export class Condition {
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
        this.leftVarName = data['leftVarName'];
        // 变量值(leftVarFrom为edit时有值)
        this.leftVarValue = data['leftVarValue'];
        // 变量值（leftVarFrom为 jPath 时有值）
        this.leftJPath = data['leftJPath'];

        // 变量类型（废弃，见 cdVarType）
        this.leftVarType = data['leftVarType'];
        // 左边变量描述
        this.leftVarDecs = data['leftVarDecs'];
        // 左边变量来源 见 varFromEnums
        this.leftVarFrom = data['leftVarFrom'];


        // 操作符右边值
        // 变量名（rightVarFrom为rel时有值）
        this.rightVarName = data['rightVarName'];
        // 变量值(rightVarFrom为edit时有值)
        this.rightVarValue = data['rightVarValue'];
        // 变量值（leftVarFrom为 jPath 时有值）
        this.rightJPath = data['rightJPath'];

        // 变量类型（废弃，见 cdVarType）
        this.rightVarType = data['rightVarType'];
        // 右边变量描述
        this.rightVarDecs = data['rightVarDecs'];
        // 右边变量来源 见varFromEnums
        this.rightVarFrom = data['rightVarFrom'];
    }

    static obj2Condition(obj){
        if ( typeof obj === 'object'){
            return new Condition(obj);
        } else {
            return obj;
        }
    }

    // 获取最简单的右边的描述
     getRightInfo() {
         let that = this;
         function getNameByVarFrom(varFrom, type) {
             if (type === 'right' && [dataTypeEnums.BOOLEAN.code, dataTypeEnums.OBJECT.code].includes(that.getVarType())) {
                 return "";
             }

             switch (varFrom) {
                 case varFromEnums.rel.code:
                     return that[`${type}VarName`];
                 case varFromEnums.edit.code:
                     return that[`${type}VarValue`];
                 case varFromEnums.jPath.code:
                     return that[`${type}JPath`];
                 default:
                     console.warn(`获取展示信息不支持${varFrom}类型`)
             }
             return "";
         }

         return [DataTypeEnumsClass.getOptFuncName(that.getVarType(), that.cdOpt), getNameByVarFrom(this.rightVarFrom, 'right')].join(" ")

     }

    // 获取展示信息
    getSimpleInf() {
        let that = this;
        function getNameByVarFrom(varFrom, type) {
            if (type === 'right' && [dataTypeEnums.BOOLEAN.code, dataTypeEnums.OBJECT.code].includes(that.getVarType())) {
                return "";
            }

            switch (varFrom) {
                case varFromEnums.rel.code:
                    return `[${varFromEnums.rel.name}] ` + that[`${type}VarName`];
                case varFromEnums.edit.code:
                    return `[${varFromEnums.edit.name}] ` + that[`${type}VarValue`];
                case varFromEnums.jPath.code:
                    return `[${varFromEnums.jPath.name}] ` + that[`${type}JPath`];
                default:
                    console.warn(`获取展示信息不支持${varFrom}类型`)
            }
            return "";
        }

        return [getNameByVarFrom(this.leftVarFrom, 'left'), DataTypeEnumsClass.getOptFuncName(that.getVarType(), that.cdOpt), getNameByVarFrom(this.rightVarFrom, 'right')].join(" ")
    }

    getErrorMsg(){
        let that = this;
        // 左边变量是否选择
        function hasErrorLeft(){
            switch (that.leftVarFrom) {
                case varFromEnums.rel.code:
                    return that.leftVarName;
                case varFromEnums.edit.code:
                    return that.leftVarValue;
                case varFromEnums.varPlatform:
                    return ``
            }
        }
        // 右边变量是否选择
        function hasErrorRight(){
            switch (that.rightVarFrom) {
                case varFromEnums.rel.code:
                    return that.rightVarName;
                case varFromEnums.edit.code:
                    return that.rightVarValue;
                case varFromEnums.varPlatform:
                    return ``
            }
        }

        // 操作符为空，则报错
        let err= `逻辑${this.cdId}填写不完整`;
        if (isEmpty(that.getVarType())) {
            return err
        }else {
            if ([dataTypeEnums.OBJECT.code.toLowerCase(),
                dataTypeEnums.BOOLEAN.code.toLowerCase()].includes(that.getVarType().toLowerCase())){

                // 如果是对象，则不需要右边变量
                if (isContainEmpty([that.getVarType(), this.cdOpt , hasErrorLeft()])){
                    return err;
                }
            } else {
                if (isContainEmpty([that.getVarType(), this.cdOpt , hasErrorLeft(), hasErrorRight()])){
                    return err;
                }
            }
        }



        return "";
    }

    getLeftCode() {
        switch (this.leftVarFrom) {
            case varFromEnums.rel.code:
                return `$droolsDto.getVars().getOrDefault("${this.leftVarName}", null)`;
            case varFromEnums.edit.code:
                if (isEmpty(this.leftVarValue)) {
                    return "null";
                }
                // return ` "${this.leftVarValue}"`;
                return JSON.stringify(this.leftVarValue);
            case varFromEnums.varPlatform:
                return ``
        }
    }

    getRightCode() {
        switch (this.rightVarFrom) {
            case varFromEnums.rel.code:
                return `$droolsDto.getVars().getOrDefault("${this.rightVarName}", null)`;
            case varFromEnums.edit.code:
                if (isEmpty(this.rightVarValue)) {
                    return "null";
                }
                // return ` "${this.rightVarValue}"`;
                return JSON.stringify(this.rightVarValue);
            case varFromEnums.varPlatform:
                return ``
        }
    }

    getVarType(){
        if (isNotEmpty(this.cdVarType)) return this.cdVarType;
        if (isNotEmpty(this.leftVarType)) return this.leftVarType;
        if (isNotEmpty(this.rightVarType)) return this.rightVarType;
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

    getDtDrlCode(obj, node, cdPre) {
        cdPre = isEmpty(arguments[2]) ? "condition" : cdPre;
        return `${DataTypeEnumsClass.getOptCName(this.getVarType())}.${this.cdOpt}(${this.getLeftCode()}, ${this.getRightCode()})`;
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
