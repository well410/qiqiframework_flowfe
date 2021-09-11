<template>
  <div class="detailpannel"  :style="boxStyle">
    <Handler
            class="handler"
            :mode="mode"
            :position="position"
            :expand="isExpand"
            :callback="toggleHandler"
            :width="width"
            @widthChange="widthChange"
    ></Handler>
    <div class="">
      <div v-if="status=='node-selected'" class="pannel" id="node_detailpannel">
        <div class="pannel-title">模型详情</div>
        <div class="block-container">
          <el-row :gutter="10">
            <el-col :span="8">名称</el-col>
            <el-col :span="16">
              <el-input v-model="node.label" @change="handleChangeName" />
            </el-col>
            <el-col :span="8">任意属性</el-col>
            <el-col :span="16">
              <el-input v-model="node.xxx" />
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="status==='canvas-selected'" class="pannel" id="canvas_detailpannel">
<!--        <div class="pannel-title">节点配置详情</div>-->
        <div><slot></slot></div>


<!--        <div class="block-container">-->
<!--          <el-checkbox v-model="showGrid" @change="changeGridState">网格对齐</el-checkbox>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import Grid from "@antv/g6/lib/plugins/grid";
import Handler from './Handler'
export default {
  name:"DetailPanel",
  components: {
    Handler
  },
  props: {
    width: {
      type: Number,
      default: 800
    },
    // 显示位置
    placement: {
      type: String,
      default: 'right'
    },
    // handler 模式
    mode: {
      type: String,
      validator (value) {
        return ['horizontal', 'vertical'].includes(value)
      },
      default: 'vertical'
    },
    // handler 相对目标元素位置关系
    position: {
      type: String,
      validator (value) {
        return ['top', 'right', 'bottom', 'left'].includes(value)
      },
      default: 'right',
    },
    isBoxShow:false,
    // isExpand:false
  },
  data() {
    return {
      status: "canvas-selected",
      showGrid: false,
      page: {},
      graph: {},
      item: {},
      node: {},
      grid: null,
      isExpand: false,
      rendered: false
    };
  },
  created() {
    this.init();
    this.bindEvent();
  },
  mounted() {
    // this.afterEnter();
  },
  computed: {
    boxStyle () {
      const _t = this
      const style = {}
      if (_t.placement) {
        style[_t.placement] = 0
      }
      if (_t.width) {
        style.width = _t.width + 'px'
      }
      // 处理展开
      if (_t.isExpand) {
        style[_t.placement] = 0

      } else {
        style[_t.placement] = (-_t.width) + 'px'

      }
      _t.$emit('expand', {
        name: _t.placement,
        isExpand: _t.isExpand,
        style: style
      })
      return style
    },
  },
  watch: {
    isBoxShow: {
      handler(value) {
        this.isExpand = value;
        // if(value){
        //   this.isExpand = true;
        // }
      }
    },
  },
  methods: {
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('closed');
    },
    init() {},
    bindEvent() {
      let self = this;
      eventBus.$on("afterAddPage", page => {
        self.page = page;
        self.graph = self.page.graph;
        eventBus.$on("nodeselectchange", item => {
          if (item.select === true && item.target.getType() === "node") {
            self.status = "node-selected";
            self.item = item.target;
            self.node = item.target.getModel();
          } else {
            self.status = "canvas-selected";
            self.item = null;
            self.node = null;
          }
        });
      });
    },
    handleChangeName(e) {
      const model = {
        label: e
      };

      this.graph.update(this.item, model);
    },
    changeGridState(value) {
      if (value) {
        this.grid = new Grid();
        this.graph.addPlugin(this.grid);
      } else {
        this.graph.removePlugin(this.grid);
      }
    },
    toggleHandler (val) {
      const _t = this
      _t.isExpand = val !== undefined ? val : !_t.isExpand
      this.$emit("watchBoxShow", _t.isExpand);
      console.log(_t.isExpand)
    },
    widthChange(val){
      this.$emit("widthChange", val);
    }
  }
};
</script>

<style scoped>
.detailpannel {
  height: 100%;
  position: absolute;
  right: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  border-left: 1px solid #e6e9ed;
}
.detailpannel .block-container {
  padding: 16px 8px;
}
.block-container .el-col {
  height: 28px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.pannel-title {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #000;
  line-height: 28px;
  padding-left: 12px;
}
</style>
