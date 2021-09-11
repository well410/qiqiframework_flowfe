import {isEmpty} from "../../utils";
import {globalConfig} from "../config";
import {DecsVersionRel} from "../decsFrontVersion/decsFrontVersion";

export class DecsBase {
    constructor(data){
        if (data === undefined) data = {};
        this.prodId = globalConfig.prodId.value;
        this.decsId = isEmpty(data['decsId']) ? "" : data['decsId'];
        this.decsName = data['decsName'];
        this.inteType = data['inteType'] ;
        this.releaseType = data['releaseType'] ;
        this.evMapping = isEmpty(data['evMapping']) ? "" : data['evMapping'];
        this.inteConf = isEmpty(data['inteConf']) ? {uri:'', bootstrapServer:'', topic:'', groupId:'', userName:'', password:'', mountUrl:'', urlA:'',percentA:'100' ,showA: true, urlB:'',percentB:'0',showB: false} : data['inteConf'];
        this.seqNo = isEmpty(data["seqNo"]) ? [] : data['seqNo'];
        this.analysisJson = isEmpty(data['analysisJson']) ? "" : data['analysisJson'];
        this.inputExample = isEmpty(data['inputExample']) ? "" : data['inputExample'];
        this.jsonSchema = isEmpty(data['jsonSchema']) ? "{}" : data['jsonSchema'];
        this.preHandle = isEmpty(data['preHandle']) ? "" : data['preHandle'];
        this.preHandleJava = isEmpty(data['preHandleJava']) ? "" : data['preHandleJava'];
        this.preHandleReturnList = isEmpty(data['preHandleReturnList']) ? [] : data['preHandleReturnList'];
        this.ruleDrl = data['ruleDrl'];
        this.ruleJson = data['ruleJson'];
        this.status = data['status'] ;
        this.decsVersionRelProperty = isEmpty(data['decsVersionRelProperty']) ?  new DecsVersionRel() : data['decsVersionRelProperty'];
        this.sdkVersion = data['sdkVersion'];
        this.createUser = data['createUser'];
        this.createTime = data['createTime'];
        this.updateUser = data['updateUser'];
        this.updateTime = data['updateTime'];
    }

    // drl源码中对决策的表示
    getId(){
        return `${this.decsId}`
    }

    // drl源码中的输出
    getOutputName(){
        return "decs_" + this.decsId;
    }

    getIdForFunc(){
        return this.decsId;
    }

    // 和组件，函数关联表中的关联类型
    getRelType(){
        return "DECS"
    }
}

export class DecsVersion extends DecsBase{
    constructor(data){
        super(data);
        if (data === undefined) data = {};
        this.decsVersion = data["decsVersion"]
    }
}

export class AdapterDecsBaseDto extends DecsBase{
    constructor(data){
        super(data);
        if (data === undefined) data = {};
        this.ruleBases = data["ruleBases"]
    }
}


export class DroolsTestReqDto {
    constructor(_testEnums, _req, _drlCode, _jsonSchema){
        this.testEnums = _testEnums;
        this.req = _req;
        this.drlCode = _drlCode;
        this.jsonSchema = _jsonSchema;
    }
}
