<template>
    <!--流程图-->
    <div class="page" :style="boxStyle">
        <div :id="pageId" class="graph-container" style="position: relative;"></div>
    </div>
</template>

<script>

    import {g6Enum, G6Editor} from "../entity/entity";
    import {initBehaviors} from "../behavior/index.js";
    import {isEmpty, isNotEmpty, matchNum} from "../../../utils";
    import G6 from "@antv/g6";
    import {nodeStyle} from "../config/config";
    import {compEnums} from "../../../entity/enumns";
    import okSvg from "@/assets/icons/ok.svg";
    import {G6Edge} from "../../../entity/model";
    import {G6Model} from "../../../entity/g6Model";
    import {canvasSideWith, canvasTopheight} from "../../common/common";
    import eventBus from "@/utils/eventBus";
    import {getUUID} from "../../index";
    import {NodeFun} from "../common/g6-editor-common";

    export default {
        name: "page",
        props: {
            height: {
                type: Number,
                default: 0
            },
            width: {
                type: Number,
                default: 0
            },
            data: {
                type: Object,
                default: () => {
                }
            },
            pageId: {
                type: String,
                default: "graph-container"
            }
        },

        data() {
            return {
                graph: null,
                decisionTree: null,
                panelStyle: {
                    right: null
                },
                //上一步节点选择情况，通过判断节点选择是否改变判断是否刷新
                lastSelectedItemNum:0,

            };
        },
        created() {
            initBehaviors();
            const _t = this
            eventBus.$on('editor/panel/toggle', function (data) {
                _t.$set(_t.panelStyle, data.name, data.style)
            })
        },

        mounted() {
            this.$nextTick(() => {
                this.init();
                this.bindEvents();
            });
        },
        computed:{
            boxStyle () {
                const _t = this
                const boxStyle = {}
                const keys = Object.keys(_t.panelStyle)
                keys.forEach(key => {
                    const panelStyle = _t.panelStyle[key]
                    if (panelStyle) {
                        // 位置数据
                        const positionVal = isNaN(parseInt(panelStyle[key])) ? 0 : parseInt(panelStyle[key])
                        const width = isNaN(parseInt(panelStyle.width)) ? 0 : parseInt(panelStyle.width)
                        boxStyle[key] = positionVal + width + 'px'
                    }
                })
                return boxStyle
            }
        },

        methods: {
            bindEvents() {
                let that = this;
                that.$bus.$on(g6Enum.DECISION_TREE_CHANGE.code + this.pageId, data => {
                    that.decisionTree = data;
                    that.refreshFlow();
                })
            },

            doCopyOfMenu(target, item){
                let that = this;
                // 如果是边的话，不能复制
                if (item.getType() === g6Enum.EDGE.code){
                    that.$message('边不能复制');
                    return;
                }

                that.$confirm('确定要复制该节点吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    // 断掉引用
                    let node = JSON.parse(JSON.stringify(item.getModel()));
                    if (NodeFun.isCanAddNode(this.graph, node, "")){
                        const enableIndexList = NodeFun.getEnableIndexList(that.graph, node, "");
                        const uniqueName =  NodeFun.getNodePreName(node, "");
                        // 修改规则名
                        node.nData.uniqueName = uniqueName + enableIndexList[0];
                        // 修改描述
                        node.description =  `${node.nData.uniqueName} [${node.nData.connType}]`;
                        // 防止覆盖
                        node.x = node.x + 200;
                        node.y = node.y - 50;
                        node.id = getUUID();
                        this.graph.add(g6Enum.NODE.code, node);
                    }

                }).catch(() => {});
            },

            doDeleteOfMenu(target, item) {
                let that = this;
                that.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(({value}) => {
                    if (item.getType() !== g6Enum.NODE.code) {
                        that.$message('只能对节点操作');
                    } else {
                        // 如果有多选则把多选也删除
                        let selectList = that.graph.getNodes().filter(node => node.hasState("selected"));
                        selectList.forEach(node => that.graph.removeItem(node));
                        // 没有多选，就删除当前的
                        that.graph.removeItem(item)
                    }
                }).catch(() => {
                });
            },

            doDebugOfMenu(target, item){
                let that = this;
                // 如果是边的话，不能测试
                if (item.getType() === g6Enum.EDGE.code){
                    that.$message('边不能测试');
                    return;
                }
                this.$emit("doDebugOfMenu", item)
            },

            /**
             * 添加容器，参考流程图中容器的添加
             * @param target
             * @param item
             * @see https://g6.antv.vision/zh/examples/interaction/combo#rect
             */
            doCreateCombo(target, item){
                // 未选择节点时不需要进行任何操作
                let nodeIdList = this.graph.getNodes().filter(item => item.hasState("selected")).map(item => item.getModel().id);
                if (isEmpty(nodeIdList)){
                    this.$message('未选择任何节点');
                    return
                }
                // 选择节点后，还需要验证是否进行了combo嵌套，combo相互嵌套在当前版本可能会有问题
                for (let i = 0; i < this.graph.getCombos().length; i++) {
                    let combo = this.graph.getCombos()[i];
                    let inComboNodeList = combo.getNodes().map(item => item.getModel().id);
                    let nodeIdSet = new Set(nodeIdList);
                    let interNum = inComboNodeList.filter(item=> nodeIdSet.has(item)).length;
                    if (interNum > 0){
                        this.$message('容器不能相互嵌套');
                        return
                    }
                }

                let numList = this.graph.getCombos().map(item => matchNum(item.getModel().id));
                let maxVal = isEmpty(numList) ? 0 : (Math.max(...numList) + 1);
                let comboConf = {id: `combo${maxVal}`, label: `combo${maxVal}`,  collapsed: false };
                this.graph.createCombo(comboConf, nodeIdList);

                nodeIdList.forEach(item => {
                    // 修改节点 comboId
                    let model = this.graph.findById(item).getModel();
                    model['comboId'] = comboConf.id;
                    this.graph.updateItem(item, model)
                });
            },

            /**
             * 删除容器
             * @param target
             * @param item
             */
            doDeleteCombo(target, item){
                debugger
                let that = this;
                if (item.getType() === g6Enum.COMBO.code){
                    //修改节点comboId 与 添加容器中在修改comboId相对应
                    //因为在添加容器的时候comboId是手动添加的，所以在解除容器的时候不会自动的删除，造成节点依旧属于某一个comboid,但是对应的combo已经不存在就会有问题
                    let comboChildNodeIdList = item.getModel().children.map(child=>child.id);
                    let curComboId = item.getModel().id;
                    this.graph.uncombo(item.getModel().id);
                    comboChildNodeIdList.forEach(nodeId=>{
                        let nodeModel =  that.graph.findById(nodeId).getModel();
                        delete nodeModel.comboId
                        delete nodeModel.depth
                    })
                    that.graph.cfg.data.combos = that.graph.cfg.data.combos.filter(combo=>combo.id!=curComboId)
                    let curTree = that.graph.cfg.data;
                    that.graph.clear();
                    that.graph.read(curTree);
                    return
                }
                this.$message('你点击的不是容器');
            },

            /**
             * 创建右击弹框组件
             * @returns {*}
             */
            doCreateMenu() {
                let that = this;
                return new G6.Menu({
                    getContent(evt) {
                        return `<ul>
                                  <li style="list-style-type: none;margin-left: -30px">复制</li>
                                  <li style="list-style-type: none;margin-left: -30px">测试</li>
                                  <li style="list-style-type: none;margin-left: -30px">删除</li>
                                  <li style="list-style-type: none;margin-left: -30px">添加容器</li>
                                  <li style="list-style-type: none;margin-left: -30px">解除容器</li>
                                </ul>`;
                    },
                    handleMenuClick(target, item) {
                        switch (target.innerText) {
                            case "复制":
                                that.doCopyOfMenu(target, item);
                                break;
                            case "添加容器":
                                that.doCreateCombo(target, item);
                                break;
                            case "解除容器":
                                that.doDeleteCombo(target, item);
                                break;
                            case "删除":
                                that.doDeleteOfMenu(target, item);
                                break;
                            case "测试":
                                that.doDebugOfMenu(target, item);
                                break;
                        }
                    },
                });
            },




            init() {
                const height = this.height - canvasTopheight;
                const height1 = this.height;
                const width = this.width - canvasSideWith;
                const width1 = this.width;

                // 构建右击弹框
                const menu = this.doCreateMenu();
                // antv g6 具体Api见 https://g6.antv.vision/zh/docs/manual/middle/elements/combos/defaultCombo#combo-%E7%9A%84%E9%80%9A%E7%94%A8%E5%B1%9E%E6%80%A7
                this.graph = new G6.Graph({
                    container: this.pageId,
                    plugins: [menu], // 配置 Menu 插件
                    height: height,
                    width: width,
                    nodeStateStyles: {
                        hover: {
                            fill: '#c5e6cf',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        },

                        itemSelect: {
                            fill: '#c5e6cf',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        },

                        // 框选时的样式
                        selected: {
                            fill: '#c5e6cf',
                            // stroke: '#c5e6cf',
                            lineWidth: 3
                        },

                        // 搜索时的状态
                        search: {
                            fill: '#e1f3d8',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        },

                        // 成功时的状态
                        success: {
                            fill: '#90ff31',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        },

                        // 有异常时的状态
                        error: {
                            fill: '#FDE2E2',
                            // stroke: '#6ab7ff',
                            cursor: 'move',
                        }
                    },

                    defaultCombo: {
                        type: 'rect',
                        padding: [50, 50, 50, 50],
                        opacity: 0.5,
                        fillOpacity: 0.5,
                        style: {
                            lineWidth: 1,
                        },
                        labelCfg: {
                            refY: 10,
                            refX: 20,
                            position: 'top',
                        },
                    },
                    comboStateStyles: {
                        dragenter: {
                            lineWidth: 4,
                            stroke: '#FE9797',
                        },
                    },


                    edgeStateStyles: {
                        hover: {
                            stroke: '#1890FF',
                        },

                        // 框选时的样式
                        selected: {
                            stroke: '#c5e6cf',
                            lineWidth: 3
                        },

                        itemSelect: {
                            stroke: '#1890FF',
                        },
                    },

                    modes: {
                        // 支持的 behavior
                        default: ["drag-canvas", "brush-select-1", "drag-node", "zoom-canvas", "iclick", "tooltipEvent", 'drag-combo', 'collapse-expand-combo-1'],
                        show: ["drag-canvas", "zoom-canvas", "dblclick", "iclick", "tooltipEvent"],
                        linkEdge: ["click-add-edge","drag-node", "drag-canvas", "zoom-canvas", 'drag-combo', 'collapse-expand-combo-1'],
                    }
                });

                // 添加combo的事件，节点移入和移出时会将边框变色，见https://g6.antv.vision/zh/examples/interaction/combo#rect
                this.graph.on('combo:dragend', (e) => {
                    this.graph.getCombos().forEach((combo) => {
                        this.graph.setItemState(combo, 'dragenter', false);
                    });
                });
                this.graph.on('node:dragend', (e) => {
                    this.graph.getCombos().forEach((combo) => {
                        this.graph.setItemState(combo, 'dragenter', false);
                    });
                });

                this.graph.on('combo:dragenter', (e) => {
                    this.graph.setItemState(e.item, 'dragenter', true);
                });
                this.graph.on('combo:dragleave', (e) => {
                    this.graph.setItemState(e.item, 'dragenter', false);
                });

                let that =this;
                // 当 click-select 选中的元素集合发生变化时将会触发下面时机事件，e 中包含相关信息
                this.graph.on('nodeselectchange', (e) => {
                    debugger
                    //e.selectedItems  当前选择的节点：数据结构{nodes:[] edges:[]}
                    let curSelectedItemNum = e.selectedItems.nodes.length+e.selectedItems.edges.length;
                    if(!e.select && !(curSelectedItemNum===0 && that.lastSelectedItemNum===0)){
                        let curTree = that.graph.save();
                        that.graph.clear();
                        that.graph.read(curTree);
                    }
                    that.lastSelectedItemNum = curSelectedItemNum;
                });

                this.$emit(g6Enum.G6_EDITOR_CHANGE.code, new G6Editor(this.graph));
                const { editor, command } = this.$parent;
                if(editor){
                    editor.emit("afterAddPage", { graph: this.graph, command });
                    this.readData();
                }

            },
            readData() {
                let data = this.data;
                if (data) {
                    this.graph.read(data);
                }
            },

            // 刷新流程图
            refreshFlow() {
                let that = this;
                that.graph.clear();
                that.graph.read(that.decisionTree);
            },



        }

    }
</script>

<style scoped>
    .page {
        margin-left: 200px;
        /*margin-right: 200px;*/
    }

</style>
