<template>
    <!--左侧可引用节点的一栏-->
    <div class="item-panel">
        <template v-for="compClazz in compClazzList" v-if="g6CompList(compClazz).length > 0">
            <ul class="common-title" style="font-size: 18px; margin-block-start: 0em; margin-block-end: 0em;">{{compClazz.name}}</ul>
            <ul>
                <li
                        v-for="(item,index) in g6CompList(compClazz)"
                        :key="index"
                        class="getItem"
                        :data-shape="item.shape"
                        :data-type="item.type"
                        :data-size="item.size"
                        draggable
                        @dragstart="handleDragstart"
                        @dragend="handleDragEnd($event, item)"
                >
                    <embed :src="item.logoIcon.img" class="panel-type-icon" width="16" height="16" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />{{item.name}}
                </li>
            </ul>
        </template>
    </div>
</template>

<script>
    import okSvg from "@/assets/icons/ok.svg";
    import {G6Editor, g6Enum} from "../entity/entity";
    import {getUUID, ls} from "../../index";
    import {compClazzEnums} from "../../../entity/enumns";
    import {nodeStyle} from "../config/config";
    import {NodeFun} from "../common/g6-editor-common";

    export default {
        name: "item-panel",
        props: {
            compList: {type: Array, default: () => []},
            g6Editor: G6Editor,
            nodePre: {type: String, default: ""},
        },
        data() {
            return {
                offsetX: 0,
                offsetY: 0,
            };
        },

        computed: {
            compClazzList() {
                return Object.values(compClazzEnums);
            },

            g6CompList() {
                return (compClazz)=>{
                    let result = [];
                    result.push(...this.compList
                        .filter(item=>item.clazzList.includes(compClazz.code))
                        .map(item => {
                        // ================G6元素========================
                        let g6Comp = {};
                        Object.assign(g6Comp, JSON.parse(JSON.stringify(item)));
                        Object.assign(g6Comp, JSON.parse(JSON.stringify(nodeStyle)));
                        g6Comp.label = item.name;
                        g6Comp.name = item.name;
                        g6Comp.logoIcon = {show: true, x: 0, y: 0, img: item.icon, width: 16, height: 16, offset: 0};
                        g6Comp.stateIcon = {show: true, x: 0, y: 0, img: okSvg, width: 16, height: 16, offset: -5};

                        // =================本项目节点中的元素===============================
                        g6Comp.nData = {};
                        g6Comp.nData.compType = item.type;
                        return g6Comp;
                    }));
                    return result;
                }
            }
        },


        methods: {

            handleDragstart(e) {
                this.offsetX = e.offsetX;
                this.offsetY = e.offsetY;
            },

            /**
             * 拖动节点到画布的时候，生成g6节点对象，并加入到画布中
             * @param e
             * @param item
             */
            handleDragEnd(e, item) {
                let that = this;
                if (NodeFun.isCanAddNode(that.g6Editor.graph, item, that.nodePre)) {
                    let node = {};
                    Object.assign(node, JSON.parse(JSON.stringify(item)));
                    node.offsetX = this.offsetX;
                    node.offsetY = this.offsetY;
                    if (this.g6Editor && e.x > 350) {
                        const graph = this.g6Editor.graph;
                        const xy = graph.getPointByClient(e.x, e.y);
                        //=============本项目节点元素==================
                        node.nData.uniqueName = NodeFun.getNodePreName(item, that.nodePre) + NodeFun.getEnableIndexList(that.g6Editor.graph, item, that.nodePre)[0];
                        node.nData.connType = "and";


                        //===============G6元素====================
                        node.x = xy.x;
                        node.y = xy.y;
                        node.type = g6Enum.NODE.code;
                        node.id = getUUID();
                        node.description =  `${node.nData.uniqueName} [${node.nData.connType}]`;
                        graph.add(g6Enum.NODE.code, node)
                    }
                }
            },


        }
    }
</script>

<style scoped>
    .item-panel {
        height: 100%;
        position: absolute;
        left: 0;
        z-index: 2;
        background: #f7f9fb;
        width: 200px;
        padding-top: 8px;
        border-right: 1px solid #e6e9ed;
        overflow: auto;
    }

    .item-panel ul {
        padding: 0px 0px 0px 16px;
    }

    .item-panel li {
        color: rgba(0, 0, 0, 0.65);
        border-radius: 4px;
        width: 160px;
        height: 28px;
        line-height: 26px;
        padding-left: 8px;
        border: 1px solid rgba(0, 0, 0, 0);
        list-style-type: none;
    }

    .item-panel li:hover {
        background: white;
        border: 1px solid #ced4d9;
        cursor: move;
    }

    .item-panel .panel-type-icon {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
    }
</style>
