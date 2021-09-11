import {ls} from "../../index";

export class ListItem{
    constructor(data) {
        this.id = data["id"];//String
        this.name = data["name"];//String
        this.count = data["count"];//Number
        this.label = data["label"];//String
        this.rate = data["rate"];//Number
        this.status = data["status"];//STATUS
        this.childList = data["childList"];//ListItem[]
    }
}

export class IProps{
    constructor(data) {
        this.data = data["data"];//ListItem[]
        this.config = data["config"];//any
    }
    onInit(item){
        console.log(item);
    }

}
export class GraphData{
    constructor(data) {
        this.nodes = data["data"];// object[];
        this.edges = data["config"];// object[];
    }
}

export const STATUS ={
    S:"S",
    I:'I',
    C:'C',
}

export function getUnitRuleNodeNum(nodeType,uniqueIdList) {
    let nodeNum = 999;
    let nodeIdList = ls(nodeNum);
    let inNodeIdListId = uniqueIdList;
    let noInNodeIdListId = nodeIdList.filter(nodeId => inNodeIdListId.indexOf(`${nodeType}${nodeId}`) === -1);
    return nodeType+noInNodeIdListId[0];
}