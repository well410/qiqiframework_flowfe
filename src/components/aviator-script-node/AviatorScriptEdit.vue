<template>
    <div id="aviator-script-edit">
        <node-inf :node="node" :disabled="disabled"></node-inf>
        <el-card style="padding-top: 15px">
            <aviator-script-codemirror :p-as-var="cAsVar" :disabled="disabled" :p-var-list="computeASVarList"></aviator-script-codemirror>
        </el-card>
    </div>
</template>

<script>
    import NodeInf from "../common/node-inf";
    import AviatorScriptCodemirror from "../aviator-script-codemirror/aviator-script-codemirror";
    import resizeForDrawer from "../mixins/resizeForDrawer"
    import {dataTypeEnums} from "../../entity/enumns";
    import {ASVar} from "../../entity/vars";
    import {G6Model} from "../../entity/g6Model";

    export default {
        name: "AviatorScriptEdit",
        mixins: [resizeForDrawer],
        components: {AviatorScriptCodemirror, NodeInf},
        props: {
            decisionTree: Object,
            node: {default: () => {}, type: Object},
            aviatorScriptInputVarList: {default: () => [], type: Array},
            disabled: {default: false, type: Boolean},
        },
        data(){
            return {
                dataTypeEnums : dataTypeEnums,
                cAsVar : new ASVar(),
                relVar: {
                    totalVarList: [],
                    aviatorScriptInputVarList: [],
                },
            }
        },

        watch: {
            cAsVar: {
                handler(value) {
                    this.node.nData.asVar = value;
                },
                deep: true
            }
        },

        computed:{
            // 数据类型为数组的字段
            computeASVarList() {
                let result = [];
                result.push(...this.relVar.totalVarList);
                result.push(...this.relVar.aviatorScriptInputVarList);
                return result
            },
        },

        methods: {
            init() {
                let that = this;
                // 如果是空，
                if (that.isEmpty(that.node.nData.asVar)){
                    that.cAsVar = new ASVar();
                } else {
                    that.cAsVar = ASVar.obj2ASVar(that.node.nData.asVar)
                }

                that.relVar.totalVarList = G6Model.getTotalVarsOfParents(this.node, this.decisionTree);
                that.relVar.aviatorScriptInputVarList = that.aviatorScriptInputVarList;
            }
        }
    }
</script>

<style scoped>

    #aviator-script-edit {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
</style>
