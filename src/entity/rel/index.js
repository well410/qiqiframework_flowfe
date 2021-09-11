import {varTypeEnums} from "../enumns";

export class DSRel {
    constructor(data) {
        if (data === undefined) data = {};
        this.prodId = data['prodId'];
        this.datasourceId = data['datasourceId'];
        this.datasourceRelType = data['datasourceRelType'];
        this.relId = data['relId'];
        this.relVersion = data['relVersion'];
    }
}

export class VarsRel {
    constructor(data) {
        if (data === undefined) data = {};
        this.prodId = data['prodId'];
        this.datasourceId = data['datasourceId'];
        this.varsId = data['varsId'];
        this.varsRelType = data['varsRelType'];
        this.relId = data['relId'];
        this.relVersion = data['relVersion']
    }
}

export class DecsRuleRel {
    constructor(data) {
        if (data === undefined) data = {};
        this.id = data['id'];
        this.prodId = data['prodId'];
        this.decsId = data['decsId'];
        this.decsVersion = data['decsVersion'];
        this.ruleId = data['ruleId'];
        this.nodeId = data['nodeId'] === undefined ? "" :data['nodeId'];
        this.ruleVersion = data['ruleVersion'] === undefined ? "" : data['ruleVersion'];
        this.ruleVersionList = data['ruleVersionList'] === undefined ? [] : data['ruleVersionList'];
        this.ruleResultList = data['ruleResultList'] === undefined ? [] : data['ruleResultList'];  //074389 增加规则结果列表
    }
}

export class PRuleCRuleRel {
    constructor(data) {
        if (data === undefined) data = {};
        this.prodId = data['prodId'];
        this.fromId = data['fromId'];
        this.fromVersion = data['fromVersion'];
        this.toId = data['toId'];
        this.toVersion = data['toVersion'];
    }
}

export class FuncRel {
    constructor(data){
        if (data === undefined) data = {};
        // 产品id
        this.prodId = data['prodId'];
        // 函数id
        this.funcId = data['funcId'];
        // 函数版本
        this.funcVersion = data['funcVersion'];
        // 映射类型
        this.funcRelType = data['funcRelType'];
        // 关联id
        this.relId = data['relId'];
        // 关联版本
        this.relVersion = data['relVersion'];
    }
}

export class CmptRel {
    constructor(data){
        if (data === undefined) data = {};
        // 产品id
        this.prodId = data['prodId'];
        // 组件id
        this.cmptId = data['cmptId'];
        // 组件版本
        this.cmptVersion = data['cmptVersion'];
        // 映射类型
        this.cmptRelType = data['cmptRelType'];
        // 关联id
        this.relId = data['relId'];
        // 关联版本
        this.relVersion = data['relVersion'];
    }
}

export class EvMapping {
    constructor(data) {
        if (data === undefined) data = {};
        // 规则id
        this.ruleId = data['ruleId'];
        // 规则版本
        this.ruleVersion = data['ruleVersion'];
        // 规则变量名称
        this.ruleVarName = data['ruleVarName'];
        // 规则变量描述
        this.ruleVarDesc = data['ruleVarDesc'];
        // 决策变量名称
        this.decsVarName = data['decsVarName'];
        this.varFrom = varTypeEnums.riv.code;
    }

    //得到带有前缀的变量名
    getPrefixVarName() {
        return [this.varFrom, this.ruleId, this.ruleVarName].join("_");
    }
}
