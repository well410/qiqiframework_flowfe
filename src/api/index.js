export class ProdFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.prodName = data["prodName"]
    }
}

/**
 * ruleJson和ruleDrl
 */
export class RuleJsonDrlDto {
   constructor(data){
       if (data === undefined) data = {};
       this.ruleJson = data["ruleJson"];
       this.ruleDrl = data["ruleDrl"];
   }
}


export class FuncFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.funcId = data["funcId"];
        this.funcName = data["funcName"];
        this.funcStatus = data["funcStatus"];
    }
}

export class FuzzyFuncFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.funcId = data["searchCon"];
        this.funcName = data["searchCon"];
        this.funcStatus = data["status"];
        this.prodId= data["prodId"];
    }
}

export class FuncTestDto {
    constructor(data) {
        if (data === undefined) data = {};
        this.drlCode = data["drlCode"];
        this.vars = data["vars"];
    }

}

export class FuncVersionFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.funcVersion = data["funcVersion"];
        this.status = data["status"];
    }
}


export class VarFuzzyFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.varsId = data["searchCon"];
        this.desc = data["searchCon"];
        this.status = data["status"];
        this.datasourceId = data["searchCon"];
        this.queryDimensionFlg=data["queryDimensionFlg"];
    }
}