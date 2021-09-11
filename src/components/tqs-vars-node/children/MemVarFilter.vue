<template>
    <!--返回结果过滤-->
    <div id="var-rdv-filter-v2" style="display: flex; justify-content:center">
        <el-transfer
                style="text-align: left; display: inline-block"
                v-model="selectData"
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

    import {getTqsDsById} from "../../../api/TqsDatasource";
    import {isNotEmpty} from "../../../utils";
    import {TqsMemVal} from "../../../entity/vars";

    export default {
        name: "MemVarFilter",
        props: {
            node: Object,
            sDecs: {
                default: () => {
                }, type: Object
            },
            pTqsDatasource: {default: () => {}, type: Object},
        },
        data() {
            return {
                memVarList:[],
                transferData: [],
                selectData: [],
            }
        },

        watch:{
            memVarList: {
                handler(value) {
                    let that = this;
                    that.transferData = value.map(item => {
                        return {
                            key: item.varName,
                            label: item.varName + '[' + item.varDesc + ']' + '[' + item.varType + ']'
                        }
                    });
                },
                deep: true
            }
        },

        methods: {
            init() {
                let that = this;
                if(isNotEmpty(that.pTqsDatasource.datasourceId)){
                    getTqsDsById({prodId: this.gConfig.prodId.value, datasourceId: that.pTqsDatasource.datasourceId}).then(res=>{
                        if(isNotEmpty(res.data.data)){
                            that.memVarList = that.map2ListOfMemVar(JSON.parse(res.data.data.memVars));
                        }
                    })
                }
            },
            map2ListOfMemVar(obj) {
                let result = [];
                for (let key in obj) {
                    let item = {
                        varName: key,
                        varDesc: obj[key].split("-")[0],
                        varType: obj[key].split("-")[1],
                        memVarId: this.sDecs.decsId + "_" + this.node.nData.uniqueName,
                    };
                    result.push(new TqsMemVal(item));
                }
                return result;
            },

            resultOfFilter() {
                return this.memVarList.filter(item => this.selectData.includes(item.varName))
            }
        }
    }
</script>

<style scoped>

</style>
