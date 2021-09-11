import {isEmpty, isNotEmpty} from "../../../utils";
import de from "element-ui/src/locale/lang/de";
import {DataProcessNode, UnitRuleNode, UnitRuleNodeV2} from "../../../entity/model";
import {UnitRuleCondition, UnitRuleResult, UnitRuleRoot} from "./UnitRuleModel";
import {compEnums, varFromEnums} from "../../../entity/enumns";

/**
 * 对 元规则-流程式 G6 数据操作的函数
 * 1 可以获取所有引用的信息（临时遍历，函数，组件）
 * 2 可以获取引用的变量
 * 3 获取源码信息
 */
export class UnitRuleG6Model {
    //===============================获取源码相关==================================
    /**
     * 获取源码
     * @param dt：unitRule的数据模型 == graph.save(),树图的数据结构实嵌套的。所以传入的根节点信息
     * @param obj：传入的数据对象（决策或规则）
     * @returns {string}
     */
    static getDrlCode(dt,root, obj) {
        var uRNode = new UnitRuleNodeV2(obj)
        let result = [];
        //引用信息
        result.push(getImports(dt));
        UnitRuleG6Model.g6UnitRuleNode2OtherNode(dt,root,result,uRNode);
        // 节点遍历
        // result.push(
        //     ...dt.nodes
        //         .map(item => UnitRuleG6Model.g6Node2OtherNode(item))
        //         .map(item => item.getDrlCode(dt, obj))
        // );
        return result.join("\n\n");
    }

    /**
     * G6 TreeGraph的数据结构 转换为自定义的Node
     * @param root TreeGraph 根节点
     * @param result 转化后的节点集
     * @returns {*}
     */
    static g6UnitRuleNode2OtherNode(dt,node,result,obj) {
        UnitRuleG6Model.analysisNode(dt,node,result,obj);
        if(node.children!==undefined && node.children.length!==0){
            node.children.forEach(nodeChild=>{UnitRuleG6Model.g6UnitRuleNode2OtherNode(dt,nodeChild,result,obj)});
        }
        return result;
    }

    /**
     * G6 TreeGraph的数据结构 转换为自定义的Node
     * @param root TreeGraph 根节点
     * @param result 转化后的节点集
     * @returns {*}
     */
    static UnitRuleNode2OtherNode(node) {
        if (typeof node !== 'object') return node;
        let nodeType = node.type;
        switch (nodeType) {
            case compEnums.UNIT_ROOT.code:{
                return new UnitRuleRoot(node);
            }
            case compEnums.UNIT_CON.code:{
                return new UnitRuleCondition(node);
            }
            case compEnums.UNIT_RES.code:{
                return new UnitRuleResult(node);
            }
            default:
                throw new Error(`元规则-流程式中不存在${nodeType}节点类型`)
        }

    }


    static analysisNode(dt,node,result,obj) {
        if (typeof node !== 'object') return node;
        let nodeType = node.type;
        console.log(nodeType);
        console.log(compEnums.UNIT_ROOT.code);
        switch (nodeType) {
            case compEnums.UNIT_ROOT.code:{
                break;
            }
            case compEnums.UNIT_CON.code:{
                var uCon = new UnitRuleCondition(node);
                result.push(uCon.getDrlCode(dt,obj));
                break;
            }
            case compEnums.UNIT_RES.code:{
                var uRes =  new UnitRuleResult(node);
                result.push(uRes.getDrlCode(dt,obj));
                break;
            }
            default:
                throw new Error(`元规则-流程式中不存在${nodeType}节点类型`)
        }

    }

    /**
     * 判断当前节点是否可以运行：1.父规则已经运行 2. 当前规则没有运行 3.当前连线满足
     * @param dt
     * @param node
     * @returns {string}
     */
    static getContainList(dt, node) {
        let edges = dt.cfg.edges;
        let connectEdgeList = edges.filter(item => {
            return node.id === item.getModel().target;
        });
        let containsList = [];
        connectEdgeList.forEach(connection => {
            let parentNode = UnitRuleG6Model.UnitRuleNode2OtherNode(connection._cfg.source.getModel());
            if(parentNode.getUniqueId()!=="root"){
                let containsTemplate = `(ruleIdSet contains "${parentNode.getRuleName()}" && ${getConnCd(connection, parentNode, node)})`;
                containsList.push(containsTemplate)
            }
        });

        // 返回结果
        if (containsList.length === 0){
            return `ruleIdSet not contains "${node.getRuleName()}"`;
        } else if (containsList.length === 1){
            return `${containsList[0]}, ruleIdSet not contains "${node.getRuleName()}"`;
        } else {
            let connCode = node.nData.connType === "or" ? containsList.join(" || ") : containsList.join(" && ");  //node.connType -> node.nData.connType 074389
            return `(${connCode}), ruleIdSet not contains "${node.getRuleName()}"`;
        }
    }
}


//===========================本js内使用============================================
/**
 * 解析 TreeGraph中的节点
 */

// 获取引用信息
function getImports(dt) {
    return `package com.cmbchina.drools
import java.util.*;
import java.text.SimpleDateFormat;
import java.sql.Timestamp;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.cmbchina.ns.tcs.common.dto.ErrMsg;
import com.cmbchina.ns.tcs.common.operations.DateOperation;
import com.cmbchina.ns.tcs.common.operations.FloatOperation;
import com.cmbchina.ns.tcs.common.operations.IntOperation;
import com.cmbchina.ns.tcs.common.operations.StringOperation;
import com.cmbchina.ns.tcs.common.operations.ArrayOperation;
import com.cmbchina.ns.tcs.common.operations.ObjectOperation;
import com.cmbchina.ns.tcs.common.operations.Convert;
import com.cmbchina.ns.tcs.common.utils.AnalysisJsonUtil;
import com.cmbchina.ns.tcs.common.dto.DroolsDto;
import com.cmbchina.ns.tcs.common.dto.CmptExecInfo;
import com.cmbchina.ns.tcs.common.operations.JSONOperation;
import java.lang.Exception;
import com.cmbchina.ns.tcs.decs.common.facade.AppFacade;

// Drools 容器类，管理drools中使用的所有Bean，并通过反射调用对应方法，以此向前兼容（不需要增加新类）
global com.cmbchina.ns.tcs.common.factory.impl.DroolsApplication app



`;//${getReferFunction(dt)原来的G6Model中最后有这个函数，但是不知道有没有生效
}

/**
 * 获取链接约束
 * @param dt: 整幅图数据结构
 * @param pNode: 父节点
 * @param cNode: 子节点
 * @returns {*}
 */
function getConnCd(pConn, pNode, cNode) {
    if (isNotEmpty(pConn) && isNotEmpty(cNode.nData.parentResult.trim())) {
        let filterUResult = pNode.nData.conResult.filter(uResult => cNode.nData.parentResult.includes(uResult.name))[0];
        if (isNotEmpty(filterUResult)&&isNotEmpty(filterUResult.value)) {
            return "(" + `vars.get("${pNode.getRuleName()}") == "${filterUResult.value}"` + ")";
        }
    } else {
        return "true";
    }
}

