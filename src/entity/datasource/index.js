import {isEmpty, isNotEmpty} from "../../utils";

export class Datasource {
    constructor(data){
        if (data === undefined) data = {};
        //数据源id
        this.datasourceId = data['datasourceId'];
        //数据源名称
        this.datasourceName = data['datasourceName'];
        //数据落地配置json
        this.dataLand = data['dataLand'];
        if (isNotEmpty(this.dataLand)){
            try {
                this.dataLand = JSON.parse(this.dataLand);
            } catch (e) {
                console.warn("数据源落地配置解析异常")
            }
        }
    }
}


export class TqsDatasource {
    constructor(data){
        if (data === undefined) data = {};
        //数据源id
        this.datasourceId = isEmpty(data['datasourceId']) ? "" : data['datasourceId'];
        //数据源名称
        this.datasourceName = isEmpty(data['datasourceName']) ? "" : data['datasourceName'];
        //数据源事件变量
        this.evVars = isEmpty(data['evVars']) ? "[]" : data['evVars'];
        //数据源-内存变量
        this.memVars = isEmpty(data['memVars']) ? "{}" : data['memVars'];
        //关联组件id
        this.cmptId = isEmpty(data['cmptId']) ? "" : data['cmptId'];
        //关联组件版本
        this.cmptVersion = isEmpty(data['cmptVersion']) ? "" : data['cmptVersion'];

        if (isNotEmpty(this.evVars)){
            try {
                this.evVars = eval(this.evVars);
            } catch (e) {
                console.warn("事件变量列表解析异常")
            }
        }
    }
}


