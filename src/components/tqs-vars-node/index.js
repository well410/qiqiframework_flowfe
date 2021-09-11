
import {isEmpty} from "../../utils";
import {varFromEnums} from "../../entity/enumns";



export class tqsVarConfig{
    constructor(data) {
        if(data == undefined){
            data = {};
        }

    }
}

export class tqsEvVar {
    constructor(data) {
        if (data === undefined) data = {};
        this.eventVarId = isEmpty(data['eventVarId']) ? "" : data['eventVarId'];
        this.eventVarName = isEmpty(data['eventVarName']) ? "" : data['eventVarName'];
        this.eventVarType = isEmpty(data['eventVarType']) ? "" : data['eventVarType'];
        this.length = isEmpty(data['length']) ? 0 : data['length'];
        this.eventVarDesc = isEmpty(data['eventVarDesc']) ? "" : data['eventVarDesc'];
    }
}


export class tqsMapFields {
    constructor(data) {
        if (data === undefined) data = {};
        //唯一id
        this.soleId = isEmpty(data['soleId']) ? "" : data['soleId'];
        // 原始名
        this.oriPathName = isEmpty(data['oriPathName']) ? "" : data['oriPathName'];
        // 字段名
        this.fieldName = isEmpty(data['fieldName']) ? "" : data['fieldName'];
        // 字段描述
        this.fieldDesc = isEmpty(data['fieldDesc']) ? "" : data['fieldDesc'];
        // 字段类型
        this.fieldType = isEmpty(data['fieldType']) ? varFromEnums.rel.code : data['fieldType'];
        // 字段来源（输入，映射）
        this.fieldFrom = isEmpty(data['fieldFrom']) ? "" : data['fieldFrom'];
        // 字段值
        this.fieldResult = isEmpty(data['fieldResult']) ? "" : data['fieldResult'];
        // 映射名
        this.mapField = isEmpty(data['mapField']) ? "" : data['mapField'];
        //长度
        this.length = isEmpty(data['length']) ? 0 : data['length'];
    }

    getPrefixVarName(){
        return this.fieldName
    }

    getDescVarName(){
        return `[${this.getPrefixVarName()}]${this.fieldDesc}`
    }
}


