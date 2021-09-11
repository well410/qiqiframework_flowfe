import {Condition} from "../rule-node/index";
import {isContainEmpty, isEmpty, isNotContainEmpty, isNotEmpty} from "../../utils";
import {varFromEnums, DataTypeEnumsClass, varTypeEnums} from "../../entity/enumns";
import {DrlVar, getUUID} from "../index";

export class RowOrColVar extends DrlVar {
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
    }
    // constructor(data) {
    //     if (data === undefined) data = {};
    //     // 决策表输入变量的UUID
    //     this.uuid = isEmpty(data['uuid']) ? getUUID() : data['uuid'];
    //     // 决策表输入变量描述
    //     this.varDesc = data['varDesc'];
    //     // 决策表输入变量来源
    //     this.varFrom = data['varFrom'];
    //     // 决策表输入变量名
    //     this.varName = data['varName'];
    //     // 决策输入变量名称类型
    //     this.varNameType = data['varNameType'];
    //     // 决策表输入变量类型
    //     this.varType = data['varType'];
    //     // 决策表输入变量值
    //     this.varValue = data['varValue'];
    //     // 决策表条件
    //     // this.conditions = data['conditions'];
    //     // if(isNotEmpty(this.conditions)) {
    //     //     this.conditions = this.conditions.map(item => new Condition(item));
    //     // }
    // }

    static obj2RowOrColVar(obj){
        if ( typeof obj === 'object'){
            return new RowOrColVar(obj);
        } else {
            return obj;
        }
    }

}

