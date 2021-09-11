import {isEmpty} from "../../utils";

export class FuncBase {
    constructor(data){
        if (data === undefined) data = {};
        this.id = data['id'];
        this.prodId = data['prodId'];
        this.funcId = data['funcId'];
        this.funcName = data['funcName'];
        this.funcType = data['funcType'];
        this.funcDrl = isEmpty(data['funcDrl']) ? "" : data['funcDrl'];
        this.inputExample = data['inputExample'];
        this.status = data['status'];
        this.createUser = data['createUser'];
        this.createTime = data['createTime'];
        this.updateUser = data['updateUser'];
        this.updateTime = data['updateTime'];
        this.changeType = data['changeType'];   // 这一手有点疑惑~~~
    }

    getOutputName(){
        return "func_" + this.funcId;
    }

    // 私有函数Id(目的是为了防止其他平台引用私有和公有的时候函数重名)
    getTransFuncId() {
        return "pri" + this.funcId;
    }

    // 公有函数Id(目的是为了防止其他平台引用私有和公有的时候函数重名)
    getTransPubFuncId() {
        return "pub" + this.funcId;
    }


    // 根据函数id改变同步函数代码(私有函数)
    setFuncCode(value){
        if (this.funcType === "0"){
            if(this.funcDrl === undefined || this.funcDrl === '' || this.funcDrl.indexOf('function Object') === -1){
                this.funcDrl = `function Object ${value}(){\n return null;\n}`;
                // this.func.funcDrl = `function String ` + this.func.funcName + `(){\n return "";\n}`

            }else {
                let begin = this.funcDrl.indexOf('(');
                let rightCode = this.funcDrl.substring(begin);
                this.funcDrl = `function Object ${value}` + rightCode;
                // this.func.funcDrl = `function String ` + this.func.funcName + rightCode;
            }
        } else {
            if (isEmpty(this.funcDrl)){
                this.funcDrl = `package com.cmbchina.drools.func;
import com.cmbchina.ns.tcs.common.func.FuncService;

public class ${value} implements FuncService {
    @Override
    public Object exec(Object... args) {
        return null;
    }
}
                `
            } else {
                this.funcDrl = this.funcDrl.replace(/public class[a-zA-Z0-9\s]+implements FuncService/g, `public class ${value} implements FuncService`)
            }
        }
    }
}
