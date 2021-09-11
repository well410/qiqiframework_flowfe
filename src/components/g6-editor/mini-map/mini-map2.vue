<template>
  <div id="navigator">
    <div class="pannel-title">缩略图</div>
    <div id="miniMap2" class="miniMap2" ref="miniMap2"></div>
    <!-- <div id="zoom-slider">
      <a class="zoom-dropdown-btn ant-dropdown-trigger" href="#">
        100 %
        <i class="anticon anticon-down"></i>
      </a>
    </div> -->
  </div>
</template>

<script>
import Minimap from "@antv/g6/lib/plugins/minimap";
import eventBus from "@/utils/eventBus";
export default {
  data() {
    return {
      miniMap2: null,
      graph: null
    };
  },
  created() {
    this.bindEvent();
  },
  mounted() {
    this.$nextTick(() => {
      this.initMinMap();
    });
  },
  methods: {
    initMinMap() {
      const cfgs = {
        container: "miniMap2"
      };
      this.miniMap2 = new Minimap({ ...cfgs });
    },
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.graph = page.graph;
        this.bindPage();
      });
    },
    bindPage() {
      if (!this.miniMap2 || !this.graph) {
        return;
      }
     this.graph.addPlugin(this.miniMap2)
    }
  }
};
</script>

<style scoped>
#navigator {
  width: 200px;
  /* height: 176px; */
  background: #f7f9fb;
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 2;
}

.pannel-title {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #303133;
  line-height: 28px;
  padding-left: 12px;
}
</style>
