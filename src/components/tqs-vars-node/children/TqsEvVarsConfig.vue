<template>
    <div id="TqsEvVarsConfig" style="height: 400px">
        <el-scrollbar class="verticalScroll" style="height: 360px">
            <vue-json-pretty
                    :data="json"
                    :path="path"
                    :show-double-quotes="showDoubleQuotes"
                    :highlight-mouseover-node="highlightMouseoverNode"
                    :highlight-selected-node="highlightSelectedNode"
                    :show-length="showLength"
                    :show-line="showLine"
                    :select-on-click-node="selectOnClickNode"
                    v-model="selectRelVarList"
                    :path-checked="selectRelVarList"
                    :selectable-type="selectableType"
                    :show-select-controller="showSelectController"
                    @change="handleChange"/>
        </el-scrollbar>
        <div style="float: right; margin-top: 15px;margin-bottom: 5px">
            <el-button size="mini" @click="cancelEdit">取消</el-button>
            <el-button size="mini" type="success" @click="saveEdit">保存</el-button>
        </div>
    </div>
</template>

<script>

    import VueJsonPretty from 'vue-json-pretty'
    import * as ElementUI from "element-ui";

    export default {
        name: "TqsEvVarsConfig",
        components: {
            VueJsonPretty
        },
        props: {
            selectedList: {default: () => [], type: Array},
            formateMap: {default: () => {}, type: Object},
        },
        data() {
            return {
                //vue-json-pretty config
                path: '',
                selectableType: 'multiple',
                showSelectController: true,
                showLength: true,
                showLine: true,
                showDoubleQuotes: true,
                highlightMouseoverNode: true,
                highlightSelectedNode: true,
                selectOnClickNode: true,

                cache : {},
                selectRelVarList:[],
            }
        },
        computed: {
            json () {
                try {
                    let that = this;
                    that.selectRelVarList = JSON.parse(JSON.stringify(that.selectedList));
                    that.cache = JSON.parse(JSON.stringify(that.formateMap));
                    return that.cache
                } catch (err) {
                    return this.cache || {};
                }
            }
        },
        methods: {
            /**
             * 初始化
             * */
            init(){
            },

            /**
             * 取消选择
             * */
            cancelEdit(){
                this.$emit('evEditVisible', {isValidate: false, selectedList: this.selectRelVarList});
            },
            /**
             * 保存选择
             * */
            saveEdit(){
              this.$emit('evEditVisible', {isValidate: true, selectedList: this.selectRelVarList});
            },

            /**
             * 获取事件变量来源
             * */
            handleChange (newVal, oldVal) {
                if(newVal.length < 1){
                    ElementUI.Message({message: "请选择变量~", type: 'warn'});
                    return;
                }

                let rootContainArray = newVal.filter(item => item.length <= 1);
                if(rootContainArray.length > 0){
                    ElementUI.Message({message: "请选择非源节点!", type: 'error'});
                }
            },
        },
    }
</script>

<style scoped>
</style>
