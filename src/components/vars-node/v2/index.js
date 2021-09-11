import {isEmpty, isNotEmpty} from "../../../utils";
import {RedisVal} from "../../../entity/vars";

export class VarConfig {
    constructor(data) {
        if (isEmpty(data)) data = {};
        // 1 数据源
        this.ds = data['ds'];
        // 2 变量
        this.varBase = data['varBase'];
        // 3 查询条件维度映射 {qKey:'', mapField:''}
        this.qdMapList = data['qdMapList'];
        // 4 redis返回的变量
        this.rdvList = data['rdvList'];
    }


    static obj2VarConfig(obj){
        if (typeof obj !== 'object') return obj;

        const result = new VarConfig(obj);
        result.rdvList = result.rdvList.map(item=>RedisVal.obj2RedisVal(item));
        return result;
    }

    // 获取变量id
    getVarBaseId(){
        return this.varBase.varsId;
    }

    // 获取变量描述
    getVarBaseDesc(){
        return `${this.varBase.varsId} （${this.varBase.desc}）`;
    }

    // 获取数据源id
    getDsId(){
        return this.varBase.datasourceId;
    }

    // 获取数据源Name
    getDsDesc(){
        return `${this.varBase.datasourceId} （${this.ds.datasourceName}）`;
    }

    // 获取唯一id
    getUniqueId(){
        return this.getDsId() + this.getVarBaseId();
    }


    getDecs(){
        return `数据源：${this.getDsId()} 变量：${this.getVarBaseId()}`
    }
    //获取结果列表的字符串
    getRdvListStr(){
        var result =[];
        this.rdvList.forEach(item=>{
           result.push(item.getPrefixVarName())
           result.push(item.varType)
           result.push(item.varDesc)
        });
        return result.join("");
    }



}
