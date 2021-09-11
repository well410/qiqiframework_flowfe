/**
 * 函数节点里面通过函数计算变量，
 * 输出变量为outputVar
 * 调用函数为functionInfo
 * 函数输入参数为inputVarList，输入变量存放顺序需要跟函数声明入参顺序一致
 */
export class VarsMapConfig {
    constructor(data){
        if (data === undefined) data = {};
        this.id = data["id"];
        this.outputVar = data["outputVar"];
        this.functionInfo = data["functionInfo"];
        this.inputVarList = data["inputVarList"];
    }
}











