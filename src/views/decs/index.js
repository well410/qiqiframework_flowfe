// 决策修改的dto
export class DecsUpdateDto {
    constructor(data) {
        if (data === undefined) data = {};
        // 决策基本信息
        this.decsBase = data["decsBase"];
        // 决策关联信息（1. 为null时不做处理 2.空数组时删除所有关联信息 3.数组有值时先删除关联信息，然后添加信息）
        this.decsRuleRelList = data["decsRuleRelList"];
        // 函数关联信息（1. 为null时不做处理 2.空数组时删除所有关联信息 3.数组有值时先删除关联信息，然后添加信息）
        this.funcRelList = data["funcRelList"];
        // 组件关联信息（1. 为null时不做处理 2.空数组时删除所有关联信息 3.数组有值时先删除关联信息，然后添加信息）
        this.cmptRelList = data["cmptRelList"];
        this.dsRelList = data["dsRelList"];
        this.varsRelList = data["varsRelList"];
        this.tqsRelInfo=data['tqsRelInfo'];
    }
}

// 决策导入的dto
export class DecsImportDto {
    constructor(data) {
        if (data === undefined) data = {};
        // 决策版本信息
        this.decsVersion = data["decsVersion"];
        // 决策关联信息（1. 为null时不做处理 2.空数组时删除所有关联信息 3.数组有值时先删除关联信息，然后添加信息）
        this.ruleVersionList = data["ruleVersionList"];
        // 函数关联信息（1. 为null时不做处理 2.空数组时删除所有关联信息 3.数组有值时先删除关联信息，然后添加信息）
        this.funcVersionList = data["funcVersionList"];
        // 组件关联信息（1. 为null时不做处理 2.空数组时删除所有关联信息 3.数组有值时先删除关联信息，然后添加信息）
        this.cmptVersionList = data["cmptVersionList"];
        //更新决策用的dto
        this.decsUpdateDto = data["decsUpdateDto"];
        //导入规则用到的Dto
        this.ruleUpdateDtoList = data["ruleUpdateDtoList"];
    }
}


// 决策过滤
export class DecsFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.decsName = data["decsName"];
        this.decsId = data["decsId"];
        this.decsStatus = data["decsStatus"];
        this.decsVersion = data["decsVersion"];
    }
}

export class DecsFuzzyFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.decsName = data["searchCon"];
        this.decsId = data["searchCon"];
        this.decsStatus = data["searchCon"];
        this.decsVersion = data["searchCon"];
    }
}