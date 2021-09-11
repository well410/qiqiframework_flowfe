
export class RuleUpdateDto {
    constructor(data) {
        if (data === undefined) data = {};
        // 规则基本信息
        this.ruleBase = data["ruleBase"];
        // 函数关联信息（1. 为null时不做处理 2.空数组时删除所有关联信息 3.数组有值时先删除关联信息，然后添加信息）
        this.funcRelList = data["funcRelList"];
        this.varsRelList = data["varsRelList"];
        this.dsRelList = data["dsRelList"];
        this.pRuleCRuleRelList = data["pRuleCRuleRelList"];
    }
}


// 规则过滤
export class RuleFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.ruleName = data["ruleName"];
        this.ruleId = data["ruleId"];
        this.ruleStatus = data["ruleStatus"];
        this.ruleVersion = data["ruleVersion"];
    }
}

// 规则过滤
export class RuleFuzzyFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.ruleName = data["searchCon"];
        this.ruleId = data["searchCon"];
        this.ruleStatus = data["searchCon"];
        this.ruleVersion = data["searchCon"];
    }
}

// 规则事件变量
export class RuleVarConfig {
    constructor(data) {
        this.ruleVarName = data['ruleVarName'];
        this.ruleVarType = data['ruleVarType'];
        this.ruleVarDesc = data['ruleVarDesc'];
        this.ruleVarValue = data['ruleVarValue'];
    }
}


export const isInt = (str) => {
    let reg = new RegExp(/^-?[1-9]\d*$/g);
    return reg.test(str)
};

export const isString = (str) =>{
  return (typeof str === 'string')
};


export const isFloat = (str) => {
    if (typeof str === 'string') {
        return false;
    } else {
        try {
            parseFloat(str);
            return true
        } catch (e) {
            console.warn(e);
            return false;
        }
    }
};

export const isDate = (str) => {
    let reg = new RegExp(/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\.[0-9][0-9][0-9][0-9][0-9][0-9]$/g);
    return reg.test(str)
};



