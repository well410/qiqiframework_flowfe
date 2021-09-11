import {isEmpty} from "../../utils";
import {varFromEnums} from "../../entity/enumns"
import {getMatchingWeight} from '../../views/common/index'

// 数据源落地类型
export const DatasourceTypeEnums = {
    none: {code: "0", name: "none"},
    jdbc: {code: "1", name: "jdbc"},
    redis: {code: "2", name: "redis"},
    elasticsearch: {code: "3", name: "elasticsearch"}
};

export const JdbcDriver={
    mysql:{code:"1",name:"mysql"},
    gaussdb:{code:"2",name:"gaussdb"}
};

export class MapFields {
    constructor(data) {
        if (data === undefined) data = {};
        this.id = isEmpty(data['id']) ? "" : data['id'];
        // 字段名
        this.fieldName = isEmpty(data['fieldName']) ? "" : data['fieldName'];
        // 字段类型
        this.fieldType = isEmpty(data['fieldType']) ? "" : data['fieldType'];
        // 字段描述
        this.fieldDesc = isEmpty(data['fieldDesc']) ? "" : data['fieldDesc'];
        // 字段来源（输入，映射）
        this.fieldFrom = isEmpty(data['fieldFrom']) ? varFromEnums.rel.code :data['fieldFrom'];
        // 字段值
        this.fieldResult = isEmpty(data['fieldResult']) ? "" :data['fieldResult'];
        // 映射名
        this.mapField = isEmpty(data['mapField']) ? "" : data['mapField'];
    }
    //得到变量名
    getVarName() {
        return `${this.fieldName}`;
    }

    getPrefixVarName(){
        return this.fieldName
    }

    getDescVarName(){
        return `[${this.getPrefixVarName()}]${this.fieldDesc}`
    }
}

// 根据路径的最后个名字自动映射
export function autoMappingByName(ruleVarName, refVarList) {
    let result = '';
    let ruleVarNameOfSuffix = ruleVarName.split("_");
    let weightList = refVarList.map(evVar => {
        let evVarOfSuffix = evVar.getPrefixVarName().split("_");
        return getMatchingWeight(evVarOfSuffix[evVarOfSuffix.length - 1], ruleVarNameOfSuffix[ruleVarNameOfSuffix.length - 1]);
    });
    let maxWight = Math.max(...weightList).toFixed(2);
    if (parseFloat(maxWight) < 0.5) {
        return result;
    }
    result = refVarList[weightList.indexOf(maxWight)].getPrefixVarName();
    return result;
}
