// 和变量平台版本没有关系的 js 放在这里
import {isEmpty} from "../../utils";

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
