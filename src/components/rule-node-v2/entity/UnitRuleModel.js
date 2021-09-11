import {isContainEmpty, isEmpty, isNotContainEmpty, isNotEmpty} from "../../../utils";
import {G6Node} from "../../../entity/model";
import {beanEnums, compEnums, DataTypeEnumsClass, varFromEnums, varTypeEnums} from "../../../entity/enumns";
import {UnitRuleG6Model} from "./UnitRuleG6Model";
import {URGVar} from "../../../entity/vars";

/**
 * G6的节点
 */
export class UnitRuleNode {
    constructor(data) {
        if (data === undefined) return {};
        //=================G6自带属性=======================
        this.id = data["id"];
        this.name = data["name"];
        this.label = data["label"];
        this.value = data["value"];
        // 类型（都为node）
        this.type = data["type"];
        this.x = data["x"];
        this.y = data["y"];


        //===================本项目节点自带属性==============
        this.nData = {};
        // 组件的类型
        this.nData.compType = data['nData']["compType"];
        // 连线类型（链接此节点的连线类型，或和且）
        this.nData.connType = isEmpty(data['nData']["connType"]) ? "and" : data['nData']["connType"];
        // 节点唯一名，例如UR001
        this.nData.uniqueNodeNum = data['nData']["uniqueNodeNum"];
        // 父亲节点
        this.nData.parent =  data['nData']["parent"];

    }

    // 获取描述信息
    getDesc() {
        switch (this.type) {
            case compEnums.UNIT_CON.code:
                return compEnums.UNIT_CON.name;
            case compEnums.UNIT_RES.code:
                return compEnums.UNIT_RES.name;
            default:
                return "未知节点";
        }
    }

    // 获取规则名称(节点命名)
    getRuleName() {
        return this.nData.uniqueNodeNum;
    }

    // 获取唯一id
    getUniqueId(){
        return this.id;
    }

    // 获取节点类型（本项目中的节点类型，不是G6的）
    getNodeType(){
        return this.nData.compType;
    }

    // 获取节点标签
    getLabel(){
        return this.label;
    }

    // 获取节点值
    getValue(){
        return JSON.stringify(this.value);
    }

    // =====================子类中的实现=========================
    /**
     * 规则drl规则源码
     * @returns {string}
     */
    getDrlCode() {return ""}
}
// ==========以下是=======元规则流程式内部节点===================
/**
 *元规则-流程式 根节点
 */
export class UnitRuleRoot extends UnitRuleNode{
    constructor(data) {
        super(data);
        // this.transformType();
    }

}
/**
 *元规则-流程式 条件节点
 */
export class UnitRuleCondition extends UnitRuleNode{
    constructor(data) {
        super(data);
        this.nData.constVarList = data['nData']['constVarList'];
        this.nData.conResult = data['nData']['conResult'];
        this.nData.parentResult = data['nData']['parentResult'];
        this.transformType();
    }
    // 转换类型
    transformType() {
        // 将node和conn里面的类进行转换
        // if (isNotEmpty(this.nData.cdList)) this.nData.cdList = this.nData.cdList.map(cd => new Condition(cd));
        // if (isNotEmpty(this.nData.tmpVarList)) this.nData.tmpVarList = this.nData.tmpVarList.map(tmp => new TVars(tmp));
        // if (isNotEmpty(this.nData.ugvResult)) this.nData.ugvResult = new UgvResult(this.nData.ugvResult);
    }


    getDrlCode(dt, obj){
        let node = this;
        return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${UnitRuleG6Model.getContainList(dt, node)})
then
  ${this.getCondition(dt, obj)}
  ${this.getConResult(dt, obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
    }
    // 根据节点的 label 获取条件信息
    getCondition(dt, obj){
        let node = this;
        let errorMsg = [obj.getRuleName(), `节点id:${node.getRuleName()}`, `条件:${node.getValue()}`].join(",");
        if (isEmpty(node.getValue())) return "";
        let result = [];
        result.push("// 判断条件代码生成");
        const _clazzName = beanEnums.AVIATOR_SCRIPT_SERVICE.code;
        const _methodName = beanEnums.AVIATOR_SCRIPT_SERVICE.BUILD_AND_EXEC_FOR_UR;
        result.push(`  
  boolean condition = false;
  try{
    condition = (Boolean) AppFacade.getTcsKieAviatorScriptPlugin().exec(drools, ${node.getValue()}, null);
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }`);
        return result.join("\n");
    }

    // String code = e.toString();
    // String msg = "${errorMsg}," + e.toString() + ":" + e.getMessage();
    // $droolsDto.getErrorMsgList2().add(new ErrMsg(code, msg));
    // 根据条件组合获取该规则的输出
    getConResult(dt, obj) {
        let node = this;
        if (isContainEmpty([node.nData.conResult, node.getValue()])) return "";
        let result = [];
        result.push("// 元规则条件结果判断");

        function setVarOfCode(_node, _ur) {
            // 常规输入的处理
            const _name = [_node.getRuleName(), _ur.name].join("_");;
            return `\t$droolsDto.getVars().put("${_node.getRuleName()}" ,"${_ur.value}");\n`+
                `\t$droolsDto.getVars().put("${_name}" ,"${_ur.value}");\n`+
                `\t$droolsDto.getVars().put("${obj.getRuleName()}" ,"${_ur.value}");`
        }


        node.nData.conResult.forEach((uResult, index) => {
            if (isNotContainEmpty([uResult.name, uResult.value])) {
                if(index==0){
                    result.push(`\nif(condition){\n`);
                }else{
                    result.push(`\n`+
                        `else{\n`);
                }

                result.push(`${setVarOfCode(node, uResult)}\n}`);
            }
        });
        return result.join("\n");
    }

}
/**
 *元规则-流程式  结果节点
 */
export class UnitRuleResult extends UnitRuleNode{
    constructor(data) {
        super(data);
        this.nData.constVarList = data['nData']['constVarList'];
        this.nData.parentResult = data['nData']['parentResult'];

        // this.transformType();
    }
    getDrlCode(dt, obj){
        let node = this;
        return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${UnitRuleG6Model.getContainList(dt, node)})
then
  ${this.unitRuleResult(dt, obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
    }

    getContainList(node) {
        return `ruleIdSet not contains "${node.getRuleName()}"`
    }

    unitRuleResult(dt, obj){
        let node = this;
        if (isEmpty(node.getValue())) return "";
        let resID = [varTypeEnums.ugv.code, obj.getRuleName(), node.getRuleName()].join("_");
        return `$droolsDto.getVars().put("${resID}", ${node.getValue()});`
    }

}
// ==========以上是=======元规则流程式内部节点===================
