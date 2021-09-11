import {isEmpty, isNotContainEmpty, isNotEmpty} from "../utils";
import {compEnums, varFromEnums, dataTypeEnums, varTypeEnums, varNameTypeEnums} from "./enumns";
import {SCVar, URVar} from "../components";
import {COVar, TVars, ROVar, URGVar, DTVar} from "./vars";
import {
    ArrNode,
    CmptNode,
    ConstNode,
    DecsResultNode,
    ObjNode,
    UnitRuleNode,
    VarsNodeV2,
    RuleResultNode,
    EvStoreNode,
    CompVarsNode,
    UnitRuleNodeV2,
    AviatorScriptNode,
    DataProcessNode,
    ScoreCardNode,
    ExtRuleNodeV2,
    TqsVarsNode, RateCtrlNode, ERVLoopNode, FilterNode, DecsTableNode
} from "./model";
import {DecsBase} from "./decs";
import {RuleBase} from "./rule";
import {CmptRel, FuncRel, PRuleCRuleRel} from "./rel";
import {DecsRuleRel} from "../entity/rel"

export class TestFun {

    static varListToMap(varList){
        let result = {};
        varList.forEach(item=>{
            result[item.getPrefixVarName()] = item.getSimpleDesc();
        });
        return result;
    }

    /**
     * 获取单节点中使用的变量
     * 匹配逻辑：
     * 1 获取当前的所有父节点
     * 2 源码中使用到这个变量，或者ruleJson有这边变量，则说明是这个变量是要自己输入的
     *
     * @param dt：整个流程图的数据结构
     * @param obj：使用这个流程图的对象
     * @param node：当前节点
     * @param extList：额外的变量List，兼容事件变量和预处理变量
     */
    static getUseVarOneNode(dt, obj, node, extList){
        // 获取源码
        let drl = TestFun.getDrlCodeOneNode(dt, obj, node);
        // 获取当前节点能引用的变量
        let pVarList = G6Model.getTotalVarsOfParents(node, dt);
        if (isNotEmpty(extList)){
            pVarList.push(...extList);
        }

        return pVarList.filter(item=> {
            return drl.includes(item.getPrefixVarName()) || JSON.stringify(node.nData).includes(item.getPrefixVarName())
        });
    }

    /**
     * 获取单节点测试的源码
     * @param dt：整个流程图的数据结构
     * @param obj：使用这个流程图的对象
     * @param node：当前节点
     */
    static getDrlCodeOneNode(dt, obj, node){
        let result = [];
        //引用信息
        result.push(getImports(dt));

        // 节点遍历，获取只需要单独测试的节点
        result.push(
            ...dt.nodes
                .filter(item => item.id === node.id)
                .map(item => G6Model.g6Node2OtherNode(item))
                .map(item => item.getDrlCode(dt, obj))
        );

        // 把 when 条件进行修改
        return result.join("\n\n").replace(/when\s.+\sthen/g, "when \n $droolsDto : DroolsDto(true) \n then ");
    }
}

/**
 * 对 G6 数据操作的函数
 * 1 可以获取所有引用的信息（临时遍历，函数，组件）
 * 2 可以获取引用的变量
 * 3 获取源码信息
 */
export class G6Model {

    //=====================================获取所有引用信息=======================================
    /**
     * 获取临时变量
     * @param dt
     * @returns {Array}
     */
    static getTmpVarList(dt) {
        if (isEmpty(dt)) return [];

        let result = [];
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {
            if (isNotEmpty(node.nData.tmpVarList)) {
                result.push(...node.nData.tmpVarList)
            }
        });
        return result;
    }

    /**
     * 获取引用的规则 074389
     * @param dt
     * @returns {Array}
     */
    static getRuleListBefore(dt) {
        let ruleList = [];
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {

            if (node.getNodeType() === compEnums.ERV2.code && isNotEmpty(node.nData.extRuleList)) {
                ruleList.push(...node.nData.extRuleList)
            }
        });
        return ruleList;
    }
    /**
     * 获取引用的规则 074389
     * @param dt
     * @returns {Array}
     */
    static getRuleList(dt) {
        let ruleList = [];

        JSON.parse(JSON.stringify(dt)).nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {
            // 外部规则节点引用规则
            if (node.getNodeType() === compEnums.ERV2.code && isNotEmpty(node.nData.extRuleList)) {
                node.nData.extRuleList.forEach(rule=>{rule.nodeId=node.nData.uniqueName});
                ruleList.push(...node.nData.extRuleList)
            }
            // 循环规则节点引用规则
            if (node.getNodeType() === compEnums.ER_LOOP.code && isNotEmpty(node.nData.erlVarList)){
                ruleList.push(...node.nData.erlVarList)
            }
        });
        return ruleList;
    }

    /**
     * 获取引用的函数
     * @param dt
     * @returns {Array}
     */
    static getFunList(dt) {
        let that = this;
        let funList = [];
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {
            // 元规则临时变量引用的函数
            if (isNotEmpty(node.nData.tmpVarList)) {
                funList.push(...node.nData.tmpVarList.filter(item => isNotEmpty(item.func) && isNotEmpty(item.func.funcId)).map(item => item.func));
            }

            // 数组遍历节点引用的函数
            if (node.getNodeType() === compEnums.Arr.code && isNotEmpty(node.nData.arrIteration)) {
                funList.push(...node.nData.arrIteration.getFuncList());
            }
            let compVarsRuleJsonList = [];
            // 数组遍历节点引用的函数
            if (node.getNodeType() === compEnums.CompVars.code && isNotEmpty(node.nData.ruleList)) {
                compVarsRuleJsonList.push(...node.nData.ruleList.filter(item => isNotEmpty(item.ruleJson)).map(item => item.ruleJson));
                compVarsRuleJsonList.map(item => funList.push(...that.getFunList(JSON.parse(item))));
            }

            // 数据处理(函数)节点
            if (node.getNodeType() === compEnums.DATA_PROCESS.code && isNotEmpty(node.nData.dpVarList)) {
                funList.push(...node.getFuncList());
            }
        });
        return funList
    }


    /**
     * 获取引用的组件
     * @param dt
     * @returns {Array}
     */
    static getCmptList(dt) {
        let cmptList = [];
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {
            if (isNotEmpty(node.nData.cmpt)) {
                cmptList.push(node.nData.cmpt);
            }
            if (isNotEmpty(node.nData.tqsVarConfig) && isNotEmpty(node.nData.tqsVarConfig.cmpt
                && isNotEmpty(node.nData.tqsVarConfig.cmpt.cmptId))) {
                cmptList.push(node.nData.tqsVarConfig.cmpt);
            }
        });
        return cmptList
    }


    //==================================获取父节点可引用的变量========================================
    /**
     * 获取父节点的所有变量
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getTotalVarsOfParents(thisNode, dt) {
        let filterSet = new Set();
        let tVars = [];
        let result = [];
        // todo 老版本，待修改，参考 ERVLoopNode.getOutputVarList
        G6Model.getEResultVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getCompResultVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getUResultVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getUResultVarsV2OfParents(thisNode, tVars, new Set(), dt);
        G6Model.getTmpVarVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.geVarPlatformVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getCmptOutVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getOBJVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getArrVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getConstVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getASVarOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getDataProcessVarOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getTqsOutVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getSCResultVarsOfParents(thisNode, tVars, new Set(), dt);
        G6Model.getDTResultVarsOfParents(thisNode, tVars, new Set(), dt);
        // 使用新型的获取变量的方式，每个节点自己去实现能够输出的变量（能传给子节点的变量）
        G6Model.defaultGetVarsOfParents(thisNode, tVars, new Set(), dt);

        // 根据前缀名去重
        tVars.forEach(item => {
            if (!filterSet.has(item.getPrefixVarName())) {
                result.push(item)
            }
            filterSet.add(item.getPrefixVarName())
        });
        return result;
    }

    /**
     * 只要该节点实现 getOutputVarList 方法，即可获取它传给子节点的变量
     * @see G6Node.getOutputVarList
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static defaultGetVarsOfParents(thisNode, result, uuidSet, dt){
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        // 当前节点的父节点们
        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        pNodeList.forEach(pNode => {
            // 如果该节点没有遍历，并且有 getOutputVarList 方法，则执行 getOutputVarList 方法
            if (!uuidSet.has(pNode.getUniqueId()) && isNotEmpty(pNode.getOutputVarList)) {
                result.push(...pNode.getOutputVarList())
            }
            G6Model.defaultGetVarsOfParents(pNode, result, uuidSet, dt)
        })
    }


    /**
     * 获取数据处理节点的父节点
     * @see DataProcessVar
     * @see DataProcessNode
     *
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getDataProcessVarOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && (pNode.getNodeType() === compEnums.DATA_PROCESS.code) && isNotEmpty(pNode.nData.dpVarList)) {
                result.push(...pNode.nData.dpVarList)
            }
            G6Model.getDataProcessVarOfParents(pNode, result, uuidSet, dt)
        })
    }

    /**
     * 获取父节点（脚本语言节点）的变量
     * @see ASVar
     * @see AviatorScriptNode
     *
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getASVarOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && (pNode.getNodeType() === compEnums.AVIATOR_SCRIPT.code) && isNotEmpty(pNode.nData.asVar)) {
                result.push(pNode.nData.asVar)
            }
            G6Model.getASVarOfParents(pNode, result, uuidSet, dt)
        })
    }

    /**
     * 获取父节点（外部规则节点）引入规则的结果集 rov_  074389
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getEResultVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (pNode.getNodeType() === compEnums.ERV2.code && isNotEmpty(pNode.nData.rovVarListMap)) {
                // 获取外部规则节点的输出
                result.push(...G6Model.g6Node2OtherNode(pNode).getROVarList());
                // 获取外部规则节点的默认输出
                result.push(...pNode.getDefaultVarList())
            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getEResultVarsOfParents(pNode, result, uuidSet, dt);
        });
    }

    /**
     * 获取父节点（外部规则节点）引入规则的结果集 rov_  074389
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getCompResultVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && (pNode.getNodeType() === compEnums.CompVars.code) && isNotEmpty(pNode.nData.ruleList)) {
                pNode.nData.ruleList.forEach(rule => {
                    if (isNotEmpty(rule.ruleResultList)) {
                        rule.ruleResultList.forEach(item => {
                            if (isNotEmpty(item.varName)) {
                                result.push(new ROVar({
                                    varName: rule.ruleId + '_' + item.varName + '_' + pNode.getRuleName(),
                                    varDesc: item.varDesc,
                                    varType: '',
                                }));
                            }
                        });
                    }
                    //保证规则在不设置结果节点时，仍有最终输出
                    result.push(new ROVar({
                        varName: rule.ruleId + '_' + pNode.getRuleName(),
                        varDesc: '规则最终输出',
                        varType: '',
                    }));
                });


            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getCompResultVarsOfParents(pNode, result, uuidSet, dt);
        });
    }


    /**
     * 获取父节点决策表结果（例如：DT001）
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getDTResultVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && (pNode.getNodeType() === compEnums.DT.code)) {
                isEmpty(pNode.nData.dtVar) && result.push(new DTVar({
                    varName: pNode.getRuleName(),
                    varType: dataTypeEnums.STRING.code,
                    varDesc: pNode.name,
                    varFrom: varFromEnums.rel
                }));
                !isEmpty(pNode.nData.dtVar) && result.push(DTVar.obj2DTVar(pNode.nData.dtVar));
            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getSCResultVarsOfParents(pNode, result, uuidSet, dt);
        });
    }



    /**
     * 获取父节点评分卡结果（例如：SC001） 074389
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getSCResultVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && (pNode.getNodeType() === compEnums.SC.code)) {
                result.push(new SCVar({varName: pNode.getRuleName(), varDesc: pNode.name, varFrom: varFromEnums.rel}));
                result.push(new SCVar({
                    varName: pNode.getRuleName() + '_SCORE',
                    varType: dataTypeEnums.DOUBLE.code,
                    varDesc: pNode.name,
                    varFrom: varFromEnums.rel
                }));
            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getSCResultVarsOfParents(pNode, result, uuidSet, dt);
        });
    }

    /**
     * 获取父节点元规则（流程式的结果），例如 URV2001
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getUResultVarsV2OfParents(thisNode, result, uuidSet, dt){
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && (pNode.getNodeType() === compEnums.URV2.code)) {
                if (isEmpty(pNode.nData.urgVar) || !URVar.obj2UrVar(pNode.nData.urgVar).enableAlias()){
                    result.push(new URGVar({
                        varName: pNode.getRuleName(),
                        varType: dataTypeEnums.STRING.code,
                        varDesc: pNode.name,
                        varFrom: varFromEnums.rel
                    }));
                }

                if (!isEmpty(pNode.nData.urgVar) && URVar.obj2UrVar(pNode.nData.urgVar).enableAlias()){
                    result.push(URVar.obj2UrVar(pNode.nData.urgVar));
                }

            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getUResultVarsV2OfParents(pNode, result, uuidSet, dt);
        });
    }


    /**
     * 获取父节点元规则结果（例如：UR001）
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getUResultVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && (pNode.getNodeType() === compEnums.UR.code)) {
                isEmpty(pNode.nData.urVar) && result.push(new URVar({
                    varName: pNode.getRuleName(),
                    varType: dataTypeEnums.STRING.code,
                    varDesc: pNode.name,
                    varFrom: varFromEnums.rel
                }));
                !isEmpty(pNode.nData.urVar) && result.push(URVar.obj2UrVar(pNode.nData.urVar));
            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getUResultVarsOfParents(pNode, result, uuidSet, dt);
        });
    }

    /**
     * 获取父节点的临时变量（tv_）
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getTmpVarVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");

        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && isNotEmpty(pNode.nData.tmpVarList)) {
                result.push(...pNode.nData.tmpVarList.map(item => new TVars(item)));
            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getTmpVarVarsOfParents(pNode, result, uuidSet, dt);
        });
    }

    /**
     * 获取父节点的变量平台的输出变量
     * @param thisNode
     * @param result
     * @param prefixVarNameSet
     * @param dt
     */
    static geVarPlatformVarsOfParents(thisNode, result, prefixVarNameSet, dt) {
        if (isEmpty(prefixVarNameSet)) {
            prefixVarNameSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");

        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            pNode.getVarPlatformOut && pNode.getVarPlatformOut().forEach(item => {
                // 去重
                if (!prefixVarNameSet.has(item.getPrefixVarName())) {
                    result.push(item);
                    prefixVarNameSet.add(item.getPrefixVarName())
                }
            });
            G6Model.geVarPlatformVarsOfParents(pNode, result, prefixVarNameSet, dt);
        });
    }

    /**
     * 获取父节点的组件节点的输出变量（cov_）
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getCmptOutVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");

        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && isNotEmpty(pNode.nData.covFieldList) && (pNode.getNodeType() === compEnums.Cmpt.code)) {
                result.push(...pNode.nData.covFieldList);
            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getCmptOutVarsOfParents(pNode, result, uuidSet, dt);
        });
    }

    /**
     * 获取天擎变量组件的输出
     * */
    static getTqsOutVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");

        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && isNotEmpty(pNode.nData.covFieldList) && (pNode.getNodeType() === compEnums.TqsVars.code)) {
                result.push(...pNode.nData.covFieldList);
            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getTqsOutVarsOfParents(pNode, result, uuidSet, dt);
        });
    }

    /**
     * 获取父节点的对象处理节点的变量（obj_）
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getOBJVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");

        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && isNotEmpty(pNode.nData.objVarList) && (pNode.getNodeType() === compEnums.Obj.code)) {
                result.push(...pNode.nData.objVarList);
            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getOBJVarsOfParents(pNode, result, uuidSet, dt);
        });
    }

    /**
     * 获取父节点的数组处理节点的变量（arr_）
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getArrVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");

        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && (pNode.getNodeType() === compEnums.Arr.code)) {
                // 数组函数变量
                isNotEmpty(pNode.nData.arrVarList) && result.push(...pNode.nData.arrVarList);
                // 数组遍历变量
                isNotEmpty(pNode.nData.arrIteration) && isNotEmpty(pNode.nData.arrIteration.resultList) && result.push(...pNode.nData.arrIteration.resultList)
            }
            uuidSet.add(pNode.getUniqueId()); //074389 uuid木有了
            G6Model.getArrVarsOfParents(pNode, result, uuidSet, dt);
        });
    }

    /**
     * 获取父节点的常量节点的变量（arr_）
     * @param thisNode
     * @param result
     * @param uuidSet
     * @param dt
     */
    static getConstVarsOfParents(thisNode, result, uuidSet, dt) {
        if (isEmpty(uuidSet)) {
            uuidSet = new Set();
        }
        if (result === undefined) throw new Error("请输入参数，例如空数组");

        let pNodeList = G6Model.getNodeListOfParents(thisNode, dt);
        // 遍历父节点，并递归执行
        pNodeList.forEach(pNode => {
            if (!uuidSet.has(pNode.getUniqueId()) && isNotEmpty(pNode.nData.constVarList) && (pNode.getNodeType() === compEnums.Const.code)) {
                result.push(...pNode.nData.constVarList);
            }
            uuidSet.add(pNode.getUniqueId());
            G6Model.getConstVarsOfParents(pNode, result, uuidSet, dt);
        });
    }

    /**
     * 获取当前节点的所有子节点
     * @param {*} thisNode ：当前节点
     * @param {*} dt
     */
    static getNodeListOfChildren(thisNode, dt) {
        // 1 通过当前节点 uuid 和连线 找到子节点的 uuid 数组
        let uuidList = dt.edges.filter(conn => conn.source === thisNode.id).map(conn => conn.target);
        if (isEmpty(uuidList)) return [];
        // 2 通过子节点的 uuid 数组找到当前节点的所有子节点
        return dt.nodes.filter(node => uuidList.indexOf(node.id) > -1).map(item => G6Model.g6Node2OtherNode(item));
    }

    /**
     * 获取当前节点的所有下级连线
     * @param {*} thisNode
     * @param {*} dt
     */

    static getEdgeListOfChildren(thisNode, dt) {
        return dt.edges.filter(conn => conn.source === thisNode.id);
    }

    /**
     * 获取当前节点的父节点
     * @param thisNode ：当前节点
     * @param dt：g6的数据模型 == graph.save()
     * @returns {*}
     */
    static getNodeListOfParents(thisNode, dt) {
        // 1 通过当前节点 uuid 和连线 找到父节点的 uuid 数组
        let uuidList = dt.edges.filter(conn => conn.target === thisNode.id).map(conn => conn.source);
        if (isEmpty(uuidList)) return [];
        // 2 通过父节点的 uuid 数组找到当前节点的所有父节点
        return dt.nodes.filter(node => uuidList.indexOf(node.id) > -1).map(item => G6Model.g6Node2OtherNode(item));
    }

    //==================================获取所有节点可引用的变量========================================
    /**
     * 获取所有节点
     * @param dt
     */
    static getTotalVars(dt) {
        const filterSet = new Set();
        const tVars = [];
        const result = [];

        // todo 老版本，待修改，参考 ERVLoopNode.getOutputVarList
        G6Model.getEResultVars(tVars, dt);
        G6Model.getUResultVars(tVars, dt);
        G6Model.getUResultVarsV2(tVars, dt);
        G6Model.getTmpVarVars(tVars, dt);
        G6Model.getVarPlatformVars(tVars, dt);
        G6Model.getCmptOutVars(tVars, dt);
        G6Model.getTqsOutVars(tVars, dt);
        G6Model.getOBJVars(tVars, dt);
        G6Model.getArrVars(tVars, dt);
        G6Model.getConstVars(tVars, dt);
        G6Model.getASVar(tVars, dt);
        G6Model.getDataProcessVar(tVars, dt);
        G6Model.getSCResultVars(tVars, dt);
        G6Model.getDTResultVars(tVars, dt);
        // 使用新型的获取变量的方式，每个节点自己去实现能够输出的变量（能传给子节点的变量）
        G6Model.defaultGetVarList(tVars, dt);


        // 根据前缀名去重
        tVars.forEach(item => {
            if (!filterSet.has(item.getPrefixVarName())) {
                result.push(item)
            }
            filterSet.add(item.getPrefixVarName())
        });
        return result;
    }


    static defaultGetVarList(result, dt){
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            // 有 getOutputVarList 方法，则执行 getOutputVarList 方法
            if (isNotEmpty(pNode.getOutputVarList)) {
                result.push(...pNode.getOutputVarList())
            }
        });
        return result;
    }

    /**
     * 获取所有的数据处理变量
     * @see DataProcessNode
     * @see DataProcessVar
     *
     * @param result
     * @param dt
     */
    static getDataProcessVar(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (pNode.getNodeType() === compEnums.DATA_PROCESS.code && isNotEmpty(pNode.nData.dpVarList)) {
                result.push(...pNode.nData.dpVarList);
            }
        });
        return result;
    }

    /**
     * 获取所有 AS 变量
     * @see ASVar
     * @see AviatorScriptNode
     *
     * @param result
     * @param dt
     * @returns {*}
     */
    static getASVar(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (pNode.getNodeType() === compEnums.AVIATOR_SCRIPT.code) {
                result.push(pNode.nData.asVar);
            }
        });
        return result;
    }

    /**
     * 获取所有规则节点的结果 074389
     * @param result
     * @param dt
     * @returns {*}
     */
    static getEResultVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (pNode.getNodeType() === compEnums.ERV2.code && isNotEmpty(pNode.nData.rovVarListMap)) {
                result.push(...G6Model.g6Node2OtherNode(pNode).getROVarList());
                // 获取外部规则节点的默认输出
                result.push(...pNode.getDefaultVarList())
            }
        });
        return result;
    }

    /**
     * 获取所有流程式节点结果
     * @param result
     * @param dt
     * @returns {*}
     */
    static getUResultVarsV2(result, dt){
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (pNode.getNodeType() === compEnums.URV2.code) {
                if (isEmpty(pNode.nData.urgVar) || !URVar.obj2UrVar(pNode.nData.urgVar).enableAlias()){
                    result.push(new URGVar({
                        varName: pNode.getRuleName(),
                        varType: dataTypeEnums.STRING.code,
                        varDesc: pNode.name,
                        varFrom: varFromEnums.rel
                    }));
                }

                if (!isEmpty(pNode.nData.urgVar) && URVar.obj2UrVar(pNode.nData.urgVar).enableAlias()){
                    result.push(URVar.obj2UrVar(pNode.nData.urgVar));
                }
            }
        });
        return result;
    }

    /**
     * 获取所有的元规则结果
     * @param result
     * @param dt
     * @returns {*}
     */
    static getUResultVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (pNode.getNodeType() === compEnums.UR.code) {
                isEmpty(pNode.nData.urVar) && result.push(new URVar({
                    varName: pNode.getRuleName(),
                    varType: dataTypeEnums.STRING.code,
                    varDesc: pNode.name,
                    varFrom: varFromEnums.rel
                }));
                !isEmpty(pNode.nData.urVar) && result.push(URVar.obj2UrVar(pNode.nData.urVar));
            }
        });
        return result;
    }

    /**
     * 获取所有的评分卡结果
     * @param result
     * @param dt
     * @returns {*}
     */
    static getSCResultVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (pNode.getNodeType() === compEnums.SC.code) {
                result.push(new SCVar({varName: pNode.getRuleName(), varDesc: pNode.name, varFrom: varFromEnums.rel}));
                result.push(new SCVar({
                    varName: pNode.getRuleName() + '_SCORE',
                    varDesc: pNode.name,
                    varFrom: varFromEnums.rel
                }));
            }
        });
        return result;
    }

    /**
     * 获取所有的决策表结果
     * @param result
     * @param dt
     */
    static getDTResultVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (pNode.getNodeType() === compEnums.DT.code) {
                isEmpty(pNode.nData.dtVar) && result.push(new DTVar({
                    varName: pNode.getRuleName(),
                    varType: dataTypeEnums.STRING.code,
                    varDesc: pNode.name,
                    varFrom: varFromEnums.rel
                }));
                !isEmpty(pNode.nData.dtVar) && result.push(DTVar.obj2DTVar(pNode.nData.dtVar));
            }
        });
        return result;
    }

    /**
     * 获取所有的临时变量
     * @param result
     * @param dt
     * @returns {*}
     */
    static getTmpVarVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (isNotEmpty(pNode.nData.tmpVarList) && pNode.getNodeType() === compEnums.UR.code) {
                result.push(...pNode.nData.tmpVarList.map(item => new TVars(item)));
            }
        });
        return result;
    }

    /**
     * 获取所有变量平台的输出变量
     * @param result
     * @param dt
     * @returns {*}
     */
    static getVarPlatformVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        let prefixVarNameSet = new Set();
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {
            node.getVarPlatformOut && node.getVarPlatformOut().forEach(item => {
                //去重
                if (!prefixVarNameSet.has(item.getPrefixVarName())) {
                    result.push(item);
                    prefixVarNameSet.add(item.getPrefixVarName())
                }
            })
        });
        return result;
    }

    /**
     * 获取所有组件节点的输出变量（）
     * @param result
     * @param dt
     * @returns {*}
     */
    static getCmptOutVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (isNotEmpty(pNode.nData.covFieldList) && (pNode.getNodeType() === compEnums.Cmpt.code)) {
                result.push(...pNode.nData.covFieldList.map(item => new COVar(item)));
            }
        });
        return result;
    }

    /**
     * 获取天擎变量节点的输出变量
     * */
    static getTqsOutVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (isNotEmpty(pNode.nData.covFieldList) && (pNode.getNodeType() === compEnums.TqsVars.code)) {
                result.push(...pNode.nData.covFieldList.map(item => new COVar(item)));
            }
        });
        return result;
    }

    /**
     * 获取所有对象处理节点的输出变量（obj_）
     * @param result
     * @param dt
     * @returns {*}
     */
    static getOBJVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (isNotEmpty(pNode.nData.objVarList) && (pNode.getNodeType() === compEnums.Obj.code)) {
                result.push(...pNode.nData.objVarList);
            }
        });
        return result;
    }

    /**
     * 获取所有数组处理节点的输出变量（arr_）
     * @param result
     * @param dt
     * @returns {*}
     */
    static getArrVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (pNode.getNodeType() === compEnums.Arr.code) {
                // 数组函数变量
                isNotEmpty(pNode.nData.arrVarList) && result.push(...pNode.nData.arrVarList);
                // 数组遍历变量
                isNotEmpty(pNode.nData.arrIteration) && isNotEmpty(pNode.nData.arrIteration.resultList) && result.push(...pNode.nData.arrIteration.resultList)
            }
        });
        return result;
    }

    /**
     * 获取所有常量节点的输出变量（const_）
     * @param result
     * @param dt
     * @returns {*}
     */
    static getConstVars(result, dt) {
        if (result === undefined) throw new Error("请输入参数，例如空数组");
        dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(pNode => {
            if (isNotEmpty(pNode.nData.constVarList) && (pNode.getNodeType() === compEnums.Const.code)) {
                result.push(...pNode.nData.constVarList);
            }
        });
        return result;
    }

    /**
     * G6 node 转换为自定义的Node
     * @param node
     * @returns {*}
     */
    static g6Node2OtherNode(node) {
        if (typeof node !== 'object') return node;
        let nodeType = node.nData.compType;
        switch (nodeType) {
            case compEnums.UR.code:
                return new UnitRuleNode(node);
            case compEnums.URV2.code:
                return new UnitRuleNodeV2(node);
            case compEnums.Cmpt.code:
                return new CmptNode(node);
            case compEnums.VarsV2.code:
                return new VarsNodeV2(node);
            case compEnums.TqsVars.code:
                return new TqsVarsNode(node);
            case compEnums.DR.code:
                return new DecsResultNode(node);
            case compEnums.Obj.code:
                return new ObjNode(node);
            case compEnums.Arr.code:
                return new ArrNode(node);
            case compEnums.Const.code:
                return new ConstNode(node);
            case compEnums.RR.code:   //074389 增加规则结果节点
                return new RuleResultNode(node);
            case compEnums.EVStore.code:
                return new EvStoreNode(node);
            case compEnums.CompVars.code:
                return new CompVarsNode(node);
            case compEnums.SC.code:
                return new ScoreCardNode(node);
            case compEnums.AVIATOR_SCRIPT.code:
                return new AviatorScriptNode(node);
            case compEnums.DATA_PROCESS.code:
                return new DataProcessNode(node);
            case compEnums.ERV2.code:
                return new ExtRuleNodeV2(node);
            case compEnums.RATE_CTRL.code:
                return new RateCtrlNode(node);
            case compEnums.ER_LOOP.code:
                return new ERVLoopNode(node);
            case compEnums.FILTER.code:
                return new FilterNode(node);
            case compEnums.DT.code:
                return new DecsTableNode(node);
            default:
                throw new Error(`G6Model.g6Node2OtherNode: DecisionTree中不存在${nodeType}节点类型`)
        }
    }

    //===============================获取源码相关==================================
    /**
     * 获取源码
     * @param dt：g6的数据模型 == graph.save()
     * @param obj：传入的数据对象（决策或规则）
     * @returns {string}
     */
    static getDrlCode(dt, obj) {

        let result = [];
        //引用信息
        result.push(getImports(dt));

        // 节点遍历
        result.push(
            ...dt.nodes
                .map(item => G6Model.g6Node2OtherNode(item))
                .map(item => item.getDrlCode(dt, obj))
        );
        return result.join("\n\n");
    }



    /**
     * 获取不包含引用的源码用于组合变量
     * @param dt：g6的数据模型 == graph.save()
     * @param obj：传入的数据对象（决策或规则）
     * @returns {string}
     */
    static getDrlCodeWithoutImports(dt, obj) {
        let result = [];
        // 节点遍历
        result.push(
            ...dt.nodes
                .map(item => G6Model.g6Node2OtherNode(item))
                .map(item => item.getDrlCode(dt, obj))
        );
        return result.join("\n\n");
    }

    /**
     * 判断当前节点是否可以运行：1.父规则已经运行 2. 当前规则没有运行 3.当前连线满足
     * @param dt
     * @param node
     * @returns {string}
     */
    static getContainList(dt, node) {
        let parentNodeList = dt.edges.filter(item => {
            return node.id === item.target
        });
        let containsList = [];
        parentNodeList.forEach(connection => {
            let parentNode = dt.nodes.map(item => G6Model.g6Node2OtherNode(item)).filter(node => {
                return connection.source === node.id
            })[0];
            let containsTemplate = `(ruleIdSet contains "${parentNode.getRuleName()}" && ${getConnCd(dt, parentNode, node)})`;
            containsList.push(containsTemplate)
        });

        // 返回结果
        if (containsList.length === 0) {
            return `ruleIdSet not contains "${node.getRuleName()}"`;
        } else if (containsList.length === 1) {
            return `${containsList[0]}, ruleIdSet not contains "${node.getRuleName()}"`;
        } else {
            let connCode = node.nData.connType === "or" ? containsList.join(" || ") : containsList.join(" && ");  //node.connType -> node.nData.connType 074389
            return `(${connCode}), ruleIdSet not contains "${node.getRuleName()}"`;
        }
    }
}


export class GetExistConfig {

    /**
     * 获取天擎配置
     * */
    static getTqsDSConfig = (obj, decisionTree) => {
        if (!(obj instanceof DecsBase)) {
            console.error("不支持决策以外的类型")
        }
        // 节点遍历
        let tqsNodeList = [];
        tqsNodeList.push(
            ...decisionTree.nodes
                .map(item => G6Model.g6Node2OtherNode(item))
                .filter(item => item.nData.compType === compEnums.TqsVars.code)
        );
        return tqsNodeList;
    };

}

/**
 * 获取所有的关联关系
 * 1 函数关联关系
 * 2 组件关联关系
 * 3 数据源关联关系
 * 4 变量关联关系
 */
export class GetRel {


    /**
     * 获取规则和规则的关联关系
     * @param obj
     * @param decisionTree
     * @returns {Array}
     */
    static getPRuleCRuleRelList = (obj, decisionTree) =>{
        let pRuleCRuleRelList = [];
        if (!(obj instanceof RuleBase)) {
            console.error("不支持规则以外的类型")
        }
        let ruleList = G6Model.getRuleList(decisionTree);
        let ruleUniqueId = new Set();
        ruleList.forEach(item => {
            let version = isEmpty(item.ruleVersion) ? "" : item.ruleVersion;
            let uniqueName = item.ruleId + version;
            if (!ruleUniqueId.has(uniqueName)) {
                let pRuleCRuleRel = new PRuleCRuleRel();
                pRuleCRuleRel.toId = item.ruleId;
                pRuleCRuleRel.toVersion = isEmpty(item.ruleVersion) ? "" : item.ruleVersion;
                pRuleCRuleRel.prodId = obj.prodId;
                pRuleCRuleRel.fromId = obj.ruleId;
                pRuleCRuleRel.fromVersion = "";
                if (isNotContainEmpty([pRuleCRuleRel.prodId, pRuleCRuleRel.toId, pRuleCRuleRel.fromId])) {
                    pRuleCRuleRelList.push(pRuleCRuleRel);
                } else {
                    console.error("getRuleRelList 关联信息不全")
                }
            }
            ruleUniqueId.add(uniqueName);
        });
        return pRuleCRuleRelList;
    };

    /**
     * 获取决策关联的规则信息
     * @param obj
     * @param decisionTree
     * @returns {Array}
     */
    static getRuleRelList = (obj, decisionTree) => {
        let ruleRelList = [];
        if (!(obj instanceof DecsBase)) {
            console.error("不支持决策以外的类型")
        }
        let ruleList = G6Model.getRuleList(decisionTree);
        let ruleIdSet = new Set();
        ruleList.forEach(item => {
            let version = isEmpty(item.ruleVersion) ? "" : item.ruleVersion;
            let uniqueName = item.ruleId + version;
            if (!ruleIdSet.has(uniqueName)) {
                let ruleRel = new DecsRuleRel();
                ruleRel.ruleId = item.ruleId;
                ruleRel.ruleVersion = isEmpty(item.ruleVersion) ? "" : item.ruleVersion;
                ruleRel.prodId = obj.prodId;
                ruleRel.decsId = obj.decsId;
                ruleRel.decsVersion = "";
                ruleRel.nodeId = item.nodeId;
                if (isNotContainEmpty([ruleRel.prodId, ruleRel.ruleId, ruleRel.prodId])) {
                    ruleRelList.push(ruleRel);
                } else {
                    console.error("getRuleRelList 关联信息不全")
                }
            }
            ruleIdSet.add(uniqueName);
        });
        return ruleRelList;
    };

    /**
     * 获取关联的函数信息
     * @param obj
     * @param decisionTree
     * @returns {Array}
     */
    static getFuncRelList = (obj, decisionTree) => {
        let funRelList = [];
        if (!(obj instanceof DecsBase || obj instanceof RuleBase)) {
            console.error("不支持决策和规则以外的类型")
        }
        let funList = G6Model.getFunList(decisionTree);
        let funIdSet = new Set();
        funList.forEach(item => {
            let uniqueFuncId = item.funcId + item.funcVersion;
            if (!funIdSet.has(uniqueFuncId)) {
                let funRel = new FuncRel();
                funRel.funcId = item.funcId;
                funRel.funcVersion = isEmpty(item.funcVersion) ? "" : item.funcVersion;
                funRel.funcRelType = obj.getRelType();
                funRel.prodId = item.prodId;
                funRel.relVersion = "";
                if (obj instanceof DecsBase) {
                    funRel.relId = obj.decsId;
                } else if (obj instanceof RuleBase) {
                    funRel.relId = obj.ruleId;
                }
                if (isNotContainEmpty([funRel.prodId, funRel.funcId, funRel.relId])) {
                    funRelList.push(funRel);
                } else {
                    console.error("getFuncRelList 关联信息不全")
                }
            }
            funIdSet.add(uniqueFuncId);
        });
        return funRelList;
    };

    /**
     * 获取关联的组件信息
     * @param obj
     * @param decisionTree
     * @returns {Array}
     */
    static getCmptRelList = (obj, decisionTree) => {
        let cmptRelList = [];
        if (!(obj instanceof DecsBase)) {
            console.error("不支持决策以外的类型")
        }
        G6Model.getCmptList(decisionTree).forEach(item => {
            if (!cmptRelList.map(cmptRel => cmptRel.cmptId).includes(item.cmptId)) {
                let cmptRel = new CmptRel();
                cmptRel.cmptId = item.cmptId;
                cmptRel.cmptVersion = isEmpty(item.cmptVersion) ? "" : item.cmptVersion;
                cmptRel.cmptRelType = obj.getRelType();
                cmptRel.prodId = obj.prodId;
                cmptRel.relId = obj.decsId;
                cmptRel.relVersion = "";
                if (isNotContainEmpty([cmptRel.prodId, cmptRel.cmptId, cmptRel.relId])) {
                    cmptRelList.push(cmptRel);
                } else {
                    console.error("getCmptRelList 关联信息不全")
                }
            }
        });
        return cmptRelList;
    };

    /**
     * 获取关联的变量信息
     * @param obj
     * @param decisionTree
     * @returns {Array}
     */
    static getVarsRelList = (obj, decisionTree) => {
        let total = []; // 所有节点关联的变量信息
        let result = [];// 去重后关联的变量信息
        if (!(obj instanceof DecsBase || obj instanceof RuleBase)) {
            console.error("不支持决策和规则以外的类型")
        }
        decisionTree.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {
            node.getVarsRelList && total.push(...node.getVarsRelList(obj))
        });

        // 去重
        function isInResult(item) {
            return result.filter(res =>
                (res.prodId === item.prodId) &&
                (res.varsRelType === item.varsRelType) &&
                (res.datasourceId === item.datasourceId) &&
                (res.varsId === item.varsId) &&
                (res.relId === item.relId) &&
                (res.relVersion === item.relVersion)
            ).length > 0;
        }

        total.forEach(item => (!isInResult(item) && result.push(item)));
        return result;
    };

    /**
     * 获取关联的数据源信息
     * @param obj
     * @param decisionTree
     * @returns {Array}
     */
    static getDSRelList = (obj, decisionTree) => {
        let total = []; // 所有节点关联的数据源信息
        let result = [];// 去重后关联的数据源信息
        if (!(obj instanceof DecsBase || obj instanceof RuleBase)) {
            console.error("不支持决策和规则以外的类型")
        }
        decisionTree.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {
            node.getDSRelList && total.push(...node.getDSRelList(obj))
        });


        // 去重
        function isInResult(item) {
            return result.filter(res =>
                (res.prodId === item.prodId) &&
                (res.datasourceId === item.datasourceId) &&
                (res.datasourceRelType === item.datasourceRelType) &&
                (res.relId === item.relId) &&
                (res.relVersion === item.relVersion)
            ).length > 0;
        }

        total.forEach(item => (!isInResult(item) && result.push(item)));
        return result
    };

    /**
     * 获取关联的天擎数据源信息
     * @param obj
     * @param decisionTree
     * @returns {Array}
     */
    static getTqsDSRelList = (obj, decisionTree) => {
        let result = {};// 天擎节点的详细信息
        if (!(obj instanceof DecsBase || obj instanceof RuleBase)) {
            console.error("不支持决策和规则以外的类型")
        }
        decisionTree.nodes.map(item => G6Model.g6Node2OtherNode(item)).forEach(node => {
            if (isNotEmpty(node.nData.compType) && node.nData.compType == compEnums.TqsVars.code && isNotEmpty(node.nData.tqsVarConfig)) {//天擎变量节点
                result.datasourceId = node.nData.tqsVarConfig.tqsDatasource.datasourceId;
                let usedVarsIdMap = [];
                node.nData.tqsVarConfig.memVarList.forEach(item => {
                    usedVarsIdMap.push(item.varName);
                });
                result.memVarUsedList = usedVarsIdMap;
            }
        });
        return result
    };

}

//===========================本js内使用============================================
/**
 * 获取链接约束
 * @param dt: 整幅图数据结构
 * @param pNode: 父节点
 * @param cNode: 子节点
 * @returns {*}
 */
function getConnCd(dt, pNode, cNode) {

    function getSinglenessConditionCode(_pNode, _ur) {
        if (isEmpty(_ur.varFrom) || _ur.varFrom === varFromEnums.edit.code) {
            return `vars.get("${_pNode.getRuleName()}") == "${_ur.resultValue}"`
        }

        // 其实都可以直接用下面的这个判断，保险起见，上面的也保留
        if (_ur.varFrom === varFromEnums.aviatorScript.code) {
            const name = [_pNode.getRuleName(), _ur.logicId].join("_");
            return `vars.get("${_pNode.getRuleName()}") == vars.get("${name}")`
        }
        return '';
    }

    function getSinglenessConditionCodeV2(_pNode, _ur) {
        return `vars.get("${[_pNode.getRuleName()].join("_")}") == "${_ur.resultValue}"`
    }


    if (isNotEmpty(dt.edges)) {
        let pConn = dt.edges.filter(conn => (conn.target === cNode.id && conn.source === pNode.id))[0];
        if (isNotEmpty(pConn) && isNotEmpty(pConn.eData.logicIdList)) {
            let filterUResult = pNode.nData.uResultList.filter(uResult => pConn.eData.logicIdList.includes(uResult.logicId));
            if(pNode.nData.compType===compEnums.URV2.code){
                return "(" + filterUResult.map(item => getSinglenessConditionCodeV2(pNode, item)).join("||") + ")";
            }
            if (filterUResult.length !== 0) {
                return "(" + filterUResult.map(item => getSinglenessConditionCode(pNode, item)).join("||") + ")";
            }
        } else {
            return "true";
        }
    } else {
        throw new Error("连线不是G6流程图的版本")
    }
}

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
import com.cmbchina.ns.tcs.common.base.MyRuntimeException;
import java.lang.Exception;
import com.cmbchina.ns.tcs.decs.common.facade.AppFacade;

// Drools 容器类，管理drools中使用的所有Bean，并通过反射调用对应方法，以此向前兼容（不需要增加新类）
global com.cmbchina.ns.tcs.common.factory.impl.DroolsApplication app


${getReferFunction(dt)}
`
}

// 根据节点的 tmpVarList 获取所引用的函数信息
function getReferFunction(dt) {
    let funcIdList = new Set();
    let result = [];
    let funcList = G6Model.getFunList(dt);
    funcList.filter(item => item.funcType === "0").forEach(item => {
        if (!funcIdList.has(item.funcId)) {
            funcIdList.add(item.funcId);
            result.push(item.funcDrl);
        }
    });
    return result.join("\n");
}
