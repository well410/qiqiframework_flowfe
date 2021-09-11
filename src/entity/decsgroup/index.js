import {globalConfig} from "../config";
import {isEmpty} from "../../utils";

export class DecsGroup {
    constructor(data){
        if (data === undefined) data = {};
        this.prodId = globalConfig.prodId.value;
        this.decsGroupId = isEmpty(data['decsGroupId']) ? "" : data['decsGroupId'];
        this.decsGroupName = isEmpty(data['decsGroupName']) ? "" : data['decsGroupName'];
        this.appUrl = isEmpty(data['appUrl']) ? "" : data['appUrl'];

    }
}


export class RequestMapping {
    constructor(data){
        if (data === undefined) data = {};
        this.prodId = globalConfig.prodId.value;
        this.requestMappingId = isEmpty(data['requestMappingId']) ? "" : data['requestMappingId'];
        this.requestMappingDesc = isEmpty(data['requestMappingDesc']) ? "" : data['requestMappingDesc'];
        this.decsGroupId = isEmpty(data['decsGroupId']) ? "" : data['decsGroupId'];
        this.decsId = isEmpty(data['decsId']) ? "" : data['decsId'];
        this.decsVersion = isEmpty(data['decsVersion']) ? "" : data['decsVersion'];
        this.status = isEmpty(data['status']) ? "" : data['status'];
        this.createTime = isEmpty(data['createTime']) ? "" : data['createTime'];
        this.createUser = isEmpty(data['createUser']) ? "" : data['createUser'];
        this.updateTime = isEmpty(data['updateTime']) ? "" : data['updateTime'];
        this.updateUser = isEmpty(data['updateUser']) ? "" : data['updateUser'];
        this.changeType = isEmpty(data['changeType']) ? "" : data['changeType'];
        this.requestMappingVersion = isEmpty(data['requestMappingVersion']) ? "" : data['requestMappingVersion'];
        this.historyCreateTime = isEmpty(data['historyCreateTime']) ? "" : data['historyCreateTime'];
        this.historyCreateUser = isEmpty(data['historyCreateUser']) ? "" : data['historyCreateUser'];
    }

}
