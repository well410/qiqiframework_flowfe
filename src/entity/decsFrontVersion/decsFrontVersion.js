import {isEmpty} from "../../utils";


export class DecsVersionRel {
    constructor(data){
        if (data === undefined) data = {};
        this.decsFrontVersion = isEmpty(data['decsFrontVersion']) ? "" : data['decsFrontVersion'];
        this.decsFrontLable = isEmpty(data['decsFrontLable']) ? "" : data['decsFrontLable'];
        this.decsFrontUrl = isEmpty(data['decsFrontUrl']) ? "" : data['decsFrontUrl'];

        this.decsServerVersion = isEmpty(data['decsServerVersion']) ? "" : data['decsServerVersion'];
        this.decsServerLable = isEmpty(data['decsServerLable']) ? "" : data['decsServerLable'];
        this.decsServerUrl = isEmpty(data['decsServerUrl']) ? "" : data['decsServerUrl'];
        this.decsExecVersion = isEmpty(data['decsExecVersion']) ? "" : data['decsExecVersion'];
        this.decsExecLable = isEmpty(data['decsExecLable']) ? "" : data['decsExecLable'];
    }
}
