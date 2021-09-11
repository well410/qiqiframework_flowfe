<template>
    <!--返回结果过滤-->
    <div id="var-rdv-filter-v2" style="display: flex; justify-content:center">
        <el-transfer
                style="text-align: left; display: inline-block"
                v-model="rdvListOfKey"
                filterable
                target-order="push"
                ref="transfer"
                :titles="['筛选前', '筛选后']"
                :data="transferData">
            <template slot-scope="{ option }">
                <span :title="option.label">{{ option.label }}</span>
            </template>
        </el-transfer>
    </div>
</template>

<script>
    import {pathParse} from "../../../api/Utils";
    import {RedisVal} from "../../../entity/vars";

    export default {
        name: "VarRdvFilterV2",
        props: {
            pVarConfig: Object
        },
        data() {
            return {
                transferData: [],
                rdvListOfKey: [],
                rdvList:[]
            }
        },

        methods: {
            init() {
                let that = this;
                pathParse({analysisJson: that.pVarConfig['varBase'].queryDimensionVal}).then(res => {
                    that.rdvList = res.data.data.map(item => {
                        return new RedisVal({
                            varName: item['path'],
                            varDesc: item['description'].split("-")[0],
                            varType: item['description'].split("-")[1],
                            varsId: that.pVarConfig['varBase'].varsId
                        })
                    });
                    that.transferData = that.rdvList.map(item => {
                        return {
                            key: item.getPrefixVarName(),
                            label: `${item.getPrefixVarName()}-${item.getSimpleDesc()}`
                        }
                    });

                    that.rdvListOfKey = that.pVarConfig.rdvList.map(item => RedisVal.obj2RedisVal(item).getPrefixVarName())
                })
            },

            resultOfFilter(){
                return this.rdvList.filter(item=> this.rdvListOfKey.includes(item.getPrefixVarName()))
            }
        }
    }
</script>

<style scoped>

</style>
