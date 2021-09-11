export default {

    mounted() {
        this.$_reSize();
        this.$_initResizeEvent();
        console.log("mounted")
    },
    beforeDestroy() {
        this.$_destroyResizeEvent();
        console.log("beforeDestroy")
    },
    // to fixed bug when cached by keep-alive
    // https://github.com/PanJiaChen/vue-element-admin/issues/2116
    activated() {
        this.$_initResizeEvent();
        console.log("activated")
    },
    deactivated() {
        this.$_destroyResizeEvent();
        console.log("deactivated")
    },
    methods: {
        $_reSize() {
            // 设置高度和超过高度隐藏
            this.$el.style.height = (window.innerHeight - 150) + "px";
            this.$el.style.overflow = 'auto';
            console.log(`${this.$el.id}高度:${this.$el.style.height}`)
        },

        $_initResizeEvent() {
            window.addEventListener('resize', this.$_reSize)
        },

        $_destroyResizeEvent() {
            window.removeEventListener('resize', this.$_reSize)
        },
    }
}
