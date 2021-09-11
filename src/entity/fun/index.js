export class FuncBase {
    constructor(data){
        if (data === undefined) data = {};
        this.funcId = data["funcId"];
        this.funcName = data["funcName"];
        this.funcType = data["funcType"];
        this.funcDrl = data["funcDrl"];
        this.inputExample = data["inputExample"];
        this.status = data["status"];
        this.createUser = data["createUser"];
        this.createTime = data["createTime"];
    }
}

export class FuncVersion extends FuncBase{
    constructor(data) {
        super(data);
        if (data === undefined) data = {};
        this.funcVersion = data["funcVersion"];
    }

}
