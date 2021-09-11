// 决策修改的dto
import {isEmpty} from "../../utils";

export class TemplateUpdateDto {
    constructor(data) {
        if (data === undefined) data = {};
        // 决策基本信息
        this.templateBase = data["templateBase"];

    }
}


// 决策过滤
export class TemplateFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.decsName = data["decsName"];
        this.decsId = data["decsId"];
        this.decsStatus = data["decsStatus"];
        this.decsVersion = data["decsVersion"];
    }
}

export class TemplateFuzzyFilter {
    constructor(data) {
        if (data === undefined) data = {};
        this.templateName = data["searchCon"];
        this.templateId = data["searchCon"];
        this.status = data["searchCon"];
    }
}


