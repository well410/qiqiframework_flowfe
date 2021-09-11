import {isEmpty} from "../../utils";
import {varTypeEnums} from "../enumns";
import {globalConfig} from "../config";

export class RuleBase {
    constructor(data){
        if (isEmpty(data)) data = {};
        this.id = data['id'];
        this.prodId = globalConfig.prodId.value;
        this.ruleId = data['ruleId'];
        this.analysisJson = isEmpty(data['analysisJson']) ? "" : data['analysisJson'];
        this.evMapping = data['evMapping'];
        this.inputExample = isEmpty(data['inputExample']) ?  "" : data['inputExample'];
        this.ruleName = data['ruleName'];
        this.ruleJson = data['ruleJson'];
        this.ruleDrl = data['ruleDrl'];
        this.status = data['status'];
        this.changeType = data['changeType'];
        this.createUser = data['createUser'];
        this.createTime = data['createTime'];
        this.updateUser = data['updateUser'];
        this.updateTime = data['updateTime'];
    }

    static obj2RuleBase(obj) {
        if (typeof obj === 'object') {
            return new RuleBase(obj)
        } else {
            return obj
        }
    }

    // drl源码中对规则的表示
    getId(){
        return `${this.ruleId}`
    }

    getOutputName(){
        return [varTypeEnums.rov.code, this.ruleId].join("_").replace(/\./g, "_");
    }


    getRelType(){
        return "RULE"
    }

}

export class RuleHistory extends RuleBase{
    constructor(data){
        super(data);
        if (data === undefined) data = {};
        this.ruleVersion = data['ruleVersion'];
    }
}

export class RuleVersion extends RuleBase{
    constructor(data){
        super(data);
        if (data === undefined) data = {};
        this.ruleVersion = isEmpty(data['ruleVersion']) ? "" : data['ruleVersion'];
    }
}
export class RuleWithAdapter extends RuleBase{
    constructor(data){
        super(data);
        if (data === undefined) data = {};
        this.totalVar = isEmpty(data['totalVar']) ? [] : data['totalVar'];
        this.decsId = isEmpty(data['decsId']) ? "" : data['decsId'];
    }
}

export class CompVarsRule extends RuleBase{
    constructor(data){
        super(data);
        if (data === undefined) data = {};
        this.ruleResultList = data['ruleResultList'] === undefined ? [] : data['ruleResultList'];
    }


    static obj2CompVarsRule(obj) {
        if (typeof obj === 'object') {
            return new CompVarsRule(obj)
        } else {
            return obj
        }
    }
}
