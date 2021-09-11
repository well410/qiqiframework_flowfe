import {varTypeEnums} from "../enumns";
import {DrlOperate} from "../../components";
import {isEmpty} from "../../utils";

/**
 * 全局数组变量
 */
export class GlobalArrOperate extends DrlOperate {
    constructor(data) {
        super(data);
        if (isEmpty(data)) data = {};
        this.varFrom = varTypeEnums.arr.code;
        // 全局数组映射字段
        this.mapGolbalArrField = isEmpty(data['mapGolbalArrField']) ? "" : data['mapGolbalArrField'];
        // 待添加到全局数组中的映射字段
        this.mapGolbalArrElementField = isEmpty(data['mapGolbalArrElementField']) ? "" : data['mapGolbalArrElementField'];
    }
}
