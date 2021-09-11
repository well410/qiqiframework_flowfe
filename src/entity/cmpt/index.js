import {isNotEmpty} from "../../utils";

export class Cmpt {
    constructor(data){
        if (data === undefined) data = {};
        this.cmptId = data['cmptId'];
        this.prodId = data['prodId'];
        this.cmptName = data['cmptName'];
        this.inteType = data['inteType'];
        this.inteConf = data['inteConf'];
        this.analysisJson = data['analysisJson'];
        this.responseAnalysis = data['responseAnalysis'];
        this.inputExample = data['inputExample'];
        this.cmptVersion = data['cmptVersion'];
        this.status = data['status'];


        if (isNotEmpty(this.inteConf) && typeof(this.inteConf) === "string"){
            try {
                this.inteConf = JSON.parse(this.inteConf);
            } catch (e) {
                console.warn("组件接入配置解析异常")
            }
        }
    }


}
