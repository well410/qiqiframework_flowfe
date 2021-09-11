import {G6Event} from "@antv/g6/lib/types";
import Vue from 'vue'
import Stack from "@antv/g6/es/algorithm/structs/stack";

/**
 * G6工具的全局类
 */
export class G6Editor {

    constructor(graph) {
        this.graph = graph;
        // 回退栈
        this.undoStack = new Stack();
        // 前进栈
        this.redoStack = new Stack();
        this.bindEvent();
    }

    bindEvent() {
        let that = this;

        // 绑定点击事件
        function bindNodeClickEvent(evt) {
            const {item} = evt;
            Vue.prototype.$bus.$emit(g6Enum.ITEM_SELECT.code, item);
            // 更新所有的节点状态
            that.graph.getNodes().forEach(node => {
                that.graph.setItemState(node, g6Enum.ITEM_SELECT.code, false);
            });

            // 清空边的所有状态
            that.graph.getEdges().forEach(node => {
                that.graph.setItemState(node, g6Enum.ITEM_SELECT.code, false);
            });

            if (item) {
                that.graph.setItemState(item, g6Enum.ITEM_SELECT.code, true);
            }
        }

        // 绑定鼠标进入事件
        function bindNodeMouseEnter(evt) {
            const {item} = evt;
            that.graph.getNodes().forEach(node => {
                that.graph.setItemState(node, g6Enum.HOVER.code, false);
            });

            that.graph.getEdges().forEach(node => {
                that.graph.setItemState(node, g6Enum.HOVER.code, false);
            });

            if (item) {
                that.graph.setItemState(item, g6Enum.HOVER.code, true);
            }
        }

        // 绑定鼠标划出事件
        function bindNodeMouseLeave(evt) {
            that.graph.getNodes().forEach(node => {
                that.graph.setItemState(node, g6Enum.HOVER.code, false);
            });

            that.graph.getEdges().forEach(node => {
                that.graph.setItemState(node, g6Enum.HOVER.code, false);
            });
        }


        this.graph.on(G6Event.CLICK, bindNodeClickEvent);
        this.graph.on(G6Event.MOUSEENTER, bindNodeMouseEnter);
        this.graph.on(G6Event.MOUSELEAVE, bindNodeMouseLeave);
    }
}

export const g6Enum = {
    // 类型
    NODE: {code: "node", name: "类型为节点"},
    EDGE: {code: "edge", name: "类型为边"},
    COMBO: {code: "combo", name: "类型为边"},

    // 状态
    HOVER: {code: "hover", name: "鼠标滑动时的状态"},
    ITEM_SELECT: {code: "itemSelect", name: "item选中状态"},
    SEARCH_TYPE: {code: "search", name: "查询状态"},
    ERROR_TYPE: {code: "error", name: "执行成功状态"},
    SUCCESS_TYPE: {code: "success", name: "执行失败状态"},

    // 事件
    DBL_Click: {code: "DBLClick", name: "item双击事件"},
    IClick: {code: "IClick", name: "item单击事件"},
    ON_MOUSE_ENTER: {code: "onMouseenter", name: "鼠标滑进事件"},
    ON_MOUSE_LEAVE: {code: "onMouseleave", name: "鼠标滑出事件"},
    G6_EDITOR_CHANGE: {code: "G6EditorChange", name: "G6对象修事件"},
    DECISION_TREE_CHANGE: {code: "DecisionTreeChange", name: "决策树修改事件"},
    RuleDataChange: {code: "RuleDataChange", name: "元规则修改事件"},
    AddCondition: {code: "AddCondition", name: "添加条件节点"},
    AddResult: {code: "AddResult", name: "添加结果节点"},

    ruleClick: {code: "ruleClick", name: "元规则-流程式中双击击事件"},

    // 前进，回退  'redo' | 'undo'
    REDO:{code : "redo", name :"前进栈"},
    UNDO:{code : "undo", name :"回退栈"},
}
