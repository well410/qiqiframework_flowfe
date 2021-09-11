import {isNotEmpty} from "../../utils";

export class SingleRequest {
    constructor(data){
        if (data === undefined) data = {};
        this.prod = data['prod'];
        this.dsType = data['dsType'] === undefined ? "decs" : data['public'];
        this.dsTypeId = data['dsTypeId'];
        this.seqNo = data['seqNo'];
        this.logTimeStart = data['logTimeStart'];
        this.logTimeEnd = data['logTimeEnd'];
        this.page = data['page'];
        this.limit = data['limit'];
    }
}
