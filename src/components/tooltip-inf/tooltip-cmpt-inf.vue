<template>
    <div>
        <el-form ref="form1" size="mini" label-width="80px" v-if="isNotEmpty(computeCmpt.cmptId)">
            <el-form-item label="组件id">{{computeCmpt.cmptId}}</el-form-item>
            <el-form-item label="组件名">{{computeCmpt.cmptName}}</el-form-item>
            <!--<el-form-item label="组件状态">{{isNotEmpty(statusEnums[computeCmpt.status]) ? statusEnums[computeCmpt.status].name : computeCmpt.status}}</el-form-item>-->
            <el-form-item label="组件版本" v-if="isNotEmpty(computeCmpt.cmptVersion)">{{computeCmpt.cmptVersion}}</el-form-item>
            <el-form-item label="接入类型" prop="inteType">{{isNotEmpty(inteTypeEnums[computeCmpt.inteType]) ? inteTypeEnums[computeCmpt.inteType].name : computeCmpt.inteType}}</el-form-item>

            <!--<template v-if="computeCmpt.inteType === 'H'">-->
                <!--<el-form-item label="http地址">{{computeCmpt.inteConf.uri}}</el-form-item>-->
                <!--<el-form-item label="超时时间">{{computeCmpt.inteConf['readTimeOut']}}ms</el-form-item>-->
            <!--</template>-->

            <!--<template v-if="computeCmpt.inteType === 'K'">-->
                <!--<el-form-item label="集群地址">{{computeCmpt.inteConf.bootstrapServer}}</el-form-item>-->
                <!--<el-form-item label="topic">{{ computeCmpt.inteConf.bootstrapServer}}</el-form-item>-->
                <!--<el-form-item label="userName">{{ computeCmpt.inteConf.userName}}</el-form-item>-->
                <!--<el-form-item label="password">{{computeCmpt.inteConf.password}}</el-form-item>-->
            <!--</template>-->
        </el-form>
    </div>
</template>

<script>
    import CmptShow from "../cmpt-node/CmptShow";
    import {isNotEmpty} from "../../utils";
    import {inteTypeEnums, statusEnums} from "../../entity/enumns";

    export default {
        name: "tooltip-cmpt-node",
        components: {CmptShow},
        props: {
            // 传入的节点
            pNode: {
                type: Object, default: () => {
                }
            }
        },
        data() {
            return {
                statusEnums: statusEnums,
                inteTypeEnums: inteTypeEnums
            }
        },
        computed: {
            computeCmpt() {
                if (this.pNode.nData && isNotEmpty(this.pNode.nData.cmpt)) {
                    return this.pNode.nData.cmpt;
                } else {
                    return {}
                }
            }
        }
    }
</script>

<style scoped>

</style>
