// 组件来源
import {isEmpty} from "../../utils";
import {varFromEnums} from "../../entity/enumns";


export class MapFields {
    constructor(data) {
        if (data === undefined) data = {};
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
    }

    getPrefixVarName(){
        return this.fieldName
    }

    getDescVarName(){
        return `[${this.getPrefixVarName()}]${this.fieldDesc}`
    }
}


