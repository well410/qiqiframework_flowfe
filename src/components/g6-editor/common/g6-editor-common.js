import {ls} from "../../index";
import {compEnums} from "../../../entity/enumns";
import ElementUI from 'element-ui';

export class NodeFun {
    /**
     * 判断当前节点是否能添加
     * @param _graph：流程图对象
     * @param _item：节点对象
     * @param _nodePre：类型前缀（em...貌似是为了兼容模版，组合变量什么的）
     * @returns {boolean}
     */
    static isCanAddNode(_graph, _item, _nodePre){
        let enableIndexList = NodeFun.getEnableIndexList(_graph, _item, _nodePre);

        // 判断是否能添加变量
        if (enableIndexList.length === 0) {
            ElementUI.Message({message: `节点数超出`, type: 'warning'});
            return false
        }
        if (_item.nData.compType === compEnums.DR.code && parseInt(enableIndexList[0]) > 1) {
            ElementUI.Message({message: `决策结果节点只能存在一个`, type: 'warning'});
            return false
        }
        if(_item.nData.compType === compEnums.TqsVars.code && parseInt(enableIndexList[0]) > 1) {
            ElementUI.Message({message: `天擎变量节点只能存在一个`, type: 'warning'});
            return false
        }

        //规则结果节点只能存在一个 074389
        if (_item.nData.compType === compEnums.RR.code && parseInt(enableIndexList[0]) > 1) {
            ElementUI.Message({message: `规则结果节点只能存在一个`, type: 'warning'});
            return false
        }

        if (_item.nData.compType === compEnums.VarsV2.code && parseInt(enableIndexList[0]) > 10) {
            ElementUI.Message({message: `变量平台节点最多十个`, type: 'warning'});
            return false
        }
        return true;
    }

    /**
     * 获取可用的下标，例如流程图中存在 UR001，UR003。那么可用的下标为 002, 004 ... 999
     * @param _graph
     * @param _item
     * @param _nodePre
     */
    static getEnableIndexList(_graph, _item, _nodePre){
        // 新增没有出现的id
        let nodeNum = 999;
        let indexList = ls(nodeNum);
        let uniqueNameList = _graph.save().nodes.map(node => node.nData.uniqueName);
        return indexList.filter(index => {
            const uniqueName = `${NodeFun.getNodePreName(_item, _nodePre)}${index}`;
            return !uniqueNameList.includes(uniqueName)
        });
    }


    static getNodePreName(_item, _nodePre){
        return _nodePre + _item.nData.compType;
    }
}
