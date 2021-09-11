<template>
    <!--g6 编辑的首页-->
    <div id="g6-editor" :style="{width:width}">
        <div class="editor">
            <tool-bar :g6-editor="g6Editor"
                      :page-id="pageId"
                      :removeList="toolsRemoveList"
                      @handleEditDT="handleEditDT"
                      @handleSave="handleSave"
                      @handleSearch="handleSearch"
                      @handleCheck="handleCheck"
                      @handlePublish="handlePublish"
                      @handleCopyDT="handleCopyDT"
                      @handleDebug="handleDebugBefore" v-show="computeIsShow"></tool-bar>
            <div style="height: 42px;"></div>
            <div class="bottom-container">
                <item-panel :comp-list="compList" :g6-editor="g6Editor" :node-pre="nodePre" v-show="computeIsShow"></item-panel>
                <mini-map></mini-map>
                <tooltip :p-node="tooltip.node" :p-point="tooltip.point"  v-show="tooltip.isShow"></tooltip>
                <detail-panel placement="right"
                              position="left"
                              :width=detailwidth
                              :isBoxShow.sync="isBoxShow"
                              @expand="toggleHandler"
                              @widthChange="widthChange"
                              @watchBoxShow="watchBoxShow"
                              :style="{ width: detailwidth + 'px' }">
                    <slot name="drawer" :decisionTree="computeDecisionTree" :drawer="drawer">
                        请定义自己的插槽
                    </slot>
                </detail-panel>
                <page :height="height" :width="width" :page-id="pageId" :data="data" @doDebugOfMenu="doDebugOfMenu" @G6EditorChange="g6EditorChange"></page>

            </div>
        </div>

        <!--编辑决策图-->
        <el-dialog
                :visible.sync="editDTDialog.isShow"
                :title="editDTDialog.title"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                :modal="false"
                width="800px">
            <codemirror v-model="editDTDialog.dt" :options="cmOptions"
                        style="line-height:20px;z-index: 5000"></codemirror>
            <template slot="footer" class="dialog-footer">

                <el-button @click="editDTDialog.isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="editDTAfterClick" size="mini">确 定</el-button>
            </template>
        </el-dialog>

        <!--测试插槽-->
        <el-dialog
                :visible.sync="debugDialog.isShow"
                :title="debugDialog.title"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                width="800px">
            <slot name="debugDialog">
                请定义自己的插槽
            </slot>

            <template slot="footer" class="dialog-footer">
                <el-button @click="debugDialog.isShow = false; debugDialog.isLoading = false;" size="mini">取 消</el-button>
                <el-button type="primary" @click="handleDebugAfter" :loading="debugDialog.isLoading" size="mini">确 定
                </el-button>
            </template>
        </el-dialog>

    </div>
</template>

<script>
    import ToolBar from "./tool-bar/tool-bar";
    import ItemPanel from "./item-panel/item-panel";
    import MiniMap from "./mini-map/mini-map";
    import MiniMap2 from "./mini-map/mini-map2";
    import Page from "./page/page";
    import {g6Enum} from "./entity/entity";
    import {isEmpty, isNotEmpty} from "../../utils";
    import Tooltip from "./tooltip/tooltip";
    import DetailPanel from "./detail-panel/DetailPanel";
    import Vue from 'vue'

    import eventBus from "../../utils/eventBus";

    export default {
        name: "G6Editor",
        components: {Tooltip, Page, MiniMap, ItemPanel, ToolBar, DetailPanel, MiniMap2},
        props: {
            height: {
                type: Number,
                default: document.documentElement.clientHeight
            },
            width: {
                type: Number,
                default: document.documentElement.clientWidth
            },
            data: {
                type: Object, default: () => {
                }
            },
            compList: {type: Array, default: () => []},
            // 节点前缀
            nodePre: {type: String, default: ""},
            pageId: {type: String, default: "graph-container"},
            toolsRemoveList: {type: Array, default: () => []}
        },

        data() {
            return {
                // 搜索插槽
                searchDialog: {isShow: false, title: '搜索', searchWords: ""},
                // 编辑流程图插槽
                editDTDialog: {isShow: false, title: '更换流程图', dt: ""},
                // 测试插槽
                debugDialog: {isShow: false, title: '测试', isLoading: false},
                drawer: {currItem: {nData: {}}, conn: {}, type: '', title: '', isShow: false},
                isBoxShow:false,
                // 提示组件
                tooltip: {isShow: false, node: {}, point:{}},
                g6Editor: null,
                cmOptions: {
                    //使用的语言
                    mode: 'application/json',
                    theme: 'idea',
                    lineWrapping: true,
                    foldGutter: true,
                    //语法报错
                    lint: true,
                    // gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
                    showCursorWhenSelecting: true,
                    autofocus: false,
                    line: true,
                    indentWithTabs: true,
                    smartIndent: true,
                    //显示行号
                    lineNumbers: true,
                    //括号匹配
                    matchBrackets: true,
                },

                isSonOfDecsFlow:false,
                editor: {},
                command: null,
                detailwidth: 800,
            }
        },

        mounted() {
            this.bindEvents();
        },
        created() {
            this.initData();
        },

        computed: {
            /**
             * 是否显示（当 graph 的模式为"default", "linkEdge" 显示）
             */
            computeIsShow() {
                if (isEmpty(this.g6Editor)) {
                    return true;
                }
                return ["default", "linkEdge"].includes(this.g6Editor.graph.getCurrentMode());
            },

            computeDecisionTree() {
                return this.g6Editor ? this.g6Editor.graph.save() : {};
            }
        },


        methods: {

            /**
             * 单节点测试使用
             **/
            doDebugOfMenu(item){
                this.$emit("doDebugOfMenu", item, this.debugDialog)
            },

            initData() {
                this.isSonOfDecsFlow = this.$parent.isDecsFlow;
                // this.editor = new Editor();
                this.editor = this.$parent.editor;
                this.command = this.$parent.command;
                // this.command = new command(this.editor);
            },
            // 绑定事件
            bindEvents() {
                let that = this;
                that.$bus.$on(g6Enum.IClick.code + this.pageId, data => {
                    that.drawer.currItem = data.getModel();
                    that.drawer.g6Editor = that.g6Editor;
                    that.drawer.isShow = true;
                    that.drawer.type = data.getType();
                    that.isBoxShow = true;

                    // var temp = this.computeDecisionTree();
                    that.$nextTick(()=>{
                        that.drawerOpened();
                    })

                });
                // 鼠标进入事件
                that.$bus.$on(g6Enum.ON_MOUSE_ENTER.code + this.pageId, evt => {
                    that.tooltip.node = evt.item.getModel();
                    that.tooltip.point = that.g6Editor.graph.getClientByPoint(evt.x, evt.y);
                    that.tooltip.isShow = true;
                    console.log(that.tooltip.point)
                });
                // 鼠标退出事件
                that.$bus.$on(g6Enum.ON_MOUSE_LEAVE.code + this.pageId, evt => {
                    that.tooltip.isShow = false;
                });

            },

            // 节点或连线编辑抽屉打开后事件
            drawerOpened() {
                this.$emit("drawerOpened", this.drawer)
            },

            // 节点或连线编辑抽屉关闭后事件
            drawerClose() {
                this.g6Editor.graph.refresh();
            },

            /**
             * g6Editor 修改
             * @param data
             */
            g6EditorChange(data) {
                this.g6Editor = data;
                if (this.pageId === 'graph-container'){
                    Vue.prototype.$g6Editor = data;
                }
            },


            /**
             * 设置决策树
             * @param decisionTree
             */
            setDecisionTree(decisionTree) {
                if (isEmpty(decisionTree)) return;
                this.$bus.$emit(g6Enum.DECISION_TREE_CHANGE.code + this.pageId, decisionTree);
            },

            /**
             * 设置图的编辑模式
             * @param mode: default, show, linkEdge
             */
            setGraphMode(mode) {
                this.g6Editor.graph.setMode(mode);
            },

            /**
             * 获取决策图
             */
            getDecisionTree() {
                return this.g6Editor.graph.save();
            },

            /**
             * 获取流程图对象
             */
            getGraph() {
                return this.g6Editor.graph;
            },

            /**
             * 处理验证
             */
            handleCheck() {
                this.$emit("handleCheck");
            },

            /**
             * 发布决策
             */
            handlePublish() {
                this.$emit("handlePublish");
            },

            /**
             * 初始化流程图
             */
            handleEditDT() {
                let that = this;
                that.editDTDialog.isShow = true;
                that.editDTDialog.dt = JSON.stringify(that.g6Editor.graph.save(), null, 4);
            },

            /**
             * 发布决策
             */
            handleCopyDT() {
                this.$emit("handleCopyDT");
            },

            /**
             * 处理搜索
             **/
            handleSearch(_searchWord){
                function isSearch(_node, _search){
                    if (isEmpty(_search)){
                        return false;
                    }

                    let str = JSON.stringify(_node.nData);
                    // nDate 里面包含
                    let b1 = str.toLowerCase().includes(_search.toLowerCase());
                    // 前端显示的一些字段里面包含
                    let b2 =
                        (isNotEmpty(_node.code) &&  _node.code.toLowerCase().includes(_search.toLowerCase())) ||
                        (isNotEmpty(_node.description) &&  _node.description.toLowerCase().includes(_search.toLowerCase())) ||
                        (isNotEmpty(_node.label) &&  _node.label.toLowerCase().includes(_search.toLowerCase()));
                    return b1 || b2;
                }


                let graph = this.g6Editor.graph;
                graph.getNodes().forEach(node => {
                    graph.setItemState(node, g6Enum.SEARCH_TYPE.code, isSearch(node.getModel(), _searchWord));
                });
            },

            /**
             * 流程图保存
             */
            handleSave() {
                this.$emit("handleSave")
            },

            /**
             * 显示测试框
             */
            handleDebugBefore() {
                this.$emit("handleDebugBefore", this.debugDialog);
            },

            /**
             * 进行测试
             */
            handleDebugAfter() {
                this.$emit("handleDebugAfter", this.debugDialog);
            },

            editDTAfterClick() {
                let that = this;
                let decisionTree = JSON.parse(this.editDTDialog.dt);
                that.$bus.$emit(g6Enum.DECISION_TREE_CHANGE.code + this.pageId, decisionTree);
                that.editDTDialog.isShow = false;
            },
            widthChange(movement) {

                this.detailwidth -= movement;
                if (this.detailwidth < 300) {
                    this.detailwidth = 300;
                    // this.$message({message: "已经是最小宽度了，若想隐藏，尝试双击吧~", type: "error"})
                }
                if (this.detailwidth > 1000) {
                    this.detailwidth = 1000;
                }
            },
            toggleHandler (data) {

                const _t = this
                eventBus.$emit('editor/panel/toggle', data)
            },
            watchBoxShow(val){

                this.isBoxShow = val;
                // if(this.isBoxShow){
                //     this.drawerOpened();
                // }else{
                //     this.drawerClose();
                // }
            }
        }


    }
</script>

<style scoped>
    .editor {
        position: relative;
        width: 100%;
        /*user-select: none;*/
        /*-moz-user-select: none;*/
        /*-webkit-user-select: none;*/
        /*-ms-user-select: none;*/

        /*background-color: #c5e6cf;*/
    }

    .bottom-container {
        position: relative;
    }
</style>
