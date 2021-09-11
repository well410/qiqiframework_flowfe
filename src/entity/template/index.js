import {isEmpty} from "../../utils";
import {globalConfig} from "../config";

export class TemplateBase {
    constructor(data){
        if (data === undefined) data = {};
        this.prodId = globalConfig.prodId.value;
        this.templateId = isEmpty(data['templateId']) ? data['decsId'] : data['templateId'];
        this.templateName = isEmpty(data['templateName']) ? data['decsName'] : data['templateName'];
        this.seqNo = isEmpty(data["seqNo"]) ? [] : data['seqNo'];
        this.ruleDrl = data['ruleDrl'];
        this.ruleJson = data['ruleJson'];
        this.status = data['status'] ;
        this.createUser = data['createUser'];
        this.createTime = data['createTime'];
        this.updateUser = data['updateUser'];
        this.updateTime = data['updateTime'];
    }

    // drl源码中对决策的表示
    getId(){
        return `模板id:${this.templateId}`
    }

    // drl源码中的输出
    getOutputName(){
        return "template_" + this.templateId;
    }

    getIdForFunc(){
        return this.templateId;
    }

    // 和组件，函数关联表中的关联类型
    getRelType(){
        return "TEMPLATE"
    }
}

export class TemplateVersion extends TemplateBase{
    constructor(data){
        super(data);
        if (data === undefined) data = {};
        this.templateVersion = data["templateVersion"]
    }
}
export class TemplateHistory extends TemplateBase{
    constructor(data){
        super(data);
        if (data === undefined) data = {};
        this.templateVersion = data["templateVersion"];
        this.changeType = data["changeType"];
        this.id = data["id"]
    }
}
export class NodeWithVars{
    constructor(data){
        if (data === undefined) data = {};
        this.node = data["node"];
        this.totalVar = data["totalVar"]
    }
}
