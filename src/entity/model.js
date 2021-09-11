import {DrlVar, SCVar, URVar} from "../components";
import {isContainEmpty, isEmpty, isNotContainEmpty, isNotEmpty} from "../utils";
import {Condition} from "../components/rule-node";
import {MapFields} from "../components/cmpt-node";
import {arrOptEnums, beanEnums, compEnums, dataTypeEnums, inteTypeEnums, varFromEnums, varTypeEnums} from "./enumns";
import {
  RateCtrlVar,
  ArrIterationVar,
  ArrVar,
  ConstVar,
  COVar,
  DOVar,
  OBJVar,
  TVars,
  ROVar,
  RedisVal,
  ASVar,
  DataProcessVar, UnitResult, URGVar, DefaultVar, ErLoopConfigVar, FilterVar, DTVar,
} from "./vars";
import {ArrIteration} from "../components/array-node";
import {G6Model} from "./g6Model";
import {DecsRuleRel, DSRel, VarsRel} from "./rel"
import {VarConfig} from "../components/vars-node/v2";
import {DecsBase} from "./decs";
import {RuleBase,CompVarsRule} from "./rule";
import {DatasourceTypeEnums} from "../components/evCmpt-node";
import {CompCondition, ScoreCardResult} from "../components/score-card/"
import {scTypeEnums} from "../entity/enumns";

import RuleVersion from "../views/rule/rule-info/rule-info-tab/RuleVersion";
import {UgvResult} from "../components/rule-node-v2";
import {tqsMapFields} from "../components/tqs-vars-node";
import {GlobalArrOperate} from "./operate";
import {RowOrColVar} from "../components/decs-table";



export const logicConfig = {
  logicLabelList:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
  conditionTypeList:[
    {label:"等于", value:"=="},{label:"大于", value:">"}, {label:"大于等于", value:">="}, {label:"小于", value:"<"}, {label:"小于等于", value:"<="},
    {label:"元素包含", value:"contains"}, {label:"元素不包含", value:"not contains"}, {label:"正则匹配", value:"matches"}
  ]
};

/*export class Condition {
  constructor(data){
    this.id = data.id;
    this.fieldName = data.fieldName;
    this.fieldType = data.fieldType;
    this.conditionType = data.conditionType;
    this.conditionValue = data.conditionValue;
  }
}*/

export class Logic {
  constructor(data) {
    this.id = data.id;
    this.logicType = data.logicType;
    this.name = data.name;
    this.label = data.label;
    this.conditionList = (data.conditionList === undefined ? [] : data.conditionList);
    this.logicList = (data.logicList === undefined ? [] : data.logicList);
    this.isSelect = data.isSelect;
  }

  /**
   * 通过子节点判断自己有没有被选中
   */
  getIsSelectByChild(){
    let that = this;
    let result = that.isSelect;
    if (that.logicList !== undefined && that.logicList.length !== 0) {
      that.logicList.forEach(child =>  result = child.getIsSelectByChild())
    }
    return result
  }

  /**
   * 获取节点深度
   */
  getLevel(){
    let result = 1;
    let that = this;
    if (that.logicList !== undefined && that.logicList.length !== 0) {
      let levelList = that.logicList.map(child => child.getLevel());
      result = Math.max(...levelList) + 1;
    }
    return result;
  }

  /**
   * 将树中所有的同级的节点变为list
   * 例如
   * {
   *    id:"A",
   *    [
   *    {id:"B"},
   *    {id:"C",[{id:"D"}]}
   *    ]
   *  }
   *  ==》 [[{id:"A"}],[{id:"B"}, {id:"C"}] , [{id:"D"}]]
   * @returns {*}
   */
  brotherLogicToList() {
    let that = this;
    let result = [];
    if (that.logicList !== undefined && that.logicList.length !== 0) {
      result.push([that]);
      result.push(that.logicList);
      that.logicList.forEach(logic => {
            logic.brotherLogicToList().forEach(res => {
              result.push(res)
            })
          }
      );
    }
    return result;
  }

  getNodeList() {
    let that = this;
    let result = [];
    result.push(that);
    if (that.logicList !== undefined && that.logicList.length !== 0) {
      that.logicList.forEach(child => {
        child.getNodeList().forEach(logic=>result.push(logic));
      });
    }
    return result;
  }


  getLeafNodeList() {
    let that = this;
    let result = [];
    if (that.logicList !== undefined && that.logicList.length !== 0) {
      // 如果不是叶子节点向下遍历
      that.logicList.forEach(child => {
        child.getLeafNodeList().forEach(logic=>result.push(logic));
      });
    }else {
      // 如果是叶子节点则添加
      result.push(that);
    }
    return result;
  }

  /**
   * 判断传入的节点是否是该树的叶子节点，如果是则返回true
   * @param node
   * @returns {boolean}
   */
  isLeafNode(node){
    let idList = this.getLeafNodeList().map(leaf=>leaf.id);
    return idList.indexOf(node.id) !== -1;
  }

  getLogic() {
    let that = this;
    let result = '';
    switch (that.logicType) {
      case "且":
        result = that.logicList.map(c => {
          return c.getLogic()
        }).join("且");
        return `(${result})`;
      case "或":
        result = that.logicList.map(c => {
          return c.getLogic()
        }).join("或");
        return `(${result})`;
      default:
        return that.label;
    }
  }

  getLogicCode() {
    let that = this;
    let result = '';
    switch (that.logicType) {
      case "且":
        result = that.logicList.map(c => {
          return c.getLogicCode()
        }).join("&&");
        return `(${result})`;
      case "或":
        result = that.logicList.map(c => {
          return c.getLogicCode()
        }).join("||");
        return `(${result})`;
      default:
        return that.conditionList.map(condition => {
          return `$map.get("${condition.fieldName}") ${condition.conditionType} ${condition.conditionValue}`
        }).join("&&");
    }
  }
}


export const ruleFlowConfig = {
  componentTypeList:[
    {value:"", label:"起点"}, {value:"", label:"函数"}, {value:"", label:"规则"},
    {value:"", label:"终点"}, {value:"", label:"组件"},{value:"", label:"kafka"}
  ]
};

/**
 * 工具类
 */
export class Tool {
  constructor(data) {
    this.id = data.id;
    this.icon = data.icon;
    this.isSelect = data.isSelect;
    this.title = data.title;
    this.name = data.name;
  }
}

/**
 * 组件对象，侧边栏可以拖拽的对象
 */
/*export class Component {
  constructor(data) {
    this.id = data["id"];
    this.icon = data["icon"];
    this.name = data["name"];
    this.type = data["type"];
  }
}*/

/**
 * 节点类
 */
export class Node {
  constructor(data) {
    this.id = data["id"];
    this.top = data["top"];
    this.left = data["left"];
    this.name = data["name"];
    this.icon = data["icon"];
    this.type = data["type"]
  }
}

/**
 * 开始节点
 */
// class StartNode extends Node {
//   constructor(data) {
//     super(data);
//     this.ioSpecification = data["ioSpecification"]
//   }
// }

/**
 * 输出节点
 */
// class EndNode extends Node {
//   constructor(data) {
//     super(data);
//     this.ioSpecification = data["ioSpecification"]
//   }
// }


/**
 * 流程需要导入的类，方法
 */
// class Import {
//
// }

/**
 * 连线
 */
export class Connection {
  constructor(data) {
    this.id = data["id"];
    this.from = data["from"];
    this.to = data["to"];
    this.name = data["name"];
  }
}

/**
 * 决策树类
 */
export class DecisionTree {
  constructor(data) {
    if (data === undefined) data = {};
    this.id = data["id"];
    this.name = data["name"];
    this.remark = data["remark"];
    this.importList = data['importList'] === undefined ? [] : data['importList'];
    this.nodeList = data['nodeList'] === undefined ? [] : data['nodeList'];
    this.connList = data["connList"] === undefined ? [] : data['connList'];
    this.scale = data["scale"] === undefined ? 1 : data["scale"]
  }

  drlCode() {

    function getRuleName(node) {
      return node.name;
    }

    function getContainListTemplate(that, node) {
      let parentNodeList = that.connections.filter(connection => {
        return node.id === connection.to
      });

      let containsList = [];
      parentNodeList.forEach(connection => {
        let parentRuleName = that.nodes.filter(node => {
          return connection.from === node.id
        })[0].label;
        let containsTemplate = `nodeList contains ${parentRuleName}`;
        containsList.push(containsTemplate)
      });
      containsList.push(`nodeList not contains ${getRuleName(node)}`);
      return containsList.join(",")
    }


    let ruleListTemplate = [];
    this.nodes.forEach(node => {
      let ruleTemplate = `rule ${getRuleName(node)}
                        no-loop true
                        when
                            $state : State(${getContainListTemplate(this, node)})
                        then
                            $state.getNodeList().add(${getRuleName(node)})
                            update($state)`;
      ruleListTemplate.push(ruleTemplate)
    });
    return ruleListTemplate.join("\n\n");

  }
}



export class DrlCodeAutoCreate {
  constructor(data) {
    if (data === undefined) data = {};
    // this.funcName = data["funcName"];
    this.funcId = data["funcId"];
    this.funcDrl = data["funcDrl"];
    this.varsList = data["varsList"];
  }

  getDrlCode() {

    function getFuncId(that) {
      return that.funcId;
    }

    // function getFuncName(that) {
    //   return that.funcName;
    // }

    function getFuncDrl(that) {
      return that.funcDrl;
    }

    function getFuncUseList(that) {
      let result = [];
      let paras = [];
      that.varsList.forEach(tmpVar => {
        paras.push(`$vars.get("${tmpVar.funcVarName}")`)
        // paras.push(`$vars.get("${tmpVar.funcVarName}")`)
      });
      paras.join(",");
      let code1 = `\tObject res = ${that.funcId}(${paras});`;     // 函数调用
      result.push(code1);
      let code2 = `\t$vars.put("res", res);`; // 结果put
      result.push(code2);

      return result.join("\n");
    }



    let ruleListTemplate = [];    // 源码都拼接在这里

    // 包导入
    ruleListTemplate.push(
        `package com.cmbchina.drools
import java.util.*;
import java.text.SimpleDateFormat;
import java.sql.Timestamp;
import com.alibaba.fastjson.JSONObject;
import com.cmbchina.ns.tcs.common.operations.DateOperation;
import com.cmbchina.ns.tcs.common.operations.FloatOperation;
import com.cmbchina.ns.tcs.common.operations.IntOperation;
import com.cmbchina.ns.tcs.common.operations.StringOperation;
global com.cmbchina.ns.tcs.common.cmpt.CmptSendBatch cmptSendBatch;

${getFuncDrl(this)}
`);

    // dirl规则拼接
    let ruleTemplate =
        `
//  函数测试
rule "${getFuncId(this)}"
  no-loop true
when
  $vars : JSONObject()
  eval(true)
then
  ${getFuncUseList(this)}     
  update($vars)
end  
`;

    ruleListTemplate.push(ruleTemplate);
    return ruleListTemplate.join("\n\n");
  }
}









/**
 * 组件对象，侧边栏可以拖拽的对象
 */
export class Component {
  constructor(data) {
    this.id = data["id"];
    this.icon = data["icon"];
    this.name = data["name"];
    this.type = data["type"];
  }
}


/**
 * G6的节点
 */
export class G6Node {
  constructor(data) {
    if (data === undefined) return {};
    //=================G6自带属性=======================
    this.id = data["id"];
    this.name = data["name"];
    this.label = data["label"];
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
    this.nData.uniqueName = data['nData']["uniqueName"];


  }

  // 获取描述信息
  getDesc() {return this.name;}

  // 获取规则名称
  getRuleName() {
    return this.nData.uniqueName;
  }

  // 获取唯一id
  getUniqueId(){
    return this.id;
  }

  // 获取节点类型（本项目中的节点类型，不是G6的）
  getNodeType(){
    return this.nData.compType;
  }

  /**
   * 获取异常数据的日志
   */
  static getExceptionLogCode({obj}){
    let parentId = obj.getId();
    return ` // 执行异常信息的监听
    AppFacade.getTcsDroolsListenersPlugin().exec(drools, e, "${parentId}");`
  }

  // =====================子类中的实现=========================
  /**
   * 规则drl规则源码
   * @returns {string}
   */
  getDrlCode() {return ""}


  /**
   * 获取节点默认变量，em，，，整合一个节点里面的主要信息，方便直接传入函数进行解析。为了方便扩展，一个节点可能会有多个默认变量
   * 注意：这里仅仅是变量名的定义，变量值的传入会在各种地方，具体看实现节点的说明
   */
  getDefaultVarList(){
    return [];
  }

  /**
   * 获取节点的输出（定义的规范，目前尚未实现）
   * @returns {Array}
   */
  getOutputVarList(){
    return []
  }
}

/**
 * G6的连线
 */
export class G6Edge {
  constructor(data) {
    if (data === undefined) data = {};
    //===============G6中的属性==============
    this.id = data["id"];
    this.source = data["source"];
    this.target = data["target"];
    this.label = data["label"];
    this.type = data["type"];

    //==============本项目中边的属性============
    this.eData = {};
    // 逻辑多选（单条边可以多个情况可以流入）
    this.eData.logicIdList = data["logicIdList"];

  }

  static getDefaultEData() {
    return {eData: {logicIdList:[]}}
  }

}

/**
 * 流量控制节点（
 * @see RateCtrlVar
 */
export class RateCtrlNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.uResultList = data['nData']['uResultList'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    if (isEmpty(this.nData.uResultList)) {
      return
    }
    //this.nData.uResultList = this.nData.uResultList.map(item =>new RateCtrlVar(item));
    this.nData.uResultList = this.nData.uResultList.map(item =>new RateCtrlVar({logicId:item.logicId,rate:item.rate,resultValue:item.logicId+"-"+item.rate}));
  }


  getDrlCode(dt, obj) {
    const node = this;
    if (isEmpty(this.nData.uResultList)){
      return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then

  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
    }else {
      let sumRateCtrlList=[];
      var total=parseInt(0);
      node.nData.uResultList.map(item =>{
        if (!(item instanceof RateCtrlVar)) {
          return
        }else {
          total += item.rate;
          sumRateCtrlList.push(new RateCtrlVar({logicId:item.logicId,rate:total,resultValue:item.resultValue}))
        }
      });
      return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  ${this.getTmpVarList(sumRateCtrlList)}
  ${this.getUResultList(sumRateCtrlList)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
    }

  }

  getTmpVarList(sumRateCtrlList){
    const node = this;
    let result = [];
    result.push("// 随机数生成");
    result.push("  double random = Math.random()*100;");
    return result.join("\n");
  }

  // 根据条件组合获取该规则的输出
  getUResultList(sumRateCtrlList) {
    const node = this;
    let result = [];
    result.push("// 元规则结果代码生成");
    sumRateCtrlList.forEach((item, index) => {
      if(index===0){
        result.push("  if(random<" + item.rate +"){");
      }else{
        result.push("  else if(random<" + item.rate +"){");
      }
      result.push("    $droolsDto.getVars().put(\"" + item.getPrefixVarName(node.nData.uniqueName) +"\",\"" +item.resultValue +"\");");
      result.push("  }");
    });
    return result.join("\n");
  }

}


/**
 * 数据处理节点（临时变量，脚本语言变量的组合，可有可无的节点。。。）
 * @see DataProcessVar
 */
export class DataProcessNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.dpVarList = data['nData']['dpVarList'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    if (isNotEmpty(this.nData.dpVarList)) this.nData.dpVarList = this.nData.dpVarList.map(item => new DataProcessVar(item))
  }

  // 获取当前引用的函数
  getFuncList() {
    if (isNotEmpty(this.nData) && isNotEmpty(this.nData.dpVarList)) {
      return this.nData.dpVarList
          .filter(item => item.processType === DataProcessVar.getEnums().FUNC.code && isNotEmpty(item.func) && isNotEmpty(item.func.funcId))
          .map(item => item.func);
    }
    return [];
  }


  getDrlCode(dt, obj){
    const node = this;

    function getDataProcessCode(_dpVar) {
      const _preName = _dpVar.getPrefixVarName();
      if (_dpVar.processType === DataProcessVar.getEnums().AVIATOR_SCRIPT.code){
        const _asCode = _dpVar.getASCode();
        return `$droolsDto.getVars().put("${_preName}" , AppFacade.getTcsKieAviatorScriptPlugin().exec(drools, ${_asCode}, null);`
      }

      if (_dpVar.processType === DataProcessVar.getEnums().FUNC.code){
        let params = '';
        if (isNotEmpty(_dpVar.inputParams)) {
          params = _dpVar.inputParams.map(item => `$droolsDto.getVars().getOrDefault("${item}", null)`).join(",");
        }
        const funcName = _dpVar.getFuncExecName();
        // drl 函数
        if (_dpVar.func.funcType === '0'){
          return `$droolsDto.getVars().put("${_preName}" , ${funcName}(${params}));`
        }

        // Java 函数
        if (_dpVar.func.funcType === '1'){
          //return `$droolsDto.getVars().put("${_preName}" , $droolsDto.getFuncMap().get("${funcName}").exec(${params}));`
          return `$droolsDto.getVars().put("${_preName}" , AppFacade.getFuncService("${funcName}").exec(${params}));`
        }
      }
    }


    let codeList = "";
    if (isNotEmpty(this.nData) && isNotEmpty(this.nData.dpVarList)) {
      codeList = this.nData.dpVarList.map(item => getDataProcessCode(item)).join("\n")
    }

    return `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
   $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  // 数据处理节点
  try{
    ${codeList}
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;

  }

}

/**
 * 脚本语言节点
 * @see ASVar
 */
export class AviatorScriptNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.asVar = data['nData']['asVar'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    if (isNotEmpty(this.nData.asVar)) this.nData.asVar = new ASVar(this.nData.asVar);
  }

  getDrlCode(dt, obj){
    let node = this;
    // 输入验证
    if (isEmpty(this.nData.asVar)){
      return "";
    }
    const name = ASVar.obj2ASVar(this.nData.asVar).getPrefixVarName();
    const asCode = ASVar.obj2ASVar(this.nData.asVar).getASCode();
    const clazzName = beanEnums.AVIATOR_SCRIPT_SERVICE.code;
    const methodName = beanEnums.AVIATOR_SCRIPT_SERVICE.BUILD_AND_EXEC_FOR_UR;
    return `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
   $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  // 脚本语言节点
  try{
    $droolsDto.getVars().put("${name}" , AppFacade.getTcsKieAviatorScriptPlugin().exec(drools, ${asCode}, null));
} catch (Exception e){
    ${G6Node.getExceptionLogCode({obj:obj})}
}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;

  }

}

/**
 * 组合变量节点
 */
export class CompVarsNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.rule = data['nData']['rule'];
    this.nData.ruleList = data['nData']['ruleList'];
    // 当前节点操作的组合变量
    this.nData.compVarlList = data['nData']['compVarlList'];
    // 当前节点决策和规则的事件变量映射
    this.nData.evMappingList = data['nData']['evMappingList'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.extRuleRelList)) this.nData.compVarlList = this.nData.compVarlList.map(rule => new DecsRuleRel(rule));
    if (isNotEmpty(this.nData.evMappingList)) this.nData.evMappingList = this.nData.evMappingList.map(rule => new RuleVersion(rule));
    if (isNotEmpty(this.nData.rule)) this.nData.rule = new CompVarsRule(this.nData.rule);
    if (isNotEmpty(this.nData.ruleList)) this.nData.ruleList = this.nData.ruleList.map(rule => new CompVarsRule(rule));
  }

  getDrlCode(dt, obj){
    let node = this;
    return `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
   $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  // 组合变量节点
  try{
    app.execServiceMethod("${beanEnums.COMP_VARS_SERVICE.code}", "${beanEnums.COMP_VARS_SERVICE.EXEC}", "${node.getRuleName()}", $droolsDto);
} catch (Exception e){
    ${G6Node.getExceptionLogCode({obj:obj})}
}
  ${this.getROVChange(dt, obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;

  }


  //将规则的输出结果，加上节点标志，以便区分
  getRuleListDrl(dt, obj) {
    let node = this;
    let result = [];
    node.nData.ruleList.forEach(rule => {
      if (isNotEmpty(rule.ruleDrl)) {
        result.push(rule.ruleDrl);
      }
    });

    return result.join("\n");
  }


  //将规则的输出结果，加上节点标志，以便区分
  getROVChange(dt, obj) {
    let node = this;
    let result = [];
    if (isEmpty(this.nData.ruleList)) return result;
    node.nData.ruleList.forEach(rule => {
      if (isNotEmpty(rule.ruleId)) {
        let code1 = `$droolsDto.getVars().put("${[varTypeEnums.rov.code, rule.ruleId, node.getRuleName()].join("_")}", $droolsDto.getVars().getOrDefault("${[varTypeEnums.rov.code, rule.ruleId].join("_")}", null));`
        let code2 = `  $droolsDto.getVars().remove("${[varTypeEnums.rov.code, rule.ruleId].join("_")}");`;
        result.push(code1);
        result.push(code2);

        if (isNotEmpty(rule.ruleResultList)) {
          rule.ruleResultList.forEach(item => {
            if (isNotEmpty(item.varName)) {
              let code1 = `$droolsDto.getVars().put("${[varTypeEnums.rov.code, rule.ruleId, item.varName, node.getRuleName()].join("_")}", $droolsDto.getVars().getOrDefault("${[varTypeEnums.rov.code, rule.ruleId, item.varName].join("_")}", null));`
              let code2 = `  $droolsDto.getVars().remove("${[varTypeEnums.rov.code, rule.ruleId, item.varName].join("_")}");`;
              result.push(code1);
              result.push(code2);
            }
          });
        }
      }
    });

    return result.join("\n");
  }

}

/**
 * 规则结果节点 074389
 * @see ROVar
 */
export class RuleResultNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.ruleResultList = data['nData']['ruleResultList'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.ruleResultList)) this.nData.ruleResultList = this.nData.ruleResultList.map(item => new ROVar(item));
  }

  getDrlCode(dt, obj){
    let node = this;
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
  agenda-group "rov"
when
   $droolsDto : DroolsDto(${this.getContainList(node)})
then
  // 规则结果映射
  ${this.getRRMappingList(dt, obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }

  getContainList(node) {
    return `ruleIdSet not contains "${node.getRuleName()}"`
  }

  getRRMappingList(dt, obj) {
      if (isEmpty(this.nData.ruleResultList)) return "";
      function getCodeByFieldFrom(item) {
          let code = '';
          if (isEmpty(item.varName)) { //映射名是空的，不输出结果
            return code;
          }


          switch (item.fieldFrom) {
              case varFromEnums.edit.code:
                  code = `$droolsDto.getVars().put("${obj.getOutputName()}_${item.varName}", "${item.fieldResult}");`;
                  break;
              case varFromEnums.rel.code:
                  code = `$droolsDto.getVars().put("${obj.getOutputName()}_${item.varName}", $droolsDto.getVars().getOrDefault("${item.mapField}", null));`;
                  break;
              case varFromEnums.rel.varPlatform:
                  code = "";
                  break;
          }
          return code;
      }

      return this.nData.ruleResultList.map(item => getCodeByFieldFrom(item)).join("\n  ")
  }

}


//入库组件节点
export class EvStoreNode extends G6Node {
  constructor(data) {
    super(data);
    // 选择的数据源
    this.nData.datasource = data.nData.datasource;
    // 组件的字段映射
    this.nData.evMapFieldList = data.nData.evMapFieldList;
    this.nData.datasource = data['nData'].datasource;

    this.nData.addOrUpdate = (isEmpty(data['nData'].addOrUpdate) ? "U": data['nData'].addOrUpdate);
    this.nData.synchronOrAsynchron = (isEmpty(data['nData'].synchronOrAsynchron) ? "S": data['nData'].synchronOrAsynchron);
  }

  getDSRelList(obj){

    let result=[];
    if (isNotEmpty(this.nData.datasource)){
      if(result.filter(item=>item.datasource === this.nData.datasource).length===0){
        if (isNotContainEmpty([obj.prodId,this.nData.datasource.datasourceId,obj.decsId])){
          result.push({
            prodId:  obj.prodId,
            datasourceId: this.nData.datasource.datasourceId,
            datasourceRelType: "DECS",
            relId: obj.decsId,
            relVersion: "",
          })
        }
      }
    }
    return result;
  }

  getDrlCode(dt, obj) {
    let node = this;
    return `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  JSONObject cmptMessage = new JSONObject();
  JSONObject data = new JSONObject();
  
  ${this.getEvCmptMapField(dt, node)}
  
  // 组装数据，通过组件将数据结果传出
  ${this.getEvCmptResult(dt, node)} 
  
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }

  /**
   * 获取组件结果并输出
   * @param that
   * @param node
   */
  getEvCmptResult(that, node) {

    if (node.getNodeType()  !== compEnums.EVStore.code || node.nData.datasource === undefined || node.nData.datasource.datasourceId === undefined) return "";
    let dataland = node.nData.datasource.dataLand;
    let result = '';
    if (isNotEmpty(dataland)) {
      if (dataland.land_mode === DatasourceTypeEnums.jdbc.code) {
        let dsId = node.nData.datasource.datasourceId;
        result = `
    cmptMessage.put("data", data);
    cmptMessage.put("dataSourceId", "${dsId}");
    cmptMessage.put("parseType", "${node.nData.addOrUpdate}");
    cmptMessage.put("isSynchronous", "${node.nData.synchronOrAsynchron}");
    cmptMessage.put("_table", "${node.nData.datasource.dataLand['jdbc_table']}");
    // JSONObject result = (JSONObject) app.execServiceMethod("${beanEnums.CMPT_SEND_BATCH.code}", "${beanEnums.CMPT_SEND_BATCH.ADD_OR_UPDATE_JDBC}", cmptMessage);
    JSONObject result = (JSONObject)  AppFacade.getTcsKieDataSourcePlugin().exec(drools, "${node.getRuleName()}_${dsId}", cmptMessage);
    $droolsDto.getCmptResult().put("${node.getRuleName()}_${dsId}", result);
    `;
      } else {
        return "";
      }
    }

    return result;
  }

  /**
   * 拼接组件的字段映射代码
   * @param that
   * @param node
   * @returns {string}
   */
  getEvCmptMapField(that, node) {
    let code = [];
    if (isNotEmpty(node.nData.evMapFieldList)) {
      code = node.nData.evMapFieldList.map(item => this.getCodeByFieldFrom(item, node));
    }
    //去除空白行
    let result = [];
    code.forEach(line => {
      if (line.trim().length) {
        result.push(line);
      }
    });
    return result.join("\n  ");
  }
  /**
   * 根据字段
   * @param item 变量对象
   * @param type 拼接代码操作对象，pathVariable，requestParam，requestBody
   * @returns {string}
   */
  getCodeByFieldFrom(item, node){

    if (node.getNodeType()  !== compEnums.EVStore.code || node.nData.datasource === undefined  || node.nData.datasource.datasourceId === undefined) return "";
    let dataland = node.nData.datasource.dataLand;
    let fieldName = "";
    if(isNotEmpty(dataland)){
      if(dataland.land_mode === DatasourceTypeEnums.jdbc.code){
          fieldName=item.fieldName;
      }
    }
    let code = '';
    switch (item.fieldFrom) {
      case varFromEnums.edit.code:
        if(isNotEmpty(item.fieldResult)){
          code = `data.put("${fieldName}", "${item.fieldResult}");`;
        }
        break;
      case varFromEnums.rel.code:
        if(isNotEmpty(item.mapField)){
          code = `data.put("${fieldName}", $droolsDto.getVars().get("${item.mapField}"));`;
        }
        break;
      case varFromEnums.rel.varPlatform:
        code = "";
        break;
    }
    return code;
  }
}


/**
 * 决策表节点
 *
 */
export class DecsTableNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.cellMap = data['nData']['cellMap'];
    this.nData.colCdList = data['nData']['colCdList'];
    this.nData.colVar = data['nData']['colVar'];
    this.nData.rowCdList = data['nData']['rowCdList'];
    this.nData.rowVar = data['nData']['rowVar'];
    this.nData.dtVar = data['nData']['dtVar'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    if (isNotEmpty(this.nData.colCdList)) this.nData.colCdList = this.nData.colCdList.map(cd => new Condition(cd));
    if (isNotEmpty(this.nData.colVar)) this.nData.colVar = RowOrColVar.obj2RowOrColVar(this.nData.colVar);
    if (isNotEmpty(this.nData.rowCdList)) this.nData.rowCdList = this.nData.rowCdList.map(cd => new Condition(cd));
    if (isNotEmpty(this.nData.rowVar)) this.nData.rowVar = RowOrColVar.obj2RowOrColVar(this.nData.rowVar);
    if (isNotEmpty(this.nData.dtVar)) this.nData.rowVar = DTVar.obj2DTVar(this.nData.dtVar);
  }

  getDrlCode(dt, obj) {
    let node = this;
    return `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  try {
  
  ${this.getCdResult(dt, obj)}
  
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }

  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)    
end`;
  }


  // 初始化得到row和col的长度和结果
  getCdResult(dt, obj) {
    let node = this;
    let result = [];
    // 临时变量，初始化
    result.push(`int rowLen = 0;`);
    result.push(`  int colLen = 0;`);
    result.push(`  Object dtResult = null;`);
    if (!isEmpty(node.nData.rowCdList)) {
      result.push(`  rowLen = ${node.nData.rowCdList.length};`);
    }
    if (!isEmpty(node.nData.colCdList)) {
      result.push(`  colLen = ${node.nData.colCdList.length};`);
    }
    result.push(`  int indexRow = rowLen;`);
    result.push(`  int indexCol = colLen;`);

    // 决策表结果边界
    result.push("// 判断条件索引生成");
    if (isEmpty(node.nData.rowCdList) && isEmpty(node.nData.colCdList)) {

    } else if (isEmpty(node.nData.rowCdList)) {
      result.push(this.getColCdMatchIndex(dt, obj));
    } else if (isEmpty(node.nData.colCdList)) {
      result.push(this.getRowCdMatchIndex(dt, obj));
    } else {
      result.push(this.getRowCdMatchIndex(dt, obj));
      result.push(this.getColCdMatchIndex(dt, obj));
    }

    // 结果赋值
    result.push("// 结果赋值");
    result.push(`  Object[][] matrixValue = new Object[rowLen + 1][colLen + 1];`);
    for (let i = 0; i < node.nData.rowCdList.length + 1; i++) {
      for (let j = 0; j < node.nData.colCdList.length + 1; j++) {
        result.push(`  matrixValue[${i}][${j}] = "${node.nData.cellMap[i][j]}";`);
      }
    }

    const tempDtVar = DTVar.obj2DTVar(node.nData.dtVar);
    if (tempDtVar.enableAlias()) {
      result.push(`   $droolsDto.getVars().put("${tempDtVar.getAliasName()}", matrixValue[indexRow][indexCol]);`)
    } else {
      result.push(`   $droolsDto.getVars().put("${tempDtVar.getPrefixVarName()}", matrixValue[indexRow][indexCol]);`)
    }



    return result.join("\n");
  }

  // row方向上命中的索引
  getRowCdMatchIndex(dt, obj) {
    let node = this;
    let result = [];
    let curIndex = 0;
    node.nData.rowCdList.forEach(cd => {
      result.push(`  try{
    if(${cd.getDtDrlCode(obj, node)}) indexRow = ${curIndex};
  } catch (Exception e) {
    ${G6Node.getExceptionLogCode({obj: obj})}
  }`);
      curIndex = curIndex + 1;
    });
    return result.join("\n");
  }

  // col方向上命中的索引
  getColCdMatchIndex(dt, obj) {
    let node = this;
    let result = [];
    let curIndex = 0;
    node.nData.colCdList.forEach(cd => {
      result.push(`  try{
    if(${cd.getDtDrlCode(obj, node)}) indexCol = ${curIndex};
  } catch (Exception e) {
    ${G6Node.getExceptionLogCode({obj: obj})}
  }`);
      curIndex = curIndex + 1;
    });
    return result.join("\n");
  }


}


/**
 * 评分卡节点
 *
 */
export class ScoreCardNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.cdList = data['nData']['cdList'];
    this.nData.scoreType = data['nData']['scoreType'];
    this.nData.scResultList = data['nData']['scResultList'];
    // 为了兼容评分卡出去的连线可以选择
    this.nData.uResultList = data['nData']['scResultList'];

    /**
     *  评分结果配置
      */
    this.nData.scVar = isEmpty(data['nData']['scVar']) ? new SCVar() : data['nData']['scVar'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.cdList)) this.nData.cdList = this.nData.cdList.map(cd => new CompCondition(cd));
    if (isNotEmpty(this.nData.scResultList)) this.nData.scResultList = this.nData.scResultList.map(scResult => new ScoreCardResult(scResult));
    if (isNotEmpty(this.nData.uResultList)) this.nData.uResultList = this.nData.uResultList.map(scResult => new ScoreCardResult(scResult));
  }

  getDrlCode(dt, obj){
    let node = this;
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  double totalScore = 0;
  $droolsDto.getVars().put("${node.getRuleName()}_SCORE" ,totalScore);
  ${this.getAllScoreVar(dt, obj)}
  ${this.getCdList(dt, obj)}
  ${this.getScore(dt, obj)}
  ${this.getSCResultList(dt, obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }

  //定义所有的变量得分先
  getAllScoreVar(dt, obj){
    let node = this;
    let result = [];
    if (isEmpty(node.nData.cdList)) return "";
    result.push("// 定义所有的变量得分");
    let varList = node.nData.cdList.map(cd => cd.cdVarName);
    varList = Array.from(new Set(varList));
    varList.forEach(v => {
      result.push(`  double d_${v} = 0;`);
      result.push(`  boolean b_${v} = false;`);
    });
    result.push(`  //int varNumber = ${varList.length};`);
    // result.push(`  double totalScore = 0;`);
    result.push("\n");
    return result.join("\n");
  }

  // 根据节点的 cdList 获取条件信息
  getCdList(dt, obj){
    let node = this;
    if (isEmpty(node.nData.cdList)) return "";
    let result = [];
    result.push("// 判断条件代码生成");
    node.nData.cdList.forEach(cd => {
        result.push(cd.getDrlCode(obj, node));
    });
    return result.join("\n");
  }

  doScore1(){
    let node = this;
    let result = [];
    result.push("// 计算最后得分");
    if (isEmpty(node.nData.cdList)) return "";
    let varList = node.nData.cdList.map(cd => {
      return {
        v:cd.cdVarName,
        w:cd.cdWeight,
      }});
    varList = varList.sort();

    let varList2 = [varList[0]];
    for(let i = 1; i < varList.length; i++) {
      if( varList[i].v !== varList[i-1].v) {
        varList2.push(varList[i]);
      }
    }
    let divisor = 0;

    varList2.forEach(item => {
      switch(node.nData.scoreType) {
        case scTypeEnums.SUM.code:
          result.push(`  totalScore += d_${item.v};`);
          break;
        case scTypeEnums.WSUM.code:
          result.push(`  totalScore += (d_${item.v} * ${item.w});`);
          break;
        case scTypeEnums.AVG.code:
          divisor = varList2.length;
          result.push(`  totalScore += d_${item.v};`);
          break;
        case scTypeEnums.WAVG.code:
          divisor += (item.w - 0);
          result.push(`  totalScore += (d_${item.v} * ${item.w});`);
          break;
        default:
          break;
      }
    });

    if(divisor === 0 ) {
      divisor = 1;
    }

    result.push(`  totalScore = totalScore/${divisor};`);
    //默认输出
    result.push(`  $droolsDto.getVars().put("${node.getRuleName()}_SCORE" ,totalScore);`);

    return result.join("\n");
  }

  doScore2(){
    let cdVarNameList = Array.from(new Set(this.nData.cdList.map(item => item.cdVarName)));
    let arrayAddCode = cdVarNameList.map(cdVarName => `      array.add(d_${cdVarName});`).join("\n");

    if (this.nData.scoreType === scTypeEnums.MAX.code) {
      return `
      JSONArray array = new JSONArray();
${arrayAddCode}
      totalScore = ArrayOperation.max("", array);
      $droolsDto.getVars().put("${this.getRuleName()}_SCORE" ,totalScore);
      `
    } else {
      return `
      JSONArray array = new JSONArray();
${arrayAddCode}
      totalScore = ArrayOperation.min("", array);
      $droolsDto.getVars().put("${this.getRuleName()}_SCORE" ,totalScore);
      `
    }

  }

  /**
   * em，，又是修改别人代码。最大值和最小值的实现完全不相同，只能分开了
   * @param dt
   * @param obj
   * @returns {string|*}
   */
  getScore(dt, obj){
    let node = this;
    if ([scTypeEnums.SUM.code, scTypeEnums.WSUM.code, scTypeEnums.AVG.code, scTypeEnums.WAVG.code].includes(node.nData.scoreType)) {
      return this.doScore1();
    } else if ([scTypeEnums.MAX.code, scTypeEnums.MIN.code].includes(node.nData.scoreType)) {
      return this.doScore2();
    } else {
      return "";
    }
  }

   // 根据条件组合获取该规则的输出
  getSCResultList(dt, obj) {
    let node = this;
    if (isEmpty(node.nData.scResultList)) return "";
    let result = [];
    result.push("// 评分卡结果代码生成");

    function setVarOfCode(_node, _sc) {
      // 常规输入的处理
      const _name = ScoreCardResult.getName(_node, _sc);
      const scVar = SCVar.obj2SCVar(_node.nData.scVar)
      if (scVar.enableAlias()) {
        return `$droolsDto.getVars().put("${scVar.getAliasName()}" ,"${_sc.resultValue}");
              $droolsDto.getVars().put("${_node.getRuleName()}" ,"${_sc.resultValue}");
              $droolsDto.getVars().put("${_name}" ,"${_sc.resultValue}");
              $droolsDto.getVars().put("${obj.getOutputName()}" ,"${_sc.resultValue}");`
      } else {
        return `$droolsDto.getVars().put("${_node.getRuleName()}" ,"${_sc.resultValue}");
              $droolsDto.getVars().put("${_name}" ,"${_sc.resultValue}");
              $droolsDto.getVars().put("${obj.getOutputName()}" ,"${_sc.resultValue}");`
      }
    }

    function getIfElse(_node, _scResult, _index, _logic) {
      // 仅有默认结果
      if (_node.nData.scResultList.length === 1 && _scResult.logicId === 999) {
        return setVarOfCode(_node, _scResult)
      } else { // 有默认结果和其他结果
        if (_index === 0) {
          return `
  if(${_logic}){
    ${setVarOfCode(_node, _scResult)}
  }`;
        } else {
          return `
  else if (${_logic}) {
    ${setVarOfCode(_node, _scResult)}
  }`;
        }
      }
    }

    node.nData.scResultList.forEach((scResult, index) => {
      if (isNotContainEmpty([scResult.logicId, scResult.resultValue])
          && (scResult.logicId === 999 || isNotEmpty(scResult.start) || isNotEmpty(scResult.end))) {
        let logic = ``;
        if (scResult.logicId === 999) {
          logic = true;
        } else {
          let logicArr = [];
          if (isNotEmpty(scResult.start)) {
            logicArr.push(`totalScore>=${scResult.start}`);
          }

          if (isNotEmpty(scResult.end)) {
            logicArr.push(`totalScore<=${scResult.end}`);
          }

          logic = logicArr.join('&&');
        }

        result.push(getIfElse(node, scResult, index, logic))
      }
    });
    return result.join("\n");

  }
}
/**
 * 循环规则节点
 * @see FilterVar
 */
export class FilterNode extends G6Node{
  constructor(data){
    super(data);
    // 过滤变量的配置文件，目前就一个
    this.nData.filterVar = data['nData']['filterVar'];
  }

  getDrlCode(dt, obj) {
    let node = this;
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  try{
    Object arr = ArrayOperation.filter($droolsDto, "${this.nData.filterVar.filterArrName}", ${JSON.stringify(JSON.stringify(this.nData.filterVar))});
    $droolsDto.getVars().put("${FilterVar.obj2ERLVar(this.nData.filterVar).getPrefixVarName()}", arr);
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }

  getOutputVarList() {
    if (isNotEmpty(this.nData.filterVar)) {
      return [FilterVar.obj2ERLVar(this.nData.filterVar)];
    } else {
      return [];
    }
  }
}

/**
 * 循环规则节点
 * @see ErLoopConfigVar
 * @see com.cmbchina.ns.tcs.common.extruleloop.entity.ErLoopNode（后端）
 */
export class ERVLoopNode extends G6Node{
  constructor(data){
    super(data);
    this.nData.erlVarList = data['nData']['erlVarList'];
  }


  getOutputVarList() {
    if (isNotEmpty(this.nData.erlVarList)) {
      return this.nData.erlVarList.map(item => ErLoopConfigVar.obj2ERLVar(item));
    } else {
      return [];
    }
  }

  getDrlCode(dt, obj) {
    let node = this;
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  try{
    // app.execServiceMethod("${beanEnums.ER_LOOP_SERVICE.code}", "${beanEnums.ER_LOOP_SERVICE.EXEC_V2}", "${node.getRuleName()}", $droolsDto);
    AppFacade.getTcsKieErLoopPlugin().exec(drools, null, null);
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }
}

/**
 * 外部规则节点
 * @see com.cmbchina.ns.tcs.common.extrule.ExtRuleV2Node （后端）
 * @see RuleBase 规则的基本信息
 * @see RIVar 规则输入变量
 * @see ROVar 规则输出变量
 * @see G6Model.getEResultVarsOfParents 获取父节点中为外部规则节点的变量
 */
export class ExtRuleNodeV2 extends G6Node{
  constructor(data) {
    super(data);
    // 当前节点引入的规则（基础表和版本表）
    this.nData.extRuleList = data['nData']['extRuleList'];
    // 规则输入
    this.nData.rivVarListMap = data['nData']['rivVarListMap'];
    // 规则结果
    this.nData.rovVarListMap = data['nData']['rovVarListMap'];
  }

  /**
   * 定义外部规则节点的默认输出，目前仅一个默认输出
   *
   * key 为 df_{节点名}_1
   * value 为
   * [
   *  {
   *    "rov": {
   *        "lu88_rule_cxTest4": "11",
   *        "lu88_rule_cxTest4_merchantId": "12"
   *     },
   *     "ruleId": "lu88_rule_cxTest4"
   *  },
   *  {
   *    "rov": {
   *        "lu88_rule_intlgUnusualtm ": "11"
   *     },
   *    "ruleId": "lu88_rule_intlgUnusualtm"
   *  }
   * ]
   *
   * 注：这里仅定义规范，实现（即塞进key和value的位置）见后端 com.cmbchina.ns.tcs.common.extrule.ExtRuleService
   *
   * @returns {Array}
   */
  getDefaultVarList() {
    let df = new DefaultVar();
    df.varName = [super.getRuleName().toLowerCase(), "1"].join("_");
    df.varType = dataTypeEnums.ARRAY.code;
    df.varFrom = varTypeEnums.df.code;
    df.varDesc = "外部规则节点默认输出";
    return [df];
  }


  static getRuleResult(extRule) {
    let result = [];
    if (isEmpty(extRule.ruleJson)) {
      return result;
    }

    result.push(new ROVar({varName: extRule.ruleId, varDesc: "规则默认输出"}));
    const dt = JSON.parse(extRule.ruleJson);
    dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {
      if (node.getNodeType() === compEnums.RR.code && isNotEmpty(node.nData.ruleResultList)) {
        result.push(...node.nData.ruleResultList.map(item => new ROVar({varName: [extRule.ruleId, item.varName].join("_")})));
      }
    });
    return result;
  }

  getROVarList() {
    const result = [];
    Object.keys(this.nData.rovVarListMap).forEach(key => {
      // 变量名添加节点Id
      result.push(...this.nData.rovVarListMap[key].map(item => {
        let result = {};
        Object.assign(result, item);
        result.varName = [result.varName,  this.getRuleName()].join("_");
        return new ROVar(result)
      }))
    });
    return result;
  }


  getDrlCode(dt, obj){
    let node = this;
    if (isEmpty(node.nData.extRuleList))
    {
      return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
  end`;
    } else {


      return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  try{
    // app.execServiceMethod("${beanEnums.EXT_RULE_SERVICE.code}", "${beanEnums.EXT_RULE_SERVICE.EXEC_V2}", "${node.getRuleName()}", $droolsDto);
    AppFacade.getTcsKieExtRulePlugin().exec(drools, null, null);
} catch (Exception e){
    ${G6Node.getExceptionLogCode({obj:obj})}
}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
    }
  }


}

/**
 * 元规则节点类
 */
export class UnitRuleNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.tmpVarList = data['nData']['tmpVarList'];
    this.nData.cdList = data['nData']['cdList'];
    this.nData.uResultList = data['nData']['uResultList'];
    this.nData.urVar = data['nData']['urVar'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.cdList)) this.nData.cdList = this.nData.cdList.map(cd => new Condition(cd));
    if (isNotEmpty(this.nData.tmpVarList)) this.nData.tmpVarList = this.nData.tmpVarList.map(tmp => new TVars(tmp));
    if (isNotEmpty(this.nData.uResultList)) this.nData.uResultList = this.nData.uResultList.map(uResult => new UnitResult(uResult));
    if (isNotEmpty(this.nData.urVar)) this.nData.urVar = URVar.obj2UrVar(this.nData.urVar);
  }


  getDrlCode(dt, obj){
    let node = this;
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  ${this.getTmpVarList(dt, obj)}
  ${this.getCdList(dt, obj)}
  ${this.getUResultList(dt, obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }

  // 根据节点的 tmpVarList 获取函数映射信息
  getTmpVarList(dt, obj){
    let node = this;
    let result = [];
    if (isEmpty(node.nData.tmpVarList)) return "";
    result.push("// 中间变量代码生成");
    node.nData.tmpVarList.forEach(tmpVar=>{
      let paras = [];
      if (isEmpty(tmpVar.errorList())){
        // 函数参数
        tmpVar.inputParams.forEach(input => paras.push(`$droolsDto.getVars().getOrDefault("${input}", null)`));
        let code1 = "";
        if (tmpVar.func.funcType === "0"){
          // 函数捕捉异常
          code1 = `  
  Object ${tmpVar.getPrefixVarName()} = null;
  try{
      ${tmpVar.getPrefixVarName()} = ${tmpVar.getFuncExecName()}(${paras.join(",")});
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }`;
        } else {
          code1 = `  
  Object ${tmpVar.getPrefixVarName()} = null;
  try{
      //${tmpVar.getPrefixVarName()} = $droolsDto.getFuncMap().get("${tmpVar.getFuncExecName()}").exec(${paras.join(",")});
      ${tmpVar.getPrefixVarName()} = AppFacade.getFuncService("${tmpVar.getFuncExecName()}").exec(${paras.join(",")});
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }`;
        }
        let code2 = `  $droolsDto.getVars().put("${tmpVar.getPrefixVarName()}", ${tmpVar.getPrefixVarName()});`;
        result.push(code1);
        result.push(code2);
      }
    });
    return result.join("\n");
  }

  // 根据节点的 cdList 获取条件信息
  getCdList(dt, obj){
    let node = this;
    if (isEmpty(node.nData.cdList)) return "";
    let result = [];
    result.push("// 判断条件代码生成");
    node.nData.cdList.forEach(cd => {
        result.push(cd.getDrlCode(obj, node));
    });
    return result.join("\n");
  }

  // 根据条件组合获取该规则的输出
  getUResultList(dt, obj) {
    let node = this;
    if (isContainEmpty([node.nData.uResultList, node.nData.cdList])) return "";
    let result = [];
    result.push("// 元规则结果代码生成");
    let cdIdList = node.nData.cdList.map(cd => cd.cdId);

    function setVarOfCode(_node, _ur) {
      // 常规输入的处理
      const _name = UnitResult.getName(_node, _ur);
      const result = [];

      if (isEmpty(_ur.varFrom) || _ur.varFrom === varFromEnums.edit.code) {

        result.push(`$droolsDto.getVars().put("${_node.getRuleName()}" ,"${_ur.resultValue}");`);
        result.push(`$droolsDto.getVars().put("${_name}" ,"${_ur.resultValue}");`);
        result.push(`$droolsDto.getVars().put("${obj.getOutputName()}" ,"${_ur.resultValue}");`);
        if (_node.nData.urVar && _node.nData.urVar.enableAlias()) {
          result.push(`$droolsDto.getVars().put("${_node.nData.urVar.getAliasName()}" ,"${_ur.resultValue}");`)
        }
      }

      // 表达式的处理
      if (_ur.varFrom === varFromEnums.aviatorScript.code) {
        let execCode = `AppFacade.getTcsKieAviatorScriptPlugin().exec(drools, "${_ur.resultValue}", null)`;
        result.push(`$droolsDto.getVars().put("${_node.getRuleName()}", ${execCode});`);
        result.push(`$droolsDto.getVars().put("${_name}", ${execCode});`);
        result.push(`$droolsDto.getVars().put("${obj.getOutputName()}" ,${execCode});`);
        if (_node.nData.urVar && _node.nData.urVar.enableAlias()) {
          result.push(`$droolsDto.getVars().put("${_node.nData.urVar.getAliasName()}" , ${execCode});`)
        }
      }

      return result.join("\n");
    }

    function getIfElse(_node, _uResult, _index, _logic) {
      // 仅有默认结果
      if (_node.nData.uResultList.length === 1 && _uResult.logicId === 999) {
        return setVarOfCode(_node, _uResult)
      } else { // 有默认结果和其他结果
        if (_index === 0) {
          return `
  if(${_logic}){
    ${setVarOfCode(_node, _uResult)}
  }`;
        } else {
          return `
  else if (${_logic}) {
    ${setVarOfCode(_node, _uResult)}
  }`;
        }
      }
    }

    node.nData.uResultList.forEach((uResult, index) => {
      if (isNotContainEmpty([uResult.logic, uResult.resultValue])) {
        let logic = uResult.logic;
        cdIdList.forEach(cdId => {
          logic = logic.replace(new RegExp(cdId, 'g'), `condition${cdId}`)
        });
        if (uResult.logicId === 999){
          logic = true;
        }
        result.push(getIfElse(node, uResult, index, logic))
      }
    });
    return result.join("\n");
  }
}
/**
 * 元规则节点类-流程式编辑形式
 */
export class UnitRuleNodeV2 extends G6Node {
  constructor(data) {
    super(data);
    this.nData.tmpVarList = data['nData']['tmpVarList'];
    this.nData.ugvResultList = data['nData']['ugvResultList'];
    /**
     * @see URGVar
     */
    this.nData.urgVar = isEmpty(data['nData']['urgVar']) ? new URGVar() : data['nData']['urgVar'];

    this.transformType();
  }
  transformType(){
    this.nData.uResultList = [];
    var ugvResultListArr = UgvResult.json2Arr(this.nData.ugvResultList);
    if(isNotEmpty(ugvResultListArr)&&ugvResultListArr[0]!==""){
      ugvResultListArr.forEach (item=>{
        var resultNo =  item.split(":")[0];
        resultNo=resultNo.substring(1,resultNo.length-1);
        var resultValue =  item.split(":")[1];
        if(isNotEmpty(resultValue)){
          resultValue=resultValue.substring(1,resultValue.length-1);
          var uResult=[];
          if(resultValue!=""&&resultNo!=""){
            uResult.logicId=resultNo;
            uResult.resultValue=resultValue;
            uResult.resultDesc="";
            this.nData.uResultList.push(uResult);
          }
        }
      });
    }

  }

  getId(){
    return this.getRuleName();
  }


  getDrlCode(dt, obj){
    let node = this;
    let errorMsg = [obj.getId(), `节点id:${node.getRuleName()}`,].join(",");
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  try{
    //元规则-流程式节点
    //app.execServiceMethod("${beanEnums.UNIT_RULE_V2_SERVICE.code}", "${beanEnums.UNIT_RULE_V2_SERVICE.EXEC}", "${node.getRuleName()}", $droolsDto);
    AppFacade.getTcsKieUnitRulePlugin().exec(drools, null, null);
  } catch (Exception e){
    ${G6Node.getExceptionLogCode({obj:obj})}
  }
  ${this.getUGVResultList(dt, obj)}
  // 重命名结果
  ${this.renameUGVResult(dt, obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }


  getUGVResultList(dt, obj) {
    let node = this;
    let result = [];
    result.push("//元规则-流程式节点结果代码生成\n");
    //console.log(Object.keys(JSON.parse(node.nData.evMappingList)));

    if(node.nData.ugvResultList===undefined){
      node.nData.ugvResultList =[];
    }
    let ugvResultList = node.nData.ugvResultList;
    var ugvResultListArr = UgvResult.json2Arr(ugvResultList);
    if (isNotEmpty(ugvResultListArr) &&ugvResultListArr[0]!=="") {
      ugvResultListArr.forEach (item=>{
        var resultNo =  item.split(":")[0];
        resultNo=resultNo.substring(1,resultNo.length-1);
        var resultValue =  item.split(":")[1];
        resultValue=resultValue.substring(1,resultValue.length-1);
        if(isNotEmpty(resultValue)){
          let code1 = `  $droolsDto.getVars().put("${[varTypeEnums.ugv.code, node.getRuleName(), resultNo, node.getRuleName()].join("_")}", $droolsDto.getVars().getOrDefault("${[varTypeEnums.ugv.code, node.getRuleName(), resultNo].join("_")}", null));`
          let code2 = `  $droolsDto.getVars().remove("${[varTypeEnums.ugv.code, node.getRuleName(), resultNo].join("_")}");`;
          result.push(code1);
          result.push(code2);
        }
      });
    }
    return result.join("\n");
  }

  /**
   * 对流程图对象重命名（嗯，你可能觉得我写的什么鬼，这么绕，那是因为历史代码不是我写的，不太想直接修改别人代码，，，）
   * 常规名：[varTypeEnums.ugv.code, node.getRuleName(), resultNo, node.getRuleName()].join("_") -> node.getRuleName()
   * 别名：[varTypeEnums.ugv.code, node.getRuleName(), resultNo, node.getRuleName()].join("_") ->
   *
   * @param dt
   * @param obj
   */
  renameUGVResult(dt, obj){
    let ugvResultList = this.nData.ugvResultList;
    let ugvResultListArr = UgvResult.json2Arr(ugvResultList);
    return ugvResultListArr.map(item=>{
      let resultNo = item.split(":")[0];
      resultNo = resultNo.substring(1, resultNo.length - 1);
      let orginValue = `$droolsDto.getVars().get("${[varTypeEnums.ugv.code, this.getRuleName(), resultNo, this.getRuleName()].join("_")}")`;

      return `if(${orginValue} != null ){
        $droolsDto.getVars().put("${this.getRuleName()}", ${orginValue});
        ${this.aliasResult(orginValue)}
    }`
    }).join("\n");
  }

  /**
   * 别名代码生成
   * @param orginValue
   * @returns {string}
   */
  aliasResult(orginValue) {
    let urgVar = new URGVar();
    // 属性赋值，防止传入的是对象而没有方法
    Object.assign(urgVar, this.nData.urgVar);


    if (urgVar.enableAlias()) {
      return `$droolsDto.getVars().put("${urgVar.getAliasName()}",${orginValue});`
    }

    return "";
  }
}

/**
 * 组件节点类
 */
export class CmptNode extends G6Node{
  constructor(data) {
    super(data);
    // 选择的组件
    this.nData.cmpt = data['nData'].cmpt;
    // 和组件的字段映射
    this.nData.mapFieldList = data['nData'].mapFieldList;
    this.nData.pathFieldList = data['nData'].pathFieldList;
    this.nData.headerFieldList = data['nData'].headerFieldList;
    this.nData.paramsFieldList = data['nData'].paramsFieldList;
    this.nData.covFieldList = data['nData'].covFieldList;

    this.nData.synchronOrAsynchron = (isEmpty(data['nData'].synchronOrAsynchron) ? "S": data['nData'].synchronOrAsynchron);

    this.transformType();
  }

  // 转换类型
  transformType(){
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.mapFieldList)) this.nData.mapFieldList = this.nData.mapFieldList.map(mapField => new MapFields(mapField));
    if (isNotEmpty(this.nData.pathFieldList)) this.nData.pathFieldList = this.nData.pathFieldList.map(mapField => new MapFields(mapField));
    if (isNotEmpty(this.nData.headerFieldList)) this.nData.headerFieldList = this.nData.headerFieldList.map(mapField => new MapFields(mapField));
    if (isNotEmpty(this.nData.paramsFieldList)) this.nData.paramsFieldList = this.nData.paramsFieldList.map(mapField => new MapFields(mapField));
    if (isNotEmpty(this.nData.covFieldList)) this.nData.covFieldList = this.nData.covFieldList.map(mapField => new COVar(mapField));
  }

  getDrlCode(dt, obj){
    let that = this;
    if (isEmpty(that.nData.cmpt)){
      console.warn(`${that.getRuleName()}未选择组件`);
      return '';
    }
    switch (that.nData.cmpt.inteType) {
      case inteTypeEnums.H.code:
        return this.getHttpDrlCode(dt, obj);
      case inteTypeEnums.K.code:
        return this.getKafkaDrlCode(dt, obj);
      case inteTypeEnums.M.code:
        return this.getModelDrlCode(dt, obj);
    }
  };

  getKafkaDrlCode(dt, obj){
    let node = this;
    // 拼接组件的字段映射代码
    function getKafkaCmptMapField(node){
      if (node.getNodeType() !== compEnums.Cmpt.code || node.nData.mapFieldList === undefined) return "";
      let result = [];
      result.push("//字段映射");
      function getCodeByFieldFrom(item){
        let code = '';
        switch (item.fieldFrom) {
          case varFromEnums.edit.code:
            code = `data.put("${item.fieldName}", "${item.fieldResult}");`;
            break;
          case varFromEnums.rel.code:
            code = `data.put("${item.fieldName}", $droolsDto.getVars().getOrDefault("${item.mapField}", null));`;
            break;
          case varFromEnums.rel.varPlatform:
            code = "";
            break;
        }
        return code;
      }

      // 字段映射代码拼接
      result.push(...node.nData.mapFieldList.map(item=>getCodeByFieldFrom(item)));
      return result.join("\n  ");
    }

    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  JSONObject cmptMessage = new JSONObject();
  JSONObject data = new JSONObject();
  ${getKafkaCmptMapField(node)}
  //组装数据，通过组件将数据结果传出
  cmptMessage.put("data", AnalysisJsonUtil.getJsonByPath(data));
  cmptMessage.put("cmptId", "${node.nData.cmpt.cmptId}");
  // JSONObject result = (JSONObject) app.execServiceMethod("${beanEnums.CMPT_SEND_BATCH.code}", "${beanEnums.CMPT_SEND_BATCH.SEND_BATCH}", cmptMessage);
  JSONObject result = (JSONObject) AppFacade.getTcsKieCmptPlugin().exec(drools, "${node.nData.cmpt.cmptId}", cmptMessage);
  $droolsDto.getCmptResult().put("${node.getRuleName()}_${node.nData.cmpt.cmptId}", result.getJSONObject("${node.nData.cmpt.cmptId}"));

  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end
`
  }

  getModelDrlCode(dt, obj){
    let node = this;
    function getModelCmptOutCode(node){
      if (isEmpty(node.nData.covFieldList)) return "";

      let result = node.nData.covFieldList.map(item=>{
        return `$droolsDto.getVars().put("${item.getPrefixVarName()}", AnalysisJsonUtil.getValueByPath(result, "${item.mapField}"));`;
      });
      return result.join("\n  ");
    }

    // 拼接组件的字段映射代码
    function getModelCmptMapField(node){
      if (node.getNodeType() !== compEnums.Cmpt.code || node.nData.mapFieldList === undefined) return "";
      let result = [];
      function getCodeByFieldFrom(item, type){
        let code = '';
        switch (item.fieldFrom) {
          case varFromEnums.edit.code:
            code = `${type}.put("${item.fieldName}", "${item.fieldResult}");`;
            break;
          case varFromEnums.rel.code:
            code = `${type}.put("${item.fieldName}", $droolsDto.getVars().getOrDefault("${item.mapField}", null));`;
            break;
          case varFromEnums.rel.varPlatform:
            code = "";
            break;
        }
        return code;
      }

      let bodyList = [];
      if (isNotEmpty(node.nData.mapFieldList)) {
        bodyList = node.nData.mapFieldList.map(item=> getCodeByFieldFrom(item, "requestBody"));
      }

      result.push("//字段映射");
      result.push(...bodyList);
      return result.join("\n  ");
    }


    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  JSONObject cmptMessage = new JSONObject();
  JSONObject data = new JSONObject();
  JSONObject requestBody = new JSONObject();
  ${getModelCmptMapField(node)}
  // 组装数据，通过组件将数据结果传出
  cmptMessage.put("data", AnalysisJsonUtil.getJsonByPath(requestBody));
  cmptMessage.put("cmptId", "${node.nData.cmpt.cmptId}");
  
  
  //JSONObject result = ((JSONObject) app.execServiceMethod("${beanEnums.CMPT_SEND_BATCH.code}", "${beanEnums.CMPT_SEND_BATCH.SEND_BATCH}", cmptMessage)).getJSONObject("${node.nData.cmpt.cmptId}");
  JSONObject result = (JSONObject) AppFacade.getTcsKieCmptPlugin().exec(drools, "${node.nData.cmpt.cmptId}", cmptMessage)
  $droolsDto.getCmptResult().put("${node.getRuleName()}_${node.nData.cmpt.cmptId}", result);
  
  // 解析返回结果
  ${getModelCmptOutCode(node)}

  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end
`
  }

  getHttpDrlCode(dt, obj){
    let node = this;
    function getHttpCmptOutCode(node){
      if (isEmpty(node.nData.covFieldList)) return "";

      let result = node.nData.covFieldList.map(item=>{
        return `$droolsDto.getVars().put("${item.getPrefixVarName()}", AnalysisJsonUtil.getValueByPath(result, "${item.mapField}"));`;
      });
      return result.join("\n  ");
    }

    // 拼接组件的字段映射代码
    function getHttpCmptMapField(node){
      if (node.getNodeType() !== compEnums.Cmpt.code || node.nData.mapFieldList === undefined) return "";
      let result = [];
      function getCodeByFieldFrom(item, type){
        let code = '';
        switch (item.fieldFrom) {
          case varFromEnums.edit.code:
            code = `${type}.put("${item.fieldName}", "${item.fieldResult}");`;
            break;
          case varFromEnums.rel.code:
            code = `${type}.put("${item.fieldName}", $droolsDto.getVars().getOrDefault("${item.mapField}", null));`;
            break;
          case varFromEnums.rel.varPlatform:
            code = "";
            break;
        }
        return code;
      }
      let pathResult = [];
      if (isNotEmpty(node.nData.pathFieldList)){
        pathResult = node.nData.pathFieldList.map(item=> getCodeByFieldFrom(item, "pathVariable"));
      }
      let headerResult = [];
      if (isNotEmpty(node.nData.headerFieldList)) {
        headerResult = node.nData.headerFieldList.map(item=> getCodeByFieldFrom(item, "headerConfig"));
      }
      let paramResult = [];
      if (isNotEmpty(node.nData.paramsFieldList)) {
        paramResult = node.nData.paramsFieldList.map(item=> getCodeByFieldFrom(item, "requestParam"));
      }
      let bodyList = [];
      if (isNotEmpty(node.nData.mapFieldList)) {
        bodyList = node.nData.mapFieldList.map(item=> getCodeByFieldFrom(item, "requestBody"));
      }

      result.push("//字段映射");
      result.push(...pathResult);
      result.push(...headerResult);
      result.push(...paramResult);
      result.push(...bodyList);
      return result.join("\n  ");
    }


    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  JSONObject cmptMessage = new JSONObject();
  JSONObject data = new JSONObject();
  JSONObject pathVariable = new JSONObject();
  JSONObject headerConfig = new JSONObject();
  JSONObject requestParam = new JSONObject();
  JSONObject requestBody = new JSONObject();
  ${getHttpCmptMapField(node)}
  data.put("pathVariable", pathVariable);
  data.put("headerConfig", headerConfig);
  data.put("requestParam", requestParam);
  data.put("requestBody", AnalysisJsonUtil.getJsonByPath(requestBody));
  // 组装数据，通过组件将数据结果传出
  cmptMessage.put("data", data);
  cmptMessage.put("cmptId", "${node.nData.cmpt.cmptId}");
  cmptMessage.put("isSynchronous", "${node.nData.synchronOrAsynchron}");
  
  // JSONObject result = ((JSONObject) app.execServiceMethod("${beanEnums.CMPT_SEND_BATCH.code}", "${beanEnums.CMPT_SEND_BATCH.SEND_BATCH}", cmptMessage)).getJSONObject("${node.nData.cmpt.cmptId}");
  JSONObject result = (JSONObject) AppFacade.getTcsKieCmptPlugin().exec(drools, "${node.nData.cmpt.cmptId}", cmptMessage);
  $droolsDto.getCmptResult().put("${node.getRuleName()}_${node.nData.cmpt.cmptId}", result);
  
  // 解析返回结果
  ${getHttpCmptOutCode(node)}

  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end
`
  }

}


/**
 * 变量平台节点 V2
 */
export class VarsNodeV2 extends G6Node {
  constructor(data) {
    super(data);
    // 变量节点的配置
    this.nData.varConfigList = data['nData']['varConfigList'];
    this.transformType();
  }

  transformType() {
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.varConfigList)) this.nData.varConfigList = this.nData.varConfigList.map(item => new VarConfig(item));
  }

  /**
   * 获取变量平台节点的输出
   * @param obj
   */
  getVarPlatformOut() {
    let result = [];
    if (isNotEmpty(this.nData.varConfigList)) {
      this.nData.varConfigList.forEach(item => {
        if (isEmpty(item.rdvList)) return;
        result.push(...item.rdvList.map(rdv => new RedisVal(rdv)));
      });
    }
    return result
  }


  /**
   * 获取与变量的关联关系（g6Model.js 中会调用以下函数）
   * @param obj
   */
  getVarsRelList(obj) {
    let result = [];
    isNotEmpty(this.nData.varConfigList) && this.nData.varConfigList.forEach(item => {
      let varRel = new VarsRel();
      varRel.prodId = obj.prodId;
      varRel.varsRelType = obj.getRelType();
      varRel.datasourceId = item.varBase.datasourceId;
      varRel.varsId = item.varBase.varsId;
      varRel.relVersion = "";
      if (obj instanceof DecsBase) {
        varRel.relId = obj.decsId;
      } else if (obj instanceof RuleBase) {
        varRel.relId = obj.ruleId;
      }
      if (isNotContainEmpty([varRel.prodId, varRel.datasourceId, varRel.varsRelType, varRel.varsId, varRel.relId])) {
        result.push(varRel);
      } else {
        console.error("getVarRelList 关联信息不全")
      }
    });
    return result;
  }

  /**
   * 获取关联的事件源信息（g6Model.js 中会调用以下函数）
   * @param obj
   */
  getDSRelList(obj) {
    let result = [];
    isNotEmpty(this.nData.varConfigList) && this.nData.varConfigList.forEach(item => {
      let dsRel = new DSRel();
      dsRel.prodId = obj.prodId;
      dsRel.datasourceId = item.ds.datasourceId;
      dsRel.datasourceRelType = obj.getRelType();
      dsRel.relVersion = "";
      if (obj instanceof DecsBase) {
        dsRel.relId = obj.decsId;
      } else if (obj instanceof RuleBase) {
        dsRel.relId = obj.ruleId;
      }
      if (isNotContainEmpty([dsRel.prodId, dsRel.datasourceId, dsRel.datasourceRelType, dsRel.relId])) {
        result.push(dsRel);
      } else {
        console.error("getDSRelList关联信息不全")
      }
    });
    return result;
  }


  /**
   * 获取规则源码
   * @param dt
   * @param obj
   * @returns {string}
   */
  getDrlCode(dt, obj){
    let node = this;
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  // 从redis获取变量平台中的变量
  Map<String, Object> rdvMap = new HashMap<>();
  JSONObject varConfig = null;
  ${this.getVarsFromRedis(obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }

  // 字段映射
  getVarsFromRedis(obj) {
    if (isEmpty(this.nData.varConfigList)) return "";

    function setVarsByRDVList(item) {
      return item.rdvList.map(rdv => {
        let newRdv = RedisVal.obj2RedisVal(rdv);
        return `$droolsDto.getVars().put("${newRdv.getPrefixVarName()}", rdvMap.getOrDefault("${newRdv.varName}", null));`
      }).join("\n  ")
    }


    return this.nData.varConfigList.map(item => {
      let newItem = JSON.parse(JSON.stringify(item));
      newItem.rdvList = undefined;
      let config = JSON.stringify(newItem).replace(/"/g, "'").replace(/\\'/g, "\\\"");
      // ${JSON.stringify(newItem).replace(/"/g, "'").replace(/\\'/g, "\\\"")}
      return `
  try {
    varConfig = JSON.parseObject("${config}");
    //rdvMap.putAll((Map<String, Object>) app.execServiceMethod("${beanEnums.REDIS_SERVICE_V2.code}", "${beanEnums.REDIS_SERVICE_V2.GET_RDV_BY_CONFIG}", varConfig, $droolsDto));
    rdvMap.putAll((Map<String, Object>) AppFacade.getTcsKieRedisPlugin().exec(drools, "", varConfig));
  } catch (Exception e) {
       ${G6Node.getExceptionLogCode({obj:obj})}
  }
  // 字段映射
  ${setVarsByRDVList(item)}
`}).join("\n\t");

  }
}


/**
 * 天擎数据源变量
 * */
export class TqsVarsNode extends G6Node {
  constructor(data) {
    super(data);
    // 变量节点的配置
    this.nData.tqsVarConfig = data['nData'].tqsVarConfig;
    this.nData.mapFieldList = data['nData'].mapFieldList;
    this.nData.covFieldList = data['nData'].covFieldList;
    this.transformType();
  }

  // 转换类型
  transformType(){
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.mapFieldList)) this.nData.mapFieldList = this.nData.mapFieldList.map(mapField => new tqsMapFields(mapField));
    if (isNotEmpty(this.nData.covFieldList)) this.nData.covFieldList = this.nData.covFieldList.map(mapField => new COVar(mapField));
  }

  getDrlCode(dt, obj){
    let that = this;
    if (isEmpty(that.nData.tqsVarConfig) || isEmpty(that.nData.tqsVarConfig.tqsDatasource) || isEmpty(that.nData.tqsVarConfig.tqsDatasource.datasourceId)){
      console.warn(`${that.getRuleName()}未设置天擎数据源`);
      return '';
    }
    return this.getTqsHttpDrlCode(dt, obj);
  }

  getTqsHttpDrlCode(dt, obj){
    let node = this;
    function getHttpCmptOutCode(node){
      if (isEmpty(node.nData.covFieldList)) return "";
      let result = node.nData.covFieldList.map(item=>{
        return `$droolsDto.getVars().put("${item.getPrefixVarName()}", AnalysisJsonUtil.getValueByPath(result, "${item.mapField}"));`;
      });
      return result.join("\n  ");
    }

    // 拼接组件的字段映射代码
    function getHttpCmptMapField(node){
      if (node.getNodeType() !== compEnums.TqsVars.code || isEmpty(node.nData.tqsVarConfig.cmpt)|| node.nData.mapFieldList === undefined) return "";
      let result = [];
      function getCodeByFieldFrom(item, type){
        let code = '';
        switch (item.fieldFrom) {
          case varFromEnums.edit.code:
            code = `${type}.put("${item.fieldName}", "${item.fieldResult}");`;
            break;
          case varFromEnums.rel.code:
            code = `${type}.put("${item.fieldName}", $droolsDto.getVars().getOrDefault("${item.mapField}", null));`;
            break;
          case varFromEnums.rel.varPlatform:
            code = "";
            break;
        }
        return code;
      }
      let bodyList = [];
      if (isNotEmpty(node.nData.mapFieldList)) {
        bodyList = node.nData.mapFieldList.map(item=> getCodeByFieldFrom(item, "data"));
      }
      result.push(...bodyList);
      return result.join("\n  ");
    }


    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  JSONObject cmptMessage = new JSONObject();
  JSONObject resData = new JSONObject();
  JSONObject data = new JSONObject();
  JSONObject requestBody = new JSONObject();
  ${getHttpCmptMapField(node)}
  requestBody.put("dsType", "${node.nData.tqsVarConfig.tqsDatasource.datasourceId}");
  requestBody.put("data", data);
  resData.put("pathVariable", new JSONObject());
  resData.put("requestParam", new JSONObject());
  resData.put("requestBody", AnalysisJsonUtil.getJsonByPath(requestBody));
  // 组装数据，通过组件将数据结果传出
  cmptMessage.put("data", resData);
  cmptMessage.put("cmptId", "${node.nData.tqsVarConfig.cmpt.cmptId}");
  
  
  JSONObject result = ((JSONObject) app.execServiceMethod("${beanEnums.CMPT_SEND_BATCH.code}", "${beanEnums.CMPT_SEND_BATCH.SEND_BATCH}", cmptMessage)).getJSONObject("${node.nData.tqsVarConfig.cmpt.cmptId}");
  $droolsDto.getCmptResult().put("${node.getRuleName()}_${node.nData.tqsVarConfig.cmpt.cmptId}", result);
  // 解析返回结果
  ${getHttpCmptOutCode(node)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end
`
  }
}


/**
 * 决策结果节点
 */
export class DecsResultNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.decsResultList = data['nData']['decsResultList'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.decsResultList)) this.nData.decsResultList = this.nData.decsResultList.map(item => new DOVar(item));
  }

  getDrlCode(dt, obj){
    let node = this;
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
  agenda-group "dov"
when
   $droolsDto : DroolsDto(${this.getContainList(node)})
then
  // 决策结果映射
  ${this.getDRMappingList(dt, obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }

  getContainList(node) {
    return `ruleIdSet not contains "${node.getRuleName()}"`
  }

  getDRMappingList() {
      if (isEmpty(this.nData.decsResultList)) return "";
      function getCodeByFieldFrom(item) {
          let code = '';
          switch (item.fieldFrom) {
              case varFromEnums.edit.code:
                  code = `$droolsDto.getVars().put("${item.getPrefixVarName()}", "${item.fieldResult}");`;
                  break;
              case varFromEnums.rel.code:
                  code = `$droolsDto.getVars().put("${item.getPrefixVarName()}", $droolsDto.getVars().getOrDefault("${item.mapField}", null));`;
                  break;
              case varFromEnums.rel.varPlatform:
                  code = "";
                  break;
          }
          return code;
      }

      return this.nData.decsResultList.map(item => getCodeByFieldFrom(item)).join("\n  ")
  }

}

/**
 * 对象节点
 */
export class ObjNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.objVarList = data['nData']['objVarList'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.objVarList)) this.nData.objVarList = this.nData.objVarList.map(item => new OBJVar(item));
  }

  getDrlCode(dt, obj){
    let node = this;
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  // 字段映射
  ${this.getObjMappingList(obj)}
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }

  getObjMappingList(obj){
    if (isEmpty(this.nData.objVarList)) return "";
    let node = this;

    function getCode(item) {
      return `${item.getPrefixVarName()} = JSONOperation.getValueByJSONPath($droolsDto.getVars().getOrDefault("${item.mapField}", null), "${item.valuePath}");`
    }

    return this.nData.objVarList.map(item => {
      return `
  Object ${item.getPrefixVarName()} = null;
  try{
      ${getCode(item)}
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }
  $droolsDto.getVars().put("${item.getPrefixVarName()}", ${item.getPrefixVarName()});
      `
    }).join("\n");

  }
}

/**
 * 数组节点
 */
export class ArrNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.arrVarList = data['nData']['arrVarList'];
    this.nData.arrIteration = data['nData']['arrIteration'];
    // this.nData.globalArrVarList = data['nData']['globalArrVarList'];
    this.nData.globalArrOperateList = data['nData']['globalArrOperateList'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.arrVarList)) this.nData.arrVarList = this.nData.arrVarList.map(item => new ArrVar(item));
    if (isNotEmpty(this.nData.arrIteration)) this.nData.arrIteration = new ArrIteration(this.nData.arrIteration);
    if (isNotEmpty(this.nData.arrIteration) && isNotEmpty(this.nData.arrIteration.resultList)) {
      this.nData.arrIteration.resultList = this.nData.arrIteration.resultList.map(item=>new ArrIterationVar(item));
    }
    // if (isNotEmpty(this.nData.globalArrVarList)) this.nData.globalArrVarList = this.nData.globalArrVarList.map(item => new GlobalArrVar(item))
    if (isNotEmpty(this.nData.globalArrOperateList)) this.nData.globalArrOperateList = this.nData.globalArrOperateList.map(item => new GlobalArrOperate(item));
  }

//   getDrlCode(dt, obj){
//     let node = this;
//     let arrIterationCode = "";
//     if (isNotEmpty(this.nData.arrIteration)){
//       arrIterationCode =  this.nData.arrIteration.getDrlCode(obj, node);
//     }
//     return  `
// // ${node.getDesc()}
// rule "${node.getRuleName()}"
//   no-loop true
// when
//   $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
// then
//   try{
//       // 字段映射
//       ${this.getArrMappingList(obj)}
//
//       // 数组遍历源码生成
//       ${arrIterationCode}
//   } catch (Exception e){
//       ${G6Node.getExceptionLogCode({obj:obj})}
//   }
//
//   $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
//   update($droolsDto)
// end`;
//   }

  getDrlCode(dt, obj){
    let node = this;
    let arrIterationCode = "";
    if (isNotEmpty(this.nData.arrIteration)){
      arrIterationCode =  this.nData.arrIteration.getDrlCode(obj, node);
    }
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  try{
      // 全局数组添加元素代码
      ${this.getGlobalArrMappingList(obj)}
      
      // 数组函数的调整
      ${this.getArrMappingList(obj)}
      
      // 数组遍历源码生成
      ${arrIterationCode}
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }
  
  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }

  // 全局数组添加元素代码
  getGlobalArrMappingList(obj) {
    let node = this;
    if (isEmpty(this.nData.globalArrOperateList)) return "";

    // 拼凑drl源码
    return this.nData.globalArrOperateList.filter(item => isNotEmpty(item.mapGolbalArrField)).map(item => {
      return `
  try {
      ((JSONArray)$droolsDto.getVars().getOrDefault("${item.mapGolbalArrField}", null)).add($droolsDto.getVars().getOrDefault("${item.mapGolbalArrElementField}", null));
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }
      `
    }).join("\n")
  }

  getArrMappingList(obj) {
    let node = this;
    if (isEmpty(this.nData.arrVarList)) return "";
    function getCodeByArrOpt(item) {
      switch (item.arrOpt) {
        case arrOptEnums.MEAN.code:
        case arrOptEnums.MIN.code:
        case arrOptEnums.MAX.code:
          return `${item.getPrefixVarName()} = ArrayOperation.${item.arrOpt}("${item.arrOptPath}", $droolsDto.getVars().getOrDefault("${item.mapField}", null));`;
        case arrOptEnums.IN.code:
          return `${item.getPrefixVarName()} = ArrayOperation.${item.arrOpt}($droolsDto.getVars().getOrDefault("${item.relOfInOpt}", null), "${item.arrOptPath}", $droolsDto.getVars().getOrDefault("${item.mapField}", null));`;
      }
    }

    return this.nData.arrVarList.map(item => {
      return `
  Object ${item.getPrefixVarName()} = null;
  try{
      ${getCodeByArrOpt(item)}
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }
  $droolsDto.getVars().put("${item.getPrefixVarName()}", ${item.getPrefixVarName()});
      `
    }).join("\n")
  }

}

/**
 * 常量节点
 */
export class ConstNode extends G6Node{
  constructor(data) {
    super(data);
    this.nData.constVarList = data['nData']['constVarList'];
    this.transformType();
  }

  // 转换类型
  transformType() {
    // 将node和conn里面的类进行转换
    if (isNotEmpty(this.nData.constVarList)) this.nData.constVarList = this.nData.constVarList.map(item => new ConstVar(item));
  }

//   getDrlCode(dt, obj){
//     let node = this;
//     return  `
// // ${node.getDesc()}
// rule "${node.getRuleName()}"
//   no-loop true
// when
//   $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
// then
//   // 字段映射
//   ${this.getConstMappingList()}
//   $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
//   update($droolsDto)
// end`;
//   }

  // 增加对常量节点的数据根据配置好的数据类型进行数据转换功能的代码
  getDrlCode(dt, obj){
    let node = this;
    return  `
// ${node.getDesc()}
rule "${node.getRuleName()}"
  no-loop true
when
  $droolsDto : DroolsDto(${G6Model.getContainList(dt, node)})
then
  try {
    // 字段映射
    ${this.getConstMappingList(obj)}
  
  } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
  }

  $droolsDto.getRuleIdSet().add("${node.getRuleName()}");
  update($droolsDto)
end`;
  }


  // getConstMappingList() {
  //   if (isEmpty(this.nData.constVarList)) return "";
  //   return this.nData.constVarList.map(item => `$droolsDto.getVars().put("${item.getPrefixVarName()}", "${item.varValue}");`).join("\n  ")
  // }

  // 增加对常量节点的数据根据配置好的数据类型进行数据转换功能的代码
  getConstMappingList(obj) {
    if (isEmpty(this.nData.constVarList)) return "";
    return this.nData.constVarList.map(item => {
      return `
    try {
        $droolsDto.getVars().put("${item.getPrefixVarName()}", Convert.convert2SpecificType("${item.varValue}", "${item.varType}"));
    } catch (Exception e){
      ${G6Node.getExceptionLogCode({obj:obj})}
    }
        `
    }).join("\n    ")
  }

}
