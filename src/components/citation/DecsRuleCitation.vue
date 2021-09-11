<template>
    <div id="citePageId" class="graph-container" style="position: relative;">
    </div>

</template>

<script>
    import G6 from "@antv/g6"
    import {citationNode, decsNode, decsToRuleEdge, ruleToRuleEdge} from "./citationNode";
    import {g6Enum} from "../g6-editor/entity/entity";
    import {G6Event} from "@antv/g6/lib/types";
    export default {
        name: "DecsRuleCitation",
        props: {
            citePageId:{
                type: String,
                default: "graph-container"
            },
        },
        data() {
            return{
                graph: null,
                data:{
                    type: Object, default: () => {}
                },
            }
        },
        mounted() {
            this.$nextTick(() => {
                // this.init();
                // this.bindEvents();
            });
        },
        methods: {

            getData(pDecs, ruleCitation,ruleList){
                let data={};
                let nodes=[];
                nodes.push(decsNode(pDecs));
                ruleCitation.forEach(item =>{
                    nodes.push(citationNode(item));
                });//9,23 -3 ;7,22
                data.nodes=nodes;
                let edges=[];
                edges.push(...decsToRuleEdge(pDecs,ruleList));
                edges.push(...ruleToRuleEdge(ruleCitation));
                data.edges=edges;
                return data;
            },

            init(pDecs, ruleCitation,ruleList) {
                let that=this;
                that.data= that.getData(pDecs,ruleCitation,ruleList);
                if (that.graph!=null){
                    that.graph.clear();
                    that.graph.destroy();
                }
                that.graph = new G6.Graph({
                    container: this.citePageId,
                    width:document.documentElement.clientWidth - 350,
                    height:600,
                    fitView: true,
                    modes: {
                        default: ['drag-canvas', 'drag-node', "tooltipEvent",'zoom-canvas','click-select'],
                    },
                    layout: {
                        type: 'dagre',
                        rankdir: 'LR',
                        align: 'DL',
                        nodesepFunc: () => 1,
                        ranksepFunc: () => 1,
                    },
                    defaultNode: {
                        size: [200, 60],
                        type: 'modelRect',
                        color: "#1890ff",
                        style: {
                            lineWidth: 2,
                            stroke: '#5B8FF9',
                            // fill: '#C6E5FF',
                        },
                        logoIcon:{
                            show:false,
                            // width:8
                        },
                        labelCfg: {
                            style: {
                                // fill: '#9254de',
                                fontSize: 18,

                            },
                            textOverflow:"ellipsis",
                            whiteSpace:"nowrap",
                            overflow: "hidden",

                        },
                        descriptionCfg: {
                            style: {
                                fill: '#848484',
                            },
                        },
                    },
                    nodeStateStyles:{
                        hover: {
                            fill: '#c5e6cf',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        },

                        itemSelect: {
                            fill: '#c5e6cf',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        }
                    },
                    edgeStateStyles: {
                        hover: {
                            stroke: '#1890FF',
                        },

                        itemSelect: {
                            stroke: '#1890FF',
                        },
                    },
                    defaultEdge: {
                        size: 1,
                        color: '#b8c3ce',
                        lineDash: null,
                        style: {
                            endArrow: {
                                // path: 'M 0,0 L 8,4 L 8,-4 Z',
                                // fill: '#e2e2e2',
                                path: G6.Arrow.vee(10, 20, 0)
                            },
                        },
                        lineAppendWidth: 15,
                        // startArrow: false,
                    },

                });
                that.$emit(g6Enum.G6_EDITOR_CHANGE.code, that.graph);
                that.graph.data(that.data);
                that.graph.render();
                that.graph.on(G6Event.NODE_CLICK,evt =>{
                    // 发送点击事件
                    that.$emit(g6Enum.IClick.code, evt.item);

                    const {item}=evt;
                    //清空节点itemSelect样式
                    that.graph.getNodes().forEach(node =>{
                        that.graph.setItemState(node,"itemSelect",false);
                    });
                    //清空边itemSelect样式
                    that.graph.getEdges().forEach(edge=>{
                        that.graph.setItemState(edge,"itemSelect",false);
                    });
                    that.graph.setItemState(item,"itemSelect",true);
                    let inEdges=item.getInEdges();
                    let outEdges=item.getOutEdges();
                    inEdges.forEach(edge =>{
                        that.graph.setItemState(edge,"itemSelect",true);
                        that.graph.setItemState(edge.getSource(),"itemSelect",true);
                    });
                    outEdges.forEach(edge =>{
                        that.graph.setItemState(edge,"itemSelect",true);
                        that.graph.setItemState(edge.getTarget(),"itemSelect",true);
                    });
                });

                that.graph.on(G6Event.CANVAS_CLICK,evt =>{
                    //清空节点itemSelect样式
                    that.graph.getNodes().forEach(node =>{
                        that.graph.setItemState(node,"itemSelect",false);
                    });
                    //清空边itemSelect样式
                    that.graph.getEdges().forEach(edge=>{
                        that.graph.setItemState(edge,"itemSelect",false);
                    });
                });

            }
        }
    }
</script>

<style scoped>

</style>
