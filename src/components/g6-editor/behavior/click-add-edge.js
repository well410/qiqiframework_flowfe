import G6 from "@antv/g6";
import {getUUID} from "../../index";
import {G6Edge} from "../../../entity/model";
import ElementUI from 'element-ui';
import {compEnums} from "../../../entity/enumns";

const dropStyle = {
    stroke: '#1890FF',
    strokeOpacity: 0.9,
    lineDash: [5, 5],
    endArrow: {
        path: G6.Arrow.vee(10, 20, 0),
    },
    lineAppendWidth: 15,
    startArrow: false,
};

const connStyle = {
    stroke: '#b8c3ce',
    lineDash: null,
    endArrow: {
        path: G6.Arrow.vee(10, 20, 0)
    },
    lineAppendWidth: 15,
    startArrow: false,
};


/**
 * 去除异常的连线
 * @param graph：g6图
 * @param edge：当前连线
 * @param node：目标节点
 */
function removeErrorEdge(graph, edge, node) {
    const source = edge.getModel().source;
    const target = node.getModel().id;
    // 防止节点自己连自己
    let removeEdges = graph.getEdges().filter(item => item.getModel().source === item.getModel().target);
    removeEdges.forEach(item => graph.removeItem(item));

    function isRemove(){
        // 节点自己链接自己已经删除，不需要再删除该边
        if (source === target) {
            return false;
        }

        // 防止重复链接
        let sameLength = graph.getEdges()
            .filter(item => {
                return (item.getModel().source === source) && (item.getModel().target === target)
            })
            .length;
        if (sameLength > 1) {
            ElementUI.Message({message: "不能重复链接哦", type: 'warning'});
            return true;
        }

        // 防止回环
        let loopLength = graph.getEdges().filter(item => {
            return (item.getModel().source === target) && (item.getModel().target === source)
        }).length;
        if (loopLength >= 1) {
            ElementUI.Message({message: "不能回环哦", type: 'warning'});
            return true
        }

        // 防止结果节点链接
        let resultNodeLength = graph.getNodes()
            .filter(item=>{
                return [compEnums.DR.code, compEnums.RR.code].includes(item.getModel().nData.compType) && (item.getModel().id === target || item.getModel().id === source)
            }).length;
        if (resultNodeLength >=1) {
            ElementUI.Message({message: "结果节点一定是最后运行的，不需要连线哦", type: 'warning'});
            return true
        }


        return false;
    }

    if (isRemove()){
        graph.removeItem(edge)
    }
}

export default {
    getEvents() {
        return {
            'node:click': 'onClick',
            'mousemove': 'onMousemove',
            'edge:click': 'onEdgeClick'
        }
    },

    onClick(ev) {
        const self = this;
        const node = ev.item;
        const graph = self.graph;
        const model = node.getModel();
        if (self.addingEdge && self.edge) {
            // 把连线变为实线
            graph.updateItem(self.edge, {target: model.id, style: connStyle});
            removeErrorEdge(graph, self.edge, node);
            self.edge = null;
            self.addingEdge = false;
        } else {
            let item = {id: getUUID(), source: model.id, target: model.id, type: "quadratic"};
            Object.assign(item, JSON.parse(JSON.stringify(G6Edge.getDefaultEData())));
            self.edge = graph.addItem('edge', item);
            self.addingEdge = true;
        }
    },

    onMousemove(ev) {
        const self = this;
        const point = {x: ev.x, y: ev.y};
        if (self.addingEdge && self.edge) {
            console.log("onMousemove");
            self.graph.updateItem(self.edge, {target: point, style: dropStyle})
        }
    },

    onEdgeClick(ev) {
        const self = this;
        const currentEdge = ev.item;
        if (self.addingEdge && self.edge === currentEdge) {
            self.graph.removeItem(self.edge);
            self.edge = null;
        }
    }

}
