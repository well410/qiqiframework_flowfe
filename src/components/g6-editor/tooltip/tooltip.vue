<template>
    <div :style="`position: fixed;left: ${computeX};top: ${computeY};z-index:100;`" class="tooltip-main">
        <el-card>
            <template v-if="isNotEmpty(pNode.nData)">
                <tooltip-node :p-node="pNode"></tooltip-node>
                <tooltip-arr-inf v-show="pNode.nData.compType === compEnums.Arr.code" :p-node="pNode"></tooltip-arr-inf>
                <tooltip-cmpt-node v-show="pNode.nData.compType === compEnums.Cmpt.code" :p-node="pNode"></tooltip-cmpt-node>
                <tooltip-const-inf v-show="pNode.nData.compType === compEnums.Const.code" :p-node="pNode"></tooltip-const-inf>
                <tooltip-dr-inf v-show="pNode.nData.compType === compEnums.DR.code" :p-node="pNode"></tooltip-dr-inf>
                <tooltip-evstore-inf v-show="pNode.nData.compType === compEnums.EVStore.code" :p-node="pNode"></tooltip-evstore-inf>
                <tooltip-obj-inf v-show="pNode.nData.compType === compEnums.Obj.code" :p-node="pNode"></tooltip-obj-inf>
                <tooltip-rr-inf v-show="pNode.nData.compType === compEnums.RR.code" :p-node="pNode"></tooltip-rr-inf>
                <tooltip-ur-inf v-show="pNode.nData.compType === compEnums.UR.code" :p-node="pNode"></tooltip-ur-inf>
                <tooltip-vars-inf v-show="pNode.nData.compType === compEnums.VarsV2.code" :p-node="pNode"></tooltip-vars-inf>
                <tooltip-comp-inf v-show="pNode.nData.compType === compEnums.CompVars.code" :p-node="pNode"></tooltip-comp-inf>
            </template>
        </el-card>
    </div>
</template>

<script>
    import {isEmpty} from "../../../utils";
    import NodeInf from "../../common/node-inf";
    import TooltipNode from "../../tooltip-inf/tooltip-node";
    import {compEnums} from "../../../entity/enumns";
    import TooltipArrInf from "../../tooltip-inf/tooltip-arr-inf";
    import TooltipCmptNode from "../../tooltip-inf/tooltip-cmpt-inf";
    import TooltipConstInf from "../../tooltip-inf/tooltip-const-inf";
    import TooltipDrInf from "../../tooltip-inf/tooltip-dr-inf";
    import TooltipErInf from "../../tooltip-inf/tooltip-er-inf";
    import TooltipEvstoreInf from "../../tooltip-inf/tooltip-evstore-inf";
    import TooltipObjInf from "../../tooltip-inf/tooltip-obj-inf";
    import TooltipRrInf from "../../tooltip-inf/tooltip-rr-inf";
    import TooltipUrInf from "../../tooltip-inf/tooltip-ur-inf";
    import TooltipVarsInf from "../../tooltip-inf/tooltip-vars-inf";
    import TooltipCompInf from "../../tooltip-inf/tooltip-comp-inf";

    export default {
        name: "tooltip",
        components: {
            TooltipCompInf,
            TooltipVarsInf,
            TooltipUrInf,
            TooltipRrInf,
            TooltipObjInf,
            TooltipEvstoreInf,
            TooltipErInf, TooltipDrInf, TooltipConstInf, TooltipCmptNode, TooltipArrInf, TooltipNode, NodeInf},
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {}
            },
            // 传入的位置
            pPoint: {
                type: Object, default: () => {},
            }
        },
        computed: {
            computeX() {
                if (isEmpty(this.pPoint)) {
                    return 0;
                } else {
                    return this.pPoint.x +  "px";
                }
            },

            computeY() {
                if (isEmpty(this.pPoint)) {
                    return 0;
                } else {
                    return this.pPoint.y + 50 + "px";
                }
            }
        },

        data() {
            return {
                compEnums : compEnums
            }
        }
    }
</script>

<style scoped>
.tooltip-main{
    width: 500px;
}
</style>
