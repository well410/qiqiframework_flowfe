<template>
    <!--工具箱-->
    <div class="toolbar">
        <i
                class="el-icon-rank command"
                :style="computeStyle('select')"
                title="选择"
                @click="handleSelect"
        ></i>
        <i
                class="el-icon-bottom-right command"
                title="连线"
                :style="computeStyle('linkEdge')"
                @click="handleLinkEdge"
        ></i>
        <span class="separator"></span>

        <i
                class="command iconfont icon-undo"
                title="撤销"
                :class="(g6Editor != null && g6Editor.undoStack.length > 0) ? '' : 'disable'"
                @click="handleUndo"
        ></i>
        <i
                class="command iconfont icon-redo"
                title="重做"
                :class="(g6Editor != null && g6Editor.redoStack.length > 0) ? '' : 'disable'"
                @click="handleRedo"
        ></i>

        <span class="separator"></span>
        <i
                data-command="delete"
                class="command iconfont icon-delete-o"
                title="删除"
                :class="itemSelect? null:'disable' "
                @click="handleDelete"
        ></i>
        <i
                data-command="autoZoom"
                class="command iconfont icon-fit"
                title="适应画布"
                @click="handleAutoZoom"
        ></i>

        <i
                class="el-icon-folder-opened command"
                title="展开或关闭容器"
                @click="handleCollapseExpandCombo"
        ></i>

        <span class="separator"></span>
        <i
                class="el-icon-document-checked command"
                title="保存"
                @click="handleSave"
        ></i>
        <i
                class="el-icon-video-play command"
                title="测试"
                @click="handleDebug"
                v-if="!removeList.includes('测试')"
        ></i>
        <i
                class="el-icon-circle-check command"
                title="验证"
                @click="handleCheck"
                v-if="!removeList.includes('验证')"
        ></i>
        <i
                class="el-icon-upload command"
                title="发布版本"
                @click="handlePublish"
                v-if="!removeList.includes('发布版本')"
        ></i>
        <i
                class="el-icon-edit command"
                title="更换决策图"
                @click="handleEditDT"
        ></i>
        <i
                class="el-icon-document-copy command"
                title="拷贝版本表决策图"
                @click="handleCopyDT"
        ></i>
        <span class="separator"></span>
        <el-input
                style="width: 220px;margin-left: 5px"
                size="mini"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                @input="handleSearch"
                v-model="searchWords">
        </el-input>
    </div>
</template>

<script>

    import {G6Editor, g6Enum} from "../entity/entity";
    import {isEmpty, isNotEmpty} from "../../../utils";

    export default {
        name: "tool-bar",
        props: {
            g6Editor: G6Editor,
            pageId: {type: String, default: "graph-container"},
            removeList:{type:Array, default:()=>[]}
        },
        data() {
            return {
                itemSelect: null,
                interval: null,
                searchWords: ""
            };
        },

        computed: {
            computeStyle() {
                return (type) => {
                    if (!this.g6Editor) return "";
                    switch (type) {
                        case "select":
                            return (this.g6Editor.graph.getCurrentMode() === "default") ? {color: '#409EFF'} : {color: ''};
                        case "linkEdge":
                            return (this.g6Editor.graph.getCurrentMode() === "linkEdge") ? {color: '#409EFF'} : {color: ''};
                        default:
                            throw new Error(`computeStyle未知类型: ${type}`)
                    }
                }
            }
        },

        destroyed() {
            this.unBandEvents();
        },

        mounted() {
            this.bandEvents();
        },

        methods: {
            // 解绑事件
            unBandEvents() {
                clearInterval(this.interval)
            },


            // 绑定事件
            bandEvents() {
                let that = this;

                that.$bus.$on(g6Enum.ITEM_SELECT.code, data => {
                    that.itemSelect = data;
                });

                // 绑定定时任务
                that.$nextTick(() => {
                    // 仅编辑时进行监听
                    if (that.pageId !== "graph-container")  return;
                    that.interval = setInterval(() => {
                        let graphData = that.g6Editor.graph.save();
                        // 如果当前元素和回退栈栈顶不相同，则入栈
                        let undoList = that.g6Editor.undoStack.toArray().map(item => JSON.stringify(item));
                        let redoList = that.g6Editor.redoStack.toArray().map(item => JSON.stringify(item));

                        // console.log("undoList size: redoList size:", undoList.length, redoList.length);

                        redoList.push(...undoList);
                        if (!redoList.includes(JSON.stringify(graphData))) {
                            that.refreshNode(JSON.stringify(that.g6Editor.undoStack.peek()), JSON.stringify(graphData));

                            that.g6Editor.undoStack.push(JSON.parse(JSON.stringify(graphData)));
                            that.g6Editor.redoStack.clear();
                        }
                    }, 500)
                });
            },

            /**
             * 刷新节点
             * 1. 节点名进行了修改
             * 2. 连线类型进行了修改
             * @param preDt
             * @param curDt
             */
            refreshNode(preDt, curDt){
                try {
                    let that = this;
                    if (isNotEmpty(preDt) && isNotEmpty(curDt) && preDt !== "null" && curDt !== "null") {
                        const uuidList = [];
                        JSON.parse(curDt).nodes.forEach(curItem => {
                            JSON.parse(preDt).nodes.forEach(preItem => {
                                if (curItem.id === preItem.id) {
                                    let nameBoolean = (curItem.name !== preItem.name);
                                    let descBoolean = (curItem.description !== preItem.description);
                                    if (nameBoolean || descBoolean) {
                                        uuidList.push(curItem.id);
                                    }
                                }
                            });
                        });

                        that.g6Editor.graph.getNodes().forEach(node => {
                            if (uuidList.includes(node.getModel().id)) {
                                that.g6Editor.graph.refreshItem(node);
                            }
                        });
                    }
                } catch (e) {
                    console.warn(e)
                }
            },

            // 回退
            handleUndo() {
                // 回退时，回退栈出栈，然后入前进栈
                let that = this;
                if (that.g6Editor.undoStack.length <= 0) return;
                let currData = that.g6Editor.graph.save();
                let graphData = that.g6Editor.undoStack.pop();
                that.g6Editor.redoStack.push(JSON.parse(JSON.stringify(graphData)));
                that.g6Editor.graph.clear();
                that.g6Editor.graph.read(JSON.parse(JSON.stringify(graphData)));


                if (JSON.stringify(currData) === JSON.stringify(graphData)) {
                    this.handleUndo();
                }
            },

            // 前进
            handleRedo() {
                // 前进时，前进栈出栈，然后入回退栈
                let that = this;
                if (that.g6Editor.redoStack.length <= 0) return;
                let currData = that.g6Editor.graph.save();
                let graphData = that.g6Editor.redoStack.pop();
                that.g6Editor.undoStack.push(JSON.parse(JSON.stringify(graphData)));
                that.g6Editor.graph.clear();
                that.g6Editor.graph.read(JSON.parse(JSON.stringify(graphData)));

                if (JSON.stringify(currData) === JSON.stringify(graphData)) {
                    this.handleRedo();
                }
            },


            // 展开或收缩决策
            handleCollapseExpandCombo(){
                let that = this;
                that.g6Editor.graph.getCombos().forEach(item=>{
                    that.g6Editor.graph.collapseExpandCombo(item.getModel().id);
                })
            },

            // 验证
            handleCheck() {
                this.$emit("handleCheck");
            },

            handleSearch(){
                this.$emit("handleSearch", this.searchWords);
            },

            // 编辑决策图
            handleEditDT() {
                this.$emit("handleEditDT");
            },

            handleCopyDT(){
                this.$emit("handleCopyDT");
            },

            // 发布版本
            handlePublish() {
                this.$emit("handlePublish");
            },

            // 测试决策
            handleDebug() {
                this.$emit("handleDebug");
            },

            // 保存决策图
            handleSave() {
                this.$emit("handleSave");
            },

            // 更换连线模式
            handleLinkEdge() {
                this.g6Editor.graph.setMode("linkEdge")
            },

            // 更换选择模式（默认模式）
            handleSelect() {
                this.g6Editor.graph.setMode("default")
            },

            // 删除
            handleDelete() {
                this.g6Editor.graph.removeItem(this.itemSelect);
                this.itemSelect = null;
            },

            // 适应画布
            handleAutoZoom() {
                this.g6Editor.graph.fitView(20);
            },
        }
    }
</script>

<style scoped>
    .toolbar {
        box-sizing: border-box;
        padding: 8px 0px;
        width: 100%;
        border: 1px solid #e9e9e9;
        height: 42px;
        z-index: 1;
        box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
        position: absolute;
    }

    .toolbar .command:nth-of-type(1) {
        margin-left: 24px;
    }

    .toolbar .command {
        box-sizing: border-box;
        width: 27px;
        height: 27px;
        margin: 0px 6px;
        border-radius: 2px;
        padding-left: 4px;
        display: inline-block;
        border: 1px solid rgba(2, 2, 2, 0);
    }

    .toolbar .command:hover {
        cursor: pointer;
        border: 1px solid #e9e9e9;
    }

    .toolbar .disable {
        color: rgba(0, 0, 0, 0.25);
    }

    .toolbar .separator {
        margin: 4px;
        border-left: 1px solid #e9e9e9;
    }


    @font-face {
        font-family: "iconfont";
        src: url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.eot?t=1522149591264'); /* IE9*/
        src: url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.eot?t=1522149591264#iefix') format('embedded-opentype'), /* IE6-IE8 */ url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
        url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.ttf?t=1522149591264') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/ url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.svg?t=1522149591264#iconfont') format('svg'); /* iOS 4.1- */
    }

    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-cut:before {
        content: "\e8a2";
    }

    .icon-actual-size-o:before {
        content: "\e8a3";
    }

    .icon-copy-o:before {
        content: "\e8a4";
    }

    .icon-delete-o:before {
        content: "\e8a5";
    }

    .icon-fit:before {
        content: "\e8a6";
    }

    .icon-select:before {
        content: "\e8a7";
    }

    .icon-paster-o:before {
        content: "\e8a8";
    }

    .icon-redo:before {
        content: "\e8a9";
    }

    .icon-to-front:before {
        content: "\e8aa";
    }

    .icon-undo:before {
        content: "\e8ab";
    }

    .icon-zoom-in-o:before {
        content: "\e8ac";
    }

    .icon-ungroup:before {
        content: "\e8ad";
    }

    .icon-zoom-out-o:before {
        content: "\e8ae";
    }

    .icon-group:before {
        content: "\e8af";
    }

    .icon-to-back:before {
        content: "\e8b0";
    }

</style>
