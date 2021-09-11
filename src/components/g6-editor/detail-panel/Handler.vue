<style scoped lang="less" rel="stylesheet/less">
  .handler {
    display: inline-block;
    position: absolute;
    background: #e9edf1;
    border: 1px solid #dddddd;
    overflow: hidden;
    transition: all .2s ease-in .1s;
    /*cursor: pointer;*/
    cursor: w-resize;

    &:hover {
      background: #dddddd;
    }

    &.horizontal {
      width: 20px;
      height: 20px;
      line-height: 20px;
      left: 50%;
      margin-left: -10px;
    }
    &.vertical {
      width: 3px;
      height: 100%;
      line-height: 20px;
      top: 11px;
      margin-top: -10px;
    }

    &.top {
      /*top: -11px;*/
      border-bottom: none;
      /*border-radius: 20px 20px 0 0;*/
      box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.1);
    }
    &.right {
      right: -11px;
      border-left: none;
      /*border-radius: 0 20px 20px 0;*/
      box-shadow: 2px 0 2px 0 rgba(0, 0, 0, 0.1);
    }
    &.bottom {
      bottom: -11px;
      border-top: none;
      /*border-radius: 0 0 20px 20px;*/
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
    }
    &.left {
      left: -3px;
      border-right: none;
      /*border-radius: 20px 0 0 20px;*/
      box-shadow: -2px 0 2px 0 rgba(0, 0, 0, 0.1);
    }

    &.expand {
      &.top {
        margin-top: 0;
      }
      &.right {
        margin-right: 0;
      }
      &.bottom {
        margin-bottom: 0;
      }
      &.left {
        margin-left: 0;
      }
    }
  }

</style>

<template>
  <div id="handler-content" :class="className" @dblclick="toggleHandler" @mousedown.prevent="mouseDown" v-if="expand" style="left: -20px;width: 20px">
<!--  <div :class="className" @dblclick="toggleHandler" v-if="expand" style="left: -20px;width: 20px">-->
    <div style="height: 100%;">
      <svg-icon icon-class="box_resize" style="height: 100%;color:#909399"/>
    </div>
  </div>
  <div :class="className" @dblclick="toggleHandler" v-else style="left: -20px;width: 20px">
    <div style="height: 100%;">
      <svg-icon icon-class="box_open" style="height: 100%; color:#909399"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Handler',
    props: {
      // 模式
      mode: {
        type: String,
        validator (value) {
          return ['horizontal', 'vertical'].includes(value)
        },
        default: 'vertical'
      },
      // 相对目标元素位置关系
      position: {
        type: String,
        validator (value) {
          return ['top', 'right', 'bottom', 'left'].includes(value)
        },
        default: 'right'
      },
      // 是否展开
      expand: {
        type: Boolean,
        default: true
      },
      // 回调
      callback: {
        type: Function
      },
      width: {
        type: Number,
        default: 800
      },
    },
    data() {
      return {
        lastX: "",
        haseMouseMove:false
      };
    },
    mounted() {
      document.addEventListener("mouseup", this.mouseUp)
    },
    destroyed() {
      document.removeEventListener("mouseup", this.mouseUp);
    },
    computed: {
      className: function () {
        const _t = this
        return ['handler', _t.mode, _t.position, _t.expand]
      }
    },
    methods: {
      // 切换handler显示/隐藏
      toggleHandler: function () {
        const _t = this
        if (_t.callback) {
          _t.callback()
        }
      },
      mouseDown(event) {
        document.addEventListener("mousemove", this.mouseMove, false);
        this.lastX = event.screenX;
      },
      mouseMove(event) {
        this.expand = true;
        this.$emit("widthChange", event.screenX-this.lastX);
        this.lastX = event.screenX;
        // console.log(this.lastX, "...", event.screenX);
        this.hasMouseMove = true;
      },
      mouseUp() {
        this.lastX = "";
        // document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mousemove", this.mouseMove, false);
        if(this.width==1000&&this.hasMouseMove){
          this.$message({message: "已经是最大宽度了~", type: "waring"})
        }else if(this.width==300&&this.hasMouseMove){
          this.$message({message: "已经是最小宽度了，若想隐藏，尝试双击吧~", type: "waring"})
        }
        // if(this.expand&&!this.hasMouseMove){
        //   this.$emit("afterEnter");
        // }else if(this.expand&&!this.hasMouseMove){
        //   this.$emit("afterLeave");
        // }
        this.hasMouseMove = false;
      }
    }
  }
</script>
