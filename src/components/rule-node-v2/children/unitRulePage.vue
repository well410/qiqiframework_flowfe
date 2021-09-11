<template>
    <div >
        <div :id="rulePageId" class="graph-container" style="position: relative;"></div>
    </div>
</template>
<script>
    import G6 from "@antv/g6";
    import {G6Editor, g6Enum} from "../../g6-editor/entity/entity";
    import {canvasSideWith, canvasTopheight} from "../../common/common";
    import {G6Model} from "../../../entity/g6Model";
    import {getUnitRuleNodeNum, IProps, STATUS} from "./index";
    import insertCss from 'insert-css';
    import {initBehaviors} from "./behavior/index.js";
    import './shape/rootRect'
    import './shape/polyline'
    import './shape/flowline'
    import './shape/conditonRect'
    import './shape/ResultRect'
    import {getUUID, ls} from "../../index";
    import unit_rule_add from "@/assets/icons/node/unit_rule_add.svg"
    import unit_rule_expand from "@/assets/icons/node/unit_rule_expand.svg"
    import unit_rule_close from "@/assets/icons/node/unit_rule_close.svg"
    import {getConditionRes} from "../../rule-node";
    import Vue from "vue";
    export default {
        name:"UnitRulePage",
        props:{
            height: {
                type: Number,
                default: 0
            },
            width: {
                type: Number,
                default: 0
            },
            node: {default: () => {}, type: Object},
            rulePageId : {
                type: String,
                default: "unitRulePageId"
            },
            ugvResultList:{},
            disabled: {default: false, type: Boolean},
        },
        data(){
            return{
                graph: null,
            }
        },
        created() {
            initBehaviors();
        },

        mounted() {
        },
        methods: {

            // refresh(){
            //     if (isNotEmpty(this.graph)){
            //         this.graph.data(this.node.nData.ruleData);
            //         this.graph.render();
            //     }
            // },


            init(){
                let that = this;
                function getcontextMenu() {
                    return new G6.Menu({
                        getContent(graph) {
                            console.log('graph', graph);
                            return `<ul style="margin: 0;padding-left: 18px;">
                          <li title="addCondition">添加条件节点</li>
                          <li title="addResult">添加结果节点</li>
                        </ul>`;
                        },
                        shouldBegin: (evt) => {
                            if (evt.target.cfg.name === "unit_rule_add") {
                                return true;
                            } else {
                                return false;
                            }
                        },

                        handleMenuClick: (target, item) => {
                            //点击添加条件的回调事件
                            if (target.title === "addCondition") {
                                var model = item.getModel();
                                var conta1 = item.getContainer();
                                if (!model.children) {
                                    model.children = [];
                                }
                                if (model.type !== 'root-rect' && model.children.length >= 2) {
                                    Vue.prototype.$message({
                                        message: `目前条件节点仅支持两个子节点,处理节点为true和false两种情况`,
                                        type: 'warning'
                                    });
                                    return;
                                }
                                const id = getUUID();
                                console.log(id);
                                var UniqurIdList = that.graph.cfg.data.nData.uniqueIdList===undefined?that.graph.cfg.data.nData.uniqueIdList=[]:that.graph.cfg.data.nData.uniqueIdList;
                                var uniqueNodeNum = getUnitRuleNodeNum("UR_CN", UniqurIdList);
                                that.graph.cfg.data.nData.uniqueIdList.push(uniqueNodeNum);
                                model.children.push({
                                    id,
                                    label: "",
                                    collapsed: false,
                                    type: 'condition-rect',
                                    nData: {
                                        conResult:getConditionRes(),
                                        uniqueNodeNum,
                                        parentResult: "               "
                                    },
                                });
                                console.log(getConditionRes());
                                that.graph.updateChild(model, model.id);
                                that.$emit("G6EditorChange", new G6Editor(that.graph));
                            } else if (target.title === "addResult") {//点击添加脚本表达式的回调事件
                                var model = item.getModel();
                                var conta1 = item.getContainer();
                                if (!model.children) {
                                    model.children = [];
                                }
                                if (model.type !== 'root-rect' && model.children.length >= 2) {
                                    Vue.prototype.$message({
                                        message: `目前条件节点仅支持两个子节点,处理节点为true和false两种情况`,
                                        type: 'warning'
                                    });
                                    return;
                                }
                                var id = getUUID();
                                var UniqurIdList = that.graph.cfg.data.nData.uniqueIdList===undefined?that.graph.cfg.data.nData.uniqueIdList=[]:that.graph.cfg.data.nData.uniqueIdList;
                                var uniqueNodeNum = getUnitRuleNodeNum("UR_RN", UniqurIdList);
                                that.graph.cfg.data.nData.uniqueIdList.push(uniqueNodeNum);

                                model.children.push({
                                    id,
                                    label: "",
                                    value: "",
                                    collapsed: false,
                                    type: 'result-rect',
                                    nData: {
                                        uniqueNodeNum,
                                        parentResult: "               "
                                    },

                                });
                                that.graph.updateChild(model, model.id);
                                that.ugvResultList[uniqueNodeNum]="";

                            }
                            that.$emit("G6EditorChange", new G6Editor(that.graph));


                        },
                        // 需要加上父级容器的 padding-left 16 与自身偏移量 10
                        offsetX: 10,
                        // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
                        offsetY: 10,
                        // 在哪些类型的元素上响应
                        itemTypes: ['node'],
                    });
                }

                if(this.graph!=null){
                    this.graph.clear();
                    this.graph.destroy();
                    // this.graph =null;
                }
                const width = document.getElementById(this.rulePageId).scrollWidth;
                const height = document.getElementById(this.rulePageId).scrollHeight || 400;

                this.graph = new G6.TreeGraph({
                    container: this.rulePageId,
                    width,
                    height,
                    // linkCenter: true,
                    plugins: [getcontextMenu() ], // 配置 contextMenu 插件

                    layout: {
                        // type: "dagre",
                        // rankdir: "TB",
                        // nodesep: 50,
                        // ranksep: 20
                        type: 'compactBox',
                        direction: 'TB',
                        getId: function getId(d) {
                            return d.id;
                        },
                        getHeight: function getHeight() {
                            return 16;
                        },
                        getWidth: function getWidth() {
                            return 16;
                        },
                        getVGap: function getVGap() {
                            return 40;
                        },
                        getHGap: function getHGap() {
                            return 70;
                        },
                    },
                    modes: {
                        default: [{
                            type: 'collapse-expand',
                            trigger: 'click',
                            shouldBegin: (e) => {
                                // 若当前操作的节点 id 为 'node1'，则不发生 collapse-expand
                                if (e.item){
                                    if( e.target.cfg.attrs.img && (e.target.cfg.attrs.img.includes("unit_rule_close")||e.target.cfg.attrs.img.includes("unit_rule_expand"))){
                                        return true;
                                    }
                                }
                                return false;
                            },
                        },
                            "drag-canvas","zoom-canvas","unit-rule-add-click","unit-rule-delete-click","rule-click"]
                    },
                    defaultNode: {
                        // type: "root-rect",
                        labelCfg: {
                            style: {
                                fill: "#000000A6",
                                fontSize: 10
                            }
                        },
                        style: {
                            stroke: "#91d5ff",
                            width: 150,
                            height: 50
                        },
                        showButton:!that.disabled
                    },
                    nodeStateStyles: {
                        hover: {
                            fill: '#c5e6cf',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        },

                        itemSelect: {
                            fill: '#c5e6cf',
                            // stroke: '#6ab7ff',
                            cursor: 'click',
                        }
                    },
                    defaultEdge: {
                        // type: "polyline",
                        type: 'flow-line',
                        label:"",
                        id:getUUID(),
                        style:{
                            stroke: '#91d5ff',
                            endArrow: {
                                path: 'M 0,0 L 12, 6 L 9,0 L 12, -6 Z',
                                fill: '#91d5ff',
                                // d: -20,
                            },
                        }
                    },
                });
                this.graph.data(this.node.nData.ruleData);
                this.graph.render();
                this.graph.fitView(20);
                this.$emit("G6EditorChange", new G6Editor(this.graph));


                that.graph.on('itemcollapsed', e => {
                    const item = e.item;
                    const data = item.getModel();
                    data.collapsed = e.collapsed;
                    that.graph.updateItem(item, data);
                    that.graph.refreshItem(item);
                    if(item._cfg.parent){
                        const itemParent = item._cfg.parent;
                        that.graph.updateChild(itemParent.getModel(),itemParent.id)
                        this.graph.fitView();
                    }else{
                        that.graph.data(that.node.nData.ruleData);
                        this.graph.render();
                        this.graph.fitView(20);
                    }
                    this.$emit("G6EditorChange", new G6Editor(this.graph));

                });
            },

        }
    }
</script>
<style>

</style>
