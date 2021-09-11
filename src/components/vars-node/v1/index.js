import {isEmpty, isNotEmpty} from "../../../utils";
import {varTypeEnums} from "../../../entity/enumns";

export class VarBaseFilter {
    constructor(data) {
        if (isEmpty(data)) data = {};
        // 数据源ID
        this.datasourceId = isEmpty(data['datasourceId']) ? "" : data['datasourceId'];
        // 变量ID
        this.varsId = isEmpty(data['varsId']) ? "" : data['varsId'];
        // 变量状态
        this.status = isEmpty(data['status'])  ? "" : data['status'];
        this.queryDimensionFlg = isEmpty(data['queryDimensionFlg'])  ? "" : data['queryDimensionFlg'];
    }
}

// 读取变量平台的配置信息
export class RedisKeyVars {
    constructor(data) {
        if (isEmpty(data)) data = {};
        // redis的key前缀（事件源id_变量平台变量类型: LU88_AGGIN_TRANS_dv）
        this.redisKey = data['redisKey'];
        // redis的key的查询条件（例如商户号）弃用
        this.mapField = isEmpty(data['mapField']) ? "" : data['mapField'];
        // redis的key的查询条件
        this.mapFieldList = isEmpty(data['mapFieldList']) ? [] : data['mapFieldList'];
        this.varList = data['varList'];
    }
}
